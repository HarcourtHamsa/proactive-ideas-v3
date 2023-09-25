import ReactPortal from '@/components/ReactPortal'
import Layout from '@/components/admin/Layout'
import { useCreateAssessmentMutation, useCreateQuizMutation, useFetchCoursesQuery } from '@/features/apiSlice'
import http from '@/lib/http'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { IoAddCircle, IoClose, IoTrashBin } from 'react-icons/io5'
import { QuizTypes } from '../../../../../types/types'
import CustomInput from '@/components/CustomInput'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import Spinner from '@/components/Spinner'
import notify from '@/components/Notification'
import { ToastContainer } from 'react-toastify'
import { TbEdit, TbPencil, TbTrash } from 'react-icons/tb'
import BackChevronButton from '@/components/BackChevronButton'
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { addQuestion, resetQuestions } from '@/features/assessment/assessmentSlice'
import useCookie from '@/hooks/useCookie'

function DynamicInput({ label, index, setCorrectAnswer, answer }: { label: string, index: number, answer: number, setCorrectAnswer: (e: any) => void }) {
    return (
        <div className="flex items-center gap-2">
            <p className="bg-gray-50 flex-1 py-2 px-4 border rounded">{label}</p>
            <div className={`${answer === index ? 'border-[#F08354]  text-white' : 'border-gray-500'}  border-4 flex items-center justify-center cursor-pointer w-4 h-4  rounded-full`} tabIndex={0} onClick={() => setCorrectAnswer(index)}>
                {/* <TbCheck size={20} /> */}
            </div>
        </div>
    )
}


