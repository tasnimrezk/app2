import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import Spinner from '../Spinner/Spinner'
import { useParams } from 'react-router-dom'
import PosrCard from '../PosrCard/PosrCard'

export default function PostDetails() {

   let{id}= useParams()


 function getPostDetails(){
     return axios.get(`https://route-posts.routemisr.com/posts/${id}` ,{
        headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
 }

    const {data , isLoading , isError , error} = useQuery({
        queryKey:['getSinglePost' , id],
        queryFn:getPostDetails
    })

    if(isLoading){
        return <Spinner/>
    }
    if(isError){
        return <div className='h-screen flex justify-center items-center'>
      <h2>{error.message}</h2>
    </div>
    }

  return (
    <>
    <PosrCard isSinglePost={true} post ={data?.data.data.post}/>
    </>
  )
}
