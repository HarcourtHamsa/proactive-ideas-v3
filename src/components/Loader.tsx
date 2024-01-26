import React from 'react'
import Logo from './Logo'

function Loader() {
    return (
        <div className='w-screen h-screen flex justify-center items-center  bg-[#FAF7ED]'>

            {/* <div className='lg:w-[300px] w-[90%] h-[200px] flex justify-center items-center mx-auto'>
                <span className="md:-translate-x-12">
                    <Logo />
                </span>

            </div> */}

            <div className='bg-red-100 lg:w-[300px] w-[60%] text-center relative'>
                
                <span className=" -translate-x-[120%] absolute lg:left-[48%] left-[45%] -top-[60px]">
                    <Logo />
                </span>
              
                <div className="linez">
                    <div className="inner"></div>
                </div>
            </div>

            {/* <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg> */}
        </div>
    )
}

export default Loader