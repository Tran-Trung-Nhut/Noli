import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import main_image from "../assets/main_image_v2.jpg";
import { getGuestToken, notifyError, notifyWarning } from "../utils";
import { ToastContainer } from "react-toastify";
import { HttpStatusCode } from "axios";
import LoadingAuth from "../components/LoadingAuth";
import { useAuth } from "../contexts/AuthContext";
import authApi from "../apis/authApi";
import { ArrowLeft } from "lucide-react";

const Login = () => {

    const [searchParams] = useSearchParams();

    const warning = searchParams.get("warning");

    const navigate = useNavigate();
    const [username, setusername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPass, setShowPass] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { userInfo, login } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        const result = await authApi.login(username, password, getGuestToken())
        if (result.status !== HttpStatusCode.Created) {
            setLoading(false)
            notifyError(result.data.message)
            return
        }

        setLoading(false);
        login(result.data.userInfo, result.data.accessToken)
        navigate("/");
    };

    const handleLoginByGoogle = async () => {
        window.location.href = `${import.meta.env.VITE_BACKEND_DOMAIN}/auth/google`
    }

    if (userInfo) navigate("/")


    useEffect(() => {
        if (warning === "expired-refresh-token") {
            notifyWarning("Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại");
        }
    }, [warning]);

    return (
        <>
            <ToastContainer />
            {loading && <LoadingAuth />}
            <div className="min-h-screen flex">
                {/* Left hero (hidden on small screens) */}
                <div className="hidden lg:block lg:w-1/2 relative">
                    <img src={main_image} alt="Bộ sưu tập" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-center items-start p-12">
                        <h2 className="text-4xl font-bold text-white mb-4">Chào mừng trở lại</h2>
                        <p className="text-white/80 max-w-md">Đăng nhập để tiếp tục trải nghiệm mua sắm tuyệt vời với bộ sưu tập mới nhất của chúng tôi.</p>
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
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập</h1>
                        <p className="text-sm text-gray-500 mb-6">Đăng nhập bằng tài khoản của bạn để tiếp tục.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Tên đăng nhập</span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setusername(e.target.value)}
                                    placeholder="example123"
                                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm focus:border-sky-400 focus:ring focus:ring-sky-200/50"
                                    required
                                    onInvalid={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity("Vui lòng điền tên đăng nhập của bạn")}
                                    onInput={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity("")}
                                />
                            </label>

                            <label className="block relative">
                                <span className="text-sm font-medium text-gray-700">Mật khẩu</span>
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="mt-1 w-full rounded-md border-gray-200 shadow-sm pr-10 focus:border-sky-400 focus:ring focus:ring-sky-200/50"
                                    required
                                    onInvalid={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity("Vui lòng nhập mật khẩu của bạn")}
                                    onInput={(e) => (e.currentTarget as HTMLInputElement).setCustomValidity("")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass((s) => !s)}
                                    className="absolute right-2 top-[30px] text-sm text-gray-500"
                                    aria-label={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                    {showPass ? "Ẩn" : "Hiện"}
                                </button>
                            </label>

                            <div className="flex items-center justify-between text-sm">
                                <label className="inline-flex items-center gap-2">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                    <span className="text-gray-600">Ghi nhớ tôi</span>
                                </label>
                                <Link to="/forgot" className="text-sky-500 hover:underline">Quên mật khẩu?</Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-md font-medium transition disabled:opacity-60"
                            >
                                {loading ? "Đang xử lý..." : "Đăng nhập"}
                            </button>
                        </form>

                        <div className="mt-6 flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-200" />
                            <div className="text-xs text-gray-400">hoặc tiếp tục với</div>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        <div className="mt-4 flex">
                            <button
                                className="flex items-center justify-center gap-2 py-2 rounded-md border border-gray-200 hover:shadow-sm w-full"
                                onClick={() => handleLoginByGoogle()}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 12.24c0-.72-.06-1.26-.18-1.8H12v3.42h4.92c-.06.54-.36 1.26-.9 1.92l1.44 1.08C18.6 17.34 19.86 15.9 21 12.24z" fill="#4285F4" />
                                    <path d="M12 22c2.7 0 4.98-.9 6.64-2.46l-1.44-1.08c-1.02.72-2.28 1.2-5.2 1.2-3.96 0-7.3-2.64-8.5-6.18L1.78 14.5C3.44 18.9 7.4 22 12 22z" fill="#34A853" />
                                    <path d="M3.5 8.82l1.74 1.28C6.06 8.28 8.86 6.6 12 6.6c1.74 0 3.12.6 4.2 1.44l1.5-1.5C16.96 4.74 14.04 3.4 12 3.4 7.4 3.4 3.44 6.5 3.5 8.82z" fill="#FBBC05" />
                                    <path d="M12 6.6v4.8h7.56C19.98 9.24 17.22 6.6 12 6.6z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>

                            {/* <button className="flex items-center justify-center gap-2 py-2 rounded-md border border-gray-200 hover:shadow-sm">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.34 2 2 6.48 2 12.07c0 4.99 3.66 9.12 8.44 9.93v-7.03H7.9v-2.9h2.54V9.4c0-2.5 1.5-3.88 3.8-3.88 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.62.76-1.62 1.54v1.86h2.78l-.44 2.9h-2.34V22c4.78-.81 8.44-4.94 8.44-9.93z" fill="#1877F2" />
                                </svg>
                                Facebook
                            </button> */}
                        </div>

                        <p className="mt-6 text-sm text-center text-gray-500">
                            Chưa có tài khoản? <Link to="/signup" className="text-sky-500 font-medium">Đăng ký</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
