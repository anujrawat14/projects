import React, { useState, useContext } from 'react'
import userContext from '../Context/userContext'

const Login = () => {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const { setUser } = useContext(userContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        setUser({ userName, password });
         setUserName("");
        setPassword("");
    }

    return (
        <div >
            <div className="flex flex-col items-center gap-4 p-10">
                <h2 className="text-3xl font-bold">Login</h2>

                <input
                    className="border border-gray-400 rounded px-4 py-2"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    type="text"
                    placeholder="user name"
                />

                <input
                    className="border border-gray-400 rounded px-4 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="password"
                />

                <button
                    className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    )
}

export default Login