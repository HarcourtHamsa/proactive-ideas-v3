import Footer from '@/components/Footer'
import { getCookie } from 'cookies-next';
import Navbar from '@/components/Navbar'
import { NextApiRequest, NextApiResponse } from 'next';
import React from 'react'
import { IoPencil } from 'react-icons/io5'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { decryptData, fetchUserEnrollments } from '@/helper';
import Card from '@/components/Card';
import useCookie from '@/hooks/useCookie';

function Profile({ enrollments }) {
    const cookie = useCookie()
    const parsedEnrollments = JSON.parse(enrollments)




    return (
        <div className='bg-[#FAF7ED]'>
            <Navbar />
            <div className='h-fit py-20 w-[85%] mx-auto '>
                <div className=''>
                    <Tabs>
                        <TabList>
                            <Tab>About Me</Tab>
                            <Tab>Learning Activity</Tab>
                            <Tab disabled>Settings</Tab>
                        </TabList>

                        <TabPanel className={'mb-10'}>
                            <div className='mb-10'>
                                {/* <p className='text-2xl pb-2'>My Profile</p> */}

                                <div className='flex items-center gap-4'>
                                    <div className='w-[100px] h-[100px] bg-[rgb(64,78,237)] text-white flex items-center justify-center rounded-full'>
                                        <p className='text-3xl'>{cookie?.user.name.split(' ')[0][0]} {cookie?.user.name.split(' ')[1][0]}</p>
                                    </div>


                                </div>

                                <div className='space-y-2 mt-4'>
                                    <div className='py-3 px-4 border rounded bg-white shadow cursor-pointer'>
                                        <span>First Name: </span>
                                        <span>{cookie?.user.name.split(' ')[0]}</span>
                                    </div>

                                    <div className='py-3 px-4 border rounded bg-white shadow cursor-pointer'>
                                        <span>Last Name: </span>
                                        <span>{cookie?.user.name.split(' ')[1]}</span>
                                    </div>

                                    <div className='py-3 px-4 border rounded bg-white shadow cursor-pointer'>
                                        <span>Email: </span>
                                        <span>{cookie?.user.email}</span>
                                    </div>

                                    <div className='py-3 px-4 border rounded bg-white shadow cursor-pointer'>
                                        <span>Role: </span>
                                        <span>{cookie?.user.role}</span>
                                    </div>
                                </div>

                            </div>

                        </TabPanel>
                        <TabPanel className={'mb-10'}>
                            <div className='mb-20'>

                                <div className='grid grid-cols-3'>
                                    {parsedEnrollments.map((enrollment: any) => {
                                        return <Card key={Math.random()} data={enrollment.course} />
                                    })}
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel className={'mb-10'}>
                            <p>Any content 3</p>
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Profile


// This gets called on every request
export const getServerSideProps = async ({ req, res }: { req: NextApiRequest, res: NextApiResponse }) => {

    const encryptedTkn = getCookie('tkn', { req, res }) as string
    const cookie = decryptData(encryptedTkn)
    const userId = cookie?.user.id

    // // Fetch data from external API
    const enrollmentApiResponse = await fetchUserEnrollments(userId)
    const enrollments = enrollmentApiResponse?.data

    // Pass data to the page via props
    return {
        props: {
            enrollments: JSON.stringify(enrollments) || null
        }
    }
}
