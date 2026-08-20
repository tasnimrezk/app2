import React, { useContext, useRef, useState } from 'react'
import { Button, Input } from '@heroui/react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../../Schema/loginSchema';
import { AuthContext } from '../../Context/AuthContext';



export default function Login() {
let {setuserToken}= useContext(AuthContext)
 let navigate=   useNavigate()

  const [apiError, setapiError] = useState(null)

    const [isLoading, setisLoading] = useState(false)

const {register , handleSubmit , setError , formState}=  useForm({
    defaultValues:{
  
    email:'',
    password:'',
 
    },
    mode:'onBlur' ,
    resolver : zodResolver(loginschema)
  })




 
function submitForm(userData){
    
  setisLoading(true)
 console.log(userData);
 
 axios.post('https://route-posts.routemisr.com/users/signin' , userData)
 .then((response)=>{
   console.log(response.data.data.token);
  

  if(response.data.message ==='signed in successfully'){
    // navigate login token home 

    setuserToken(response.data.data.token)
    localStorage.setItem('token' , response.data.data.token)


    navigate('/home')

  }




 })
 .catch((error)=>{
  console.log(error.response);

  setapiError(error.response.data.message)



 })
 .finally(()=>{ 
   setisLoading(false)
  })
 

}

  return <>

 
   <div className="min-h-screen p-6 bg-gradient-to-br from-[#020817] via-[#061a3a] to-[#0a3b68] flex justify-center items-start">

      <div className="w-full max-w-2xl bg-[#061426] rounded-xl shadow-2xl border border-[#08b9e8]/30 p-8">

        <h2 className="text-3xl font-bold text-[#08b9e8] text-center mb-8">
          Login Now
        </h2>

        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit(submitForm)}

       >

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

{ apiError && <div className='bg-red-200 text-white text-center font-bold py-2 my-3 rounded-sm'>
{apiError}
</div> }

<Button type='submit' isDisabled={isLoading} className='my-5 w-full'> {isLoading ? 'Loading...' :' Submit'} </Button>

</form>
    </div>

  </div>
  
 
  </>
}

