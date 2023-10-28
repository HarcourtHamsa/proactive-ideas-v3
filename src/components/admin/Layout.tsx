import { Menu, Transition } from "@headlessui/react";
import { deleteCookie } from 'cookies-next';
import React, { useState } from "react";
import {
  IoChevronUp,
  IoChevronForward,
  IoClose,
} from "react-icons/io5";

import HMenu from "../Menu";
import UsersSVG from "../../components/SVGs/Users"
import HomeSVG from "../../components/SVGs/Home"
import MediaSVG from "../../components/SVGs/Media"
import ContentsSVG from "../../components/SVGs/Contents"
import CategorySVG from "../../components/SVGs/Category"
import SettingsSVG from "../../components/SVGs/Settings"
import LogoutSVG from "../../components/SVGs/Logout"
import NotificationSVG from "../../components/SVGs/Notification"
import Logo from "../Logo";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import useRole from "@/hooks/useRole";
import useAuth from "@/hooks/useAuth";
import { Role } from "../../../types/types";
import Unauthorized from "./Unauthorized";
import useCookie from "@/hooks/useCookie";
import { useSession, signOut } from "next-auth/react"


const links = [
  { href: "/account-settings", label: "My Profile" },
  { href: "/admin/drafts", label: "All Drafts" },
  { href: "/support", label: "Favourites" },
  { href: "/#", label: "Sign Out" },
];

