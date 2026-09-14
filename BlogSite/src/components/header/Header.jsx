import React from 'react'
import { Container, Logo, LogoutBtn } from '../../components'
import authService from '../../appwrite/Auth'
import { login, logout } from "../../store/AuthSlice"
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  //use array to store all  header components so its easy to add more header components
  const navItems = [{
    name: 'Home',
    slug: "/",
    active: true
  },
  {
    name: "Login",
    slug: "/login",
    active: !authStatus,
  },
  {
    name: "Signup",
    slug: "/signup",
    active: !authStatus,
  },
  {
    name: "All Posts",
    slug: "/all-posts",
    active: authStatus,
  },
  {
    name: "Add Post",
    slug: "/add-post",
    active: authStatus,
  },
  ]


  return (
    <header className='py-3 shadow bg-gray-500'>
      <Container>
        <nav className='flex'>
          <div className='mr-4'>
            <Link to="/">
              <Logo />
            </Link>
          </div>

          <ul className='flex ml-auto'>
            {
              navItems.map((items) => {

                if (items.active) {

                  return (
                    <li key={items.name}>
                      <button
                        onClick={() => navigate(items.slug)}
                        className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'>
                        {items.name}
                      </button>
                    </li>
                  )
                }

                else {
                  return null;
                }
              })
            }
            {/* show this if auth status have true value */}
            {
              authStatus && (<li>
                <LogoutBtn />
              </li>)
            }
          </ul>
        </nav>
      </Container>
    </header >
  )
}
