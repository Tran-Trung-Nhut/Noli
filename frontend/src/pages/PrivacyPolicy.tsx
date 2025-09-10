const PrivacyPage = ()  =>{
    return (
        <main className="min-h-screen bg-white text-gray-800">
            <header className="w-full bg-sky-500 text-white py-16 shadow-md">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Chính sách bảo mật</h1>
                    <p className="mt-4 text-lg md:text-xl opacity-90">Bảo vệ thông tin cá nhân và quyền riêng tư của khách hàng là ưu tiên hàng đầu của NoliShop.</p>
                </div>
            </header>


            <section className="container mx-auto px-6 max-w-5xl py-12 space-y-8">
                <article className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold">1. Thông tin chúng tôi thu thập</h2>
                    <p className="mt-3 text-gray-700">Chúng tôi có thể thu thập: tên, email, số điện thoại, địa chỉ giao hàng, thông tin thanh toán và lịch sử mua hàng.</p>
                </article>


                <article className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold">2. Mục đích sử dụng</h2>
                    <ul className="mt-3 list-disc list-inside text-gray-700 space-y-2">
                        <li>Xử lý đơn hàng và giao hàng.</li>
                        <li>Gửi thông tin khuyến mãi, chăm sóc khách hàng.</li>
                        <li>Cải thiện dịch vụ, cá nhân hóa trải nghiệm mua sắm.</li>
                    </ul>
                </article>


                <article className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold">3. Chia sẻ thông tin</h2>
                    <p className="mt-3 text-gray-700">NoliShop không bán thông tin cá nhân cho bên thứ ba. Thông tin chỉ được chia sẻ khi cần thiết để vận chuyển, thanh toán hoặc khi có yêu cầu pháp luật.</p>
                </article>


                <article className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold">4. Bảo mật dữ liệu</h2>
                    <p className="mt-3 text-gray-700">Chúng tôi áp dụng biện pháp kỹ thuật (mã hóa SSL, phân quyền truy cập) và quản lý nội bộ để bảo mật dữ liệu khách hàng.</p>
                </article>


                <article className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold">5. Quyền của khách hàng</h2>
                    <ul className="mt-3 list-disc list-inside text-gray-700 space-y-2">
                        <li>Yêu cầu truy cập, chỉnh sửa hoặc xóa dữ liệu cá nhân.</li>
                        <li>Từ chối nhận email quảng cáo bất kỳ lúc nào.</li>
                        <li>Liên hệ CSKH để được hỗ trợ nhanh chóng.</li>
                    </ul>
                </article>


                <article className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold">6. Thay đổi chính sách</h2>
                    <p className="mt-3 text-gray-700">Chính sách này có thể được cập nhật theo quy định pháp luật và nhu cầu kinh doanh. Mọi thay đổi sẽ được công bố trên website.</p>
                </article>
            </section>
        </main>
    );
}
export default PrivacyPage