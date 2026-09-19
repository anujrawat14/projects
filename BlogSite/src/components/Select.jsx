import React, { useId } from 'react'

const Select = ({ ref, options, label, className = "", ...props }) => {
    const id = useId();

    return (
        <div className='w-full'>
            {
                label && <label htmlFor={id} className=''>{label}</label>
            }
            <select
                ref={ref}
                id={id}
                {...props}
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
            >
                {
                    // optional chaining
                    options?.map((option, key) => (<option value={option} key={option}>{option}</option>))
                }
            </select>

        </div>
    )
}

export default Select
