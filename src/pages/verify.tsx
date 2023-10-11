import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Spinner from '@/components/Spinner'
import http from '@/lib/http'
import React, { useState } from 'react'
import { AiOutlineStop } from 'react-icons/ai'
import { IoStop, IoStopCircle, IoStopCircleOutline } from 'react-icons/io5'
import { MdStop } from 'react-icons/md'

function Verify() {
    const [certId, setCertId] = useState<string>('')
    const [isLoading, setIsLoading] = useState<null | boolean>(null)
    const [isSuccessful, setIsSuccessful] = useState<boolean | null>(null)
    const [certDetails, setCertDetails] = useState<any>({})

    async function handleSearch() {
        setIsLoading(true)

        try {

            const cert = await http.get(`/get-certificate-by-id?id=${certId}`)
            const existingCert = cert?.data.data

            setCertDetails(existingCert)
            setIsSuccessful(true)

        } catch (error) {
            setIsSuccessful(false)
        }

        setIsLoading(false)

    }

    return (
        <div className="bg-[#FBF7F4] w-full min-h-screen h-fit">
            <Navbar />
            <div>
                <div className="md:py-40 py-20">
                    <div className="container w-[80%] mx-auto">
                        <h1 className="mb-2 text-4xl font-semibold leading-snug lg:font-extrabold lg:text-5xl lg:leading-none text-black lg:mb-2 md:w-[600px]">Verify Certificate Credibility</h1>
                        <p>
                            Enter a certificate number to confirm the validity of a certificate
                        </p>
                    </div>

                    <div className="container flex w-[80%] mx-auto mt-6">
                        <input
                            placeholder='ELC-19095-454-454'
                            className='border py-2 px-4 lg:w-[300px] w-[60%] rounded bg-white'
                            value={certId}
                            onChange={(e) => setCertId(e.target.value)}
                        />
                        <button
                            className='border px-4 py-2 ml-2 flex items-center gap-2 rounded bg-[#F08354] text-white' onClick={() => handleSearch()}>
                            {isLoading && <Spinner />}
                            Search</button>
                    </div>

                    <div className="container w-[80%] mx-auto">
                        {isSuccessful === false ? <div className='h-[300px] flex items-center justify-center'>
                            <div className='text-center'>
                                <AiOutlineStop size={50} className='translate-x-12'/>
                                <p>Certificate Not Found</p>
                            </div>
                        </div> : isSuccessful === true ?

                            <div className="container mx-auto mt-10 h-[100px] w-full bg-white border rounded">
                                <table className="table w-full overflow-scroll border-separate h-full border">
                                    <thead className='text-left  bg-[#F08354] text-white'>
                                        <tr className=''>
                                            <th className='py-2 px-2'>Holder</th>
                                            <th className='py-2 px-2'>Course</th>
                                            <th className='py-2 px-2'>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-slate-100'>
                                        <tr >
                                            <td className='px-2 whitespace-nowrap'>{certDetails.user.first_name} {certDetails.user.last_name}</td>
                                            <td className='px-2 whitespace-nowrap'>{certDetails.course.title}</td>
                                            <td className='px-2 whitespace-nowrap'>{certDetails.createdAt}</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div> : null}

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Verify