import React, { useState, useEffect } from 'react'
import { Container, Post_Form } from '../components'
import service from '../appwrite/config'
import { useNavigate, useParams } from 'react-router-dom';


const EditPost = () => {

    const [post, setPost] = useState([]);
    const { slug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            service.getPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                }
            })
        }
        else {
            navigate('/');
        }
    }, [slug, navigate])

    return post ? (
        <div className='py-8 '>\
            <Container> 
                <Post_Form post={post}/>
            </Container>
        </div>
    ) : null
}

export default EditPost
