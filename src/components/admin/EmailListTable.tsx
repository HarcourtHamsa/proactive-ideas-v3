import React, { useState } from "react";
import { useRouter } from "next/router";
import { IoAdd, IoWarning } from "react-icons/io5";
import Search from "../SVGs/Search";
import { TbPlus } from "react-icons/tb";
import ReactPortal from "../ReactPortal";
import Modal from "../Modal";
import { AiOutlineClose } from "react-icons/ai";
import Spinner from "../Spinner";
import { useDeleteCategoryMutation, useDeleteCourseDraftMutation, useDeleteCourseMutation } from "@/features/apiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import notify from "../Notification";
import { ToastContainer } from "react-toastify";
import useAuth from "@/hooks/useAuth";
import { Role } from "../../../types/types";
import useRole from "@/hooks/useRole";
import useCookie from "@/hooks/useCookie";

function EmailListTable({ data }: any) {


    const router = useRouter();
    const cookie = useCookie()
    const role = useRole()

    console.log(data);






    return (
        <section className="">
            <ToastContainer />
            <div className=" w-full">
                <div className=" bg-white border relative rounded overflow-hidden">
                    <div className="flex md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                        <div className="md:w-[40%] w-[60%]">

                        </div>
                        <div className="w-fit md:w-auto flex flex-col md:flex-row md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                            <button
                                type="button"
                                className="flex items-center justify-center hover:opacity-80 bg-[#11393C] text-white  focus:ring-4 focus:ring-primary-300 font-medium rounded  px-4 py-2 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-primary-800 ml-3"
                            >
                                <TbPlus />
                                Export as CSV
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto scrollbar-none">
                        <table className="w-full  text-left text-gray-500">
                            <thead className="text-sm text-gray-400 bg-gray-700/10">
                                <tr>
                                    <th scope="col" className="px-4 py-3">
                                        Email
                                    </th>

                                    <th scope="col" className="px-4 py-3">
                                        Date Subscribed
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((subscriber: any) => (
                                    <tr
                                        className="border-b border cursor-pointer hover:bg-gray-100/10"
                                        key={Math.random() * 100}
                                    >
                                        <td className="px-4 py-3 font-medium whitespace-nowrap text-black">
                                            <div className="flex items-center gap-3">
                                                <p>{subscriber?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium whitespace-nowrap text-black">
                                            <div className="flex items-center gap-3">
                                                <p>{new Date(subscriber?.createdAt).toDateString()}</p>
                                            </div>
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


        </section>
    );
}

export default EmailListTable;
