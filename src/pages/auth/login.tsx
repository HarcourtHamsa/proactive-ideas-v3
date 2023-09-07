import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import CustomInput from "../../components/CustomInput";
import Spinner from "../../components/Spinner";
import logo from "../../assets/logo.png"

import { useDispatch } from "react-redux";
import { setAuth } from "../../features/auth/authSlice";

import notify from "../../components/Notification";
import { ToastContainer } from "react-toastify";
import http from "../../lib/http";
import Link from "next/link";
import FacebookButton from "@/components/FacebookButton";
import GoogleButton from "@/components/GoogleButton";
import GithubButton from "@/components/GithubButton";
import { useSession, signOut, signIn } from "next-auth/react"
import usePreviousRoute from "@/hooks/usePreviousPath";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import axios from "axios";
import { handleSetCookie, login } from "@/helper";
import { supabase } from "@/lib/supabaseClient";
import { Role } from "../../../types/types";




function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { next } = router.query
    const dispatch = useDispatch()
    const { data: session } = useSession()



    async function handleSubmit(e: any) {
        e.preventDefault();
        setIsLoading(true)

        await login({ email, password }).then(async (res) => {

            const authObj = {
                user: {
                    accessToken: "",
                    name: res.data.first_name + " " + res.data.last_name,
                    email: res.data.email,
                    role: res.data.role,
                    id: res.data.id
                },
                expiresAt: ""
            }

            notify({ msg: "Authentication successful", type: 'success' })
            dispatch(setAuth(authObj))

            await handleSetCookie(authObj)

            setTimeout(() => {
                if (next) {
                    router.push(next as string)
                    return;
                }

                if (authObj?.user.role.includes("admin")) {
                    router.push("/admin")
                } else {
                    router.push("/")
                }

            }, 1000 * 2)

        }).catch((error) => {
            notify({ msg: "Invalid login credentials", type: 'error' })
        }).finally(() => {
            setIsLoading(false)
        })
    }

    function handleChange(e: any) {
        switch (e.target.name) {
            case "email":
                setEmail(e.target.value);
                break;

            case "password":
                setPassword(e.target.value);
                break;

            default:
                break;
        }
    }


    return (
        <>
            <div className="bg-[#11393C] min-h-screen h-fit overflow-hidden w-full grid grid-cols-3">
                <div className="lg:col-span-1 col-span-3">
                    <ToastContainer />

                    {/* <Image src={logo} alt="logo" className="mx-auto mb-6 scale-75" width={200} height={80} /> */}
                    <div className="w-full h-full bg-[#FAF7ED] px-4 md:px-8 border-gray-900 py-3  z-50">
                        <div className="text-left space-y-2 my-8">
                            <h1 className="text-2xl text-black md:text-3xl xl:font-semibold font-medium pt-2">
                                Login
                            </h1>
                            <p className="text-gray-500 -translate-y-2">Sign in to your account</p>
                        </div>
                        <form onSubmit={handleSubmit}>

                            <div className="space-y-2 mb-8">
                                <GoogleButton />
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <hr className="w-[45%] border-gray-300" /> <p className="text-gray-600">Or</p> <hr className="border-gray-300 w-[45%]" />
                            </div>

                            <div className="space-y-6">

                                <button onClick={() => signOut()}>Google signout</button>

                                <CustomInput
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                />
                                <span className="block text-center float-right">
                                    <Link href="/auth/fogort-password" className="text-[#F08354]">
                                        Forgot password?
                                    </Link>{" "}
                                </span>

                                <CustomInput
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={handleChange}
                                />
                                <button className="w-full py-3 flex gap-1 items-center justify-center hover:opacity-80 rounded bg-[#F08354] cursor-pointer text-white">
                                    {isLoading && <Spinner />}  Log in
                                </button>
                                <span className="block text-center text-black -translate-y-2">
                                    New to Proactive Ideas?{" "}
                                    <Link href="/auth/register" className="text-[#F08354]">
                                        Sign up
                                    </Link>{" "}
                                </span>



                            </div>
                        </form>
                    </div>
                </div>
                <div className="hidden lg:block">
                </div>
            </div>
        </>
    );
}

export default Login;
