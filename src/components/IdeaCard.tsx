import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";

function IdeaCard({
  data
}: any) {
  const router = useRouter();


  const extractTags = (s: any) => {
    return s[0]
  }


  return (
    <div className="shadow h-[400px] cursor-pointer">
      <div className="flex flex-col h-full bg-white border rounded overflow-hidden" onClick={() => router.push({
        pathname: `/ideas/${data.title}`, query: {
          ...data
        }
      }, `/ideas/${data.id}/${data.title.replace(/ /g, "-").toLowerCase()}`)}>

        <a className="block focus:outline-none focus-visible:ring-2 h-[50%]">
          <figure className="relative h-full overflow-hidden ">
            <Image className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition duration-700 ease-out" src={data?.header_image} width="320" height="180" alt="Course" />
          </figure>
        </a>

        <div className="flex-grow flex flex-col px-4 pt-3">

          <div className="mb-4">
            <p className="bg-orange-100 px-4 py-1 w-fit rounded-full text-[#F08354] text-sm">{extractTags(data.tags)}</p>
          </div>

          <div className="flex-grow">


            <header className="mb-3">
            <a className="block focus:outline-none focus-visible:ring-2">
            <p className="text-lg font-semibold leading-snug capitalize line-clamp-2">{data?.title}</p>
              </a>
            </header>

            <div className="mb-8 line-clamp-2">
              <p>{data?.summary}</p>
            </div>

            <div className="flex gap-2 items-center mb-2 text-black text-sm">
              <p>{data?.author}</p>

              <p className="w-1 h-1 bg-[#11393C] rounded-full"></p>

              <p>
                {new Date(data?.createdAt).toLocaleDateString()}
              </p>
            </div>


          </div>


        </div>
      </div>
    </div>
  );
}

export default IdeaCard;
