import React from 'react'
import { SignedOut, SignInButton, SignOutButton } from '@clerk/nextjs'
import { FaLock } from 'react-icons/fa'
function Navbar() {
  return (
    <div>
      <ul className='menu shadow-md min-h-screen bg-green-50 pt-4'>
        <li><a href="">Home</a></li>
        <li><a href="">How it Works</a></li>
        <li><a href="">Verify ID</a></li>
        <li><a href="">Pricing</a></li>
        <li><a href="">Find Work</a></li>
        <li><a href="">Browse Verified workers</a></li>
        <li><a href="">Profile</a></li>
        <div className='divider'></div>
        <li><a href="">Contact</a></li>
        <li><a href="">About</a></li>
        <li><a href="">Github</a></li>
        <div className='divider'></div>
        <div className='btn bg-green-300 hover:bg-green-400 transition-all ease-in text-gray-600 flex flex-row space-x-2 items-center justify-center '>
        <SignOutButton/>
        <FaLock color='orange'/>   
        </div>
      </ul>
    </div>
  )
}

export default Navbar
