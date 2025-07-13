import { useState } from "react";
import logo from "../assets/logo.png"
import {FaCartShopping} from 'react-icons/fa6'
import { FaBars } from "react-icons/fa";
import {useNavigate} from 'react-router-dom'

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()
    return (
        <>
            <nav className="sticky top-0 z-50 bg-white shadow-md flex justify-center">
                <div className="container px-4 py-2 flex justify-between items-center">
                    <img src={logo} className="w-44 h-16"/>

                    <div className="hidden md:flex space-x-4">
                        <a href="/" className="text-gray-700 hover:text-sky-500 font-bold">Trang Chủ</a>
                        <a href="/" className="text-gray-700 hover:text-sky-500 font-bold">Cửa Hàng</a>
                        <a href="/" className="text-gray-700 hover:text-sky-500 font-bold">Giới Thiệu</a>
                        <a href="/" className="text-gray-700 hover:text-sky-500 font-bold">Liên Hệ</a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="hover:scale-110" onClick={() => navigate('/my-cart')}>
                            <FaCartShopping size={24}/>
                        </button>
                        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                            <FaBars size={24}/>
                        </button>
                        <button className="border-2 p-1 rounded-md hover:scale-110 border-black">
                            <span className="font-bold">Đăng nhập</span>
                        </button>
                    </div>
                </div>
            </nav>
            {isOpen && (
                <div className="sticky top-20 z-50 md:hidden bg-white shadow-md">
                    <div className="flex flex-col space-y-2 p-4">
                        <a href="/" className="text-gray-700 hover:text-sky-500">Trang Chủ</a>
                        <a href="/" className="text-gray-700 hover:text-sky-500">Cửa Hàng</a>
                        <a href="/" className="text-gray-700 hover:text-sky-500">Giới Thiệu</a>
                        <a href="/" className="text-gray-700 hover:text-sky-500">Liên Hệ</a>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header