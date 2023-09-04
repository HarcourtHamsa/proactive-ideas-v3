import CustomInput from '@/components/CustomInput'

import Modal from '@/components/Modal'
import ReactPortal from '@/components/ReactPortal'
import Spinner from '@/components/Spinner'
import Layout from '@/components/admin/Layout'

import { useCreateCourseDraftMutation, useCreateCourseMutation, useFetchCategoriesQuery } from '@/features/apiSlice'
import { RootState } from '@/store'
import axios from 'axios'

import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'

import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';

import { decrementStep, incrementStep } from '@/features/form-step/formStepSlice'
import { addSection, resetState } from '@/features/sections/sectionsSlice'
import { TbPencil, TbSubtask, TbTrash, TbTrashXFilled, TbWriting } from 'react-icons/tb'
import { ToastContainer } from 'react-toastify'
import notify from '@/components/Notification'
import {
    setGeneralInfoCategory,
    setGeneralInfoCertificate,
    setGeneralInfoDescription,
    setGeneralInfoAuthor,
    setGeneralInfoPrice,
    setGeneralInfoTitle,
    setGeneralInfoHeaderImage,
    setGeneralInfoSummary,
    setGeneralInfoObjectives
} from '@/features/general-info/generalInfoSlice'
import BackChevronButton from '@/components/BackChevronButton'
import useRole from '@/hooks/useRole'
import { Role } from '../../../../../types/types'
import DynamicPricingInput from '@/components/admin/DynamicPricingInput'


