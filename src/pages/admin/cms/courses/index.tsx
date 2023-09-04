import React, { useState } from 'react'
import Layout from '@/components/admin/Layout'
import client from '@/lib/sanity';
import { useRouter } from 'next/router'
import { IoChevronBack } from 'react-icons/io5'
import { ToastContainer } from 'react-toastify';
import HeroSection from '@/components/admin/cms/courses/HeroSection';

function Index({ heroContent, certContent }: any) {
    const router = useRouter();
    return (
        <Layout>
            <div className='p-4'>
                <ToastContainer />
                <div className='w-8 h-8 bg-white border cursor-pointer flex justify-center items-center rounded-full' onClick={() => router.back()}>
                    <IoChevronBack />
                </div>

                <h2 className='text-3xl mt-2 font-semibold'>Courses Page</h2>
                <HeroSection heroContent={heroContent} />
            </div>
        </Layout>
    )
}

export default Index


export async function getStaticProps() {
    const allContents = await client.fetch(`*[_type in ["coursesPagehero"]]`)
    var heroContent: any = allContents
    // var certContent: any = []

    // allContents.map((data: any) => {
    //     if (data._type === "homePageHero") {
    //         heroContent.push(data)
    //     } else {
    //         certContent.push(data)
    //     }
    // })



    return {
        props: {
            heroContent,
            // certContent
        }
    };
}