import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import {
    IoAdd,
    IoArrowForward,
    IoChevronForward,
    IoHome,
} from "react-icons/io5";
import Layout from "../../../components/admin/Layout";
import Table from "../../../components/admin/UsersTable";
import { useFetchUsersQuery } from "@/features/apiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Loader from "@/components/Loader";
import useAuth from "@/hooks/useAuth";

function List() {;
    const auth = useAuth()
    const token = auth?.accessToken;
    const { data: users, isLoading } = useFetchUsersQuery({ token })

    if (isLoading) {
        return <Loader />
    }
    return (
        <Layout>
            <div className="my-10 p-4">
                <h3 className="text-3xl text-black font-bold mb-3">All Users</h3>
                <Table users={users} />
            </div>
        </Layout>
    );
}

export default List;
