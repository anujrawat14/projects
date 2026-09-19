import React, { useEffect, useState } from 'react'
import database from '../appwrite/Database.js'
import { Container, PostCard } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '../store/PostSlice'

function Home() {
    const post = useSelector((state) => state.post.posts);
    const dispatch = useDispatch();

    useEffect(() => {
        database.showAllPosts().then((response) => {
            if (response) {
                dispatch(setPosts(response.rows));
            }
        })
    }, [dispatch])

    if (post.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {
                        post.map((post => (
                            <div className='p-2 w-1/4' key={post.$id}>
                                <PostCard {...post} />
                            </div>
                        )))
                    }
                </div>
            </Container>
        </div>
    )
}

export default Home
