import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import CustomInput from '@/components/CustomInput';
import Loader from '@/components/Loader';
import Layout from '@/components/admin/Layout'
import { useDeleteSectionMutation, useDeleteSubSectionMutation, useFetchCategoriesQuery, useFetchSingleCourseQuery, useUpdateCourseDraftMutation, useUpdateCourseMutation } from '@/features/apiSlice'
import { useRouter } from 'next/router'
import { IoAddCircle, IoChevronBack, IoClose, IoCloseCircleOutline, IoTrash, IoWarning } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { extractListItems, getSingleCourse, seperateBlogDataIntoComponents } from '@/helper';
import Spinner from '@/components/Spinner';
import http from '@/lib/http';
import { TbDragDrop, TbEdit, TbEditCircle, TbEye, TbPencil, TbPlus, TbSubtask, TbTrash, TbWriting } from 'react-icons/tb';
import ReactPortal from '@/components/ReactPortal';
import Modal from '@/components/Modal';
import { AiOutlineClose, AiOutlineDelete } from 'react-icons/ai';
import notify from '@/components/Notification';
import { ToastContainer } from 'react-toastify';
import useRole from '@/hooks/useRole';
import dynamic from 'next/dynamic';
import edjsParser from "editorjs-parser";
import { Role } from '../../../../../types/types';
import { MdOutlineDragIndicator } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { setSection } from '@/features/sections/sectionsSlice'
import DynamicPricingInput from '@/components/admin/DynamicPricingInput';
import useCookie from '@/hooks/useCookie';
import Image from 'next/image';
import axios from 'axios';


const parser = new edjsParser();
const ReactQuillEditor = dynamic(() => import("../../../../components/admin/Editor"), { ssr: false });

interface SubSection {
    title: string;
    content: string;
    _id?: string; // Make it optional with '?'
}

