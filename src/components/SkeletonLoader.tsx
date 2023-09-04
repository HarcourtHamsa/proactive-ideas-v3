import React from 'react'

function SkeletonLoader() {
    return (
        <div className='grid xl:grid-cols-4 gap-2 grid-cols-1 w-screen'>
            <div className='h-[350px] rounded border skeleton-loader'></div>
            <div className='h-[350px] rounded border skeleton-loader'></div>
            <div className='h-[350px] rounded border skeleton-loader'></div>
        </div>
    )
}

export default SkeletonLoader