import React from 'react'
import UserContextProvider from './Context/userContextProvider'
import Profile from './components/profile'
import Login from './components/login'

const App = () => {
  return (
    <UserContextProvider>
      {/* <h1 className='bg-red-300'>hello </h1> */}
      <Login />
      <Profile />
    </UserContextProvider>
  )
}

export default App