function Layout({ children }: { children: React.ReactNode }) {
  const { data } = useSession();
  const [mobileNavIsOpen, setMobileNavIsOpen] = useState(false)
  const router = useRouter();
  const role = useRole();
  const cookie = useCookie();

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

  const logout = () => {

    
    router.push('/')
    deleteCookie('tkn')
    signOut({redirect: false})
  }

  return (
    <React.Fragment>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-[20%] h-screen transition-transform -translate-x-full lg:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-8  shadow border-[#EDEBE7] overflow-y-auto bg-[#FBF7F4]">
          <div className="w-fit lg:-translate-x-12  mb-8 -translate-y-0">
            <Logo />
          </div>



          <ul className="space-y-2  mt-4">
            <li className="">
              <Link
                href="/admin"
                className="flex items-center p-2  group font-normal rounded text-white hover:bg-gray-100/10"
              >
                <HomeSVG />
                <span className="ml-3 text-gray-900">
                  Dashboard
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users/list"
                className="flex items-center p-2  group font-normal rounded text-white hover:bg-gray-100/10"
              >

                <UsersSVG />
                <span className="flex-1 ml-3 whitespace-nowrap text-gray-900">
                  Users
                </span>
              </Link>
            </li>

            <li>
              <Link
                href="/admin/email/list"
                className="flex items-center p-2  group font-normal rounded text-white hover:bg-gray-100/10"
              >

                <UsersSVG />
                <span className="flex-1 ml-3 whitespace-nowrap text-gray-900">
                  Email List
                </span>
              </Link>
            </li>

            <Menu>
              {({ open }) => (
                <>
                  <Menu.Button
                    as="button"
                    className="flex items-center justify-between w-full py-2  group font-normal rounded text-white hover:bg-gray-100/10 over:bg-gray-700"
                  >
                    <div className="flex justify-between items-center gap-1 ml-1">
                      <MediaSVG />
                      <span className="flex-1 ml-3 whitespace-nowrap text-gray-900">
                        Media
                      </span>
                    </div>

                    {open ? (
                      <IoChevronUp size={20} className="text-gray-900" />
                    ) : (
                      <IoChevronForward size={20} className="text-gray-900" />
                    )}
                  </Menu.Button>
                  <Menu.Items as="div" className={"outline-none"}>
                    <Menu.Item as="div" className={"outline-none"}>
                      <Link
                        href="/admin/blogs"
                        className={`hover:bg-gray-100/10 py-3 rounded-md text-gray-900 block pl-14 `}
                      >
                        Blogs
                      </Link>
                    </Menu.Item>
                    <Menu.Item as="div" className={"outline-none"}>
                      <Link
                        href="/admin/ideas"
                        className={`hover:bg-gray-100/10 py-3 rounded-md text-gray-900 block pl-14 `}
                      >
                        Ideas
                      </Link>
                    </Menu.Item>
                    <Menu.Item as="div" className={"outline-none"}>
                      <Link
                        href="/admin/courses"
                        className={`hover:bg-gray-100/10 py-3 rounded-md text-gray-900 block pl-14 `}
                      >
                        Courses
                      </Link>
                    </Menu.Item>
                    <Menu.Item as="div" className={"outline-none"}>
                      <Link
                        href="/admin/quiz"
                        className={`hover:bg-gray-100/10 py-3 rounded-md text-gray-900 block pl-14 `}
                      >
                        Quiz
                      </Link>
                    </Menu.Item>
                    <Menu.Item as="div" className={"outline-none"}>
                      <Link
                        href="/admin/assessment"
                        className={`hover:bg-gray-100/10 py-3 rounded-md text-gray-900 block pl-14 `}
                      >
                        Assessment
                      </Link>
                    </Menu.Item>
                  </Menu.Items>
                </>
              )}
            </Menu>

            <li>
              <Link
                href="/admin/cms"
                className="flex items-center p-2  group font-normal rounded text-white hover:bg-gray-100/10"
              >
                <ContentsSVG />
                <span className="flex-1 ml-3 whitespace-nowrap text-gray-900">
                  Content Managment
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/categories/list"
                className="flex items-center p-2  group font-normal rounded text-white hover:bg-gray-100/10"
              >
                <CategorySVG
                />
                <span className="flex-1 ml-3 whitespace-nowrap text-gray-900">
                  Categories
                </span>
              </Link>
            </li>

            <li>
              <a
                href="#"
                className="flex items-center p-2  group font-normal rounded text-white hover:bg-gray-100/10"
              >
                <SettingsSVG
                />
                <span className="flex-1 ml-3 whitespace-nowrap text-gray-900">
                  Settings
                </span>
              </a>
            </li>

            <li>
              <Link
                onClick={logout}
                href="/"
                className="flex items-center p-2  group font-normal rounded text-white hover:bg-gray-100/10"
              >
                <>
                  <LogoutSVG
                  />
                  <span className="flex-1 ml-3 whitespace-nowrap text-gray-900">
                    Logout
                  </span>
                </>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <div className="lg:ml-[20%] bg-[#FAF7ED] min-h-screen h-fit">
        {/* GENERATE */}
        <div className="h-16 w-full border-gray-800/10  flex items-center">
          <div className="flex justify-between items-center bg-[#FAF7ED] py-3 w-full px-4">

            <div className="p-2  rounded" onClick={() => setMobileNavIsOpen(!mobileNavIsOpen)}>

              <HMenu />
            </div>

            <div className="ml-auto gap-4 flex items-center">
              <div className="relative">
                <NotificationSVG />
                <span className="w-6 h-6 -top-3 -right-3 text-white absolute bg-red-500 flex justify-center items-center text-sm rounded-full">3</span>
              </div>

              <Menu as="div" className={"w-fit ml-auto relative"}>
                <Menu.Button
                  as="div"
                  className={"relative cursor-pointer mr-auto"}
                >
                  <div className='w-10 h-10 rounded-full bg-[#404eed] flex justify-center items-center'>
                    <p className='text-white'>{generateAVI()}</p>
                  </div>
                </Menu.Button>
                <Menu.Items
                  as="div"
                  id="user-dropdown"
                  className={
                    `bg-white py-2 absolute ${role === Role.superAdmin ? '-bottom-56' : '-bottom-48'} border z-50 outline-none shadow-2xl rounded right-4 -translate-x-0 translate-y-10 min-w-[225px] w-fit`
                  }
                >
                  {/* HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE */}
                  <Menu.Item disabled as={"div"} className="px-4 mb-3">
                    <p className="">{cookie?.user?.name}</p>
                    <p className=" text-gray-400">
                      {cookie?.user?.email}
                    </p>

                    <hr className="my-2" />
                  </Menu.Item>
                  {links.map((link) => {

                    if (link.label === "All Drafts") {
                      if (role === Role.superAdmin) {
                        return (
                          <Menu.Item
                            as="a"
                            key={link.href}
                            href={link.href}
                            className="px-4 py-2 block whitespace-nowrap hover:bg-gray-100"
                          >
                            {link.label}
                          </Menu.Item>
                        )
                      }

                      else {
                        return null
                      }
                    }

                    if (link.label === "Sign Out") {
                      return <div onClick={() => logout()} key={link.href} className="px-4 py-2 block cursor-pointer whitespace-nowrap hover:bg-gray-100">
                        <p>{link.label}</p>
                      </div>
                    } else {
                      return (
                        <Menu.Item
                          as="a"
                          key={link.href}
                          href={link.href}
                          className="px-4 py-2 block whitespace-nowrap hover:bg-gray-100"
                        >
                          {link.label}
                        </Menu.Item>
                      )
                    }
                  })}
                </Menu.Items>
              </Menu>
            </div>
          </div>
        </div>

        <div className="h-[100%] -z-1">{children}</div>
      </div>


      {/* mobile nav */}
      <Transition
        show={mobileNavIsOpen}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="lg:hidden fixed top-0 bottom-0 left-0 h-screen border-r bg-[#FBF7F4] w-[80%]">
          <div className="py-4">
            <IoClose size={30} className="ml-auto mr-3" onClick={() => setMobileNavIsOpen(!mobileNavIsOpen)} />

            <div className="h-full px-3 pb-8 border-r-2 border-[#EDEBE7] overflow-y-auto bg-[#FBF7F4]">
              <div className="w-fit -translate-x-8  mb-8 -translate-y-0">
                <Logo color="text-gray-900" />
              </div>
              <ul className="space-y-2 ">
                <li>
                  <Link
                    href="/admin"
                    className="flex items-center p-2  group font-normal rounded text-white hover:bg-gray-100/10"
                  >
                    <HomeSVG />
                    <span className="ml-3 text-gray-900">
                      Dashboard
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/users/list"
                    className="flex items-center p-2  group font-normal rounded text-white hover:bg-gray-100/10"
                  >

                    <UsersSVG />
                    <span className="flex-1 ml-3 whitespace-nowrap text-gray-900">
                      Users
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/admin/email/list"
                    className="flex items-center p-2  group font-normal rounded text-white hover:bg-gray-100/10"
                  >

                    <UsersSVG />
                    <span className="flex-1 ml-3 whitespace-nowrap text-gray-900">
                      Email List
                    </span>
                  </Link>
                </li>

                <Menu>
                  {({ open }) => (
                    <>
                      <Menu.Button
                        as="button"
                        className="flex items-center justify-between w-full py-2  group font-normal rounded text-white hover:bg-gray-100/10 over:bg-gray-700"
                      >
                        <div className="flex justify-between items-center gap-1 ml-1">
                          <MediaSVG />
                          <span className="flex-1 ml-3 whitespace-nowrap text-gray-900">
                            Media
                          </span>
                        </div>

                        {open ? (
                          <IoChevronUp size={20} className="text-gray-900" />
                        ) : (
                          <IoChevronForward size={20} className="text-gray-900" />
                        )}
                      </Menu.Button>
                      <Menu.Items as="div" className={"outline-none"}>
                        <Menu.Item as="div" className={"outline-none"}>
                          <Link
                            href="/admin/blogs"
                            className={`hover:bg-gray-100/10 py-3 rounded-md text-gray-900 block pl-14 `}
                          >
                            Blogs
                          </Link>
                        </Menu.Item>
                        <Menu.Item as="div" className={"outline-none"}>
                          <Link
                            href="/admin/ideas"
                            className={`hover:bg-gray-100/10 py-3 rounded-md text-gray-900 block pl-14 `}
                          >
                            Ideas
                          </Link>
                        </Menu.Item>
                        <Menu.Item as="div" className={"outline-none"}>
                          <Link
                            href="/admin/courses"
                            className={`hover:bg-gray-100/10 py-3 rounded-md text-gray-900 block pl-14 `}
                          >
                            Courses
                          </Link>
                        </Menu.Item>
                        <Menu.Item as="div" className={"outline-none"}>
                          <Link
                            href="/admin/quiz"
                            className={`hover:bg-gray-100/10 py-3 rounded-md text-gray-900 block pl-14 `}
                          >
                            Quiz
                          </Link>
                        </Menu.Item>
                        <Menu.Item as="div" className={"outline-none"}>
                          <Link
                            href="/admin/assessment"
                            className={`hover:bg-gray-100/10 py-3 rounded-md text-gray-900 block pl-14 `}
                          >
                            Assessment
                          </Link>
                        </Menu.Item>
                      </Menu.Items>
                    </>
                  )}
                </Menu>

                <li>
                  <Link
                    href="/admin/cms"
                    className="flex items-center p-2  group font-normal rounded text-white hover:bg-gray-100/10"
                  >
                    <ContentsSVG />
                    <span className="flex-1 ml-3 whitespace-nowrap text-gray-900">
                      Content Managment
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/categories/list"
                    className="flex items-center p-2  group font-normal rounded text-white hover:bg-gray-100/10"
                  >
                    <CategorySVG
                    />
                    <span className="flex-1 ml-3 whitespace-nowrap text-gray-900">
                      Categories
                    </span>
                  </Link>
                </li>

                <li>
                  <a
                    href="#"
                    className="flex items-center p-2  group font-normal rounded text-white hover:bg-gray-100/10"
                  >
                    <SettingsSVG
                    />
                    <span className="flex-1 ml-3 whitespace-nowrap text-gray-900">
                      Settings
                    </span>
                  </a>
                </li>

                <li onClick={logout}>
                  <Link
                    href="/"
                    className="flex items-center p-2  group font-normal rounded text-white hover:bg-gray-100/10"
                  >
                    <>
                      <LogoutSVG
                      />
                      <span className="flex-1 ml-3 whitespace-nowrap text-gray-900" >
                        Logout
                      </span>
                    </>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Transition>
    </React.Fragment>
  );
}

export default Layout;
