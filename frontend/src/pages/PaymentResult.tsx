import { FileText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FaShop } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import LoadingAuth from "../components/LoadingAuth";
import orderApi from "../apis/order.api";
import { HttpStatusCode } from "axios";
import { formatDateTime, formatPrice, getPaymentMethod, notifyError } from "../utils";
import type { OrderDto } from "../dtos/order.dto";
import type { OrderItemShow } from "../dtos/orderItem.dto";

type ResultStatus = "success" | "failure";

function useQueryParams() {
    return useMemo(() => new URLSearchParams(window.location.search), []);
}

const PaymentResult = () => {
    const [order, setOrder] = useState<OrderDto & { orderItems: OrderItemShow[] } | null>(null)
    const qs = useQueryParams();
    const navigate = useNavigate()


    const partnerCode = (qs.get("partnerCode") || "COD")

    let statusQuery = "success" as ResultStatus
    let orderId = qs.get("orderId") || "-";
    let txn = qs.get("transId") || "-";
    let message = qs.get("message") || undefined;

    if (partnerCode === "MOMO") {
        const status = (qs.get("resultCode") || "0");
        statusQuery = "success" as ResultStatus
        if (Number(status) === 1006) statusQuery = 'failure'
        txn = qs.get("transId") || "-";
        message = qs.get("message") || undefined;
    }


    const [copied, setCopied] = useState<boolean>(false);
    const [loading] = useState<boolean>(false);

    useEffect(() => {
        if (copied) {
            const t = setTimeout(() => setCopied(false), 2500);
            return () => clearTimeout(t);
        }
    }, [copied]);

    const copyTxn = async () => {
        try {
            await navigator.clipboard.writeText(txn);
            setCopied(true);
        } catch {
            // fallback: create temporary textarea
            const el = document.createElement("textarea");
            el.value = txn;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
        }
    }

    const handlePrint = () => {
        // Simple printable area approach
        const printContent = document.getElementById("invoice-print-area");
        if (!printContent) return window.print();
        const newWin = window.open("", "_blank", "width=800,height=600");
        if (!newWin) return;
        newWin.document.write(`<!doctype html><html><head><title>Invoice - ${orderId}</title><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><style>body{font-family:Inter,system-ui,Arial,sans-serif;padding:20px;color:#111} .h{font-weight:700}</style></head><body>${printContent.innerHTML}</body></html>`);
        newWin.document.close();
        newWin.focus();
        setTimeout(() => { newWin.print(); newWin.close(); }, 500);
    }

    const continueShopping = () => {
        navigate('/shop')
    }

    // async function retryPayment() {
    //     setLoading(true);
    //     try {
    //         // Replace this with real retry logic (call backend to create a new payment session)
    //         // Example: await fetch(`/api/orders/${orderId}/retry`, { method: 'POST' })
    //         await new Promise((r) => setTimeout(r, 1000));
    //         window.location.href = `/checkout?order=${orderId}`; // example
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const fetchOrderItems = async () => {
        if (orderId === "-") navigate('/invalid')

        const numberPart = orderId.replace("MOMOPAYMENT", "")

        const result = await orderApi.getOrder(Number(numberPart), 'order-detail')

        if (result.status !== HttpStatusCode.Ok) {
            notifyError("Có lỗi xảy ra. Trở về trang chủ")
        }
        setOrder(result.data)
    }

    fetchOrderItems()

    const success = statusQuery === "success";

    return (
        (order || loading) ? (
            <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-5">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                        <div className={`p-8 text-center ${success ? "bg-green-50" : "bg-red-50"}`}>
                            <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4">
                                {success ? (
                                    <svg className="w-16 h-16 text-green-600" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <svg className="w-16 h-16 text-red-600" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>

                            <h1 className={`text-2xl sm:text-3xl font-extrabold ${success ? "text-green-900" : "text-red-900"}`}>
                                {success ? "Đơn hàng thành công!" : "Đơn hàng thất bại"}
                            </h1>

                            {success ? (
                                <p className="mt-3 text-sm text-gray-600">Cảm ơn bạn! Đơn hàng của bạn đã được ghi nhận.</p>
                            ) : (
                                <p className="mt-3 text-sm text-gray-600">Rất tiếc! Thanh toán chưa hoàn tất. Bạn có thể thử lại hoặc liên hệ hỗ trợ.</p>
                            )}

                            {message && <p className="mt-2 text-sm text-gray-500">{message}</p>}

                            {order && !order.userId && <p className="mt-3 text-sm text-gray-600 font-bold italic">Dùng mã đơn hàng để kiểm tra tình trạng đơn hàng hoặc đăng nhập để thao tác với đơn hàng này của bạn.</p>}


                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                                {/* <button onClick={viewOrder} className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50">
                                Xem đơn hàng
                            </button> */}

                                <button onClick={continueShopping} className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-md shadow-sm hover:bg-sky-600">
                                    <FaShop /> Tiếp tục mua sắm
                                </button>

                                {success && (
                                    <button onClick={handlePrint} className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50">
                                        <FileText /> In hóa đơn
                                    </button>
                                )
                                    // : (
                                    //     <button onClick={retryPayment} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md shadow-sm hover:bg-yellow-600 disabled:opacity-50">
                                    //         {loading ? "Đang chuyển..." : "Thử thanh toán lại"}
                                    //     </button>
                                    // )
                                }
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700">Thông tin đơn hàng</h3>
                                    <div className="mt-3 rounded-lg bg-gray-50 p-4">
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <div>Mã đơn hàng</div>
                                            <div className="font-medium text-gray-800">{orderId}</div>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                                            <div>Số tiền</div>
                                            <div className="font-medium text-gray-800">{formatPrice(order?.totalAmount || 0)}</div>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                                            <div>Phương thức</div>
                                            <div className="font-medium text-gray-800">{getPaymentMethod(order?.paymentMethod)}</div>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                                            <div>Mã giao dịch</div>
                                            <div className="font-medium text-gray-800 flex items-center gap-2">
                                                <span>{txn}</span>
                                                <button onClick={copyTxn} aria-label="Sao chép mã" className="text-xs px-2 py-1 border rounded bg-white hover:bg-gray-100">
                                                    {copied ? "Đã sao chép" : "Sao chép"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-3 text-xs text-gray-500">Ngày: {formatDateTime(order?.createdAt.toString())}</div>
                                    </div>

                                    <div className="mt-4 text-sm text-gray-600">
                                        <p className="font-medium">Ghi chú</p>
                                        <p className="mt-2 text-xs text-gray-500">Nếu bạn cần hóa đơn điện tử, vui lòng liên hệ: <a href="mailto:accounting@nolishop.example" className="underline">accounting@nolishop.example</a></p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700">Tóm tắt đặt hàng</h3>
                                    <div id="invoice-print-area" className="mt-3 rounded-lg bg-white border p-4">
                                        {/* Example items - in production, render real items fetched from server by orderId */}
                                        <div className="space-y-3">
                                            {order?.orderItems.map((orderItem) => (
                                                <div key={orderItem.id} className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                                                            <img src={orderItem.product.image[0]} />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium">{orderItem.product.name}</div>
                                                            <div className="text-xs text-gray-500">Số lượng: {orderItem.quantity}</div>
                                                        </div>
                                                    </div>
                                                    <div className="font-medium text-gray-800">{orderItem.price}</div>
                                                </div>
                                            ))}

                                            <div className="flex-col">
                                                <div className="border-t pt-3 flex items-center justify-between">
                                                    <div className="text-sm ">Tổng đơn hàng</div>
                                                    <div className="text-sm text-gray-900">{formatPrice(order?.subTotal || 0)}</div>
                                                </div>
                                                <div className="flex mt-1 items-center justify-between">
                                                    <div className="text-sm ">Phí vận chuyển</div>
                                                    <div className="text-sm text-gray-900">{formatPrice(order?.shippingFee || 0)}</div>
                                                </div>
                                                <div className="flex mt-1 items-center justify-between">
                                                    <div className="text-sm ">Giảm giá</div>
                                                    <div className="text-sm text-gray-900">-{formatPrice(order?.discountAmount || 0)}</div>
                                                </div>
                                                <div className="border-t pt-3 flex items-center justify-between">
                                                    <div className="text-sm font-medium">Tổng cộng</div>
                                                    <div className="text-lg font-bold text-gray-900">{formatPrice(order?.totalAmount || 0)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 text-xs text-gray-500">Mã đơn hàng dùng để theo dõi và liên hệ hỗ trợ.</div>
                                </div>
                            </div>

                            <div className="mt-6 border-t pt-4 flex items-center justify-between">
                                <div className="text-sm text-gray-500">Cần trợ giúp? Email <a href="mailto:support@nolishop.example" className="underline">support@nolishop.example</a> hoặc gọi <a href="tel:+84328282023" className="underline">0328-282-023</a></div>
                                <div className="flex items-center gap-3">
                                    {/* Payment icons */}
                                    <div className="px-2 py-1 rounded bg-white shadow text-xs">Visa</div>
                                    <div className="px-2 py-1 rounded bg-white shadow text-xs">Mastercard</div>
                                    <div className="px-2 py-1 rounded bg-white shadow text-xs">MB</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        ) : (
            <LoadingAuth />
        )
    );
}

export default PaymentResult
