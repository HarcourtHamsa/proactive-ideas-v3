import Loader from '@/components/Loader';
import Layout from '@/components/admin/Layout'
import QuizTable from '@/components/admin/QuizTable';
import { useFetchQuizzesQuery } from '@/features/apiSlice'
import React from 'react'

function Quiz() {

    const { data, isLoading } = useFetchQuizzesQuery("");

    if (isLoading) {
        return <Loader />
    }

    return (
        <Layout>

            <div className="p-4 mt-8">
                <h2 className="text-4xl text-black font-bold mb-2">Quiz</h2>
                <QuizTable quizArr={data} />
            </div>
        </Layout>
    )
}

export default Quiz