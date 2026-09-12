import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login as authLogin } from '../../store/AuthSlice'
import { Button, Input, Logo } from '../index'
import authService from '../../appwrite/auth'

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit } = useForm();

    const [error, SetError] = useState("")

    const login = async (data) => {
        SetError("");

        try {

            console.log("2. Calling authService.login()");
            const session = await authService.login(data);

            console.log("3. Session received:", session);

            if (session) {

                console.log("4. Getting current user");
                const userData = await authService.getStatus();

                console.log("5. User data received:", userData);

                if (userData) {
                    console.log("6. Dispatching login");
                    dispatch(authLogin(userData));
                }

                console.log("7. Navigating to home");
                navigate("/");
            }

        } catch (error) {

            console.log("8. Login error:", error);
            SetError(error.message);
        }
    }


    return (
        <div className='w-full flex items-center justify-center'>
            <div className='mx-auto w-full bg-gray-100 rounded-xl p-10 border border-black/10'>
                <div className="mb-2 flex justify-center">
                    <span className='inline-block w-full max-w-[100px'>
                        <Logo width='100%' />
                    </span>
                </div>
                <h2 className='text-center text-2xl font-bold leading-tight'> Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {
                    error && <p className="text-red-600 mt-8 text-center"> {error} </p>
                }

                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5'>

                        {/* for email field */}
                        <Input label="Email: "
                            placeholder="enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) =>
                                        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(value) ||
                                        "Email address must be a valid address"
                                }
                                // regular expression for regexr.com
                            })}
                        />
                        {/* for password feild */}
                        <Input
                            label="Password: "
                            placeholder="enter your password"
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                validate: {
                                    matchPattern: (value) =>
                                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value) ||
                                        "Password must contain at least 8 characters, one uppercase, one lowercase, and one number"
                                }
                            })}
                        />

                        <Button className='w-full' type='submit'>Sign in</Button>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login