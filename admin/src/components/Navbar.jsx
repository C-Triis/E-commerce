import React from 'react'
import { assets } from "../assets/assets"

const Navbar = ({ setToken }) => {
    return (
        <div className='fixed top-0 left-0 right-0 z-30 bg-white shadow-md flex items-center py-2 px-[4%] justify-between'>
            <img src={assets.logo} className='w-[max(10%,80px)]' alt="" />
            <button 
            onClick={() => setToken('')}
                className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-sm sm:text-sm'>
                Logout
            </button>
        </div>
    )
}

export default Navbar