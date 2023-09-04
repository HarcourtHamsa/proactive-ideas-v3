import React from 'react'
import { useRouter } from 'next/router'
import { IoChevronForward, IoClose } from 'react-icons/io5'

const QUIZ = [
    {
        question: "What's the easiest thing for you to tweak right now?",
        type: 'multiple choice',
        options: [
            {
                option: "My desktop website",
                isCorrectAnswer: false,
            },
            {
                option: "My mobile site",
                isCorrectAnswer: true,
            },
            {
                option: "My videos",
                isCorrectAnswer: false,
            }
        ]
    },
    {
        question: "Which do you worry about the most?",
        type: 'multiple choice',
        options: [
            {
                option: "People only visiting my homepage",
                isCorrectAnswer: true,
            },
            {
                option: "People hating my mobile site",
                isCorrectAnswer: false,
            },
            {
                option: "People ignoring my social media updates",
                isCorrectAnswer: false,
            }
        ]
    }
]

function Quiz() {
    const router = useRouter()
    return (
        <div className='h-screen bg-red-600'>
            <div className='h-14 border-b fixed top-0 left-0 right-0 z-20 border-b-[#283245] bg-[#121722] place-items-center flex'>
                <div className='flex items-center gap-4 container mx-auto'>
                    {/* left column */}
                    <div className='w-10 h-10 rounded-full hover:bg-white/80 duration-150 cursor-pointer place-items-center flex justify-center' onClick={() => router.back()}>
                        <IoClose size={30} className="cursor-pointer text-gray-600" />
                    </div>
                    <span className='text-white'>Multiple choice</span>
                </div>
            </div>

            {QUIZ.map((quiz: any) => (
                <div key={quiz} className='w-full h-screen bg-green-400 flex place-items-center relative'>
                    <div className='md:w-[60%] w-[90%] mx-auto'>
                        <p className='text-center text-lg md:w-[300px] w-[80%] mx-auto mb-4'>{quiz.question}</p>

                        {quiz.options.map((d: any) => (
                            <div key={d} className='min-w-[350px] cursor-pointer w-fit text-center mx-auto py-3 h-fit mb-4 bg-white rounded shadow-md'>
                                <p>{d.option}</p>
                            </div>
                        ))}
                    </div>


                    <div className='absolute bottom-4 flex items-center cursor-pointer left-[45%]'>
                        <p>Skip this activity</p>
                        <IoChevronForward size={20} />
                    </div>

                </div>
            ))}

        </div>
    )
}

export default Quiz