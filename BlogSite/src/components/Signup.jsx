import React, { useState } from 'react'
import authService from '../appwrite/Auth'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from "../store/AuthSlice"
import { Button, Input, Logo } from "./index"
import { useDispatch } from 'react-redux'
import { useForm } from "react-hook-form"

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const { register, handleSubmit } = useForm();

    const signupSubmitted = async (data) => {
        console.log(data)
        setError("");
        try {
            const create = await authService.createAccount(data);
            if (create) {
                const currentUser = await authService.getCurrentUser();
                if (currentUser) {
                    dispatch(authLogin(currentUser));
                }
                navigate("/");
            }
        } catch (error) {
            setError(error.message)
        }
    }

    //process of signup submitted


    return (
        <div className="flex items-center justify-center">

            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex flex-col justify-center">

                    <div className="mb-2 flex justify-center">

                        <span className="inline-block w-full max-w-[100px]">
                            <Logo width="100%" />
                        </span>

                    </div>

                    <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>

                    <p className="mt-2 text-center text-base text-black/60">
                        Already have an account?&nbsp;
                        <Link
                            to="/login"
                            className="font-medium text-primary transition-all duration-200 hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>

                    {error && <p className="text-red-600 mt-8 text-center"> {error}</p>}

                    <form onSubmit={handleSubmit(signupSubmitted)}>
                        <div className='space-y-5'>

                            <Input
                                label="Name :"
                                type='text'
                                placeholder="Enter your full name"
                                {...register("name", { required: true })}
                            />

                            <Input
                                label="Email :"
                                type='email'
                                placeholder="Enter your email"
                                {...register("email", {
                                    required: true,
                                    validate: {
                                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                            "Email address must be a valid address",
                                    }
                                })}
                            />

                            <Input
                                label="password"
                                type='password'
                                placeholder="enter your password"
                                {...register('password', { required: true })}
                            />

                            <Button type='submit' className='w-full'> Create Account</Button>
                        </div>
                    </form>
                </div>
            </div >
        </div>
    )
}

export default Signup
