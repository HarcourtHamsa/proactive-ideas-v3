import React, { useState } from 'react'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'


const Hero = dynamic(() => import("@/components/Hero"), { ssr: false });
const Card = dynamic(() => import("@/components/Card"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const Newsletter = dynamic(() => import("@/components/Newsletter"), { ssr: false });
const BlogCard = dynamic(() => import("@/components/BlogCard"), { ssr: false });
const IdeaCard = dynamic(() => import("@/components/IdeaCard"), { ssr: false });



import certImage1 from '../assets/certificate-image-1.png'
import certImage2 from '../assets/certificate-image-2.png'
import bookDoodleImage from '../assets/book-doodle.svg'


import {
  useFetchBlogPostsQuery,
  useFetchCoursesQuery,
  useFetchGeolocationDataQuery,
  useFetchIdeasPostsQuery
} from '@/features/apiSlice'


import client from '@/lib/sanity'


import useLocalStorage from '@/hooks/useLocalStorage'
import SkeletonLoader from '@/components/SkeletonLoader'

import { TbChevronLeft, TbChevronRight } from 'react-icons/tb'

function Index({ heroContent, certContent, newsletterContent }: any) {
  const router = useRouter();


  const { getData, setData } = useLocalStorage()

  const { data: geo, isLoading: isFetchingGeoData } = useFetchGeolocationDataQuery("");
  const { data: blogPosts, isLoading: isFetchingBlogPosts }: any = useFetchBlogPostsQuery("");
  const { data: ideasPosts, isLoading: isFetchingIdeasPosts }: any = useFetchIdeasPostsQuery("");
  const { data: courses, isLoading: isFetchingCourses }: any = useFetchCoursesQuery("");
  const [offset, setOffset] = useState(0)
  const [blogSlideroffset, setBlogSliderOffset] = useState(0)
  const [ideaSlideroffset, setIdeaSliderOffset] = useState(0)


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

            <div className='absolute w-full justify-between hidden md:flex z-20 text-black'>
              <div className='w-[50px] cursor-pointer h-[50px] bg-black/20 flex justify-center items-center rounded-full'
                onClick={() => {
                  if (offset === 0) return
                  setOffset(offset + 1)
                }}
              >
                <TbChevronLeft size={25} />
              </div>

              <div className='w-[50px] cursor-pointer h-[50px] bg-black/20 flex justify-center items-center rounded-full'
                onClick={() => {
                  if (offset === -6) return
                  setOffset(offset - 1)
                }}
              >
                <TbChevronRight size={25} />
              </div>
            </div>
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

                  // CODE GOES HERE
                  <div className={`flex flex-nowrap gap-2 flex-shrink-0 flex-grow overflow-auto duration-200 ease-in-out scrollbar-hide`} style={{ transform: `translateX(${offset * 10}%)` }}>

                    {courses?.data?.filter((post: any) => post.status !== 'inactive').slice(-6).reverse().map((course: any) => {
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

      <div className='min-h-[400px] h-fit bg-[#FAF7ED]  flex place-items-center'>
        <div className='container w-[100%] mx-auto'>
          <div className='h-fit pt-5 flex justify-center relative items-center'>

            <div className='absolute w-full justify-between hidden md:flex z-20 text-black'>
              <div className='w-[50px] cursor-pointer h-[50px] bg-black/20 flex justify-center items-center rounded-full'
                onClick={() => {
                  if (blogSlideroffset === 0) return
                  setBlogSliderOffset(blogSlideroffset + 1)
                }}
              >
                <TbChevronLeft size={25} />
              </div>

              <div className='w-[50px] cursor-pointer h-[50px] bg-black/20 flex justify-center items-center rounded-full'
                onClick={() => {
                  if (blogSlideroffset === -6) return
                  setBlogSliderOffset(blogSlideroffset - 1)
                }}
              >
                <TbChevronRight size={25} />
              </div>
            </div>
            <div className="container w-[90%] mx-auto pb-10">
              <div className='flex justify-between gap-4 lg:items-center my-10 flex-col lg:flex-row'>
                <div>
                  <p className='text-[#11393C] uppercase before:w-10 before:h-[2px] before:bg-[#11393C] before:inline-flex before:-translate-y-1 before:mr-4'>Blogs</p>
                  <h2 className="mb-4 text-3xl font-semibold leading-snug lg:font-extrabold lg:text-4xl lg:leading-none text-[#11393C] lg:mb-7 md:w-[600px]">
                    Fresh insights from experts.
                  </h2>
                </div>

                <div className=''>
                  <button className='py-2 px-4 whitespace-nowrap text-[#fff] rounded bg-[#11393C]' onClick={() => router.push("/blog")}>View blog posts</button>
                </div>


              </div>



              <div className="flex overflow-x-scroll pb-10 scrollbar-none">

                {blogPosts ?

                  // CODE GOES HERE
                  <div className={`flex flex-nowrap gap-2 flex-shrink-0 flex-grow overflow-auto duration-200 ease-in-out scrollbar-hide`} style={{ transform: `translateX(${blogSlideroffset * 10}%)` }}>

                    {blogPosts?.data?.filter((post: any) => post.status !== 'inactive').slice(-6).reverse().map((course: any) => {
                      return (
                        <div className='w-[300px] block' key={Math.random()}>
                          <BlogCard
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

      <div className='min-h-[400px] h-fit bg-[#FAF7ED]  flex place-items-center'>
        <div className='container w-[100%] mx-auto'>
          <div className='h-fit pt-5 flex justify-center relative items-center'>

            <div className='absolute w-full justify-between hidden md:flex z-20 text-black'>
              <div className='w-[50px] cursor-pointer h-[50px] bg-black/20 flex justify-center items-center rounded-full'
                onClick={() => {
                  if (ideaSlideroffset === 0) return
                  setIdeaSliderOffset(ideaSlideroffset + 1)
                }}
              >
                <TbChevronLeft size={25} />
              </div>

              <div className='w-[50px] cursor-pointer h-[50px] bg-black/20 flex justify-center items-center rounded-full'
                onClick={() => {
                  if (ideaSlideroffset === -6) return
                  setIdeaSliderOffset(ideaSlideroffset - 1)
                }}
              >
                <TbChevronRight size={25} />
              </div>
            </div>
            <div className="container w-[90%] mx-auto pb-10">
              <div className='flex justify-between gap-4 lg:items-center my-10 flex-col lg:flex-row'>
                <div>
                  <p className='text-[#11393C] uppercase before:w-10 before:h-[2px] before:bg-[#11393C] before:inline-flex before:-translate-y-1 before:mr-4'>Ideas</p>
                  <h2 className="mb-4 text-3xl font-semibold leading-snug lg:font-extrabold lg:text-4xl lg:leading-none text-[#11393C] lg:mb-7 md:w-[600px]">
                    Bite sized contents.
                  </h2>
                </div>

                <div className=''>
                  <button className='py-2 px-4 whitespace-nowrap text-[#fff] rounded bg-[#11393C]' onClick={() => router.push("/ideas")}>View idea posts</button>
                </div>


              </div>



              <div className="flex overflow-x-scroll pb-10 scrollbar-none">

                {ideasPosts ?

                  // CODE GOES HERE
                  <div className={`flex flex-nowrap gap-2 flex-shrink-0 flex-grow overflow-auto duration-200 ease-in-out scrollbar-hide`} style={{ transform: `translateX(${ideaSlideroffset * 10}%)` }}>

                    {ideasPosts?.data?.filter((post: any) => post.status !== 'inactive').slice(-6).reverse().map((course: any) => {
                      return (
                        <div className='w-[300px] block' key={Math.random()}>
                          <IdeaCard
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

