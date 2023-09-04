import React, { useState, useRef } from "react";
import {
    AiFillDelete,
    AiFillEdit,
    AiOutlineArrowDown,
    AiOutlineClose,
    AiOutlineDelete,
    AiOutlinePlus,
} from "react-icons/ai";
import { FiEdit2, FiChevronDown, FiChevronRight, FiChevronUp } from "react-icons/fi";
import Modal from "../Modal";
import ReactPortal from "../ReactPortal";
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from "react-redux";


function SubSection({ data }: { data: any }) {
    return (
        <div className="relative">
            <div className="w-4 h-4 bg-gray-200 rounded absolute -translate-x-10 translate-y-2"></div>
            <div className="flex mb-2 bg-gray-100 border cursor-pointer justify-between items-center rounded px-4 py-3">
                <p className="text-gray-900 text-sm">{data?.title}</p>
            </div>
        </div>
    );
}

function Section({ data, setData }: any) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [filesSelected, setFilesSelected] = useState<any>([]);
    const [inputTagFile, setInputTagFile] = useState();
    const [showSubSections, setShowSubSection] = useState(true);
    const dispatch = useDispatch()
    const [subSectionData, setSubSectionData] = useState({
        title: "",
        content: "",
        id: uuidv4()
    });

    const [sectionInfo, setSectionInfo] = useState({
        name: "",
        sub_sections: [],
    });

    const inputRef = useRef<any>();

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

    function handleInputChange(e: any) {
        const file = inputRef.current.files[0];
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onloadend = (e: any) => {
            //Here the content has been read successfuly

            setFilesSelected((prevState: any) => [...prevState, file]);
            setSubSectionData((prevState: any) => ({
                ...prevState,
                content: reader.result,
            }));
        };
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const subData: any = [
            ...sectionInfo.sub_sections,
            {
                ...subSectionData
            }
        ]


        setSectionInfo((prevState: any) => ({
            ...prevState,
            sub_sections: [
                ...prevState.sub_sections,
                ...subData
            ]

        }))


        const resObj = {
            title: sectionInfo.name,
            id: uuidv4(),
            sub_sections: subData
        }

        // setSections((prevState: any) => ([
        //     ...prevState,
        //     {
        //         ...resObj
        //     }
        // ]))


        setSubSectionData({
            content: '',
            id: uuidv4(),
            title: ''
        })

        setModalIsOpen(false);

    }

    function removeFile(file: any) {
        const filteredList = filesSelected.filter((f: any) => f.name !== file.name);
        setFilesSelected(filteredList);
    }

    function handleChange(e: React.FormEvent | any) {
        e.preventDefault();

        switch (e.target.name) {
            case "sectionName":
                setSectionInfo((prevState) => ({
                    ...prevState,
                    name: e.target.value,
                }));
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
    return (
        <div className="relative">
            <div className="w-4 h-4 bg-blue-600 rounded absolute -translate-x-2"></div>
            <div className="flex flex-col w-[90%] ml-auto mt-4">
                <label className="text-gray-900 text-sm mb-1">Section name</label>
                <input
                    className="py-2 px-4 bg-gray-100 rounded outline-none focus:outline-blue-500 relative"
                    name="sectionName"
                    value={sectionInfo.name}
                    onChange={handleChange}
                    autoFocus={true}
                />

                <div className="flex justify-start items-center w-fit ml-auto gap-4">
                    <button
                        title="Add sub-section"
                        className=" text-sm bg-gray-100 px-2 py-2 rounded flex cursor-pointer justify-center items-center my-2"
                        onClick={() => setModalIsOpen(true)}
                    >
                        Create sub section
                    </button>
                    <button className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center" onClick={() => setShowSubSection(!showSubSections)}>
                        {showSubSections ? (
                            <FiChevronUp className="text-gray-400" size={20} />
                        ) : (
                            <FiChevronDown className="text-gray-400" size={20} />
                        )}
                    </button>
                </div>

                <div
                    className="w-8 h-8 flex justify-center hover:bg-gray-100/10 cursor-pointer absolute rounded items-center right-0 translate-y-8"
                    onClick={() => setShowSubSection(!showSubSections)}
                >

                </div>

                {/* sub-sections */}
                {showSubSections && (
                    <div className=" mt-4 w-[80%] ml-auto border-l-2 pl-8">
                        {sectionInfo.sub_sections.map((info) => (
                            <SubSection key={Math.random()} data={info} />
                        ))}
                    </div>
                )}
            </div>

            {modalIsOpen && (
                <ReactPortal>
                    <Modal onClick={() => setModalIsOpen(false)}>
                        <div className="flex justify-between">
                            <h3 className="text-xl font-normal">Create Sub-Section</h3>

                            <div
                                className="w-6 h-6 border rounded-full flex items-center justify-center cursor-pointer"
                                onClick={() => {
                                    setSubSectionData({
                                        title: "", content: "",
                                        id: uuidv4()
                                    });
                                    setFilesSelected([]);
                                    setModalIsOpen(false);
                                }}
                            >
                                <AiOutlineClose size={12} />
                            </div>
                        </div>

                        <div>
                            <form className="space-y-3 mt-6" onSubmit={handleSubmit}>
                                <div className="flex flex-col mb-4">
                                    <label className="">Name of Sub-Section</label>
                                    <input
                                        className="py-3 px-4 bg-transparent border-2 rounded outline-none focus:border-blue-500 "
                                        name="subSectionData"
                                        value={subSectionData.title}
                                        onChange={handleChange}
                                    />
                                </div>

                                <p>Upload Content(.md)</p>
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
                                                stroke-width="2"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                />
                                            </svg>
                                            <p className="font-medium text-[#404eed]">
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
                                            accept=".md"
                                            ref={inputRef}
                                            value={inputTagFile}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                </div>
                                <div className="space-y-4">
                                    {filesSelected.map((f: any) => (
                                        <div key={Math.random()} className="flex justify-between py-3 shadow-inner rounded items-center px-2 border">
                                            <p className="w-[60%] truncate overflow-hidden">{f.name}</p>
                                            <AiOutlineDelete
                                                size={17}
                                                className="cursor-pointer"
                                                onClick={() => removeFile(f)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <button
                                        className="py-3 border rounded bg-[#404eed] text-white"
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </button>
                                    <button
                                        className="py-3 border rounded"
                                        onClick={() => {
                                            setSubSectionData({ title: "", content: "", id: uuidv4() });
                                            setFilesSelected([]);
                                            setModalIsOpen(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                </ReactPortal>
            )}
        </div>
    );
}

export default Section;
