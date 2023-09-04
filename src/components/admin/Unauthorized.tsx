import { useRouter } from 'next/router'
import React from 'react'


function Unauthorized() {
    const router = useRouter()

    return (
        <div className='bg-[#FBF7F4] w-screen h-screen flex justify-center items-center'>
            <div className='space-y-4 text-center'>
                <h1 className="mb-4 text-3xl  mt-10 font-semibold leading-snug lg:font-extrabold lg:text-5xl lg:leading-none  lg:mb-4">Permission Denied</h1>
                <p>You are not authorized to view this page</p>
                <button 
                className='border py-2 px-4 rounded bg-[#F08354] text-white' 
                onClick={() => router.push('/')}>Go Home</button>
            </div>

        </div>
    )
}

export default Unauthorized