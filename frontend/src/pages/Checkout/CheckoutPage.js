import React from 'react'
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createOrder } from '../../services/orderService';
import classes from './checkoutPage.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';
import Map from '../../components/Map/Map';

export default function CheckoutPage() {
    const { cart } = useCart(); // for loading the items from the cart
    const { user } = useAuth(); // assign those ^items to user
    const navigate = useNavigate(); // navigating user to payment page after submitting data from checkout page
    const [order, setOrder] = useState({ ...cart }); // store the order of items in the cart

    // form for getting user's data
    const { 
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();

    const submit = async data => { // form data
        if (!order.addressLatLng) { // if user didn't select an address on the map
            toast.warning('Please select your location on the map!');
            return;
        }

        // gets the order and user's name and address
        await createOrder({ ...order, name: data.name, address: data.address });
        navigate('/payment');
    };

  return (
    <>
        <form onSubmit={handleSubmit(submit)} className={classes.container}>
            <div className={classes.content}>
                <Title title='Order Form' fontSize='1.6rem' />
                <div className={classes.inputs}>
                    <Input
                        defaultValue={user.name}
                        label="Name"
                        {...register('name')}
                        error={errors.name}
                    />
                    <Input
                        defaultValue={user.address}
                        label="Address"
                        {...register('address')}
                        error={errors.address}
                    />
                </div>
                <OrderItemsList order={order} />
            </div>
            <div>
                <Title title ="Choose Your Location" fontSize='1.6rem' />
                <Map
                    location={order.addressLatLng} // sets location
                    onChange={latlng => { // get latlng outside map component
                        console.log(latlng);
                        setOrder({ ...order, addressLatLng: latlng }); // change order's address with new one
                    }}
                 />
            </div>

            <div className={classes.buttons_container}>
                <div className={classes.buttons}>
                    <Button
                        type="submit"
                        text="Go to Payment"
                        width="100%"
                        height="3rem"
                    />
                </div>
            </div>
        </form>
    </>
  )
}
