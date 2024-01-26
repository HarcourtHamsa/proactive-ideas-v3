import React from 'react'
import Image from 'next/image'
import logo from "../assets/idea.webp"
import Link from 'next/link'

const Logo = ({ color }: { color?: string }) => {
    return (
        <Link href="/"  className='flex'>
            <Image
                src={logo}
                className="w-[50px] scale-[180%] lg:translate-x-10 translate-x-2 top-0 left-0 bottom-0 right-0"
                alt="Proactive Ideas Logo"
                height={10}
                width={10}
            />
        </Link>



    )
}

export default Logo