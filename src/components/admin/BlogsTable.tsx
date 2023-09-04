import React, { useState } from "react";

import { useRouter } from "next/router";

import ReactPortal from "../ReactPortal";
import Modal from "../Modal";

import Spinner from "../Spinner";
import { useDeleteBlogDraftMutation, useDeleteBlogMutation } from "@/features/apiSlice";
import notify from "../Notification";
import { ToastContainer } from "react-toastify";
import Search from "../SVGs/Search";

import { IoWarning } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";

import useRole from "@/hooks/useRole";
import { Role } from "../../../types/types";
import useCookie from "@/hooks/useCookie";
import { TbPlus } from "react-icons/tb";


function Table({ data }: any) {
  const router = useRouter();
  const cookie = useCookie()
  const role = useRole();


  const [current, setCurrent] = useState<any>({});
  const [dModalIsOpen, setDModalIsOpen] = useState(false)
  const [showDeleteLoader, setShowDeleteLoader] = useState(false)

  const { "0": deleteBlog } = useDeleteBlogMutation()

  const deleteItem = async () => {
    setShowDeleteLoader(true);


    await deleteBlog({ id: current?.id, token: cookie?.user.accessToken })
      .then((res: any) => {

        notify({ msg: "Draft deleted", type: "success" });
        setDModalIsOpen(false);
      })
      .catch((err: any) => {

        notify({ msg: "Oops! An Error Occured", type: "error" });
      })
      .finally(() => {
        setShowDeleteLoader(false);

        window.location.reload()
      });



  };

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
                onClick={() => router.push("/admin/blogs/compose")}
              >
                <TbPlus />
                Compose
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
                  <th scope="col" className="px-4 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-4 py-3">
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
              <tbody className="items-center">
                {data?.data.filter((blog: any) => blog.status !== 'deleted').map((blog: any) => (
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
                            pathname: `/admin/blogs/edit/${blog.id}`, query: {
                              ...blog
                            }
                          }, `/admin/blogs/edit/${blog.id}`)
                        }}>Edit</button>
                      <button className="bg-red-500 px-4 py-1 rounded text-white" onClick={() => {
                        setCurrent(blog)
                        setDModalIsOpen(true)
                      }}>Delete</button>
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
      {dModalIsOpen &&
        <ReactPortal>
          <Modal>
            <div className="flex justify-between">
              <h3 className="text-lg"> Notification</h3>

              <AiOutlineClose
                size={15}
                className="cursor-pointer"
                onClick={() => {
                  setDModalIsOpen(false);
                }} />

            </div>

            <IoWarning size={55} className="mx-auto text-black" />

            <div className="text-center mt-3 mb-6">
              <p>Are you sure you want to delete this {role === Role.admin ? "draft" : "blog post"} ? You cannot reverse this action.</p>


              <div className="w-full flex mt-6">
                <button
                  className="px-4 py-2 mr-4 flex justify-center w-full rounded mt-4 bg-white text-black border"
                  onClick={deleteItem}
                >
                  {showDeleteLoader && <Spinner />} Delete
                </button>
                <button
                  className="px-4 py-2 w-full border rounded mt-4"
                  onClick={() => {
                    setDModalIsOpen(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        </ReactPortal>
      }
    </section>
  );
}

export default Table;
