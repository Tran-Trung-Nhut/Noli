import React, { useMemo, useState } from "react";

type FAQ = {
  q: string;
  a: string;
};

const FAQPage: React.FC = () => {
  const faqs: FAQ[] = [
    {
      q: "Làm sao để theo dõi đơn hàng của tôi?",
      a: "Sau khi đơn hàng được xử lý, bạn sẽ nhận được mã vận đơn qua email hoặc SMS. Dùng mã này để tra cứu tại trang đối tác vận chuyển hoặc liên hệ CSKH để được hỗ trợ."
    },
    {
      q: "Chính sách đổi trả được áp dụng như thế nào?",
      a: "Bạn có thể đổi trả trong 7 ngày kể từ khi nhận hàng nếu sản phẩm bị lỗi do nhà sản xuất hoặc khác mô tả. Sản phẩm phải còn nguyên vẹn và đầy đủ tem mác."
    },
    {
      q: "Tôi có thể thay đổi địa chỉ giao hàng sau khi đặt đơn không?",
      a: "Bạn nên liên hệ CSKH càng sớm càng tốt. Nếu đơn chưa được đóng gói hoặc giao cho đối tác vận chuyển, chúng tôi sẽ hỗ trợ đổi địa chỉ."
    },
    {
      q: "NoliShop có lưu thông tin thẻ của tôi không?",
      a: "Không. Chúng tôi không lưu trữ thông tin thẻ thanh toán trên hệ thống. Các giao dịch thanh toán trực tuyến được xử lý bởi cổng thanh toán bên thứ ba an toàn."
    },
    {
      q: "Làm sao để yêu cầu hoàn tiền?",
      a: "Khi yêu cầu hoàn tiền được xác nhận (do đổi trả hoặc hủy đơn), NoliShop sẽ xử lý hoàn tiền trong 3–7 ngày làm việc về hình thức thanh toán ban đầu hoặc chuyển khoản theo yêu cầu."
    },
    {
      q: "Tôi muốn hợp tác bán hàng trên NoliShop, bắt đầu thế nào?",
      a: "Gửi email đề xuất hợp tác tới hello@noli.example kèm thông tin cửa hàng và danh mục sản phẩm. Đội đối tác bán hàng của chúng tôi sẽ liên hệ để hướng dẫn thủ tục."
    },
    {
      q: "Làm sao để liên hệ hỗ trợ khẩn cấp?",
      a: "Bạn có thể gọi hotline 0328-282-023 (8:00 - 21:00) hoặc chat trực tiếp qua widget trên website để được hỗ trợ nhanh."
    }
  ];

  const [query, setQuery] = useState<string>("");

  // Escape regex special chars in user's query
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Filtered list based on query (case-insensitive)
  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return faqs;
    const pattern = new RegExp(escapeRegExp(q), "i");
    return faqs.filter((f) => pattern.test(f.q) || pattern.test(f.a));
  }, [query, faqs]);

  // helper: highlight matched substring with <mark>
  const highlight = (text: string, q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return text;
    const re = new RegExp(`(${escapeRegExp(trimmed)})`, "ig");
    const parts = text.split(re);
    return parts.map((part, i) =>
      re.test(part) ? (
        <mark key={i} className="bg-yellow-200 rounded px-0.5">
          {part}
        </mark>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      )
    );
  };

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <header className="w-full bg-sky-500 text-white py-16 shadow-md">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Câu hỏi thường gặp</h1>
          <p className="mt-4 text-lg md:text-xl opacity-90">Những thắc mắc phổ biến về mua sắm tại NoliShop.</p>
        </div>
      </header>

      <section className="container mx-auto px-6 max-w-5xl py-12">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="mb-6">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm câu hỏi..."
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
              aria-label="Tìm câu hỏi"
            />
            <div className="mt-2 text-sm text-gray-500">
              {query.trim() ? (
                <span>
                  Hiển thị <strong>{filtered.length}</strong> kết quả cho "<em>{query}</em>"
                </span>
              ) : (
                <span>Hiển thị tất cả câu hỏi</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-600">Không tìm thấy câu hỏi phù hợp.</div>
            ) : (
              filtered.map((f, idx) => (
                <details
                  key={idx}
                  className="bg-gray-50 rounded-lg p-4"
                  // mở mục đầu tiên trong danh sách kết quả để người dùng dễ đọc
                  open={idx === 0}
                >
                  <summary className="cursor-pointer font-medium text-gray-800">
                    {/* highlight query trong câu hỏi */}
                    {highlight(f.q, query)}
                  </summary>
                  <p className="mt-2 text-gray-700">{highlight(f.a, query)}</p>
                </details>
              ))
            )}
          </div>

          <div className="mt-8 border-t pt-6 text-gray-600">
            <p>
              Nếu bạn không tìm thấy câu trả lời, hãy{" "}
              <a href="/contact" className="text-sky-500 hover:underline">
                liên hệ bộ phận hỗ trợ
              </a>{" "}
              hoặc gọi hotline <strong>0328-282-023</strong>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FAQPage;
