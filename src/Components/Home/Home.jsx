import React, { useContext, useEffect, useState } from 'react'
import Profile from '../Profile/Profile'

import Navbar from '../Navbar/Navbar'
import axios from 'axios'
import PosrCard from '../PosrCard/PosrCard'
import { PacmanLoader } from 'react-spinners'
import Spinner from '../Spinner/Spinner'
import { useQuery } from '@tanstack/react-query'
import CreatePostCard from '../CreatePostCard/CreatePostCard'

export default function Home() {
   useEffect(()=>{
console.log('comp did mount');
return function(){
  console.log('comp will mount');
  }

  } , [])



function getAllPosts(){
  return axios.get('https://route-posts.routemisr.com/posts' , {
   
    headers:{
   Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
}

const {data , isLoading , isError , error}= useQuery({
  queryKey:['getPosts'] ,
  queryFn:getAllPosts,

  select:(data)=>{
    return data?.data.data.posts

  }
})
console.log(data);


 

  if(isLoading){
    return <Spinner/>
  }
 
   if(isError){
    return <div className='h-screen flex justify-center items-center'>
      <h2>{error.message}</h2>
    </div>
  }
  return(
   <>
<CreatePostCard/>
 {data?.map((post)=>{ return <PosrCard isSinglePost={false} key={post._id} post ={post}/> })}
  
 </>
  )
}
