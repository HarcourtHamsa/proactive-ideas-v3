import React, { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import {
    IoAdd,
    IoArrowForward,
    IoChevronForward,
    IoHome,
} from "react-icons/io5";
import Layout from "../../../components/admin/Layout";
import Table from "../../../components/admin/CategoriesTable";
import http from "../../../lib/http";
import { fetchCategories } from "../../../helper";
import useAuth from "../../../hooks/useAuth";
import Spinner from "../../../components/Spinner";
import { useFetchCategoriesQuery } from "@/features/apiSlice";
import Loader from "@/components/Loader";

function List() {
    const { data: categories, isLoading } = useFetchCategoriesQuery({group:""})

    if (isLoading) {
        return <Loader />
    }

    return (
        <Layout>
            <div className="p-4 mt-8">
                <h2 className="text-3xl text-black font-bold mb-2">Categories</h2>
                <Table categories={categories?.data} />
            </div>
        </Layout>
    );
}

export default List;
