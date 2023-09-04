import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import whiteLogo from "../assets/logo-white.png"
import logo from "../assets/logo.svg"
import Logo from './Logo'
import { IoLogoFacebook, IoLogoInstagram, IoLogoLinkedin } from 'react-icons/io5'


function Footer() {
    return (

        <footer className="p-4 bg-[#11393C] md:p-8 lg:p-10">
            <div className="mx-auto max-w-screen-xl text-center mt-32">
                <div className='w-fit mx-auto lg:-translate-x-0 -translate-x-0 my-4'>
                    <Image src={whiteLogo} alt='logo white variant' width={80} height={80} />
                </div>
                {/* <p className="my-6 text-gray-500 dark:text-gray-400">Open-source library of over 400+ web components and interactive elements built for better web.</p> */}
                <ul className="flex flex-wrap justify-center items-center mb-4 text-gray-300">
                    <li>
                        <Link href="/about" className="mr-4 hover:underline md:mr-6 ">About</Link>
                    </li>

                    <li>
                        <Link href="/certification" className="mr-4 hover:underline md:mr-6">Certification</Link>
                    </li>
                    <li>
                        <Link href="/blog" className="mr-4 hover:underline md:mr-6">Blog</Link>
                    </li>
                    <li>
                        <a href="https://recondite-olivine-a1c.notion.site/Proactive-Ideas-ec64b6ba755d4eefbb89f17696c4cacc" target='_blank' className="mr-4 hover:underline md:mr-6">Privacy Policy</a>
                    </li>

                    <li>
                        <Link href="/contact" className="mr-4 hover:underline md:mr-6">Contact</Link>
                    </li>
                </ul>
                <div className='grid-cols-3 grid w-fit mx-auto gap-4 mb-6'>
                    <Link href={'https://www.facebook.com/proactive.ideas'} target='_blank'>
                        <div className='w-12 h-12 bg-black/20 rounded-full cursor-pointer flex justify-center items-center'>
                            <IoLogoFacebook color='white' size={30} />
                        </div>
                    </Link>
                    <Link href={'https://instagram.com/proactive_ideas?igshid=ZDc4ODBmNjlmNQ=='} target='_blank'>
                        <div className='w-12 h-12 bg-black/20 rounded-full cursor-pointer flex justify-center items-center'>
                            <IoLogoInstagram color='white' size={30} />
                        </div>
                    </Link>

                    <Link href={'https://www.linkedin.com/company/proactive-ideas/'} target='_blank'>
                        <div className='w-12 h-12 bg-black/20 rounded-full cursor-pointer flex justify-center items-center'>
                            <IoLogoLinkedin color='white' size={30} />
                        </div>
                    </Link>
                </div>
                <span className="text-sm text-gray-300 sm:text-center">©2023 <a href="#" className="hover:underline">Proactive Ideas</a>. All Rights Reserved.</span>
            </div>
        </footer>

    )
}

export default Footer