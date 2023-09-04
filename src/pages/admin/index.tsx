import React, { useEffect } from 'react'

import InfoCard from '@/components/admin/InfoCard'
import Layout from '@/components/admin/Layout'

import { IoPeople, IoDocumentText, IoLibrary } from "react-icons/io5";
import { useSession } from 'next-auth/react';
import { useFetchBlogPostsQuery, useFetchCoursesQuery, useFetchUsersQuery } from '@/features/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/router';
import BlogCard from '@/components/BlogCard';
import useCookie from '@/hooks/useCookie';

function Index() {
    const authState = useSelector((state: RootState) => state.auth)
    const { data: blogPosts } = useFetchBlogPostsQuery("")
    const { data: courses } = useFetchCoursesQuery("")
    const { data: users } = useFetchUsersQuery({ token: authState?.auth?.user?.accessToken })
    const cookie = useCookie()

    function fnc() {
        const hourOfTheDay = new Date().getHours();

        if (hourOfTheDay <= 12) {
            return "Good Morning"
        } else if (hourOfTheDay <= 16) {
            return "Good Afternoon"
        } else {
            return "Good Evening"
        }
    }


    fnc();

    return (
        <Layout>
            <div className='px-4 py-4'>
                <h1 className="mt-4 text-2xl font-bold leading-snug lg:font-extrabold lg:text-4xl lg:leading-none text-black lg:mb-7 md:w-[600px]">{fnc()}, {cookie?.user?.name?.split(" ")[0]}! 👋</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 px-4">
                <InfoCard
                    label="Users"
                    number={users?.data?.length}
                    bg="orange-500"
                    icon={<IoPeople color="white" size={30} />}
                />
                <InfoCard
                    label="Blog Posts"
                    number={blogPosts?.data?.filter((blog: any) => blog.status !== 'deleted').length}
                    bg="green-500"
                    icon={<IoDocumentText color="white" size={30} />}
                />
                <InfoCard
                    label="Courses"
                    number={courses?.data?.filter((course: any) => course.status !== 'deleted').length}
                    bg="purple-500"
                    icon={<IoLibrary color="white" size={30} />}
                />
                <InfoCard
                    label="Ideas"
                    number={'0'}
                    bg="purple-500"
                    icon={<IoLibrary color="white" size={30} />}
                />
            </div>



            <div className="grid md:grid-cols-1 grid-cols-1 gap-4 p-4 mt-8">
                <h2 className="mt-4 text-xl leading-snug lg:font-extrabold lg:text-2xl lg:leading-none text-black lg:mb-0 md:w-[600px]">Recent Posts</h2>
                <div className="flex overflow-x-scroll scrollbar-none">
                    <div className="grid xl:grid-cols-3 gap-2 duration-200 ease-in-out snap-x scrollbar-hide">
                        {blogPosts?.data.filter((blog: any) => blog.status !== 'inactive').slice(-2).reverse()?.map((post: any) => {
                            return (
                                <div className='' key={Math.random()}>
                                    <BlogCard
                                        data={post}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </Layout>
    )
}

export default (Index)







