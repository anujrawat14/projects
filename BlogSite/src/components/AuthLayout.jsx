import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// it is a protected container
// Protected/AuthLayout component
// Handles authentication-based route protection in one place.
// authentication = true  → protected page → unauthenticated user goes to /login
// authentication = false → guest-only page → authenticated user goes to /
// This avoids repeating authentication logic in every page or route.

export default function Protected({ children, authentication = true }) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const authStatus = useSelector((state) => state.auth.status)

    useEffect(() => {

        if (authentication && authStatus !== authentication) {
            navigate('/login');
        }
        else if (!authentication && authStatus !== authentication) {
            navigate("/");
        }

        setLoader(false);

    }, [authStatus, navigate, authentication])

    return loader ? <h1>loading....</h1> : <div>{children}</div>;
}
