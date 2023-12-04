import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { TbBook, TbCheck } from "react-icons/tb";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchCourseEnrollment, getPriceBasedOnLocation } from "@/helper";
import { IoCart } from "react-icons/io5";
import { NextApiRequest, NextApiResponse } from "next";
import useCookie from "@/hooks/useCookie";
import { useFetchCourseEnrollmentQuery } from "@/features/apiSlice";
import { FiCheckCircle } from "react-icons/fi";

// { title, duration }: { title: string; duration: string }

function Card({ data }: any) {
  const router = useRouter();
  const geo = useSelector((state: RootState) => state.geo)
  const cookie = useCookie();

  const courseId = data?.id
  const userId = cookie?.user?.id

  const { data: subscriber, isLoading } = useFetchCourseEnrollmentQuery({ course: courseId, user: userId })


  const isCompleteted = subscriber?.data?.progress === "100";

  return (
    <div className=" w-[100%] h-[400px]">
      <div className={`flex flex-col h-full bg-white border rounded overflow-hidden
        ${isCompleteted && 'border border-orange-500 shadow-xl'}
      `}>

        <div className="block focus:outline-none focus-visible:ring-2 relative h-[40%]">
          <figure className="relative h-full overflow-hidden">
            <Image className="absolute inset-0 m-auto h-full w-full transform object-cover hover:scale-105 transition duration-700 ease-out" src={data?.header_image} width="100" height="100" alt="Course" />
          </figure>


          {data?.certificate && <div className="bg-orange-500 text-white rounded-l absolute top-4 right-0 px-4">
            <p>Certificate</p>
          </div>}


        </div>

        <div className="flex-grow flex flex-col p-4">

          <div className="flex-grow">
            <div className="flex justify-between items-center">

            </div>


            <header className="mb-3">

              <div className="flex flex-wrap">
              <div className="text-sm rounded-full bg-orange-400/20 text-orange-400 w-fit mb-3 px-2 py-1">
                  {data?.category}
                </div>

                {isCompleteted &&
                  <div className="text-sm rounded-full bg-green-400/20 text-green-400 w-fit mb-3 px-2 py-1">
                    completed
                  </div>
                }

               
              </div>

              <div className="block focus:outline-none focus-visible:ring-2">
                <p className="text-lg font-semibold leading-snug capitalize line-clamp-2">{data?.title}</p>
              </div>

            </header>



            <div className=" line-clamp-2 my-4">
              <p className="line-clamp-2">{data?.description}</p>
            </div>
          </div>

          {subscriber?.data ? <div>
            <button
              className="py-2 bg-[#F08354] text-white w-full rounded"
              onClick={() => router.push({ pathname: `/courses/${data.title}/${data?.id}` })}
            >
              Continue learning
            </button>
          </div> :
            <div className="w-full">
              <button className="py-2 rounded w-full bg-[#F08354] text-[#fff]" onClick={() => router.push({
                pathname: `/courses/${data.id}/preview`, query: {
                  id: data?.id
                }
              }, `/courses/${data.id}/preview`)}>Start Course</button>
            </div>}



        </div>
      </div>
    </div>
  );
}

export default Card;
