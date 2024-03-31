import React from 'react'
import { useForm } from 'react-hook-form'
import Title from '../Title/Title';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { useAuth } from '../../hooks/useAuth';

// function will be similar to ProfilePage()
export default function ChangePassword() {
    const {
        handleSubmit,
        register,
        getValues, // need to get values of password to check if passwords are matching
        formState: { errors },
    } = useForm();

    const { changePassword } = useAuth();
    const submit = passwords => {
        changePassword(passwords);
    };

    return (
        <div>
            <Title title="Change Password" />
            <form onSubmit={handleSubmit(submit)}>
                <Input
                    type="password"
                    label="Current Password"
                    {...register('currentPassword', {
                        required: true,
                    })}
                    error={errors.currentPassword}
                />

                <Input 
                    type="password"
                    label="New Password"
                    {...register('newPassword', {
                        required: true,
                        minLength: 5, // same as register page
                    })}
                    error={errors.newPassword}
                />

                <Input
                    type="password"
                    label="Confirm Password"
                    {...register('confirmPassword', {
                        required: true,
                        validate: value => // validate called every time input is changed
                            value != getValues('newPassword') // if current input (value) doesn't match 'newPassword'
                            ? 'Passwords do not match!' // show error message
                            : true, // otherwise, return true
                    })}
                    error={errors.confirmNewPassword}
                />

                <Button type="submit" text="Change" />
            </form>
        </div>
  );
}
