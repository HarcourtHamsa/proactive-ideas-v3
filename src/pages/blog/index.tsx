import React, { useEffect, useState } from "react";
import BlogCard from "@/components/BlogCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import headerImage from "../../assets/Second.png"
import { useFetchBlogPostsQuery } from "@/features/apiSlice";

import { useRouter } from "next/router";
import client from "@/lib/sanity";
import SkeletonLoader from "@/components/SkeletonLoader";



function Index({ content }: any) {
  const { data: blogs, isLoading } = useFetchBlogPostsQuery("")
  const [searchQry, setSearchQry] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>(blogs?.data)
  const router = useRouter()

  const handleChange = (e: any) => {
    const value = e.target.value
    setSearchQry(value)

    const filteredBlog = blogs.data.filter((d: any) => {
      return d.title.toLowerCase().includes(value.toLowerCase())
    })


    setFilteredData(filteredBlog);

  }


  const extractTags = (s: any) => {
    console.log("tags", s);
    return s[0]
  }



  return (
    <div className="min-h-screen h-fit bg-[#FAF7ED]">
      <Navbar />
      <div className="h-fit min-h-[400px] w-full md:pt-0 mt-10 bg-[#FAF7ED]">
        <div className="w-full md:h-[450px] h-[350px] md:mb-20 mb-10 overflow-hidden relative" id="blog__header">
          <Image className="absolute inset-0 h-full w-full object-cover" src={headerImage} alt="" />
          <div className="absolute inset-0 bg-[#11393C] opacity-25"></div>
          <div className="flex h-full text-left items-center justify-center relative">
            <div className="w-[90%] mx-auto text-center">
              <h1 className="mb-0 text-3xl text-white  mt-10 font-medium leading-snug lg:font-extrabold lg:text-5xl lg:leading-none  lg:mb-4">{content[0].header}</h1>
              <p className="text-white">{content[0]?.subHeader}</p>
            </div>
          </div>
        </div>

        {/* <div className="md:w-[500px] w-[90%] mx-auto gap-4 mb-16 flex items-center">
          <div className="w-[90%] mx-auto">
            <input placeholder="Search blog..." className="w-full py-3 border-gray-700 text-gray-900 relative rounded px-12 bg-white focus:border-blue-500 outline-none focus:border-2" value={searchQry} onChange={handleChange} />

            <div className="text-gray-400 absolute -translate-y-9 translate-x-4">
              <Search />
            </div>
          </div>

          <button className="bg-[#F08354] py-3 px-6 rounded text-white">Search</button>
        </div> */}

        <div className="container mx-auto md:w-[80%] w-[90%]">

        </div>

        <div className="container mx-auto md:w-[80%] w-[90%] mb-8">
          {isLoading ?

            <div className="mb-8"><SkeletonLoader /></div>
            :
            <div className="grid grid-cols-1 lg:grid-cols-3 justify-between gap-3 pb-10">
              {blogs?.data.filter((post: any) => post.status !== "inactive").map((blog: any) => {
                return (
                  <div className="lg:col-span-1 rounded-xl w-full" key={Math.random()}>
                    <BlogCard data={blog} />
                    {/* <p>Hello</p> */}
                  </div>
                )
              })}
            </div>
          }

        </div>

        <Footer />

      </div>
    </div>
  );
}

export default Index;

export async function getStaticProps() {
  const content = await client.fetch(`*[_type in ["blogPagehero"]]`)

  return {
    props: {
      content
    }
  };
}

