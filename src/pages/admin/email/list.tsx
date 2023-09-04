import React from 'react'
import EmailListTable from '@/components/admin/EmailListTable'
import Layout from '@/components/admin/Layout'
import { useFetchEmailListQuery } from '@/features/apiSlice';
import Loader from '@/components/Loader';

function EmailList() {
    const { data: emailList, isLoading } = useFetchEmailListQuery('');

    if (isLoading) {
        return <Loader />
    }

    return (
        <Layout>
            <div className="p-4 mt-8">
                <h2 className="text-3xl text-black font-bold mb-2">Email List</h2>
                <EmailListTable data={emailList?.data} />

            </div>
        </Layout>
    )
}

export default EmailList