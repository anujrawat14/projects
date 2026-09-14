import React from 'react'

const Button = (
    {
        text,
        type = "button",
        bgColor = "bg-blue-400",
        textColor = "text-white",
        className = "",
        ...props
    }
) => {
    return (
        <button
            {...props}
            className={`px-4 py-2 rounded-lg ${className} ${bgColor} ${textColor}`}>

            {text}

        </button>
    )
}

export default Button