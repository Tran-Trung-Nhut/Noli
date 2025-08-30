import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1350&q=80"
          alt="Fashion background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </div>

      {/* Centered content with fade-in animation */}
      <div
        className={`relative z-10 text-center p-8 transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h1 className="text-9xl font-extrabold text-sky-500 mb-4 drop-shadow-lg">404</h1>
        <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-md">Trang không tìm thấy</h2>
        <p className="text-2xl font-medium text-white mb-8 drop-shadow-sm">
          Có vẻ như bạn đã đi lạc. Hãy quay lại trang chủ để khám phá thêm.
        </p>
        <Link
          to="/"
          className="inline-block bg-sky-500 text-white px-8 py-4 rounded-md font-semibold hover:bg-sky-600 transition duration-300 transform hover:scale-105"
        >
          Quay Lại Trang Chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;