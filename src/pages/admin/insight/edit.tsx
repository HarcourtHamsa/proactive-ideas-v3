import CustomInput from '@/components/CustomInput'
import Layout from '@/components/admin/Layout'
import React, { useState } from 'react'
import { IQuestion } from '../../../../types/types';
import { useEffect } from 'react';
import { createInsight, fetchCourses, updateInsight } from '@/helper';
import { IoAdd, IoTrash } from 'react-icons/io5';
import { v4 as uuidv4 } from 'uuid'
import notify from '@/components/Notification';
import { ToastContainer } from 'react-toastify';
import Spinner from '@/components/Spinner';
import BackChevronButton from '@/components/BackChevronButton';
import { useRouter } from 'next/router';

interface IFormattedCourses {
    title: string;
    id: string;
}

function Create() {
    const { query } = useRouter()
    const { insight } = query
    const parsedInsight = JSON.parse(insight as string);

    console.log({ parsedInsight });

    const [title, setTitle] = useState(parsedInsight.title || '');
    const [course, setCourse] = useState(parsedInsight.course.id || '');
    const [questions, setQuestions] = useState<Array<IQuestion>>(parsedInsight.questions || []);
    const [courses, setCourses] = useState<Array<IFormattedCourses>>([])
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        switch (e.target.name) {
            case "title":
                setTitle(e.target.value);
                break;
            case "course":
                setCourse(e.target.value);
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


    const handleSubmit = async () => {
        if (title.trim() === '' || course.trim() === '' || questions.length === 0) {
            notify({ msg: 'Please fill all the fields', type: 'error' })
            return;
        }

        setIsLoading(true);

        try {
            await updateInsight({ title, course, questions, id: parsedInsight.id })
                .then((res) => {
                 notify({ msg: 'Insight updated successfully', type: 'success' })

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
        <Layout>
            <ToastContainer />
            <div className="p-4 mt-8">
                <BackChevronButton />
                <h2 className="text-3xl text-black font-bold mb-2">Edit Insight</h2>
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

                        <select
                            name="course"
                            id="course"
                            className='border-2 py-3 w-full lg:w-fit  px-4 rounded'
                            onChange={handleChange}
                            defaultChecked={true}>
                            {
                                courses.length === 0 ?
                                    <option value="">Fetching data</option> :

                                    <>
                                        <option value={parsedInsight.course?.id} key={parsedInsight.course?.id}>
                                            {parsedInsight.course?.title}
                                        </option>
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
                                onClick={() => setQuestions((prevState) => {
                                    return [...prevState, { question: '' }]
                                })}
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
                        className='py-2 px-4 rounded bg-orange-400 mt-8 text-white hover:opacity-75 flex gap-2'
                        onClick={handleSubmit}

                    >Update Insight {isLoading && <Spinner />}</button>
                </div>
            </div>
        </Layout>
    );
}


export default Create