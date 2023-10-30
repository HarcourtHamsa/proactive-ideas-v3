import React, { useEffect, useState } from "react";
import Image from 'next/image'
import { getCookie } from 'cookies-next';
import { useRouter, withRouter } from 'next/router'
import { Disclosure } from "@headlessui/react";
import Navbar from "../../../components/Navbar";
import {

    AiOutlineCaretDown,
    AiOutlineCaretUp,
} from "react-icons/ai";
import Footer from "../../../components/Footer";
import headerImage from "../../../assets/course-details-header.jpg"
import { IoBook, IoBookOutline, IoLockClosed, IoVideocam } from "react-icons/io5";
import { TbCertificate, TbFileCertificate, TbFiles, TbLanguage, TbLock, TbLockOpen, TbStack, TbStack2 } from "react-icons/tb";
import PaymentButton from "@/components/PaymentButton";
import { useSession } from "next-auth/react";
import { useEnrollToCourseMutation, useFetchCourseEnrollmentQuery, useFetchCoursePaymentListQuery, useFetchSingleCourseQuery } from "@/features/apiSlice";
import Loader from "@/components/Loader";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { BsFile, BsFiletypeSvg } from "react-icons/bs";
import ContentsSVG from "@/components/SVGs/Contents";
import { decryptData, fetchCourseById, fetchCourseEnrollment, getPriceBasedOnLocation } from "@/helper";
import certificate from "../../../assets/sample-certificate.jpg"
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import CustomPaystackButton from "@/components/CustomPaystackButton";
import useCookie from "@/hooks/useCookie";
import http from "@/lib/http";
import notify from "@/components/Notification";
import { ToastContainer } from "react-toastify";
import Spinner from "@/components/Spinner";


interface ITransaction {
    amount: number
    transaction_id: number
    user: string
    is_paid_course: boolean
    currency: String
    course: string
}

