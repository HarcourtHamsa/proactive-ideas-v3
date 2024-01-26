import Modal from '@/components/Modal';
import notify from '@/components/Notification';
import ReactPortal from '@/components/ReactPortal';
import Search from '@/components/SVGs/Search';
import Spinner from '@/components/Spinner';
import Layout from '@/components/admin/Layout'
import { deleteInsight, getInsights } from '@/helper';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai';
import { IoAdd, IoWarning } from 'react-icons/io5'
import { TbPlus } from 'react-icons/tb';
import { ToastContainer } from 'react-toastify';

function Insight() {
    const router = useRouter();
    const [insights, setInsights] = useState<any>([]);
    const [current, setCurrent] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [showDeleteLoader, setShowDeleteLoader] = useState(false);

    useEffect(() => {
        async function fetchData() {
            await getInsights().then((res) => {
                setInsights(res.data);
            }).finally(() => {
                setIsLoading(false)
            })
        }

        fetchData()
    }, [])

    const deleteItem = async () => {
        setShowDeleteLoader(true)


        await deleteInsight(current.id)
            .then((res) => {
                notify({ msg: "Insight deleted", type: "success" });

                window.location.reload()
            }).finally(() => {
                setShowDeleteLoader(false)
                setDeleteModalIsOpen(false);
            })
    }

    return (
        <Layout>
            {isLoading ?
                <div className='flex-1 h-screen flex items-center justify-center'>
                    <div className='text-center'>
                        <p className='text-2xl mb-1'>No Insights</p>
                        <p className='text-gray-400'>Click on the button below to create insight</p>
                        <button
                            className='flex items-center gap-2 text-white 
                     px-4 py-2 mt-6 mx-auto
                     bg-orange-400 rounded hover:opacity-75'
                            onClick={() => router.push('/admin/insight/create')}
                        >
                            Create Insight
                        </button>
                    </div>
                </div>
                :
                <div className="p-4 mt-8">
                    <h2 className="text-3xl text-black font-bold mb-2">Insights</h2>
                    <div className=' bg-white'>
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
                                                        className="border  rounded focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 px-2 py-2 bg-white placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
                                                        placeholder="Search"
                                                        required={true}
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                        <div className="w-fit md:w-auto flex flex-col md:flex-row  md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                                            <button
                                                type="button"
                                                className="flex items-center justify-center hover:opacity-80 bg-[#11393C] text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded ml-3 px-4 py-2 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-primary-800"
                                                onClick={() => router.push("/admin/insight/create")}
                                            >
                                                <TbPlus />
                                                Create Insight
                                            </button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto scrollbar-none">
                                        <table className="w-full  text-left text-gray-500">
                                            <thead className="text-sm text-gray-400 bg-gray-700/10">
                                                <tr>
                                                    <th scope="col" className="px-4 py-3">
                                                        Course
                                                    </th>
                                                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                                                        Date created
                                                    </th>
                                                    <th scope="col" className="px-4 py-3 whitespace-nowrap">
                                                        Date Updated
                                                    </th>
                                                    <th scope="col" className="px-4 py-3">
                                                        <span className="">Actions</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="items-center">
                                                {insights.map((insight: any) => (
                                                    <tr
                                                        className="border-b border hover:bg-gray-100/10"
                                                        key={Math.random() * 100}
                                                    >

                                                        <td className="px-4 py-3 font-medium truncate block w-[400px] text-black">
                                                            <p className="truncate w-[90%]">{insight.course.title}</p>
                                                        </td>

                                                        <td className="px-4 py-3 text-black whitespace-nowrap">
                                                            {new Date(insight.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 py-3 text-black whitespace-nowrap">
                                                            {new Date(insight.updatedAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-8 py-3 relative flex">
                                                            <button
                                                                className="bg-blue-600 mr-3 px-4 py-1 rounded text-white"
                                                                onClick={() => {
                                                                    setCurrent(insight)


                                                                    router.push({
                                                                        pathname: `/admin/insight/edit`, query: {
                                                                            insight: JSON.stringify(insight)
                                                                        }
                                                                    }, `/admin/insight/edit/`)
                                                                }}>Edit</button>

                                                            <button className="bg-red-500 px-4 py-1 rounded text-white" onClick={() => {
                                                                setCurrent(insight)
                                                                setDeleteModalIsOpen(true)
                                                            }}>Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>

                            {/* {showEditModal &&

                                <ReactPortal>
                                    <Modal>
                                        <DefaultModalCard
                                            label="Are you sure you want to toggle this items's status?"
                                            isLoading={isLoading}
                                            onCancel={() => {
                                                setShowEditModal(false)
                                                setCurrent(null)
                                            }}
                                            onConfirm={() => toggleStatus()}
                                        />
                                    </Modal>
                                </ReactPortal>
                            } */}


                            {deleteModalIsOpen &&
                                <ReactPortal>
                                    <Modal>
                                        <div className="flex justify-between">
                                            <p className=""> Notification</p>

                                            <AiOutlineClose
                                                size={15}
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    setDeleteModalIsOpen(false);
                                                }} />

                                        </div>

                                        <IoWarning size={55} className="mx-auto text-black" />

                                        <div className="text-center mt-3 mb-6">
                                            <p className=''>Are you sure you want to delete this insight ? You cannot reverse this action.</p>


                                            <div className="w-full flex mt-6">

                                                <button
                                                    className="px-4 py-2 mr-4 bg-gray-300 w-full rounded mt-4"
                                                    onClick={() => {
                                                        setDeleteModalIsOpen(false);
                                                    }}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    className="px-4 py-2  flex justify-center w-full rounded mt-4 text-white bg-orange-400"
                                                    onClick={deleteItem}
                                                >
                                                    {showDeleteLoader && <Spinner />} Delete
                                                </button>
                                            </div>
                                        </div>
                                    </Modal>
                                </ReactPortal>
                            }
                        </section>
                    </div>
                </div>

            }


        </Layout>
    )
}

export default Insight