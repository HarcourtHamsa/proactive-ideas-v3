import React, { useState, useRef } from 'react'
import BackChevronButton from '@/components/BackChevronButton';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import ReactPortal from '@/components/ReactPortal';
import { AiOutlineCloseCircle, AiOutlineDelete } from 'react-icons/ai';
import axios from 'axios';
import CustomSelect from '@/components/CustomSelect';
import CustomInput from '@/components/CustomInput';
import notify from '@/components/Notification';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { seperateBlogDataIntoComponents, updateIdeaPost, updateIdeaPostDraft } from "../../../../helper";
import Spinner from '@/components/Spinner';
import { ToastContainer } from 'react-toastify';
import useRole from '@/hooks/useRole';
import useAuth from '@/hooks/useAuth';
import { Role } from '../../../../../types/types';
import { resetBlogData, setBlogData } from '@/features/blog/blogSlice';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { useSearchParams } from 'next/navigation'
import useCookie from '@/hooks/useCookie';


const ReactQuillEditor = dynamic(() => import("@/components/admin/Editor"), { ssr: false });
const CustomEditorHeader = dynamic(() => import("@/components/admin/CustomEditorHeader"), { ssr: false });

function EditBlog() {
  const router = useRouter();
  const role = useRole();
  const auth = useAuth();
  const inputRef = useRef<any>();
  const cookie = useCookie()
  const dispatch = useDispatch();
  const blogData = useSelector((state: RootState) => state?.blog);

  const URLPath = router.asPath;
  var urlContainsQueryParam = URLPath.includes("next=admin")

  const [cloudinaryURL, setCloudinaryURL] = useState<string>(blogData.header_image || router.query.header_image as string)
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filesSelected, setFilesSelected] = useState<any>([]);
  const [inputTagFile, setInputTagFile] = useState();
  const generatePeviousTags = () => {
    const tagsArr: any[] = [];

    // if tags is an array and is not empty
    if (router.query.tags?.length && typeof router.query.tags === 'object') {
      router.query.tags.map((tag: string) => {
        tagsArr.push({ value: tag, label: tag })
      })
    } else if (router.query.tags?.length && typeof router.query.tags === 'string') {
      tagsArr.push({ value: router.query.tags, label: router.query.tags })
    } else {
      return null;
    }


    return tagsArr
  }

  const [selectedTags, setSelectedTags] = useState<any[] | null>(generatePeviousTags());
  const [description, setDescription] = useState(router.query.summary);
  const [author, setAuthor] = useState(router.query.author);

  console.log(router.query);


  const [blogTitle, setBlogTitle] = useState<any>(blogData.title || router.query.title);
  const [blogContent, setBlogContent] = useState(blogData.content || router.query.content);




  const handleSelectChange = (selectedOption: any) => {
    setSelectedTags(selectedOption);
  };



  function dropHandler(e: any) {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();

    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...e.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          console.log(`… file[${i}].name = ${file.name}`);
          setFilesSelected((prevState: any) => [...prevState, file]);
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...e.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
        setFilesSelected((prevState: any) => [...prevState, file]);
      });
    }
  }

  function dragOverHandler(e: React.FormEvent) {
    e.preventDefault();
  }

  async function handleInputChange(e: any) {
    setIsUploadingImage(true);

    const file = inputRef.current.files[0];
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onloadend = async (e: any) => {
      //Here the content has been read successfuly

      setFilesSelected(file);

      console.log("file selected", file);


      await imageUpload(file)
        .then((url: any) => setCloudinaryURL(url))
        .catch((error) => console.log(error))
        .finally(() => {
          setIsUploadingImage(false);
        })
    }



  }




  const imageUpload = async (img: any) => {
    var url;
    const formData = new FormData()

    if (router.query.headerImage && filesSelected.length === 0) {
      url = router.query.headerImage;
      return url;
    }


    formData.append("file", img)
    formData.append("upload_preset", "hqdnnphw");

    await axios.post("https://api.cloudinary.com/v1_1/dgn6edv1k/image/upload", formData)
      .then((response: any) => {
        url = response.data.secure_url;
      })


    return url;
  }

  const handleChange = (e: any) => {
    switch (e.target.name) {
      case "title":
        setBlogTitle(e.target.value);
        break;
      case "description":
        setDescription(e.target.value);
        break;
      case "author":
        setAuthor(e.target.value);
        break;

      default:
        break;
    }
  };

  const publishBlog = async () => {
    setIsLoading(true);
    const tags: string[] = [];

    selectedTags?.forEach((t: any) => {
      tags.push(t.value);
    });

    updateIdeaPostDraft({
      id: router.query.id as string,
      body: {
        author: author,
        title: blogTitle,
        description: description,
        summary: description,
        content: blogContent,
        header_image: cloudinaryURL,
        tags: tags,
      },
      token: cookie?.user.accessToken,
    })
      .then((res: any) => {
        notify({ msg: "Content updated", type: "success" });

        setSelectedTags(null)
        setIsOpen(false)
        setBlogContent("")
        setBlogTitle("")
        setDescription("")



        // router.push("/admin/ideas")

      })
      .catch((err: any) => {
        console.log("ERR", err);
        notify({ msg: "Oops! an error occured", type: "error" });
      })
      .finally(() => {
        setIsLoading(false);
      });

  };

  const showPreview = () => {
    var [title, content] = seperateBlogDataIntoComponents(blogContent as string);

    console.log(blogContent);

    dispatch(setBlogData({ title: title, content: blogContent, headerImage: cloudinaryURL }));
    router.push("/admin/content/preview");
  }


  return (
    <div>
      <div className='flex justify-between px-4 py-4  w-full bg-white z-[100]'>
        <span onClick={() => dispatch(resetBlogData())}>
          <BackChevronButton />
        </span>

        <div className="space-x-2">
          <button className='px-4 py-1 border rounded' onClick={showPreview}>
            Preview
          </button>
          <button className='px-4 py-1 border rounded' onClick={() => setIsOpen(true)}>
            Update
          </button>
        </div>
      </div>

      <div className='md:w-[80%] border-0 lg:w-[60%] w-[90%] mx-auto min-h-[300px] scrollbar-none h-fit' id='editor'>
        {cloudinaryURL
          ? <div className='lg:h-[300px] h-[200px] my-10 mx-auto w-[100%] rounded overflow-hidden' >

            <div onClick={() => {
              setCloudinaryURL('')
              setFilesSelected({})
            }} className="w-10 h-10 cursor-pointer hover:text-white absolute right-2 top-2 flex justify-center items-center rounded bg-white/20">
              <IoClose size={30} />
            </div>

            <Image alt='' className='object-cover  w-full h-full' src={cloudinaryURL} width={2000} height={800} />
          </div> :
          <div className=" mb-6">
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
                  Select a cover image to upload
                </p>
                <span className="text-gray-600 text-sm">
                  or drag and drop it here
                </span>
              </span>
              <input
                type="file"
                name="file_upload"
                className="hidden"
                // accept=".md"
                ref={inputRef}
                value={inputTagFile}
                onChange={handleInputChange}
              />
            </label>
          </div>
        }

        <div className="space-y-4 px-4 bg-slate-400 rounded-xl w-fit">
          {isUploadingImage && <div>
            uploading
          </div>}
        </div>
        {/* <ReactQuillEditor
          value={blogContent}
          onChange={(value: any) => setBlogContent(value)}
        /> */}
        <ReactQuillEditor
          value={blogContent}
          onChange={(value: any) => {
            const [title, _] = seperateBlogDataIntoComponents(value as string);
            setBlogContent(value)
            setBlogTitle(title)
          }
          }
        />
      </div>

      {isOpen && (
        <ReactPortal>
          <div className="h-screen w-screen bg-black opacity-60 fixed z-[200] top-0 flex justify-center items-center transition duration-75"></div>
          <div className="h-fit w-screen bg-transparent fixed top-0 z-[210] flex md:-translate-x-0 justify-end transition duration-75">
            <div className="w-[90%] h-screen sm:w-[450px]  z-[900] bg-[#fff] shadow-md p-4 transition duration-75 overflow-x-hidden">
              <div
                className="flex items-center gap-2 w-fit px-2 py-2 cursor-pointer border-gray-700  hover:bg-gray-100/10 text-gray-900"
                onClick={() => setIsOpen(false)}
              >

                <AiOutlineCloseCircle size={25} />

              </div>

              <form className="my-8 space-y-8 text-black">

                <div className="my-4 pr-2">
                  <CustomInput
                    type="text"
                    label="Author"
                    name="author"
                    value={author as string}
                    onChange={handleChange}
                  />
                </div>

                <div className="pr-2">
                  <label>Select Category</label>
                  <CustomSelect
                    value={selectedTags}
                    onChange={handleSelectChange}
                  />
                </div>

                <div className="my-4 pr-2">
                  <p className="capitalize">SEO Title</p>
                  <p className="text-base text-gray-500 mb-2">
                    The &quot; SEO Title &quot; will be shown in place of your Title on
                    search engine results pages, such as a Google search.
                  </p>
                  <CustomInput
                    type="text"
                    label=""
                    name="title"
                    value={blogTitle}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-10 pr-2">
                  <p className="capitalize">SEO Description</p>
                  <p className="text-base text-gray-500 mb-2">
                    The SEO Description will be used in place of your Subtitle
                    on search engine results pages. Good SEO descriptions
                    utilize keywords, summarize the article and are between
                    140-156 characters long.
                  </p>

                  <textarea id="message" rows={4} className="block p-2.5 w-full text-gray-900 bg-gray-100/50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write description..."
                    name="description"
                    value={description}
                    onChange={handleChange}></textarea>
                </div>
              </form>

              <button
                className="rounded flex gap-2 justify-center items-center hover:opacity-80 mb-2 text-center border w-full py-3"
                onClick={publishBlog}
              >
                {isLoading && <Spinner />} Update Content
              </button>
              <button
                className="rounded  text-center border  w-full py-3"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </ReactPortal>
      )}

      <ToastContainer />
    </div>
  )
}

export default EditBlog