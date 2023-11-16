import React, { useState } from "react";
import CustomInput from "../../components/CustomInput";


import Logo from "@/components/Logo";

import Link from "next/link";
import { resetPassword } from "@/helper";
import Spinner from "@/components/Spinner";
import notify from "@/components/Notification";
import { ToastContainer } from "react-toastify";
import { useFormik } from 'formik'
import { useRouter } from "next/router";


const validate = (values: any) => {
    const errors: any = {};
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

function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { token } = router.query

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validate,
        onSubmit: async (values) => {
            setIsLoading(true)
            
            const newValue: {
                email: string,
                password: string,
                confirmPassword?: string,

            } = Object.assign({}, values)
            delete newValue.confirmPassword

            await resetPassword({
                body: {
                    email: newValue.email,
                    password: newValue.password,
                    token: token,
                }
            })
                .then((res) => {
                    notify({ msg: "Password reset successfully", type: "success" });
                    setTimeout(() => {
                        router.push("/auth/login");
                    }, 1000 * 3)
                })
                .catch((err) => {
                    console.log("ERR", err);
                    notify({ msg: `${err.response.data.error}`, type: "error" });
                })
                .finally(() => {
                    setIsLoading(false);
                });

        },
    });




    return (
        <div className="bg-[#11393C] h-screen w-screen flex justify-center items-center relative overflow-hidden">

            <div className="w-[90%] md:w-[450px]">
                <ToastContainer />
                <div className="mx-auto w-fit -translate-x-16 mb-4">
                    <Logo />
                </div>

                {/* <Image src={logo} alt="logo" className="mx-auto mb-2" width={200} height={80} /> */}

                <div className="w-full h-fit bg-[#FAF7ED] px-8 py-6 rounded shadow z-40">
                    <div className="text-left space-y-8 mb-8">
                        <h1 className="text-2xl lg:text-3xl lg:text-black font-medium text-center">Reset Password</h1>

                    </div>
                    <form className="space-y-4 mt-6" onSubmit={formik.handleSubmit}>
                        <div>
                            <CustomInput
                                label="Email address"
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
                                type="text"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                            />
                            <p className="text-red-600 text-sm">{formik.errors.password}</p>
                        </div>

                        <div>
                            <CustomInput
                                label="Confirm Password"
                                type="text"
                                name="confirmPassword"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                            />
                            <p className="text-red-600 text-sm">{formik.errors.confirmPassword}</p>
                        </div>

                        <button className="bg-[#F08354] w-full flex justify-center items-center gap-2 py-3 rounded cursor-pointer text-white" type="submit">

                            {isLoading && <Spinner />}
                            Reset Password
                        </button>
                    </form>
                </div>

                <Link href="/auth/login" className="mx-auto block text-white mt-4 w-fit">Back to Login</Link>
            </div>
        </div>
    );
}

export default ForgotPassword;
