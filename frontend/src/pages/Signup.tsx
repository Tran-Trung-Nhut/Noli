import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import main_image from "../assets/main_image_v2.jpg";
import { getGuestToken, notifyError } from "../utils";
import { ToastContainer } from "react-toastify";
import { HttpStatusCode } from "axios";
import LoadingAuth from "../components/LoadingAuth";
import authApi from "../apis/authApi";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft } from "lucide-react";

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPass, setShowPass] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const { userInfo, login } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) return notifyError("Mật khẩu không khớp!")

        setLoading(true);

        const result = await authApi.signup(username, password, firstName, lastName, getGuestToken())
        if (result.status !== HttpStatusCode.Created) {
            setLoading(false)
            notifyError(result.data.message)
            return
        }

        login(result.data.data.userInfo, result.data.data.accessToken)

        setTimeout(() => {
            setLoading(false);

            navigate("/");
        }, 800);
    };

    if (userInfo) navigate("/")

    return (
        <>
            <ToastContainer />
            {loading && <LoadingAuth />}
            <div className="min-h-screen flex">
                {/* Left hero (full-height half) */}
                <div className="hidden lg:block lg:w-1/2 relative">
                    <img src={main_image} alt="Bộ sưu tập" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0 flex flex-col justify-center items-start p-12">
                        <h2 className="text-4xl font-bold text-white mb-4">Chào mừng đến với BestRoom</h2>
                        <p className="text-white/90 max-w-md">Tạo tài khoản để lưu giỏ hàng, theo dõi đơn hàng và nhận ưu đãi từ chúng tôi.</p>
                        <div className="mt-8 inline-flex gap-3">
                            <Link to="/" className="bg-white/10 text-white px-4 py-2 rounded-md border border-white/20">
                                Khám phá
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right form */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-20 bg-gray-50">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                        <button className="flex mb-2 justify-center items-center hover:scale-110" onClick={() => navigate("/")}><ArrowLeft color="gray" /> <span className="text-gray-500">Quay lại</span></button>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Tạo tài khoản</h1>
                        <p className="text-sm text-gray-500 mb-6">Điền thông tin để đăng ký tài khoản mới.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Họ</span>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="Nguyễn"
                                        className="mt-1 w-full rounded-md border-gray-200 shadow-sm focus:border-sky-400 focus:ring focus:ring-sky-200/50"
                                        required
                                        onInvalid={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity("Vui lòng nhập họ của bạn")}
                                        onInput={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity("")}
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Tên</span>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Văn A"
                                        className="mt-1 w-full rounded-md border-gray-200 shadow-sm focus:border-sky-400 focus:ring focus:ring-sky-200/50"
                                        required
                                        onInvalid={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity("Vui lòng nhập tên của bạn")}
                                        onInput={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity("")}
                                    />
                                </label>
                            </div>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Tên đăng nhập</span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="example123"
                                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm focus:border-sky-400 focus:ring focus:ring-sky-200/50"
                                    required
                                    onInvalid={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity("Vui lòng điền tên đăng nhập")}
                                    onInput={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity("")}
                                />
                            </label>

                            <label className="block relative">
                                <span className="text-sm font-medium text-gray-700">Mật khẩu</span>
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Ít nhất 6 ký tự"
                                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm pr-10 focus:border-sky-400 focus:ring focus:ring-sky-200/50"
                                    required
                                    minLength={6}
                                    onInvalid={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity("Mật khẩu ít nhất 6 ký tự")}
                                    onInput={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity("")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass((s) => !s)}
                                    className="absolute right-2 top-[38px] text-sm text-gray-500"
                                    aria-label={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                    {showPass ? "Ẩn" : "Hiện"}
                                </button>
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</span>
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Nhập lại mật khẩu"
                                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm pr-10 focus:border-sky-400 focus:ring focus:ring-sky-200/50"
                                    required
                                    onInvalid={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity("Vui lòng xác nhận mật khẩu")}
                                    onInput={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity("")}
                                />
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-md font-medium transition disabled:opacity-60"
                            >
                                {loading ? "Đang xử lý..." : "Đăng ký"}
                            </button>
                        </form>

                        <div className="mt-6 flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-200" />
                            <div className="text-xs text-gray-400">hoặc</div>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-500">Đã có tài khoản? <Link to="/login" className="text-sky-500 font-medium">Đăng nhập</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;
