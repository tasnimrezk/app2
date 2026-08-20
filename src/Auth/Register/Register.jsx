import React, { useContext, useRef, useState } from 'react'
import { Button, Input } from '@heroui/react';
import {Label, ListBox, Select} from "@heroui/react";
import { useForm } from 'react-hook-form';
import { Schema } from '../../Schema/RegisterSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';



export default function Register() {

 let {setuserToken}= useContext(AuthContext)


 let navigate=   useNavigate()

  const [apiError, setapiError] = useState(null)

    const [isLoading, setisLoading] = useState(false)

const {register , handleSubmit , setError , formState}=  useForm({
    defaultValues:{
    name: '',
    username:'' , 
    email:'',
    password:'',
    rePassword:'',
    dateOfBirth:'',
    gender:''
    },
    mode:'onBlur' ,
    resolver : zodResolver(Schema)
  })




 
function submitForm(userData){
    
  setisLoading(true)

 console.log(userData);
 
 axios.post('https://route-posts.routemisr.com/users/signup' , userData)
 .then((response)=>{ console.log(response.data.data.token);
  

  if(response.data.message ==='account created'){
    // navigate login token home 

    setuserToken(response.data.data.token)
    localStorage.setItem('token' , response.data.data.token)


    navigate('/')

  }




 })
 .catch((error)=>{
  console.log(error.response.data.message);

  setapiError(error.response.data.message)



 })
 .finally(()=>{ 
  setisLoading(false)
  })
 

}

  return <>

 
  <div className='className="min-h-screen bg-gradient-to-br from-[#020b2d] via-[#06245c] to-[#0a5ca8]"'>
    <div className="bg-white w-2xl mx-auto rounded-xl  shadow-2xl p-6  ">
    <h2 className='className="text-[#08b9e8] text-3xl font-bold text-center mb-6"'>Register Now</h2>
    <form className="bg-[#031536]/95 rounded-xl shadow-2xl p-5 border border-[#08b9e8]/30 my-2" onSubmit={handleSubmit(submitForm)}  >

<div className="flex flex-col gap-7">
  {/* name input */}
  <div>
    <Input {...register('name')}   aria-label="Name" className="w-full" placeholder="Enter your name" />

{formState.errors.name && formState.touchedFields.name ? <p className='bg-gray-200 text-red-400 py-2 text-center'>{formState.errors.name?.message}</p>
 : null}
  </div>



  {/* user NAme input */}
  <div>
    <Input {...register('username')}   aria-label="username" className="w-full" placeholder="Enter your username" />

{formState.errors.username && formState.touchedFields.username ? <p className='bg-gray-200 text-red-400 py-2 text-center'>{formState.errors.username?.message}</p>
 : null}
  </div>
  


{/* email */}
  <div>
    <Input {...register('email' )}   aria-label="Email" className="w-full" placeholder="Enter your Email" />
    {formState.errors.email && formState.touchedFields.email ? <p className='bg-gray-200 text-red-400 py-2 text-center'>{formState.errors.email?.message}</p>
 : null}
  </div>


{/* pass */}

<div>
  <Input {...register('password')}     type='password' aria-label="Password" className="w-full" placeholder="Enter your Password" />

{formState.errors.password && formState.touchedFields.password ? <p className='bg-gray-200 text-red-400 py-2 text-center'>{formState.errors.password?.message}</p>
 : null}
</div>

{/* repass */}
<div>
  <Input  {...register('rePassword')}   type='password' aria-label="rePassword" className="w-full" placeholder="Enter your rePassword" />
{formState.errors.rePassword && formState.touchedFields.rePassword ? <p className='bg-gray-200 text-red-400 py-2 text-center'>{formState.errors.rePassword?.message}</p>
 : null}
</div>

<div className="flex gap-4">

<div className='w-full'>
    <Input {...register('dateOfBirth')}    type='date' aria-label="dateOfBirth" className="w-full" placeholder="Enter your dateOfBirth" />
{formState.errors.dateOfBirth  && formState.touchedFields.dateOfBirth? <p className='bg-gray-200 text-red-400 py-2 text-center'>{formState.errors.dateOfBirth?.message}</p>
 : null}
</div>

<div className='w-full'>
<select {...register('gender')}  defaultValue={'Choose a Gender'}  className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body">
  {/* <option disabled selected value='gender' >Choose a Gender</option> */}
  <option value="male">Male</option>
  <option value="female">Female</option>
  
</select>

  {formState.errors.gender && formState.touchedFields.gender ? <p className='bg-gray-200 text-red-400 py-2 text-center'>{formState.errors.gender?.message}</p>
 : null}

</div>
</div>
</div>

{ apiError && <div className='bg-red-200 text-white text-center font-bold py-2 my-3 rounded-sm'>
{apiError}
</div> }

<Button type='submit' isDisabled={isLoading} className='my-5 w-full'> {isLoading ? 'Loading...' :' Submit'} </Button>

    </form>
    </div>

  </div>
  
  
  </>
}

