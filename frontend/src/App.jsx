import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Feed from './pages/Feed'
import QuestionDetail from './components/community/QuestionDetail'
import Layout from './pages/Layout'
import Profile from './pages/Profile'
import RewardsPage from './pages/RewardsPage'
import { useQuery } from '@tanstack/react-query'
import { getAuthUser } from './lib/api'
import ProtectedRoute from './pages/ProtectedRoute'
import { Toaster } from "react-hot-toast";
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'



const App = () => {

  const { data, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser, 
  });

  const authUser = data?.user || data;

  console.log("authUser:", authUser);

  if (isLoading) return null;


  return (
    <>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/register' element={!authUser ? <Signup /> : <Navigate to="/feed" replace />} />
      <Route path='/login' element={!authUser ? <Signin /> : <Navigate to="/feed" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />}/>

      {/* community routes */}
      <Route element={<ProtectedRoute />} >
      <Route element={<Layout />} >
          <Route path='/feed' element={<Feed />} />
          <Route path="/feed/:id" element={<QuestionDetail />} />
          <Route path='/profile/:id' element={<Profile />} />
          <Route path='/rewards' element={<RewardsPage />} />

      </Route>    
</Route>
    </Routes>
    <Toaster/>
    </>
  )
}

export default App