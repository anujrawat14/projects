import React, { useEffect } from 'react'
import { Container, PostCard } from '../components'
import database from '../appwrite/Database'
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../store/PostSlice';


function AllPosts() {

    const dispatch = useDispatch();
    const post = useSelector((state) => state.post.posts);

    useEffect(() => {
        database.showAllPosts([]).then((response) => {
            if (response) {
                dispatch(setPosts(response.rows))
            }
        })
    }, [dispatch])

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>

                    {post.map((post) => (
                        <div className='p-2 w-1/4' key={post.$id}>
                            <PostCard {...post} />
                        </div>
                    ))}

                </div>
            </Container>
        </div>
    )
}

export default AllPosts
