import { FaTools, FaEnvelope, FaFacebookF, FaWrench, FaCog, FaHammer } from "react-icons/fa";
import { useState } from "react";
import { FaTiktok } from "react-icons/fa6";

/**
 * Maintenance Page - Beautiful maintenance page with animations
 * 
 * Features:
 * - Animated tool icons
 * - Email subscription
 * - Social media links
 * - Responsive design
 * - Solid colors with subtle animations
 */

interface MaintenanceProps {
  title?: string;
  subtitle?: string;
  message?: string;
  supportEmail?: string;
  socialLinks?: {
    facebook?: string;
    tiktok?: string;
  };
}

export default function Maintenance({
  title = "Trang web đang bảo trì",
  subtitle = "Chúng tôi đang nâng cấp hệ thống để mang đến trải nghiệm tốt hơn cho bạn",
  message = "Xin lỗi vì sự bất tiện này. Chúng tôi sẽ quay lại sớm nhất có thể!",
  supportEmail = "support@noli.com",
  socialLinks = {
    facebook: "https://www.facebook.com/groups/672049353246308",
    tiktok: "https://www.tiktok.com/@hongoc00"  },
}: MaintenanceProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <style>{`
        /* Floating animation */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .float-animation { animation: float 4s ease-in-out infinite; }
        
        /* Swing animation for tools */
        @keyframes swing {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(15deg); }
        }
        
        .swing { animation: swing 2s ease-in-out infinite; }
        
        /* Spin animation */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .spin-slow { animation: spin-slow 8s linear infinite; }
        
        /* Fade in animation */
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        
        /* Bounce animation */
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        .bounce { animation: bounce 2s ease-in-out infinite; }
        
        /* Pulse glow */
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(14, 165, 233, 0.3); }
          50% { box-shadow: 0 0 40px rgba(14, 165, 233, 0.6); }
        }
        
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      {/* Decorative background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-sky-100 rounded-full opacity-40"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-blue-100 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 left-1/4 w-56 h-56 bg-indigo-100 rounded-full opacity-35"></div>
        <div className="absolute bottom-32 right-10 w-40 h-40 bg-sky-200 rounded-full opacity-25"></div>
      </div>

      <div className="max-w-5xl w-full mx-auto relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Animated Tools Header */}
          <div className="bg-sky-600 p-12 text-center relative overflow-hidden">
            {/* Decorative dots pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute top-8 right-12 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute bottom-6 left-16 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute bottom-4 right-8 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute top-12 left-1/3 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute bottom-8 right-1/4 w-2 h-2 bg-white rounded-full"></div>
            </div>

            {/* Animated tools icons */}
            <div className="flex justify-center items-center gap-6 mb-8 relative">
              <div className="bg-white rounded-2xl p-5 shadow-xl swing" style={{ animationDelay: '0s' }}>
                <FaWrench className="text-5xl text-sky-600" />
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl bounce pulse-glow">
                <FaTools className="text-6xl text-sky-600" />
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-xl spin-slow">
                <FaCog className="text-5xl text-sky-600" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 fade-in-up">
              {title}
            </h1>
            <p className="text-xl text-sky-50 max-w-2xl mx-auto fade-in-up" style={{ animationDelay: '0.2s' }}>
              {subtitle}
            </p>
          </div>

          {/* Main Content */}
          <div className="p-8 md:p-12">
            
            {/* Message Section */}
            <div className="text-center mb-10">
              <div className="inline-block bg-sky-50 rounded-full px-6 py-3 mb-4">
                <p className="text-sky-700 font-semibold flex items-center gap-2">
                  <FaHammer className="bounce" /> Đang trong quá trình bảo trì
                </p>
              </div>
              <p className="text-lg text-gray-600 mb-2">{message}</p>
              <p className="text-sm text-gray-500">
                Cảm ơn bạn đã kiên nhẫn chờ đợi. Chúng tôi sẽ hoàn thành sớm nhất!
              </p>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="text-center p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition duration-300">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTools className="text-2xl text-sky-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Nâng cấp hệ thống</h3>
                <p className="text-sm text-gray-600">Cải thiện hiệu suất và tốc độ</p>
              </div>
              
              <div className="text-center p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCog className="text-2xl text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Tính năng mới</h3>
                <p className="text-sm text-gray-600">Thêm nhiều tiện ích hữu ích</p>
              </div>
              
              <div className="text-center p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition duration-300">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaWrench className="text-2xl text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Tối ưu trải nghiệm</h3>
                <p className="text-sm text-gray-600">Giao diện thân thiện hơn</p>
              </div>
            </div>

            {/* Email Subscription */}
            <div className="bg-sky-50 rounded-2xl p-8 mb-8 border-2 border-sky-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
                🔔 Nhận thông báo khi website hoạt động trở lại
              </h3>
              <p className="text-sm text-gray-600 text-center mb-5">
                Để lại email và chúng tôi sẽ thông báo ngay khi hoàn tất!
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email của bạn (vd: example@email.com)"
                    className="w-full px-5 py-3 rounded-xl border-2 border-gray-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none transition"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-sky-600 text-white font-semibold rounded-xl shadow-lg hover:bg-sky-700 hover:shadow-xl transform hover:scale-105 transition duration-200"
                >
                  Đăng ký ngay
                </button>
              </form>
              {subscribed && (
                <div className="mt-4 text-center text-green-600 font-medium bg-green-50 py-3 px-4 rounded-xl border-2 border-green-200 fade-in-up">
                  ✓ Cảm ơn bạn! Chúng tôi sẽ thông báo ngay khi hoàn tất.
                </div>
              )}
            </div>

            {/* Contact & Social */}
            <div className="border-t-2 border-gray-200 pt-8">
              <div className="text-center mb-6">
                <p className="text-gray-700 font-medium mb-3">Cần hỗ trợ ngay?</p>
                <a
                  href={`mailto:${supportEmail}`}
                  className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-semibold text-lg transition hover:underline"
                >
                  <FaEnvelope className="text-xl" /> {supportEmail}
                </a>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-4">
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-110 hover:-translate-y-1 transition duration-200 shadow-lg"
                    title="Facebook"
                  >
                    <FaFacebookF className="text-lg" />
                  </a>
                )}
                {socialLinks.tiktok && (
                  <a
                    href={socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transform hover:scale-110 hover:-translate-y-1 transition duration-200 shadow-lg"
                    title="TikTok"
                  >
                    <FaTiktok className="text-lg" />
                  </a>
                )}
                
              </div>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          © {new Date().getFullYear()} Noli. Tất cả các quyền được bảo lưu.
        </div>
      </div>
    </div>
  );
}
