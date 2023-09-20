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

function CoursesTable({ data }: any) {


    const router = useRouter();
    // const auth = useAuth();
    const cookie = useCookie()
    const role = useRole()
    // const authState = useSelector((state: RootState) => state.auth)
    const [seachQry, setSearchQry] = useState("");
    const [filteredData, setFilteredData] = useState(data.data);
    const [currentItem, setCurrentItem] = useState("");
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

    const { "0": deleteCourse, "1": deleteCourseStatus } = useDeleteCourseMutation();
    const { "0": deleteCourseDraft, "1": deleteCourseDraftStatus } = useDeleteCourseDraftMutation();



    const handleSearchQryChange = (e: any) => {
        const value = e.target.value;
        setSearchQry(value)

        const filteredList = data.data.filter((d: any) => {
            return d?.title.toLowerCase().includes(value.toLowerCase());
        });

        setFilteredData(filteredList);
    };

    const deleteItem = () => {


        deleteCourse({ token: cookie?.user?.email, id: currentItem }).then((res: any) => {

            notify({ msg: 'Course deleted!', type: 'success' })
        }).catch((err: any) => {

            notify({ msg: 'Oops! an error occured', type: 'error' })
        }).finally(() => {
            setTimeout(() => {
                setDeleteModalIsOpen(false);
                window.location.reload()
            }, 1050);
        })





    }



    return (
        <section className="">
            <ToastContainer />
            <div className=" w-full">
                <div className=" bg-white border relative rounded overflow-hidden">
                    <div className="flex md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
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
                                        className="border  rounded focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 bg-white placeholder-gray-400 text-black focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Search"
                                        required={true}
                                        value={seachQry}
                                        onChange={handleSearchQryChange}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="w-fit md:w-auto flex flex-col md:flex-row md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                            <button
                                type="button"
                                className="flex items-center justify-center hover:opacity-80 bg-[#11393C] text-white  focus:ring-4 focus:ring-primary-300 font-medium rounded  px-4 py-2 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-primary-800 ml-3"
                                onClick={() => router.push("/admin/courses/create")}
                            >
                                <TbPlus />
                                New Course
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto scrollbar-none">
                        <table className="w-full  text-left text-gray-500">
                            <thead className="text-sm text-gray-400 bg-gray-700/10">
                                <tr>
                                    <th scope="col" className="px-4 py-3">
                                        Author
                                    </th>
                                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                                        Course Title
                                    </th>
                                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                                        Status
                                    </th>
                                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                                        Date created
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        <span className="">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((course: any) => (
                                    <tr
                                        className="border-b border cursor-pointer hover:bg-gray-100/10"
                                        key={Math.random() * 100}
                                    >
                                        <td className="px-4 py-3 font-medium whitespace-nowrap text-black">
                                            <div className="flex items-center gap-3">
                                                <p>{course.author}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium truncate block w-[400px] text-black">
                                            <p className="truncate w-[90%]">{course.title}</p>
                                        </td>

                                        <td className={`px-4 py-3 text-black whitespace-nowrap`}>
                                            <span className={`w-fit px-4 rounded-full py-1 ${course.status === 'active' ? 'bg-green-100 text-green-400' : 'bg-red-100 text-orange-400'}`}>
                                                {course.status === 'active' ? 'Published' : 'Draft'}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-black whitespace-nowrap">
                                            {new Date(course.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="flex items-center gap-2">
                                            <button
                                                className="flex items-center gap-2 px-3 py-1 bg-gray-500 hover:opacity-90 rounded whitespace-nowrap  text-white"
                                                onClick={() => {
                                                    router.push({ pathname: `/admin/quiz/create/${course?.id}` }, `/admin/quiz/create/${course?.id}`)
                                                }}
                                            >

                                                <span>Quiz </span>
                                            </button>
                                            <button
                                                className="flex items-center gap-2 px-3 py-1 bg-gray-500 hover:opacity-90 rounded whitespace-nowrap  text-white"
                                                onClick={() => {
                                                    router.push({ pathname: `/admin/assessment/create/${course.id}` }, `/admin/assessment/create/${course?.id}`)
                                                }}
                                            >

                                                <span>Assessment</span>
                                            </button>
                                            <button
                                                className="flex items-center gap-2 px-3 py-1 bg-red-500 hover:bg-red-600 rounded whitespace-nowrap  text-white"
                                                onClick={() => {
                                                    setCurrentItem(course.id);
                                                    setDeleteModalIsOpen(true);
                                                }}
                                            >

                                                <span>Delete </span>
                                            </button>
                                            <button
                                                className="flex items-center gap-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded whitespace-nowrap  text-white"
                                                onClick={() => {
                                                    router.push({ pathname: `/admin/courses/edit/${course?.id}` }, `/admin/courses/edit/${course?.id}?${role}=true`)
                                                }}
                                            >

                                                <span>Edit</span>
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
                                    {deleteCourseStatus.isLoading && <Spinner />} Delete
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
        </section>
    );
}

export default CoursesTable;
