import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useSession, signIn, signOut } from 'next-auth/react'
import { getUserByEmail, handleSetCookie, login, register } from '@/helper';
import { Role } from '../../types/types';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/features/auth/authSlice';
import { useRouter } from 'next/router';


function GoogleButton() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const dispatch = useDispatch();
    const router = useRouter();
    const { next } = router.query

    if (router.asPath.includes('/register')) {

    }

    const handleGoogleLogin = async () => {
      

         signIn('google', { redirect: false })



         .then(async (res) => {
            console.log({ res });


            const authObj = {
                email: auth?.currentUser?.email as string,
                first_name: auth?.currentUser?.displayName?.split(" ")[0] as string,
                last_name: auth?.currentUser?.displayName?.split(" ")[1] as string || auth?.currentUser?.displayName?.split(" ")[0] as string,
                password: auth?.currentUser?.providerId as string
            }


            const user = await getUserByEmail({
                email: authObj.email as string
            })

            if (user?.data) {

                await handleSetCookie({
                    user: {
                        email: authObj?.email,
                        name: authObj?.first_name + " " + authObj.last_name,
                        role: user.data?.role,
                        id: user?.data.id,
                        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1NzI0MmQzLWRiNDEtNDQ0MC1iNTI0LWJhNDcwOWY2MzFkYiIsImlhdCI6MTY4OTUwOTI5MH0.NjUUZdBCS5du0rhsRX4YZ7tScymszekHQjV2Q2QZU0E"
                    },
                    expiresAt: ''
                })

                if (next) {
                    router.push(next as string)
                    return;
                } else {
                    router.push("/")
                }

            } else {

                await register({
                    body: {
                        ...authObj
                    }

                }).then(async () => {
                    await login({
                        email: authObj.email,
                        password: authObj.password
                    }).then((res) => {
                        dispatch(setAuth({
                            user: {
                                ...authObj,
                                email: res.data.email,
                                role: res.data?.role,
                                name: res.data.first_name + " " + res.data.last_name,
                                accessToken: res?.data.accessToken
                            },
                        }))
                        router.push("/")
                    })
                })


            }





        }).catch((error: any) => {
            throw error
        });


    }


    return (
        <div className="w-full py-2 border border-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-gray-100/10">
            <div className="flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width="28px"
                    height="28px"
                >
                    <path
                        fill="#fbc02d"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                    <path
                        fill="#e53935"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    />
                    <path
                        fill="#4caf50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    />
                    <path
                        fill="#1565c0"
                        d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                </svg>
                <p className="text-black" onClick={handleGoogleLogin}>Continue with Google</p>
            </div>
        </div >
    )
}

export default GoogleButton