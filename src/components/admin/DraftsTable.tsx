import { ToastContainer } from "react-toastify";
import Spinner from "../Spinner";
import { useRouter } from "next/router";
import { useState } from "react";
import Search from "../SVGs/Search";
import ReactPortal from "../ReactPortal";
import Modal from "../Modal";
import { AiOutlineClose } from "react-icons/ai";
import { IoInformationCircle } from "react-icons/io5";

export function DraftsTable({ data, onPress, isLoading, current, setCurrent, label }: any) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const router = useRouter();

    const handlePress = async () => {
        await onPress(current)
        setModalIsOpen(false);
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
                                        className="border  rounded focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 bg-white placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Search"
                                        required={true}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="overflow-x-auto scrollbar-none">
                        <table className="w-full  text-left text-gray-500">
                            <thead className="text-sm text-gray-400 bg-gray-700/10">
                                <tr>
                                    <th scope="col" className="px-4 py-3">
                                        Author
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Title
                                    </th>
                                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                                        Date created
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        <span className="">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="items-center">
                                {data?.data.map((blog: any) => (
                                    <tr
                                        className="border-b border cursor-pointer hover:bg-gray-100/10"
                                        key={Math.random() * 100}
                                    >
                                        <td className="px-4 py-3 font-medium whitespace-nowrap text-black">
                                            <div className="">
                                                <p>{blog.author}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium truncate block w-[400px] text-black">
                                            <p className="truncate w-[90%]">{blog.title}</p>
                                        </td>
                                        <td className="px-4 py-3 text-black whitespace-nowrap">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-3 relative flex">
                                            <button
                                                className="bg-blue-600 mr-3 px-4 py-1 rounded text-white"
                                                onClick={() => {
                                                    setCurrent(blog)
                                                    router.push({
                                                        pathname: `/admin/${label}/edit/${blog.id}`, query: {
                                                            ...blog
                                                        }
                                                    }, `/admin/${label}/edit/${blog.id}?next=admin`)
                                                }}>Edit</button>
                                            <button className="bg-orange-400 px-4 py-1 rounded text-white" onClick={() => {
                                                setCurrent(blog)
                                                setModalIsOpen(true)
                                            }}>Publish</button>
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
                            <span className="font-semibold text-black">{data?.data.length}</span>
                        </span>
                    </nav>
                </div>
            </div>
            {modalIsOpen &&
                <ReactPortal>
                    <Modal>
                        <div className="flex justify-between">
                            <h3 className="text-lg"> Notification</h3>

                            <AiOutlineClose
                                size={15}
                                className="cursor-pointer"
                                onClick={() => {
                                    setModalIsOpen(false);
                                }} />

                        </div>

                        <IoInformationCircle size={55} className="mx-auto text-black" />

                        <div className="text-center mt-3 mb-6">
                            <p>Are you sure you want to publish this item ? You cannot reverse this action.</p>


                            <div className="mx-auto space-x-4 flex mt-6">

                                <button
                                    className="px-4 py-2 w-full border rounded mt-4"
                                    onClick={() => {
                                        setModalIsOpen(false);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="px-4 py-2 mr-4 w-full flex justify-center  rounded mt-4 bg-white text-black border"
                                    onClick={handlePress}
                                >
                                    {isLoading && <Spinner />} Go Live
                                </button>
                            </div>
                        </div>
                    </Modal>
                </ReactPortal>
            }
        </section>
    )
}