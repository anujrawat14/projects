import React from 'react'
import Addtodo from './components/Addtodo'
import Todo from './components/Todo'

const App = () => {
  return (
    <>
      <div className='text-center font-medium text-xl capitalize'>learn about redux toolkit</div>

      <Addtodo />
      <Todo />
    </>
  )
}

export default App