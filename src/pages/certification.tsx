import React from "react";
import dynamic from 'next/dynamic'

const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });


import leftGrid from "../assets/grid-left.svg";
import rightGrid from "../assets/grid-right.svg";
import learnImage from "../assets/learn.png";
import sampleCertificateImage from "../assets/sample-certificate.jpg";
import Image from "next/image";
import client from "@/lib/sanity";

function Certifications({heroContent, sectionContent}: any) {
    return (
        <div className="bg-[#11393C] w-full">
            <Navbar />
            <div className="bg-transparent overflow-hdden min-h-[300px] h-fit py-40">
                      
                <div className="container w-[90%] overflow-hidden mx-auto grid relative lg:grid-cols-2 grid-cols-1 items-center">


                    <div className="z-10">
                        <h1 className="mb-4 text-3xl font-semibold leading-snug lg:font-extrabold lg:text-5xl lg:leading-none text-white lg:mb-2 lg:w-[600px]">{heroContent[0].header}</h1>
                        <p className="text-gray-400">{heroContent[0].subHeader}</p>
                    </div>

                    {/* left grid svg */}
                    <div className="absolute left-0 z-10">
                        <Image src={leftGrid} alt=""  />
                    </div>

                    {/* right grid svg */}
                    <div className="absolute right-0 bottom-0 z-10 scale-150">
                        <Image src={rightGrid} alt=""  />
                    </div>
                 

                    <div className="lg:w-[80%] mt-10 ml-auto rounded overflow-hidden z-10">
                        <Image src={sampleCertificateImage}  alt="sample certificate"/>
                    </div>
                </div>
            </div>

            <div className="bg-[#FAF7ED] overflow-hidden h-fit py-10">
                <div className="container w-[90%] mx-auto grid gap-8 relative md:grid-cols-2 grid-cols-1 items-center">
                    <div className="py-0 rounded space-y-1">
                        <Image src={learnImage} alt="" />
                    </div>
                    <div className="py-0 rounded space-y-2">
                        <h3 className="text-3xl">{sectionContent[0].header}</h3>
                        <p>
                        {sectionContent[0].subHeader}
                        </p>
                    </div>
                </div>

            </div>

                
            <Footer />
        </div>
    );
}

export default Certifications;

export async function getStaticProps() {
    const allContents = await client.fetch(`*[_type in ["certificationPagehero", "certificationPageSection"]]`)
    var heroContent: any = []
    var sectionContent: any = []

  
  
    allContents.map((data: any) => {
      if (data._type === "certificationPagehero") {
        heroContent.push(data)
      } else {
        sectionContent.push(data)
      }
    
    }) 
  
    return {
      props: {
        heroContent,
        sectionContent
      }
    };
  }
  
