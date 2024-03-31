import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import Input from '../../components/Input/Input';
import Title from '../../components/Title/Title';
import classes from './registerPage.module.css';
import Button from '../../components/Button/Button';
import { Link } from 'react-router-dom';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterPage() {
    const auth = useAuth();
    const { user } = auth;
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const returnUrl = params.get('returnUrl'); // used to get returnUrl of login page

    // for hiding the register page if the user is logged in
    useEffect(() => {
        if(!user) return; // if user is null (not logged in), get out of the function, otherwise
        returnUrl ? navigate(returnUrl) : navigate('/'); // user is logged in so navigate to returnUrl if not null, else navigate to home page
    }, [user]);

    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors },
    } = useForm();

    const submit = async data => {
        await auth.register(data);
    };

    return (
        <div className={classes.container}>
            <div className={classes.details}>
                <Title title="Register" />
                <form onSubmit={handleSubmit(submit)} noValidate /* noValidate in order to use own validation not default one */ >
                    <Input
                        type="text"
                        label="Name"
                        {...register('name', {
                            required: true,
                            minLength: 5,
                        })}
                        error={errors.name}
                    />

                    <Input
                        type="email"
                        label="Email"
                        {...register('email', {
                            required: true,
                            pattern: {
                                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,63}$/i, // for validating email name structure
                                message: 'Email is not valid!',
                            },
                        })}
                        error={errors.email}
                    />

                    <Input
                        type="password"
                        label="Password"
                        {...register('password', {
                            required: true,
                            minLength: 5,
                        })}
                        error={errors.password}
                    />

                    <Input
                        type="password"
                        label="Confirm Password"
                        {...register('confirmPassword', {
                            required: true,
                            validate: value => // value = user input
                            value !== getValues('password') // if input does not match password
                            ? 'Passwords do not match!' // return error message
                            : true, // otherwise return true
                        })}
                        error={errors.confirmPassword}
                    />

                    <Input
                        type="text"
                        label="Address"
                        {...register('address', {
                            required: true,
                            minLength: 10,
                        })}
                        error={errors.address}
                    />
                    <Button type="submit" text="Register" />

                    <div className={classes.login}>
                        Already a user? &nbsp;
                        <Link to={`/login${returnUrl ? '?returnUrl=' + returnUrl : ''}`}>
                            Login here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
