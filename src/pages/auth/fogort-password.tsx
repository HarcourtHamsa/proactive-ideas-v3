import React, { useState } from "react";
import CustomInput from "../../components/CustomInput";

import logo from "../../assets/logo.png"
import Image from "next/image";
import Logo from "@/components/Logo";
import CustomLink from "@/components/CustomLink";
import Link from "next/link";
import { forgotPassword } from "@/helper";
import Spinner from "@/components/Spinner";
import notify from "@/components/Notification";
import { ToastContainer } from "react-toastify";

function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value)
    }

    const handleForgotPassword = async (e: any) => {
        e.preventDefault();

        try {
            setIsLoading(true)
            await forgotPassword({ email })
            notify({ msg: 'Email sent', type: 'success' })
        } catch (error) {
            notify({ msg: 'Account not found', type: 'error' })

        } finally {
            setIsLoading(false)
            setEmail("")
        }
    }


    return (
        <div className="bg-[#11393C] h-screen w-screen flex justify-center items-center relative overflow-hidden">

            <div className="w-[90%] md:w-[450px]">
                <ToastContainer />
                <div className="w-fit mx-auto lg:-translate-x-20 -translate-x-10 mb-4 ">
                    <Logo />
                </div>

                {/* <Image src={logo} alt="logo" className="mx-auto mb-2" width={200} height={80} /> */}

                <div className="w-full h-fit bg-[#FAF7ED] px-8 py-6 rounded shadow z-40">
                    <div className="text-left space-y-8 mb-8">
                        <h1 className="text-2xl lg:text-3xl font-medium lg:text-black text-center">Forgot Password?</h1>
                        <p className="text-gray-900">
                            Enter the email address you used when you joined and we&apos;ll send you instructions to reset your password.
                        </p>


                    </div>
                    <form className="space-y-8 mt-6">
                        <CustomInput label="" type="email" onChange={handleEmailChange} value={email} />

                        <button className="bg-[#F08354] w-full flex justify-center items-center gap-2 py-3 rounded cursor-pointer text-white" onClick={(e) => handleForgotPassword(e)}>

                            {isLoading && <Spinner />}
                            Send Reset Instructions
                        </button>
                    </form>
                </div>

                <Link href="/auth/login" className="mx-auto block text-white mt-4 w-fit">Back to Login</Link>
            </div>
        </div>
    );
}

export default ForgotPassword;
