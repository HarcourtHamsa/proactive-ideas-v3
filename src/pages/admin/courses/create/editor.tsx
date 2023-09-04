import React, { useState } from 'react'


// import CustomEditorHeader from '@/components/admin/CustomEditorHeader'
// import ReactQuillEditor from '@/components/admin/Editor';

const ReactQuillEditor = dynamic(() => import("../../../../components/admin/Editor"), { ssr: false });
const CustomEditorHeader = dynamic(() => import("../../../../components/admin/CustomEditorHeader"), { ssr: false });





import BackChevronButton from '@/components/BackChevronButton';
import { useRouter } from 'next/router';
import Modal from '@/components/Modal';
import CustomInput from '@/components/CustomInput';
import ReactPortal from '@/components/ReactPortal';
import { TbInfoCircle } from 'react-icons/tb';
import { useDispatch } from 'react-redux';
import { addSubSection, editSubSection } from '@/features/sections/sectionsSlice';
import notify from '@/components/Notification';
import { ToastContainer } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import dynamic from 'next/dynamic';
import { seperateBlogDataIntoComponents } from '@/helper';


function Editor() {
    const dispatch = useDispatch();
    const router = useRouter();

    const courseId = router?.query.courseId;


    const query = router?.query;


    const [contentTitle, setContentTitle] = useState(query?.title || "");
    const [contentBody, setContentBody] = useState(query?.content || "");
    const [modalIsOpen, setModalIsOpen] = useState(false);


    const handleTitleChange = (e: any) => {
        setContentTitle(e.target.value)
    }

    const saveChanges = () => {
        if (query.content) {
         
            dispatch(editSubSection({ id: courseId as string, title: contentTitle as string, content: contentBody as string, subSectionId: query.subSectionId as string }));
        } else {
 
            dispatch(addSubSection({ id: query.id as string, title: contentTitle as string, content: contentBody as string, subSectionId: uuidv4() }));
        }


        notify({ type: 'success', msg: 'Document saved!' });
        setContentTitle("");
        setContentBody("");

        setTimeout(() => {
            router.back();
        }, 1000);


    }

    return (
        <div>
            <div className='flex justify-between items-center px-4 pt-6'>
                <BackChevronButton />
                <ToastContainer />

                <button className='px-4 py-2 border rounded' onClick={() => setModalIsOpen(true)}>
                    Save Changes
                </button>
            </div>
            <div className='md:w-[80%] border-0 lg:w-[80%] w-[90%] mt-10 mx-auto min-h-screen scrollbar-none h-fit' id='editor'>
                {/* <CustomEditorHeader value={contentTitle} onChange={handleTitleChange} /> */}
                <ReactQuillEditor
                    value={contentBody}
                    onChange={(value: any) => {
                        const [title, _] = seperateBlogDataIntoComponents(contentBody as string);
                        setContentBody(value)
                        setContentTitle(title)
                    }
                    } />
            </div>

            {modalIsOpen && <ReactPortal>
                <Modal>
                    <div>
                        <TbInfoCircle size={45} className='mx-auto mt-2' />
                        <p className='text-center'>Are you sure want to save changes?</p>
                        <div>
                            <div className='mt-4 flex items-center space-x-2'>
                                <button className='border px-4 py-2 w-[50%] text-black  rounded' onClick={() => setModalIsOpen(false)}>Discard</button>
                                <button className='border px-4 py-2  w-[50%] text-black  rounded' onClick={saveChanges}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                </Modal></ReactPortal>}
        </div>
    )
}

export default Editor