import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import React, { useEffect } from 'react'
import { useLoading } from '../../hooks/useLoading';
import { pay } from '../../services/orderService';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function PaypalButtons({ order }) {
  return (
    <PayPalScriptProvider
        options={{
            clientId:'AQsCjrnoS3Ek1DNXnUFZfkpbz77DJ2lVg1pjYz70U3g9StuFq9zA1wkUUEhHA7E5Y6FFpml-94-IMgoy'
        }}
    >
        <Buttons order={order} />

    </PayPalScriptProvider>
  )
}

function Buttons({ order }) {
    const { clearCart } = useCart(); // be sure to enter in useCart!
    const navigate = useNavigate();
    // makes sure the Paypal script is loaded or not
    const [{ isPending }] = usePayPalScriptReducer();
    const {showLoading, hideLoading} = useLoading();
    // if isPending is true, showLoading. Otherwise, hide loading.
    useEffect(() => {
        isPending? showLoading() : hideLoading();
    })

    // shows total price
    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: order.totalPrice,
                    },
                },
            ],
        });
    };
    
    const onApprove = async (data, actions) => {
        try {
            // gets payment from Paypal
            const payment = await actions.order.capture();
            const orderId = await pay(payment.id);
            clearCart();
            toast.success('Payment Saved Successfully!', 'Success');
            navigate('/track/' + orderId);
        }   catch (error) {
            toast.error('Payment Save Failed!', 'Error');
        }
    };

    const onError = err => {
        toast.error('Payment Failed!', 'Error');
    }

    return (
        <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
        />
    );
}