import React from 'react'

import Hero from '@/components/Hero'
import Card from '@/components/Card'


import Footer from '@/components/Footer'
import Newsletter from '@/components/Newsletter'

import certImage1 from '../assets/certificate-image-1.png'
import certImage2 from '../assets/certificate-image-2.png'
import bookDoodleImage from '../assets/book-doodle.svg'

import Image from 'next/image'

import { useFetchBlogPostsQuery, useFetchCoursesQuery, useFetchGeolocationDataQuery, useFetchIdeasPostsQuery } from '@/features/apiSlice'

import BlogCard from '@/components/BlogCard'
import { useRouter } from 'next/router'
import client from '@/lib/sanity'

import IdeaCard from '@/components/IdeaCard'

import useLocalStorage from '@/hooks/useLocalStorage'
import SkeletonLoader from '@/components/SkeletonLoader'
import Loader from '@/components/Loader'

function Index({ heroContent, certContent, newsletterContent }: any) {
  const router = useRouter();


  const { getData, setData } = useLocalStorage()

  const { data: geo, isLoading: isFetchingGeoData } = useFetchGeolocationDataQuery("");
  const { data: blogPosts, isLoading: isFetchingBlogPosts }: any = useFetchBlogPostsQuery("");
  const { data: ideasPosts, isLoading: isFetchingIdeasPosts }: any = useFetchIdeasPostsQuery("");
  const { data: courses, isLoading: isFetchingCourses }: any = useFetchCoursesQuery("");


  if (geo) {
    if (getData('geo') === null || undefined) {
      setData("geo", geo)
    }
  }

  return (
    <div className='bg-[#FAF7ED]'>
      <Hero data={heroContent} />

      <div className='min-h-[400px] h-fit bg-[#FAF7ED]  flex place-items-center'>
        <div className='container w-[100%] mx-auto'>
          <div className='h-fit pt-5 flex justify-center relative items-center'>
            <div className="container w-[90%] mx-auto pb-10">
              <div className='flex justify-between gap-4 lg:items-center my-10 flex-col lg:flex-row'>
                <div>
                  <p className='text-[#11393C] uppercase before:w-10 before:h-[2px] before:bg-[#11393C] before:inline-flex before:-translate-y-1 before:mr-4'>courses</p>
                  <h2 className="mb-4 text-3xl font-semibold leading-snug lg:font-extrabold lg:text-4xl lg:leading-none text-[#11393C] lg:mb-7 md:w-[600px]">
                    Explore inspiring online courses
                  </h2>
                </div>

                <div className=''>
                  <button className='py-2 px-4 whitespace-nowrap text-[#fff] rounded bg-[#11393C]' onClick={() => router.push("courses")}>View all courses</button>
                </div>


              </div>



              <div className="flex overflow-x-scroll pb-10 scrollbar-none">

                {courses ?

                  <div className="flex flex-nowrap lg:grid lg:grid-cols-4  gap-2 flex-shrink-0 flex-grow overflow-auto duration-200 ease-in-out scrollbar-hide">
                    {courses?.data?.filter((post: any) => post.status !== 'inactive').slice(-4).reverse().map((course: any) => {
                      return (
                        <div className='w-[300px] block' key={Math.random()}>
                          <Card
                            key={Math.random()}
                            data={course}
                          />
                        </div>
                      );
                    })}
                  </div>

                  : <SkeletonLoader />}

              </div>
            </div>
          </div>
        </div>
      </div>



      <div className='min-h-screen h-fit py-10 bg-[#FAF7ED] flex justify-center items-center'>
        <Image src={bookDoodleImage} alt="" className='hidden md:block' />
        <div className='container w-[90%] mx-auto items-center grid grid-cols-1 lg:grid-cols-2'>
          <div className='space-y-4'>
            <p className='text-[#11393C] uppercase before:w-10 before:h-[2px] before:bg-[#11393C] before:inline-flex before:-translate-y-1 before:mr-4'>Certification</p>
            <h2 className="mb-4 text-3xl font-semibold  leading-snug lg:font-extrabold lg:text-4xl lg:leading-none text-[#11393C] lg:mb-7 md:w-[500px]">{certContent[0]?.header}</h2>
            <p className='text-black'>
              {certContent[0]?.subHeader}

            </p>
            <p className='bg-[#F08354] text-white px-4 py-2 rounded w-fit cursor-pointer' onClick={() => router.push("/certification")}>Learn More</p>
          </div>
          <div>
            <div className='flex relative items-start h-fit translate-y-10'>
              <Image src={certImage1} alt="" className='h-[300px] md:h-[450px] rounded-xl md:translate-x-10' />
              <Image src={certImage2} alt="" className='scale-[40%] md:scale-[50%] rounded-xl md:-translate-y-[25%] -translate-y-[30%]  md:-translate-x-10 -translate-x-24' />
            </div>
          </div>
        </div>
      </div>

      <div className="container w-[90%] mx-auto pb-24">
        <div className='flex justify-between gap-4 md:items-center my-10 flex-col md:flex-row'>
          <div>
            <p className='text-[#11393C] uppercase before:w-10 before:h-[2px] before:bg-[#11393C] before:inline-flex before:-translate-y-1 before:mr-4'>Blog</p>
            <h2 className="text-2xl md:w-[500px] md:text-4xl text-[#11393C] text-left py-4 mx-auto font-semibold  xl:font-extrabold">
              Fresh insights from experts.
            </h2>

          </div>

          <div>
            <button className='py-2 px-4 bg-[#11393C] rounded hover:opacity-80 text-white' onClick={() => router.push("/blog")}>View blog posts</button>
          </div>


        </div>

        <div className=' overflow-x-scroll scrollbar-none'>
          <div className=" overflow-x-scroll scrollbar-none w-max">

            {blogPosts ?
              <div className="flex flex-nowrap lg:grid lg:grid-cols-4  gap-2 flex-shrink-0 flex-grow overflow-auto duration-200 ease-in-out scrollbar-hide">
                {blogPosts?.data?.filter((post: any) => post.status !== 'inactive').slice(-4).reverse().map((post: any) => {
                  return (
                    <div className='w-[300px] block' key={Math.random()}>
                      <BlogCard
                        data={post}
                      />
                    </div>
                  );
                })}
              </div>

              : <SkeletonLoader />}




          </div>
        </div>
      </div>

      {/* Ideas */}
      <div className="container w-[90%] mx-auto pb-24">
        <div className='flex justify-between gap-4 md:items-center my-10 flex-col md:flex-row'>
          <div>
            <p className='text-[#11393C] uppercase before:w-10 before:h-[2px] before:bg-[#11393C] before:inline-flex before:-translate-y-1 before:mr-4'>Ideas</p>
            <h2 className="text-2xl md:w-[500px] md:text-4xl text-[#11393C] text-left py-4 mx-auto font-semibold  xl:font-extrabold">
              Bite-sized contents
            </h2>

          </div>

          <div>
            <button className='py-2 px-4 bg-[#11393C] rounded text-white' onClick={() => router.push("/ideas")}>View ideas posts</button>
          </div>


        </div>

        <div className=' overflow-x-scroll scrollbar-none'>
          <div className=" overflow-x-scroll scrollbar-none w-max">

            {ideasPosts ?
              <div className="flex flex-nowrap lg:grid lg:grid-cols-4  gap-2 flex-shrink-0 flex-grow overflow-auto duration-200 ease-in-out scrollbar-hide">
                {ideasPosts?.data?.filter((post: any) => post.status !== 'inactive').slice(-4).reverse().map((post: any) => {
                  return (
                    <div className='w-[300px] block' key={Math.random()}>
                      <IdeaCard
                        data={post}
                      />
                    </div>
                  );
                })}
              </div>
              :
              <SkeletonLoader />}


          </div>
        </div>
      </div>


      <div className='w-[100%] h-[400px] relative bg-[#FAF7ED] py-0 -translate-y-14'>
        <Newsletter content={newsletterContent} />
      </div>

      <div className='mt-24 lg:mt-0'>
        <Footer />
      </div>
    </div>
  )
}

export default Index


export async function getStaticProps() {
  const allContents = await client.fetch(`*[_type in ["homePageCertificationSection", "homePageHero", "newsletter"]]`)
  var heroContent: any = []
  var certContent: any = []
  var newsletterContent: any = [];


  allContents.map((data: any) => {
    if (data._type === "homePageHero") {
      heroContent.push(data)
    } else if (data._type === "homePageCertificationSection") {
      certContent.push(data)
    } else {
      newsletterContent.push(data)
    }
  })

  return {
    props: {
      heroContent,
      certContent,
      newsletterContent,
    }
  };
}

