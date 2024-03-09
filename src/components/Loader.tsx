import React from 'react'
import logo from "@/assets/idea.webp"
import Image from 'next/image'

function Loader() {
    return (
        <div className='w-screen h-screen flex justify-center items-center  bg-[#FAF7ED]'>
            <div className='lg:w-[300px] w-[60%] text-center relative'>

                <div className='w-full flex justify-center'>
                    <Image
                        src={logo}
                        className="w-[150px] h-[150px]"
                        alt="Proactive Ideas Logo"
                     
                    />
                </div>

                <div className="linez">
                    <div className="inner"></div>
                </div>
            </div>
        </div>
    )
}

export default Loader