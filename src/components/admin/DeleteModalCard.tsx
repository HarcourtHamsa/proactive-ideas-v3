import React from 'react'
import { AiOutlineClose } from 'react-icons/ai';
import { IoWarning } from 'react-icons/io5';
import Spinner from '../Spinner';

function DeleteModalCard(
    { onCancel, onDelete, isLoading }:
        { onCancel: (e: any) => void, onDelete: (e: any) => void, isLoading: boolean }) {
    return (
        <div>
            <div className="flex justify-between">
                <h3 className="text-xl font-normal"> Notification</h3>

                <div
                    className="w-6 h-6 border whitespace-nowrap rounded-full flex items-center justify-center cursor-pointer"
                    onClick={onCancel}
                >
                    <AiOutlineClose size={12} />
                </div>
            </div>

            <IoWarning size={45} className="mx-auto" />

            <div className=" text-center mt-3">
                <p>Are you sure you want to delete this item?</p>



                <div className="w-full flex">
                    <button
                        className="px-4 py-2 flex justify-center w-full mr-4 rounded mt-4 border text-black"
                        onClick={onDelete}
                    >
                        {isLoading && <Spinner />} Delete
                    </button>
                    <button
                        className="px-4 py-2 w-full border rounded-md mt-4"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteModalCard