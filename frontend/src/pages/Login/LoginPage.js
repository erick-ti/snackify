import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import classes from './loginPage.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

export default function LoginPage() {
    const {
        handleSubmit, // checks for validation error and calls submit function if no error
        register, // creating a reference and passing it as 'ref' in Input.js (sending all events to handle validation)
        formState: { errors }, // has all the validation errors
    } = useForm();

    const navigate = useNavigate(); // for after logging in, to navigate user to another path
    const { user, login } = useAuth();
    const [params] = useSearchParams(); // gets all the query params
    const returnUrl = params.get('returnUrl');

    useEffect(() => { 
        if (!user) return; // if user is null or undefined, then return out, otherwise...
        // user not null and has value, so do not stay at login page
        returnUrl ? navigate(returnUrl) : navigate('/'); // navigate returnUrl, if none go to homepage
    }, [user]);

    const submit = async ({ email, password }) => {
        await login(email, password); // for logging in the user
    };

  return (
    <div className={classes.container}>
        <div className={classes.details}>
            <Title title='Login' />
            <form /* Checks for validation error, if there is an error it won't call the submit function, 
                    otherwise, submit all data from <form> into submit function (email & password). 
                    Default validation disabled. Using own custom validation, instead. */
                onSubmit={handleSubmit(submit)} noValidate >
                
                <Input // input for email
                    type="email"
                    label="Email"
                    {...register('email', {
                        required: true,
                        pattern: {
                            // if user's email input does not match email pattern, show message
                            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,63}$/i,
                            message: 'Email is not valid!',
                        },
                    })}
                    error={errors.email}
                />

                <Input // input for password
                    type="password"
                    label="Password"
                    {...register('password', {
                        required: true,
                    })}
                    error={errors.password}
                />

                <Button type="submit" text="Login"/>

                <div className={classes.register}>
                    New user? &nbsp; 
                    <Link to={`/register?${returnUrl ? 'returnUrl=' + returnUrl : ''}`}>
                        Register Here
                    </Link>
                </div>
            </form>
        </div>
    </div>
  );
}
