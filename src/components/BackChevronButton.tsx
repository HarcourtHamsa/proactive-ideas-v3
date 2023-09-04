import React from 'react'
import { useRouter } from 'next/router'
import { IoChevronBack } from 'react-icons/io5'

function BackChevronButton() {
    const router = useRouter();
    return (
        <div className='flex items-center gap-1 mb-2' onClick={() => router.back()}>
            <div className='w-8 h-8 bg-white border flex justify-center items-center rounded-full cursor-pointer'>
                <IoChevronBack size={20} />
            </div>
            <p>Back</p>
        </div>
    )
}

export default BackChevronButton