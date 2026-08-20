import React, { useState } from 'react'
import CommentCard from '../CommentCard/CommentCard'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import CreateCommentCard from '../CreateCommentCard/CreateCommentCard'
import Spinner from '../Spinner/Spinner'
import DropDownAction from '../DropDownAction/DropDownAction'
import { useContext } from 'react'
import { AuthContext } from './../../Context/AuthContext';
import { toast } from 'react-toastify'

export default function PosrCard({post , isSinglePost=false}) {

const{userData} = useContext(AuthContext)
const [likesCount, setLikesCount] = useState(
  post?.likesCount || 0
);
const query = useQueryClient()
  function getPostComment(){
   return axios.get(`https://route-posts.routemisr.com/posts/${post.id}/comments` , {
    params:{
      limit:10 ,
      sort:'-createdAt'
    } ,
      headers:{
      Authorization: `Bearer ${localStorage.getItem('token')}`

      }
    }
    )
  }

const {data , isLoading}=  useQuery({
    queryKey:['getPostComments'] ,
    queryFn:getPostComment ,
    enabled :isSinglePost
  })
// like unlike
  function likePost(){
return  axios.put(`https://route-posts.routemisr.com/posts/${post.id}/like`, {} , {
    headers:{
   Authorization: `Bearer ${localStorage.getItem('token')}`
    }
})
 
}
const {
  data: likeData,
  isPending: likePending,
  mutate: handleLikePost
} = useMutation({
  mutationFn: likePost,

  onSuccess: () => {
    setLikesCount((prev) => prev + 1);

    query.invalidateQueries({
      queryKey: ["getPosts"],
    });

    query.invalidateQueries({
      queryKey: ["getProfilePost"],
    });

    query.invalidateQueries({
      queryKey: ["getSinglePost", post.id],
    });
  },

  onError: (error) => {
    console.log("LIKE POST ERROR:", error.response?.data);
  },
});

// share post
function sharePost() {
  return axios.post(
    `https://route-posts.routemisr.com/posts/${post._id}/share`,
    {
      body: post.body,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
}

const {
  mutate: handleSharePost,
  isPending: sharePending,
} = useMutation({
  mutationFn: sharePost,

  onSuccess: () => {
    toast.success("Post shared successfully!");

    query.invalidateQueries({
      queryKey: ["getposts"],
    });

    query.invalidateQueries({
      queryKey: ["getProfilePost"],
    });

    query.invalidateQueries({
      queryKey: ["getSinglePost", post._id],
    });
  },

  onError: (error) => {
    console.log("SHARE ERROR:", error.response?.data);
    toast.error("Failed to share post");
  },
});



if(isLoading){
  return <Spinner/>
}





  //  post.topComment=null | obj
  return <>
 {/* Example Post */}
<div className="bg-white p-4 rounded shadow w-1/2 mx-auto mb-5 mt-3">

  <header className="flex justify-between items-center space-x-3 mb-3">
       
    <Link to={`/postDetails/${post.id}`}>
    <div className='flex items-center gap-3 '>
  <img src={post.user.photo} className='h-10 w-10 rounded-full' alt={post.user.name} />
    <div>
      <p className="font-semibold">{post.user.name}</p>
      <p>{post.id}</p>
      <p className="text-xs text-gray-500">{post.createdAt}</p>
      </div>
    </div>   
      </Link>
   
  {userData?._id === post.user._id && <div><DropDownAction postId={post.id}/></div>}

  </header>

{post.body &&   <p className="mb-3"> {post.body}</p>}
{post.image &&   <img src={post.image} alt={post.pody} className="rounded max-h-96 w-full object-cover mb-3" />}
  <div className="flex justify-between text-gray-600 text-sm font-semibold">
    <button onClick={handleLikePost} className="flex items-center space-x-1 ">
           <svg xmlns="http://www.w3.org/2000/svg" fill={likeData?.data?.data?.liked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"    className={`size-6 ${
      likeData?.data?.data?.liked ? "text-blue-700" : ""
    }`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
</svg>
      <i className="fas fa-thumbs-up" /><span>{likesCount > 0 ? likesCount : ""} Like</span>
 

    </button>
    <button className="flex items-center space-x-1 hover:text-blue-600">
      <i className="fas fa-comment" /><span>Comment</span>
    </button>
    <button onClick={() => handleSharePost()}className="flex items-center space-x-1 hover:text-blue-600">
      <i className="fas fa-share" /><span>{post.sharesCount <=0 ? '' : post.sharesCount } Share</span>
    </button>
  </div>


  {/* Create comment */}

 <CreateCommentCard   postId={post.id} queryKey={isSinglePost?['getPostComments']:['getPost']}/>

{/* single Comment */}
{/* {post.topComment && <CommentCard comment={post.topComment} />} */}

{/* {data?.data.data.comments.map((comment)=>{ return <CommentCard comment={comment}/> })} */}

{!isSinglePost && post.topComment && (
  <CommentCard
    comment={post.topComment}
    postId={post._id}
  />
)}

{isSinglePost &&
  data?.data?.data?.comments?.map((comment) => (
    <CommentCard
      key={comment._id}
      comment={comment}
      postId={post._id}
    />
  ))}
</div>


  
  </>
}
