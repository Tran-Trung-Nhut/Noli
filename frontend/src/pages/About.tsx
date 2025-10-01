import banner from "../assets/main_image_v2.jpg"
import video from "../assets/About.mp4"
import { Link } from "react-router-dom";

const About = () => {
  return (
    <main className="bg-white text-gray-800">
      {/* Hero */}
      <section className="relative bg-cover bg-center" style={{ backgroundImage: `url(${banner})` }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-6xl mx-auto px-6 py-28 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Về NoliShop</h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
            Từ chiếc túi tái chế đầu tiên đến bộ sưu tập độc đáo ngày hôm nay — chúng tôi tạo ra thời trang bền vững, có tâm và có phong cách.
          </p>
          <div className="mt-8">
            <a href="/shop" className="inline-block bg-sky-500 text-white px-6 py-3 rounded-md font-medium hover:bg-sky-700">Khám phá cửa hàng</a>
          </div>
        </div>
      </section>

      {/* Brand story + mission */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold">Câu chuyện của chúng tôi</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              NoliShop bắt đầu với một ý tưởng đơn giản: biến những mảnh vải cũ thành những chiếc túi đẹp, bền và có hồn.
              Chúng tôi kết hợp thủ công truyền thống với tinh thần sáng tạo hiện đại để tạo ra sản phẩm mà bạn tự hào mang theo.
            </p>

            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-semibold">01</div>
                <div>
                  <div className="font-semibold">Chất lượng thủ công</div>
                  <div className="text-sm text-gray-500">Mỗi sản phẩm được kiểm tra tỉ mỉ trước khi tới tay bạn.</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-semibold">02</div>
                <div>
                  <div className="font-semibold">Thân thiện môi trường</div>
                  <div className="text-sm text-gray-500">Sử dụng vật liệu tái chế và quy trình giảm thiểu lãng phí.</div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-semibold">03</div>
                <div>
                  <div className="font-semibold">Phong cách độc đáo</div>
                  <div className="text-sm text-gray-500">Thiết kế cá tính, phù hợp với nhiều đối tượng.</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <video 
            src={video}
            controls
            playsInline
            preload="metadata"
            className="w-full h-80 object-contain" 
            aria-label="Giới thiệu quy trình làm túi của Nolishop"
            />
          </div>
        </div>
      </section>

      {/* Values / Process */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center">Quy trình của chúng tôi</h3>
          <p className="text-center text-gray-500 mt-2">Từ chọn vật liệu đến hoàn thiện — mỗi bước đều có lý do.</p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="font-semibold">Chọn vật liệu</h4>
              <p className="mt-2 text-sm text-gray-500">Lựa chọn vải bền, nhiều lớp và vật liệu tái chế.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="font-semibold">Thiết kế thủ công</h4>
              <p className="mt-2 text-sm text-gray-500">Mẫu được thử nghiệm để đảm bảo đẹp và tiện dụng.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="font-semibold">Kiểm tra chất lượng</h4>
              <p className="mt-2 text-sm text-gray-500">Kiểm tra hoàn thiện, đường may và phụ kiện trước khi đóng gói.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold text-center">Đội ngũ</h3>
        <p className="text-center text-gray-500 mt-2">Những người tạo nên sản phẩm với tâm huyết.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-xl p-6 text-center">
            <img 
            src="https://res.cloudinary.com/ddl6mayqi/image/upload/v1759306653/473595948_1728233431290094_4688151358933410849_n_krrf23.jpg" 
            alt="Director of Technology" 
            className="w-28 h-28 rounded-full mx-auto object-cover" />
            <h4 className="mt-4 font-semibold">Trần Trung Nhựt</h4>
            <p className="text-sm text-gray-500">Co-Founder & Director of Technology</p>
            <p className="mt-3 text-sm text-gray-600">Phụ trách công nghệ và hạ tầng, định hướng phát triển hệ thống, tối ưu nền tảng để mang đến trải nghiệm mua sắm hiện đại và bền vững.</p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6 text-center">
            <img 
            src="https://res.cloudinary.com/ddl6mayqi/image/upload/v1759306652/490704363_1792670114915394_2780481578076659845_n_md3vxe.jpg" 
            alt="Founder" 
            className="w-28 h-28 rounded-full mx-auto object-cover" />
            <h4 className="mt-4 font-semibold">Hồ Thị Như Ngọc</h4>
            <p className="text-sm text-gray-500">Founder & Head of Production</p>
            <p className="mt-3 text-sm text-gray-600">Chịu trách nhiệm sản xuất và quản lý quy trình thủ công, đảm bảo chất lượng, tính thẩm mỹ và sự tinh tế trong từng sản phẩm.</p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6 text-center">
            <img 
            src="https://res.cloudinary.com/ddl6mayqi/image/upload/v1759306653/485643558_2093047171134514_5280836220145442639_n_pvraxm.jpg" 
            alt="Marketing" 
            className="w-28 h-28 rounded-full mx-auto object-cover" />
            <h4 className="mt-4 font-semibold">Trần Thị Thúy An</h4>
            <p className="text-sm text-gray-500">Marketing & Community</p>
            <p className="mt-3 text-sm text-gray-600">Kết nối cộng đồng, chia sẻ câu chuyện và phong cách NoliShop.</p>
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section className="bg-sky-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-bold">Cần hỗ trợ hoặc đặt hàng số lượng lớn?</h4>
            <p className="mt-2 text-sm text-sky-100">Liên hệ trực tiếp với chúng tôi để nhận báo giá và tư vấn riêng.</p>
          </div>
          <div>
            <Link to="/contact" className="bg-white text-sky-600 px-5 py-3 rounded-md font-semibold">Liên hệ ngay</Link>
          </div>
        </div>
      </section>

      {/* FAQ / small footer note */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h4 className="text-xl font-bold text-center">Câu hỏi thường gặp</h4>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <div className="font-semibold">Làm sao để bảo quản túi?</div>
            <div className="mt-2 text-sm text-gray-500">Tránh để trực tiếp dưới ánh nắng, lau bằng khăn ẩm khi bẩn.</div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <div className="font-semibold">Chính sách đổi trả?</div>
            <div className="mt-2 text-sm text-gray-500">30 ngày đổi trả nếu lỗi do nhà sản xuất.</div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <div className="font-semibold">Hỗ trợ đơn hàng số lượng lớn?</div>
            <div className="mt-2 text-sm text-gray-500">Vui lòng liên hệ email hoặc số điện thoại để được báo giá.</div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About

