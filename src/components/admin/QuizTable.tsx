import React, { useState } from "react";
import { IoCheckmark, IoClose, IoCreateOutline, IoTrash, IoWarning } from "react-icons/io5";
import Search from "../SVGs/Search";
import { TbCheck, TbPlus } from "react-icons/tb";
import ReactPortal from "../ReactPortal";
import Modal from "../Modal";
import CustomInput from "../CustomInput";
import { QuizTypes } from "../../../types/types";
import { useCreateQuizMutation, useDeleteQuizMutation } from "@/features/apiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import notify from "../Notification";
import { ToastContainer } from "react-toastify";
import Spinner from "../Spinner";
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";
import useCookie from "@/hooks/useCookie";

function DynamicInput({ label, index, setCorrectAnswer, answer }: { label: string, index: number, answer: number, setCorrectAnswer: (e: any) => void }) {
    return (
        <div className="flex items-center gap-2">
            <p className="bg-gray-50 flex-1 py-2 px-4 border rounded">{label}</p>
            <div className={`${answer === index ? 'border-[#F08354]  text-white' : 'border-gray-500'}  border-2 flex items-center justify-center cursor-pointer w-6 h-6  rounded-full`} tabIndex={0} onClick={() => setCorrectAnswer(index)}>
                {/* <TbCheck size={20} /> */}
            </div>
        </div>
    )
}


