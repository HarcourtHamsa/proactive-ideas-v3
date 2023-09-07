import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { useFormik } from 'formik'
import CustomInput from "../../components/CustomInput";
import notify from "../../components/Notification";
import Spinner from "../../components/Spinner";

import logo from "../../assets/logo.png"

import { ToastContainer } from "react-toastify";
import GoogleButton from "@/components/GoogleButton";
import FacebookButton from "@/components/FacebookButton";
import Link from "next/link";
import { register } from "@/helper";



const validate = (values: any) => {
    const errors: any = {};
    if (!values.first_name) {
        errors.first_name = 'Required';
    } else if (values.first_name.length > 15) {
        errors.first_name = 'Must be 15 characters or less';
    }

    if (!values.last_name) {
        errors.last_name = 'Required';
    } else if (values.last_name.length > 20) {
        errors.last_name = 'Must be 20 characters or less';
    }

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    if (!values.password) {
        errors.password = 'Required';
    } else if (values.password.length < 6) {
        errors.password = 'Must be 6 characters or more';
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = 'Required';
    } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
};


function Register() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            first_name: '',
            last_name: '',
            password: '',
            confirmPassword: '',
        },
        validate,
        onSubmit: values => {
            const newValue: {
                first_name: string,
                last_name: string,
                email: string,
                password: string,
                confirmPassword?: string,

            } = Object.assign({}, values)
            delete newValue.confirmPassword
            createAccount(newValue);
        },
    });


    async function createAccount(formBody: any) {
        setIsLoading(true);

        try {
            await register({ body: formBody })
                .then((res) => {
                    console.log("RES", res?.name);

                    if (res?.name) {
                        notify({ msg: "Account already exits", type: "error" });
                    } else {
                        notify({ msg: "Account created successfully", type: "success" });
                        setTimeout(() => {
                            router.push("/auth/login");
                        }, 1000 * 3);
                    }




                })
                .catch((err) => {
                    console.log("ERR", err);
                    notify({ msg: "Account already exits", type: "error" });
                })
                .finally(() => {
                    setIsLoading(false);
                });

        } catch (error) {
            alert("ERROR")
        }
    }

    return (
        <>

            <ToastContainer />
            <div className=" min-h-screen h-fit w-[100%] bg-[#11393C] grid grid-cols-3 overflow-hidden z-20">
                <div className="overflow-hidden col-span-3 lg:col-span-1">
                    {/* <Image src={logo} alt="logo" className="mx-auto mb-6 scale-75" width={200} height={80} /> */}

                    <div className="w-full h-fit bg-[#FAF7ED] px-4 md:px-8 rounded shadow-inner border border-gray-900 py-3  z-50">
                        <div className="text-left space-y-2 my-8">
                            <h1 className="text-2xl text-black md:text-3xl xl:font-semibold font-medium  pt-2">
                                Register
                            </h1>
                            <p className="-translate-y-2 text-gray-500">Create a new account</p>
                        </div>




                        <form
                            className="mt-6 overflow-hidden"
                            onSubmit={formik.handleSubmit}
                        >
                            <div className="space-y-2 mb-6">
                                <GoogleButton />
                                {/* <FacebookButton /> */}
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <hr className="w-[45%] border-gray-300" /> <p className="text-gray-600">Or</p> <hr className="border-gray-300 w-[45%]" />
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <CustomInput
                                            label="First Name"
                                            type="text"
                                            name="first_name"
                                            value={formik.values.first_name}
                                            onChange={formik.handleChange}
                                        />
                                        <p className="text-red-600 text-sm">{formik.errors.first_name}</p>
                                    </div>
                                    <div>

                                        <CustomInput
                                            label="Last Name"
                                            type="text"
                                            name="last_name"
                                            value={formik.values.last_name}
                                            onChange={formik.handleChange}
                                        />
                                        <p className="text-red-600 text-sm">{formik.errors.last_name}</p>
                                    </div>
                                </div>
                                <div>
                                    <CustomInput
                                        label="Email Address"
                                        type="email"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                    />
                                    <p className="text-red-600 text-sm">{formik.errors.email}</p>
                                </div>
                                <div>
                                    <CustomInput
                                        label="Password"
                                        type="password"
                                        name="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                    />
                                    <p className="text-red-600 text-sm">{formik.errors.password}</p>
                                </div>
                                <div>
                                    <CustomInput
                                        label="Confirm Password"
                                        type="password"
                                        name="confirmPassword"
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                    />
                                    <p className="text-red-600 text-sm">{formik.errors.confirmPassword}</p>
                                </div>
                                <button className="w-full py-3 flex justify-center items-center gap-2 hover:opacity-80 rounded bg-[#F08354] cursor-pointer text-white">
                                    {isLoading && <Spinner />}  Create my account
                                </button>
                                <span className="block text-center -translate-y-2">
                                    Already have an account?{" "}
                                    <Link href="/auth/login" className="text-[#F08354]">
                                        Login
                                    </Link>{" "}
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-span-2 hidden lg:block"></div>

            </div>
        </>
    );
}

export default Register;
