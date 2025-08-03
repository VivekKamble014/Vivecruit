"use client";
import { UserDetailsContext } from '@/context/UserDetailsContext';
import { supabase } from '../services/supabaseClient';
import React ,{useContext, useEffect, useState} from 'react'

export default function Provider({children}) {
    console.log("Provider Component Rendered");
  const [user, setUser] = useState();
  useEffect(()=>{
    CreateNewUser();


  },[])  

  const CreateNewUser=()=>{
    supabase.auth.getUser().then(async({data:{user}})=>{
  // Logic to create a new user
  let { data: Users, error } = await supabase
  .from('Users')
  .select("*")
  .eq('email', user?.email);
  
  console.log("User Data:", Users);
  //if not created then create a new user

  if(Users?.length==0){
   const {data,error}= await supabase.from("Users").insert([
      {
        name: user?.user_metadata?.name,
        email:user?.email,
        picture:user?.user_metadata?.picture
      }
    ])
    console.log("New User Created:", data);
    setUser(data);
    return;
  
  }
  setUser(Users[0]);

}) 


  }  
  return (
    
    <UserDetailsContext.Provider value={{user,setUser}}>

    <div>
    {children}  
    </div>
    </UserDetailsContext.Provider>
  )
}

export const useUser=()=>{
const context= useContext(UserDetailsContext);
return context;
}