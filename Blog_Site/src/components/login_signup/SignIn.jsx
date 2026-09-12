import React, { useState } from 'react'
import authService from "../../appwrite/auth"
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login as authLogin } from '../../store/AuthSlice'
import { Button, Input, Logo } from '../index'
import { useForm } from 'react-hook-form'

const SignIn = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const { register, handleSubmit } = useForm();

    const signup = async (data) => {
        setError("");
        try {
            const userData = await authService.createAccount(data);
            if (userData) {
                const currentUser = await authService.getStatus();
                if (currentUser) {
                    dispatch(authLogin(currentUser));
                    navigate("/");;
                }
            }
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to='/login'
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    > SignIn
                    </Link>
                </p>
                {
                    error && <p className="text-red-600 mt-8 text-center"> {error} </p>
                }

                <form
                    onSubmit={handleSubmit(signup)}
                    className='space-y-5'>

                    {/* email ka liya */}
                    <Input
                        label="Email: "
                        placeholder="enter your email"
                        type="email"
                        {...register("email", {
                            required: true,
                            validate: {
                                matchPattern: (value) =>
                                    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(value) ||
                                    "Email address must be a valid address"
                            }
                        })}
                    />

                    {/* password ka liya */}
                    <Input
                        label="Password: "
                        placeholder="enter  pasword"
                        type="password"
                        {...register("password", {
                            required: true,
                            validate: {
                                matchPattern: (value) =>
                                    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value) ||
                                    "Password must contain at least 8 characters, one uppercase, one lowercase, and one number"
                            }
                        })}
                    />


                    {/* name ka liya  */}
                    <Input
                        label="Name"
                        placeholder="enter your name"
                        type="text"
                        {...register("name", { required: true })}
                    />

                    <Button type="submit" >Create Account</Button>

                </form>
            </div>


        </div>
    )
}

export default SignIn