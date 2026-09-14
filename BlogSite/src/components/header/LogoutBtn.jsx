import React from 'react'
import { logout } from "../../store/AuthSlice"
import { useDispatch } from "react-redux"
import authService from "../../appwrite/Auth"

const LogoutBtn = () => {
    const dispatch = useDispatch();
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout());//logout state is maintained in store
        })
    }
    return (
        <button className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
            onClick={logoutHandler}>
            Logout
        </button>
    )
}

export default LogoutBtn
