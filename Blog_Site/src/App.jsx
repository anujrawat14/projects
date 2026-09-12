import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth';
import { login, logout } from './store/AuthSlice'
import { Header, Footer } from "./components"
import { Outlet } from 'react-router-dom'

const App = () => {

  //loading is neccesary 
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    authService.getStatus().then((userData) => {
      if (userData) {
        dispatch(login({ userData }))
      }
      else {
        dispatch(logout())
      }
    }).finally(() => setLoading(false))
  }, [])


  // console.log(import.meta.env.VITE_APPWRITE_URL);

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
          TODO:  <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : null
}

export default App