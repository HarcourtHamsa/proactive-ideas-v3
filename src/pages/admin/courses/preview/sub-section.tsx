import BackChevronButton from '@/components/BackChevronButton';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router'
import React from 'react'
import { IoClose, IoCloseCircleOutline } from 'react-icons/io5';

function PreviewSubSection() {
    const router = useRouter();

    return (
        <div className='bg-[#FBF7F4] min-h-screen h-fit'>
            <div className='p-4'>
                <BackChevronButton />
            </div>
            <div className='md:w-[60%] w-[90%] mx-auto my-10 bg-white border rounded overflow-hidden'>
                <p className='mb-4 bg-orange-200 px-4 py-2 items-center uppercase text-sm flex gap-4 tracking-widest'>
                    <IoCloseCircleOutline size={22} className='cursor-pointer' />
                    Content Preview: {router?.query?.title}
                    
                    </p>

                    
                {router?.query?.content && <main className='px-4 py-8' dangerouslySetInnerHTML={{ __html: router?.query?.content as string }}></main>}
            </div>
            {/* <Footer /> */}
        </div>
    )
}

export default PreviewSubSection