function Create({ course, assessments }: { course: any, assessments: any }) {
    const { "0": createAssessment } = useCreateAssessmentMutation();
    const [isLoading, setIsLoading] = useState(false)
    const assessmentState = useSelector((state: RootState) => state.assessment)
    const dispatch = useDispatch();
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [questionType, setQuestionType] = useState('');
    const [question, setQuestion] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState<number>(0);
    const [options, setOptions] = useState<any>([]);
    const [inputController, setInputController] = useState('')
    const [referenceID, setRefenceID] = useState('');
    const initialTitle = assessments && assessments.length > 0 ? assessments[0]?.title || '' : '';
    const [title, setTitle] = useState(initialTitle);
    const [currentItem, setCurrentItem] = useState('');
    const cookie = useCookie()
    const [questions, setQuestions] = useState<any[]>(assessmentState.questions || assessments[0]?.questions)


    const [feedback, setFeedback] = useState({
        correct: '',
        incorrect: ''
    });
    const router = useRouter()

    const handleQuestionChange = (e: any) => {
        setQuestion(e.target.value);
    }

    const handleQuestionTypeChange = (e: any) => {
        setQuestionType(e.target.value);
    }


    const generateDynamicInputs = (questionType: any) => {
        if (questionType === QuizTypes.trueOrFalse) {
            return (
                <div className="space-y-2">
                    {new Array(2).fill(0).map((_, index): any => {
                        return (
                            <DynamicInput key={Math.random()} label={index ? "True" : "False"} index={index} setCorrectAnswer={setCorrectAnswer} answer={correctAnswer} />
                        )
                    })}
                </div>
            )

        } else if (questionType === QuizTypes.multipleOptions) {
            return (
                <div>

                    <div className="flex justify-between gap-2">
                        <span className="flex-1">
                            <CustomInput
                                label=""
                                type="text"
                                value={inputController}
                                onChange={(e: any) => setInputController(e.target.value)}
                            />
                        </span>
                        <button
                            className="px-4 py-2 border bg-gray-100 rounded"
                            onClick={() => {
                                setInputController("");
                                setOptions((prevState: any) => [...prevState, { text: inputController }])
                            }}>Add</button>
                    </div>

                    <div className="mt-4 space-y-2">
                        {options?.map((option: any, index: number) => {
                            return (
                                <DynamicInput key={Math.random()} label={option.text} index={index} setCorrectAnswer={setCorrectAnswer} answer={correctAnswer} />
                            )
                        })}
                    </div>
                </div>
            );
        }
    }


    const deleteQuestion = (question: any) => {
        const filteredQuestions = questions.filter((q: any) => q.question !== question.question)
        setQuestions(filteredQuestions)
        notify({ msg: 'Question deleted!', type: 'success' });

    }


    const handleCreateQuiz = async () => {
        const assessmentExists = assessments[0];


        const myOptionsArr = questionType == QuizTypes.trueOrFalse && [{ text: 'false' }, { text: 'true' }]

        const quiz = {
            question,
            type: questionType,
            options: options.length ? options : myOptionsArr,
            correct_option: correctAnswer,
            feedback
            // sub_section: currentItem
        }


        setQuestions((prevState) => ([...prevState, quiz]))




        setQuestionType('');
        setQuestion('');
        setCorrectAnswer(0);
        setOptions([]);
        setRefenceID('');
        setInputController('');
        setModalIsOpen(false)
    }

    const handleCreateAssessment = async () => {
        setIsLoading(true)

        const data = {
            questions,
            course: course?.id,
            title: title
        }

        dispatch(resetQuestions())


        if (assessments[0]?.title) {

            try {
                await http.patch(`/update-assessment?id=${assessments[0]?.id}`, data)
                setTimeout(() => {
                    notify({ msg: "Assessment updated", type: 'success' })
                }, 1000 * 1);
            } catch (error) {
                notify({ msg: "Oops! an error occured", type: 'error' })
                throw error
            }
        } else {
            try {
                createAssessment({ data, token: cookie?.user?.accessToken }).then(() => {
                    notify({ msg: 'Accessment created!', type: 'success' });
                    setTimeout(() => {
                        router.push("/admin/courses")
                    }, 1000 * 1);
                })
            } catch (error) {
                notify({ msg: 'Oops! an error occured', type: 'error' });
                throw error
            }
        }

        setIsLoading(false)




    }

    const handleClose = () => {
        setModalIsOpen(!modalIsOpen);

        setQuestionType('');
        setQuestion('');
        setCorrectAnswer(0);
        setOptions([]);
        setRefenceID('');
        setInputController('');
    }



    return (
        <Layout>
            <div className="p-4 mt-8">
                <span onClick={() => dispatch(resetQuestions())}>
                    <BackChevronButton />
                </span>
                <h2 className="text-4xl text-black font-bold mb-2">Create Assessment</h2>
                <ToastContainer />


                <div className='mt-8 bg-white p-4 rounded border'>
                    <div className="mb-3 disabled space-y-3 opacity-40" aria-disabled>
                        <CustomInput
                            label="Course"
                            type="text"
                            value={course?.title}
                        />

                        <CustomInput
                            label="Reference ID"
                            type="text"
                            value={course?.id}
                        />
                    </div>
                    <CustomInput
                        label="Title"
                        type="text"
                        value={title}
                        onChange={((e: any) => setTitle(e.target.value))}
                    />

                    <div className='mt-4'>
                        <div className='flex gap-2'>
                            <p>Questions </p>
                            <IoAddCircle size={30} className='cursor-pointer' onClick={() => setModalIsOpen(true)} />
                        </div>

                        {/* <div className='space-y-2 mt-4'>
                            {assessments?.map((assessment: any) => {

                                return (
                                    assessment.questions.map((quiz: any) => {
                                        return (
                                            <div key={Math.random()} className='py-3 flex justify-between px-4 border mb-4 rounded-md '>{quiz.question}

                                                <div className='flex gap-2 items-center'>
                                                    <TbEdit
                                                        size={20}
                                                        className='cursor-pointer'
                                                        onClick={() => {
                                                            setModalIsOpen(true)
                                                            setQuestion(quiz?.question)
                                                            setQuestionType(quiz?.type)
                                                            setOptions(quiz?.options)
                                                            setRefenceID(quiz?.sub_section)
                                                            setFeedback(quiz?.feedback)
                                                            setCurrentItem(quiz?.id)
                                                        }}
                                                    />
                                                    <TbTrash size={20} className='cursor-pointer' />
                                                </div>
                                            </div>
                                        )
                                    })
                                )

                            })}
                        </div> */}

                        <div className='space-y-2 mt-4'>
                            {questions?.map((quiz: any) => {
                                return (
                                    <div key={Math.random()} className='border flex justify-between py-3 px-4 rounded-md relative bg-white'>
                                        {quiz.question}


                                        <div className='flex items-center gap-4'>

                                            <span
                                                className=' cursor-pointer'
                                                onClick={() => deleteQuestion(quiz)}>
                                                <TbTrash size={25} className='cursor-pointer' />

                                            </span>
                                            <div className='flex gap-2 items-center'>
                                                <TbPencil
                                                    size={25}
                                                    className='cursor-pointer'
                                                    onClick={() => {
                                                        setModalIsOpen(true)
                                                        setQuestion(quiz?.question)
                                                        setQuestionType(quiz?.type)
                                                        setOptions(quiz?.options)
                                                        setRefenceID(quiz?.sub_section)
                                                        setFeedback(quiz?.feedback)
                                                        setCurrentItem(quiz?.id)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div>

                            </div>

                        </div>

                        <div className='flex gap-4'>
                            <button
                                className='py-2 bg-[#F08354]/20 text-[#F08354] px-4 rounded mt-8 hover:opacity-80'
                                onClick={() => {
                                    dispatch(addQuestion({ questions }))

                                    router.push({
                                        pathname: "/admin/assessment/preview",
                                        query: JSON.stringify(questions)
                                    }, "/admin/assessment/preview")
                                }}
                            >Preview</button>
                            <button className='py-2 bg-[#F08354] flex text-white px-4 rounded mt-8 hover:opacity-80' onClick={handleCreateAssessment}>
                                {isLoading && <Spinner />}
                                Create Assessment
                            </button>
                        </div>

                    </div>

                </div>

                {
                    modalIsOpen && <ReactPortal>
                        <div className="h-screen w-screen bg-black opacity-60 fixed z-50 top-0 flex justify-center items-center transition duration-75"></div>
                        <div className="h-fit w-screen bg-transparent fixed top-[3%] lg:top-[20%] z-[100] flex md:-translate-x-0 items-center justify-center transition duration-75 overflow-hidden">
                            <div className="w-[90%] min-h-[400px] sm:h-[400px] sm:w-[40%]  z-[200] bg-[#fff] rounded shadow-md p-4 transition duration-75 overflow-x-hidden">

                                <div className="flex items-center mb-4">
                                    <IoClose size={25} className="cursor-pointer text-gray-600" onClick={handleClose} />
                                    <p>Create Question</p>
                                </div>

                                <div>

                                    <label htmlFor="message" className="block font-medium text-gray-900">Enter Question</label>
                                    <textarea id="message" rows={4} className="block p-2.5 w-full text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write your question here..." value={question} onChange={handleQuestionChange}></textarea>



                                    <div className="my-8">
                                        <label htmlFor="countries" className="block font-medium text-gray-900">Select a Question Type</label>
                                        <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-4" onChange={handleQuestionTypeChange}>
                                            <option selected>Choose a type</option>
                                            <option value={QuizTypes.trueOrFalse}>True or False</option>
                                            <option value={QuizTypes.multipleOptions}>Multiple Choice</option>
                                        </select>
                                    </div>

                                    <div className="mb-8">
                                        <p>Options</p>
                                        {questionType !== "" && generateDynamicInputs(questionType)}
                                    </div>


                                    <div className=' space-y-4 mb-4'>
                                        <div>
                                            <p>Feedback (correct)</p>
                                            <textarea
                                                id="message"
                                                rows={4}
                                                className="block p-2.5 w-full text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Write your feedback here..."
                                                name="correct_feedback"
                                                value={feedback?.correct}
                                                onChange={((e: any) => {
                                                    if (e.target.name === "correct_feedback") {
                                                        setFeedback(prevState => ({
                                                            ...prevState,
                                                            correct: e.target.value
                                                        }))
                                                    }
                                                })}
                                            >

                                            </textarea>
                                        </div>

                                        <div>
                                            <p>Feedback (incorrect)</p>
                                            <textarea
                                                id="message"
                                                rows={4}
                                                className="block p-2.5 w-full text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Write your feedback here..."
                                                name="incorrect_feedback"
                                                value={feedback?.incorrect}
                                                onChange={((e: any) => {
                                                    if (e.target.name === "incorrect_feedback") {
                                                        setFeedback(prevState => ({
                                                            ...prevState,
                                                            incorrect: e.target.value
                                                        }))
                                                    }
                                                })}
                                            >

                                            </textarea>

                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-2">
                                        <button className=" text-[#F08354] py-2 flex bg-orange-400/30 justify-center items-center w-full text-center rounded" onClick={handleClose}>Close</button>
                                        <button
                                            className="py-2 bg-[#F08354] text-white  flex justify-center items-center w-full text-center rounded" onClick={handleCreateQuiz}>
                                            {isLoading && <Spinner />}
                                            Create Question
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ReactPortal>
                }
            </div >
        </Layout >
    )
}

export default Create

export async function getServerSideProps(ctx) {
    const { id } = ctx.query;

    const response = await http.get(`/get-course-by-id?id=${id}`);
    const assessments = await http.get(`/get-assessments?course=${id}`)


    return {
        props: {
            course: response.data.data || null,
            assessments: assessments.data.data || null,
        },
    };
}