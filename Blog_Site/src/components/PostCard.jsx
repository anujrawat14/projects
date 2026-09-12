import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from "react-router-dom"

const PostCard = ({ $id, title, featuredImage }) => {

    return (
        <Link to={`/post/${$id}`}>
            <div className='w-full bg-gray-100 rounded-xl'>
                <div className='w-full justify-center mb-4'>
                   <img 
                  className='rounded-xl' src={appwriteService.getPost(featuredImage)} alt={title} />
                </div>
                <h2 className='text-xl font-bold'>{title}</h2>
            </div>
        </Link>
    )
}

export default PostCard
