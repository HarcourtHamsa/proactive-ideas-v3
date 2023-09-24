import React, { useState } from "react";
import { IoAlertCircle, IoCreateOutline, IoTrash } from "react-icons/io5";
import Search from "../SVGs/Search";
import { TbPlus } from "react-icons/tb";
import ReactPortal from "../ReactPortal";
import Modal from "../Modal";
import DefaultModalCard from "./DefaultModalCard";
import { useUpdateUserRoleMutation } from "@/features/apiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import notify from "../Notification";
import { ToastContainer } from "react-toastify";
import { Role } from "../../../types/types";
import { AiOutlineClose } from "react-icons/ai";
import useRole from "@/hooks/useRole";
import useCookie from "@/hooks/useCookie";


function Table({ users }: { users: any }) {
  const role = useRole();
  const cookie = useCookie()

  const { "0": updateRole, "1": updateRoleStatus } = useUpdateUserRoleMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");

  const handleUserRole = (e: any, id: any) => {
    setUserRole(e.target.value);

    
    setUserId(id);
    // setIsOpen(true)


    role === Role.superAdmin ? setIsOpen(true) : setIsRestricted(true);
  }

  const handleRoleUpdate = async () => {
    // if (userRole !== Role.superAdmin) {
    //   setIsRestricted(true);
    //   return;
    // }

    await updateRole({
      token: cookie?.user?.accessToken,
      id: userId,
      data: { role: userRole }
    }).then((res: any) => {
      notify({ msg: 'User role updated!', type: 'success' });
    
    }).catch((err: any) => {
      notify({ msg: 'Oops! an error occured', type: 'error' });

    }).finally(() => {
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    })
  }


  return (
    <section className="">
      <div className=" w-full">
        <div className=" bg-white relative rounded border overflow-hidden">
          <div className="flex md:flex-row items-center justify-between space-y-0 md:space-y-0 md:space-x-4 p-4">
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
                    className="border  rounded focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 px-2 py-1 bg-white placeholder-gray-400 text-white focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Search"
                    required={true}
                  />
                </div>
              </form>
            </div>
            <div className="w-fit md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3  flex-shrink-0">
              <button
                type="button"
                className="flex items-center justify-center bg-[#11393C] text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded  px-4 py-1 bg-primary-600 hover:bg-primary-700 ml-3 focus:outline-none focus:ring-primary-800"
              >
                <TbPlus />
                Add User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full  text-left text-gray-500">
              <thead className="text-base text-gray-400 bg-gray-700/10">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>

                </tr>
              </thead>
              <tbody>
                {users?.data.map((user: any) => (
                  <tr
                    className="border-b border-gray-700/10"
                    key={Math.random() * 100}
                  >
                    <td className="px-4 py-3 font-medium whitespace-nowrap text-black">
                      <p>{user.first_name} {user.last_name}</p>
                      <p className="text-gray-400 ">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-black capitalize">

                      <select id="roles" defaultValue={user?.role} className="bg-gray-50 border capitalize w-fit border-gray-300 text-gray-900 rounded focus:ring-blue-500 focus:border-blue-500 block px-2 py-2 cursor-pointer " onChange={(e) => handleUserRole(e, user.id)}>
                        <option
                          className="capitalize"
                          value={Role?.superAdmin}>
                          {Role.superAdmin}
                        </option>
                        <option
                          className="capitalize"
                          value={Role.admin}>
                          {Role.admin}
                        </option>
                        <option
                          className="capitalize"
                          value={Role?.user}>
                          {Role.user}
                        </option>
                      </select>


                    </td>
                    <td className="px-4 py-3 text-black">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        Active
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

        <ToastContainer />

        {isRestricted && <ReactPortal>
          <Modal>
            <>
              <div className="flex justify-between">
                <h3 className="text-xl font-normal"> Notification</h3>

                <div
                  className="w-6 h-6 border whitespace-nowrap rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => setIsRestricted(false)}
                >
                  <AiOutlineClose size={12} />
                </div>
              </div>

              <IoAlertCircle size={45} className="mx-auto" />

              <div className=" text-center mt-3">
                <h2>Operation not authorized</h2>
                <p>You don&apos;t have the permission to change a user&apos;s role. Please contact a super Admin to help you out.</p>
              </div>
            </>
          </Modal>
        </ReactPortal>}

        {isOpen && <ReactPortal>
          <Modal>
            <DefaultModalCard
              isLoading={updateRoleStatus.isLoading}
              onCancel={() => setIsOpen(false)}
              onConfirm={handleRoleUpdate}
            />
          </Modal>
        </ReactPortal>}
      </div>
    </section>
  );
}

export default Table;
