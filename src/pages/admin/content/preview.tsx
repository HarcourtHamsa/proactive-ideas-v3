import BackChevronButton from '@/components/BackChevronButton';
import ProgressBar from '@/components/ProgressBar';
import TableOfContents from '@/components/TableOfContent';
import { modifyHTMLString, seperateBlogDataIntoComponents } from '@/helper';
import { RootState } from '@/store'
import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react'
import { IoClose } from 'react-icons/io5';
import { TbList } from 'react-icons/tb';
import { useSelector } from 'react-redux'

function PreviewContent() {
    const blogData = useSelector((state: RootState) => state?.blog);
    const [showTableOfContents, setShowTableOfContents] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    var [title, content] = seperateBlogDataIntoComponents(blogData.content);


    return (
        <div className='bg-white'>
            <ProgressBar />
            <div className='px-4 py-4 flex fixed top-0 left-0 right-0 bg-white justify-between'>
                <BackChevronButton />
            </div>


            <div className='lg:min-h-[550px] h-fit lg:w-[60%]  p-4 lg:text-center w-[90%] mx-auto pt-28 sm:pt-20 lg:pt-28'>
                <h1 className=" text-left text-2xl mt-10 font-semibold leading-snug lg:font-extrabold lg:text-4xl lg:leading-none lg:mb-0">{title}</h1>
                <div className='lg:h-[500px] mt-8 h-[200px] mx-auto w-full overflow-hidden mb-10' >
                    <Image alt='' className='object-cover w-full h-full' src={blogData.headerImage} width={730} height={487} />
                </div>
            </div>
            <div className='mt-0 lg:mt-8 lg:w-[60%]  w-[90%] mx-auto'>
                <div className='lg:col-span-1 w-full lg:bg-transparent' >
                  
                    <div className='toc-gradient z-[200] lg:hidden rounded fixed bottom-0 w-full left-0 right-0' style={{ backgroundColor: showTableOfContents ? 'white' : '' }}>
                        {showTableOfContents &&
                            <div className='w-10 h-10 bg-white flex justify-center items-center cursor-pointer absolute right-4 -top-12 rounded-full shadow' onClick={() => setShowTableOfContents(!showTableOfContents)}>
                                <IoClose size={30} className='' />
                            </div>
                        }

                        <button className='bg-[#F08354] w-[90%] shadow-xl mb-6 mx-auto py-3 rounded text-white text-base block'
                            onClick={() => setShowTableOfContents(!showTableOfContents)}
                        >Table of contents</button>

                        {showTableOfContents && <div className='lg:hidden px-8'>
                            <TableOfContents htmlString={blogData?.content} />
                        </div>}

                    </div>

                    {/* <div className='lg:h-52'></div> */}
                </div>
                <div className='col-span-2  lg:order-2 pt-2 px-4 mb-8'>
                    <div ref={sidebarRef} className='overflow-hidden border border-t-8 border-t-[#F08354] p-4 rounded hidden xl:block mb-8 bg-white'>

                        <p className='text-lg font-semibold mb-3'>Table of Contents</p>

                        <div className='overflow-hidden'>

                            <TableOfContents htmlString={blogData?.content} />

                        </div>
                    </div>

                    <div dangerouslySetInnerHTML={{ __html: modifyHTMLString(content) }} />
                </div>
            </div>
        </div>
    )
}

export default PreviewContent
