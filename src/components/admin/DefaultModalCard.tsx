import React from 'react'
import { AiOutlineClose } from 'react-icons/ai';
import { IoAlert, IoAlertCircle, IoWarning } from 'react-icons/io5';
import Spinner from '../Spinner';

function DefaultModalCard(
    { onCancel, onConfirm, isLoading }:
        { onCancel: (e: any) => void, onConfirm: (e: any) => void, isLoading: boolean }) {
    return (
        <>
            <div className="flex justify-between">
                <h3 className="text-xl font-normal"> Notification</h3>

                <div
                    className="w-6 h-6 border whitespace-nowrap rounded-full flex items-center justify-center cursor-pointer"
                    onClick={onCancel}
                >
                    <AiOutlineClose size={12} />
                </div>
            </div>

            <IoAlertCircle size={45} className="mx-auto" />

            <div className=" text-center mt-3">
                <p>Are you sure you want to change this users role?</p>



                <div className="w-fit mx-auto space-x-4 flex">
                    <button
                        className="px-4 py-2  border rounded-md mt-4"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 flex justify-center  mr-4 rounded mt-4 border text-black"
                        onClick={onConfirm}
                    >
                        {isLoading && <Spinner />} Proceed
                    </button>

                </div>
            </div>
        </>
    )
}

export default DefaultModalCard