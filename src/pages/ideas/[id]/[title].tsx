import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import { GetServerSideProps } from 'next';
import { useRouter, withRouter } from 'next/router';

import moment from 'moment'
import { IoClose, IoHeart } from 'react-icons/io5';

import dynamic from 'next/dynamic'

const Footer = dynamic(() => import('@/components/Footer'));
const Navbar = dynamic(() => import('@/components/Navbar'));
const ProgressBar = dynamic(() => import('@/components/ProgressBar'));
const ShareButton = dynamic(() => import('@/components/ShareButton'));
const TableOfContents = dynamic(() => import('@/components/TableOfContent'));
const IdeaCard = dynamic(() => import('@/components/IdeaCard'))

import notify from '@/components/Notification';



import { calculateReadingTime, fetchIdeaPostByID, modifyHTMLString } from '@/helper';
import { useFetchIdeasPostsQuery } from '@/features/apiSlice';
import http from '@/lib/http';



function Title({ blogDetails }: any) {
    const { data: blogs } = useFetchIdeasPostsQuery("");
    const router = useRouter();
    const currentRoute = router.asPath;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const [isIntersecting, setIsIntersecting] = useState(false)
    const [showTableOfContents, setShowTableOfContents] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);
    const [likes, setLikes] = useState<number>(blogDetails?.likes)
    const [modifiedHtmlString, setModifiedString] = useState('')
    const hasTableOfContents = blogDetails?.content?.includes("h2")
    const [hasLiked, setHasLiked] = useState(false)

    useEffect(() => {
        var newHtmlString = modifyHTMLString(blogDetails?.content)
        setModifiedString(newHtmlString)
    }, [blogDetails?.content])

    useEffect(() => {
        const targetSection = document.querySelectorAll('#more__articles')

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(entry.isIntersecting)
                } else {
                    setIsIntersecting(false)
                }
            })
        })

        targetSection.forEach((section) => {
            observer.observe(section);
        });
    }, [])


    const like = async () => {
        try {
            setHasLiked(true)
            setLikes(likes + 1)
            console.log({ id: blogDetails.id });

            await http.post(`/like-idea-post?id=${blogDetails.id}`)
        } catch (error) {
            notify({ msg: 'An error occured', type: 'error' })
            console.log({ error });

        }
    }

    return <div className='bg-[#FAF7ED]'>
        <NextSeo
            title={`${blogDetails?.title}`}
            description={`${blogDetails?.summary}`}
            openGraph={{
                type: 'article',
                article: {
                    tags: [`${blogDetails.tags}`],
                },

                site_name: 'Proactive Ideas'
            }}
        />

        <ProgressBar />
        <Navbar />

        <div className='h-fit lg:text-left  xl:grid xl:grid-cols-4 xl:gap-8 text-left w-[90%] mx-auto pt-28 sm:pt-20 lg:pt-28'>
            {/* <div className='col-span-1 bg-green-600 h-[300px]'></div> */}
            <div className='xl:col-span-3'>
                <div className=' text-left  h-fit'>
                    <h1 className="mb-4 text-[24px]  mt-10 font-semibold leading-snug lg:font-extrabold lg:text-4xl lg:leading-none lg:mb-4">{blogDetails?.title}</h1>
                    <p className='flex w-fit gap-2 text-lg'>
                        <span>
                            {moment(blogDetails?.createdAt).format('LL')}
                        </span>

                        <span>
                            -
                        </span>
                        <span>
                            {calculateReadingTime(blogDetails?.content)} min read
                        </span>
                    </p>

                    <p className='text-base mb-10'>Written by  - {blogDetails?.author} </p>


                    {/* <div className='lg:h-[450px] h-[200px] my-10 mx-auto w-[100%] overflow-hidden'>
                        <Image
                            alt=''
                            className='bg-cover'
                            src={blogDetails?.header_image}
                            layout="responsive" // Set layout to responsive
                            width={10}
                            height={45} // Set the actual height of the image
                        />
                    </div> */}


                    <div className="block focus:outline-none h-[38%]  focus-visible:ring-2">
                        <figure className="relative h-full overflow-hidden">
                            <Image
                                className='object-cover'
                                src={blogDetails?.header_image}
                                alt="Course"
                                layout="responsive"
                                width={500} // Specify a default width for optimization (can be any valid number)
                                height={500} // Specify a default height for optimization (can be any valid number)
                            />
                        </figure>
                    </div>
                </div>

                <div className=' pb-10'>
                    <div className=''>
                        <div className='mt-20 lg:gap-8'>

                            {!isIntersecting &&

                                <div className='lg:hidden w-full lg:bg-transparent' >
                                    {hasTableOfContents &&
                                        <div className='toc-gradient lg:hidden  z-30 rounded fixed bottom-0 w-full left-0 right-0 p-4' style={{ backgroundColor: showTableOfContents ? 'white' : '' }}>
                                            {showTableOfContents &&
                                                <div className='w-10 h-10 bg-white flex justify-center items-center cursor-pointer absolute right-4 -top-12 rounded-full shadow' onClick={() => setShowTableOfContents(!showTableOfContents)}>
                                                    <IoClose size={30} className='' />
                                                </div>
                                            }




                                            <button className='bg-[#F08354] shadow-xl mb-6 w-full py-3 rounded text-white text-base block'
                                                onClick={() => setShowTableOfContents(!showTableOfContents)}
                                                style={{ display: isIntersecting ? 'none' : 'block' }}
                                            >Table of contents</button>

                                            {showTableOfContents && <div className='lg:hidden'>
                                                <TableOfContents htmlString={blogDetails?.content} />
                                            </div>}

                                        </div>}
                                </div>
                            }

                            <div className='mx-auto ql-blog'>
                                {hasTableOfContents &&
                                    <div ref={sidebarRef} className='overflow-hidden hidden xl:block bg-white border rounded p-4 border-t-8 border-t-[#F08354]'>

                                        <p className='text-lg font-semibold mb-3'>Table of Contents</p>

                                        <div className='overflow-hidden'>
                                            {
                                                typeof window !== "undefined" &&

                                                <TableOfContents htmlString={blogDetails?.content} />
                                            }

                                        </div>

                                    </div>
                                }

                                <main ref={mainRef} className='text-gray-900 mt-20' dangerouslySetInnerHTML={{ __html: modifiedHtmlString! }}>
                                </main>
                                <div className='mt-8'>
                                    <div
                                        className='border px-4 py-2 bg-white w-fit flex items-center rounded-full gap-4 mb-8 cursor-pointer'
                                        onClick={() => !hasLiked ? like() : console.log('')}
                                    >
                                        <IoHeart size={20} />
                                        <p>{likes}</p>
                                    </div>

                                    <ShareButton url={baseUrl + currentRoute} />
                                </div>
                            </div>



                        </div>
                    </div>


                </div>

                <div className='my-20' id='more__articles'>

                    <h2 className="mb-8 text-2xl font-extrabold leading-snug lg:font-extrabold lg:text-4xl lg:leading-none lg:mb-8">More amazing articles for you</h2>


                    <div className='grid lg:grid-cols-3 grid-cols-1 gap-3'>
                        {blogs?.data?.filter((post: any) => post.status !== "inactive").slice(-3).map((blog: any) => (
                            <IdeaCard key={Math.random()} data={blog} />
                        ))}


                    </div>


                </div>
            </div>

            <div className='xl:col-span-1'>
            </div>
        </div>



        <Footer />
    </div>
}


export default withRouter(Title)


// This gets called on every request
export const getServerSideProps: GetServerSideProps<any> = async (context) => {
    const { query } = context;

    // Extract the query parameter
    const queryParam = query.id as string;

    // Fetch data from external API
    const res = await fetchIdeaPostByID(queryParam)
    const data = res?.data

    // Pass data to the page via props
    return {
        props: {
            blogDetails: data
        }
    }
}



