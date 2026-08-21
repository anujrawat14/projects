import React, { useContext,useState } from 'react'
import userContext from '../Context/userContext'

const Profile = () => {

    const { user } = useContext(userContext);
    const [showDetails, setShowDetails] = useState(false);

    if (!user) {
        return (
            <div className="flex justify-center mt-10">
                <p className="text-lg text-gray-500">
                    Please login to view your profile.
                </p>
            </div>
        );
    }


    return (
        <div className="flex justify-center mt-10">
            <div className="w-80 rounded-2xl bg-white p-6 shadow-lg text-center">
                <h2 className="mb-3 text-2xl font-bold text-gray-800">
                    Welcome 👋
                </h2>

                <p className="text-lg text-gray-600">
                    {user.userName}
                </p>

                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="mt-5 rounded-lg bg-blue-500 px-5 py-2 text-white hover:bg-blue-600"
                >
                    {showDetails ? "Hide Profile" : "View Profile"}
                </button>

                {showDetails && (
                    <div className="mt-4 rounded-lg bg-gray-100 p-4">
                        <p>Username: {user.userName}</p>
                        <p>Password: {user.password}</p>
                    </div>
                )}
            </div>
        </div>
    )

}

export default Profile


