import React, { useState } from 'react'
import CustomInput from '@/components/CustomInput';
import Layout from '@/components/admin/Layout'
import client from '@/lib/sanity';
import { useRouter } from 'next/router'
import { IoArrowBack, IoChevronBack, IoChevronDown } from 'react-icons/io5'
import Spinner from '@/components/Spinner';
import notify from '@/components/Notification';
import { ToastContainer } from 'react-toastify';
import HeaderSection from '@/components/admin/cms/home/HeaderSection';
import CertificationSection from '@/components/admin/cms/home/CertificationSection';

function Index({ heroContent, certContent }: any) {
    const router = useRouter();
    
    return (
        <Layout>
            <div className='p-4'>
                <ToastContainer />
                <div className='flex  items-center gap-2 cursor-pointer' onClick={() => router.back()}>
                    <div className='w-8 h-8 bg-white border  flex justify-center items-center rounded-full' >
                        <IoChevronBack />
                    </div>
                    <p>Go Back</p>
                </div>

                <h2 className='text-3xl mt-2 font-semibold'>Home Page</h2>

                <HeaderSection heroContent={heroContent} />


                <CertificationSection certContent={certContent} />
            </div>
        </Layout>
    )
}

export default Index


export async function getStaticProps() {
    const allContents = await client.fetch(`*[_type in ["homePageCertificationSection", "homePageHero"]]`)
    var heroContent: any = []
    var certContent: any = []

    allContents.map((data: any) => {
        if (data._type === "homePageHero") {
            heroContent.push(data)
        } else {
            certContent.push(data)
        }
    })



    return {
        props: {
            heroContent,
            certContent
        }
    };
}