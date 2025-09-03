import { RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { FaFacebookSquare } from "react-icons/fa";
import logo from "../assets/logo.png"
import { Link } from "react-router-dom";
import { FaTiktok } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-200 border-t border-gray-800 border-gray-800 mt-12">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Top: newsletter + features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="md:col-span-1">
                        <h3 className="text-2xl font-bold text-white">Nhận tin khuyến mãi</h3>
                        <p className="mt-2 text-sm text-gray-300">
                            Đăng ký để nhận mã giảm giá, sản phẩm mới và nhiều ưu đãi khác.
                        </p>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center"
                        >
                            <label htmlFor="footer-email" className="sr-only">
                                Email của bạn
                            </label>
                            <input
                                id="footer-email"
                                type="email"
                                placeholder="Nhập email của bạn"
                                className="w-full sm:flex-1 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
                                aria-label="Email"
                            />
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center px-5 py-3 bg-sky-500 text-white rounded-md font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Đăng ký
                            </button>
                        </form>
                        <p className="mt-3 text-xs text-gray-400">Bạn có thể hủy đăng ký bất cứ lúc nào.</p>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                                {/* Truck icon */}
                                <Truck size={32}/>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white">Giao hàng nhanh</h4>
                                <p className="text-xs text-gray-400">Miễn phí cho đơn hàng từ 500.000₫</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                                <RefreshCcw size={32}/>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white">Đổi trả dễ dàng</h4>
                                <p className="text-xs text-gray-400">30 ngày đổi trả không lo rủi ro</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                                {/* Shield/lock icon */}
                               <ShieldCheck size={32}/>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white">Thanh toán an toàn</h4>
                                <p className="text-xs text-gray-400">Mã hóa và bảo vệ dữ liệu giao dịch</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Links columns */}
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-gray-800 pt-8">
                    <div>
                        <h5 className="font-semibold text-white">Cửa hàng</h5>
                        <ul className="mt-4 space-y-2 text-sm text-gray-300">
                            <li>
                                <Link to={"/shop"} className="hover:text-white">Tất cả sản phẩm</Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">Sản phẩm mới</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">Bộ sưu tập</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">Khuyến mãi</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-semibold text-white">Hỗ trợ khách hàng</h5>
                        <ul className="mt-4 space-y-2 text-sm text-gray-300">
                            <li>
                                <a href="#" className="hover:text-white">Trung tâm trợ giúp</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">Vận chuyển & giao nhận</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">Đổi trả & hoàn tiền</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">Theo dõi đơn hàng</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-semibold text-white">Về chúng tôi</h5>
                        <ul className="mt-4 space-y-2 text-sm text-gray-300">
                            <li>
                                <Link to={"/about"} className="hover:text-white">Giới thiệu</Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">Tuyển dụng</a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white">Blog</a>
                            </li>
                            <li>
                                <Link to={"/contact"} className="hover:text-white">Liên hệ</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-semibold text-white">Liên hệ</h5>
                        <address className="not-italic mt-4 text-sm text-gray-300 space-y-2">
                            <div>ĐT: <a href="tel:+84328282023" className="hover:text-white">0328-282-023</a></div>
                            <div>Email: <a href="mailto:hello@nolishop.example" className="hover:text-white">hello@noli.example</a></div>
                            <div>Địa chỉ: Nhơn Trạch, Đồng Nai</div>
                            <div className="flex items-center gap-3 mt-3">
                                {/* Social icons */}
                                <a aria-label="facebook" href="https://www.facebook.com/profile.php?id=100071433255220" className="p-1 rounded-full hover:bg-gray-100 hover:text-black">
                                    <FaFacebookSquare size={24}/>
                                </a>
                                <a aria-label="instagram" href="https://www.tiktok.com/@hongoc00" className="p-1 rounded-full hover:bg-gray-100 hover:text-black">
                                    <FaTiktok size={24}/>
                                </a>
                            </div>
                        </address>
                    </div>
                </div>

                {/* Payment + bottom */}
                <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {/* Company logo placeholder */}
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded bg-white flex items-center justify-center text-white font-bold">
                                <img src={logo}/>
                            </div>
                            <div>
                                <div className="text-sm font-semibold">NoliShop</div>
                                <div className="text-xs text-gray-400">© 2025</div>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-300">
                            <span>Thanh toán:</span>
                            {/* Payment icons (svg placeholders) */}
                            <div className="flex items-center gap-2">
                                <svg width="36" height="24" viewBox="0 0 36 24" fill="none">
                                    <rect width="36" height="24" rx="3" stroke="currentColor" strokeWidth="1" />
                                    <path d="M6 8h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                                <svg width="36" height="24" viewBox="0 0 36 24" fill="none">
                                    <rect width="36" height="24" rx="3" stroke="currentColor" strokeWidth="1" />
                                    <path d="M8 8h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                                <svg width="36" height="24" viewBox="0 0 36 24" fill="none">
                                    <rect width="36" height="24" rx="3" stroke="currentColor" strokeWidth="1" />
                                    <path d="M7 9h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-300">
                        <nav className="flex gap-4">
                            <a href="#" className="hover:text-white">Điều khoản</a>
                            <a href="#" className="hover:text-white">Chính sách bảo mật</a>
                            <a href="#" className="hover:text-white">Sơ đồ trang</a>
                        </nav>

                        <div className="flex items-center gap-3">
                            <label htmlFor="currency" className="sr-only">Currency</label>
                            <select id="currency" className="border rounded px-2 py-1 text-sm text-black">
                                <option>VND</option>
                                <option>USD</option>
                            </select>
                            <label htmlFor="lang" className="sr-only">Language</label>
                            <select id="lang" className="border rounded px-2 py-1 text-sm text-black">
                                <option>Tiếng Việt</option>
                                <option>English</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-transparent border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-3 text-center text-xs text-gray-400">Powered by <a href="https://trantrungnhut.vercel.app" target="_blank" className="underline hover:text-white">Trần Trung Nhựt</a></div>
            </div>
        </footer>
    );
};

export default Footer