function Index() {
    const dispatch = useDispatch()
    const role = useRole()
    const { data: categories } = useFetchCategoriesQuery({ group: 'course' })
    const { "0": createCourse } = useCreateCourseMutation();
    const { "0": createCourseDraft } = useCreateCourseDraftMutation()
    const formStep = useSelector((state: RootState) => state.step)
    const sectionState = useSelector((state: RootState) => state.section);
    const authState = useSelector((state: RootState) => state.auth);
    const generalInfo = useSelector((state: RootState) => state.generalInfo);

    const inputRef = useRef<any>();
    const headerImageInputRef = useRef<any>();


    const [cloudinaryURL, setCloudinaryURL] = useState("");
    const [currentData, setCurrentData] = useState<any>({})
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [courseModalIsOpen, setCourseModalIsOpen] = useState(false)
    const [filesSelected, setFilesSelected] = useState<any>([]);
    const [inputTagFile, setInputTagFile] = useState();
    const [headerImageFile, setHeaderImageFile] = useState();
    const [fileSelectedForHeaderImage, setFileSelectedForHeaderImage] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false)
    const [objective, setObjective] = useState('')
    const [editObjectiveModalIsOpen, setEditObjectiveModalIsOpen] = useState(false)
    const [activeObjective, setActiveObjective] = useState<any>({})

    const router = useRouter();

    const handleEditObjective = () => {

        var arr: any[] = []

        generalInfoData.objectives.map((objective: string, index: number) => {
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

    const [subSectionData, setSubSectionData] = useState({
        title: "",
        content: "",
    });

    const [generalInfoData, setGeneralInfoData] = useState<any>({
        title: generalInfo.title,
        author: generalInfo.author,
        prices: generalInfo.prices,
        category: generalInfo.category,
        description: generalInfo.description,
        summary: generalInfo.summary,
        objectives: generalInfo?.objectives || [],
        certificate: generalInfo.hasCertificate,
    });


    const [newLessonModalIsOpen, setNewLessonModalIsOpen] = useState(false);


    const [newSection, setNewSection] = useState(
        {
            id: uuidv4(),
            title: "",
            sub_sections: []
        }
    );

    const handleDeleteObjective = (selectedObjective: string) => {
        const filteredObjectives = generalInfoData.objectives.filter((objective: string) => objective !== selectedObjective)

        setGeneralInfoData((prevState: any) => ({
            ...prevState,
            objectives: filteredObjectives
        }))

        notify({ msg: 'Objective deleted', type: 'success' })
    }


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
                setGeneralInfoData((prevState: any) => ([
                    ...prevState,
                    {
                        price: e.target.value
                    }
                ]))
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
            case 'objectives':
                setGeneralInfoData((prevState: any) => ({
                    ...prevState,
                    objectives: [...prevState.objectives, objective]
                }))
                break;

            case 'hasCertificate':
                setGeneralInfoData((prevState: any) => ({
                    ...prevState,
                    hasCertificate: !(prevState.hasCertificate)
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


    function handleHeaderImageInputChange(e: any) {
        const file = headerImageInputRef.current.files[0];
        const reader = new FileReader();


        reader.readAsText(file);

        reader.onloadend = async (e: any) => {
            //Here the content has been read successfuly
            setFileSelectedForHeaderImage((prevState: any) => [...prevState, file]);

            await imageUpload(file).then((res) => {

                dispatch(setGeneralInfoHeaderImage({ headerImage: res }))
            }).catch((err) => {
                console.log(err);
            })

        };
    }



    const handleContentChange = (event: any) => {
        const updatedContent = event.target.value;
        setNewSection((prevState) => ({
            ...prevState,
            title: updatedContent
        }))
    };

    const addLesson = () => {
        setNewSection((prevState) => ({
            ...prevState,
            id: uuidv4()
        }));
        dispatch(addSection(newSection));
        setNewLessonModalIsOpen(false);
        setNewSection((prevState) => ({
            ...prevState,
            title: ''
        }))
    }

    const handleCoursePreview = () => {
        router.push(`/admin/courses/preview`)
    }


    const handleCourseCreation = async () => {
        setIsLoading(true) // shows loader

        const formattedData = sectionState.sections.map((section: any) => ({
            sub_sections: section.sub_sections,
            title: section.title
        }));

        const parsedData = formattedData.map((sections: any) => ({
            sub_sections: sections.sub_sections.map((sub_section: any) => ({
                content: sub_section.content,
                title: sub_section.title
            })),
            title: sections.title
        }));


        var course = {
            ...generalInfoData,
            objectives: arrayToHTMLList(generalInfoData.objectives),
            header_image: generalInfo.headerImage,
            sections: parsedData,
            tags: [generalInfoData.category],
        }

        await createCourseDraft({ token: authState.auth.user?.accessToken, course }).then(() => {
            notify({ msg: "New draft created", type: 'success' });

        }).catch((err: any) => {

            notify({ msg: "An error occured!", type: 'error' });

        }).finally(() => {
            // dispatch(resetState());
            setIsLoading(false)
            dispatch(setGeneralInfoCategory({ category: '' }));
            dispatch(setGeneralInfoDescription({ description: '' }));
            dispatch(setGeneralInfoSummary({ summary: '' }));
            dispatch(setGeneralInfoCertificate({ hasCertificate: false }));
            dispatch(setGeneralInfoAuthor({ author: '' }));
            dispatch(setGeneralInfoPrice({ prices: [] }));
            dispatch(setGeneralInfoTitle({ title: '' }));
            dispatch(setGeneralInfoHeaderImage({ headerImage: '' }));
            dispatch(setGeneralInfoObjectives({ objectives: [] }));
            dispatch(decrementStep());
            dispatch(setGeneralInfoPrice({ prices: [] }));
        })



    }

    const [USD, setUSD] = useState({
        currency: "USD",
        country_code: "US",
        price: generalInfoData.prices.USD || ""
    });

    const [INR, setINR] = useState({
        currency: "INR",
        country_code: "IND",
        price: generalInfoData.prices.INR || ""
    });
    const [NGN, setNGN] = useState({
        currency: "NGN",
        country_code: "NGA",
        price: generalInfoData.prices.NGA || ""
    });
    const [KES, setKES] = useState({
        currency: "KES",
        country_code: "KEN",
        price: generalInfoData.prices.KES || ""
    });
    const [ZAR, setZAR] = useState({
        currency: "ZAR",
        country_code: "ZAF",
        price: generalInfoData.prices.ZAR || ""
    });
    const [GHS, setGHS] = useState({
        currency: "GHS",
        country_code: "GHA",
        price: generalInfoData.prices.GHS || ""
    });
    const [GBP, setGBP] = useState({
        currency: "GBP",
        country_code: "GBR",
        price: generalInfoData.prices.GBP || ""
    });

    function arrayToHTMLList(array: any[]) {
        const listItems = array.map((item: string) => `<li>${item}</li>`).join('');
        return `<ul>${listItems}</ul>`;
    }



    const handleNextStep = () => {

        var prices = [
            USD,
            INR,
            NGN,
            GBP,
            GHS,
            ZAR,
            KES
        ]



        dispatch(setGeneralInfoCategory({ category: generalInfoData.category }));
        dispatch(setGeneralInfoDescription({ description: generalInfoData.description }));
        dispatch(setGeneralInfoSummary({ summary: generalInfoData.summary }));
        dispatch(setGeneralInfoCertificate({ hasCertificate: generalInfoData.hasCertificate }));
        dispatch(setGeneralInfoAuthor({ author: generalInfoData.author }));
        dispatch(setGeneralInfoPrice({ prices: prices }));
        dispatch(setGeneralInfoTitle({ title: generalInfoData.title }));
        dispatch(setGeneralInfoObjectives({ objectives: generalInfoData.objectives }));
        dispatch(incrementStep())
    }


    const handlePriceChange = (e: any) => {

        switch (e.target.name) {
            case "USD":
                setUSD((prevState: any) => ({
                    ...prevState,
                    price: e.target.value
                }))
                break;
            case "INR":
                setINR((prevState: any) => ({
                    ...prevState,
                    price: e.target.value
                }))
                break;
            case "NGN":
                setNGN((prevState: any) => ({
                    ...prevState,
                    price: e.target.value
                }))
                break;
            case "KES":
                setKES((prevState: any) => ({
                    ...prevState,
                    price: e.target.value
                }))
                break;
            case "ZAR":
                setZAR((prevState: any) => ({
                    ...prevState,
                    price: e.target.value
                }))
                break;
            case "GHS":
                setGHS((prevState: any) => ({
                    ...prevState,
                    price: e.target.value
                }))
                break;
            case "GBP":
                setGBP((prevState: any) => ({
                    ...prevState,
                    price: e.target.value
                }))
                break;

            default:
                break;
        }


    }


    const handleSubsectionNameChange = (event: any, data: any) => {
        const copy = sectionState.sections
        const originalSection = sectionState.sections.filter((section: any) => section.id === data.id)
        const index = sectionState.sections.indexOf(originalSection[0])
        const shallowCopy = Object.assign({}, originalSection[0], { title: event.target.innerText })


        copy[index] = shallowCopy

        // sectionState.sections[index] = shallowCopy;




    }


    return (
        <Layout>
            <ToastContainer />
            {formStep.step === 0 &&
                <div className='px-4 py-10'>

                    <BackChevronButton />

                    <h1 className='text-2xl md:text-4xl font-semibold'>Create new course</h1>

                    <div className=' h-fit bg-white rounded border mt-4'>
                        <div className='px-4 py-3 border-b'>
                            <p className=''>General Information</p>
                        </div>

                        <div className='px-4 my-8 space-y-3'>

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

                            <div className='grid grid-cols-2 gap-4'>


                                <CustomInput label='Course title' type='text' name='courseTitle' value={generalInfoData.title} onChange={handleChange} />

                                <CustomInput label='Author' type='text' name='author' value={generalInfoData.author} onChange={handleChange} />






                                <div>
                                    <label htmlFor="countries" className="block text-black">Category</label>
                                    <select id="countries" className="bg-gray-50 border text-gray-900 rounded focus:ring-blue-500 outline-blue-500 focus:border-blue-500 block w-full p-2.5" name='category' value={generalInfoData.category} onChange={handleChange}>
                                        <option selected>Choose a category</option>
                                        {categories?.data.map((category: any) => {
                                            if (category.group === "course") {
                                                return (
                                                    <option value={category.name} key={Math.random()}>{category.name}</option>
                                                )
                                            }
                                        })}
                                    </select>

                                </div>
                                <div className='translate-y-10'>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" name="hasCertificate" value="" className="sr-only peer" checked={generalInfoData.hasCertificate} onChange={handleChange} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ml-3 font-medium text-gray-900">Certificate</span>
                                    </label>
                                </div>
                            </div>

                            <div className='mt-8'>
                                <p>Prices</p>
                                <div className='col-span-2 space-y-2'>
                                    <DynamicPricingInput price={USD} placeholder="Price in US Dollars" onChange={handlePriceChange} />
                                    <DynamicPricingInput price={INR} placeholder="Price in Indian Ruppies" onChange={handlePriceChange} />
                                    <DynamicPricingInput price={NGN} placeholder="Price in Nigerian Naira" onChange={handlePriceChange} />
                                    <DynamicPricingInput price={GHS} placeholder="Price in Ghanian Cedis" onChange={handlePriceChange} />
                                    <DynamicPricingInput price={GBP} placeholder="Price in British Pounds" onChange={handlePriceChange} />
                                    <DynamicPricingInput price={KES} placeholder="Price in Kenyan Shillings" onChange={handlePriceChange} />
                                    <DynamicPricingInput price={ZAR} placeholder="Price in South African Rands" onChange={handlePriceChange} />

                                </div>
                            </div>


                            <div className=''>
                                <label htmlFor="message" className="block font-medium text-gray-900">Description</label>
                                <textarea id="message" rows={4} className="block p-2.5 w-full text-gray-900 bg-white rounded outline-blue-500 focus:ring-blue-500 focus:border-blue-500 border-2" placeholder="Write your thoughts here..." name='description' value={generalInfoData.description} onChange={handleChange}></textarea>
                            </div>
                            <div className=''>
                                <label htmlFor="message" className="block font-medium text-gray-900">Summary</label>
                                <textarea id="message" rows={4} className="block p-2.5 w-full text-gray-900 bg-white rounded outline-blue-500 focus:ring-blue-500 focus:border-blue-500 border-2" placeholder="Write your thoughts here..." name='summary' value={generalInfoData.summary} onChange={handleChange}></textarea>
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

                            <button
                                className=' px-4 py-2 rounded border mt-4'
                                onClick={handleNextStep}>
                                Continue
                            </button>
                        </div>
                    </div>


                </div>
            }

            {formStep.step === 1 && <div className='px-4 py-10 '>
                <div className='bg-white min-h-[400px] overflow-hidden rounded  border h-fit'>
                    <div className='border-b h-16 flex items-center justify-end space-x-2  px-4  bg-white'>
                        <button className='border px-4 py-2 whitespace-nowrap  rounded' onClick={() => setNewLessonModalIsOpen(true)}>Add Lesson</button>
                        <button className='border px-4 py-2  rounded' onClick={() => dispatch(resetState())}>Reset</button>
                        <button className='border px-4 py-2  rounded' onClick={handleCoursePreview}>Preview</button>
                    </div>


                    <div className='p-4'>
                        <h2 className='text-3xl mb-3'>Create lessons</h2>
                        {sectionState.sections.map((section: any) => {
                            return (
                                <div key={section.id}>
                                    <div className='flex items-center gap-2'>
                                        <div className='flex flex-1 justify-between rounded-md bg-gray-50 border-b-2 mb-4 mt-2 px-4 py-2 relative'>
                                            <small className='bg-white border px-3 rounded-full absolute -top-3'>section</small>
                                            <p className='pt-2'>{section.title}</p>
                                            <p className='pt-2'>{section.id}</p>
                                            <TbTrashXFilled
                                                size={20}
                                                className='text-gray-600 cursor-pointer' />
                                        </div>
                                        <TbSubtask
                                            size={25}
                                            className='-rotate-180 ml-4 cursor-pointer'
                                            onClick={() => {
                                                router.push(`/admin/courses/create/editor?id=${section.id}`)
                                            }} />

                                    </div>


                                    <div className='border px-6 w-[80%] ml-auto rounded pt-4 relative'>
                                        <small className='border px-3 bg-gray-100 rounded-full py absolute -top-3'>sub-sections</small>
                                        {section?.sub_sections?.map((ss: any) => {
                                            return (

                                                <div key={Math.random()} className='flex justify-between rounded-md bg-gray-50 border-b-2 mb-4 mt-2 px-4 py-2'>
                                                    <p>{ss.title}  </p>


                                                    <TbWriting
                                                        size={20}
                                                        className='text-gray-600 cursor-pointer'
                                                        onClick={() => {
                                                            router.push({
                                                                pathname: `/admin/courses/create/editor`, query: {
                                                                    title: ss.title,
                                                                    content: ss.content,
                                                                    subSectionId: ss.id,
                                                                    courseId: section.id
                                                                }
                                                            }, ` /admin/courses/create/editor`)
                                                        }} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}


                    </div>

                    <div className='h-16 border-t flex space-x-2 items-center px-4'>
                        <button className='border px-4 py-2  rounded' onClick={() => dispatch(decrementStep())}>Back</button>
                        <button
                            className='border px-4 py-2 flex items-center gap-2 rounded'
                            onClick={handleCourseCreation}
                        // onClick={handleNextStep}
                        >
                            {isLoading && <Spinner />}
                            Create Course</button>
                    </div>
                </div>


            </div>}



            {/* <button onClick={() => dispatch(decrementStep())}>Reset</button> */}


            {newLessonModalIsOpen && <ReactPortal>
                <Modal>
                    <div>
                        <CustomInput label='Name of lesson' type='text' value={newSection.title} onChange={handleContentChange} />

                        <div>
                            <div className='mt-4 flex items-center space-x-2'>
                                <button className='border px-4 py-2 w-[50%]  text-black  rounded' onClick={() => setNewLessonModalIsOpen(false)}>Cancel</button>
                                <button className='border px-4 py-2  w-[50%] text-black  rounded' onClick={addLesson}>Create lesson</button>
                            </div>
                        </div>
                    </div>
                </Modal></ReactPortal>}
        </Layout >
    )
}

export default Index


