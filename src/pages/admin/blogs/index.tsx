import React, { useEffect } from "react";
import Table from "../../../components/admin/BlogsTable";
import Layout from "../../../components/admin/Layout";
import { useFetchAllBlogPostsQuery, useFetchBlogPostDraftsQuery, useFetchBlogPostsQuery } from "@/features/apiSlice";
import Spinner from "@/components/Spinner";
import Loader from "@/components/Loader";
import useRole from "@/hooks/useRole";
import { Role } from "../../../../types/types";
import { useSelector } from "react-redux";
import useAuth from "@/hooks/useAuth";
import useCookie from "@/hooks/useCookie";

function Index() {
  const role = useRole();
  const cookie = useCookie();
  const { data: blogPosts, isLoading } = useFetchAllBlogPostsQuery("");


  if (isLoading) {
    return <Loader />
  }

  return (
    <Layout>
      <div className="p-4 mt-8">
        <h2 className="text-3xl text-black font-bold mb-2">Blog Post</h2>
        <Table data={blogPosts} />
      </div>

    </Layout>
  );
}

export default Index;
