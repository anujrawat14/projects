import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, PostForm } from '../components'
import { removePost, setCurrentPost } from "../store/PostSlice"
import { useDispatch, useSelector } from 'react-redux'
import database from '../appwrite/Database'

export default function EditPost() {

    const post = useSelector((state) => state.post.currentPost);
    const dispatch = useDispatch();

    const { slug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            database.showPost(slug).then((response) => {
                if (response && response.rows.length > 0) {
                    dispatch(setCurrentPost(response.rows[0]))
                }
            })
        }
        else {
            navigate('/');
        }
    }, [dispatch, slug, navigate])

    return post ? <div className='py-8'>
        <Container>
            <PostForm post={post} />
        </Container>
    </div>
        : null;
}
