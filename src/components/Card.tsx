import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { TbBook } from "react-icons/tb";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchCourseEnrollment, getPriceBasedOnLocation } from "@/helper";
import { IoCart } from "react-icons/io5";
import { NextApiRequest, NextApiResponse } from "next";
import useCookie from "@/hooks/useCookie";
import { useFetchCourseEnrollmentQuery } from "@/features/apiSlice";

// { title, duration }: { title: string; duration: string }

function Card({ data }: any) {
  const router = useRouter();
  const geo = useSelector((state: RootState) => state.geo)
  const cookie = useCookie();

  const courseId = data?.id
  const userId = cookie?.user.id

  const { data: subscriber, isLoading } = useFetchCourseEnrollmentQuery({ course: courseId, user: userId })



  return (
    <div className=" w-[100%] h-[450px] cursor-pointer">
      <div className="flex flex-col h-full bg-white border rounded overflow-hidden">

        <a className="block focus:outline-none focus-visible:ring-2 relative h-[50%]">
          <figure className="relative h-full overflow-hidden">
            <Image className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition duration-700 ease-out" src={data?.header_image} width="320" height="180" alt="Course" />
          </figure>

          {data?.certificate.isProvided && <div className="bg-orange-500/40 text-white rounded-l absolute top-4 right-0 px-4 py-1">
            <p>Certificate</p>
          </div>}


        </a>

        <div className="flex-grow flex flex-col p-4">

          <div className="flex-grow">
            <div className="flex justify-between items-center">

            </div>


            <header className="mb-3">
              <a className="block focus:outline-none focus-visible:ring-2">
                <p className="text-lg font-semibold leading-snug capitalize line-clamp-2">{data?.title}</p>
              </a>

            </header>

            <div className=" line-clamp-2 my-4">
              <p className="line-clamp-2">{data?.description}</p>
            </div>
          </div>

          {subscriber?.data ? <div>
            <button
              className="py-3 mb-2 bg-[#F08354] text-white w-full rounded"
              onClick={() => router.push({ pathname: `/courses/${data.title}/${data?.id}` })}
            >
              Continue learning
            </button>
          </div> :
            <div className="w-full flex-grow">
              <button className="py-2 rounded mb-4 mt-2 w-full bg-orange-500/20 text-[#F08354]" onClick={() => router.push({
                pathname: `/courses/${data.id}/preview`, query: {
                  id: data?.id
                }
              }, `/courses/${data.id}/preview`)}>Preview Course</button>


              <button className="bg-[#F08354] shadow w-full flex items-center gap-1 justify-center text-white px-4 rounded py-2" onClick={() => router.push({
                pathname: `/courses/${data.id}/preview`, query: {
                  id: data?.id
                }
              }, `/courses/${data.id}/preview`)}>
                <IoCart size={20} />
                Buy
                <span>
                  {" "}
                  {
                    getPriceBasedOnLocation({
                      country: geo.country,
                      prices: data.prices
                    })[2]
                  }
                  {

                    getPriceBasedOnLocation({
                      country: geo.country,
                      prices: data.prices
                    })[0]
                  }
                </span>

              </button>
            </div>}



        </div>
      </div>
    </div>
  );
}

export default Card;
