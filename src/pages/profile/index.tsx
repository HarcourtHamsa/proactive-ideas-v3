import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'
import { IoPencil } from 'react-icons/io5'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

function Profile() {
    return (
        <div className='bg-[#FAF7ED]'>
            <Navbar />
            <div className='h-screen py-20'>
                <div className='lg:h-[300px] h-[200px] flex items-center'>
                    <div className='container w-[85%] mx-auto flex justify-between'>
                        <div>
                            <h3 className='lg:text-5xl text-3xl mb-10'>My Profile</h3>
                            <div className='flex gap-4 lg:gap-8'>
                                <div className=' w-[80px] lg:w-[100px] lg:h-[100px] h-[80px] relative rounded-xl bg-[#404eed] flex items-center justify-center'>
                                    <div className='w-6 h-6 border-4 rounded-full absolute border-[#FAF7ED] bg-[#22BB22] -bottom-2 -right-2 '></div>
                                    <h3 className='scale-150 text-white'>HH</h3>
                                </div>

                                <div>
                                    <p>Hamsa Harcourt</p>
                                    <p>hamsaharcourt@gmail.com</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className='w-[85%] mx-auto'>
                <Tabs>
                    <TabList>
                        <Tab>About</Tab>
                        <Tab>Activity</Tab>
                        <Tab>Settings</Tab>
                    </TabList>

                    <TabPanel>
                        <p>Any content 1</p>
                    </TabPanel>
                    <TabPanel>
                        <p>Any content 2</p>
                    </TabPanel>
                    <TabPanel>
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