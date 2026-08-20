import React from 'react'
import {Button, Dropdown, Input, Label, TextArea} from "@heroui/react";
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {Modal} from "@heroui/react";
import { useRef } from 'react';
export default function DropDownAction({postId}) {

const [isOpen , setisOpen]=useState(false)

const query = useQueryClient()
const Navigat = useNavigate()
  function deletePost(){
  return  axios.delete(`https://route-posts.routemisr.com/posts/${postId}` , {
         headers:{
        Authorization : ` Bearer ${localStorage.getItem('token')}`
    }
      })
  }

const {mutate:handelDeletePost , data:deleteData} = useMutation({
  mutationFn:deletePost,
  onSuccess:()=>{
    toast.success('Post deleted Successfully')
    query.invalidateQueries({queryKey:['getPosts']})
    query.invalidateQueries({queryKey:['getProfilePost']})
    Navigat('/home')
  },
  onError:()=>{
    toast.error('connot deleted Post')
  
  }
})

// update

  
   let image= useRef(null)

   let body = useRef(null)

   function prepareData(){
    let formData= new FormData()
    if( body.current.value){
formData.append('body' , body.current.value)
    }
    if(image.current.files[0]){
          formData.append('image' , image.current.files[0])

    }

    return formData
    
  
   }
   const [uploadedImg, setuploadedImg] = useState(null)
    function hanleImagePreview(e){
        console.log(e.target.files[0]);
      let imgSrc=  URL.createObjectURL(e.target.files[0])
      setuploadedImg(imgSrc)

    }

    function handleCloseImg(){
        setuploadedImg(null)
        // input .value = null
        image.current.value= null
    }

  function updatePost(){
    axios.put(`https://route-posts.routemisr.com/posts/${postId}` , prepareData() ,{
        headers:{
        Authorization : ` Bearer ${localStorage.getItem('token')}`
    }
    })
  }
const{data , mutate:handelupdatePost} = useMutation({
  mutationFn:updatePost,
  onSuccess:()=>{
        if(body.current){
                      body.current.value=null 
        }

        if(image.current){
          image.current.value =null
       
        }
         setuploadedImg(null)
    toast.success(' post update successfully')
     query.invalidateQueries({queryKey:['getPosts']})
    query.invalidateQueries({queryKey:['getProfilePost']})
    query.invalidateQueries({queryKey:['getSinglePost' , postId]})
  }
})

  return (
    <>
     <Dropdown>
      <Button aria-label="Menu" variant="secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
</svg>

      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu onAction={(key) => {
          console.log(`Selected: ${key}`)
          if(key==='edit-file'){
            setisOpen(true)
          }
        }}>
         
          <Dropdown.Item id="edit-file" textValue="Edit file">
            <Label>Edit post</Label>
          </Dropdown.Item>
          <Dropdown.Item onClick={handelDeletePost} id="delete-file" textValue="Delete file" variant="danger">
            <Label>Delete post</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>



      <Modal isOpen={isOpen} onOpenChange={setisOpen}>
 
     <Modal.Backdrop>
            <Modal.Container >
              <Modal.Dialog>
                <Modal.CloseTrigger />
                <Modal.Header>
                 
                  {/* <Modal.Heading>
                    Size: {size.charAt(0).toUpperCase() + size.slice(1)}
                  </Modal.Heading> */}
                </Modal.Header>
                <Modal.Body>
                     <Modal.Body>
                              <div className='flex gap-4 items-end'>
                                    <TextArea
                                    ref={body}
                      aria-label="Quick project update"
                      className="h-32 w-96"
                      placeholder="What is on your mind ....?"
                    />
                
                    <Label htmlFor={postId}>
                        
                    <Input ref={image} onChange={hanleImagePreview} type="file" id={postId} hidden />
                
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                
                    </Label>
                
                
                
                              </div>
                 {uploadedImg && <div className='relative'>
                             <img src={uploadedImg} alt="" />
                             <svg  onClick={handleCloseImg} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute top-0 right-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                
                
                              </div>}
                            </Modal.Body>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={handelupdatePost} slot="close">Updata Post</Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
  </Modal>
    </>
  )
}
