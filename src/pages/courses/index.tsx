import React, { FormEvent, useState } from "react";
import Image from "next/image";
import { RxMixerHorizontal } from "react-icons/rx";
import Card from "../../components/Card";
import Modal from "../../components/Modal";
import Navbar from "../../components/Navbar";
import ReactPortal from "../../components/ReactPortal";
import { AiOutlineClose } from "react-icons/ai";
import Footer from "../../components/Footer";
import { ImSearch } from "react-icons/im";


import headerImage from "../../assets/Second.png"
import { useFetchCoursesQuery, useFetchCategoriesQuery } from "@/features/apiSlice";
import Loader from "@/components/Loader";
import client from "@/lib/sanity";
import SkeletonLoader from "@/components/SkeletonLoader";

function Filter({
    label,
    isOpen,
    setIsOpen,
}: {
    label: string;
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
}) {
    return (
        <button
            className="bg-gray-800 border-gray-700 px-6 shadow-md py-3 inline-flex items-center gap-2 rounded"
            onClick={() => setIsOpen(true)}
        >
            <RxMixerHorizontal className="text-gray-200" />
            <p className="text-white">{label}</p>
        </button>
    );
}

function SearchBar({ value, onChange }: { value: string, onChange: (e: FormEvent) => void }) {
    const handleChange = (e: any) => {
        console.log(e.target.value);

    }
    return (
        <div className="w-full mx-auto block">
            <input placeholder="Search courses..." className="w-full py-3 border-gray-700/10 text-white relative rounded px-12 bg-black/10 focus:border-blue-500 outline-none focus:border-2"
                name={'search'} value={value} onChange={onChange} />
            <ImSearch size={20} className="text-gray-400 absolute -translate-y-9 translate-x-4" />
        </div>
    )
}

function Index({ content }: any) {
    const [filterIsOpen, setFilterIsOpen] = React.useState<boolean>(false);

    const { data: courses, isLoading: isFetchingCourses }: any = useFetchCoursesQuery("");
    const { data: categories, isLoading: isFetchingCategories }: any = useFetchCategoriesQuery({group: 'course'});

    const [filteredData, setFilteredData] = useState<any[]>(courses?.data);
    const [searchText, setSearchText] = useState("");

    console.log({ categories });


    const handleSearch = (e: any) => {
        const value = e.target.value;
        setSearchText(value)


        const newList = courses?.data.filter((data: any) => {
            return data.title.toLowerCase().includes(value.toLowerCase())
        })

        setFilteredData(newList);
    }

    // const imageProps: any = useNextSanityImage(client, content[0]?.bannerImage);
    // console.log(imageProps);


    return (
        <div className="h-fit bg-[#FAF7ED]">
            {filterIsOpen && (
                <ReactPortal>
                    <Modal>
                        <div className="flex justify-between">
                            <h3 className="font-normal">Filters</h3>

                            <div
                                className="w-6 h-6 border rounded-full flex items-center justify-center cursor-pointer"
                                onClick={() => setFilterIsOpen(false)}
                            >
                                <AiOutlineClose size={12} />
                            </div>

                        </div>
                        <hr className="my-4" />

                        <ul className="">
                            {new Array(5).fill(0).map(() => (
                                <li key={Math.random()} className="px-2 py-2 rounded duration-200 cursor-pointer text-black space-x-2">
                                    <input id="default-radio-1" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 " />
                                    <span>
                                        Web Development
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <button className="px-6 bg-blue-600 py-2 rounded text-white shadow-md mt-6 ml-auto">Apply filter</button>
                    </Modal>
                </ReactPortal>
            )}
            <Navbar />
            <div className="w-full md:h-[500px] md:pt-20 pt-10 h-[350px] md:mb-20 mb-10 overflow-hidden relative">
                <Image
                    className="absolute inset-0 h-full w-full object-cover"
                    src={headerImage} alt=""
                    sizes="(max-width: 800px) 100vw, 800px"
                />
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
                <div className="flex h-full text-left items-center justify-center relative">
                    <div className="w-[90%] mx-auto text-center">
                        <h1 className="mb-0 text-3xl text-white  mt-10 font-medium leading-snug lg:font-extrabold lg:text-5xl lg:leading-none  lg:mb-4">{content[0].header}</h1>
                        {/* <h1 className="mb-4 text-2xl font-bold text-white leading-snug lg:font-extrabold lg:text-6xl lg:leading-none lg:mb-0">{content[0]?.header}</h1> */}
                        <p className="text-white">{content[0]?.subHeader}</p>
                    </div>
                </div>
            </div>

            <div className="h-fit min-h-[400px] w-full bg-[#FAF7ED] flex items-center mb-40">
                <div className="container mx-auto w-[90%]">
                    <div className="ml-auto flex mb-8 w-fit gap-2  items-center md:hidden ">
                        <SearchBar value={searchText} onChange={handleSearch} />
                        <Filter
                            label="Filter"
                            isOpen={filterIsOpen}
                            setIsOpen={setFilterIsOpen}
                        />
                    </div>

                    {/* courses */}
                    <div className="grid xl:grid-cols-4 grid-cols-1 gap-4 relative">
                        <aside className="sticky top-0 mb overflow-auto h-fit hidden md:block">
                            <SearchBar value={searchText} onChange={handleSearch} />
                            <p className="text-white mt-4 bg-[#11393C] px-4 py-3 rounded">
                                All Courses
                            </p>
                            <ul className="">
                                {categories?.data.map((category: any) => {

                                    if (category.group === 'course') {
                                        return (
                                            <li key={Math.random()} className="px-2 py-3 rounded duration-200 hover:bg-gray-800/10 cursor-pointer text-black">
                                                {category.name}
                                            </li>
                                        )
                                    }

                                })}
                            </ul>
                        </aside>

                        {courses ?

                            <div className="col-span-3 md:col-span-3 md:ml-8">
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mb-10">
                                    {courses?.data.filter((post: any) => post.status !== 'inactive').map((course: any) => (
                                        <Card key={Math.random()} data={course} />
                                    ))}
                                </div>
                            </div>
                            : <SkeletonLoader />}

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Index;

export async function getStaticProps() {
    const content = await client.fetch(`*[_type in ["coursesPagehero"]]`)

    return {
        props: {
            content
        }
    };
}
