'use client';
import { SignIn } from '@clerk/nextjs';
import { useClerk } from '@clerk/nextjs';
import React from 'react';
import Image from 'next/image';

function SignInComponent() {
  const {loaded} = useClerk();
  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="flex-1 flex justify-center items-center  bg-green-200 flex-col pb-12">
        <div className='relative w-[160px] h-[160px] overflow-hidden rounded-full items-center border-blue-500 border-4'>
            <Image 
            src={"/logo.jpg"}
            fill
            alt='Kazi KYC logo'
            className='object-cover'
            priority
            />
        </div>
        <p className="text-lg font-semibold">Kazi KYC</p>
        <p className='mb-12 font-thin'>Build Trust. Get Hired. Work Smarter.</p>
        <p>Join thousands of trusted gig workers. Start building your digital identity today.</p>
      </div>
      {/* Right Section with SignIn */}
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full max-w-[500px] px-4">
          { loaded ? (
            <SignIn
            routing='hash'
              appearance={{
                elements: {
                  card: 'w-full h-[60vh] shadow-lg rounded-lg',
                },
              }}
            />
          ): (
                <div className='flex w-full justify-center items-center py-2'>
                  <span className='loading loading-ring loading-xl'></span>
                </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignInComponent;
