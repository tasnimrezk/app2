import React, { useState } from "react";
import axios from "axios";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";


export default function CommentCard({ comment, postId }) {
  const query = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const [editContent, setEditContent] = useState(
    comment?.content || ""
  );
const [likesCount, setLikesCount] = useState(0);
const [unlikesCount, setUnlikesCount] = useState(0);
  // ================= GET REPLIES =================

  function getCommentReplies() {
    return axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/replies?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }

  const {
    data: repliesData,
    isLoading: repliesLoading,
  } = useQuery({
    queryKey: ["commentReplies", postId, comment._id],
    queryFn: getCommentReplies,
  });

  // مهم جدًا
  const replies = repliesData?.data?.data?.replies || [];

  console.log("POST ID:", postId);
  console.log("COMMENT ID:", comment?._id);
  console.log("REPLIES:", replies);

  // ================= CREATE REPLY =================

  function createReplyFunc(content) {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/replies`,
      {
        content: content,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }

  const {
    mutate: handleCreateReply,
    isPending: replyPending,
  } = useMutation({
    mutationFn: createReplyFunc,

    onSuccess: () => {
      toast.success("Reply added successfully!");

      query.invalidateQueries({
        queryKey: ["commentReplies", postId, comment._id],
      });

      query.invalidateQueries({
        queryKey: ["getPosts"],
      });

      query.invalidateQueries({
        queryKey: ["getProfilePost"],
      });

      query.invalidateQueries({
        queryKey: ["getSinglePost", postId],
      });
    },

    onError: (error) => {
      console.log("REPLY ERROR:", error.response?.data);
      toast.error("Failed to add reply");
    },
  });

  // ================= SUBMIT REPLY =================

  function submitReply(e) {
    e.preventDefault();

    const input = e.target.reply;
    const content = input.value.trim();

    if (!content) {
      toast.error("Write a reply first");
      return;
    }

    handleCreateReply(content);

    input.value = "";
  }
// update
function updateCommentFunc({ commentId, content, image }) {
  const formData = new FormData();

  if (content) {
    formData.append("content", content);
  }

  if (image) {
    formData.append("image", image);
  }

  return axios.put(
    `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
}

const {
  mutate: handleUpdateComment,
  isPending: updatePending,
} = useMutation({
  mutationFn: updateCommentFunc,
onSuccess: () => {
  toast.success("Comment updated successfully!");

  setIsEditing(false);

  query.invalidateQueries({
    queryKey: ["getPosts"],
  });

  query.invalidateQueries({
    queryKey: ["getProfilePost"],
  });

  query.invalidateQueries({
    queryKey: ["getSinglePost", postId],
  });
},

  onError: (error) => {
    console.log("UPDATE COMMENT ERROR:", error.response?.data);

    toast.error("Failed to update comment");
  },
});


function handleUpdate() {
  if (!editContent.trim()) {
    toast.error("Comment cannot be empty");
    return;
  }

  handleUpdateComment({
    commentId: comment._id,
    content: editContent.trim(),
  });
}

// delete comment

// ================= DELETE COMMENT =================
// ================= DELETE COMMENT =================

function deleteCommentFunc(commentId) {
  return axios.delete(
    `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
}

const {
  mutate: handleDeleteComment,
  isPending: deletePending,
} = useMutation({
  mutationFn: deleteCommentFunc,

 onSuccess: () => {
  toast.success("Comment deleted successfully!");

  query.invalidateQueries({
    queryKey: ["getPosts"],
  });

  query.invalidateQueries({
    queryKey: ["getProfilePost"],
  });

  query.invalidateQueries({
    queryKey: ["getSinglePost", postId],
  });
},

  onError: (error) => {
    console.log("DELETE ERROR:", error.response?.data);
  },
});

// like unlike

function likeCommentFunc() {
  return axios.put(
    `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
}

const {
  mutate: handleLikeComment,
  isPending: likePending,
} = useMutation({
  mutationFn: likeCommentFunc,

  onSuccess: () => {
    setLikesCount((prev) => prev + 1);
  },

  onError: (error) => {
    console.log("LIKE ERROR:", error.response?.data);
    toast.error("Failed to like comment");
  },
});
// unlike

function unlikeCommentFunc() {
  return axios.put(
    `https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
}

const {
  mutate: handleUnlikeComment,
  isPending: unlikePending,
} = useMutation({
  mutationFn: unlikeCommentFunc,

  onSuccess: () => {
    setLikesCount((prev) => Math.max(0, prev - 1));

    setUnlikesCount((prev) => prev + 1);
  },

  onError: (error) => {
    console.log("UNLIKE ERROR:", error.response?.data);
    toast.error("Failed to unlike comment");
  },
});

  return (
  <>
    <div className="border border-gray-400 p-3 mt-2">

      {/* ================= COMMENT HEADER ================= */}

      <header className="flex items-center space-x-3 mb-3">
        <img
          src={comment?.commentCreator?.photo}
          className="h-10 w-10 rounded-full"
          alt={comment?.commentCreator?.name}
        />

        <div>
          <p className="font-semibold">
            {comment?.commentCreator?.name}
          </p>

          <p className="text-xs text-gray-500">
            {comment?.createdAt}
          </p>
        </div>
      </header>

      {/* ================= COMMENT CONTENT / EDIT ================= */}

      {isEditing ? (
        <div className="flex gap-2 mb-3">
          <input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />

          <button
            onClick={handleUpdate}
            disabled={updatePending}
            className="bg-blue-500 text-white px-3 rounded"
          >
            {updatePending ? "Updating..." : "Update"}
          </button>

          <button
            onClick={() => {
              setIsEditing(false);
              setEditContent(comment?.content || "");
            }}
            className="bg-gray-400 text-white px-3 rounded"
          >
            Cancel
          </button>
        </div>
      ) : (

        <div className="mb-3 ">
          <p className="mb-2">
            {comment?.content}
          </p>
          <div className="flex gap-5 justify-evenly items-center">        
          <div className="flex gap-4 ">      
          <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-green-700">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>
          <button
            onClick={() => setIsEditing(true)}
            className="text-green-500 text-l font-mono"
          >
         Edit
          </button>
        </div>
{!deletePending && (
  <div className="flex items-center gap-2">
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-red-600">
  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>
 
  <button
    onClick={() => handleDeleteComment(comment._id)}
    className="text-red-500 text-sm"
  >
    Delete
  </button>
 </div>
 
)}
</div>
{deletePending && (
  <span className="text-red-500 text-sm">
    Deleting...
  </span>
)}

<div className="flex items-center gap-4 mt-3 ml-8">

  {/* LIKE */}
  <button
    onClick={() => handleLikeComment()}
    disabled={likePending}
    className="flex items-center gap-1 text-gray-500 mb-2 "
  >
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-blue-800">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
</svg>


    <span className="text-black">Like</span>
    <span>{likesCount}</span>
  </button>


  {/* UNLIKE */}
  <button
    onClick={() => handleUnlikeComment()}
    disabled={unlikePending}
    className="flex items-center gap-1 text-gray-500 mb-2"
  >
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-red-800">
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
</svg>


    <span className="text-black">Unlike</span>
    <span>{unlikesCount}</span>
  </button>

</div>

</div>

</div>


      
      )}

      {/* ================= ADD REPLY ================= */}

      <form
        onSubmit={submitReply}
        className="flex gap-2 ml-8 mb-4"
      >
        <input
          name="reply"
          type="text"
          placeholder="Write a reply..."
          className="flex-1 h-9 px-3 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          disabled={replyPending}
        />

        <button
          type="submit"
          disabled={replyPending}
          className="px-4 h-9 text-sm bg-blue-500 text-white rounded hover:bg-blue-400"
        >
          {replyPending ? "..." : "Reply"}
        </button>
      </form>

      {/* ================= REPLIES ================= */}

      <div className="ml-8">

        {repliesLoading && (
          <p className="text-sm text-gray-500">
            Loading replies...
          </p>
        )}

        {replies.length === 0 && !repliesLoading && (
          <p className="text-sm text-gray-400">
            No replies yet
          </p>
        )}

        {replies.map((reply) => (
          <div
            key={reply._id}
            className="mt-3 p-3 border-l-2 border-blue-400 bg-gray-50"
          >
            <div className="flex items-center gap-2">

              <img
                src={reply?.commentCreator?.photo}
                className="w-8 h-8 rounded-full"
                alt={reply?.commentCreator?.name}
              />

              <p className="font-semibold text-sm">
                {reply?.commentCreator?.name}
              </p>

            </div>

            <p className="text-sm mt-2">
              {reply?.content}
            </p>
          </div>
        ))}

      </div>

    </div>
  </>
);
}