import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://proactive-ideas-backup-6ef9825a1d26.herokuapp.com/api/",
    // baseUrl: "http://localhost:8000/api/",
    headers: {
      "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Headers": "X-Requested-With, Content-Type",
      // "Content-Type": "application/json",
    },
  }),
  endpoints: (builder) => ({
    fetchBlogPosts: builder.query({
      query: () => "/get-blog-posts?status=active",
    }),
    fetchAllBlogPosts: builder.query({
      query: () => "/get-blog-posts",
    }),
    fetchBlogPostDrafts: builder.query({
      query: ({ token }: any) => ({
        url: `get-blog-posts?status=inactive`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    fetchIdeasPosts: builder.query({
      query: () => "/get-idea-posts",
    }),
    fetchEmailList: builder.query({
      query: () => "/get-newsletter-subscribers",
    }),
    fetchIdeasPostDrafts: builder.query({
      query: ({ token }: any) => ({
        url: `/get-idea-posts?status=inactive`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    fetchGeolocationData: builder.query({
      query: () => "https://api.country.is",
    }),
    fetchQuizzes: builder.query({
      query: () => "/get-quizzes",
    }),
    fetchAssessmenmts: builder.query({
      query: ({ token, course }: any) => ({
        url: `/get-assessments?course=${course || ""}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    fetchCoursesDrafts: builder.query({
      query: ({ token }: any) => ({
        url: `/get-courses?status=inactive`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    fetchSingleCourseDraft: builder.query({
      query: ({ id }: any) => ({
        url: `/get-course-by-id?id=${id}`,
        method: "GET",
      }),
    }),
    fetchCourseEnrollment: builder.query({
      query: ({ course, user }: any) => ({
        url: `/get-enrollment?course=${course}&user=${user}`,
        method: "GET",
      }),
    }),
    fetchCourses: builder.query({
      query: () => "/get-courses?status=active",
    }),
    fetchAllCourses: builder.query({
      query: () => "/get-courses",
    }),
    fetchSingleCourse: builder.query({
      query: ({ id }: any) => ({
        url: `/get-course-by-id?id=${id}`,
        method: "GET",
      }),
    }),
    fetchSubSectionQuiz: builder.query({
      query: ({ id }: any) => ({
        url: `/get-course-by-id?id=${id}`,
        method: "GET",
      }),
    }),
    fetchCoursePaymentList: builder.query({
      query: ({ id }: any) => ({
        url: `/payment/${id}`,
        method: "GET",
      }),
    }),
    fetchUsers: builder.query({
      query: ({ token }: any) => ({
        url: `/get-users`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    fetchCategories: builder.query({
      query: ({ group }: any) => ({
        url: `/get-categories?group=${group}`,
        method: "GET",
      }),
    }),
    createCategory: builder.mutation({
      query: ({ token, ...rest }: any) => ({
        url: "/create-category",
        method: "POST",
        body: rest,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    createCourse: builder.mutation({
      query: ({ token, ...rest }: any) => ({
        url: "/create-course",
        method: "POST",
        body: rest.course,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    createCourseDraft: builder.mutation({
      query: ({ token, ...rest }: any) => ({
        url: "/create-course",
        method: "POST",
        body: { ...rest.course, status: "inactive" },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    createQuiz: builder.mutation({
      query: ({ token, id, ...rest }: any) => ({
        url: `/create-quiz`,
        method: "POST",
        body: rest.quiz,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    updateQuiz: builder.mutation({
      query: ({ token, id, ...rest }: any) => ({
        url: `/update-quiz?id=${id}`,
        method: "PATCH",
        body: rest.quiz,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    enrollToCourse: builder.mutation({
      query: ({ token, id, ...rest }: any) => ({
        url: `/enroll-to-course`,
        method: "POST",
        body: rest.body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    createTransaction: builder.mutation({
      query: ({ id, ...rest }: any) => ({
        url: `/payment/${id}`,
        method: "POST",
        body: rest.data,
      }),
    }),
    createAssessment: builder.mutation({
      query: ({ id, ...rest }: any) => ({
        url: `/create-assessment`,
        method: "POST",
        body: rest.data,
      }),
    }),
    updateCourse: builder.mutation({
      query: ({ token, id, ...rest }: any) => ({
        url: `/update-course?id=${id}`,
        method: "PATCH",
        body: rest.data,
        headers: {
          "Content-Type": "application/octet-stream",
          "content-encoding": `gzip`,
        },
      }),
    }),
    updateCourseDraft: builder.mutation({
      query: ({ id, ...rest }: any) => ({
        url: `/update-course?id=${id}`,
        method: "PATCH",
        body: rest.data,
        // headers: {
        //     'Authorization': `Bearer ${token}`,
        // }
      }),
    }),
    updateUserRole: builder.mutation({
      query: ({ token, id, ...rest }: any) => ({
        url: `/change-user-role?id=${id}`,
        method: "PATCH",
        body: rest.data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deleteCourse: builder.mutation({
      query: ({ token, id }: any) => ({
        url: `/delete-course?id=${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deleteCourseDraft: builder.mutation({
      query: ({ token, id }: any) => ({
        url: `/delete-course?id=${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    updateSubSection: builder.mutation({
      query: ({ token, id, ...rest }: any) => ({
        url: `/sub-section/${id}`,
        method: "PATCH",
        body: rest.sub_sections,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deleteSubSection: builder.mutation({
      query: ({ token, id }: any) => ({
        url: `/sub-section/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deleteQuiz: builder.mutation({
      query: ({ token, id }: any) => ({
        url: `/delete-quiz?id=${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deleteCategory: builder.mutation({
      query: ({ token, id, ...rest }: any) => ({
        url: `/delete-category?id=${id}`,
        method: "DELETE",
        body: rest,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    updateCategory: builder.mutation({
      query: ({ token, id, ...rest }: any) => ({
        url: `/update-category?id=${id}`,
        method: "PATCH",
        body: rest,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deleteBlog: builder.mutation({
      query: ({ token, id }: any) => ({
        url: `/delete-blog-post?id=${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deleteBlogDraft: builder.mutation({
      query: ({ token, id }: any) => ({
        url: `/delete-blog-post?id=${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deleteIdeaPost: builder.mutation({
      query: ({ token, id }: any) => ({
        url: `/delete-idea-post?id=${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deleteIdeaPostDraft: builder.mutation({
      query: ({ token, id }: any) => ({
        url: `/delete-idea-post?id=${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    deleteSection: builder.mutation({
      query: ({ token, id }: any) => ({
        url: `/section/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useFetchBlogPostsQuery,
  useFetchBlogPostDraftsQuery,
  useFetchCoursesQuery,
  useFetchSingleCourseQuery,
  useFetchCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateCourseMutation,
  useFetchUsersQuery,
  useDeleteBlogMutation,
  useUpdateCourseMutation,
  useUpdateSubSectionMutation,
  useDeleteSectionMutation,
  useDeleteSubSectionMutation,
  useCreateTransactionMutation,
  useFetchCoursePaymentListQuery,
  useFetchIdeasPostsQuery,
  useDeleteIdeaPostMutation,
  useFetchQuizzesQuery,
  useCreateQuizMutation,
  useFetchSubSectionQuizQuery,
  useDeleteQuizMutation,
  useDeleteCourseMutation,
  useUpdateUserRoleMutation,
  useFetchGeolocationDataQuery,
  useDeleteBlogDraftMutation,
  useFetchIdeasPostDraftsQuery,
  useDeleteIdeaPostDraftMutation,
  useFetchAssessmenmtsQuery,
  useCreateCourseDraftMutation,
  useFetchCoursesDraftsQuery,
  useFetchSingleCourseDraftQuery,
  useDeleteCourseDraftMutation,
  useUpdateCourseDraftMutation,
  useCreateAssessmentMutation,
  useFetchCourseEnrollmentQuery,
  useEnrollToCourseMutation,
  useUpdateQuizMutation,
  useFetchEmailListQuery,
  useFetchAllCoursesQuery,
  useFetchAllBlogPostsQuery,
  useUpdateCategoryMutation,
} = apiSlice;
