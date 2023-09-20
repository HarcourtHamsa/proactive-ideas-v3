import { useRouter } from "next/router";
import React from "react";
import { IoPeople } from "react-icons/io5";

function InfoCard({
  icon,
  bg,
  number,
  label,
}: {
  icon: React.ReactElement;
  bg: string;
  number: string;
  label: string;
}) {

  const router = useRouter();
  const generateLink = (keyword: string) => {
    keyword = keyword.toLocaleLowerCase();
    
    if (keyword.includes("user")) {
      return "/admin/users/list"
    } else if (keyword.includes("blog")) {
      return "/admin/blogs"
    } else if (keyword.includes("course")) {
      return "/admin/courses"
    } else if (keyword.includes("idea")) {
      return "/admin/ideas"
    } else {
      return "/"
    }
  }


  return (
    <div className="bg-white rounded border cursor-pointer h-32 flex justify-center items-center" onClick={() => router.push(generateLink(label))}>
      <div className="flex items-center w-[80%] mx-auto justify-between">
        <div className={`w-16 h-16 rounded-full flex justify-center items-center bg-[#F08354]`}>
          {icon}
        </div>
        <div className="text-right">
          <h3 className="text-3xl font-bold text-[#F08354]">{number}</h3>
          <p className=" text-gray-900">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
