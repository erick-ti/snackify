import { useParams } from 'react-router-dom';
import classes from './foodEditPage.module.css';
import { useForm } from 'react-hook-form';
import Title from '../../components/Title/Title';
import InputContainer from '../../components/InputContainer/InputContainer';
import { useEffect, useState } from 'react';
import { add, getById, update } from '../../services/foodService';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { uploadImage } from '../../services/uploadService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function FoodEditPage() {
    const { foodId } = useParams();
    const [imageUrl, setImageUrl] = useState();
    // !! converts to boolean based on if there is value in foodId
    const isEditMode = !!foodId; // true if there is an Id, false otherwise

    const navigate = useNavigate();

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = useForm();

    // any time foodId changes, useEffect will be called
    useEffect(() => {
        // if foodId does not exist, don't load anything
        if(!isEditMode) return;

        getById(foodId).then(food => {
            if (!food) return;
            // reset the form with this food from server
            reset(food);
            setImageUrl(food.imageUrl);
        });
    }, [foodId]);

    const submit = async foodData => {
      const food = { ...foodData, imageUrl };
  
      if (isEditMode) {
        await update(food);
        toast.success(`Food "${food.name}" updated successfully!`);
        return;
      }

      const newFood = await add(food);
      toast.success(`Food "${food.name}" added successfully!`);
      navigate('/admin/editFood/' + newFood.id, { replace: true });
    };
    
    const upload = async event => {
      setImageUrl(null);
      const imageUrl = await uploadImage(event);
      setImageUrl(imageUrl);
    };

    return (
    <div className={classes.container}>
        <div className={classes.content}>
            <Title title={isEditMode ? 'Edit Food' : 'Add Food'} />
            <form onSubmit={handleSubmit(submit)} noValidate>
                <InputContainer label='Select Image'>
                    <input type='file' onChange={upload} accept='image/jpeg' />
                </InputContainer>

                {imageUrl && (
                    <a href={imageUrl} className={classes.image_link} target="blank">
                        <img src={imageUrl} alt="Uploaded" />
                    </a>
                )}

                <Input 
                    type="text" 
                    label="Name" 
                    {...register('name', { required: true, minLength: 5 })}
                    error={errors.name}
                />

                <Input 
                    type="number" 
                    label="Price" 
                    {...register('price', { required: true })}
                    error={errors.price}
                />

                <Input 
                    type="text" 
                    label="Tags" 
                    {...register('tags')}
                    error={errors.tags}
                />

                <Input 
                    type="text" 
                    label="Origins" 
                    {...register('origins', { required: true })}
                    error={errors.orgins}
                />

                <Input 
                    type="text" 
                    label="Cook Time" 
                    {...register('cookTime', { required: true })}
                    error={errors.cookTime}
                />

                <Button type ="submit" text={isEditMode ? 'Update' : 'Create'} />
            </form>
        </div>
    </div>
  )
}