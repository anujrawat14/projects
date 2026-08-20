import React from 'react'
import { useParams } from 'react-router-dom'

const User = () => {
    const params = useParams();
    return (
        <div className='bg-gray-500 py-1 font-semibold text-white text-lg text-center'> hey this is my  user id {params.userId}</div>
    )
}

export default User