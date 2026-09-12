import React from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/AuthSlice'


const LogoutButton = () => {

    const dispatch = useDispatch();

    const logoutHandler = () => {
        authService.logOut().then(() => {
            dispatch(logout)
        })
    }
    return (
        <button className='inline-block  px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'>Logout</button>
    )
}

export default LogoutButton