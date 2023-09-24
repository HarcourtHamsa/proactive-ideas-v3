import Loader from '@/components/Loader';
import AssessmentTable from '@/components/admin/AssessmentTable';
import Layout from '@/components/admin/Layout'
import { useFetchAssessmenmtsQuery } from '@/features/apiSlice'
import useAuth from '@/hooks/useAuth';
import useCookie from '@/hooks/useCookie';
import React from 'react'

function Quiz() {
  const cookie = useCookie()

  const { data, isLoading } = useFetchAssessmenmtsQuery({ token: cookie?.user?.accessToken });


  if (isLoading) {
    return <Loader />
  }



  return (
    <Layout>

      <div className="p-4 mt-8">
        <h2 className="text-4xl text-black font-bold mb-2">Course Assessments</h2>
        <AssessmentTable quizArr={data} />
      </div>


    </Layout>
  )
}

export default Quiz