'use client';
import React from 'react'
import { SignedOut, SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import { FaLock } from 'react-icons/fa'
import Image from 'next/image';
function Navbar() {
    const {user, isLoaded, isSignedIn} = useUser();

    !isLoaded || !isSignedIn || !user? (
      <>
          <div className='flex w-full justify-center items-center py-2'>
            <span className='loading loading-ring loading-xl'></span>
          </div>
      </>
    ) : null;


  return (
    <div className='w-fit min-w-fit'>
      <ul className='menu shadow-md min-h-screen bg-green-50 pt-4'>
        <div className='relative flex flex-col justify-center items-center w-full'>
            <p className='text-lg font-bold pl-2'>Kazi KYC</p>
            <div className='divider-accent divider w-1/4 self-center pt-0 mt-0'></div>
        </div>
        <li><a href="/">Home</a></li>
        <li><a href="/about">How it Works</a></li>
        <li><a href="/verify-id">Verify ID</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/work">Find Work</a></li>
        <li><a href="/workers">Browse Verified workers</a></li>
        <li><a href="/profile">Profile</a></li>
        <div className='divider'></div>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="https://github.com/onesmuskipchumba0/kazi-kyc">Github</a></li>
        <div className='divider'></div>
        {user ? (
          <div className='flex flex-col w-36 items-center space-y-4 py-4'>
            <Image
              src={user.imageUrl}
              width={32}
              height={32}
              alt='Profile picture'
              className='rounded-full'
            />
            <span className='text-center'>Welcome back, <span className='font-semibold'>{user.fullName}</span></span>
          </div>
        ): (
          <div className='flex w-full justify-center items-center py-2'>
            <span className='loading loading-ring loading-xl'></span>
          </div>
        )}
        <div className='btn bg-green-300 hover:bg-green-400 transition-all ease-in text-gray-600 flex flex-row space-x-2 items-center justify-center '>
        <SignOutButton/>
        <FaLock color='orange'/>   
        </div>
      </ul>
    </div>
  )
}

export default Navbar
