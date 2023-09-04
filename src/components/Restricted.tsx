import { useRouter } from 'next/router';
import React from 'react'

function Restricted({ path }: { path: string }) {
    const router = useRouter();
    return (
        <div className='h-screen w-screen flex justify-center items-center'>

            <div className='text-center space-y-4'>
                <p className='text-lg'>Oops! Seems like you&apos;re not logged in</p>
                <button
                    className='py-3 bg-[#F08354] text-white px-4 rounded'
                    onClick={function () {
                        router.push(`/auth/login?next=${path}`)
                    }}>
                    Request Access
                </button>
            </div>
        </div>
    )
}

export default Restricted