function EditSingleCourse({ course }: any) {
    const router = useRouter();
    const role = useRole();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newSectionModalIsOpen, setNewSectionModalIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [deleteSubSectionModalIsOpen, setDeleteSubSectionModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false)
    const [filesSelected, setFilesSelected] = useState<any>([]);
    const cookie = useCookie()

    const courseId = router.query.id;
    const headerImageInputRef = useRef<any>();
    const [headerImageFile, setHeaderImageFile] = useState();


    const { data: categories, isLoading: isFetchingCategories } = useFetchCategoriesQuery({ group: 'course' });
    const [isUpdatingGeneralInfo, setIsUpdatingGeneralInfo] = useState(false);
    const [isUpdatingCourseInfo, setIsUpdatingCourseInfo] = useState(false);
    const { "0": updateCourse } = useUpdateCourseMutation();
    const { "0": updateCourseDraft } = useUpdateCourseDraftMutation();
    const { "0": deleteSectionFromDB, "1": deleteMutationStatus } = useDeleteSectionMutation();
    const { "0": deleteSubSectionFromDB, "1": deleteSubSectionMutationStatus } = useDeleteSubSectionMutation();
    const [activeSection, setActiveSection] = useState<any>({})
    const [editSectionModalIsOpen, setEditSectionModalIsOpen] = useState(false)
    const [cloudinaryURL, setCloudinaryURL] = useState("");
    const [removeHeaderImage, setRemoveHeaderImage] = useState(false)
    const inputRef = useRef<any>();
    const [inputTagFile, setInputTagFile] = useState();
    const dispatch = useDispatch()
    const [activeSubSection, setActiveSubSection] = useState<SubSection>({
        title: '',
        content: '',
        _id: '',
    })
    const [fileSelectedForHeaderImage, setFileSelectedForHeaderImage] = useState<any>([]);
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [courseInfoData, setCourseInfoData] = useState(course.sections);
    const [currentSection, setCurrentSection] = useState<any>({});
    const [currentSubSection, setCurrentSubSection] = useState<any>({});
    const [objective, setObjective] = useState('')
    const [editObjectiveModalIsOpen, setEditObjectiveModalIsOpen] = useState(false)
    const [activeObjective, setActiveObjective] = useState<any>({})
    const [generalInfoData, setGeneralInfoData] = useState({
        title: course?.title,
        author: course?.author,
        header_image: course?.header_image,
        // prices: course?.prices,
        tags: '',
        category: course?.category,
        description: course?.description,
        summary: course?.summary,
        objectives: extractListItems(course.objectives) || []
    })

    const dragItemRef = useRef(null)
    const dragItemOverRef = useRef(null);

    const handleDragStart = (e: any, item: any) => {
        dragItemRef.current = item
    }

    function handleHeaderImageInputChange(e: any) {
        setIsUploadingImage(true);

        const file = headerImageInputRef.current.files[0];
        const reader = new FileReader();


        reader.readAsText(file);

        reader.onloadend = async (e: any) => {
            //Here the content has been read successfuly
            setFileSelectedForHeaderImage((prevState: any) => [...prevState, file]);

            await imageUpload(file).then((res) => {
                setGeneralInfoData((prevState) => ({
                    ...prevState,
                    header_image: res
                }))

                setRemoveHeaderImage(false)

            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                setIsUploadingImage(false)
            })

        };
    }


    const handleDragOver = (e: any, item: any) => {
        dragItemOverRef.current = item
    }

    function dropHandler(e: any) {
        // Prevent default behavior (Prevent file from being opened)
        e.preventDefault();

        if (e.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            [...e.dataTransfer.items].forEach((item, i) => {
                // If dropped items aren't files, reject them
                if (item.kind === "file") {
                    const file = item.getAsFile();

                    setFilesSelected((prevState: any) => [...prevState, file]);
                }
            });
        } else {
            // Use DataTransfer interface to access the file(s)
            [...e.dataTransfer.files].forEach((file, i) => {

                setFilesSelected((prevState: any) => [...prevState, file]);
            });
        }
    }

    function dragOverHandler(e: React.FormEvent) {
        e.preventDefault();
    }

    const imageUpload = async (img: any) => {


        var url = ""
        const formData = new FormData()
        formData.append("file", img)
        formData.append("upload_preset", "hqdnnphw");

        await axios.post("https://api.cloudinary.com/v1_1/dgn6edv1k/image/upload", formData)
            .then((response: any) => {
                url = response.data.secure_url
                setCloudinaryURL(response.data.secure_url)
            }).catch((err: any) => {

            })
            .finally(() => {

            })

        return url
    }

    const handleDrop = () => {
        // Make a shallow copy of sub_sections from activeSection
        const shallowCopyOfActiveSections = Object.assign({}, activeSection);

        // Make a shallow copy of sub_sections from activeSection
        const shallowCopyOfSubSections = [...activeSection?.sub_sections || []];

        // Find the index of the dragged item and the item being dragged over
        const indexOfDraggedItem = shallowCopyOfSubSections.indexOf(dragItemRef.current);
        const indexOfDraggedOverItem = shallowCopyOfSubSections.indexOf(dragItemOverRef.current);

        // Remove the dragged item from the array
        const foundDraggedItem = shallowCopyOfSubSections.splice(indexOfDraggedItem, 1)[0];

        // Insert the dragged item at the new position
        shallowCopyOfSubSections.splice(indexOfDraggedOverItem, 0, foundDraggedItem);

        // Clear drag references
        dragItemOverRef.current = null;
        dragItemRef.current = null;


        shallowCopyOfActiveSections.sub_sections = shallowCopyOfSubSections


        // Find the index of the activeSection in courseInfoData
        const indexOfActiveSection = courseInfoData.findIndex((course) => course.title === shallowCopyOfActiveSections.title);

        // Create a shallow copy of courseInfoData and update the activeSection
        const shallowCopyOfCourseInfoData = [...courseInfoData];
        shallowCopyOfCourseInfoData[indexOfActiveSection] = shallowCopyOfActiveSections;

        // Update courseInfoData
        setCourseInfoData(shallowCopyOfCourseInfoData);

        // Clear activeSection
        setActiveSection({});
    };



    const [newSectionData, setNewSectionData] = useState({
        id: uuidv4(),
        title: "",
        sub_sections: []
    })

    const [subSectionData, setSubSectionData] = useState({
        _id: uuidv4(),
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
            // case 'prices':
            //     setGeneralInfoData((prevState: any) => ({
            //         ...prevState,
            //         prices: e.target.value
            //     }))
            //     break;
            case 'tags':
                setGeneralInfoData((prevState: any) => ({
                    ...prevState,
                    tags: e.target.value
                }))
                break;
            case 'category':
                setGeneralInfoData((prevState: any) => ({
                    ...prevState,
                    category: e.target.value
                }))
                break;
            case 'description':
                setGeneralInfoData((prevState: any) => ({
                    ...prevState,
                    description: e.target.value
                }))
                break;
            case 'summary':
                setGeneralInfoData((prevState: any) => ({
                    ...prevState,
                    summary: e.target.value
                }))
                break;

            case "subSectionData":
                setSubSectionData((prevState) => ({
                    ...prevState,
                    title: e.target.value,
                }));
                break;
            case 'objectives':
                setGeneralInfoData((prevState: any) => ({
                    ...prevState,
                    objectives: [...prevState.objectives, objective]
                }))
                break;

            default:
                break;
        }
    }

    const handleEditObjective = () => {

        var arr: any[] = []

        generalInfoData.objectives.map((objective: any, index: number) => {
            if (index === activeObjective.index) {
                arr.push(activeObjective.objective)
            } else {
                arr.push(objective)
            }
        })

        setGeneralInfoData((prevState: any) => ({
            ...prevState,
            objectives: arr
        }))

        setEditObjectiveModalIsOpen(false)

    }

    function arrayToHTMLList(array: any[]) {
        const listItems = array.map((item: string) => `<li key={${Math.random()}}>${item}</li>`).join('');
        return `<ul>${listItems}</ul>`;
    }


    const handleSubmit = async () => {

        const courseObj = Object.assign({}, course, generalInfoData);



        courseObj.tags = [courseObj.tags];



        delete courseObj.certificateId;
        delete courseObj.certificate;

        const parsedObjectives = arrayToHTMLList(generalInfoData.objectives)

        courseObj.objectives = parsedObjectives

        setIsUpdatingGeneralInfo(true)
        await updateCourse({ token: cookie?.user?.accessToken, id: courseId, data: courseObj }).then((res) => {
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
        console.log('Yeah');

        setIsUpdatingCourseInfo(true);
        const data = {
            sections: courseInfoData
        }

        const courseShallowCopy = Object.assign({}, course, { sections: courseInfoData })

        try {
            updateCourseDraft({ token: cookie?.user?.accessToken, id: courseId, data: courseShallowCopy })
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

    const deleteSection = () => {
        deleteSectionFromDB({ token: cookie?.user?.accessToken, id: currentSection.id })
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

    const handleDeleteObjective = (selectedObjective: string) => {

        if (generalInfoData.objectives.length === 0) return;
        if (typeof generalInfoData.objectives === null) return;

        const filteredObjectives = generalInfoData.objectives.filter((objective: any) => objective !== selectedObjective)

        setGeneralInfoData((prevState: any) => ({
            ...prevState,
            objectives: filteredObjectives
        }))

        notify({ msg: 'Objective deleted', type: 'success' })
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


            // if (obj._id === currentSection._id || obj.id === currentSection.id) {
            if (obj._id === currentSection._id) {
                // console.log("yesh");
                // console.log({ obj });
                // console.log({ currentSection });

                obj.sub_sections.find((ss: any, index: number) => {
              

                    if (ss.id === activeSubSection._id) {
                        // console.log({ index });
                        // console.log({ ss });
                        // console.log({ activeSubSection });


                        // console.log("Yesh");
                        // console.log({ ss, activeSubSection });

                        // const filteredData = obj.sub_sections.filter((ss: any) => ss._id === activeSubSection._id)[0]
                        // // const filteredData = obj.sub_sections.filter((ss: any) => ss._id === activeSubSection.id || ss.id === activeSubSection.id)[0]
                        // console.log({ filteredData });


                        // const indexToUpdate = obj.sub_sections.map((d: any, index) => {

                        //     if (d._id === activeSubSection._id) {
                        //        return index
                        //     }
                        // })




                        // const indexToUpdate = obj.sub_sections.map((sub_section, index) => {
                        // console.log({ activeSubSection, sub_section });


                        //     if (sub_section._id === activeSubSection._id) {
                        //         console.log({ index });

                        //     }
                        // });



                        console.log({ index });


                        // if (indexToUpdate !== -1) {

                            const newObj = Object.assign({}, { ...activeSubSection })
                            obj.sub_sections[index] = newObj;

                        // }

                    }
                    // else if (ss.id === activeSubSection.id) {
                    //     console.log({ ss, activeSubSection });


                    //     const filteredData = obj.sub_sections.filter((ss: any) => ss.id === activeSubSection._id)[0]
                    //     const indexToUpdate = obj.sub_sections.findIndex((d: any) => d.id === filteredData.id)

                    //     if (indexToUpdate !== -1) {

                    //         const newObj = Object.assign({}, { ...activeSubSection })
                    //         obj.sub_sections[indexToUpdate] = newObj;
                    //     }

                    // } else {
                    //     null
                    // }
                })
            }
        })

        setModalIsOpen(false)
        setEditModalIsOpen(false)
        setCurrentSection(null)
        setActiveSubSection({
            content: '',
            title: '',
            _id: ''
        })


    }


    const handleModalSubmit = (e: any) => {
        e.preventDefault();

        setCourseInfoData(courseInfoData.map((obj: any) => {
            console.log({ obj, currentSection });

            if (obj._id === currentSection._id) {
                // Create a *new* object with changes
                return { ...obj, sub_sections: [...obj.sub_sections, { ...subSectionData, id: uuidv4() }] };
            }

            else {
                // No changes
                return obj;
            }
        }));



        setModalIsOpen(false)
        setEditModalIsOpen(false)
        setCurrentSection(null)

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

    return (
        <div>
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
                            {removeHeaderImage ?

                                <div>
                                    <p>Upload header image</p>
                                    <div className="max-w-xl">
                                        <label
                                            className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                                            id="drop-zone"
                                            onDrop={dropHandler}
                                            onDragOver={dragOverHandler}
                                        >
                                            <span className="flex flex-col justify-center items-center space-x-2">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-6 h-6 text-gray-600 "
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                    />
                                                </svg>
                                                <p className="font-medium text-[#F08354]">
                                                    Select a file to upload
                                                </p>
                                                <span className="text-gray-600 text-sm">
                                                    or drag and drop it here
                                                </span>
                                            </span>
                                            <input
                                                type="file"
                                                name="file_upload"
                                                className="hidden"
                                                ref={headerImageInputRef}
                                                value={headerImageFile}
                                                onChange={handleHeaderImageInputChange}
                                            />
                                        </label>
                                    </div>
                                    {isUploadingImage && <p className='mt-2'>status: uploading image</p>}

                                    {fileSelectedForHeaderImage?.map((f: any) => (
                                        <div key={Math.random()} className="flex justify-between py-3 items-center px-2">
                                            <p className="truncate overflow-hidden text-sm border bg-gray-100 p-1 w-fit rounded-md flex gap-8 items-center">{f.name}

                                                <TbTrash className='cursor-pointer' onClick={() => {
                                                    setCloudinaryURL('')
                                                    setFileSelectedForHeaderImage([])
                                                }} />

                                            </p>


                                        </div>
                                    ))}
                                </div>

                                :
                                <div className="flex lg:h-[350px] h-[200px] flex-col bg-white rounded overflow-hidden mb-10" onClick={() => setRemoveHeaderImage(true)}>
                                    <figure className="relative h-0 pb-[56.25%] overflow-hidden">
                                        <Image className="absolute inset-0 w-full h-full object-cover bg-bottom transform transition duration-700 ease-out" src={generalInfoData.header_image} width="700" height="1000" alt="Course" priority={true} />
                                    </figure>

                                    <div className='absolute cursor-pointer w-[50px] h-[50px] flex justify-center items-center bg-slate-500/20 right-12 translate-y-5 rounded'>
                                        <IoClose size={30} />
                                    </div>
                                </div>
                            }


                            <CustomInput label='Course title' type='text' name='courseTitle' value={generalInfoData.title} onChange={handleChange} />

                            <div className='grid grid-cols-2 gap-4'>
                                <CustomInput label='Author' type='text' name='author' value={generalInfoData.author} onChange={handleChange} />
                                {/* <CustomInput label='Price' type='text' name='price' value={generalInfoData.price} onChange={handleChange} /> */}
                                <div>
                                    <label htmlFor="countries" className="block text-black">Category</label>
                                    <select id="countries" className="bg-white border-2 text-gray-900 rounded focus:ring-blue-500 outline-blue-500 focus:border-blue-500 block w-full p-2.5" name='category' value={generalInfoData.category} onChange={handleChange}>
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


                            {/* <div className='mt-8'>
                            <p>Prices</p>
                            <div className='col-span-2 space-y-2'>
                                {course.prices.map((price: any) => {
                                    return (
                                        <DynamicPricingInput price={price} placeholder="" onChange={handlePriceChange} />
                                    )
                                })}
                        
                            </div>
                        </div> */}

                            <div className=''>
                                <label htmlFor="message" className="block font-medium text-gray-900">Description</label>
                                <textarea id="message" rows={4} className="block p-2.5 w-full text-gray-900 bg-white rounded outline-blue-500 focus:ring-blue-500 focus:border-blue-500 border-2" placeholder="Write your thoughts here..." name='description' value={generalInfoData.description} onChange={handleChange}></textarea>
                            </div>

                            <div className=''>
                                <label htmlFor="message" className="block font-medium text-gray-900">Summary</label>
                                <textarea id="message" rows={4} className="block p-2.5 w-full text-gray-900 bg-white rounded outline-blue-500 focus:ring-blue-500 focus:border-blue-500 border-2" placeholder="Write your thoughts here..." name='description' value={generalInfoData.summary} onChange={handleChange}></textarea>
                            </div>

                            <div className=''>
                                <p>Objectives</p>
                                <div className='flex gap-2 w-full'>
                                    <div className='w-full'>
                                        <CustomInput
                                            label=''
                                            type='text'
                                            value={objective}
                                            onChange={(e: any) => setObjective(e.target.value)}

                                        />
                                    </div>
                                    <button className='border-2 px-4 py-2 rounded' name='objectives' onClick={(e: any) => {
                                        handleChange(e)
                                        setObjective('')
                                    }}>Add</button>
                                </div>
                                <ul className='mt-3'>
                                    {generalInfoData?.objectives?.map((objective: any, index: number) => {
                                        return (
                                            <li key={Math.random()} className='py-2 border px-4 my-2 rounded flex justify-between'>

                                                {objective}

                                                <span className='flex gap-4'>
                                                    <TbPencil size={20} className='cursor-pointer' onClick={() => {
                                                        setActiveObjective({ objective, index })
                                                        setEditObjectiveModalIsOpen(!editObjectiveModalIsOpen)
                                                    }

                                                    } />
                                                    <TbTrash size={20} className='cursor-pointer' onClick={() => handleDeleteObjective(objective)} />
                                                </span>
                                            </li>
                                        )
                                    })}


                                </ul>
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
                            {courseInfoData.map((section: any, index: number) => (
                                <div key={Math.random()}>
                                    <div className='flex items-center gap-1'>
                                        <div className='flex items-center w-full relative border rounded bg-white justify-between px-3'>
                                            <div className='px-4 py-4 rounded'>
                                                <p className=''>{section.title}</p>
                                            </div>
                                            <span className='text-sm px-2 py border rounded-full bg-gray-50 -top-2 absolute'>Section</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <TbPencil
                                                size={20}
                                                className='cursor-pointer ml-3'
                                                onClick={() => {
                                                    setActiveSection({ section, index });
                                                    setEditSectionModalIsOpen(true);
                                                }}
                                            />
                                            <IoAddCircle
                                                size={20}
                                                className='-rotate-180 ml-4 cursor-pointer'
                                                onClick={() => {
                                                    setCurrentSection(section);
                                                    setModalIsOpen(true);
                                                }}
                                            />
                                            <TbTrash
                                                size={20}
                                                className='cursor-pointer ml-3'
                                                onClick={() => {
                                                    setCurrentSection(section);
                                                    setDeleteModalIsOpen(true);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        {section.sub_sections.map((ss: any) => (
                                            <div
                                                className='flex items-center gap-2 justify-end hover:cursor-move'
                                                key={ss.id}
                                                onDragStart={(e: any) => {
                                                    setActiveSection(section);
                                                    handleDragStart(e, ss);
                                                }}
                                                onDragOver={(e: any) => handleDragOver(e, ss)}
                                                onDragEnd={handleDrop}
                                                draggable>

                                                <MdOutlineDragIndicator size={20} className='text-gray-400' />
                                                <div
                                                    className='flex items-center mt-4 w-full '

                                                >

                                                    <div className='w-[100%] px-4 py-3 flex justify-between relative ml-auto rounded bg-gray-100 my-2 border'>
                                                        <span className='ml-2'>{ss.title}</span>

                                                        <span className='text-sm px-2 py border rounded-full bg-white -top-2 absolute'>Sub-Section</span>
                                                    </div>
                                                    <TbPencil
                                                        size={20}
                                                        className='cursor-pointer ml-3'
                                                        onClick={() => {
                                                            setCurrentSection(section)
                                                            setActiveSubSection({
                                                                content: ss.content,
                                                                title: ss.title,
                                                                _id: ss.id
                                                            });
                                                            setEditModalIsOpen(true);
                                                        }}
                                                    />
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
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>


                        <div className='border-t px-4 pt-1 pb-4'>
                            <button
                                className='bg-[#11393C] px-4  rounded text-white mt-2 py-2 flex'
                                onClick={handleCourseUpdate}>
                                {isUpdatingCourseInfo && <Spinner />} Save Changes
                            </button>
                        </div>

                    </div>

                    {editObjectiveModalIsOpen && <ReactPortal>
                        <Modal>
                            <div>
                                <label>Objective</label>
                                <textarea id="message" rows={4} className="block p-2.5 w-full text-gray-900 bg-white rounded outline-blue-500 focus:ring-blue-500 focus:border-blue-500 border-2" placeholder="Write your thoughts here..." value={activeObjective.objective}
                                    onChange={(e) => {
                                        setActiveObjective((prevState: any) => ({
                                            ...prevState,
                                            objective: e.target.value
                                        }))
                                    }}></textarea>

                                <div>
                                    <div className='mt-4 flex items-center space-x-2'>
                                        <button className='border px-4 py-2 w-[50%]  text-black  rounded' onClick={() => {
                                            setEditObjectiveModalIsOpen(false)
                                            setActiveObjective({})
                                        }

                                        }>Cancel</button>
                                        <button className='border px-4 py-2  w-[50%] text-black  rounded' onClick={handleEditObjective}>Save Changes</button>
                                    </div>
                                </div>
                            </div>
                        </Modal></ReactPortal>}

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
                                <div className="w-[100%] h-fit sm:w-screen xl:-translate-x-4 sm:h-screen overflow-y-scroll z-[100] bg-[#fff] shadow-md p-4 transition duration-75">
                                    <div className=' w-fit ml-auto space-x-4 py-4'>
                                        <button className='py-1 px-4 border rounded' onClick={(e) => handleModalSubmit(e)}>Save changes</button>
                                        <button className='py-1 px-4 border rounded' onClick={() => {
                                            setSubSectionData({
                                                _id: uuidv4(),
                                                title: "",
                                                content: "",
                                            });
                                            setFilesSelected([]);
                                            setModalIsOpen(false);
                                        }}>Close</button>
                                    </div>

                                    <div className='mt-6 xl:w-[60%] w-[100%] mx-auto'>
                                        <ReactQuillEditor

                                            onChange={(value: any) => {
                                                const [title, content] = seperateBlogDataIntoComponents(value as string);

                                                setSubSectionData((prevState: any) => ({
                                                    ...prevState,
                                                    title: title,
                                                    content: value,
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
                            <div className="h-screen w-screen bg-black opacity-60 fixed z-50 top-0 flex justify-center items-center transition duration-75 overflow-auto"></div>
                            <div className="h-screen w-screen bg-transparent fixed top-0 z-[100] transition duration-75">
                                <div className="w-[100%] h-fit sm:w-screen xl:-translate-x-4 sm:h-screen overflow-y-scroll z-[100] bg-[#fff] shadow-md p-4 transition duration-75">
                                    <div className=' w-fit ml-auto space-x-4 px-4'>
                                        <button
                                            className='py-1 px-4 border rounded'
                                            onClick={() => router.push({
                                                pathname: '/admin/courses/preview/sub-section',
                                                query: {
                                                    content: activeSubSection?.content
                                                }
                                            })}>Preview</button>
                                        <button className='py-1 px-4 border rounded' onClick={(e) => handleEditSubSection(e)}>Save changes</button>
                                        <button className='py-1 px-4 border rounded' onClick={() => {
                                            setActiveSubSection({ title: '', content: '', _id: '' });
                                            setEditModalIsOpen(false);
                                        }}>Close</button>
                                    </div>

                                    <div className='mt-6 md:w-[60%] mx-auto'>
                                        <ReactQuillEditor
                                            value={activeSubSection?.content}
                                            onChange={(value: any) => {
                                                const [title, content] = seperateBlogDataIntoComponents(value as string);
                                                setActiveSubSection((prevState) => ({
                                                    ...prevState,
                                                    title: title,
                                                    content: value,
                                                    // _id: activeSubSection?._id as any
                                                }))


                                                console.log({ activeSubSection });

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
                                    <p className="text-lg font-normal">Create new section</p>

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
                                        className="py-3 w-[100%] bg-[#F08354]/30 text-[#F08354]   px-4 rounded"
                                        onClick={() => {
                                            setSubSectionData({ title: "", content: "", _id: uuidv4() });
                                            setNewSectionModalIsOpen(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="py-3 w-[100%] px-4 rounded bg-[#F08354] text-white"
                                        onClick={(e) => addNewSection()}
                                    >
                                        Submit
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
        </div>
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

    url = `/get-course-by-id?id=${courseId}`



    const response = await http.get(url);



    return {
        props: { course: response.data.data },
    };
}

