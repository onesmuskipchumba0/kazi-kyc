'use client';
import { SignIn, useClerk, useUser } from '@clerk/nextjs';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function SignInComponent() {
  const { loaded } = useClerk();
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  // Create user after successful sign-in
  useEffect(() => {
    const createUserIfNeeded = async () => {
      if (isSignedIn && user) {
        try {
          console.log('User signed in, creating user profile...');
          const response = await fetch('/api/user/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const result = await response.json();
            console.log('User profile processed:', result);
            
            // Redirect to profile page or home page
            setTimeout(() => {
              router.push('/profile');
            }, 1000);
          } else {
            console.error('Failed to create user profile');
          }
        } catch (error) {
          console.error('Error creating user profile:', error);
        }
      }
    };

    createUserIfNeeded();
  }, [isSignedIn, user, router]);

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="flex-1 flex justify-center items-center bg-green-200 flex-col pb-12">
        <div className='relative w-[160px] h-[160px] overflow-hidden rounded-full items-center border-blue-500 border-4'>
          <Image 
            src={"/z.png"}
            fill
            alt='Kazi KYC logo'
            className='object-contain'
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
          {loaded ? (
            <SignIn
              routing='hash'
              appearance={{
                elements: {
                  card: 'w-full h-[60vh] shadow-lg rounded-lg',
                },
              }}
              afterSignInUrl="/profile" // Redirect to profile after sign-in
              redirectUrl="/profile"    // Redirect after successful sign-in
            />
          ) : (
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