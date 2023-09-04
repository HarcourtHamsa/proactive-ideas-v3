import React, { useState } from 'react'
import { Transition } from '@headlessui/react'
import CustomInput from '@/components/CustomInput'
import notify from '@/components/Notification'
import Spinner from '@/components/Spinner'
import client from '@/lib/sanity'
import { IoChevronDown } from 'react-icons/io5'
import { ToastContainer } from 'react-toastify'

function HeroSection({ heroContent }: any) {
    const [isOpen, setIsOpen] = useState(false)
    const [heroData, setHeroData] = useState({
        header: heroContent[0]?.header,
        subHeader: heroContent[0]?.subHeader,
        isLoading: false
    })

    const handleHeroDataChange = (e: any) => {
        switch (e.target.name) {
            case 'header':
                setHeroData((prevState: any) => ({
                    ...prevState,
                    header: e.target.value
                }))
                break;

            case 'subHeader':
                setHeroData((prevState: any) => ({
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
        setHeroData((prevState: any) => ({
            ...prevState,
            isLoading: true
        }))

        client
            .patch(`${heroContent[0]?._id}`) // Document ID to patch
            .set({
                header: heroData.header,
                subHeader: heroData.subHeader,
            }) // Shallow merge
            .commit() // Perform the patch and return a promise
            .then((updatedDoc) => {
                notify({ type: 'success', msg: 'Document has been updated!' })

            })
            .catch((err) => {
                notify({ type: 'error', msg: 'Oh no, the update failed' })
              

            }).finally(() => {
                setHeroData((prevState: any) => ({
                    ...prevState,
                    isLoading: false
                }))
            })
    }


    return (
        <div className='bg-white pb-4 border rounded my-4 w-full'>
            <ToastContainer />
            <div className='w-full py-2 uppercase border-b  px-4 flex justify-between items-center'>
                <p>HERO SECTION</p>
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
                        value={heroData.header}
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
                        value={heroData.subHeader}
                        onChange={handleHeroDataChange}
                        className="block p-2.5 w-full text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write your thoughts here..."></textarea>

                </div>
                <div className='w-fit ml-auto mr-4'>
                    <button className='py-2 px-4 bg-[#404eed] text-white rounded-md flex gap-1' onClick={saveChanges} disabled={heroData.isLoading}>
                        {heroData.isLoading && <Spinner />}

                        Save Changes

                    </button>
                </div>
            </Transition>
        </div>
    )
}

export default HeroSection