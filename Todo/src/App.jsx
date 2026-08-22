import React, { useEffect, useState } from 'react'
import { TodoContextProvider } from './context';
import { TodoForm, TodoItem } from './components';

const App = () => {

  const [todos, setTodos] = useState([]);

  const addToDo = (todo) => {

    setTodos((prev) => [...prev, { id: Date.now(), ...todo }]) // Add new todo using the previous state

  }


  const updateToDo = (id, todo) => {
    setTodos((prev) =>
      prev.map((elem) => elem.id === id ? todo : elem)
    );
  };


  const deleteToDo = (id) => {
    setTodos((prev) => prev.filter((elem) => elem.id != id));//// If the id matches, the element is removed from the new array
  }

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((elem) =>
        elem.id === id
          ? { ...elem, completed: !elem.completed } //we want to change only completed so change it
          : elem
      )
    )
  }

  useEffect(() => {
    const todosLocalStorage = JSON.parse(localStorage.getItem("todosKey"));//string main hota hai humko json main chiya

    if (todosLocalStorage && todosLocalStorage.length > 0) {
      setTodos(todosLocalStorage);
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("todosKey", JSON.stringify(todos))
  }, [todos])


  return (

    <TodoContextProvider value={{ todos, addToDo, updateToDo, deleteToDo, toggleComplete }}>

      <div className="bg-[#172842] min-h-screen py-8">

        <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">

          <h1 className="text-2xl font-bold text-center mb-8 mt-2">Manage Your Todos</h1>

          <div className="mb-4">
            <TodoForm />
          </div>

          <div className="flex flex-wrap gap-y-3">
            {/*Loop and Add TodoItem here */}
            {
              todos.map((elem) =>
                <div key={elem.id}
                  className='w-full'>
                  <TodoItem todo={elem} />
                </div>
              )
            }
          </div>
        </div>
      </div>

    </TodoContextProvider>

  )
}

export default App