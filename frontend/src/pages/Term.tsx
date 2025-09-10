const TermsPage = () => {
    return (
        <main className="min-h-screen bg-white text-gray-800">
            <header className="w-full bg-sky-500 text-white py-16 shadow-md">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Điều khoản sử dụng</h1>
                    <p className="mt-4 text-lg md:text-xl opacity-90">Quy định pháp lý khi sử dụng dịch vụ tại NoliShop.</p>
                </div>
            </header>


            <section className="container mx-auto px-6 max-w-5xl py-12 space-y-8">
                <article className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold">1. Chấp nhận điều khoản</h2>
                    <p className="mt-3 text-gray-700">Khi truy cập và sử dụng website NoliShop, bạn mặc nhiên đồng ý tuân thủ các điều khoản dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.</p>
                </article>


                <article className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold">2. Quyền và nghĩa vụ của khách hàng</h2>
                    <ul className="mt-3 list-disc list-inside text-gray-700 space-y-2">
                        <li>Cung cấp thông tin chính xác khi đăng ký, mua hàng.</li>
                        <li>Bảo mật tài khoản và mật khẩu, chịu trách nhiệm cho mọi hoạt động từ tài khoản.</li>
                        <li>Không sử dụng website vào mục đích gian lận, vi phạm pháp luật.</li>
                    </ul>
                </article>


                <article className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold">3. Quyền và nghĩa vụ của NoliShop</h2>
                    <ul className="mt-3 list-disc list-inside text-gray-700 space-y-2">
                        <li>Cung cấp sản phẩm, dịch vụ đúng cam kết.</li>
                        <li>Bảo mật thông tin khách hàng theo quy định pháp luật.</li>
                        <li>Có quyền thay đổi, tạm ngưng dịch vụ để bảo trì hoặc vì lý do bất khả kháng.</li>
                    </ul>
                </article>


                <article className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold">4. Trách nhiệm pháp lý</h2>
                    <p className="mt-3 text-gray-700">NoliShop không chịu trách nhiệm cho các thiệt hại gián tiếp, ngẫu nhiên do việc sử dụng dịch vụ gây ra, trừ khi pháp luật có quy định khác.</p>
                </article>


                <article className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-2xl font-bold">5. Thay đổi điều khoản</h2>
                    <p className="mt-3 text-gray-700">Chúng tôi có thể cập nhật điều khoản này theo thời gian. Khách hàng cần thường xuyên theo dõi để nắm được các thay đổi mới nhất.</p>
                </article>
            </section>
        </main>
    );
}

export default TermsPage