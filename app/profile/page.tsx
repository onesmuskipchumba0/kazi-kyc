'use client';
import React from 'react'
import { UserProfile, useClerk, useUser } from '@clerk/nextjs'
function page() {
    const { loaded } = useClerk();
    const { user, isLoaded, isSignedIn } = useUser();
    !user || !isLoaded || !isSignedIn ? (
        <span className='loading loading-spinner loading-lg'></span>
    ) : (
        null
    )
  return (
    <div className='relative flex flex-1  items-center justify-center w-full '>
        {loaded ? (
            <UserProfile routing='hash'/>
        ): (
            <span className='loading loading-spinner loading-lg'></span>
        )}
    </div>
  )
}

export default page
