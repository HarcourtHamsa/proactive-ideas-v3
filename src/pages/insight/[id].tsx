`use client`

import { getInsightForCourse } from '@/helper';
import useCookie from '@/hooks/useCookie';
import { NextApiRequest, NextApiResponse } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import cogGif from "../../assets/cog.gif"
import { IQuestion } from '../../../types/types';
import { TbSend } from 'react-icons/tb';
import Navbar from '@/components/Navbar';

interface IInsight {
    title: string;
    course: any;
    questions: IQuestion[];
}

const StackedCards = ({ data, index }) => {
    return (
        <div className="space-y-4">
            {data?.map((card, cardIndex) => {

                if (cardIndex === index) {
                    return (
                        <div key={Math.random()}>
                            <div
                                key={index}
                                className=" z-[100] bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] relative from-rose-500 to-indigo-700 p-6 flex items-center justify-center w-[250px] text-center h-[300px] rounded-lg shadow-md mb-4"
                            >
                                <p className="text-xl text-white">{card.question}</p>
                            </div>

                            <div className='w-[230px] z-[50] ml-3 h-[40px] bg-gray-400/20 rounded-lg absolute top-6'></div>
                            <div className='w-[210px] ml-6 h-[40px] bg-gray-400/20 rounded-lg absolute top-4'></div>
                        </div>
                    )
                }

            }
            )}
        </div>
    );
};


function InsightById() {
    const router = useRouter();
    const courseId = router.query.id;
    const [currentIndex, setCurrentIndex] = useState(0)

    const [isLoading, setIsLoading] = useState(true)
    const [insight, setInsight] = useState<IInsight | null>(null)

    useEffect(() => {
        async function fetchData() {
            await getInsightForCourse(courseId as string).then((res) => {
                setInsight(res?.data[0])
            }).catch((err) => {
                throw err
            }).finally(() => {
                setIsLoading(false)
            })
        }

        fetchData()
    }, [])


    const cookie = useCookie();

    return (
        <div>
            {isLoading &&
                <div className=' min-h-screen h-fit bg-[#FAF7ED] flex items-center justify-center'>
                    <div className='bg-white border rounded w-fit p-8 text-center'>
                        <Image src={cogGif} alt='' className='w-fit mx-auto' />

                        <p className='mt-4 text-lg'>Hold on Tight</p>
                        <p className=' text-gray-400'>We&apos;re Fetching Your Survey</p>
                    </div>
                </div>
            }


            <div>
               
                <div className=' h-fit bg-[#FAF7ED]'>
                    <div className="w-[60%] min-h-screen  flex flex-col mx-auto">
                        <div className='h-full py-8 mx-auto'>
                            <StackedCards
                                data={insight?.questions}
                                index={currentIndex} />
                        </div>
                        <div className='flex-1 h-fit'>
                            <div className='flex items-center justify-center w-full h-full gap-4'>

                                <textarea
                                    className='w-full min-h-[200px] text-lg h-fit border rounded p-4'
                                    placeholder='Enter your answer'
                                />
                                <button className='px-8 py-3 bg-blue-500 rounded-3xl shadow-md hover:bg-blue-600'>
                                    <TbSend size={20} color="white" />
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default InsightById



