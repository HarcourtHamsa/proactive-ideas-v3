import React from 'react'
import Logo from './Logo'

function Loader() {
    return (
        <div className='w-screen h-screen flex justify-center items-center  bg-[#FAF7ED]'>

            <div className='lg:w-[300px] w-[90%] h-[200px] flex justify-center items-center mx-auto'>
                <span className="loader"></span>
            </div>

            {/* <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg> */}
        </div>
    )
}

export default Loader