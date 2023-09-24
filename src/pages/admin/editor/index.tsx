import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { TbArrowBack, TbChevronLeft, TbChevronsLeft, TbInfoCircle } from 'react-icons/tb'
import Input from 'react-select/dist/declarations/src/components/Input';
import { useUpdateSubSectionMutation } from '@/features/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Spinner from '@/components/Spinner';
import ReactPortal from '@/components/ReactPortal';
import Modal from '@/components/Modal';
import { IoClose, IoWarning } from 'react-icons/io5';
import { ToastContainer } from 'react-toastify';
import notify from '@/components/Notification';

import Editor from '@/components/admin/Editor';

const ReactQuillEditor = dynamic(() => import("../../../components/admin/Editor"), { ssr: false });
const CustomEditorHeader = dynamic(() => import("../../../components/admin/CustomEditorHeader"), { ssr: false });


import BackChevronButton from '@/components/BackChevronButton';
import dynamic from 'next/dynamic';
import useCookie from '@/hooks/useCookie';



function CustomEditor() {
    const router = useRouter();
    const cookie = useCookie()
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);


    var content = router.query.content as string;
    content = content?.replaceAll("#", "");

    const title = router.query.title as string;

    console.log("router query...", router.query);
    

    const [contentTitle, setContentTitle] = useState(title);
    const [contentBody, setContentBody] = useState(content);

    const { "0": updateSubSection, "1": status } = useUpdateSubSectionMutation();

    const handleTitleChange = (e: any) => {
        setContentTitle(e.target.value)
    }


    const handleBodyChange = (value: any) => {
        setContentBody(value)
    }

    const saveChanges = () => {
        var sub_sections = router.query;
        sub_sections.content = contentBody;
        sub_sections.title = contentTitle;

        setModalIsOpen(true);


        updateSubSection({ token: cookie?.user.accessToken, id: sub_sections.id, sub_sections }).then((res) => {
            console.log(res)
            notify({ msg: 'Content updated!', type: 'success' });
        }).catch(err => {
            console.log(err)
            notify({ msg: 'An error occured!', type: 'error' });

        }).finally(() => {
            setTimeout(() => {
                router.back();
            }, 1000);
        })

    }


    return (
        <div className=''>
            <ToastContainer />
            <div className='flex justify-between px-4 py-4'>

                <BackChevronButton />


                <button className='px-3 py-1  rounded-full border' onClick={() => setModalIsOpen(true)}>
                    Save Changes
                </button>
            </div>

            <div className='md:w-[60%] border-0 lg:w-[70%] w-[90%] mt-10 mx-auto min-h-screen scrollbar-none h-fit' id='editor'>
                <CustomEditorHeader value={contentTitle} onChange={handleTitleChange} />
                <ReactQuillEditor value={contentBody} onChange={(value: any) => handleBodyChange(value)} />

            </div>

            {modalIsOpen && <ReactPortal>

                <Modal>
                    <div className='flex justify-between  pb mb-4'>
                        <h3 className='text-lg'>Notification</h3>

                        <IoClose size={25} className='text-gray-400 cursor-pointer' onClick={() => setModalIsOpen(false)} />
                    </div>

                    <IoWarning size={45} className='mx-auto'/>
                    <p className='text-center mb-4'>Are you sure you want to save changes?</p>

                    <div className='text-center flex gap-4 mx-auto w-fit'>
                        <button className=' px-4 py-2 border rounded flex items-center gap-2' onClick={saveChanges}>
                            {status.isLoading && <Spinner />}
                            Save Changes
                        </button>
                        <button
                            className='border px-4 py-2 rounded'
                            onClick={() => setModalIsOpen(false)}
                        >Cancel</button>
                    </div>
                </Modal>
            </ReactPortal>}
        </div>
    )
}

export default CustomEditor