import { useEffect } from 'react'
import ReactPortal from '@/components/ReactPortal'
import Layout from '@/components/admin/Layout'
import { useCreateQuizMutation, useFetchCoursesQuery, useUpdateQuizMutation } from '@/features/apiSlice'
import http from '@/lib/http'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { IoAddCircle, IoClose } from 'react-icons/io5'
import { QuizTypes } from '../../../../../types/types'
import CustomInput from '@/components/CustomInput'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import Spinner from '@/components/Spinner'
import notify from '@/components/Notification'
import { ToastContainer } from 'react-toastify'
import { TbEdit, TbEye, TbTrash, TbWriting } from 'react-icons/tb'
import BackChevronButton from '@/components/BackChevronButton'
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


function Create({ course, quizzes }: { course: any, quizzes: any }) {
    const { "0": createQuiz, "1": createCourseStatus } = useCreateQuizMutation();
    const { "0": updateQuiz, "1": quizUpdateStatus } = useUpdateQuizMutation();
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [questionType, setQuestionType] = useState('');
    const [question, setQuestion] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState<number>(0);
    const [options, setOptions] = useState<any>([]);
    const [feedback, setFeedback] = useState({
        correct: '',
        incorrect: ''
    });
    const [inputController, setInputController] = useState('')
    const [referenceID, setRefenceID] = useState('');
    const [currentItem, setCurrentItem] = useState('');
    const [isUpdateOperation, setIsUpdateOperation] = useState<null | boolean>(null)
    const cookie = useCookie()
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
                                <div className='flex gap-4 items-center'  key={Math.random()}>
                                    <DynamicInput key={Math.random()} label={option.text} index={index} setCorrectAnswer={setCorrectAnswer} answer={correctAnswer} />
                                    <TbTrash size={20} className='cursor-pointer' onClick={() => {
                                        const filteredOptions = options.filter((v) => v.text !== option.text)
                                        setOptions(filteredOptions)

                                    }} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            );
        }
    }



    const handleCreateQuiz = async () => {
        const myOptionsArr = questionType == QuizTypes.trueOrFalse && [{ text: 'false' }, { text: 'true' }]
        const existingQuiz = quizzes.find((quiz: any) => quiz.id === currentItem)

        const quiz = {
            question,
            type: questionType,
            options: options.length ? options : myOptionsArr,
            correct_option: correctAnswer,
            sub_section: referenceID,
            feedback
        }

        try {
            if (existingQuiz) {
                updateQuiz({ quiz, id: currentItem, token: cookie?.user.accessToken })
                    .then(() => {
                        notify({ msg: 'Quiz updated!', type: 'success' });
                        setTimeout(() => {
                            setModalIsOpen(!modalIsOpen);
                        }, 1000 * 2);
                    }).catch((err) => {
                        throw err
                    })
            } else {
                createQuiz({ quiz, id: referenceID, token: cookie?.user.accessToken }).then((res) => {
                    console.log(res);
                    notify({ msg: 'New quiz created!', type: 'success' });
                    setTimeout(() => {
                        setModalIsOpen(!modalIsOpen);
                        // router.push("/admin/quiz")
                    }, 1000 * 2);
                }).catch((err) => {
                    throw err
                })
            }

        } catch (error) {
            notify({ msg: 'Oops! an error occured', type: 'error' });

        } finally {

        }





    }

    const handleClose = () => {
        setModalIsOpen(!modalIsOpen);

        setQuestionType('');
        setQuestion('');
        setCorrectAnswer(0);
        setOptions([]);
        setRefenceID('');
        setInputController('');
        setFeedback({ correct: '', incorrect: '' })
        setCurrentItem('')
    }



    return (
        <Layout>
            <div className="p-4 mt-8">
                <BackChevronButton />
                <h2 className="text-4xl text-black font-bold mb-2">Create Quiz</h2>
                <ToastContainer />


                <div className='mt-8'>
                    {
                        course?.sections?.map((section: any) => {


                            return (
                                <div key={Math.random()}>
                                    {section.sub_sections.map((ss: any) => {
                                        return (
                                            <div key={Math.random()} className='mb-8'>
                                                <div className='border relative py-3 px-4 bg-white rounded mt-4 mb-2 cursor-pointer hover:opacity-70'>
                                                    <span className='absolute -top-4 border text-sm rounded-full px-4 bg-white'>Sub-section</span>
                                                    <span className='absolute right-10 w-fit' title='Add quiz' onClick={() => {
                                                        setRefenceID(ss?._id)
                                                        setModalIsOpen(true)
                                                    }}>
                                                        <IoAddCircle size={30} />
                                                    </span>

                                                    {ss.title}
                                                </div>

                                                <div>
                                                    {quizzes.map((quiz: any) => {
                                                        if (quiz.sub_section === ss._id) {
                                                            return (
                                                                <p key={Math.random()} className='py-2.5 flex items-center justify-between px-4 ml-8 relative mt-6 bg-white border rounded'>
                                                                    <span className='absolute -top-4 border text-sm rounded-full px-4 bg-white'>Quiz</span>

                                                                    Question: {quiz.question}
                                                               
                                                                    <div className='flex gap-4 items-center'>
                                                                        <span>
                                                                            <button 
                                                                            className='bg-orange-400 text-white px-4 rounded text-sm py-1' 
                                                                            onClick={() => router.push(`/admin/quiz/preview/${quiz.id}`)}
                                                                            >Preview</button>
                                                                        </span>
                                                                        <span>
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

                                                                                    console.log({ quiz });

                                                                                }}
                                                                            />
                                                                        </span>
                                                                        <span>
                                                                            <TbTrash
                                                                                size={20}
                                                                                className='cursor-pointer'
                                                                            // onClick={}
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                </p>
                                                            )
                                                        }

                                                    })}
                                                </div>





                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })
                    }

                </div>

                {modalIsOpen && <ReactPortal>
                    <div className="h-screen w-screen bg-black opacity-60 fixed z-50 top-0 flex justify-center items-center transition duration-75"></div>
                    <div className="h-fit w-screen bg-transparent fixed top-[3%] lg:top-[10%] z-[100] flex md:-translate-x-0 items-center justify-center transition duration-75 overflow-hidden">
                        <div className="w-[90%] min-h-[400px] sm:h-[500px] sm:w-[60%]  z-[200] bg-[#fff] rounded shadow-md p-4 transition duration-75 overflow-x-hidden">

                            <div className="flex items-center mb-8 ">
                                <IoClose size={25} className="cursor-pointer text-gray-600" onClick={handleClose} />
                                {/* <p>Create Quiz</p> */}
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

                                <div className="mb-8 disabled opacity-40" aria-disabled>
                                    <CustomInput
                                        label="Reference ID"
                                        type="text"
                                        value={referenceID}

                                        onChange={((e: any) => setRefenceID(e.target.value))}
                                    />
                                </div>

                                <div className="mt-6 flex gap-2">
                                    <button
                                        className=" border py-2  flex justify-center items-center w-full text-center rounded" onClick={handleCreateQuiz}>
                                        {createCourseStatus.isLoading || quizUpdateStatus.isLoading && <Spinner />}
                                        Publish Quiz
                                    </button>
                                    <button className=" border py-2 flex justify-center items-center w-full text-center rounded" onClick={handleClose}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ReactPortal>}
            </div>
        </Layout >
    )
}

export default Create

export async function getServerSideProps(ctx) {
    const { id } = ctx.query;

    const response = await http.get(`/get-course-by-id?id=${id}`);
    const quizzes = await http.get("/get-quizzes")

    return {
        props: {
            course: response?.data?.data || null,
            quizzes: quizzes?.data?.data || null,
        },
    };
}