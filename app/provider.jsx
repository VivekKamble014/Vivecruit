"use client";
import { UserDetailsContext } from '@/context/UserDetailsContext';
import { supabase } from '../services/supabaseClient';
import React ,{useContext, useEffect, useState} from 'react'

export default function Provider({children}) {
    console.log("Provider Component Rendered");
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    CreateNewUser();
  },[])  

  const CreateNewUser=async()=>{
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        setLoading(false);
        return;
      }

      if (!authUser) {
        console.log('No authenticated user found');
        setLoading(false);
        return;
      }

      console.log('Authenticated user:', authUser.email);

      // Logic to create a new user
      let { data: Users, error } = await supabase
        .from('Users')
        .select("*")
        .eq('email', authUser.email);
      
      console.log("User Data from DB:", Users);
      
      //if not created then create a new user
      if(Users?.length==0){
        console.log('Creating new user in database...');
        const {data, error: insertError} = await supabase.from("Users").insert([
          {
            name: authUser.user_metadata?.name,
            email: authUser.email,
            picture: authUser.user_metadata?.picture,
            plan: 'Free',
            interviews_created: 0,
            interviews_limit: 1
          }
        ])
        
        if (insertError) {
          console.error('Error creating user:', insertError);
        } else {
          console.log("New User Created:", data);
          setUser(data[0]);
        }
      } else {
        console.log('User found in database:', Users[0]);
        setUser(Users[0]);
      }
    } catch (error) {
      console.error('Error in CreateNewUser:', error);
    } finally {
      setLoading(false);
    }
  }  
  return (
    <UserDetailsContext.Provider value={{user, setUser, loading}}>
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