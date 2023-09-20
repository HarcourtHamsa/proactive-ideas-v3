import BackChevronButton from '@/components/BackChevronButton'
import Layout from '@/components/admin/Layout'
import http from '@/lib/http'
import React, { useState } from 'react'
import { TbChevronRight } from 'react-icons/tb'

function PreviewQuiz({ quiz }) {
    const [activeButton, setActiveButton] = useState<null | number>(null)
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
    const [feedback, setFeedback] = useState<null | string>(null)
    const [isCorrect, setIsCorrect] = useState<null | boolean>(null)

    function checkAnswer() {
        setIsSubmitted(true)

        if (activeButton === quiz.correct_option) {
            setFeedback(quiz.feedback.correct)
            setIsCorrect(true)
        } else {
            setFeedback(quiz.feedback.incorrect)
            setIsCorrect(false)
        }
    }

    return (
        <div>
            <Layout>
                <div className="p-4 mt-8">
                    <BackChevronButton />
                    <h2 className="text-4xl text-black font-bold mb-2">Preview Quiz</h2>
                    <p className='flex items-center gap-2 text-gray-400'>Create Quiz <TbChevronRight /> Preview Quiz</p>

                    <div className='border px-8 py-4 mt-12 rounded bg-white xl:w-[70%] w-[100%]'>
                        <p className='mb-2'>Question: {quiz.question}</p>
                        <p className='text-gray-400 mb-4'>Pick the correct answer</p>

                        {quiz.options.map((option, index) => {
                            return (
                                <div
                                    key={Math.random()}
                                    className={`duo-button w-[100%] hover:cursor-pointer ${activeButton === index && 'active'} ${isSubmitted && 'opacity-30 cursor-not-allowed'}`}
                                    onClick={() => !isSubmitted ? setActiveButton(index) : null}>
                                    {option.text}

                                </div>
                            )
                        })}

                        <p className={`ml-4 ${isCorrect ? 'text-green-400' : 'text-red-500'}`}>{feedback}</p>

                        <div className='w-fit ml-auto mt-6 space-x-4'>
                            <button className='px-6 py-2 text-[#F08354] rounded bg-[#F08354]/30' onClick={() => {
                                setActiveButton(null)
                                setIsSubmitted(false)
                                setFeedback(null)
                                setIsCorrect(null)
                            }}>Reset</button>
                            <button className='px-6 py-2 border bg-[#F08354] rounded text-white' onClick={checkAnswer}>Submit</button>
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default PreviewQuiz


export async function getServerSideProps(ctx) {
    const { id } = ctx.query;

    const response = await http.get(`/get-quiz-by-id?id=${id}`);
    console.log({ response: response.data.data.options });


    return {
        props: {
            quiz: response?.data?.data || null,
        },
    };
}