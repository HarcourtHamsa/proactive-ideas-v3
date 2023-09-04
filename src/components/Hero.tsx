import React from 'react'
import Image from 'next/image';

import { useRouter } from 'next/router';

import personPNG from "../assets/welcome-woman.png";
import semiCircle from "../assets/semi-circle.png";
import yellowSemiCircle from "../assets/header.png";
import Navbar from './Navbar';
import { Transition } from '@headlessui/react';

function Hero({ data }: any) {
    const router = useRouter();

    return (
        <>
            <Navbar />

            <div className="lg:h-screen xl:h-[650px]  w-[100%] bg-[#11393C] border-t-0 flex justify-center  relative overflow-hidden">
                <div className="container items-center mx-auto w-[90%] h-[60%] grid grid-cols-1 content-center lg:grid-cols-3 lg:mb-48 mt-10">
                    {/* column 1 */}
                    <div className="space-y-8 translate-y-10 pt-10 relative  md:translate-y-20 col-span-2">

                    <h1 className="mb-4 text-2xl font-semibold leading-snug lg:font-extrabold lg:text-5xl xl:w-[600px] lg:leading-loose text-white lg:mb-7">
                    {data[0].header}
                  </h1>
                    {/* <h1 className="mb-4 text-4xl text-white  mt-10 font-semibold leading-snug lg:font-extrabold lg:text-5xl lg:leading-none  lg:mb-4">{data[0].header}</h1> */}

                    {/* <h2 className='md:text-3xl text-3xl font-bold'>{data[0]?.header}</h2> */}
                        <p className="md:w-[500px] lg:text-left  text-gray-300">
                            {data[0]?.subHeader}
                        </p>

                        <div className="flex flex-row lg:flex-row gap-4 lg:gap-4 mt-10 md:w-fit">
                            <button
                                type="button"
                                onClick={() => router.push("/courses")}
                                className="text-white bg-[#F08354] whitespace-nowrap hover:opacity-80 focus:ring-4 focus:outline-none font-medium rounded py-2 px-4 text-center md:mr-0 md:block"
                            >
                                Start learning
                            </button>
                        </div>

                        <svg className='absolute -bottom-20 md:bottom-0 right-0 scale-50 md:scale-75' width="200" height="200" viewBox="0 0 656 602" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M473.651 591.034C499.831 544.825 511.904 491.804 507.609 438.856C503.442 385.187 481.54 333.431 447.181 292.401C415.389 254.503 368.745 219.029 317.082 217.753C292.2 217.209 268.075 224.976 248.634 240.711C230.042 255.852 216.059 276.866 209.156 299.877C194.771 348.325 213.076 401.08 247.542 436.478C265.168 454.47 287.173 470.413 312.722 473.9C340.434 477.771 365.048 462.21 384.677 444.576C421.652 411.282 445.534 363.774 450.879 314.318C456.352 264.142 441.004 213.993 410.317 174.06C379.959 134.781 336.1 107.085 287.155 98.8569C240.11 90.8168 190.33 100.728 149.19 124.809C139.263 130.484 129.997 137.465 121.257 144.837C113.365 151.616 123.243 164.666 131.331 157.625C164.07 128.933 207.342 112.961 250.747 112.179C295.788 111.389 338.875 127.5 372.53 157.402C406.381 187.041 429.222 229.3 434.201 274.192C439.181 319.084 426.163 365.693 400.007 402.54C386.797 420.865 369.917 438.094 350.522 449.376C340.137 455.119 328.762 458.901 316.907 457.841C305.967 456.646 295.539 452.567 286.019 446.717C248.204 423.512 220.445 379.638 220.181 334.987C219.991 292.431 247.364 249.555 289.081 237.323C333.937 224.159 380.671 250.73 412.622 280.181C449.107 313.41 475.169 358.47 485.99 406.478C496.742 454.029 492.711 504.46 475.106 550.108C470.832 560.799 466.101 571.557 460.318 581.535C458.305 585.341 458.064 590.056 462.006 592.985C465.354 595.065 471.376 594.646 473.651 591.034Z" fill="#FFFCFC" />
                            <path d="M109.841 110.253C109.029 119.03 108.48 128.002 108.321 136.448C108.08 141.164 108.297 145.811 108.514 150.459C108.469 154.911 108.881 159.296 111.321 163.148C116.86 172.158 129.617 169.81 138.717 169.639C147.817 169.467 156.587 168.643 165.551 167.555C176.086 166.002 173.723 149.972 163.189 151.525C155.86 152.605 148.465 153.227 141.265 153.587C137.796 153.864 134.259 153.683 130.791 153.961C129.154 153.968 127.059 154.043 125.422 154.05C124.964 154.117 124.243 153.99 123.785 154.057C124.048 154.252 124.311 154.448 124.769 154.38C125.295 154.771 125.362 155.229 125.888 155.619C125.557 154.966 125.49 154.508 125.557 154.966C125.858 149.072 125.236 141.676 125.207 135.129C125.501 127.599 125.795 120.068 126.547 112.47C126.826 101.666 110.646 99.839 109.841 110.253Z" fill="#FFFCFC" />
                        </svg>
                    </div>

                    {/* column 2 */}
                    <Transition
                        show={true}
                        enter="transition-opacity duration-75"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        className={"relative translate-y-[20%] flex justify-center h-full lg:block"}
                    >
                        <Image
                            src={personPNG}
                            className="z-10 object-cover scale-[90%] lg:scale-[90%] relative lg:-bottom-10 -bottom-0 lg:-translate-x-0 "
                            alt=""
                            priority={true}
                        />

                        <div className='lg:w-[280px] lg:h-[280px] hidden w-[250px] h-[250px] absolute -top-4 lg:-left-10 lg:top-0 left-[8%] bg-white rounded-full translate-x-10 translate-y-10 z-0'></div>
                    </Transition>



                </div>
            </div>
        </>
    )
}

export default Hero