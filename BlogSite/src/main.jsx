import { createRoot } from 'react-dom/client'
import './index.css'

import { AuthLayout } from './components/index.js'

import App from './App.jsx'

import Store from './store/Store.js'
import { Provider } from 'react-redux'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import AddPost from "./pages/AddPost.jsx"
import AllPosts from "./pages/AllPosts.jsx"
import EditPost from "./pages/EditPost";
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import Post from "./pages/Post";
import Signup from './pages/Signup'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: "/login",
                element: (
                    <AuthLayout authentication={false}>
                        <Login />
                    </AuthLayout>
                )
            },
            {
                path: "/signup",
                element: (
                    <AuthLayout authentication={false}>
                        <Signup />
                    </AuthLayout>
                )
            },
            {
                path: "/all-posts",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <AllPosts />
                    </AuthLayout>
                )
            },
            {
                path: "/add-post",
                element: (<AuthLayout authentication>
                    {" "}
                    <AddPost />
                </AuthLayout>
                )
            },
            {
                path: "/edit-post",
                element: (
                    <AuthLayout authenticatio>
                        {" "}
                        <EditPost />
                    </AuthLayout>
                )
            },
            {
                path: "/edit-post/:slug",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <EditPost />
                    </AuthLayout>
                )
            },
            {
                path: "/post/:slug",
                element: <Post />,
            },
        ]
    },


])

createRoot(document.getElementById('root')).render(
    <Provider store={Store}>

        <RouterProvider router={router} />

    </Provider>

)

