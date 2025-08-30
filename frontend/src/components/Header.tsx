import { useState } from "react";
import logo from "../assets/logo.png"
import { FaCartShopping } from 'react-icons/fa6'
import { FaBars } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from "../contexts/AuthContext";
import { ChevronDown, CircleUserRound } from "lucide-react";
import authApi from "../apis/authApi";
import { HttpStatusCode } from "axios";
import { confirm, notifyError } from "../utils";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()
    const { userInfo, logout } = useAuth()

    const handleLogOut = async () => {
        await confirm("Đăng xuất", "Bạn có chắc chắn đăng xuất khỏi hệ thống?", async () => {
            const result = await authApi.logout(userInfo?.id || 0)

            if (result.status !== HttpStatusCode.Ok) return notifyError("Không thể đăng xuất. Vui lòng thử lại")

            logout()
        })
    }
    return (
        <>
            <nav className="sticky top-0 z-50 bg-white shadow-md flex justify-center">
                <div className="container px-4 py-2 flex justify-between items-center">
                    <img src={logo} className="w-44 h-16" />

                    <div className="hidden md:flex space-x-4">
                        <Link to="/" className="text-gray-700 hover:text-sky-500 font-bold">Trang Chủ</Link>
                        <Link to="/shop" className="text-gray-700 hover:text-sky-500 font-bold">Cửa Hàng</Link>
                        <Link to="/about" className="text-gray-700 hover:text-sky-500 font-bold">Giới Thiệu</Link>
                        <Link to="/contact" className="text-gray-700 hover:text-sky-500 font-bold">Liên Hệ</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="hover:scale-110" onClick={() => navigate('/my-cart')}>
                            <FaCartShopping size={24} />
                        </button>
                        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                            <FaBars size={24} />
                        </button>
                        {userInfo ? (
                            <div className="relative group">
                                <div className="flex items-center space-x-1 cursor-pointer">
                                    <CircleUserRound size={30} />
                                    <ChevronDown
                                        size={18}
                                        className="transition-transform group-hover:rotate-180"
                                    />
                                </div>
                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-200 invisible group-hover:visible">
                                    <ul className="py-2">
                                        <li>
                                            <button
                                                onClick={() => navigate("/profile")}
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                Thông tin cá nhân
                                            </button>
                                        </li>
                                        {/* <li>
                                            <button
                                                onClick={() => navigate("/settings")}
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                Cài đặt
                                            </button>
                                        </li> */}
                                        <li>
                                            <button
                                                onClick={() => handleLogOut()}
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                Đăng xuất
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <button className="border-2 p-1 rounded-md hover:scale-110 border-black" onClick={() => navigate('/login')}>
                                <span className="font-bold">Đăng nhập</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>
            {isOpen && (
                <div className="sticky top-20 z-50 md:hidden bg-white shadow-md">
                    <div className="hidden md:flex space-x-4">
                        <Link to="/" className="text-gray-700 hover:text-sky-500 font-bold">Trang Chủ</Link>
                        <Link to="/shop" className="text-gray-700 hover:text-sky-500 font-bold">Cửa Hàng</Link>
                        <Link to="/about" className="text-gray-700 hover:text-sky-500 font-bold">Giới Thiệu</Link>
                        <Link to="/contact" className="text-gray-700 hover:text-sky-500 font-bold">Liên Hệ</Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header