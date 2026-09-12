import React, { useEffect, useState } from 'react'
import { Post_Form, Container, PostCard } from '../components'
import service from '../appwrite/config'

const AllPosts = () => {
    const [post, setPost] = useState([]);

    useEffect(() => { }, [])

    service.getPosts([]).then((posts) => {
        if (posts) {
            setPost(posts.rows);
        }
    })

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {
                        post.map((post) => (
                            <div key={post.$id} className='p-2 w-1/4'>
                                <PostCard post={post} />
                            </div>

                        ))
                    }
                </div>
            </Container>
        </div>
    )
}

export default AllPosts
