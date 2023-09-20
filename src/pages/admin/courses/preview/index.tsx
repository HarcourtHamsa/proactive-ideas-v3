import { RootState } from '@/store';
import React, { useEffect, useState, useRef } from 'react'
import { IoClose } from 'react-icons/io5'
import { TbHome, TbList, TbTable } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown'
import { useRouter } from 'next/router';
import BackChevronButton from '@/components/BackChevronButton';
import TableOfContents from '@/components/TableOfContent';


function CoursePreview() {
    const router = useRouter();
    const sectionState: any = useSelector((state: RootState) => state.section);
    const [contents, setContents] = useState(new Set());
    const [count, setCount] = useState(0);
    const [showTableOfContents, setShowTableOfContents] = useState(false);


    const generatePageContent = () => {
        const newState = new Set();

        sectionState.sections.map((section: any) => {
            // console.log("section", section);
            section.sub_sections.map((ss: any) => {
                newState.add(ss);
            })
        });

        console.log({ contents });
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

            <div className='mx-auto min-h-screen h-fit'>


                <aside className=' mb-10 lg:mb-0 overflow-hidden fixed xl:w-[20%] hidden xl:block h-screen order-1 bg-[#11393C] overflow-y-auto'>

                    <div className=''>
                        <div>
                            <p></p>
                        </div>
                        <ul key={Math.random()} className='ul__unset'>
                            {sectionState.sections.map((section: any, index: number) => {
                                return (
                                    <span key={Math.random()}>
                                        <li className='py-1 mt-0 px-4  cursor-pointer  mb-2 bg-gray-200 line-clamp-1 text-sm uppercase tracking-wider'>{section.title}
                                        </li>
                                        <ul className='pl-2 ul__unset' >
                                            {section?.sub_sections.map((ss: any) => {
                                                return (
                                                    <li key={Math.random()} onClick={() => selectContent(ss)} className='cursor-pointer text-gray-200  px-2 rounded-md py-1 mb-2 hover:text-white'>{ss.title}</li>
                                                )
                                            })}
                                        </ul>
                                    </span>
                                )
                            })}
                        </ul>
                    </div>
                </aside>


                <main className='col-span-1 p-4 min-h-screen xl:w-[80%]  w-[100%] xl:ml-[20%] xl:flex'>
                    <div className='xl:w-[70%] mr-2'>
                        <div className='block'>
                            <BackChevronButton />
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: generateBody(Array.from(contents)) }} className='course__content'></div>
                        <div className='w-fit ml-auto my-8'>
                            <button onClick={nextContent} className='w-fit px-4 bg-orange-400 text-white border rounded py-2 text-center'>Next lesson</button>
                        </div>
                    </div>

                  

                    <aside className='xl:w-[30%] min-h-[500px] h-fit border rounded'>
                    </aside>
                </main>




            </div>
        </div>
    )
}

export default CoursePreview