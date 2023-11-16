import React from "react";
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false }); 
const SkeletonLoader = dynamic(() => import("@/components/SkeletonLoader"), { ssr: false });
const IdeaCard = dynamic(() => import("@/components/IdeaCard"), { ssr: false });


import { useFetchIdeasPostsQuery } from "@/features/apiSlice";
import client from "@/lib/sanity";



function Index({ content }: any) {
  const { data: ideas, isLoading } = useFetchIdeasPostsQuery("")

  return (
    <div className="min-h-screen h-fit bg-[#FAF7ED]">
      <Navbar />
      <div className="h-fit min-h-[400px] w-full md:pt-36 pt-32 bg-[#FAF7ED]">

        <h1 className="mb-0 text-3xl  mt-10 font-medium container w-[80%] mx-auto leading-snug lg:font-extrabold lg:text-5xl lg:leading-none  lg:mb-4">Bite Sized Contents</h1>
    
        <div className="container mx-auto md:w-[80%] w-[90%] mt-20">
          {isLoading ? <SkeletonLoader /> :
            <div className="grid grid-cols-1 lg:grid-cols-3 justify-between gap-3 pb-10">
              {ideas?.data.filter((post: any) => post.status !== "inactive").slice(0).map((blog: any) => (
                <div className="lg:col-span-1 rounded-xl w-full" key={Math.random()}>
                  <IdeaCard data={blog} />
                </div>
              ))}
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
  const content = await client.fetch(`*[_type in ["ideasPagehero"]]`)

  return {
    props: {
      content
    }
  };
}
