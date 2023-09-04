import { useRouter } from 'next/router'
import React from 'react'
import PaymentButton from '../PaymentButton'
import { GetServerSideProps } from 'next'
import easyPaymentPNG from '@/assets/easy-payment.png'
import Image from 'next/image'
import CustomPaystackButton from '../CustomPaystackButton'
import { IoClose } from 'react-icons/io5'

function PayWall({ amount, courseId, currency }: any) {
    const router = useRouter()

    return (
        <div className='bg-[#FBF7F4] w-screen h-screen flex justify-center items-center'>
            <div className='w-[50px] h-[50px] border rounded-full flex items-center justify-center absolute lg:top-10 top-4 lg:left-10 left-4 cursor-pointer' onClick={() => router.push('/courses')}>
                <IoClose size={30} />
            </div>
            <div className='space-y-4 text-center'>
                <Image src={easyPaymentPNG} alt='' width={300} />
                <h1 className="mb-4  mt-10 font-semibold leading-snug lg:font-extrabold text-2xl lg:leading-none  lg:mb-4">
                    Want to keep reading?</h1>
                <p>Get unlimited access to this course for just <b>{currency} {amount}</b></p>
                <div className="">

                    <div className="flex items-center gap-3 my-6">
                        <hr className=" w-[100%]" />
                        <p className="text-center text-sm whitespace-nowrap tracking-wider text-gray-400">PAYMENT METHODS</p>
                        <hr className=" w-[100%]" />
                    </div>
                    <PaymentButton
                        amount={amount}
                        courseId={courseId}
                        currency={currency}
                    />
                    <CustomPaystackButton
                        amount={amount}
                        courseId={courseId}
                        currency={currency}
                    />

                </div>
            </div>

        </div>
    )
}

export default PayWall

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
    const currentURL = context.req.headers.referer || '';


    // const { query } = context;

    // // Extract the query parameter
    // const queryParam = query.id as string;


    // // Fetch data from external API
    // const res = await fetchCourseById(queryParam)
    // const data = res.data


    // const courseLessons = new Set();

    // data.sections.map((section: any) => {
    //     section?.sub_sections?.map((ss: any) => {
    //         courseLessons.add(ss);
    //     })
    // });


    // Pass data to the page via props
    return {
        props: {
            // course: data,
            // lessons: Array.from(courseLessons)
        }
    }
}