function Preview({ subscriber }: any) {
    var router = useRouter();
    const cookie = useCookie()
    const { "0": enroll, "1": enrollStatus } = useEnrollToCourseMutation();


    const handleCreateTx = async (body: ITransaction) => {
        enroll({ body }).then((res) => {

        }).catch(err => {
            throw err;
        });
    }

    const handleStartLearning = async () => {
        if (cookie?.user) {

            await handleCreateTx({
                amount: 0,
                transaction_id: 0,
                user: cookie?.user.id,
                is_paid_course: true,
                currency: '',
                course: course.data?.id
            })

            router.push({ pathname: `/courses/${course.data.title}/${course.data?.id}` })
        } else {
            router.push(`/auth/login/?next=${router.asPath}`)
        }
    }




const geo = useSelector((state: RootState) => state.geo)
var id = router.asPath.split("/")[2];
const { data: course, isLoading } = useFetchSingleCourseQuery({ id: id })

const { data: enrollment, isLoading: isFetchingEnrollment } = useFetchCourseEnrollmentQuery({ course: course?.data?.id, user: cookie?.user.id })
const parsedSubsriber = subscriber ? JSON.parse(subscriber) : null


function calculateNumberOfLessons(sections: any) {
    var count = 0;

    sections?.map((section: any) => {
        count += section?.sub_sections.length;
    })

    return count
}

if (isFetchingEnrollment) {
    return <Loader />
}


return (
    <div className=" min-h-screen h-fit">
        <Navbar />
        <ToastContainer />

        <div className="bg-[#FAF7ED] pb-20 pt-28">
            <div className="container w-[90%] mx-auto gap-4 grid grid-cols-1 lg:grid-cols-3">
                <div className="h-fit col-span-2 order-1 lg:order-1">
                    <div className="border bg-white rounded-md overflow-hidden">
                        {/* header image */}
                        <div className="h-full overflow-hidden">
                            <div className="flex lg:h-[400px] h-[200px] flex-col bg-white rounded-t-md overflow-hidden">

                                <a className="block focus:outline-none h-full focus-visible:ring-2 relative">
                                    <figure className="relative h-full overflow-hidden">
                                        <Image className=" w-full h-full object-center" src={course?.data?.header_image} width="100" height="450" alt="Course" priority={true} />
                                    </figure>

                                    {course?.data?.certificate && <div className="bg-orange-500/50 rounded-l absolute top-4 right-0 px-4 py-1">
                                        <p className="text-white">Certificate</p>
                                    </div>}


                                </a>


                            </div>

                        </div>
                        <div className="p-4 bg-white">
                            {/* code goes here */}
                            <div className="flex gap-2">
                                <p>{course?.data?.author}</p>
                                <p>/</p>
                                <p className="text-[#F08354] ">{new Date(course?.data?.createdAt).toDateString()}</p>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold">{course?.data?.title}</h2>
                            <hr className="my-4" />
                            <p>
                                {course?.data?.summary}
                            </p>
                        </div>


                        <div className="p-4">
                            <h1 className="mb-4 text-2xl font-bold text-gray-900 leading-snug lg:font-extrabold lg:text-3xl lg:leading-none">Learning Objectives</h1>
                            <main className="custom__list" dangerouslySetInnerHTML={{ __html: course?.data?.objectives }}></main>
                        </div>
                    </div>


                    <div className="mt-8 border p-4 rounded-md bg-white">
                        <div className="mb-6">
                            <h1 className="mb-4 text-2xl font-bold text-gray-900 leading-snug lg:font-extrabold lg:text-3xl lg:leading-none">Course Outline</h1>
                        </div>
                        <div className="h-fit w-full">

                            <div className=" h-full ">
                                <div className="col-span-3 md:col-span-2 h-full">
                                    <Disclosure defaultOpen={true}>
                                        {({ open }) => (
                                            <>
                                                <Disclosure.Button className="py-2 flex justify-between items-center bg-[#F08354] w-full text-left px-2 rounded text-white text-bold">
                                                    Lessons In This Course
                                                    {open ? (
                                                        <AiOutlineCaretDown className="duration-300 ease-in-out" />
                                                    ) : (
                                                        <AiOutlineCaretUp />
                                                    )}
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="">
                                                    <div>
                                                        {course?.data?.sections.map((item: any, index: number) => (
                                                            <div
                                                                key={Math.random()}
                                                                className="px-4 py-2 hover:bg-zinc-100/10 rounded duration-200 cursor-pointer"
                                                            >

                                                                <p className="text-lg flex items-center gap-1 text-black">
                                                                    <span className="flex justify-center items-center rounded-full">
                                                                        Section {index + 1}:
                                                                    </span>

                                                                    {item.title}</p>

                                                                <div className="w-full my-2 ml-4">
                                                                    {item.sub_sections.map((s: any, i: number) => (
                                                                        <span key={Math.random()} className="py-3 px-2 whitespace-nowrap overflow-hidden text-ellipsis flex gap-2 items-center hover:bg-gray-500/10 rounded" onClick={() => router.push({ pathname: `/courses/${course?.data.title}/${course?.data.id}` })}>
                                                                            {/* {index === 0 ? i <= 1 ? <TbLockOpen size={20} /> : <TbLock size={20} /> : <TbLock size={20} />} */}
                                                                            {s.title}
                                                                            {/* {index} */}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                </div>


                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-fit  w-[100%] ml-auto order-1 lg:order-2">
                    <div className="w-[100%]">
                        <div className="flex flex-col h-full bg-[#fff] border rounded-md overflow-hidden">
                            <div className="flex-grow flex flex-col px-4 py-4">


                                {/* <h2 className="text-4xl text-center text-[#11393C] font-semibold mb-4">
                                        {
                                            getPriceBasedOnLocation({
                                                country: geo.country,
                                                prices: course?.data?.prices
                                            })[2]
                                        }
                                        {

                                            getPriceBasedOnLocation({
                                                country: geo.country,
                                                prices: course?.data?.prices
                                            })[0]
                                        }
                                    </h2> */}



                                <ul className="ul__unset">
                                    <li className="justify-between flex py-2">
                                        <span className="flex gap-2">
                                            <TbFiles size={25} />
                                            Lessons</span>
                                        <span>{calculateNumberOfLessons(course?.data?.sections)}</span>
                                    </li>
                                    <li className="justify-between border-t flex py-2">
                                        <span className="flex gap-2">
                                            <TbFileCertificate size={25} />
                                            Certificate</span>
                                        <span>{course?.data?.certificate ? "Yes" : "No"}</span>
                                    </li>
                                    <li className="justify-between border-t flex py-2">
                                        <span className="flex gap-2">
                                            <TbLanguage size={25} />
                                            Language</span>
                                        <span>English</span>
                                    </li>
                                </ul>


                                <div className="flex-grow flex items-center mt-4">
                                    {
                                        !(parsedSubsriber) && <button
                                            className="py-3 mb-2 flex justify-center items-center gap-2 bg-[#F08354] text-white w-full rounded"
                                            onClick={handleStartLearning}
                                        >
                                            {enrollStatus.isLoading && <Spinner />}
                                            Start Learning
                                        </button>
                                    }



                                    {/* if user is not logged in */}
                                    {/* {!(cookie?.user) &&
                                            <button className="py-3 mb-2 bg-[#F08354] text-white uppercase text-sm w-full rounded-md" onClick={() => {
                                                router.push(`/ auth / login /? next = ${ router.asPath }`)

                                            }}>
                                                Buy this Course
                                            </button>
                                        } */}




                                    {/* {isSubscribedToCourse(paymentList?.data[0])} */}


                                    {
                                        cookie?.user ?
                                            parsedSubsriber ?
                                                <button
                                                    className="py-3 mb-2 bg-[#F08354] text-white w-full rounded"
                                                    onClick={() => {

                                                        router.push({ pathname: `/courses/${course.data.title}/${course.data?.id}` })
                                                    }
                                                    }
                                                >
                                                    Continue learning
                                                </button> :
                                                <div className="">

                                                    {/* <div className="flex items-center gap-3 my-6">
                                                            <hr className=" w-[100%]" />
                                                            <p className="text-center text-sm whitespace-nowrap tracking-wider text-gray-800">PAYMENT METHODS</p>
                                                            <hr className=" w-[100%]" />
                                                        </div> */}
                                                    {/* <PaymentButton
                                                            amount={
                                                                getPriceBasedOnLocation({
                                                                    country: geo.country,
                                                                    prices: course?.data?.prices
                                                                })[0]
                                                            }
                                                            courseId={course?.data?.id}
                                                            currency={getPriceBasedOnLocation({
                                                                country: geo.country,
                                                                prices: course?.data?.prices
                                                            })[1]}
                                                        /> */}
                                                    {/* <CustomPaystackButton
                                                            amount={
                                                                getPriceBasedOnLocation({
                                                                    country: geo.country,
                                                                    prices: course?.data?.prices
                                                                })[0]
                                                            }
                                                            courseId={course?.data?.id}
                                                            currency={getPriceBasedOnLocation({
                                                                country: geo.country,
                                                                prices: course?.data?.prices
                                                            })[1]}
                                                        /> */}

                                                </div> : null}




                                </div>

                            </div>

                        </div>

                        {course?.data?.certificate &&
                            <div className="lg:h-[300px] h-[250px] mt-4 shadow p-4 rounded w-full bg-white">
                                <Image src={certificate} alt="" className="w-full h-full" />
                            </div>
                        }
                    </div>
                </div>
            </div>

        </div>



        <Footer />
    </div>
);
}

export default Preview;

// This gets called on every request
export const getServerSideProps = async ({ req, res }: { req: NextApiRequest, res: NextApiResponse }) => {

    const splitCount = req?.url?.split('/') as string[];
    const courseId = splitCount[splitCount.length - 2]
    var cookie;
    var userId;

    console.log({ courseId });
    console.log({ splitCount })


    const encryptedTkn = getCookie('tkn', { req, res }) as string

    if (encryptedTkn) {
        cookie = decryptData(encryptedTkn)
        userId = cookie?.user.id
    }

    // // Fetch data from external API
    const apiResponse = await fetchCourseEnrollment(courseId, userId)
    const data = apiResponse?.data



    // Pass data to the page via props
    return {
        props: {
            subscriber: JSON.stringify(data) || null,
        }
    }
}


