import Footer from "@/components/Footer";
import { getCookie } from "cookies-next";
import Navbar from "@/components/Navbar";
import { NextApiRequest, NextApiResponse } from "next";
import React from "react";
import { IoPencil } from "react-icons/io5";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { decryptData, fetchUserEnrollments } from "@/helper";
import Card from "@/components/Card";
import useCookie from "@/hooks/useCookie";
import { BsFillPersonFill, BsFillTelephoneFill } from "react-icons/bs";
import { HiMail } from "react-icons/hi";
import { FaUserTie } from "react-icons/fa";

function Profile({ enrollments }) {
  const cookie = useCookie();
  const parsedEnrollments = JSON.parse(enrollments);

  const inputStyling = `h-[55px] border-t border-b py-2 px-3 flex items-center gap-3 text-[#1F2431E5]`;

  console.log(cookie?.user);

  return (
    <div className="bg-[#FAF7ED]">
      <Navbar />
      <div className="h-fit py-20 w-[85%] mx-auto ">
        {/* <div className='lg:h-[300px] h-[200px] flex items-center'>
                    <div className='container w-[85%] mx-auto flex justify-between'>
                        <div>
                            <h3 className='lg:text-3xl font-semibold text-3xl mb-10'>My Profile</h3>
                            <div className='flex gap-4 lg:gap-8'>
                                <div className=' w-[80px] lg:w-[100px] lg:h-[100px] h-[80px] relative rounded-xl bg-[#404eed] flex items-center justify-center'>
                                    <div className='w-6 h-6 border-4 rounded-full absolute border-[#FAF7ED] bg-[#22BB22] -bottom-2 -right-2 '></div>
                                    <h3 className='scale-150 text-white'>HH</h3>
                                </div>

                                <div>
                                    <p>Hamsa Harcourt</p>
                                    <p>hamsaharcourt@gmail.com</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div> */}

        <div className="">
          <Tabs>
            <TabList>
              <Tab>Profile</Tab>
              <Tab>Learning Resources</Tab>
              <Tab>Settings</Tab>
            </TabList>

            <TabPanel className={"my-10"}>
              <div className="mb-10">
                {/* <p className='text-2xl pb-2'>My Profile</p> */}

                <div>
                  <div className="w-[100px] h-[100px] bg-red-400 flex items-center justify-center rounded-full">
                    <p className="text-3xl">
                      {cookie?.user.name.split(" ")[0][0]}{" "}
                      {cookie?.user.name.split(" ")[1][0]}
                    </p>
                  </div>

                  <div className="my-10 lg:w-[50%] grid gap-[20px]">
                    <div className={inputStyling}>
                      <span className="text-[14px] font-medium flex items-center gap-2">
                        <BsFillPersonFill />
                        Full Name:
                      </span>
                      <span className="text-[16px] font-light">
                        {cookie?.user.name}
                      </span>
                    </div>

                    <div className={inputStyling}>
                      <span className="font-medium text-[14px] flex items-center gap-2">
                        <HiMail />
                        Email:
                      </span>
                      <span className="font-light text-[16px]">
                        {cookie?.user.email}
                      </span>
                    </div>

                    <div className={inputStyling}>
                      <span className="font-medium text-[14px] flex items-center gap-2">
                        <FaUserTie />
                        Role:
                      </span>
                      <span className="font-light text-[16px]">
                        {cookie?.user.role}
                      </span>
                    </div>

                    <div className={inputStyling}>
                      <span className="font-medium text-[14px] flex items-center gap-2">
                        <BsFillTelephoneFill />
                        phone number:
                      </span>
                      <span className="font-light text-[16px]">
                        Not specified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel className={"mb-10"}>
              <div className="mb-20">
                <div className="grid grid-cols-3">
                  {parsedEnrollments.map((enrollment: any) => {
                    return (
                      <Card key={Math.random()} data={enrollment.course} />
                    );
                  })}
                </div>
              </div>
            </TabPanel>

            <TabPanel className={"mb-10"}>
              <p>Any content 3</p>
            </TabPanel>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;

// This gets called on every request
export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const encryptedTkn = getCookie("tkn", { req, res }) as string;
  const cookie = decryptData(encryptedTkn);
  const userId = cookie?.user.id;

  // // Fetch data from external API
  const enrollmentApiResponse = await fetchUserEnrollments(userId);
  const enrollments = enrollmentApiResponse?.data;

  // Pass data to the page via props
  return {
    props: {
      enrollments: JSON.stringify(enrollments) || null,
    },
  };
};
