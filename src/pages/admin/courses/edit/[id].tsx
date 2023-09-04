import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import CustomInput from '@/components/CustomInput';
import Loader from '@/components/Loader';
import Layout from '@/components/admin/Layout'
import { useDeleteSectionMutation, useDeleteSubSectionMutation, useFetchCategoriesQuery, useFetchSingleCourseQuery, useUpdateCourseDraftMutation, useUpdateCourseMutation } from '@/features/apiSlice'
import { useRouter } from 'next/router'
import { IoAddCircle, IoChevronBack, IoCloseCircleOutline, IoTrash, IoWarning } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getSingleCourse, seperateBlogDataIntoComponents } from '@/helper';
import Spinner from '@/components/Spinner';
import http from '@/lib/http';
import { TbEdit, TbEditCircle, TbPencil, TbPlus, TbSubtask, TbTrash, TbWriting } from 'react-icons/tb';
import ReactPortal from '@/components/ReactPortal';
import Modal from '@/components/Modal';
import { AiOutlineClose, AiOutlineDelete } from 'react-icons/ai';
import notify from '@/components/Notification';
import { ToastContainer } from 'react-toastify';
import useRole from '@/hooks/useRole';
import dynamic from 'next/dynamic';
import edjsParser from "editorjs-parser";
import { Role } from '../../../../../types/types';
import { BsArrowReturnLeft, BsArrowReturnRight, BsViewStacked } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { setSection } from '@/features/sections/sectionsSlice'


const parser = new edjsParser();
const ReactQuillEditor = dynamic(() => import("../../../../components/admin/Editor"), { ssr: false });


