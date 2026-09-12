import "./index.css";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Store } from './store/Store'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Protected from './components/AuthLayout.jsx'
import { AuthLayout } from './components/index.js'
import { Home, Login, SignIn, AllPosts, AddPost, EditPost, Post } from './pages/index.js'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: (
          <Protected authenticated={false}>
            <Login />
          </Protected>
        ),
      },
      {
        path: '/signup',
        element: (
          <Protected authenticated={false}>
            <SignIn />
          </Protected>
        ),
      },
      {
        path: "/all-posts",
        element: (
          <Protected authenticated={true}>
            <AllPosts />
          </Protected>
        ),
      },
      {
        path: "/add-post",
        element: (
          <Protected authenticated={true}>
            <AddPost />
          </Protected>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <AuthLayout authentication>
            {" "}
            <EditPost />
          </AuthLayout>
        ),
      },
      {
        path: "/post/:slug",
        element: <Post />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <Provider store={Store}>
    <RouterProvider router={router} />
  </Provider>,
)
