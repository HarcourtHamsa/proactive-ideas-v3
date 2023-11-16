import React, { useEffect, useState } from 'react'
import Image from 'next/image';

import { useDispatch } from 'react-redux'

import { IoCaretDownOutline, IoChevronDown, IoClose, IoMenu } from 'react-icons/io5'

import Menu from "./Menu"

import Logo from './Logo'
import { useRouter } from 'next/router';
import Link from 'next/link';
import usePreviousRoute from '@/hooks/usePreviousPath';

import useRole from '@/hooks/useRole';
import { Role } from '../../types/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import useCookie from '@/hooks/useCookie';
import { deleteCookie } from 'cookies-next';
import { useSession, signOut } from "next-auth/react"




function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data } = useSession()
  const role = useRole();
  const [dropDownIsOpen, setDropDownIsOpen] = useState(false);
  const [resourcesSubMenuIsOpen, setResourcesSubMenuIsOpen] = useState(false)
  const [navIsOpen, setNavIsOpen] = useState(false);
  const [country, setCountry] = useState<null | string>(null)
  const [_, setPrevPath] = usePreviousRoute()
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const cookie = useCookie()


  const { getData } = useLocalStorage()
  const geo = getData('geo');


  const logout = () => {
    setDropDownIsOpen(false)
    deleteCookie('tkn')
    signOut()
    // window.location.reload()
  }


  const generateAVI = () => {
    // Check if 'cookie.user' exists
    if (!cookie?.user) {
      return;
    }

    // Split 'user.name' by spaces and get the first and last characters
    const arr = (cookie.user.name ?? '').split(" ");
    const firstChar = arr[0]?.charAt(0);
    const lastChar = arr[1]?.charAt(0) || firstChar;

    // If 'firstChar' and 'lastChar' exist, return them; otherwise, return the first letter of 'user.email' in uppercase
    return firstChar && lastChar ? firstChar + lastChar : cookie.user.email?.charAt(0).toUpperCase();
  };


  useEffect(() => {
    setCountry(geo?.country)
  }, [])

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    setVisible(prevScrollPos > currentScrollPos);
    setPrevScrollPos(currentScrollPos);
    setDropDownIsOpen(false)
    setResourcesSubMenuIsOpen(false)
  };

  const handleCloseModals = () => {
    // if (dropDownIsOpen){
    //   setDropDownIsOpen(false)
    // }

    // if (resourcesSubMenuIsOpen){
    //   setResourcesSubMenuIsOpen(false)
    // }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // window.addEventListener('click', handleCloseModals);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // window.removeEventListener('click', handleCloseModals);
    };
  }, [prevScrollPos, visible]);


  return (
    <nav className={`px-4 navbar sm:px-4 py-2 md:py-2 fixed top-0 left-0 right-0 transition-transform duration-700 ease-in-out border-b z-20 bg-[#FAF7ED] ${visible ? 'block' : 'hidden'}`}>
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <div className='flex items-center'>
          <div className='md:-translate-y-0 -translate-x-5 w-fit block'>
            <Logo />
          </div>

          {/* desktop nav */}
          <div className="items-center ml-20 justify-center hidden w-full lg:flex md:w-auto md:order-1" id="mobile-menu-2">
            <ul className="flex flex-col md:pt-2.5 text-center fixed top-0 left-0 right-0 bottom-0 md:static p-4 md:flex-row md:space-x-4 md:mt-0 md:border-0">
              <li>
                <Link href="/" className="block py-5 pl-3 pr-4 hover:text-[#F08354]  md:bg-transparent md:p-0 text-black" aria-current="page">Home</Link>
              </li>

              <li className='hover:text-[#F08354]'>
                <Link href="/courses" className=" px-4 w-[100%] block " aria-current="page">Courses</Link>
              </li>
              <li className='hover:text-[#F08354]'>
                <Link href="/blog" className=" px-4 w-[100%] block " aria-current="page">Blog</Link>
              </li>
              <li className='hover:text-[#F08354]'>
                <Link href="/ideas" className=" px-4 w-[100%] block " aria-current="page">Ideas</Link>
              </li>

              <li>
                <div
                  onClick={() => setResourcesSubMenuIsOpen(!resourcesSubMenuIsOpen)}
                  className="py-5 cursor-pointer pl-3 hover:text-[#F08354] pr-4 relative flex items-center gap-1 rounded md:bg-transparent md:p-0 text-black"
                  aria-current="page"
                  tabIndex={0}
                  // onBlur={() => {
                  //   if (resourcesSubMenuIsOpen) {
                  //     setResourcesSubMenuIsOpen(false)
                  //   }
                  // }}
                >Resources <IoCaretDownOutline /> </div>
                {resourcesSubMenuIsOpen && (
                  <div className='absolute w-[250px] z-30 -bottom-36 translate-y-6 -translate-x-4 bg-white rounded shadow-xl overflow-hidden'>
                    <ul className='pl-0 ml-0 text-left'>
                      <li className=' py-4 hover:bg-[#F08354] hover:text-white'>
                        <Link href="/certification" className=" px-4 w-[100%] block " aria-current="page">Certification</Link>
                      </li>
                      <li className='px-4 py-4 hover:bg-[#F08354] hover:text-white'>
                        <Link href="/verify" className="block py-5 pl-3 pr-4  rounded md:bg-transparent md:p-0" aria-current="page">Verify</Link>
                      </li>
                      <li className='px-4 py-4 hover:bg-[#F08354] hover:text-white'>
                        <Link href="/contact" className="block py-5 pl-3 pr-4  rounded md:bg-transparent md:p-0" aria-current="page">Contact</Link>
                      </li>

                    </ul>
                  </div>
                )}

              </li>

            </ul>
          </div>

        </div>

        <div className="flex items-center md:order-2 gap-2">
          {cookie?.user ? <button
            type="button"
            onClick={() => setDropDownIsOpen(!dropDownIsOpen)}
            // onBlur={() => {
            //   if (dropDownIsOpen) {
            //     setDropDownIsOpen(false)
            //   }
            // }}
            className="flex mr-3 bg-gray-800 relative rounded-full md:mr-0 focus:ring-4 focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
            <span className="sr-only">Open user menu</span>
            <div className='w-10 h-10 rounded-full bg-[#404eed] flex justify-center items-center'>
              <p className='text-white'>{generateAVI()}</p>
            </div>
            {/* <Image className="w-12 h-12 rounded-full" src={userAVI} alt="user photo" /> */}
          </button> : <>
            <button onClick={() => router.push("/auth/login")} className='px-4 py-2  rounded hover:opacity-80  hidden lg:block'>Sign In </button>
            <button onClick={() => router.push("/auth/register")} className='px-4 py-2  rounded hover:opacity-80 text-white bg-[#F08354] hidden lg:block'>Sign Up</button>
            <div className='overflow-hidden'>
              <Image src={`https://flagsapi.com/${country}/shiny/64.png`} className='bg-cover rounded-full clip' alt='country flag' width={50} height={50} />
            </div>
          </>
          }





          {dropDownIsOpen &&
            <div className="z-50 absolute my-4  right-10 top-12 text-base list-none divide-y divide-gray-100 rounded shadow bg-white" id="user-dropdown">
              <div className="px-4 py-3">


                <span className="block text-gray-900">{cookie?.user?.name}</span>
                <span className="block font-medium text-gray-500 truncate">{cookie?.user?.email}</span>
              </div>
              <ul className="py-2 ul__unset" aria-labelledby="user-menu-button">
                {role !== Role.user &&
                  <li>
                    <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 list-none">Dashboard</Link>
                  </li>
                }
                <li>
                  <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 list-none">My Profile</Link>
                </li>
                <li onClick={logout}>
                  <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 list-none ">Sign out</Link>
                </li>
              </ul>
            </div>
          }




          <div onClick={() => setNavIsOpen(!navIsOpen)} className='p-2 lg:hidden rounded'>
            {navIsOpen
              ? <div className='w-10 h-10 bg-white flex items-center justify-center rounded-full border shadow-2xl'>
                <IoClose className='text-gray-900 z-20 lg:hidden' size={25} />
              </div> :
              <Menu />
            }
          </div>

        </div>




        {/* mobile nav */}
        {
          navIsOpen &&
          <div className='w-[90%] mx-auto h-fit py-4 lg:hidden rounded border bg-white shadow-2xl absolute top-20'>
            <ul className='space-y-4 pt-4 ul__unset'>
              <li>
                <Link href="/" className="border-b px-4 pb-4 w-[100%] block list-none" aria-current="page">Home</Link>
              </li>

              <li className='hover:text-[#F08354]'>
                <Link href="/courses" className="border-b  pb-4 px-4 w-[100%] block list-none" aria-current="page">Courses</Link>
              </li>
              <li className='hover:text-[#F08354]'>
                <Link href="/blog" className="border-b  pb-4 px-4 w-[100%] block list-none" aria-current="page">Blog</Link>
              </li>
              <li className='hover:text-[#F08354]'>
                <Link href="/ideas" className="border-b pb-4  px-4 w-[100%] block list-none" aria-current="page">Ideas</Link>
              </li>
              <li className='hover:text-[#F08354]'>
                <Link href="/certification" className="border-b pb-4 px-4 w-[100%] block list-none" aria-current="page">Certification</Link>
              </li>
              <li className='hover:text-[#F08354]'>
                <Link href="/verify" className="border-b pb-4  px-4 w-[100%] block list-none" aria-current="page">Verify</Link>
              </li>
              <li className='hover:text-[#F08354]'>
                <Link href="/contact" className="border-b pb-4 px-4 w-[100%] block list-none" aria-current="page">Contact</Link>
              </li>
            </ul>
            {cookie?.user ?
              <button
                onClick={logout}
                className='py-2 bg-[#11393C] w-[90%] rounded text-white hover:opacity-80 mt-4 mx-auto translate-x-4'>
                Sign Out
              </button> :
              <button
                onClick={() => router.push("/auth/login")}
                className='py-2 bg-[#11393C] w-[90%] rounded text-white hover:opacity-80 mt-4 mx-auto translate-x-4'>
                Sign In
              </button>}

          </div>
        }


      </div>
    </nav >

  )
}

export default Navbar


