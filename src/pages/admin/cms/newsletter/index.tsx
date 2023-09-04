import React, { useState } from 'react'
import Layout from '@/components/admin/Layout'
import client from '@/lib/sanity'
import { ToastContainer } from 'react-toastify'
import { IoChevronDown } from 'react-icons/io5'
import { Transition } from '@headlessui/react'
import CustomInput from '@/components/CustomInput'
import Spinner from '@/components/Spinner'
import notify from '@/components/Notification'
import BackChevronButton from '@/components/BackChevronButton'

function Newsletter({ content }: any) {
    const [newsletterContent, setNewsLetterContent] = useState({
        header: content[0]?.header,
        subHeader: content[0]?.subHeader,
        isLoading: false
    })


    const handleChange = (e: any) => {
        switch (e.target.name) {
            case 'header':
                setNewsLetterContent((prevState: any) => ({
                    ...prevState,
                    header: e.target.value
                }))
                break;

            case 'subHeader':
                setNewsLetterContent((prevState: any) => ({
                    ...prevState,
                    subHeader: e.target.value
                }))
                break;

            default:
                break;
        }
    }

    const saveChanges = async () => {
        // shows loader
        setNewsLetterContent((prevState: any) => ({
            ...prevState,
            isLoading: true
        }))

        client
            .patch(`${content[0]?._id}`) // Document ID to patch
            .set({
                header: newsletterContent.header,
                subHeader: newsletterContent.subHeader,
            }) // Shallow merge
            .commit() // Perform the patch and return a promise
            .then((updatedDoc) => {
                notify({ type: 'success', msg: 'Document has been updated!' })

            })
            .catch((err) => {
                notify({ type: 'error', msg: 'Oh no, the update failed' })
                console.log(err.message);

            }).finally(() => {
                setNewsLetterContent((prevState: any) => ({
                    ...prevState,
                    isLoading: false
                }))
            })
    }

    return (
        <Layout>
            <div className='px-4'>
                <BackChevronButton />
                <h2 className='text-3xl mt-2 font-semibold'>Newsletter Component</h2>
                <div className='bg-white pb-4 border rounded my-4 w-full'>
                    <ToastContainer />

                    <Transition
                        show={true}
                        enter="transition-opacity duration-75"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className='py-3 bg-red flex flex-col px-4'>
                            <CustomInput
                                label='Header'
                                type='text'
                                name='header'
                                value={newsletterContent.header}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='py-3 bg-red flex flex-col px-4'>
                            <label
                                htmlFor="message"
                                className="block mb-2 font-medium text-gray-900"
                            >Sub Header</label>
                            <textarea
                                id="message"
                                rows={4}
                                name='subHeader'
                                value={newsletterContent.subHeader}
                                onChange={handleChange}
                                className="block p-2.5 w-full text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>

                        </div>
                        <div className='w-fit ml-auto mr-4'>
                            <button className='py-2 px-4 bg-[#11393C] text-white rounded-md flex gap-1' onClick={saveChanges} disabled={newsletterContent.isLoading}>
                                {newsletterContent.isLoading && <Spinner />}

                                Save Changes

                            </button>
                        </div>
                    </Transition>
                </div>
            </div>
        </Layout>
    )
}

export default Newsletter

export async function getStaticProps() {
    const content = await client.fetch(`*[_type in ["newsletter"]]`)


    return {
        props: {
            content
        }
    };
}