function EditSingleCourse({ course }: any) {
    const router = useRouter();
    const role = useRole();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newSectionModalIsOpen, setNewSectionModalIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [deleteSubSectionModalIsOpen, setDeleteSubSectionModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false)
    const [filesSelected, setFilesSelected] = useState<any>([]);
    const authState = useSelector((state: RootState) => state.auth);
    const token = authState?.auth?.user.accessToken;

    const courseId = router.query.id;


    const { data: categories, isLoading: isFetchingCategories } = useFetchCategoriesQuery("");
    const [isUpdatingGeneralInfo, setIsUpdatingGeneralInfo] = useState(false);
    const [isUpdatingCourseInfo, setIsUpdatingCourseInfo] = useState(false);
    const { "0": updateCourse } = useUpdateCourseMutation();
    const { "0": updateCourseDraft } = useUpdateCourseDraftMutation();
    const { "0": deleteSectionFromDB, "1": deleteMutationStatus } = useDeleteSectionMutation();
    const { "0": deleteSubSectionFromDB, "1": deleteSubSectionMutationStatus } = useDeleteSubSectionMutation();
    const [activeSection, setActiveSection] = useState<any>({})
    const [editSectionModalIsOpen, setEditSectionModalIsOpen] = useState(false)

    const inputRef = useRef<any>();
    const [inputTagFile, setInputTagFile] = useState();
    const dispatch = useDispatch()
    const [activeSubSection, setActiveSubSection] = useState({
        title: '',
        content: '',
        _id: ''
    })
    const [courseInfoData, setCourseInfoData] = useState(course.sections);
    const [currentSection, setCurrentSection] = useState<any>({});
    const [currentSubSection, setCurrentSubSection] = useState<any>({});

    const [generalInfoData, setGeneralInfoData] = useState({
        title: course?.title,
        author: course?.author,
        price: course?.price,
        tags: '',
        description: course?.description,
    })

    const [newSectionData, setNewSectionData] = useState({
        id: uuidv4(),
        title: "",
        sub_sections: []
    })

    const [subSectionData, setSubSectionData] = useState({
        id: uuidv4(),
        title: "",
        content: "",
    });


    const handleChange = (e: any) => {
        switch (e.target.name) {
            case 'courseTitle':
                setGeneralInfoData((prevState: any) => ({
                    ...prevState,
                    title: e.target.value
                }))
                break;
            case 'author':
                setGeneralInfoData((prevState: any) => ({
                    ...prevState,
                    author: e.target.value
                }))
                break;
            case 'price':
                setGeneralInfoData((prevState: any) => ({
                    ...prevState,
                    price: e.target.value
                }))
                break;
            case 'tags':
                setGeneralInfoData((prevState: any) => ({
                    ...prevState,
                    tags: e.target.value
                }))
                break;
            case 'description':
                setGeneralInfoData((prevState: any) => ({
                    ...prevState,
                    description: e.target.value
                }))
                break;

            case "subSectionData":
                setSubSectionData((prevState) => ({
                    ...prevState,
                    title: e.target.value,
                }));
                break;

            default:
                break;
        }
    }


    const handleSubmit = async () => {

        const courseObj = Object.assign({}, course, generalInfoData);

        courseObj.tags = [courseObj.tags];
        


        delete courseObj.certificateId;
        delete courseObj.certificate;


        setIsUpdatingGeneralInfo(true)
        await updateCourse({ token: token, id: courseId, data: courseObj }).then((res) => {
            console.log("res", res)
            notify({ msg: "Course updated", type: 'success' });
        }).catch((error: any) => {
            console.log(error)
            notify({ msg: "An error occured!", type: 'error' });

        }).finally(() => {
            setIsUpdatingGeneralInfo(false)
        })
    }

    const handleCourseUpdate = async () => {
        setIsUpdatingCourseInfo(true);
        const data = {
            sections: courseInfoData
        }

        const courseShallowCopy = Object.assign({}, course, { sections: courseInfoData })

        console.log("data...", courseShallowCopy);



        if (role === Role.superAdmin) {
            try {
                updateCourse({ token, id: courseId, data: courseShallowCopy })
                    .then((res) => notify({ msg: 'Course updated ', type: 'success' }))
                    .catch(err => {
                        notify({ msg: 'An error occued!', type: 'error' })
                    })
            } catch (error) {
                console.log(error)
            } finally {
                setIsUpdatingGeneralInfo(false)
            }
        } else {
            try {
                updateCourseDraft({ token, id: courseId, data: courseShallowCopy })
                    .then((res) => notify({ msg: 'Draft updated ', type: 'success' }))
                    .catch(err => {
                        notify({ msg: 'An error occued!', type: 'error' })
                    })
            } catch (error) {
                console.log(error)
            } finally {
                setIsUpdatingGeneralInfo(false)
                setIsUpdatingCourseInfo(false)
            }
        }




    }

    const deleteSection = () => {
        deleteSectionFromDB({ token, id: currentSection.id })
            .then(() => {
                notify({ msg: "Section deleted!", type: 'success' });
            })
            .catch((err: any) => {
                console.log(err);
                notify({ msg: "An error occured!", type: 'error' });
            }).finally(() => {
                setDeleteModalIsOpen(false);
                const filteredSection = courseInfoData.filter((section: any) => section.id !== currentSection.id);
                setCourseInfoData(filteredSection);
            })
    }

    const handleEditSection = () => {
        const shallowCopyOfSection = activeSection
        const sectionIndex = shallowCopyOfSection.index

        const shallowCopyOfCourseInfoData = courseInfoData

        delete shallowCopyOfSection.title
        delete shallowCopyOfSection.index

        courseInfoData.map((info: any, index: number) => {
            if (index === sectionIndex) {
                shallowCopyOfCourseInfoData[index] = shallowCopyOfSection.section
            }
        })

        setCourseInfoData(shallowCopyOfCourseInfoData)

        setEditSectionModalIsOpen(false)
        setActiveSection({})

    }


    /**
     * 
     * @param sect section
     * @param subSect sub_sections
     */
    const deleteSubSection = () => {

        setDeleteSubSectionModalIsOpen(false);

        console.log("current section...", currentSection.sub_sections);
        console.log("current sub section...", currentSubSection._id);


        const filteredSection = currentSection.sub_sections.filter((ss: any) => ss._id !== currentSubSection._id);

        // console.log("filteredSection...", filteredSection);

        currentSection.sub_sections = filteredSection;

        setCourseInfoData((prevState: any) => {
            const courseIndex = prevState.findIndex((el: any) => el.id === currentSection._id);
            prevState[courseIndex] = currentSection

            return [
                ...prevState,
            ];
        })


    }


    const handleEditSubSection = (e: any) => {
        var transformedObj;

        courseInfoData.map((obj: any) => {
            obj.sub_sections.find((ss: any) => {
                if (ss._id === subSectionData.id) {

                    const filteredData = obj.sub_sections.filter((ss: any) => ss._id === subSectionData.id)[0]
                    const indexToUpdate = obj.sub_sections.findIndex((d: any) => d.id === filteredData.id)

                    console.log(filteredData);
                    console.log(indexToUpdate);

                    if (indexToUpdate !== -1) {
                        // Update the name property of the object at the found index
                        obj.sub_sections[indexToUpdate] = subSectionData;
                        // transformedObj = obj
                        console.log("new obj: ", { obj });

                    }

                }
            })
        })

        setModalIsOpen(false)
        setEditModalIsOpen(false)


    }


    const handleModalSubmit = (e: any) => {
        e.preventDefault();

        setCourseInfoData(courseInfoData.map((obj: any) => {
            console.log({ obj });
            console.log({ currentSection });

            if (obj._id === currentSection._id) {
                // Create a *new* object with changes
                return { ...obj, sub_sections: [...obj.sub_sections, subSectionData] };
            } else {
                // No changes
                return obj;
            }
        }));

        setModalIsOpen(false)
        setEditModalIsOpen(false)

    }


    const createNewSection = () => {
        setNewSectionModalIsOpen(true)
    }

    const handleCoursePreview = () => {
        dispatch(setSection(courseInfoData))
        // console.log("sections...", courseInfoData);

        router.push(`/admin/courses/preview`)
    }

    const addNewSection = () => {
        setCourseInfoData((prevState: any) => ([
            ...prevState,
            newSectionData
        ]))

        setNewSectionModalIsOpen(false);
        setNewSectionData({ id: uuidv4(), title: "", sub_sections: [] });
    }


    if (isFetchingCategories) {
        return <Loader />
    }

    console.log("courseInfoData...", courseInfoData);



    return (
        <Layout>
            <ToastContainer />
            <div className="p-4 mt-8">
                <div className='flex items-center gap-1 mb-2' onClick={() => router.back()}>
                    <div className='w-8 h-8 bg-white border flex justify-center items-center rounded-full cursor-pointer'>
                        <IoChevronBack size={20} />
                    </div>
                    <p>Back</p>
                </div>
                <h1 className='text-2xl md:text-4xl font-semibold'>Edit Course</h1>
                <p>Course: {course?.title}</p>

                <div className=' h-fit bg-white rounded border mt-4'>
                    <div className='px-4 py-2 border-b'>
                        <p className=''>General Information</p>
                    </div>

                    <div className='px-4 my-8 space-y-3'>
                        <CustomInput label='Course title' type='text' name='courseTitle' value={generalInfoData.title} onChange={handleChange} />

                        <div className='grid grid-cols-2 gap-4'>
                            <CustomInput label='Author' type='text' name='author' value={generalInfoData.author} onChange={handleChange} />
                            {/* <CustomInput label='Price' type='text' name='price' value={generalInfoData.price} onChange={handleChange} /> */}
                            <div>
                                <label htmlFor="countries" className="block text-black">Category</label>
                                <select id="countries" className="bg-white border-2 text-gray-900 rounded focus:ring-blue-500 outline-blue-500 focus:border-blue-500 block w-full p-2.5" name='tags' value={generalInfoData.tags} onChange={handleChange}>
                                    <option>Choose a category</option>
                                    {categories?.data.map((category: any) => {
                                        if (category.group === "course") {
                                            return (
                                                <option value={category.name} key={Math.random()}>{category.name}</option>
                                            )
                                        }
                                    })}
                                </select>

                            </div>
                        </div>

                        <div className=''>
                            <label htmlFor="message" className="block font-medium text-gray-900">Description</label>
                            <textarea id="message" rows={4} className="block p-2.5 w-full text-gray-900 bg-white rounded outline-blue-500 focus:ring-blue-500 focus:border-blue-500 border-2" placeholder="Write your thoughts here..." name='description' value={generalInfoData.description} onChange={handleChange}></textarea>
                        </div>



                    </div>
                    <div className='border-t px-4 pb-4'>
                        <button
                            className='bg-[#11393C] px-4 py-2 rounded text-white mt-4 flex'
                            onClick={handleSubmit}>
                            {isUpdatingGeneralInfo && <Spinner />} Save Changes
                        </button>

                    </div>
                </div>


                <div className=' h-fit bg-white rounded border mt-10'>
                    <div className='px-4 py-2 border-b flex justify-between items-center'>
                        <p >Course Information</p>


                        <div className='space-x-4'>
                            <button className='px-4 py-2 border rounded' onClick={() => handleCoursePreview()}>Preview</button>
                            <button className='px-4 py-2 border rounded' onClick={() => createNewSection()}>New section</button>
                        </div>
                    </div>

                    <div className='px-4 my-8 space-y-3'>
                        {courseInfoData.map((section: any, index: number) => {
                            return (
                                <div key={Math.random()}>
                                    <div className='flex items-center gap-1'>
                                        <div className='flex items-center w-full relative border rounded bg-white  justify-between px-3'>
                                            <div className='px-4 py-4 rounded'>
                                                <p className=''>{section.title}</p>
                                            </div>

                                            <span className='text-sm px-2 py border rounded-full bg-gray-50 -top-2 absolute'>Section</span>

                                        </div>
                                        <div className='flex  items-center gap-2'>
                                            <TbPencil
                                                size={20}
                                                className='cursor-pointer ml-3'
                                                onClick={() => {
                                                    setActiveSection({ section, index })
                                                    setEditSectionModalIsOpen(true)
                                                }} />

                                            <IoAddCircle size={20}
                                                className='-rotate-180 ml-4 cursor-pointer' onClick={() => {
                                                    setCurrentSection(section)
                                                    setModalIsOpen(true);
                                                }

                                                } />
                                            <TbTrash size={20} className='cursor-pointer ml-3' onClick={() => {
                                                setCurrentSection(section)
                                                setDeleteModalIsOpen(true)
                                            }} />
                                        </div>
                                    </div>
                                    <div>
                                        {section.sub_sections.map((ss: any) => {
                                            return (
                                                <div className='flex items-center mt-4 ' key={Math.random()}>
                                                    <div className='w-[80%] px-4 py-3 flex  justify-between relative ml-auto rounded bg-gray-50 my-2 s' >

                                                        <span className='ml-2'>
                                                            {ss.title}
                                                        </span>
                                                        {/* <span className='ml-2'>
                                                            {ss.id}
                                                        </span> */}
                                                        <span className='text-sm px-2 py border rounded-full bg-white -top-2 absolute'>Sub-Section</span>
                                                    </div>



                                                    <TbPencil size={20} className='cursor-pointer ml-3' onClick={() => {
                                                        setActiveSubSection(ss)
                                                        setEditModalIsOpen(true)
                                                    }} />

                                                    <TbTrash
                                                        className='ml-3 cursor-pointer'
                                                        size={20}
                                                        onClick={() => {
                                                            setCurrentSection(section);
                                                            setCurrentSubSection(ss);
                                                            setDeleteSubSectionModalIsOpen(true);
                                                        }}
                                                    />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}


                    </div>

                    <div className='border-t px-4 pt-1 pb-4'>
                        <button
                            className='bg-[#11393C] px-4  rounded text-white mt-2 py-2 flex'
                            onClick={handleCourseUpdate}>
                            {isUpdatingCourseInfo && <Spinner />} Save Changes
                        </button>
                    </div>

                </div>

                {editSectionModalIsOpen && <ReactPortal>
                    <Modal>
                        <div>
                            <label>Edit Section Title</label>
                            <textarea id="message" rows={4} className="block p-2.5 w-full text-gray-900 bg-white rounded outline-blue-500 focus:ring-blue-500 focus:border-blue-500 border-2" placeholder="Write your thoughts here..." value={activeSection.section.title}
                                onChange={(e) => {
                                    setActiveSection((prevState: any) => ({
                                        ...prevState,
                                        section: {
                                            ...prevState.section,
                                            title: e.target.value
                                        }
                                    }))
                                }}></textarea>

                            <div>
                                <div className='mt-4 flex items-center space-x-2'>
                                    <button className='border px-4 py-2 w-[50%]  text-black  rounded' onClick={() => {
                                        setEditSectionModalIsOpen(false)
                                        setActiveSection({})
                                    }

                                    }>Cancel</button>
                                    <button
                                        className='border px-4 py-2  w-[50%] text-black  rounded'
                                        onClick={handleEditSection}
                                    >Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </Modal></ReactPortal>}

                {deleteModalIsOpen && <ReactPortal>
                    <Modal>
                        <IoWarning size={40} className='mx-auto' />
                        <div className='text-center'>
                            <p>Are you sure you want to delete ?</p>
                            <p className='text-gray-600 text-sm'>This action cannot be undone</p>

                            <div className='mt-4 flex w-fit mx-auto'>
                                <button className='border px-3 mr-4 flex items-center gap-1 py-2 rounded' onClick={deleteSection}>
                                    {deleteMutationStatus.isLoading && <Spinner />} Delete</button>
                                <button className='border px-3 py-2 rounded' onClick={() => setDeleteModalIsOpen(false)}>Cancel</button>
                            </div>
                        </div>
                    </Modal>
                </ReactPortal>}


                {deleteSubSectionModalIsOpen && <ReactPortal>
                    <Modal>
                        <IoWarning size={40} className=' mx-auto' />
                        <div className='text-center'>
                            <p>Are you sure you want to delete ?</p>
                            <p className='text-gray-600 text-sm'>This action cannot be undone</p>

                            <div className='mt-4 flex mx-auto text-center gap-2'>
                                <button className='border w-[100%] px-3 py-2 rounded' onClick={deleteSubSection}>
                                    {deleteSubSectionMutationStatus.isLoading && <Spinner />} Delete</button>
                                <button className='border w-[100%] px-3 py-2 rounded' onClick={() => setDeleteSubSectionModalIsOpen(false)}>Cancel</button>
                            </div>
                        </div>
                    </Modal>
                </ReactPortal>}

                {modalIsOpen &&
                    <ReactPortal>
                        <div className="h-screen w-screen bg-black opacity-60 fixed z-50 top-0 flex justify-center items-center transition duration-75"></div>
                        <div className="h-screen w-screen bg-transparent fixed top-0 z-[100] flex items-center justify-center transition duration-75">
                            <div className="w-[90%] h-fit sm:w-[90%] sm:h-[fit] z-[100] bg-[#fff] rounded shadow-md p-4 transition duration-75">
                                <div className=' w-fit ml-auto space-x-4'>
                                    <button className='py-1 px-4 border rounded' onClick={(e) => handleModalSubmit(e)}>Save changes</button>
                                    <button className='py-1 px-4 border rounded' onClick={() => {
                                        setSubSectionData({
                                            id: uuidv4(),
                                            title: "",
                                            content: "",
                                        });
                                        setFilesSelected([]);
                                        setModalIsOpen(false);
                                    }}>Close</button>
                                </div>

                                <div className='mt-6'>
                                    <ReactQuillEditor

                                        onChange={(value: any) => {
                                            const [title, content] = seperateBlogDataIntoComponents(value as string);

                                            setSubSectionData((prevState: any) => ({
                                                title: title,
                                                content: value,
                                                id: prevState?.id
                                            }))

                                        }
                                        }
                                    />
                                </div>
                            </div>



                        </div>
                    </ReactPortal>
                }


                {editModalIsOpen &&
                    <ReactPortal>
                        <div className="h-screen w-screen bg-black opacity-60 fixed z-50 top-0 flex justify-center items-center transition duration-75"></div>
                        <div className="h-screen w-screen bg-transparent fixed top-0 z-[100] flex items-center justify-center transition duration-75">
                            <div className="w-[90%] h-fit sm:w-[90%] sm:h-[fit] z-[100] bg-[#fff] rounded shadow-md p-4 transition duration-75">
                                <div className=' w-fit ml-auto space-x-4'>
                                    <button className='py-1 px-4 border rounded' onClick={(e) => handleEditSubSection(e)}>Save changes</button>
                                    <button className='py-1 px-4 border rounded' onClick={() => {
                                        setActiveSubSection({ title: '', content: '', _id: '' });
                                        setEditModalIsOpen(false);
                                    }}>Close</button>
                                </div>

                                <div className='mt-6'>
                                    <ReactQuillEditor
                                        value={activeSubSection?.content}
                                        onChange={(value: any) => {
                                            const [title, content] = seperateBlogDataIntoComponents(value as string);
                                            setSubSectionData((prevState) => ({
                                                title,
                                                content: value,
                                                id: activeSubSection?._id
                                            }))
                                        }

                                        }
                                    />
                                </div>
                            </div>



                        </div>
                    </ReactPortal>
                }


                {newSectionModalIsOpen &&
                    <ReactPortal>
                        <Modal>
                            <div className="flex justify-between border-b pb-2">
                                <h3 className="text-base font-normal">Create new section</h3>

                                <div
                                    className="w-6 h-6 border rounded-full flex items-center justify-center cursor-pointer"
                                    onClick={() => {
                                        setNewSectionModalIsOpen(false);
                                    }}
                                >
                                    <AiOutlineClose size={12} />
                                </div>
                            </div>

                            <div className='mt-4'>
                                <CustomInput label='Name of section' type='text' name='author' value={newSectionData.title} onChange={(e: any) => {
                                    setNewSectionData((prevState: any) => ({
                                        ...prevState,
                                        title: e.target.value
                                    }))
                                }} />
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button
                                    className="py-3 w-[100%] border px-4 rounded "
                                    onClick={(e) => addNewSection()}
                                >
                                    Submit
                                </button>
                                <button
                                    className="py-3 w-[100%] border px-4 rounded"
                                    onClick={() => {
                                        setSubSectionData({ title: "", content: "", id: uuidv4() });
                                        setNewSectionModalIsOpen(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </Modal>


                    </ReactPortal>
                }

                {/* {deleteSectionModalIsOpen && <ReactPortal>
                    <Modal>
                        <div className="flex justify-between border-b pb-2">
                            <h3 className="text-base font-normal">Create new section</h3>

                            <div
                                className="w-6 h-6 border rounded-full flex items-center justify-center cursor-pointer"
                                onClick={() => {
                                    setNewSectionModalIsOpen(false);
                                }}
                            >
                                <AiOutlineClose size={12} />
                            </div>
                        </div>
                    </Modal>
                </ReactPortal>} */}
            </div>
        </Layout>
    )
}

export default EditSingleCourse

// This value is considered fresh for ten seconds (s-maxage=10).
// If a request is repeated within the next 10 seconds, the previously
// cached value will still be fresh. If the request is repeated before 59 seconds,
// the cached value will be stale but still render (stale-while-revalidate=59).
//
// In the background, a revalidation request will be made to populate the cache
// with a fresh value. If you refresh the page, you will see the new value.
export async function getServerSideProps({ req, res }: any) {
    const paramsArr = req.url.split("/");
    

    const course = paramsArr[paramsArr.length - 1].split(".")[0];
    const courseId = course?.split("?")[0]
    const params = course?.split("?")[1]

    var url;

    if (params.includes("admin=true")) {
        url = `/get-course-by-id?id=${courseId}`
    } else {
        url = `/get-course-by-id?id=${courseId}`
    }


    const response = await http.get(url);
    console.log("response...", response.data.data);


    return {
        props: { course: response.data.data },
    };
}

