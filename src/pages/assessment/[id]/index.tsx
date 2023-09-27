import Modal from '@/components/Modal';
import ReactPortal from '@/components/ReactPortal';
import http from '@/lib/http';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { IoCheckbox, IoClose, IoDownload } from 'react-icons/io5';
import { TbCheck, TbCross, TbDownload } from 'react-icons/tb';
import { PDFDocument, rgb } from 'pdf-lib'
// import certificatePDF from "../../../assets/sample-certificate..pdf"

function Index({ assessment, id }: any) {
    const [offset, setOffset] = useState(0)
    const [option, setOption] = useState<null | number>(null)
    const [totalAssessments, setTotoalAssessments] = useState(assessment?.questions.length)
    const [feedback, setFeedback] = useState<null | string>(null)
    const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0)
    const [isCorrect, setIsCorrect] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [activeBtn, setActiveBtn] = useState<number | null>(null)
    const [certificateData, setCertificateData] = useState([]);
    const router = useRouter()




    const next = () => {
        setOffset((prevState: number) => prevState + 1)
    }

    const checkAnswer = (correctOption: number, yourOption: number) => {
        if (correctOption === yourOption) {
            setIsCorrect(true)
            setTotalCorrectAnswers((prevState: number) => prevState + 1)
        } else {
            setIsCorrect(false)
        }
    }

    const handleSubmit = () => {
        if (isCorrect) {
            setFeedback("You answered correctly")
        } else {
            setFeedback("Oops! that was wrong")
        }
    }

    const handleNext = () => {
        next()
        setActiveBtn(null)
        setFeedback(null)
        setIsCorrect(false)
    }

    const passedCutoffMark = () => {
        const baseMark = (80 / 100 * totalAssessments)
        return totalCorrectAnswers > baseMark
    }


    const writeNameOnCertificate = async (page: any, name: string, pdfDoc: PDFDocument) => {
        const nameText = `${name}`;
        const fontSize = 200; // Adjust the font size as needed
        const font = await pdfDoc.embedFont('Helvetica'); // Change to the desired font

        const textWidth = font.widthOfTextAtSize(nameText, fontSize);
        const centerX = (page.getWidth() - textWidth) / 2;
        const textHeight = page.getHeight(); // Adjust the vertical position as needed

        page.drawText(nameText, {
            x: centerX,
            y: 1150,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
        });
    };

    const generateAndDownloadCertificate = async (name: string) => {
        try {
            // Load the existing certificate PDF
            const existingPdfBytes = await fetch('/certificate_4.pdf').then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);

            // Get the first page of the PDF
            const page = pdfDoc.getPages()[0];

            // Write the centered name on the certificate
            await writeNameOnCertificate(page, name, pdfDoc);

            // Save the modified PDF
            const modifiedPdfBytes = await pdfDoc.save();

            // Download the modified PDF
            const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'modified_certificate.pdf';
            document.body.appendChild(a);
            a.click();

            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating and downloading certificate:', error);
        }
    };

    return (
        <div className='overflow-hidden h-screen w-screen bg-[#FAF7ED] '>

            <div className={`overflow-hidden `}>
                {offset === 0 &&
                    <div className='h-screen w-screen bg-[#FAF7ED] relative flex justify-center items-center'
                    >
                        <div className='container w-[80%] mx-auto grid lg:grid-cols-2'>
                            <div>
                                <div className='h-[600px] w-[600px] scale-105 bg-[#F08354] rounded-full absolute -left-20 opacity-0 lg:opacity-100'></div>
                            </div>
                            <div className='space-y-4'>
                                <h1 className="mb-4 text-3xl  mt-10 font-semibold leading-snug lg:font-extrabold lg:text-5xl lg:leading-none  lg:mb-4">Assessment Time!</h1>
                                <p>
                                    🎯 {assessment?.title}
                                </p>

                                <p>

                                    Get ready to showcase your superpowers as we delve into a series of mind-bending questions and activities that will test your understanding, creativity, and problem-solving skills. Remember, this isn&apos;t your typical snooze-worthy exam; we&apos;ve designed it to be fun, engaging, and, dare we say, a bit addictive!

                                </p>

                                <p>
                                    🔍 What to Expect:
                                </p>

                                <p>
                                    In this assessment, you&apos;ll encounter a mix of multiple-choice questions, brain teasers, and maybe even a surp
                                </p>

                                <button className='border h-[50px] flex items-center px-6 rounded duo-button' onClick={next}>Start Assessment</button>
                            </div>
                        </div>
                    </div>
                }

                {assessment?.questions?.map((question: any, index: any) => {
                    return (
                        <div key={Math.random()} className='h-screen w-screen bg-[#FAF7ED] relative flex justify-center items-center' style={{ display: `${offset === index + 1 ? 'flex' : 'none'}` }}>


                            <div className='container lg:w-[50%]  w-[90%] bg-white z-20 border px-8 mx-auto  rounded-lg box-border py-8'>
                                <h1>
                                    <span>Question {index + 1}: </span>
                                    {question?.question}

                                </h1>
                                <p className='text-gray-400'>Choose the correct answer</p>
                                <div className='mt-6'>
                                    {question?.options.map((option: any, i: number) => {


                                        return (
                                            <button
                                                key={Math.random()}
                                                // className={`px-4 py-1 duo-button relative rounded border w-full focus-within::bg-red-500`}
                                                className={`px-4 py-1 duo-button relative rounded border w-full focus:border-[#F08354] ${feedback ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'} ${activeBtn === i ? 'active' : ''}`}
                                                disabled={feedback ? true : false}
                                                tabIndex={0}
                                                // onClick={() => setOption(i)}
                                                onClick={() => {
                                                    checkAnswer(question.correct_option, i)
                                                    setActiveBtn(i)
                                                }}
                                            >

                                                {/* {feedback && (question.correct_option === i) && <TbCheck color='bg-green-300' size={25} className='absolute right-4 top-3' />} */}

                                                {option.text}
                                            </button>
                                        )
                                    })}
                                </div>
                                <div>
                                    <p>{feedback}</p>
                                </div>
                                <div className='w-fit ml-auto  uppercase'>
                                    {totalAssessments === offset ?
                                        <div className='space-x-3'>
                                            <button
                                                className='py-2  hover:bg-gray-50 border px-4 rounded-lg mt-6 ml-auto'
                                                onClick={handleSubmit}
                                                disabled={feedback ? true : false}
                                            >
                                                Submit
                                            </button>
                                            <button disabled={feedback ? false : true} className='py-2  hover:bg-gray-50 border px-4 rounded-lg mt-6 ml-auto' onClick={next}>Finish</button>
                                        </div>
                                        :
                                        <div className='space-x-3'>
                                            <button
                                                className='py-2  hover:bg-gray-50 border px-4 rounded-lg mt-6 ml-auto'
                                                onClick={handleSubmit}
                                                disabled={feedback ? true : false}
                                            >
                                                Submit
                                            </button>
                                            <button disabled={feedback ? false : true} className='py-2  hover:bg-gray-50 border px-4 rounded-lg mt-6 ml-auto' onClick={handleNext}>
                                                Next
                                            </button>
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>
                    )
                })}

                {offset === totalAssessments + 1 && <div className='h-screen w-screen bg-[#FAF7ED] relative flex justify-center items-center'>
                    <div className='text-center'>
                        <h1 className="mb-4 text-3xl  mt-10 font-semibold leading-snug lg:font-extrabold lg:text-5xl lg:leading-none  lg:mb-4">Assessment Completed</h1>
                        <p>You got {totalCorrectAnswers} answer(s) correctly</p>

                        <div className='flex w-fit mx-auto gap-2'>
                            {passedCutoffMark() ?
                                <button className='px-4 py-2 border flex items-center gap-2 mx-auto mt-4 rounded hover:opacity-75'
                                    onClick={() => router.push("/courses")}
                                >
                                    Explore  Courses
                                </button> :
                                <button className='px-4 py-2 border flex items-center gap-2 mx-auto mt-4 rounded hover:opacity-75'
                                    onClick={() => setIsOpen(true)}
                                >
                                    Quit
                                </button>
                            }

                            {passedCutoffMark() ?
                                <button className='px-4 py-2 border flex items-center gap-2 mx-auto mt-4 rounded hover:opacity-75' onClick={() => generateAndDownloadCertificate("Abas Umoh")}>
                                    <TbDownload />
                                    Download Certificate
                                </button>
                                : <button className='px-4 py-2 border flex items-center gap-2 mx-auto mt-4 rounded hover:opacity-75' onClick={() => {
                                    setFeedback(null)
                                    setIsCorrect(false)
                                    setTotalCorrectAnswers(0)
                                    setOffset(0)
                                    setActiveBtn(null)
                                    
                                }

                                }>
                                    Re-take Assessment
                                </button>
                            }

                        </div>
                    </div>
                </div>}
            </div>

            {isOpen && <ReactPortal>
                <Modal>
                    <div className='text-center space-y-4'>

                        <span className='text-2xl font-bold'>:(</span>
                        <p>
                            Are you sure you want to quit?
                        </p>

                        <p>You will be redirected to the home page</p>


                        <div className='flex gap-3 mt-4'>
                            <button className='px-4 py-2 w-full border rounded' onClick={() => router.push(`/courses/${assessment?.course}/preview`)}>Continue</button>
                            <button className='px-4 py-2 w-full border rounded' onClick={() => setIsOpen(false)}>Close</button>
                        </div>
                    </div>
                </Modal>

            </ReactPortal>}
        </div>
    )
}

export default Index

export async function getServerSideProps({ req, res }: any) {
    const paramsArr = req.url.split("/");
    const splitArr = paramsArr[paramsArr.length - 1].split("=")
    const id = splitArr[splitArr.length - 1]

    const response = await http.get(`/get-assessment-by-id?id=${id}`);

    return {
        // props: { assessment: '' },
        props: {
            assessment: response?.data.data,
            id: id
        },
    };
}