import React from 'react'
import { useRouter } from 'next/router'
import { IoClose } from 'react-icons/io5'


function Activity() {
    const router = useRouter()
    return (
        <div className='bg-[#121722]'>
            <div className='h-14 border-b fixed top-0 left-0 right-0 z-20 border-b-[#283245] bg-[#121722] place-items-center flex'>
                <div className='flex items-center gap-4 container mx-auto'>
                    {/* left column */}
                    <div className='w-10 h-10 rounded-full hover:bg-white/80 duration-150 cursor-pointer place-items-center flex justify-center' onClick={() => router.back()}>
                        <IoClose size={30} className="cursor-pointer text-gray-600" />
                    </div>
                    <span className='text-white'>Set marketing goals overview</span>
                </div>
            </div>

            <div className='min-h-screen h-fit bg-[#121722] pt-36'>
                <div className='w-[90%] md:w-[60%] mx-auto'>
                    <div className='border-b-[#283245] text-white border-b pb-4'>
                        <h1 className="mb-4 text-2xl font-bold text-white leading-snug lg:font-extrabold lg:text-5xl lg:leading-none">Set marketing goals overview</h1>
                        <span className="text-gray-400 mr-2">By Proactive Ideas
                        </span>
                        <span className="text-sm text-gray-400">Published {new Date().toLocaleDateString()}</span>
                    </div>


                    <section className='space-y-8 py-10'>
                        <div className='text-white'>
                            <h2 className="mb-4 text-2xl font-bold leading-snug lg:font-extrabold lg:text-3xl lg:leading-none">Why SMART goals matter</h2>
                            <p>This lesson will introduce you to SMART goals. Understand SMART goals and set SMART marketing goals for your business.</p>

                            <ul className='list-disc'>
                                <li>Why is it important to set goals?</li>
                                <li>What is a SMART goal?
                                    <ul className='list-disc ml-10'>
                                        <li>
                                            Define specific in a SMART marketing goal
                                        </li>
                                        <li>Define measurable in a SMART marketing goal</li>
                                        <li>Define achievable in a SMART marketing goal</li>
                                        <li>Define relevant in a SMART marketing goal</li>
                                        <li>Define time-bound in a SMART marketing goal</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div className='text-white'>
                            <h2 className="mb-4 text-2xl font-bold leading-snug lg:font-extrabold lg:text-3xl lg:leading-none">Why SMART goals matter</h2>
                            <p>This lesson will introduce you to SMART goals. Understand SMART goals and set SMART marketing goals for your business.</p>

                            <ul className='list-disc'>
                                <li>Why is it important to set goals?</li>
                                <li>What is a SMART goal?
                                    <ul className='list-disc ml-10'>
                                        <li>
                                            Define specific in a SMART marketing goal
                                        </li>
                                        <li>Define measurable in a SMART marketing goal</li>
                                        <li>Define achievable in a SMART marketing goal</li>
                                        <li>Define relevant in a SMART marketing goal</li>
                                        <li>Define time-bound in a SMART marketing goal</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* <SwipableCards /> */}

                    <div className='space-x-4 py-6'>
                        {/* <button className='border border-[#404eed] text-[#404eed] px-4 py-3 rounded-md'>Take Accessment</button> */}
                        <button className='bg-[#404eed] shadow-md px-4 py-3 rounded-md text-white' onClick={() => router.back()}>Complete Lesson</button>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Activity