const SitemapPage = () => {
    const sections = [
        {
            title: "Trang chính",
            links: [
                { label: "Trang chủ", to: "/" },
                { label: "Giới thiệu", to: "/about" },
                { label: "Liên hệ", to: "/contact" }
            ]
        },
        {
            title: "Cửa hàng",
            links: [
                { label: "Tất cả sản phẩm", to: "/shop" },
                { label: "Chi tiết sản phẩm", to: "/product/:id" }
            ]
        },
        {
            title: "Giỏ hàng & Thanh toán",
            links: [
                { label: "Giỏ hàng", to: "/my-cart" },
                { label: "Thanh toán", to: "/checkout" },
                { label: "Theo dõi đơn hàng", to: "/order" }
            ]
        },
        {
            title: "Tài khoản",
            links: [
                { label: "Đăng nhập", to: "/login" },
                { label: "Đăng ký", to: "/signup" },
                { label: "Tài khoản của tôi", to: "/profile" },
            ]
        },
        {
            title: "Chính sách & Hỗ trợ",
            links: [
                { label: "Chính sách chung", to: "/policy" },
                { label: "Điều khoản sử dụng", to: "/terms" },
                { label: "Chính sách bảo mật", to: "/privacy" },
                { label: "Câu hỏi thường gặp", to: "/faq" }
            ]
        },
    ]; return (
        <main className="min-h-screen bg-white text-gray-800">
            <header className="w-full bg-sky-500 text-white py-16 shadow-md">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Sơ đồ trang — NoliShop</h1>
                    <p className="mt-4 text-lg md:text-xl opacity-90">Dễ dàng tìm nhanh mọi trang trên NoliShop.</p>
                </div>
            </header>


            <section className="container mx-auto px-6 max-w-5xl py-12">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {sections.map((sec) => (
                            <div key={sec.title}>
                                <h3 className="text-xl font-semibold mb-3">{sec.title}</h3>
                                <ul className="space-y-2 text-gray-700">
                                    {sec.links.map((l) => (
                                        <li key={l.to}>
                                            {/* Use <a> so dev can later replace with Link from react-router */}
                                            <a href={l.to} className="hover:underline">{l.label}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>


                    {/* <div className="mt-8 border-t pt-6">
                        <h4 className="text-lg font-medium">Ghi chú</h4>
                        <p className="mt-2 text-gray-600">Một số route chứa tham số (ví dụ `:id`, `:slug`) — khi implement trong React Router hãy thay bằng route thực tế hoặc Link tương ứng.</p>
                    </div> */}
                </div>
            </section>
        </main>
    );
}

export default SitemapPage