function QuizTable({ quizArr }: { quizArr: any }) {
    const cookie = useCookie()
    const { "0": createQuiz, "1": createCourseStatus } = useCreateQuizMutation();
    const { "0": deleteQuiz, "1": deleteQuizStatus } = useDeleteQuizMutation();

    const [isOpen, setIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [questionType, setQuestionType] = useState('');
    const [question, setQuestion] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState<number>(0);
    const [options, setOptions] = useState<any>([]);
    const [inputController, setInputController] = useState('')
    const [referenceID, setRefenceID] = useState('');
    const [currentItem, setCurrentItem] = useState('');
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

    const handleCreateQuiz = async () => {
        const myOptionsArr = questionType == QuizTypes.trueOrFalse && [{ text: 'false' }, { text: 'true' }]

        const quiz = {
            question,
            type: questionType,
            options: options.length ? options : myOptionsArr,
            correctOption: correctAnswer
        }

        

        try {
            createQuiz({ quiz, id: referenceID, token: cookie?.user.accessToken }).then((res: any) => {
              
                notify({ msg: 'New quiz created!', type: 'success' });
                setTimeout(() => {
                    setIsOpen(!isOpen);
                }, 1000 * 2);
            }).catch((err: any) => {
               
                notify({ msg: 'Oops! an error occured', type: 'error' });
            })
        } catch (error) {
            notify({ msg: 'Oops! an error occured', type: 'error' });

        }





    }

    const handleClose = () => {
        setIsOpen(!isOpen);

        setQuestionType('');
        setQuestion('');
        setCorrectAnswer(0);
        setOptions([]);
        setRefenceID('');
        setInputController('');
    }

    const deleteItem = () => {

        try {
            deleteQuiz({ token: cookie?.user.accessToken, id: currentItem }).then((res: any) => {
             
                notify({ msg: 'Quiz deleted', type: 'success' });
            }).catch((err: any) => {
                
                notify({ msg: 'Oops! an error occured', type: 'error' });
            })

        } catch (error) {
         
            notify({ msg: 'Oops! an error occured', type: 'error' });
        } finally {
            setTimeout(() => {
                setDeleteModalIsOpen(false);
            }, 1000);
        }

    }


    return (
        <section className="">
            <ToastContainer />
            <div className=" w-full">
                <div className=" bg-white relative rounded border overflow-hidden">
                    <div className="flex md:flex-row items-center justify-between space-y-0 md:space-y-0 md:space-x-4 p-4">
                        <div className="md:w-[40%] w-[60%]">
                            <form className="flex items-center">
                                <label htmlFor="simple-search" className="sr-only">
                                    Search
                                </label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Search />
                                    </div>
                                    <input
                                        type="text"
                                        id="simple-search"
                                        className="border  rounded focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 bg-white placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Search"
                                        required={true}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="w-fit md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3  flex-shrink-0">
                            <button
                                disabled={true}
                                type="button"
                                className="flex items-center justify-center bg-[#11393C] text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded  px-4 py-2 bg-primary-600 hover:bg-primary-700 ml-3 focus:outline-none focus:ring-primary-800 disabled cursor-not-allowed opacity-20"
                                // onClick={() => setIsOpen(!isOpen)}
                                onClick={() => router.push("/admin/quiz/create")}
                            >
                                <TbPlus />
                                Create Quiz
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-500">
                            <thead className="text-xs  text-gray-400  bg-gray-700/10">
                                <tr>
                                    <th scope="col" className="px-4 py-3">
                                        Question
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        <span className="">Type</span>
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        <span className="whitespace-nowrap">Reference ID</span>
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        <span className="">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {quizArr?.data.map((quiz: any) => (
                                    <tr
                                        className="border-b border-gray-700/10"
                                        key={Math.random() * 100}
                                    >
                                        <td className="px-4 py-3 font-medium  whitespace-nowrap text-black">
                                            <p className="w-[200px] truncate">{quiz.question}</p>
                                        </td>

                                        <td className="px-4 py-3 text-black">
                                            <div className="flex items-center gap-2 whitespace-nowrap">

                                                {quiz.type === QuizTypes.trueOrFalse ? "True or False" : quiz.type === QuizTypes.multipleOptions ? "Multiple Choice" : "Default"}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 font-medium whitespace-nowrap text-black">
                                            <p>{quiz.subSectionId}</p>
                                        </td>

                                        <td className="px-4 py-1 flex items-center gap-2">
                                            {/* <button className="flex items-center gap-2 px-3 py-1 bg-[#404eed] rounded text-white">
                                                <span>Edit</span>
                                            </button> */}

                                            <button className="flex items-center gap-2 px-3 py-1 bg-red-500 rounded hover:opacity-80 whitespace-nowrap text-white" onClick={() => {

                                                setCurrentItem(quiz.id)
                                                setDeleteModalIsOpen(true)

                                            }}>
                                                {/* <IoTrash size={18} /> */}
                                                <span>Delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <nav
                        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                        aria-label="Table navigation"
                    >
                        <span className=" font-normal flex gap-1 text-gray-500">
                            Showing
                            <span className="font-semibold text-black">1-10</span>
                            of
                            <span className="font-semibold text-black">1000</span>
                        </span>

                    </nav>
                </div>
            </div>

            {deleteModalIsOpen && (
                <ReactPortal>
                    <Modal>
                        <div className="flex justify-between">
                            <h3 className="text-xl font-normal"> Notification</h3>

                            <div
                                className="w-6 h-6 border whitespace-nowrap rounded-full flex items-center justify-center cursor-pointer"
                                onClick={() => {
                                    setDeleteModalIsOpen(false);
                                }}
                            >
                                <AiOutlineClose size={12} />
                            </div>
                        </div>

                        <IoWarning size={40} className="mx-auto" />

                        <div className=" text-center mt-3">
                            <p>Are you sure you want to delete this item?</p>

                            <div className=" flex mx-auto">
                                <button
                                    className="px-4 py-2 border flex flex-1 justify-center rounded mr-3 mt-4 hover:bg-gray-100"
                                    onClick={deleteItem}
                                >
                                    {deleteQuizStatus.isLoading && <Spinner />} Delete
                                </button>
                                <button
                                    className="px-4 py-2 border flex-1 rounded mt-4 hover:bg-gray-100"
                                    onClick={() => {
                                        setDeleteModalIsOpen(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Modal>
                </ReactPortal>
            )}

            {isOpen && <ReactPortal>
                <div className="h-screen w-screen bg-black opacity-60 fixed z-50 top-0 flex justify-center items-center transition duration-75"></div>
                <div className="h-fit w-screen bg-transparent fixed top-0 z-[100] flex md:-translate-x-0 justify-end transition duration-75">
                    <div className="w-[90%] h-screen sm:w-[400px]  z-[100] bg-[#fff] shadow-md p-4 transition duration-75 overflow-x-hidden">

                        <div className="flex justify-between items-center mb-4">
                            <IoClose size={25} className="cursor-pointer text-gray-600" onClick={handleClose} />
                        </div>

                        <div>

                            <label htmlFor="message" className="block font-medium text-gray-900 dark:text-white">Enter Question</label>
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

                            <div className="mb-8">
                                <CustomInput
                                    label="Reference ID"
                                    type="text"
                                    value={referenceID}
                                    onChange={((e: any) => setRefenceID(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2 mt-6">
                                <button
                                    className=" border flex gap-2 justify-center items-center w-full py-2 text-center rounded" onClick={handleCreateQuiz}>
                                    {createCourseStatus.isLoading && <Spinner />}
                                    Create Quiz
                                </button>
                                <button className="block border w-full py-2 text-center rounded" onClick={handleClose}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </ReactPortal>}
        </section>
    );
}

export default QuizTable;
