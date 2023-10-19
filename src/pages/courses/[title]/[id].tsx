import React, { useEffect, useRef, useState } from 'react'
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useFetchAssessmenmtsQuery, useFetchCourseEnrollmentQuery, useFetchQuizzesQuery } from '../../../features/apiSlice';
import Loader from '@/components/Loader';
import { authOptions } from '../../../pages/api/auth/[...nextauth]'
import { decryptData, fetchCourseById, fetchCourseEnrollment, getPriceBasedOnLocation } from '@/helper';
import BackChevronButton from '@/components/BackChevronButton';
import useAuth from '@/hooks/useAuth';
import Restricted from '@/components/Restricted';
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import ReactPortal from '@/components/ReactPortal';
import Modal from '@/components/Modal';
import PayWall from '@/components/admin/PayWall';
import { TbCheck, TbCross, TbDownload } from 'react-icons/tb';
import { IoCheckmark, IoClose } from 'react-icons/io5';
import http from '@/lib/http';
import Menu from '@/components/Menu';
import { getServerSession } from 'next-auth/next'
import teamSuccessPNG from '@/assets/team-success.png'
import Image from 'next/image';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import useCookie from '@/hooks/useCookie';
import axios from 'axios';
import { getSession, useSession } from "next-auth/react";


function SingleCourse({ course, lessons, subscriber }: any) {
    const { data: session } = useSession();
    const [contents, setContents] = useState(lessons);
    const [courseIsComplete, setCourseIsComplete] = useState(false)
    const [showSubscribeScreen, setShowSubscribeScreen] = useState(false)
    const [currentLesson, setCurrentLesson] = useState("")
    const [quiz, setQuiz] = useState([]);
    const router = useRouter();
    const cookie = useCookie();
    const [feedback, setFeedback] = useState<null | string>(null)
    const [currentOption, setCurrentOption] = useState<number | null>(null)
    const [isCorrect, setIsCorrect] = useState(false)
    const [activeOptions, setActiveOptions] = useState<number[]>([]);
    const [isQuizSubmitted, setIsQuizSubmitted] = useState(false)
    const [showSidebar, setShowSidebar] = useState(false)
    const geo = useSelector((state: RootState) => state.geo)
    const [showTableOfContents, setShowTableOfContents] = useState(false)

    const { data: quizzes, isLoading: isFetchingQuizzes } = useFetchQuizzesQuery("");
    const { data: assessment, isLoading: isFetchingAssessment } = useFetchAssessmenmtsQuery({ course: course?.id });
    const { data: enrollment, isLoading: isFetchingEnrollment } = useFetchCourseEnrollmentQuery({ course: course?.id, user: cookie?.user?.id })

    const parsedSubscriber = JSON.parse(subscriber)

    const [progress, setProgress] = useState(Math.ceil(parsedSubscriber?.progress) || 0)
    const [count, setCount] = useState(Math.floor((progress / 100) * contents.length));
    const [copyOfCount, setCopyOfCount] = useState(count)





    if (isFetchingQuizzes && isFetchingAssessment && isFetchingEnrollment) {
        return <Loader />
    }


    const generateBody = (arr: any) => {
        console.log({ arr });

        return arr[count]?.content
    }


    const previousContent = async () => {
        setFeedback(null)
        setCurrentOption(null)
        setIsCorrect(false)
        setActiveOptions([])
        setIsQuizSubmitted(false)

        setCount(count - 1);
    }


    const nextContent = async () => {
        setFeedback(null)
        setCurrentOption(null)
        setIsCorrect(false)
        setActiveOptions([])
        setIsQuizSubmitted(false)

        if (count === contents.length - 1) {
            // code goes here
            setCourseIsComplete(true)
            return;
        }

        console.log({ parsedSubscriber });


        if (!parsedSubscriber) {
            if (count >= 6) {
                setShowSubscribeScreen(true)
                return
            }
        }

        setCount(count + 1);
        setCopyOfCount(count + 1)
        // setFakeCount(count);


        const currentProgress = calculateProgress(count + 1, contents.length)
        // console.log({currentProgress});
        setProgress(Math.ceil(currentProgress))



        // call DB progress increment
        await http.patch(`/update-progress?course=${course?.id}&user=${cookie.user?.id}`, { progress: currentProgress })

    }


    const selectContent = (body: any) => {
        const lessonIndex = contents.findIndex((lesson: any) => lesson._id === body._id)

  

        console.log({copyOfCount});
        console.log({lessonIndex});
        


        if (copyOfCount >= lessonIndex){
            setCount(lessonIndex);
            // setCopyOfCount(lessonIndex);
        }

        console.log({ lessonIndex });
        console.log({ copyOfCount });
        

        // if (count >= lessonIndex) {
        // setFakeCount(lessonIndex);
        // setProgress(lessonIndex)
        // }
    }

    const checkAnswer = (correctOption: number, yourOption: number) => {
        if (correctOption === yourOption) {
            setIsCorrect(true)
        } else {
            setIsCorrect(false)
        }
    }



    const generateQuiz = (arr: any) => {
        const handleOptionClick = (quizIndex: number, optionIndex: number) => {
            const newActiveOptions = [...activeOptions];
            newActiveOptions[quizIndex] = optionIndex;
            setActiveOptions(newActiveOptions);
        };

        const currentSubSectionId = arr[count]?._id;

        const quizToDisplay = quizzes?.data.filter((quiz: any) => quiz.sub_section === currentSubSectionId);

        if (quizToDisplay.length === 0) {
            return null;
        }

        return quizToDisplay.map((quizInfo: any, i: number) => (
            <div key={Math.random()} className="min-h-[200px] h-fit bg-white px-8 py-8 rounded border my-8">
                <div className="text-lg">Question {i + 1}: {quizInfo.question}</div>
                <p className="mt-1 text-gray-400 text-sm">Choose the correct answer.</p>

                <div className="space-y-0 mb-4">
                    {quizInfo.options.map((option: any, index: number) => {
                        const isActive = activeOptions[i] === index;

                        return (
                            <div key={index}>
                                <div
                                    tabIndex={0}
                                    className={`px-4 py-1 duo-button relative rounded border w-full ${isActive ? 'active' : ''} ${isQuizSubmitted ? 'cursor-not-allowed' : ''}`}
                                    onClick={() => {
                                        if (isQuizSubmitted) {
                                            return;
                                        }

                                        setIsCorrect(quizInfo.correct_option === index);
                                        setCurrentOption(index);
                                        handleOptionClick(i, index);
                                    }}
                                >
                                    <p className="cursor-pointer px-4 py-2 rounded capitalize">{option.text}</p>
                                </div>
                            </div>
                        );
                    })}

                    {isQuizSubmitted && activeOptions[i] === quizInfo.correct_option && (
                        <p className="flex items-center gap-2 mt-4 ml-4">
                            <TbCheck className="text-green-600" size={20} /> {quizInfo.feedback.correct}
                        </p>
                    )}

                    {isQuizSubmitted && activeOptions[i] !== quizInfo.correct_option && (
                        <p className="flex items-center gap-2 mt-4 ml-4">
                            <IoClose className="text-red-600" size={20} /> {quizInfo.feedback.incorrect}
                        </p>
                    )}
                </div>
            </div>
        ));
    };


    function calculateProgress(currentPosition: number, totalItems: number): number {
        if (totalItems === 0) {
            return 0; // To avoid division by zero
        }

        const progressPercentage = (currentPosition / totalItems) * 100;
        return Math.min(progressPercentage, 100); // Ensure progress is capped at 100%
    }

    function handleQuiz() {

        const arr: any = Array.from(contents)
        const currentSubSectionId = arr[count]?._id;
        const quizToDisplay = quizzes?.data.filter((quiz: any) => quiz.sub_section === currentSubSectionId);
        const correctAnswers = quizToDisplay.map((quiz: any) => quiz.correct_option)

        setIsQuizSubmitted(true)




    }

    async function createCertificate() {
        const user = cookie.user.id
        const course = assessment.data[0].course

        try {
            await http.post('/create-certificate', { user, course })
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
      }, [count]);

    return (
        <div>
            {cookie?.user.email ?

                showSubscribeScreen ?
                    <PayWall
                        amount={
                            getPriceBasedOnLocation({
                                country: geo.country,
                                prices: course?.prices
                            })[0]
                        }
                        courseId={course?.id}
                        currency={getPriceBasedOnLocation({
                            country: geo.country,
                            prices: course?.prices
                        })[1]}
                    /> :
                    <div className='bg-[#FAF7ED]  flex'>
                        {/* I STOPPED HERE */}
                        <div className='w-[90%] lg:w-[20%] bg-[#FAF7ED]  border-r z-50 text-[#FAF7ED] h-screen fixed left-0 top-0 bottom-0 hidden  xl:block' style={{ display: showSidebar ? 'block' : '' }}>
                            <aside className='h-[500px] lg:w-[100%] w-[90%] -z-1  mx-auto lg:col-span-1 mb-10 lg:mb-0 '>

                                <div className='w-[30px] h-[30px] flex items-center justify-center shadow bg-gray-200 rounded-full ml-auto mt-4 mb-4 lg:hidden' onClick={() => setShowSidebar(!showSidebar)} >
                                    <IoClose className='text-[#11393C]' />
                                </div>


                                <div className='px-4 py-3 h-[15%] mb-14  items-center  gap-2'>
                                    <p className=" leading-snug text-[#11393C] capitalize line-clamp-2 mb-4">{course?.title}</p>

                                    {/* {cookie.user.id} */}
                                    <p className='text-[#11393C]'>Progress: {progress}%</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                        <div className="bg-orange-400 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>

                                <div className={`h-full overflow-auto`}>
                                    <ul key={Math.random()} className='px-0 list-decimal ul__unset pb-4'>
                                        {course?.sections?.map((section: any, index: number) => {
                                            return (
                                                <span key={Math.random()}>
                                                    <li className='py-2 mt-0 bg-gray-200 text-[#11393C] px-4 list-none flex justify-between uppercase tracking-wider text-sm line-clamp-0'>
                                                        {(index + 1).toString().padStart(2, "0")}. {section.title}


                                                    </li>
                                                    <ul className=' list-disc divide-y-[1px] divide-gray-200 ul__unset'>
                                                        {section?.sub_sections?.map((ss: any, index: number) => {
                                                            const targetTitle = ss.title;
                                                            const foundindex = lessons.findIndex((lesson: any) => lesson.title === targetTitle);
                                                            return (
                                                                <li
                                                                    key={Math.random()}
                                                                    onClick={() => {



                                                                        selectContent(ss)
                                                                    }}
                                                                    className={`list-none  px-2 py-2  text-sm cursor-pointer flex ${foundindex === count ? 'text-orange-400 bg-[#11393C]' : 'text-[#11393C]'}`}>
                                                                    <span className='truncate'>
                                                                        {ss.title}
                                                                    </span>
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                   
                                                </span>
                                            )
                                        })}
                                    </ul>
                                    <div className='px-4 h-[100px] flex justify-center items-center'>
                                        <div>
                                            {/* <p className='uppercase text-sm mb-4'>Interactive Assessment</p> */}
                                        <div className='bg-orange-500/20 border-orange-500 text-orange-500 py-2 px-6 rounded-full text-center'>
                                            <p>Assessment</p>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                   
                            </aside>
                        </div>

                        <div className='xl:w-[80%] grid xl:grid-cols-3 relative grid-cols-1 gap-8 w-[100%] min-h-screen h-fit xl:ml-[20%] transition-opacity'>

                            <div className='xl:col-span-2 col-span-1 relative w-full p-5 overflow-hidden'>

                                {/* <div className='toc-gradient lg:hidden max-h-[70%] shadow overflow-scroll  z-30 rounded fixed bottom-0 w-full left-0 right-0 p-4' style={{ backgroundColor: showTableOfContents ? 'white' : '' }}>
                                    <button className='w-full py-2 bg-[#F08354] mb-2 rounded text-white' onClick={() => setShowSidebar(!showSidebar)}>Course Curriculum</button>

                                    {
                                        showTableOfContents &&

                                        <div className='w-10 h-10 bg-white fixed top-[20%] shadow flex justify-center items-center rounded-full right-4'
                                            onClick={() => setShowTableOfContents(!showTableOfContents)}
                                        >
                                            <IoClose size={20} />
                                        </div>
                                    }

                                    {showTableOfContents &&
                                        <div>
                                            {contents.map((content) => {
                                                return (
                                                    <div key={Math.random()} className='py-2 divide-y-2'>{content.title}</div>
                                                )
                                            })}
                                        </div>
                                    }
                                </div> */}

                                <div className='lg:h-20 w-full toc-gradient px-4 flex items-center justify-between fixed md:static bg-[#FAF7ED] h-[10%] border-b  -translate-x-6 lg:-translate-x-0 -translate-y-6 lg:-translate-y-0'>
                                    <BackChevronButton />


                                    <span onClick={() => setShowSidebar(!showSidebar)} className='flex items-center'>
                                        <Menu />
                                    </span>


                                </div>

                                <main className='w-[90%] mx-auto md:mt-6 lg:col-span-3 order-2 transition-opacity mt-20'>

                                    <div dangerouslySetInnerHTML={{ __html: generateBody(Array.from(contents)) }} className=''></div>

                                    {quizzes &&

                                        <div className='my-8'>
                                            {generateQuiz(Array.from(contents)) &&
                                                <div>
                                                    <h2 className='lg:text-3xl font-semibold text-2xl mb-6'>Knowledge Check</h2>
                                                    <div>{generateQuiz(Array.from(contents))}</div>

                                                    {isQuizSubmitted ?
                                                        <button onClick={() => {
                                                            setActiveOptions([])
                                                            setIsQuizSubmitted(false)
                                                        }} className='w-fit mb-8 bg-white border rounded py-2 px-6 text-center '>
                                                            Retry Quiz
                                                        </button>
                                                        :
                                                        <button onClick={handleQuiz} className='w-fit mb-8 bg-white border rounded py-2 px-6 text-center '>
                                                            Submit Answers
                                                        </button>}
                                                </div>
                                            }







                                        </div>

                                    }



                                    <div className='w-full mt-10 flex ml-auto space-x-4'>
                                        {count > 0 &&
                                            <button onClick={previousContent} className='w-full mb-8 bg-[#F08354]/20 text-[#F08354]  rounded py-2 px-10 text-center '>
                                                {"Previous"}
                                            </button>
                                        }
                                        <button onClick={nextContent} className='w-full mb-8 px-10 bg-[#F08354] text-white rounded py-2  text-center '>
                                            {count === contents.length ? "Complete this lesson" : "Next"}
                                        </button>
                                    </div>
                                </main>
                            </div>



                            <div className='col-span-1 border p-4 block'>
                                {/* ADS */}

                            </div>


                            {courseIsComplete &&
                                <ReactPortal>
                                    <Modal>
                                        <div className='space-y-4 text-center'>
                                            <Image src={teamSuccessPNG} alt='' />
                                            <span className='w-10'>Congratulations</span>

                                            {assessment?.data.length < 1 ?
                                                <p className='text-[#8C95A4]'>You have completed all lessons in this course</p> :
                                                <p className='text-[#8C95A4]'>You have completed all lessons in this course. Head over to the final Assessment to solidify your knowledge</p>
                                            }

                                            {
                                                assessment?.data.length < 1 ?
                                                    <div className='flex gap-2'>
                                                        <button
                                                            className='border py-2 hover:opacity-50 bg-[#F08354]/20 text-[#F08354] w-full whitespace-nowrap rounded px-4 gap-2'
                                                            onClick={() => setCourseIsComplete(false)}
                                                        > Close </button>
                                                        <button className='border py-2 w-full hover:opacity-50 text-white rounded px-4 bg-[#F08354]'

                                                            onClick={() => router.push(`/courses`)}

                                                        >Explore Courses</button>
                                                    </div>
                                                    : <div className='flex gap-2'>
                                                        <button
                                                            className='border py-2 hover:opacity-50 bg-[#F08354]/20 text-[#F08354] w-full whitespace-nowrap rounded px-4'
                                                            onClick={async () => {
                                                                await createCertificate()
                                                                router.push(`/assessment/${assessment?.data[0].id}`)
                                                            }}
                                                        >Take Assessment</button>
                                                        <button className='border py-2 w-full hover:opacity-50 text-white rounded px-4 bg-[#F08354]' onClick={() => setCourseIsComplete(false)}>Close</button>
                                                    </div>
                                            }


                                        </div>
                                    </Modal>

                                </ReactPortal>}
                        </div>
                    </div> :
                <Restricted path={router.asPath} />}

        </div>
    )
}

export default SingleCourse

// This gets called on every request
export async function getServerSideProps(context) {

    // Extract the query parameter
    const courseIDSplit = context.req.url?.split('/') as string[];

    // const courseId = courseIDSplit[courseIDSplit?.length - 1].split('.')
    const courseId = courseIDSplit[courseIDSplit?.length - 1].split('.')[0]

    // Fetch data from external API
    const apiResponse = await fetchCourseById(courseId)

    const data = apiResponse?.data

    const courseLessons = new Set();

    data.sections.map((section: any) => {
        section?.sub_sections?.map((ss: any) => {
            courseLessons.add(ss);
        })
    });

    const encryptedTkn = getCookie('tkn', { req: context.req, res: context.res }) as string
    const session: any = await getServerSession(context.req, context.res, authOptions)

    // console.log({ session });


    var userId;

    // console.log({ encryptedTkn });

    if (encryptedTkn) {
        const cookie = decryptData(encryptedTkn)
        userId = cookie.user?.id
    } else {
        userId = session?.user?.id
    }




    // const enrollmentResponse = await http.get(`get-enrollment?course=${courseId}&user=${userId}`)
    // const enrollment = enrollmentResponse

    // get-enrollment?course=${course}&user=${user}

    // // Fetch data from external API
    const enrollmentApiResponse = await fetchCourseEnrollment(courseId, userId)
    const subscriber = enrollmentApiResponse?.data


    // console.log({ subscriber });



    // Pass data to the page via props
    return {
        props: {
            course: data || {},
            lessons: Array.from(courseLessons) || [],
            subscriber: JSON.stringify(subscriber) || null,

        }
    }
}


