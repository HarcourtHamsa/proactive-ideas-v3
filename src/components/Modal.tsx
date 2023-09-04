import React from "react";

function Modal({
  onClick,
  children,
}: {
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="h-screen w-screen bg-black opacity-60 fixed z-50 top-0 flex justify-center items-center transition duration-75"></div>
      <div className="h-screen w-screen bg-transparent fixed top-0 z-[100] flex items-center justify-center transition duration-75">
        <div className="w-[90%] h-fit sm:w-[400px] sm:h-fit z-[100] bg-[#fff] rounded shadow-md p-4 transition duration-75">
          {children}
        </div>
      </div>
    </>
  );
}

export default Modal;
