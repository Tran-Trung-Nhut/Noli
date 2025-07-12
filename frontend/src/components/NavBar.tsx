import { useState } from "react";
import logo from "../assets/logo.png"

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* <div className="text-2xl font-bold text-sky-500">FashionStore</div> */}
        <img src={logo} className="w-44 h-16"/>
        <div className="hidden md:flex space-x-4">
            <a href="#" className="text-gray-700 hover:text-sky-500">Trang Chủ</a>
            <a href="#" className="text-gray-700 hover:text-sky-500">Cửa Hàng</a>
            <a href="#" className="text-gray-700 hover:text-sky-500">Giới Thiệu</a>
            <a href="#" className="text-gray-700 hover:text-sky-500">Liên Hệ</a>
        </div>
        <div className="flex items-center space-x-4">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18l-2 13H5L3 3zm4 18a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            </button>
        </div>
        </div>
        {isOpen && (
        <div className="md:hidden bg-white shadow-md">
            <div className="flex flex-col space-y-2 p-4">
            <a href="#" className="text-gray-700 hover:text-sky-500">Trang Chủ</a>
            <a href="#" className="text-gray-700 hover:text-sky-500">Cửa Hàng</a>
            <a href="#" className="text-gray-700 hover:text-sky-500">Giới Thiệu</a>
            <a href="#" className="text-gray-700 hover:text-sky-500">Liên Hệ</a>
            </div>
        </div>
        )}
    </nav>
    );
};

export default Navbar