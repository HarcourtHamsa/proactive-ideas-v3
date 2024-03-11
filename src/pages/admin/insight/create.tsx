import CustomInput from '@/components/CustomInput'
import Layout from '@/components/admin/Layout'
import React, { useState } from 'react'
import { IQuestion } from '../../../../types/types';
import { useEffect } from 'react';
import { createInsight, fetchCourses } from '@/helper';
import { IoAdd, IoClose, IoTrash } from 'react-icons/io5';
import { v4 as uuidv4 } from 'uuid'
import notify from '@/components/Notification';
import { ToastContainer } from 'react-toastify';
import Spinner from '@/components/Spinner';
import BackChevronButton from '@/components/BackChevronButton';
import { Interface } from 'readline';
import Modal from '@/components/Modal';

interface IFormattedCourses {
    title: string;
    id: string;
}

interface Suggestion {
    text: string;
    followUpQuestion: string;
}

interface Insight {
    question: string;
    suggestions: Suggestion[]
}

function Create() {
    const [title, setTitle] = useState('');
    const [course, setCourse] = useState('');
    const [question, setQuestion] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [followUpQuestion, setFollowUpQuestion] = useState('');
    const [questions, setQuestions] = useState<Array<IQuestion>>([]);
    const [courses, setCourses] = useState<Array<IFormattedCourses>>([])
    const [insights, setInsights] = useState<Array<Insight>>([])
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [showSuggestionModal, setShowSuggestionModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        switch (e.target.name) {
            case "title":
                setTitle(e.target.value);
                break;
            case "course":
                setCourse(e.target.value);
                break;
            case "question":
                setQuestion(e.target.value);
                break;
            case "suggestion":
                setSuggestion(e.target.value);
                break;
            case "followUpQuestion":
                setFollowUpQuestion(e.target.value);
                break;

            default:
                break;
        }
    };


    const handleCardInputChange = (event, index) => {
        setQuestions((prevState) => {
            const shallowCopyOfPrevState = prevState;
            shallowCopyOfPrevState[index] = { question: event.target.value }

            return shallowCopyOfPrevState
        })

    };

    const handleDelete = (index: number) => {
        const shallowCopyOfQuestions = [...questions];
        const mutatatedArr = shallowCopyOfQuestions.filter((_, i) => i !== index);
        setQuestions(mutatatedArr)
    };

    const handleAddSuggestion = () => {
        const foundInsightArr = insights.filter((insight) => insight.question === question)
        const foundInsight = foundInsightArr[0]
        const foundInsightIndex = insights.indexOf(foundInsight)

        const mutatedCopyOfInsight = Object.assign({}, foundInsight)
        mutatedCopyOfInsight.suggestions.push({ text: suggestion, followUpQuestion })

        const shallowCopyOfInsight = [...insights]



        shallowCopyOfInsight[foundInsightIndex] = mutatedCopyOfInsight
        setInsights(shallowCopyOfInsight)

        setSuggestion('')
        setFollowUpQuestion('')

    }


    const handleSubmit = async () => {
        if (title.trim() === '' || course.trim() === '' || questions.length === 0) {
            notify({ msg: 'Please fill all the fields', type: 'error' })
            return;
        }

        setIsLoading(true);

        try {
            await createInsight({ title, course, questions })
                .then(() => {
                    notify({ msg: 'Insight created successfully', type: 'success' })

                    setTimeout(() => {
                        window.location.href = '/admin/insight'
                    }, 1000 * 3);

                }).catch((err) => {
                    notify({ msg: err.response.data.message, type: 'error' })
                })
                .finally(() => {
                    setIsLoading(false)
                })
        } catch (err) {
            console.log(err);
        }

    };

    const handleDeleteSuggestion = (insight: Insight, suggestion: Suggestion) => {
        const insightIndex = insights.indexOf(insight)
        const foundInsight = insights[insightIndex]

        const mutatedInsight = foundInsight.suggestions.filter((s) => s !== suggestion)

        console.log({ mutatedInsight })
    }

    useEffect(() => {
        async function fetchData() {
            await fetchCourses().then((res) => {
                const formattedCourses = res.data?.map((d) => ({ title: d.title, id: d.id }))
                setCourses(formattedCourses)
            })
        };

        fetchData()
    }, []);

    return (
        <>
            <Layout>
                <ToastContainer />
                <div className="p-4 mt-8">
                    <BackChevronButton />
                    <h2 className="text-3xl text-black font-bold mb-2">Create Insight</h2>
                    <div className='bg-white border rounded min-h-[300px] h-fit p-4'>
                        <CustomInput
                            label="Title"
                            type="text"
                            name="title"
                            value={title}
                            onChange={handleChange}
                        />


                        <div>
                            <label htmlFor="course" className='block mt-4'>Select a Course:</label>

                            <select name="course" id="course" className='border-2 py-3 w-full lg:w-fit  px-4 rounded' onChange={handleChange} defaultChecked={true}>
                                {
                                    courses.length === 0 ?
                                        <option value="">Fetching data</option> :

                                        <>
                                            <option value="">Select Course</option>
                                            {
                                                courses?.map(course => (
                                                    <option key={course?.id} value={course?.id}>
                                                        {course?.title}
                                                    </option>
                                                ))
                                            }
                                        </>

                                }
                            </select>

                        </div>

                        <div className='mt-4 mb-8'>
                            <p>Questions</p>

                            <div className='block sm:grid sm:grid-cols-2 xl:grid-cols-4 gap-3'>

                                <div className='w-full flex items-center justify-center 
                            cursor-pointer h-[250px] 
                            rounded border-2 border-dashed'
                                    onClick={() => setShowQuestionModal(true)}
                                // onClick={() => setQuestions((prevState) => {
                                //     return [...prevState, { question: '' }]
                                // })}
                                >
                                    <IoAdd size={30} />
                                </div>

                                {questions.map((question, index) =>
                                    <div className='w-full flex items-center justify-center 
                            h-[250px] 
                            rounded border px-4 bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-rose-500 to-indigo-700 relative' key={Math.random()}>

                                        <IoTrash
                                            size={20}
                                            color='white'
                                            className='absolute top-2 right-2 cursor-pointer'
                                            onClick={() => handleDelete(index)} />

                                        <textarea
                                            contentEditable={true}
                                            onChange={(event) => handleCardInputChange(event, index)}

                                            placeholder='Enter question here'
                                            className='text-xl min-h-[100px] bg-transparent h-fit text-center text-white'>
                                            {question.question}
                                        </textarea>

                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            className='py-2 px-4 rounded bg-orange-400 ml-auto mt-8 text-white hover:opacity-75 flex gap-2'
                            onClick={handleSubmit}

                        >Create Insight {isLoading && <Spinner />}</button>
                    </div>
                </div>
            </Layout>

            {showQuestionModal && <Modal>
                <div className='flex justify-between items-center'>
                    <p className='text-lg'>Create Question</p>
                    <IoClose
                        size={25}
                        onClick={() => {
                            setShowQuestionModal(false)
                            setQuestion('')
                        }}
                        className='cursor-pointer'
                    />
                </div>
                <div className='mt-4'>
                    <input
                        placeholder='Enter question'
                        className='border w-full px-4 py-2 rounded-md'
                        name='question'
                        value={question}
                        onChange={handleChange}
                    />

                    <div className='flex gap-4 items-center flex-wrap my-8'>
                        <p className='
                   border w-fit px-4 py-2 border-dashed 
                    rounded-md cursor-pointer text-gray-400
                     hover:border-black'
                            onClick={() => {
                                setShowSuggestionModal(true)
                                const newInsight: Insight = {
                                    question,
                                    suggestions: []
                                }

                                setInsights((prevState) => {
                                    return [
                                        ...prevState,
                                        newInsight
                                    ]
                                })
                            }}
                        >Add Suggestion</p>
                        {insights.map((insight) => {
                            if (insight.question === question) {
                                return (
                                    insight.suggestions.map((suggestion) => {
                                        return <div
                                            className='px-4 py-2 
                                            w-fit rounded-md bg-gray-400
                                            flex items-center gap-4 text-white'
                                            key={Math.random()}>
                                            {suggestion.text}
                                            <IoClose
                                                size={20}
                                                className='cursor-pointer'
                                                onClick={() => handleDeleteSuggestion(insight, suggestion)}
                                            />
                                        </div>
                                    })
                                )
                            }
                        })}
                    </div>
                </div>

                {showSuggestionModal &&
                    <div
                        className='mt-4 flex flex-col gap-4 bg-gray-100 p-4 rounded-md'>
                        <input
                            placeholder='Enter Suggestion'
                            className='border w-full px-4 py-2 rounded-md'
                            name='suggestion'
                            value={suggestion}
                            onChange={handleChange}
                        />
                        <input
                            placeholder='Enter follow up question'
                            className='border w-full px-4 py-2 rounded-md'
                            name='followUpQuestion'
                            value={followUpQuestion}
                            onChange={handleChange}
                        />

                        <div className='flex gap-4'>
                            <button
                                className='px-4 py-2 bg-orange-400/10
                         text-orange-400 rounded-md'
                                onClick={() => setShowSuggestionModal(false)}
                            >Close</button>
                            <button className='px-4 py-2 bg-orange-400
                             text-white rounded-md'
                                onClick={handleAddSuggestion}
                            >
                                Add Suggestion</button>

                        </div>

                    </div>}
            </Modal>}
        </>
    );
}


export default Create