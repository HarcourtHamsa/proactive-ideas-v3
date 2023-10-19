import React, { useState } from "react";
import { TbLocation, TbMail, TbMessage, TbPhoneCall } from "react-icons/tb";
import CustomInput from "../components/CustomInput";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import Spinner from "@/components/Spinner";

function Contact() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [message, setMessage] = useState("");

    function handleChange(e: any) {
        switch (e.target.name) {
            case "email":
                setEmail(e.target.value);
                break;

            case "fullName":
                setFullName(e.target.value);
                break;

            case "message":
                setMessage(e.target.value);
                break;

            default:
                break;
        }
    }

    return (
        <div className="bg-[#FBF7F4] w-full min-h-screen h-fit">
            <Navbar />

            <div className="md:py-40 py-20">
                <div className="container w-[90%] mx-auto">
                    <h1 className="mb-4 text-4xl font-semibold leading-snug lg:font-extrabold lg:text-5xl lg:leading-none text-black lg:mb-7 md:w-[600px]">Contact Us</h1>

                    <p className="text-gray-600 -translate-y-3 mb-16">
                        You can always reach us 24/7 to get more information about our
                        services.
                    </p>
                </div>
                <div className="container w-[90%] mx-auto grid md:grid-cols-2 grid-cols-1 gap-8 h-[100%]">

                    <div>
                        <form onSubmit={() => { }}>

                            <div className="space-y-6">

                                <CustomInput
                                    label="Full Name"
                                    type="text"
                                    name="fullName"
                                    value={fullName}
                                    onChange={handleChange}
                                />

                                <CustomInput
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                />

                                <div>
                                    <label htmlFor="message">Your Message</label>
                                    <textarea id="message" rows={4} className="block p-2.5 w-full text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500 outline-blue-500" placeholder="Write your thoughts here..." name="message" value={message} onChange={handleChange}></textarea>
                                </div>

                                <button className="w-fit px-6 py-3 flex gap-1 items-center justify-center hover:opacity-80 rounded bg-[#F08354] cursor-pointer text-white">
                                    {isLoading && <Spinner />}  Send Message
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="text-black space-y-4 md:col-span-1 translate-y-8">

                        <div className="bg-white mt-10 md:mt-0 rounded-xl border-l-4 border-orange-400 px-6 py-10 text-black">

                            {/* <hr className="my-4 border-gray-500"/> */}
                            <div className="my-4 space-y-6">
                                {/* <div className="flex gap-8 items-center">
                                    <div className="h-14 w-14 bg-slate-300/30 rounded-full items-center justify-center hidden xl:flex">
                                        <TbLocation size={20} />
                                    </div>
                                    <div>
                                        <p>Visit us:</p>
                                        <p className="">
                                            Plot 11, Road 16, Housing Estate, Woji, Port Harcourt, Nigeria.
                                        </p>
                                    </div>
                                </div> */}
                                <div className="flex gap-8 items-center">
                                    <div className="h-14 w-14 bg-slate-300/30 rounded-full items-center justify-center hidden xl:flex">
                                        <TbMail size={20} />
                                    </div>
                                    <div>
                                        <p>Mail us:</p>
                                        <p className="">info@proactiveideas.co</p>
                                    </div>
                                </div>
                                <div className="flex gap-8 items-center">
                                    <div className="h-14 w-14 bg-slate-300/30 rounded-full items-center justify-center hidden xl:flex">
                                        <TbPhoneCall size={20} />
                                    </div>
                                    <div>
                                        <p>Call us:</p>
                                        <p className="">+234 913 293 1242</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                </div>
            </div>


            <Footer />
        </div>
    );
}

export default Contact;
