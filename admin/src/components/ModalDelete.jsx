import React from 'react'

const ModalDelete = ({ isOpen, onRequestClose, onConfirm }) => {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg w-120">
                <p className="text-lg font-medium m-4 py-5">Are you sure you want to delete this product?</p>
                <div className="flex justify-end gap-5">
                    <button
                        onClick={onRequestClose}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModalDelete