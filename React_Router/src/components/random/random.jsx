import React from 'react'

import { useParams } from 'react-router-dom'

const random = () => {
    const params = useParams();
    console.log(params);

    return (
        <div> my parameters :  {params.id}

        </div>
    )
}

export default random