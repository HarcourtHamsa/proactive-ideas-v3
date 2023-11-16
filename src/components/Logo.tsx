import React from 'react'
import Image from 'next/image'
import logo from "../assets/idea.webp"
import Link from 'next/link'

const Logo = ({ color }: { color?: string }) => {
    return (
        <Link href="/"  className='flex'>
            <Image
                src={logo}
                className="w-[30px] h-[40px] lg:translate-x-20 translate-x-10 top-0 left-0 bottom-0 right-0"
                alt="Proactive Ideas Logo"
                height={20}
                width={20}
            />
        </Link>



    )
}

export default Logo