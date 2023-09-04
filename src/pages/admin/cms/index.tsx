import React from 'react'
import Layout from '@/components/admin/Layout'
import Table from '@/components/admin/UsersTable'
import SearchIcon from "../../../components/SVGs/Search"
import VerticalMenuIcon from "../../../components/SVGs/VerticalMenu"
import { useRouter } from 'next/router'
import { FiExternalLink } from 'react-icons/fi'


function Index() {
    const router = useRouter();
    return (
        <Layout>
            <div className='p-4'>


                <div className='px-4 py-4'>
                    <h1 className="mt-4 text-2xl font-bold leading-snug lg:font-extrabold lg:text-3xl lg:leading-none text-black lg:mb-0 md:w-[600px]">Content Management</h1>
                </div>


                <div className='w-full  bg-white border rounded justify-between items-center'>

                    {/* home page */}
                    <div className='py-3 hover:bg-gray-50 cursor-pointer flex px-4 justify-between border-b' onClick={() => router.push("/admin/cms/home")}>
                        <p>Home Page</p>

                        <div className='cursor-pointer'>

                        </div>
                    </div>


                    {/* blogs page */}
                    <div className='py-3 flex px-4 hover:bg-gray-50 cursor-pointer justify-between border-b' onClick={() => router.push("/admin/cms/blog")}>
                        <p>Blog Page</p>

                        <div className='cursor-pointer'>

                        </div>
                    </div>

                    {/* courses page */}
                    <div className='py-3 flex px-4 hover:bg-gray-50 cursor-pointer justify-between' onClick={() => router.push("/admin/cms/courses")}>
                        <p>Course Page</p>

                        <div className='cursor-pointer'>

                        </div>
                    </div>


                    <div className='py-3 flex px-4 border-t hover:bg-gray-50 cursor-pointer justify-between' onClick={() => router.push("/admin/cms/certification")}>
                        <p>Certification Page</p>

                        <div className='cursor-pointer'>

                        </div>
                    </div>


                    {/* newsletter component */}
                    <div className='py-3 flex border-t px-4 hover:bg-gray-50 cursor-pointer justify-between' onClick={() => router.push("/admin/cms/newsletter")}>
                        <p>Newletter Component</p>

                        <div className='cursor-pointer'>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Index