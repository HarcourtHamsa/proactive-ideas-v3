import React from "react";
import { IoCheckmarkCircle, IoClose, IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";

const CustomToast = ({ message, type }: any) => (
  <div className="flex items-center gap-1">
    {type === "success" ?
      <IoCheckmarkCircle className="text-green-500" size={20} />
      :
      <IoCloseCircle className="text-red-500 border-white" size={20} />

    }
    <span>{message}</span>
  </div>
);

interface INotification {
  msg: string;
  type: "success" | "error";
}

function notify({ msg, type }: INotification) {
  return toast(<CustomToast message={msg} type={type} />, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    icon: false,
    theme: "dark",
    bodyStyle: {
      padding: '0 8px',
      margin: 0,
    },
    style: {
      backgroundColor: type === "error" ? "#1c1c1c" : "#1c1c1c",
      color: type === "error" ? "white" : "white",
      border: '1px solid #282828',
      height: '10px',
      display: 'flex',
      alignItems: 'center',
      padding: '0px',
      borderRadius: '4px'
    },
  });
}

export default notify;
