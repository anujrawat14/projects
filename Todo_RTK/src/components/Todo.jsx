import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeTodo, updateTodo } from '../features/Todo/TodoSlice'

const Todo = () => {

    const todos = useSelector(state => state.todos)
    const dispatch = useDispatch()

    const [editId, setEditId] = useState(null)
    const [editText, setEditText] = useState("")

    const handleEdit = (todo) => {
        setEditId(todo.id)
        setEditText(todo.text)
    }

    const handleUpdate = (id) => {
        dispatch(
            updateTodo({
                id: id,
                text: editText
            })
        )

        setEditId(null)
        setEditText("")
    }

    return (
        <div className='mt-7'>

            <div className='text-center'>Todos</div>

            <ul className="list-none">

                {todos.map((todo) => (

                    <li
                        className="mt-4 flex justify-between items-center bg-zinc-800 px-4 py-2 rounded"
                        key={todo.id}
                    >

                        {editId === todo.id ? (

                            <>
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="bg-white text-black px-2 py-1 rounded"
                                />

                                <button
                                    onClick={() => handleUpdate(todo.id)}
                                    className="text-white bg-green-500 px-4 py-1 rounded"
                                >
                                    Save
                                </button>
                            </>

                        ) : (

                            <>
                                <div className='text-white'>
                                    {todo.text}
                                </div>

                                <div className="flex gap-2">

                                    <button
                                        onClick={() => handleEdit(todo)}
                                        className="text-white bg-blue-500 px-4 py-1 rounded"
                                    >
                                        Update
                                    </button>

                                    <button
                                        onClick={() => dispatch(removeTodo(todo.id))}
                                        className="text-white bg-red-500 px-4 py-1 rounded"
                                    >
                                        Delete
                                    </button>

                                </div>
                            </>

                        )}

                    </li>

                ))}

            </ul>
        </div>
    )
}

export default Todo