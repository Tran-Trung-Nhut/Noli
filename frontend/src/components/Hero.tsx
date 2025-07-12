import main_image from "../assets/main_image_v2.jpg"

const Hero = () => {
    return (
    <div className="relative h-[600px]">
        <img
        src={main_image}
        alt="Bộ sưu tập mới"
        className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Khám Phá Thời Trang Mới Nhất</h1>
            <p className="text-xl text-white mb-8">Mua sắm bộ sưu tập mới ngay hôm nay</p>
            <button className="bg-sky-500 text-white px-6 py-3 rounded-md hover:bg-sky-600">
            Mua Ngay
            </button>
        </div>
        </div>
    </div>
    );
};

export default Hero
