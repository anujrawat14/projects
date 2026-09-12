import React from 'react'

const Button = ({
    children,
    type = "buuton",
    bgCOlor = 'bg-blue-600',
    textColor = "white",
    className = "",
    ...props
}) => {
    return (
        <button className={`px-4 py-2 rounded-lg ${className} ${bgCOlor} ${textColor}`} {...props}>
            {children}
        </button>
    )
}

export default Button