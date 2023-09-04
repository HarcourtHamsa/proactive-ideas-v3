import React from "react";
import Table from "../../../components/admin/IdeasTable";
import Layout from "../../../components/admin/Layout";
import { useFetchIdeasPostDraftsQuery, useFetchIdeasPostsQuery } from "@/features/apiSlice";
import useRole from "@/hooks/useRole";
import { Role } from "../../../../types/types";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/Loader";
import useCookie from "@/hooks/useCookie";

function Index() {
    const role = useRole();
    const cookie = useCookie();
    const { data: ideasPostDrafts, isLoading: isFetchingIdeasPost } = useFetchIdeasPostDraftsQuery({ token: cookie?.user.accessToken });
    const { data: ideasPost, isLoading: isFetchingDrafts } = useFetchIdeasPostsQuery({ token: cookie?.user.accessToken });

    if (isFetchingDrafts && isFetchingIdeasPost){
        return <Loader />
    }


    return (
        <Layout>
           <div className="p-4 mt-8">
                <h2 className="text-3xl text-black font-bold mb-2">Ideas Post {role === Role.admin ? "Drafts" : null}</h2>
                <Table data={ role === Role.admin ? ideasPostDrafts : ideasPost}  />
            </div>

        </Layout>
    );
}

export default Index;
