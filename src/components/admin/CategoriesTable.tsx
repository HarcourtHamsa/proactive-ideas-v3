import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IoCreateOutline, IoTrash, IoWarning } from "react-icons/io5";
import { ToastContainer } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import Modal from "../Modal";
import notify from "../Notification";
import ReactPortal from "../ReactPortal";
import Spinner from "../Spinner";

import deleteSVG from "../../assets/delete.svg";
import Image from "next/image";
import { useCreateCategoryMutation, useDeleteCategoryMutation } from "@/features/apiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Search from "../SVGs/Search";
import { TbPlus } from "react-icons/tb";
import DeleteModalCard from "./DeleteModalCard";
import useCookie from "@/hooks/useCookie";

function Table({ categories }: { categories: string[] }) {
  const [seachQry, setSearchQry] = useState("");
  const [data, setData] = useState(categories);
  const [currentFilter, setCurrentFilter] = useState("")
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryGroup, setCategoryGroup] = useState("Blog");
  const [showCategoryLoader, setShowCategoryLoader] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [showDeleteLoader, setShowDeleteLoader] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>({});
  const { "0": createCategory } = useCreateCategoryMutation()
  const { "0": deleteCategory } = useDeleteCategoryMutation()
  const cookie = useCookie()


  const handleSearchQryChange = (e: any) => {
    const value = e.target.value;
    setSearchQry(value)

    const filteredList = categories.filter((d: any) => {
      return d?.name.toLowerCase().includes(value.toLowerCase());
    });

    setData(filteredList);
  };

  const filterWithBtn = () => {
    const filteredList = categories.filter((d: any) => {
      return d?.group === currentFilter;
    });

    setData(filteredList);
  }

  const handleCategoryChange = (e: any) => {
    setCategoryName(e.target.value);
  };

  async function createNewCategory() {
    setShowCategoryLoader(true);

    console.log("GROUP", categoryGroup);


    await createCategory({
      token: cookie?.user.accessToken,
      name: categoryName,
      group: categoryGroup
    })
      .then((res: any) => {
        console.log(res);
        notify({ msg: "New Category Created", type: "success" });

        setTimeout(() => {
          setCreateModalIsOpen(false);
        }, 1000 * 2);
      })
      .catch((err: any) => {
        console.log(err);
        notify({ msg: "Failed To Create Category", type: "error" });
      })
      .finally(() => {
        setShowCategoryLoader(false);
      });
  }

  const deleteItem = async () => {
    setShowDeleteLoader(true);
    await deleteCategory({
      id: currentCategory?.id,
      token: cookie?.user.accessToken,
    })
      .then((res: any) => {
        console.log(res);
        notify({ msg: "Category Deleted", type: "success" });
        setDeleteModalIsOpen(false);
      })
      .catch((err: any) => {
        console.log(err);
        notify({ msg: "Oops! An Error Occured", type: "error" });
      })
      .finally(() => {
        setShowDeleteLoader(false);
      });
  };

  return (
    <section className="">
      <div className="flex gap-2 items-center w-fit ml-auto">
        {/* <p className="-translate-y-2"> Filter:</p> */}
        <div
          className="w-fit overflow-hidden ml-auto flex bg-white shadow-inner rounded mb-4 border">
          <p
            className="py-2 px-4 cursor-pointer border-r"
            onClick={() => {
              setCurrentFilter("blog")
              filterWithBtn()
            }}
            style={{
              backgroundColor: currentFilter === "blog" ? "rgb(250 247 237)" : ""
            }}
          >Blog</p>
          <p
            className="py-2 px-4 cursor-pointer border-r"
            onClick={() => {
              setCurrentFilter("ideas")
              filterWithBtn()
            }}
            style={{
              backgroundColor: currentFilter === "blog" ? "rgb(250 247 237)" : ""
            }}
          >Ideas</p>
          <p
            className="py-2 px-4 cursor-pointer"
            onClick={() => {
              setCurrentFilter("course")
              filterWithBtn()
            }}
            style={{
              backgroundColor: currentFilter === "course" ? "rgb(250 247 237)" : ""
            }}
          >Course</p>
        </div>
      </div>
      <ToastContainer />
      <div className=" w-full">
        <div className="bg-white relative rounded border overflow-x-scroll">
          <div className="flex md:flex-row items-center justify-between gap-3 md:space-y-0 md:space-x-4 p-4">
            <div className="md:w-[40%]">
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
                    className=" rounded focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 bg-white border placeholder-gray-400 text-black focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Search Categories..."
                    name="searchQry"
                    value={seachQry}
                    onChange={handleSearchQryChange}
                  />
                </div>
              </form>
            </div>
            <div className="w-fit md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <button
                type="button"
                className="flex items-center justify-center bg-[#11393C] hover:opacity-80 text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded  px-4 py-2 bg-primary-600 whitespace-nowrap hover:bg-primary-700 focus:outline-none focus:ring-primary-800"
                onClick={() => setCreateModalIsOpen(true)}
              >
                <TbPlus />
                Create Category
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full  text-left text-gray-500">
              <thead className="text-xs text-gray-400 uppercase bg-gray-800/10">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Group
                  </th>
                  {/*
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th> */}
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((category: any) => (
                  <tr
                    className="border-b border-gray-800/10"
                    key={Math.random() * 100}
                  >
                    <td className="px-4 py-3 font-medium whitespace-nowrap text-black">
                      <p>{category?.name}</p>
                    </td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap text-black">
                      <p>{category?.group}</p>
                    </td>

                    <td className="px-4 py-3 flex justify-end gap-2">
                      <button className="flex items-center gap-2 px-3 py-2 bg-[#404eed] hover:bg-blue-600 rounded whitespace-nowrap  text-white">

                        <span>Edit Category</span>
                      </button>

                      <button
                        className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 rounded whitespace-nowrap  text-white"
                        onClick={() => {
                          setCurrentCategory(category);
                          setDeleteModalIsOpen(true);
                        }}
                      >

                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {createModalIsOpen && (
          <ReactPortal>
            <Modal>
              <div className="flex justify-between">
                <h3 className="text-xl">Create Category</h3>

                <div
                  className="w-6 h-6 border rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    setCreateModalIsOpen(false);
                  }}
                >
                  <AiOutlineClose size={12} />
                </div>
              </div>

              <hr className="mt-2" />

              <div className="my-4">
                <div>
                  <div className="flex flex-col">
                    <label className="mb-2">Name</label>
                    <input
                      type={"text"}
                      placeholder=""
                      className="bg-white rounded border px-4 py-2"
                      name="categoryName"
                      value={categoryName}
                      onChange={handleCategoryChange}
                    />
                  </div>

                  <div className="mt-4">
                    <label htmlFor="countries" className="block mb-2 font-medium text-gray-900 ">Group</label>
                    <select
                      id="countries"
                      className="bg-white border text-gray-900  rounded block w-full p-2.5 py-3" onChange={(e: any) => setCategoryGroup(e.target.value)}
                      value={categoryGroup}>
                      <option value="blog">blog</option>
                      <option value="ideas">ideas</option>
                      <option value="course">course</option>
                    </select>
                  </div>


                  <button
                    className="py-3 px-4 flex justify-center items-center gap-2 w-full rounded  hover:opacity-80 mt-6 border"
                    onClick={createNewCategory}
                  >
                    {showCategoryLoader && <Spinner />}Create new category
                  </button>
                </div>
              </div>
            </Modal>
          </ReactPortal>
        )}

        {deleteModalIsOpen && (
          <ReactPortal>
            <Modal>
              <DeleteModalCard
                isLoading={showCategoryLoader}
                onCancel={() => {
                  setDeleteModalIsOpen(false)
                }}
                onDelete={deleteItem}

              />
            </Modal>
          </ReactPortal>
        )}
      </div>
    </section>
  );
}

export default Table;
