import React from 'react'
import { AiOutlineClose } from 'react-icons/ai';
import { IoAlert, IoAlertCircle, IoWarning } from 'react-icons/io5';
import Spinner from '../Spinner';

function DefaultModalCard(
    { onCancel, onConfirm, isLoading, label }:
        { onCancel: (e: any) => void, onConfirm: (e: any) => void, isLoading: boolean, label?: string }) {
    return (
        <>
            <div className="flex justify-between mb-4">
                <p className="text-lg font-normal"> Notification</p>

                <div
                    className="w-6 h-6 border whitespace-nowrap rounded-full flex items-center justify-center cursor-pointer"
                    onClick={onCancel}
                >
                    <AiOutlineClose size={12} />
                </div>
            </div>

            <IoAlertCircle size={45} className="mx-auto" />

            <div className=" text-center mt-3">
                <p>{label ? label : "Are you sure you want to change this users role?"}</p>



                <div className=" space-x-4 flex">
                    <button
                        className="px-4 py-2 bg-orange-400/20 text-orange-400 w-full rounded mt-4"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 w-full bg-orange-400 text-white flex justify-center  mr-4 rounded mt-4"
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