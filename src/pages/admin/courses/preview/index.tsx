import { RootState } from '@/store';
import React, { useEffect, useState, useRef } from 'react'
import { IoClose } from 'react-icons/io5'
import { TbList, TbTable } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown'
import { useRouter } from 'next/router';


function CoursePreview() {
    const router = useRouter();
    const sectionState: any = useSelector((state: RootState) => state.section);
    const [contents, setContents] = useState(new Set());
    const [count, setCount] = useState(0);


    const generatePageContent = () => {
        const newState = new Set();

        sectionState.sections.map((section: any) => {
            // console.log("section", section);
            section.sub_sections.map((ss: any) => {
                newState.add(ss);
            })
        });

        console.log({contents});
        return setContents(newState);

    }

    useEffect(() => {
        generatePageContent();
    }, [])

    const generateTitle = (arr: any) => {
        return arr[count]?.title
    }

    const generateBody = (arr: any) => {
        return arr[count]?.content
    }

    const nextContent = () => {
        if (count === contents.size - 1) {
            return;
        }

        setCount(count + 1);
    }

    const selectContent = (body: any) => {
        const isFound = contents.has(body);

        if (isFound) {
            const contentsToArray = Array.from(contents);
            const index = contentsToArray.indexOf(body);
            setCount(index);
        }
    }



    return (
        <div>
            <div className='h-16 flex items-center bg-white border-b mb-10 fixed top-0 left-0 right-0'>
                <div className='flex items-center w-full justify-between px-4'>
                    <div className='flex items-center gap-2 cursor-pointer' onClick={() => router.back()}>
                        <IoClose size={25} className='cursor-pointer' />
                        <p>Close</p>
                    </div>

                    {/* <div>
                        <button className='px-4 py-2 border rounded'>Continue</button>
                    </div> */}

                </div>
            </div>
            <div className='mx-auto min-h-screen h-fit mt-16 grid lg:grid-cols-4'>


                <aside className='col-span-1 mb-10 lg:mb-0 overflow-hidden border order-1'>
                    <div className='flex mb-5 px-4 py-3 items-center border-b bg-gray-50 gap-2'>
                        {/* <TbList size={20} /> */}
                        <p className='font-bold'>Table of Contents</p>
                    </div>
                    <div className='px-4'>
                        <ul key={Math.random()} className=''>
                            {sectionState.sections.map((section: any, index: number) => {
                                return (
                                    <span key={Math.random()}>
                                        <li className='py-1 mt-0  cursor-pointer rounded mb-2'>Section {index + 1}:  {section.title}
                                        </li>
                                        <ul className='ml-10 pl-2'>
                                            {section?.sub_sections.map((ss: any) => {
                                                return (
                                                    <li key={Math.random()} onClick={() => selectContent(ss)} className='cursor-pointer  px-2 rounded-md py-1 mb-2'>{ss.title}</li>
                                                )
                                            })}
                                        </ul>
                                    </span>
                                )
                            })}
                        </ul>
                    </div>
                </aside>


                <main className='col-span-1 p-4 lg:col-span-3 order-2'>
                    {/* <h2 className='text-3xl font-bold'>{generateTitle(Array.from(contents))}</h2> */}
                    <div dangerouslySetInnerHTML={{ __html: generateBody(Array.from(contents)) }} className='course__content'></div>
                    <div className='w-fit ml-auto my-8'>
                        <button onClick={nextContent} className='w-fit px-4  border rounded py-2 text-center'>Next lesson</button>
                    </div>
                </main>


            </div>
        </div>
    )
}

export default CoursePreview