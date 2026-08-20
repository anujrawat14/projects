import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLoaderData } from 'react-router-dom'

const GitHub = () => {

  const details = useLoaderData();
  // const [repoCount, setRepoCount] = useState(0);
  // const [followerCount, SetFollowerCount] = useState(0);
  // const [details, SetDetails] = useState({});

  // useEffect(() => {
  //   const callApi = async () => {
  //     const { data } = await axios.get(
  //       "https://api.github.com/users/anujrawat14"
  //     )
  //     // setRepoCount(data.public_repos);
  //     // SetFollowerCount(data.followers);
  //     SetDetails(data);
  //   }
  //   callApi()
  // }, [])

  return (
    <div className="bg-gray-700 flex justify-between px-10 text-black text-center text-3xl py-2">
      <img className='h-30 w-30' src={details.avatar_url} alt="" />
      <div>
        <h3> GitHub Repo Count {details.public_repos} </h3>
        <h3>Github followers are : {details.followers}</h3>
      </div>

    </div>
  )
}

export const gitHubInfoLoader = async () => {
  const { data } = await axios.get(
    "https://api.github.com/users/anujrawat14"
  )
  return data;
}

export default GitHub

