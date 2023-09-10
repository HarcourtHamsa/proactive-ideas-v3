import Loader from '@/components/Loader'
import CoursesTable from '@/components/admin/CoursesTable'
import Layout from '@/components/admin/Layout'
import { useFetchAllCoursesQuery, useFetchBlogPostsQuery, useFetchCoursesDraftsQuery, useFetchCoursesQuery } from '@/features/apiSlice'
import useRole from '@/hooks/useRole'
import React from 'react'
import { Role } from '../../../../types/types'
import useAuth from '@/hooks/useAuth'
import useCookie from '@/hooks/useCookie'

function Index() {
    const role = useRole()
    const cookie = useCookie()
    const { data: courses, isLoading } = useFetchAllCoursesQuery("")

    if (isLoading) {
        return <Loader />
    }

    return (
        <Layout>
            <div className="p-4 mt-8">
                <h2 className="text-3xl text-black font-bold mb-2">Courses</h2>
                <CoursesTable data={courses} />
            </div>


        </Layout>
    )
}

export default Index