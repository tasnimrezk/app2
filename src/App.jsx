import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Login from './Auth/Login/Login'
import Register from './Auth/Register/Register'
import Profile from './Components/Profile/Profile'
import Home from './Components/Home/Home'
import Notfound from './Components/NotFound/NotFound'
import { CounterContextProvider } from './Context/CounterContext'
import { AuthContextProvider } from './Context/AuthContext'
import ProtectRoute from './Components/ProtectRoute/ProtectRoute'
import ProtectAuth from './Components/ProtectAuth/ProtectAuth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import{ ReactQueryDevtools }from'@tanstack/react-query-devtools'
import PostDetails from './Components/PostDetails/PostDetails'
import { ToastContainer } from 'react-toastify'

const queryClient= new QueryClient()
function App() {

let route=  createBrowserRouter([
    {path:'' , element : <Layout/> , children:[
      {index: true , element : <ProtectAuth><Login/></ProtectAuth>},
       {path:'register' , element : <ProtectAuth><Register/></ProtectAuth>},
        {path:'profile' , element : <ProtectRoute> <Profile/> </ProtectRoute>},
         {path:'home' , element :<ProtectRoute> <Home/></ProtectRoute>},
         {path:'postDetails/:id' , element :<ProtectRoute><PostDetails/></ProtectRoute>}, 
        
          {path:'*' , element : <Notfound/>},
    ]} ,
  ])
 

  return <>


<QueryClientProvider client={queryClient}>
  <AuthContextProvider>
  <CounterContextProvider>
  
  <RouterProvider router={route} />
  <ReactQueryDevtools/> 
  <ToastContainer/>
</CounterContextProvider>

</AuthContextProvider>
</QueryClientProvider>
  
  </>
}

export default App
