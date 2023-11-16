import Image from 'next/image'
import React, { useState } from 'react'
import pointerPNG from "../assets/mail.webp"
import client from '@/lib/sanity'
import { subscribe } from '@/helper'
import Spinner from './Spinner'
import notify from './Notification'
import { ToastContainer } from 'react-toastify'

function Newsletter({ content }: any) {
    const [email, setEmail] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccessful, setIsSuccessful] = useState<boolean | null>(null)
    const [hasRegisteredButtonClick, setHasRegisteredButtonClick] = useState(false)
    const [msg, setMsg] = useState<string | null>(null)

    const subscribeToNewsletter = async () => {
        setIsLoading(true)

        await subscribe({ email })
            .then((res) => {
                setIsSuccessful(true)
                setMsg('Subscription Successful')
            })
            .catch((err) => {
                setMsg(err.response.data.message)
                setIsSuccessful(false)
            }).finally(() => {
                setIsLoading(false)
                setTimeout(() => {
                    setHasRegisteredButtonClick(true)
                    // setHasRegisteredButtonClick(false)
                }, 1000);


                setTimeout(() => {
                    setHasRegisteredButtonClick(false)
                    setIsSuccessful(null)
                    setMsg(null)
                }, 1000 * 4);
            })
    }

    return (
        <div>
            <ToastContainer />
            <div className='md:min-h-[400px] md:h-fit h-fit lg:top-10 md:left-[10%] lg:absolute md:w-[80%] w-[100%] p-4 flex justify-center items-center text-white bg-[#F08354] xl:bg-white xl:text-[#11393C] py-6 mx-auto md:rounded-xl z-10 rounded-none -translate-y-20  mt-20'>
                <div className='grid xl:grid-cols-3 grid-cols-1 w-[90%] -translate-y-10 xl:-translate-y-0 '>
                    <div className='col-span-2 space-y-4 xl:order-1 order-2'>
                        <h2 className='md:text-3xl text-2xl xl:font-bold'>{content[0]?.header}</h2>
                        <p className='md:w-[500px]'>
                            {content[0]?.subHeader}
                        </p>

                        <div className='md:relative space-y-4 md:space-y-0'>
                            <input placeholder='Enter your email' className='md:h-14 h-14 w-full text-black rounded-full px-8 border' value={email} onChange={(e) => setEmail(e.target.value)} />
                            <button className='py-3 lg:py-2 md:bg-[#11393C] bg-[#11393C] w-full md:w-[inherit] hover:opacity-80 px-4 rounded-full text-white md:absolute whitespace-nowrap right-2 flex items-center justify-center top-2 md:top-1.5 xl:top-2' onClick={subscribeToNewsletter}>
                                {isLoading && <Spinner />} Join our community
                            </button>
                        </div>

                       

                        {hasRegisteredButtonClick ?
                            isSuccessful === true ?
                                <div className='border px-8 w-fit border-green-200 rounded-full py-2 bg-green-50 text-green-800'>
                                    {msg}
                                </div> :
                                <div className='border px-8 w-fit border-red-200 rounded-full py-2 bg-red-50 text-red-800'>
                                    {msg}
                                </div> :
                            null}






                    </div>
                    <div className='self-center flex justify-center xl:order-2 order-1'>
                        <Image src={pointerPNG} alt="" className='scale-50 block xl:scale-100 lg:hidden xl:block' />
                    </div>
                </div>
            </div>

            <div className='xl:h-[400px] h-fit top-10 xl:left-[10%] lg:top-[20%] absolute translate-x-10 -translate-y-0 rounded-xl xl:w-[80%] w-[100%] xl:bg-[#F08354]  bg-white'></div>


        </div>
    )
}

export default Newsletter
