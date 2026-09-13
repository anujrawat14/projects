import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux"
import authService from "./appwrite/Auth";
import { login, logout } from "./store/AuthSlice"
import {Header,Footer} from "./components"

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {

    // First, get the current user's status.
    // If userData exists, dispatch login and store the userData in AuthSlice.
    // Otherwise, dispatch logout because the user is not logged in.


    authService.getCurrentUser()

      .then((userData) => {

        if (userData) {
          dispatch(login({ userData }))
        }
        else {
          dispatch(logout());
        }

      })
      .finally(() => setLoading(false));//if  it finishes set loading false

  }, [])

  //conditional rendering if loading true then loading UI
  if (loading) {
    return (
      <div className='min-h-screen flex flex-wrap bg-gray-400'>
        <div className='w-full block'>
          <Header />
          <main>
            {/* <Outlet/> handle outlet by react router dom */}
          </main>
          <Footer />
        </div>
      </div>
    )
  }
  else {
    return null;
  }
}

export default App
