import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import ReactPortal from "../../../components/ReactPortal";

import { AiOutlineClose, AiOutlineCloseCircle, AiOutlineDelete } from "react-icons/ai";
import CustomSelect from "../../../components/CustomSelect";
import CustomInput from "../../../components/CustomInput";
import Spinner from "../../../components/Spinner";
// import http from "../../../lib/http";
import { createBlogPost, createBlogPostDraft, getH1Content, seperateBlogDataIntoComponents } from "../../../helper";
import useAuth from "../../../hooks/useAuth";
import { useRouter } from "next/router";
import notify from "@/components/Notification";
import { ToastContainer } from "react-toastify";
// import { useFetchCategoriesQuery } from "@/features/apiSlice";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
// import Editor from "../../../components/admin/Editor";
import BackChevronButton from "@/components/BackChevronButton";
import { TbInfoCircle, TbTrash } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { setBlogData } from "@/features/blog/blogSlice";
import { resetBlogData } from "@/features/blog/blogSlice";
import { OutputData } from "@editorjs/editorjs";

import edjsParser from "editorjs-parser";
import useRole from "@/hooks/useRole";
import { Role } from "../../../../types/types";
import Image from "next/image";
import { IoClose, IoRepeat } from "react-icons/io5";

const parser = new edjsParser();


const ReactQuillEditor = dynamic(() => import("../../../components/admin/Editor"), { ssr: false });


function Compose() {
  const [selectedCategory, setSelectedCategory] = useState<any[] | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const [description, setDescription] = useState("");
  const editorRef = useRef<any>(null);
  const router = useRouter();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const inputRef = useRef<any>();

  const [filesSelected, setFilesSelected] = useState<any>({});
  const [inputTagFile, setInputTagFile] = useState();
  const role = useRole();
  const authState = useSelector((state: RootState) => state.auth)
  const blogData = useSelector((state: RootState) => state.blog)
  const dispatch = useDispatch();

  const [blogContent, setBlogContent] = useState(blogData.content || "");
  const [title, setTitle] = useState(blogData.title || "");
  const [cloudinaryURL, setCloudinaryURL] = useState(blogData.headerImage || "")
  const [author, setAuthor] = useState("")
  const [tags, setTags] = useState("")



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

  async function handleInputChange(e: any) {
    setIsUploadingImage(true);

    const file = inputRef.current.files[0];
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onloadend = async (e: any) => {
      //Here the content has been read successfuly

      setFilesSelected(file);

      


      await imageUpload(file)
        .then((url: any) => setCloudinaryURL(url))
        .catch((error) => console.log(error))
        .finally(() => {
          setIsUploadingImage(false);
        })
    }



  }



  const imageUpload = async (img: any) => {
    const formData = new FormData()
    var url;
    formData.append("file", img)
    formData.append("upload_preset", "hqdnnphw");

    await axios.post("https://api.cloudinary.com/v1_1/dgn6edv1k/image/upload", formData)
      .then((response: any) => {
        url = response.data.secure_url;

      })


    return url;
  }


  const publishBlog = async () => {
    var [title, content] = seperateBlogDataIntoComponents(blogContent);


    setIsLoading(true);
    const tags: string[] = [];

    selectedCategory?.forEach((t: any) => {
      tags.push(t.value);
    });



    if (role === Role.superAdmin) {
      createBlogPost({
        body: {
          author: author,
          title: title,
          description: description,
          content: blogContent,
          header_image: cloudinaryURL,
          tags: tags,
          category: 'category',
          summary: description,
        },
        token: authState?.auth?.user.accessToken,
      })
        .then((res: any) => {
        
          notify({ msg: "Blog post created", type: "success" });

          setSelectedCategory(null)
          setIsOpen(false)
          setBlogContent("")
          setTitle("")
          setDescription("")
          dispatch(resetBlogData());


          router.push("/admin/blogs")

        })
        .catch((err: any) => {
        
          notify({ msg: "Could not create blog post", type: "error" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (role === Role.admin) {
      createBlogPostDraft({
        body: {
          author: author,
          title: title,
          description: description,
          content: blogContent,
          header_image: cloudinaryURL,
          tags: tags,
          category: 'category',
          summary: description,
        },
        token: authState?.auth?.user.accessToken,
      })
        .then((res: any) => {
          
          notify({ msg: "Saved as draft", type: "success" });

          setSelectedCategory(null)
          setIsOpen(false)
          setBlogContent("")
          setTitle("")
          setDescription("")
          dispatch(resetBlogData());


          router.push("/admin/blogs")

        })
        .catch((err: any) => {
         
          notify({ msg: "Could not create blog post", type: "error" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleChange = (e: any) => {
    switch (e.target.name) {
      case "title":
        setTitle(e.target.value);
        break;
      case "description":
        setDescription(e.target.value);
        break;
      case "author":
        setAuthor(e.target.value);
        break;
      case "tags":
        setTags(e.target.value);
        break;

      default:
        break;
    }
  };

  const handleSelectChange = (selectedOption: any) => {
    setSelectedCategory(selectedOption);
  };

  const showPreview = () => {
   
    
    dispatch(setBlogData({ title: title, content: blogContent, headerImage: cloudinaryURL }));
    router.push("/admin/content/preview");
  }

  return (
    <React.Fragment>
      <div className="scrollbar-none h-fit">
        <div className='flex justify-between items-center  px-4 pt-4 pb-8 bg-white z-50'>
          <div onClick={() => dispatch(resetBlogData())}>
            <BackChevronButton />
          </div>
          <ToastContainer />

          <div className="space-x-2">

            <button className='px-4 py-1 border rounded' onClick={showPreview}>
              Preview
            </button>
            <button className='px-4 py-1 border rounded' onClick={() => {
              setIsOpen(true)
            }}>
              Continue
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

              <Image alt='' className='object-cover  w-full h-full' src={cloudinaryURL} width={1000} height={800} />
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

          <div className="space-y-4 px-4 bg-slate-50 mb-4 rounded-xl w-fit">
            {isUploadingImage && <div>
              uploading
            </div>}
          </div>

          <ReactQuillEditor
            value={blogContent}
            onChange={(value: any) => {
              const [title, _] = seperateBlogDataIntoComponents(blogContent as string);
              setBlogContent(value)
              setTitle(title)
            }
            }
          />
        </div>

        {isOpen && (
          <ReactPortal>
            <div className="h-screen w-screen bg-black opacity-60 fixed z-[100] top-0 flex justify-center items-center transition duration-75"></div>
            <div className="h-fit w-screen bg-transparent fixed top-0 z-[100] flex md:-translate-x-0 justify-end transition duration-75">
              <div className="w-[90%] h-screen sm:w-[450px]  z-[100] bg-[#fff] shadow-md p-4 transition duration-75 overflow-x-hidden">
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
                      value={author}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="pr-2">
                    <label>Select Category</label>
                    <CustomSelect
                    group="blog"
                      value={selectedCategory}
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
                      value={title}
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

                  <div className="mt-10 pr-2">
                    <p className="capitalize">SEO Tags</p>
                    <textarea id="message" rows={4} className="block p-2.5 w-full text-gray-900 bg-gray-100/50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Write tags..."
                      name="tags"
                      value={tags}
                      onChange={handleChange}></textarea>
                  </div>
                </form>

                <button
                  className="rounded flex gap-2 justify-center items-center hover:opacity-80 mb-2 text-center border w-full py-3"
                  onClick={publishBlog}
                >
                  {isLoading && <Spinner />} Publish Blog
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
      </div>
    </React.Fragment>
  );
}

export default Compose;

