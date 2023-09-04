import CustomInput from '@/components/CustomInput'
import { Transition } from '@headlessui/react'
import notify from '@/components/Notification'
import Spinner from '@/components/Spinner'
import client from '@/lib/sanity'
import React, { useState } from 'react'
import { IoChevronDown } from 'react-icons/io5'
import { ToastContainer } from 'react-toastify'

function SectionComponent({ sectionContent }: any) {
    const [isOpen, setIsOpen] = useState(false)
    const [certData, setCertData] = useState({
        header: sectionContent[0]?.header,
        subHeader: sectionContent[0]?.subHeader,
        isLoading: false
    })

    const handleHeroDataChange = (e: any) => {
        switch (e.target.name) {
            case 'header':
                setCertData((prevState: any) => ({
                    ...prevState,
                    header: e.target.value
                }))
                break;

            case 'subHeader':
                setCertData((prevState: any) => ({
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
        setCertData((prevState: any) => ({
            ...prevState,
            isLoading: true
        }))

        client
            .patch(`${sectionContent[0]?._id}`) // Document ID to patch
            .set({
                header: certData.header,
                subHeader: certData.subHeader,
            }) // Shallow merge
            .commit() // Perform the patch and return a promise
            .then((updatedDoc) => {
                notify({ type: 'success', msg: 'Document has been updated!' })

            })
            .catch((err) => {
                notify({ type: 'error', msg: 'Oh no, the update failed' })
           

            }).finally(() => {
                setCertData((prevState: any) => ({
                    ...prevState,
                    isLoading: false
                }))
            })
    }


    return (
        <div className='bg-white pb-4 border rounded my-4 w-full'>
            <ToastContainer />
            <div className='w-full py-2  border-b  px-4 flex justify-between items-center'>
                <p className='uppercase'>CTA Section</p>
                <IoChevronDown className='cursor-pointer' onClick={() => setIsOpen(!isOpen)} />
            </div>

            <Transition
                show={isOpen}
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
                        value={certData.header}
                        onChange={handleHeroDataChange}
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
                        value={certData.subHeader}
                        onChange={handleHeroDataChange}
                        className="block p-2.5 w-full text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>

                </div>
                <div className='w-fit ml-auto mr-4'>
                    <button className='py-2 px-4 bg-[#404eed] text-white rounded-md flex gap-1' onClick={saveChanges} disabled={certData.isLoading}>
                        {certData.isLoading && <Spinner />}

                        Save Changes

                    </button>
                </div>
            </Transition>
        </div>
    )
}

export default SectionComponent