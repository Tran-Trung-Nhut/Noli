import { Link } from "react-router-dom";

const PolicyPage = ({ accentClass = "bg-sky-500" }: { accentClass?: string; }) => {
    return (
        <main className="min-h-screen bg-white text-gray-800">
            {/* Hero */}
            <header className={`w-full ${accentClass} text-white py-16 shadow-md`}>
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Chính sách & Điều Khoản — NoliShop</h1>
                    <p className="mt-4 text-lg md:text-xl opacity-90">An toàn - Minh bạch - Tiện lợi. Mọi thông tin dưới đây nhằm bảo vệ quyền lợi của bạn khi mua sắm tại NoliShop.</p>
                    <div className="mt-6 flex justify-center gap-3">
                        <a href="#vanchuyen" className="inline-block rounded-full bg-white text-gray-900 px-5 py-2 font-semibold shadow">Xem chính sách</a>
                        <a href="#lienhe" className="inline-block rounded-full border border-white/40 px-5 py-2 font-medium">Liên hệ hỗ trợ</a>
                    </div>
                </div>
            </header>

            <section className="container mx-auto px-6 max-w-5xl py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left nav for large screens */}
                <nav className="hidden lg:block lg:col-span-1 sticky top-24">
                    <ul className="space-y-2 text-sm">
                        <li><a href="#vanchuyen" className="block px-4 py-2 rounded-lg hover:bg-gray-100">Chính sách vận chuyển</a></li>
                        <li><a href="#doitra" className="block px-4 py-2 rounded-lg hover:bg-gray-100">Chính sách đổi trả</a></li>
                        <li><a href="#baomat" className="block px-4 py-2 rounded-lg hover:bg-gray-100">Bảo mật thông tin</a></li>
                        <li><a href="#thanhtoan" className="block px-4 py-2 rounded-lg hover:bg-gray-100">Thanh toán</a></li>
                        <li><a href="#hoantra" className="block px-4 py-2 rounded-lg hover:bg-gray-100">Hoàn tiền & Bảo hành</a></li>
                        <li><a href="#faq" className="block px-4 py-2 rounded-lg hover:bg-gray-100">Câu hỏi thường gặp</a></li>
                        <li><a href="#lienhe" className="block px-4 py-2 rounded-lg hover:bg-gray-100">Liên hệ</a></li>
                    </ul>
                </nav>

                <div className="lg:col-span-3 space-y-8">
                    {/* Section - Vận chuyển */}
                    <article id="vanchuyen" className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-2xl font-bold">Chính sách vận chuyển</h2>
                        <p className="mt-3 text-gray-700">Tại NoliShop, chúng tôi cam kết giao hàng nhanh chóng và an toàn. Các điểm chính:</p>
                        <ul className="mt-3 list-disc list-inside text-gray-700 space-y-2">
                            <li>Thời gian xử lý đơn hàng: <strong>1–2 ngày làm việc</strong> (không bao gồm Thứ 7, Chủ nhật và ngày lễ).</li>
                            <li>Thời gian vận chuyển nội tỉnh: <strong>1–3 ngày</strong>. Liên tỉnh: <strong>2–6 ngày</strong> tùy khu vực.</li>
                            <li>Phí vận chuyển được hiển thị khi tạo đơn. Miễn phí vận chuyển cho đơn hàng từ <strong>500.000₫</strong> (hoặc chương trình khuyến mãi khác).</li>
                            <li>Quý khách vui lòng kiểm tra hàng trước khi ký nhận. Mọi khiếu nại về hàng bị hỏng trong quá trình vận chuyển cần báo trong vòng <strong>48 giờ</strong> kể từ khi nhận hàng.</li>
                        </ul>
                    </article>

                    {/* Section - Đổi trả */}
                    <article id="doitra" className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-2xl font-bold">Chính sách đổi trả</h2>
                        <p className="mt-3 text-gray-700">Chúng tôi hiểu rằng có thể có trường hợp sản phẩm không như mong đợi. Chính sách đổi trả như sau:</p>
                        <ul className="mt-3 list-disc list-inside text-gray-700 space-y-2">
                            <li>Đổi trả trong <strong>7 ngày</strong> kể từ ngày nhận hàng nếu sản phẩm bị lỗi do nhà sản xuất hoặc không đúng mô tả.</li>
                            <li>Sản phẩm cần còn nguyên vẹn, chưa qua sử dụng, đầy đủ tem, nhãn và hộp (nếu có).</li>
                            <li>Chi phí vận chuyển trong trường hợp đổi trả do lỗi NoliShop sẽ do chúng tôi chịu. Nếu đổi trả do lý do khách hàng (không thích, chọn sai màu, sai size...), phí vận chuyển sẽ do khách chịu.</li>
                            <li>Để yêu cầu đổi trả, vui lòng liên hệ bộ phận CSKH kèm mã đơn hàng và hình ảnh minh họa.</li>
                        </ul>
                    </article>

                    {/* Section - Bảo mật */}
                    <article id="baomat" className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-2xl font-bold">Bảo mật & Quyền riêng tư</h2>
                        <p className="mt-3 text-gray-700">NoliShop cam kết bảo vệ thông tin cá nhân của bạn. Chúng tôi chỉ thu thập và sử dụng thông tin cần thiết cho việc xử lý đơn hàng và cung cấp dịch vụ.</p>
                        <ul className="mt-3 list-disc list-inside text-gray-700 space-y-2">
                            <li>Thông tin cá nhân bao gồm tên, địa chỉ, điện thoại, email và thông tin thanh toán (nếu có).</li>
                            <li>Chúng tôi không chia sẻ thông tin cá nhân với bên thứ ba ngoài trường hợp cần thiết (vận chuyển, xử lý thanh toán) và chỉ khi có sự đồng ý hoặc bắt buộc theo pháp luật.</li>
                            <li>Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý để bảo mật dữ liệu: mã hóa, phân quyền truy cập và sao lưu định kỳ.</li>
                            <li>Quý khách có quyền yêu cầu chỉnh sửa hoặc xóa thông tin cá nhân theo quy định pháp luật.</li>
                        </ul>
                    </article>

                    {/* Section - Thanh toán */}
                    <article id="thanhtoan" className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-2xl font-bold">Thanh toán</h2>
                        <p className="mt-3 text-gray-700">Chúng tôi hỗ trợ nhiều phương thức thanh toán để tối ưu trải nghiệm người dùng:</p>
                        <ul className="mt-3 list-disc list-inside text-gray-700 space-y-2">
                            <li>Thanh toán khi nhận hàng (COD) — khả dụng tùy khu vực.</li>
                            <li>Chuyển khoản ngân hàng/ Internet Banking.</li>
                            <li>Thanh toán online qua cổng thanh toán (thẻ tín dụng/ghi nợ, ví điện tử).</li>
                            <li>Mọi giao dịch đều được bảo mật; NoliShop không lưu trữ thông tin thẻ của khách hàng trên hệ thống.</li>
                        </ul>
                    </article>

                    {/* Section - Hoàn tiền & Bảo hành */}
                    <article id="hoantra" className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-2xl font-bold">Hoàn tiền & Bảo hành</h2>
                        <p className="mt-3 text-gray-700">NoliShop xử lý hoàn tiền nhanh chóng và minh bạch:</p>
                        <ul className="mt-3 list-disc list-inside text-gray-700 space-y-2">
                            <li>Thời gian xử lý hoàn tiền: <strong>3–7 ngày làm việc</strong> kể từ khi đơn hàng được xác nhận đổi trả/hoàn tiền.</li>
                            <li>Hình thức hoàn tiền: chuyển khoản vào tài khoản của khách hoặc hoàn qua cổng thanh toán tùy theo phương thức thanh toán ban đầu.</li>
                            <li>Bảo hành sản phẩm theo chính sách nhà sản xuất; thông tin chi tiết được ghi trên trang sản phẩm hoặc phiếu bảo hành kèm theo.</li>
                        </ul>
                    </article>

                    {/* Section - FAQ using details */}
                    <article id="faq" className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-2xl font-bold">Câu hỏi thường gặp</h2>
                        <div className="mt-4 space-y-3">
                            <details className="bg-gray-50 rounded-lg p-3">
                                <summary className="cursor-pointer font-medium">Làm sao để theo dõi đơn hàng?</summary>
                                <p className="mt-2 text-gray-700">Sau khi đơn hàng được xử lý, bạn sẽ nhận được mã vận đơn qua email/SMS. Dùng mã này để tra cứu trạng thái tại trang vận chuyển hoặc báo cho chúng tôi để hỗ trợ.</p>
                            </details>

                            <details className="bg-gray-50 rounded-lg p-3">
                                <summary className="cursor-pointer font-medium">Tôi muốn hủy đơn thì làm thế nào?</summary>
                                <p className="mt-2 text-gray-700">Bạn có thể hủy đơn trước khi đơn được đóng gói. Vui lòng liên hệ CSKH ngay để chúng tôi xử lý kịp thời.</p>
                            </details>

                            <details className="bg-gray-50 rounded-lg p-3">
                                <summary className="cursor-pointer font-medium">Thời gian đổi trả có thể gia hạn không?</summary>
                                <p className="mt-2 text-gray-700">Trong một số trường hợp đặc biệt (dịch, thiên tai...), NoliShop có thể gia hạn thời gian đổi trả. Thông tin sẽ được cập nhật trên trang chính sách và thông báo tới khách hàng.</p>
                            </details>
                        </div>
                        <Link to={'/faq'}  className={`text-sky-500 pt-3`}>Xem thêm câu hỏi thường gặp </Link>
                    </article>

                    {/* Section - Contact */}
                    <article id="lienhe" className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-2xl font-bold">Liên hệ hỗ trợ</h2>
                        <p className="mt-3 text-gray-700">Nếu bạn cần hỗ trợ nhanh, hãy liên hệ:</p>
                        <ul className="mt-3 list-inside text-gray-700 space-y-2">
                            <li>Hotline: <strong>0328-282-023</strong> (8:00 - 21:00)</li>
                            <li>Email: <strong>hello@noli.example</strong></li>
                            <li>Hoặc đặt câu hỏi tại <Link to={'/contact'} className="text-sky-500">trang liên hệ</Link>.</li>
                        </ul>
                    </article>

                </div>
            </section>
        </main>
    );
}

export default PolicyPage