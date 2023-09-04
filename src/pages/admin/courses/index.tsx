import Loader from '@/components/Loader'
import CoursesTable from '@/components/admin/CoursesTable'
import Layout from '@/components/admin/Layout'
import { useFetchBlogPostsQuery, useFetchCoursesDraftsQuery, useFetchCoursesQuery } from '@/features/apiSlice'
import useRole from '@/hooks/useRole'
import React from 'react'
import { Role } from '../../../../types/types'
import useAuth from '@/hooks/useAuth'
import useCookie from '@/hooks/useCookie'

function Index() {
    const role = useRole()
    const cookie = useCookie()
    const { data: courses, isLoading: isFetchingDrafts } = useFetchCoursesQuery("")
    const { data: coursesDrafts, isLoading } = useFetchCoursesDraftsQuery({ token: cookie?.user.accessToken })

    if (isLoading || isFetchingDrafts) {
        return <Loader />
    }

    return (
        <Layout>
            <div className="p-4 mt-8">
                <h2 className="text-3xl text-black font-bold mb-2">Courses {role === Role.admin && "Drafts"}</h2>
                <CoursesTable data={role === Role.admin ? coursesDrafts : courses} />
                {/* <CoursesTable data={coursesDrafts} /> */}
            </div>


        </Layout>
    )
}

export default Index