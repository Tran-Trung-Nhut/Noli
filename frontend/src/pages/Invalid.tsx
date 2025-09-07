import { FaHome, FaSignInAlt, FaEnvelope } from "react-icons/fa";
import InvalidSVG from "../assets/invalid.svg";

const Invalid = ({
    title = "Trang không hợp lệ",
    subtitle = "Bạn không có quyền truy cập trang này hoặc đường dẫn không tồn tại.",
    errorCode,
    supportEmail = "support@example.com",
    onGoHome,
    onLogin,
    onContact,
}: {
    title?: string;
    subtitle?: string;
    errorCode?: string | number;
    supportEmail?: string;
    onGoHome?: () => void;
    onLogin?: () => void;
    onContact?: () => void;
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-12">
            <div className="max-w-4xl w-full mx-auto space-y-8">
                {/* Top badge */}
                {/* <div className="flex justify-center">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-rose-50 text-rose-700 text-sm shadow-sm border">
                        <FaExclamationTriangle />
                        <span>Truy cập bị chặn</span>
                    </div>
                </div> */}

                {/* Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-8">
                        {/* Animated SVG illustration */}
                        <div className="flex items-center justify-center">
                            <img src={InvalidSVG} alt="Not found" className="w-72 h-72" />
                        </div>

                        {/* Content */}
                        <div className="px-2 md:px-0">
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{title}</h1>
                            <p className="text-sm md:text-base text-gray-500 mb-4">{subtitle}</p>

                            {errorCode && (
                                <div className="inline-flex items-center gap-3 px-3 py-2 rounded-md bg-gray-50 border text-sm text-gray-600 mb-4">
                                    <span className="font-medium">Mã lỗi:</span>
                                    <span className="font-mono text-slate-700">{errorCode}</span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                <button
                                    onClick={() => onGoHome?.() || (window.location.href = "/")}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg shadow hover:bg-sky-700 transition"
                                >
                                    <FaHome /> Về trang chủ
                                </button>

                                <button
                                    onClick={() => onLogin?.() || (window.location.href = "/login")}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:shadow transition text-slate-700 bg-white"
                                >
                                    <FaSignInAlt /> Đăng nhập
                                </button>
                            </div>

                            {/* Secondary actions */}
                            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                <button
                                    onClick={() => onContact?.() || (window.location.href = `mailto:${supportEmail}`)}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition"
                                >
                                    <FaEnvelope /> Liên hệ hỗ trợ
                                </button>

                                <span className="mx-2">·</span>

                                <button
                                    onClick={() => window.location.reload()}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition"
                                >
                                    Thử tải lại
                                </button>
                            </div>

                            {/* Helpful tips */}
                            <div className="mt-6 text-xs text-gray-400">
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Nếu bạn nghĩ đây là nhầm lẫn, hãy liên hệ bộ phận hỗ trợ.</li>
                                    <li>Kiểm tra lại đường dẫn hoặc thử đăng nhập bằng tài khoản có quyền.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Footer small */}
                    <div className="border-t px-6 py-3 text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-2">
                        <div>© {new Date().getFullYear()} NoliShop</div>
                        <div className="text-right">
                            <span>Trợ giúp: </span>
                            <a
                                className="underline hover:text-indigo-600"
                                href={`mailto:${supportEmail}`}
                                onClick={(e) => {
                                    if (onContact) {
                                        e.preventDefault();
                                        onContact();
                                    }
                                }}
                            >
                                {supportEmail}
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}


export default Invalid