import React, { useEffect, useState } from 'react'
import Layout from '@/components/admin/Layout'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useDeleteBlogDraftMutation, useFetchBlogPostDraftsQuery, useFetchCoursesDraftsQuery, useFetchIdeasPostDraftsQuery } from '@/features/apiSlice';
import useAuth from '@/hooks/useAuth';
import Loader from '@/components/Loader';
import { ToastContainer } from 'react-toastify';
import Search from '@/components/SVGs/Search';
import { useRouter } from 'next/router';
import ReactPortal from '@/components/ReactPortal';
import Modal from '@/components/Modal';
import { AiOutlineClose } from 'react-icons/ai';
import { IoInformation, IoInformationCircle, IoSad, IoStop } from 'react-icons/io5';
import useRole from '@/hooks/useRole';
import { Role } from '../../../../types/types';
import { createBlogPost, createIdeaPost } from '@/helper';
import notify from '@/components/Notification';
import Spinner from '@/components/Spinner';
import Restricted from '@/components/admin/Restricted';
import { TbHandStop } from 'react-icons/tb';
import { BsStopCircleFill } from 'react-icons/bs';
import http from '@/lib/http';
import { DraftsTable } from '@/components/admin/DraftsTable';



function DraftsPage() {
    const auth = useAuth();
    const role = useRole();
    const router = useRouter();

    const [current, setCurrent] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const { data: blogPostDrafts, isLoading: isFetchingBlogDrafts } = useFetchBlogPostDraftsQuery({ token: auth?.accessToken });
    const { data: ideaPostDrafts, isLoading: isFetchingIdeaDrafts } = useFetchIdeasPostDraftsQuery({ token: auth?.accessToken });
    const { data: courseDrafts, isLoading: isFetchingCourses } = useFetchCoursesDraftsQuery({ token: auth?.accessToken });
    const { "0": deleteDraft } = useDeleteBlogDraftMutation()




    if (isFetchingBlogDrafts && isFetchingIdeaDrafts) {
        return <Loader />
    }

    const publishBlog = async () => {
        setIsLoading(true)
        try {
            await http.patch(`/update-blog-post?id=${current?.id}`, { status: 'active' })
                .then(() => {
                    notify({ msg: 'Blog post is live', type: 'success' })
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000);
                }).catch(() => {
                    notify({ msg: 'Oops! an error occured', type: 'error' })
                }).finally(() => {
                    setIsLoading(false)
                })
        } catch (error) {
            throw error
        }
    }


    const publishIdeaPost = async () => {
        setIsLoading(true)
        try {
            await http.patch(`/update-idea-post?id=${current?.id}`, { status: 'active' })
                .then(() => {
                    notify({ msg: 'Idea post is live', type: 'success' })
                }).catch(() => {
                    notify({ msg: 'Oops! an error occured', type: 'error' })
                }).finally(() => {
                    setIsLoading(false)
                })
        } catch (error) {
            throw error
        }

    }

    const publishCourse = async () => {
        setIsLoading(true)
        try {
            await http.patch(`/update-course?id=${current?.id}`, { status: 'active' })
                .then(() => {
                    notify({ msg: 'Course is live', type: 'success' })
                }).catch(() => {
                    notify({ msg: 'Oops! an error occured', type: 'error' })
                }).finally(() => {
                    setIsLoading(false)
                })
        } catch (error) {
            throw error
        }
    }

    return (
        <>
            {role === Role.superAdmin ?
                <Layout>
                    <div className="p-4 mt-8">
                        <h2 className="text-3xl text-black font-bold mb-2">All Drafts</h2>
                        <Tabs>
                            <TabList>
                                <Tab>Blog Posts</Tab>
                                <Tab>Ideas Posts</Tab>
                                <Tab>Courses</Tab>
                            </TabList>

                            <TabPanel>
                                <DraftsTable
                                    data={blogPostDrafts}
                                    label="blogs"
                                    onPress={(data: any) => publishBlog()}
                                    isLoading={isLoading}
                                    current={current}
                                    setCurrent={setCurrent}
                                />
                            </TabPanel>
                            <TabPanel>
                                <DraftsTable
                                    data={ideaPostDrafts}
                                    label="ideas"
                                    onPress={(data: any) => publishIdeaPost()}
                                    isLoading={isLoading}
                                    current={current}
                                    setCurrent={setCurrent}
                                />
                            </TabPanel>
                            <TabPanel>
                                <DraftsTable
                                    data={courseDrafts}
                                    label="courses"
                                    onPress={(data: any) => publishCourse()}
                                    isLoading={isLoading}
                                    current={current}
                                    setCurrent={setCurrent}
                                />
                            </TabPanel>
                        </Tabs>
                    </div>
                </Layout>
                : <div className='w-screen h-screen flex justify-center items-center'>
                    <div className='w-[600px] h-fit text-center space-y-3'>
                        <BsStopCircleFill size={60} className='w-fit mx-auto' />
                        <h1 className='font-normal lg:font-bold text-3xl'>Out of Bounds</h1>
                        <p>The page you are trying to view is out of bounds</p>
                        <button className='border rounded-full px-4 py-2 mt-2' onClick={() => router.push('/')}>Go Back</button>
                    </div>
                </div>
            }
        </>
    )
}

export default DraftsPage