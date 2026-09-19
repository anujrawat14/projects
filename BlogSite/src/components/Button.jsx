import React from 'react'

const Button = (
    {
        children,
        type = "button",
        bgColor = "bg-blue-400",
        textColor = "text-white",
        className = "",
        ...props
    }
) => {
    return (
        <button
            type={type}
            {...props}
            className={`px-4 py-2 rounded-lg ${className} ${bgColor} ${textColor}`}>
            {children}   </button>
    )
}

export default Button