import Modal from '@/components/Modal';
import ReactPortal from '@/components/ReactPortal';
import http from '@/lib/http';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { IoCheckbox, IoClose, IoDownload } from 'react-icons/io5';
import { TbCheck, TbCross, TbDownload } from 'react-icons/tb';
import { PDFDocument, rgb } from 'pdf-lib'
import { useDispatch } from 'react-redux';
import { resetQuestions } from '@/features/assessment/assessmentSlice';
// import certificatePDF from "../../../assets/sample-certificate..pdf"

function Index() {
    const router = useRouter();
    const query = router.query.questionz as unknown as string
    const parsedAssessment = JSON.parse(query)

   
    
    const initialQuestions = parsedAssessment.length ? parsedAssessment : [];
    const [assessment, setAssessment] = useState({
        questions: initialQuestions
    });
    const dispatch = useDispatch()
    const [offset, setOffset] = useState(0)
    const [option, setOption] = useState<null | number>(null)
    const [totalAssessments, setTotoalAssessments] = useState(assessment.questions.length)
    const [feedback, setFeedback] = useState<null | string>(null)
    const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0)
    const [isCorrect, setIsCorrect] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [activeBtn, setActiveBtn] = useState<number | null>(null)
    const [certificateData, setCertificateData] = useState([]);


    console.log({ assessment });

    const next = () => {
        setOffset((prevState: number) => prevState + 1)
    }

    const checkAnswer = (correctOption: number, yourOption: number) => {
        if (correctOption === yourOption) {
            setIsCorrect(true)
            setTotalCorrectAnswers((prevState: number) => prevState + 1)
        } else {
            setIsCorrect(false)
        }
    }

    const handleSubmit = () => {
        if (isCorrect) {
            setFeedback("You answered correctly")
        } else {
            setFeedback("Oops! that was wrong")
        }
    }

    const handleNext = () => {
        next()
        setActiveBtn(null)
        setFeedback(null)
        setIsCorrect(false)
    }

    const passedCutoffMark = () => {
        const baseMark = (80 / 100 * totalAssessments)
        return totalCorrectAnswers > baseMark
    }

    return (
        <div className='overflow-hidden h-screen w-screen bg-[#FAF7ED] '>
            <div className='h-[40px] flex items-center justify-center w-full bg-[#F08354] absolute top-0 left-0 right-0 z-20'>

                <div className='flex items-center gap-4'>
                    <p className='tracking-widest uppercase text-sm text-white'>Assessment Preview</p>
                    <button className='bg-white text-[#F08354] px-8 rounded' onClick={() => {
                        // dispatch(resetQuestions())
                        router.back()
                    }}>Close</button>
                </div>
            </div>

            <div className={`overflow-hidden `}>
                {offset === 0 &&
                    <div className='h-screen w-screen bg-[#FAF7ED] relative flex justify-center items-center'
                    >
                        <div className='container w-[80%] mx-auto grid lg:grid-cols-2'>
                            <div>
                                <div className='h-[600px] w-[600px] scale-105 bg-[#F08354] rounded-full absolute -left-20 opacity-0 lg:opacity-100'></div>
                            </div>
                            <div className='space-y-4'>
                                <h1 className="mb-4 text-3xl  mt-10 font-semibold leading-snug lg:font-extrabold lg:text-5xl lg:leading-none  lg:mb-4">Assessment Time!</h1>
                                <p>
                                    🎯 Preview
                                </p>

                                <p>

                                    Get ready to showcase your superpowers as we delve into a series of mind-bending questions and activities that will test your understanding, creativity, and problem-solving skills. Remember, this isn&apos;t your typical snooze-worthy exam; we&apos;ve designed it to be fun, engaging, and, dare we say, a bit addictive!

                                </p>

                                <p>
                                    🔍 What to Expect:
                                </p>

                                <p>
                                    In this assessment, you&apos;ll encounter a mix of multiple-choice questions, brain teasers, and maybe even a surp
                                </p>

                                <button className='border h-[50px] flex items-center px-6 rounded duo-button' onClick={next}>Start Assessment</button>
                            </div>
                        </div>
                    </div>
                }

                {assessment?.questions?.map((question: any, index: any) => {
                    return (
                        <div key={Math.random()} className='h-screen w-screen bg-[#FAF7ED] relative flex justify-center items-center' style={{ display: `${offset === index + 1 ? 'flex' : 'none'}` }}>

                            <div className='w-[200px] h-[200px] bg-pink-600/20 rounded-full absolute left-0 opaque-box opaque-box-1'></div>
                            <div className='w-[300px] h-[300px] bg-green-600/20 rounded-full absolute right-20 top-0 opaque-box opaque-box-2'></div>
                            <div className='w-[200px] h-[200px] bg-red-600/20 rounded-full absolute bottom-0 opaque-box opaque-box-3'></div>
                            <div className='container lg:w-[50%]  w-[90%] bg-white z-20 border px-8 mx-auto  rounded-lg box-border py-8'>
                                <p className='mb-2'>
                                    {/* <span>Question {index + 1}: </span> */}
                                    {question?.question}

                                </p>
                                <p className='text-gray-400'>Choose the correct answer</p>
                                <div className='mt-6'>
                                    {question?.options.map((option: any, i: number) => {


                                        return (
                                            <button
                                                key={Math.random()}
                                                // className={`px-4 py-1 duo-button relative rounded border w-full focus-within::bg-red-500`}
                                                className={`px-4 py-1 duo-button relative rounded border w-full focus:border-[#F08354] ${feedback ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'} ${activeBtn === i ? 'active' : ''}`}
                                                disabled={feedback ? true : false}
                                                tabIndex={0}
                                                // onClick={() => setOption(i)}
                                                onClick={() => {
                                                    checkAnswer(question.correct_option, i)
                                                    setActiveBtn(i)
                                                }}
                                            >



                                                {option.text}
                                            </button>
                                        )
                                    })}
                                </div>
                                <div>
                                    <p>{feedback}</p>
                                </div>
                                <div className='w-fit ml-auto  uppercase'>
                                    {totalAssessments === offset ?
                                        <div className='space-x-3'>
                                            <button
                                                className='py-2  hover:bg-gray-50 border px-4 rounded-lg mt-6 ml-auto'
                                                onClick={handleSubmit}
                                                disabled={feedback ? true : false}
                                            >
                                                Submit
                                            </button>
                                            <button disabled={feedback ? false : true} className='py-2  hover:bg-gray-50 border px-4 rounded-lg mt-6 ml-auto' onClick={next}>Finish</button>
                                        </div>
                                        :
                                        <div className='space-x-3'>
                                            <button
                                                className='py-2   bg-[#F08354]/20 text-[#F08354] cursor-pointer px-4 rounded mt-6 ml-auto'
                                                onClick={handleSubmit}
                                                disabled={feedback ? true : false}
                                            >
                                                Submit
                                            </button>
                                            <button disabled={feedback ? false : true} className='py-2  hover:opacity-60 px-8 rounded mt-6 ml-auto bg-[#F08354] text-white' onClick={handleNext}>
                                                Next
                                            </button>
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>
                    )
                })}

                {offset === totalAssessments + 1 && <div className='h-screen w-screen bg-[#FAF7ED] relative flex justify-center items-center'>
                    <div className='text-center'>
                        <h1 className="mb-4 text-3xl  mt-10 font-semibold leading-snug lg:font-extrabold lg:text-5xl lg:leading-none  lg:mb-4">Assessment Completed</h1>
                        <p>You got {totalCorrectAnswers} answer(s) correctly</p>

                        <div className='flex w-fit mx-auto gap-2'>
                            {passedCutoffMark() &&
                                <button className='px-8 bg-[#F08354] text-white py-2 flex items-center gap-2 mx-auto mt-4 rounded hover:opacity-75' onClick={() => {
                                    // dispatch(resetQuestions())
                                    router.back()
                                }}>
                                    Continue
                                </button>
                            }

                        </div>
                    </div>
                </div>}
            </div>

            {isOpen && <ReactPortal>
                <Modal>
                    <div className='text-center space-y-4'>

                        <span className='text-2xl font-bold'>:(</span>
                        <p>
                            Are you sure you want to quit?
                        </p>

                        <p>You will be redirected to the home page</p>


                        <div className='flex gap-3 mt-4'>
                            {/* <button className='px-4 py-2 w-full border rounded' onClick={() => router.push(`/courses/${assessment?.course}/preview`)}>Continue</button> */}
                            {/* <button className='px-4 py-2 w-full border rounded' onClick={() => setIsOpen(false)}>Close</button> */}
                        </div>
                    </div>
                </Modal>

            </ReactPortal>}
        </div>
    )
}

export default Index
