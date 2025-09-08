import React, { useState } from "react";
import { FaTiktok } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";

const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
    const [status, setStatus] = useState<{ type: "idle" | "sending" | "success" | "error"; message?: string }>({ type: "idle" });

    function update(field: string, value: string) {
        setForm((s) => ({ ...s, [field]: value }));
    }

    function validate() {
        if (!form.name.trim()) return "Vui lòng nhập tên.";
        if (!form.email.trim()) return "Vui lòng nhập email.";
        // simple email regex
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Email không hợp lệ.";
        if (!form.message.trim() || form.message.trim().length < 10) return "Vui lòng nhập tin nhắn (ít nhất 10 ký tự).";
        return null;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const err = validate();
        if (err) {
            setStatus({ type: "error", message: err });
            return;
        }
        setStatus({ type: "sending" });

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Không thể gửi liên hệ, thử lại sau.");
            setStatus({ type: "success", message: "Cảm ơn! Chúng tôi đã nhận được yêu cầu và sẽ liên hệ sớm." });
            setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        } catch (error: any) {
            setStatus({ type: "error", message: error?.message || "Có lỗi xảy ra." });
        }
    }

    return (
        <main className="bg-white text-gray-800">
            <section className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-center">Liên hệ</h1>
                    <p className="mt-3 text-gray-600 text-center">Chúng tôi sẵn sàng hỗ trợ bạn — hỏi về sản phẩm, đặt hàng số lượng lớn hoặc hợp tác.</p>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: contact details + socials */}
                <div className="col-span-1 space-y-6">
                    <div className="bg-white rounded-lg shadow-xl p-6">
                        <h3 className="text-lg font-semibold">Thông tin cửa hàng</h3>
                        <dl className="mt-4 text-sm text-gray-600 space-y-2">
                            <div>
                                <dt className="font-medium">Địa chỉ</dt>
                                <dd>Nhơn Trạch, Đồng Nai, Việt Nam</dd>
                            </div>
                            <div>
                                <dt className="font-medium">Điện thoại</dt>
                                <dd>
                                    <a href="tel:+84328282023" className="underline hover:text-gray-900">0328-282-023</a>
                                </dd>
                            </div>
                            <div>
                                <dt className="font-medium">Email</dt>
                                <dd>
                                    <a href="mailto:hello@nolishop.example" className="underline hover:text-gray-900">hello@nolishop.example</a>
                                </dd>
                            </div>
                        </dl>

                        <div className="mt-6">
                            <h4 className="text-sm font-semibold">Giờ làm việc</h4>
                            <p className="text-sm text-gray-600">Thứ 2 – Thứ 6: 08:00 – 17:00</p>
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                            <a aria-label="facebook" href="https://www.facebook.com/profile.php?id=100071433255220" className="p-2 rounded-full hover:bg-gray-100">
                                {/* svg */}
                                <FaFacebook/>
                            </a>
                            <a aria-label="tiktok" href="https://www.tiktok.com/@hongoc00" className="p-2 rounded-full hover:bg-gray-100">
                                <FaTiktok/>
                            </a>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="rounded-lg overflow-hidden shadow-xl">
                        <iframe
                            title="NoliShop location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4295.856464151949!2d106.95459579333352!3d10.701883706409182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31751902fffef8cb%3A0x9db97a6a9e5faf9a!2zVHLhu40gY2jDrSDEkeG6oXQ!5e1!3m2!1sen!2s!4v1756746747908!5m2!1sen!2s"
                            width="600"
                            height="450"
                            className="w-full h-64 border-0"
                            aria-hidden={false}
                            loading="lazy" />
                    </div>
                </div>

                {/* Right: form */}
                <div className="col-span-2">
                    <div className="bg-white rounded-lg shadow-xl p-6">
                        <h3 className="text-lg font-semibold">Gửi cho chúng tôi</h3>
                        <p className="mt-2 text-sm text-gray-600">Điền form dưới đây và chúng tôi sẽ trả lời trong vòng 1-2 ngày làm việc.</p>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className="flex flex-col">
                                    <span className="text-sm font-medium">Họ và tên</span>
                                    <input
                                        value={form.name}
                                        onChange={(e) => update("name", e.target.value)}
                                        className="mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Nguyễn Văn A"
                                        required
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-sm font-medium">Email</span>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => update("email", e.target.value)}
                                        className="mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className="flex flex-col">
                                    <span className="text-sm font-medium">Số điện thoại (không bắt buộc)</span>
                                    <input
                                        value={form.phone}
                                        onChange={(e) => update("phone", e.target.value)}
                                        className="mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="0123-456-789"
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span className="text-sm font-medium">Chủ đề</span>
                                    <input
                                        value={form.subject}
                                        onChange={(e) => update("subject", e.target.value)}
                                        className="mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Ví dụ: Hợp tác/Đặt hàng"
                                    />
                                </label>
                            </div>

                            <label className="flex flex-col">
                                <span className="text-sm font-medium">Tin nhắn</span>
                                <textarea
                                    value={form.message}
                                    onChange={(e) => update("message", e.target.value)}
                                    rows={6}
                                    className="mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Viết tin nhắn của bạn..."
                                    required
                                />
                            </label>

                            {status.type === "error" && (
                                <div className="text-sm text-red-600">{status.message}</div>
                            )}

                            {status.type === "success" && (
                                <div className="text-sm text-green-600">{status.message}</div>
                            )}

                            <div className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={status.type === "sending"}
                                    className="inline-flex items-center px-5 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {status.type === "sending" ? "Đang gửi..." : "Gửi liên hệ"}
                                </button>

                                <div className="text-sm text-gray-500">Hoặc gọi chúng tôi: <a href="tel:+84328282023" className="underline hover:text-gray-900">0328-282-023</a></div>
                            </div>
                        </form>
                    </div>

                    {/* Small FAQ */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg shadow-xl p-4">
                            <h4 className="font-semibold">Thời gian phản hồi</h4>
                            <p className="text-sm text-gray-600 mt-2">Chúng tôi thường trả lời trong 24-48 giờ làm việc.</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-xl p-4">
                            <h4 className="font-semibold">Liên hệ cho đơn hàng số lượng lớn</h4>
                            <p className="text-sm text-gray-600 mt-2">Gửi yêu cầu với chủ đề "Đặt hàng số lượng lớn" để ưu tiên xử lý.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Small CTA */}
            <section className="max-w-6xl mx-auto px-6 py-12 text-center">
                <p className="text-gray-600">Bạn cần hỗ trợ ngay? Gọi <a href="tel:+84328282023" className="underline hover:text-gray-900">0328-282-023</a></p>
            </section>
        </main>
    );
}

export default Contact
