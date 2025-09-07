// src/pages/NotFoundPage.tsx
import { FaHome, FaBug, FaEnvelope } from "react-icons/fa";
import NotFoundSVG from "../assets/not-found.svg";

/**
 * NotFoundPage - responsive 404 page with animated SVG
 *
 * Props:
 *  - title, subtitle: customize text
 *  - onGoHome, onReport, onContact: optional handlers
 *  - supportEmail: mailto fallback
 */
export default function NotFoundPage({
  title = "404 — Trang không tìm thấy",
  subtitle = "Không tìm thấy trang bạn đang tìm. Có thể đường dẫn sai hoặc trang đã bị di chuyển.",
  onGoHome,
  onReport,
  onContact,
  supportEmail = "support@example.com",
}: {
  title?: string;
  subtitle?: string;
  onGoHome?: () => void;
  onReport?: () => void;
  onContact?: () => void;
  supportEmail?: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-12">
      <style>{`
        /* gentle float */
        @keyframes nf-float { 0% { transform: translateY(0); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0); } }
        .nf-float { animation: nf-float 6s ease-in-out infinite; }

        /* stroke draw for numbers */
        .nf-draw { stroke-dasharray: 400; stroke-dashoffset: 400; animation: nf-draw 1.6s ease forwards; }
        @keyframes nf-draw { to { stroke-dashoffset: 0; } }

        /* subtle rotate */
        @keyframes nf-rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .nf-rotate { animation: nf-rotate 18s linear infinite; transform-origin: center; }
      `}</style>

      <div className="max-w-[90%] w-full mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-8">
            {/* Left: animated illustration */}
            <div className="flex items-center justify-center">
              <img src={NotFoundSVG} className="w-72 h-72"/>
            </div>

            {/* Right: content */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{title}</h1>
              <p className="text-sm md:text-base text-gray-500 mb-4">{subtitle}</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onGoHome?.() || (window.location.href = "/")}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 transition"
                >
                  <FaHome /> Về trang chủ
                </button>

                <button
                  onClick={() => onReport?.() || alert("Cảm ơn — báo lỗi đã được gửi (mock).")}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:shadow transition"
                >
                  <FaBug /> Báo lỗi
                </button>
              </div>

              <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
                <button
                  onClick={() => onContact?.() || (window.location.href = `mailto:${supportEmail}`)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition"
                >
                  <FaEnvelope /> Liên hệ hỗ trợ
                </button>

                <span className="text-xs text-gray-400">·</span>

                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition text-sm"
                >
                  Thử tải lại
                </button>
              </div>

              <div className="mt-6 text-xs text-gray-400">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Kiểm tra URL hoặc quay lại trang trước.</li>
                  <li>Nếu bạn nghĩ đây là lỗi, hãy báo cho đội ngũ hỗ trợ.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t px-6 py-3 text-xs text-gray-400 flex items-center justify-between">
            <div>© {new Date().getFullYear()} YourCompany</div>
            <div>
              Hỗ trợ:{" "}
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
