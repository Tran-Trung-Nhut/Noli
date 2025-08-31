import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { FaCartShopping } from "react-icons/fa6";
import { FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ChevronDown, CircleUserRound } from "lucide-react";
import authApi from "../apis/authApi";
import { HttpStatusCode } from "axios";
import { confirm, notifyError, removeGuestToken } from "../utils";

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // mobile user dropdown
    const navigate = useNavigate();
    const { userInfo, logout } = useAuth();

    // close mobile menus on route change (optional)
    useEffect(() => {
        const unlisten = () => {
            setIsOpen(false);
            setIsUserMenuOpen(false);
        };
        return unlisten;
    }, []);

    const handleLogOut = async () => {
        await confirm("Đăng xuất", "Bạn có chắc chắn đăng xuất khỏi hệ thống?", async () => {
            const result = await authApi.logout(userInfo?.id || 0);
            if (result.status !== HttpStatusCode.Ok) return notifyError("Không thể đăng xuất. Vui lòng thử lại");
            removeGuestToken();
            logout();
            setIsOpen(false);
            setIsUserMenuOpen(false);
            navigate("/");
        });
    };

    const handleNav = (to: string) => {
        setIsOpen(false);
        setIsUserMenuOpen(false);
        navigate(to);
    };

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white shadow-md">
                <div className="container px-4 py-2 flex items-center justify-between">
                    <img src={logo} alt="logo" className="w-44 h-16 object-contain" />

                    {/* desktop links */}
                    <div className="hidden md:flex space-x-4">
                        <Link to="/" className="text-gray-700 hover:text-sky-500 font-bold">Trang Chủ</Link>
                        <Link to="/shop" className="text-gray-700 hover:text-sky-500 font-bold">Cửa Hàng</Link>
                        <Link to="/about" className="text-gray-700 hover:text-sky-500 font-bold">Giới Thiệu</Link>
                        <Link to="/contact" className="text-gray-700 hover:text-sky-500 font-bold">Liên Hệ</Link>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            className="p-1 rounded hover:scale-110 transition-transform"
                            onClick={() => navigate("/my-cart")}
                            aria-label="Giỏ hàng"
                        >
                            <FaCartShopping size={24} />
                        </button>

                        {/* mobile hamburger */}
                        <button
                            className="md:hidden p-2 rounded hover:bg-gray-100"
                            onClick={() => setIsOpen((s) => !s)}
                            aria-label="Mở menu"
                            aria-expanded={isOpen}
                        >
                            <FaBars size={24} />
                        </button>

                        {/* desktop user / login */}
                        {userInfo ? (
                            <div className="hidden md:block relative group">
                                <div className="flex items-center space-x-1 cursor-pointer">
                                    <CircleUserRound size={30} />
                                    <ChevronDown size={18} className="transition-transform group-hover:rotate-180" />
                                </div>
                                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-200 invisible group-hover:visible">
                                    <ul className="py-2">
                                        <li>
                                            <button onClick={() => navigate("/profile")} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Thông tin cá nhân</button>
                                        </li>
                                        <li>
                                            <button onClick={() => handleLogOut()} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Đăng xuất</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <button className="hidden md:inline-block border-2 p-1 rounded-md hover:scale-110 border-black" onClick={() => navigate("/login")}>
                                <span className="font-bold">Đăng nhập</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* mobile menu */}
            <div
                className={`md:hidden fixed top-[64px] left-0 right-0 z-40 transition-transform duration-200 ease-out transform ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"
                    }`}
                role="dialog"
                aria-modal="true"
            >
                <div className="bg-white shadow-md border-t border-gray-100">
                    <div className="flex flex-col px-4 py-3 space-y-2 mt-2">
                        <button onClick={() => handleNav("/")} className="text-left text-gray-700 hover:text-sky-500 font-bold">Trang Chủ</button>
                        <button onClick={() => handleNav("/shop")} className="text-left text-gray-700 hover:text-sky-500 font-bold">Cửa Hàng</button>
                        <button onClick={() => handleNav("/about")} className="text-left text-gray-700 hover:text-sky-500 font-bold">Giới Thiệu</button>
                        <button onClick={() => handleNav("/contact")} className="text-left text-gray-700 hover:text-sky-500 font-bold">Liên Hệ</button>

                        <div className="border-t border-gray-100 pt-2">
                            {/* Mobile user section with dropdown */}
                            {userInfo ? (
                                <div className="flex flex-col">
                                    <button
                                        onClick={() => setIsUserMenuOpen((s) => !s)}
                                        className="flex items-center justify-between w-full px-0 py-2 text-gray-800 hover:bg-gray-50"
                                        aria-expanded={isUserMenuOpen}
                                        aria-controls="mobile-user-menu"
                                    >
                                        <div className="flex items-center gap-2">
                                            <CircleUserRound size={20} />
                                            <span className="font-medium">{userInfo.firstName + " " + userInfo.lastName|| "Tài khoản"}</span>
                                        </div>
                                        <ChevronDown size={16} className={`transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    <div
                                        id="mobile-user-menu"
                                        className={`mt-1 overflow-hidden transition-all duration-200 ${isUserMenuOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                                            }`}
                                    >
                                        <ul className="flex flex-col">
                                            <li>
                                                <button
                                                    onClick={() => { setIsOpen(false); setIsUserMenuOpen(false); navigate("/profile"); }}
                                                    className="w-full text-left px-0 py-2 text-gray-700 hover:bg-gray-50"
                                                >
                                                    Thông tin cá nhân
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => { setIsOpen(false); setIsUserMenuOpen(false); handleLogOut(); }}
                                                    className="w-full text-left px-0 py-2 text-gray-700 hover:bg-gray-50"
                                                >
                                                    Đăng xuất
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => { setIsOpen(false); navigate("/login"); }} className="w-full text-left px-0 py-2 text-gray-700 hover:bg-gray-50">Đăng nhập</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
