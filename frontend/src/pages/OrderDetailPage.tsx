// OrderDetailPage.tsx
import { useEffect, useState, type JSX } from "react";
import {
    FaChevronLeft,
    FaExternalLinkAlt,
    FaTruck,
    FaCreditCard,
    FaTimesCircle,
    FaRedoAlt,
    FaPhoneAlt,
} from "react-icons/fa";
import { confirm, formatDateTime, formatPrice, getOrderCurrentStatus, getPaymentMethod, notifyError, notifySuccess, notifyWarning } from "../utils"; // giữ như bạn đang dùng

// --- Types (tùy chỉnh nếu cần) ---


// --- Status meta (tailwind classes + icon + label) ---
export const STATUS_META: Record<
    string,
    { label: string; icon: JSX.Element; text: string; bg: string }
> = {
    DRAFT: {
        label: "Tạo đơn hàng thành công",
        icon: <FaExternalLinkAlt />,
        text: "text-gray-600",
        bg: "bg-gray-50",
    },
    PENDING_PAYMENT: {
        label: "Đơn hàng đã được xác nhận và chờ thanh toán",
        icon: <FaCreditCard />,
        text: "text-amber-700",
        bg: "bg-amber-50",
    },
    DELIVERY: {
        label: "Đơn hàng đang trên đường vận chuyển",
        icon: <FaTruck />,
        text: "text-sky-500",
        bg: "bg-sky-50",
    },
    COMPLETED: {
        label: "Đơn hàng đã đến tay người nhận",
        icon: <FaCheckCircle /> as any, // fallback if not imported; will be replaced below
        text: "text-emerald-600",
        bg: "bg-emerald-50",
    },
    CANCEL: {
        label: "Đơn hàng đã bị hủy",
        icon: <FaTimesCircle />,
        text: "text-rose-600",
        bg: "bg-rose-50",
    },
};

// Small fix: import FaCheckCircle properly
import { FaCheckCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingAuth from "../components/LoadingAuth";
import orderApi from "../apis/orderApi";
import { HttpStatusCode } from "axios";
import type { AddressDto } from "../dtos/address.dto";
import type { OrderItemShow } from "../dtos/orderItem.dto";
import type { OrderDto } from "../dtos/order.dto";
import type { OrderStatusDto } from "../dtos/orderStatus.dto";
import BuyAgainModal from "../components/BuyAgainModal";
import PaymentMethodModal from "../components/PaymentMethodModal";
import paymentApi from "../apis/paymentApi";

// --- Mock order (used if no prop passed) ---

// --- Component ---
const OrderDetailPage = () => {
    const location = useLocation();
    const state = location.state as { orderId: number }


    const [order, setOrder] = useState<OrderDto & { orderItems: OrderItemShow[], address: AddressDto, orderStatuses: OrderStatusDto[] } | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingMessage, setLoadingMessage] = useState<string>("")
    const [isOpenBuyAgain, setIsOpenBuyAgain] = useState<boolean>(false)
    const [isOpenChoosePaymentMethod, setIsOpenChoosePaymetMethod] = useState<boolean>(false)
    const navigate = useNavigate()

    const fetchOrderFullDetail = async () => {
        const result = await orderApi.getOrder(state.orderId)

        if (result.status !== HttpStatusCode.Ok) {
            notifyError("Có lỗi xảy ra. Vui lòng thử lại")
            navigate(-1)
        }

        setOrder(result.data)
    }

    const cancelOrder = () => {
        confirm("Hủy đơn hàng", "Bạn có chắc muốn hủy đơn hàng này? Mọi tiến trình với đơn hàng sẽ không được hồi phục!", async () => {
            setLoading(true)
            if (!order) return setLoading(false)
            const result = await orderApi.updateOrderStatus(order?.id, 'CANCEL')

            if (result.status !== HttpStatusCode.Ok) {
                setLoading(false)
                return notifyError("Có lỗi xảy ra. Vui lòng thử lại")
            }

            await fetchOrderFullDetail()
            setLoading(false)
            notifySuccess("Hủy đơn hàng thành công")
        })
    }

    const handleChoosePaymentMethod = async (paymentMethod: string) => {
        setLoading(true)
        if (!order) {
            setLoading(false)

            return notifyError("Có lỗi xảy ra. Vui lòng thử lại sau")
        }
        setIsOpenChoosePaymetMethod(false)
        if (paymentMethod === 'momo') {
            const result = await paymentApi.momo({ amount: order?.totalAmount, orderId: `MOMOPAYMENT${order.id}` })
            if (result.status !== HttpStatusCode.Created) {
                if (result.data.response.code === 'outOfStock') {
                    setLoading(false)

                    notifyWarning(`Đơn hàng này của bạn bị HỦY do sản phẩm có mã ${result.data.response.productVariantId} chỉ còn lại ${result.data.response.stock} sản phẩm. Hãy điều chỉnh số lượng muốn mua của bạn hoặc đăng ký theo dõi để nhận được thông báo khi có hàng!.`)
                    return fetchOrderFullDetail()
                }

                setTimeout(() => {
                    setLoading(false)
                    notifyError("Hệ thống thanh toán đang gặp vấn đề. Vui lòng thử lại sau")
                }, 1000)
                return
            }

            window.location.href = result.data.payUrl

        } else {

            setLoadingMessage("Đang xác nhận đơn hàng. Vui lòng đợi trong giây lát!")
            const result = await paymentApi.cod(order.id, "DELIVERY")
            if (result.status !== HttpStatusCode.Created) {
                if (result.data.response.code === 'outOfStock') {
                    setLoading(false)

                    notifyWarning(`Đơn hàng này của bạn bị HỦY do sản phẩm có mã ${result.data.response.productVariantId} chỉ còn lại ${result.data.response.stock} sản phẩm. Hãy điều chỉnh số lượng muốn mua của bạn hoặc đăng ký theo dõi để nhận được thông báo khi có hàng!.`)
                    return fetchOrderFullDetail()
                }
                notifyError("Có lỗi xảy ra. Hãy vào đơn hàng của bạn để thanh toán sau")
                return setLoading(false)
            }

            setTimeout(() => { navigate(`/payment-result?orderId=${result.data.orderId}`) }, 3000)
        }
    }

    useEffect(() => { fetchOrderFullDetail() }, [])

    return (
        !order ? (
            <LoadingAuth />
        ) : (
            <>
                <PaymentMethodModal
                    onClose={() => setIsOpenChoosePaymetMethod(false)}
                    isOpen={isOpenChoosePaymentMethod}
                    subtotal={order.subTotal}
                    shippingFee={order.shippingFee}
                    discountAmount={order.discountAmount}
                    onConfirm={handleChoosePaymentMethod}
                />

                <BuyAgainModal
                    open={isOpenBuyAgain}
                    onClose={() => setIsOpenBuyAgain(false)}
                    orderItems={order.orderItems}
                />

                {loading && <LoadingAuth message={loadingMessage} />}

                <div className="py-8 px-4">
                    <div className="max-w-[90%] mx-auto space-y-6">
                        {/* Header: back + title */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 rounded-md hover:bg-gray-100 transition"
                                aria-label="Quay lại"
                            >
                                <FaChevronLeft />
                            </button>

                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-2xl font-bold text-slate-800">Chi tiết đơn hàng</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Mã: <span className="font-medium text-indigo-600">{`#${order.id}`}</span> • tạo lúc {formatDateTime(order.createdAt.toString())}
                                </p>
                            </div>

                            {/* Status badge + actions (desktop) */}
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${STATUS_META[getOrderCurrentStatus(order.orderStatuses)].bg}`}>
                                <span className={`text-sm ${STATUS_META[getOrderCurrentStatus(order.orderStatuses)].text}`}>{STATUS_META[getOrderCurrentStatus(order.orderStatuses)].icon}</span>
                                <span className={`text-sm font-medium ${STATUS_META[getOrderCurrentStatus(order.orderStatuses)].text}`}>{STATUS_META[getOrderCurrentStatus(order.orderStatuses)].label}</span>
                            </div>
                        </div>

                        {/* Main content: 2-col on md */}
                        <div className="bg-white rounded-2xl shadow border p-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left (items + timeline) */}
                                <div className="md:col-span-2 space-y-6">
                                    {/* Items table */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Sản phẩm ({order.orderItems.length})</h3>

                                        <div className="space-y-3">
                                            {order.orderItems.map((it) => (
                                                <div key={it.id} className="flex items-center gap-4 p-3 rounded-lg border hover:shadow-sm transition">
                                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                        {it.product.image ? (
                                                            <img src={it.product.image[0]} alt={it.product.name} className="object-cover w-full h-full" />
                                                        ) : (
                                                            <div className="text-gray-400 text-xs">No image</div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <div className="font-medium text-slate-800">{it.product.name}</div>
                                                                <div className="text-xs text-gray-400 mt-1">{it.productVariant.color} {it.productVariant.size !== 'no_size' ? it.productVariant.size : ''}</div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-semibold">{formatPrice(it.price)}</div>
                                                                <div className="text-xs text-gray-500">x{it.quantity}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Lịch sử đơn hàng</h3>
                                        <div className="space-y-4">
                                            {order.orderStatuses && order.orderStatuses.length > 0 ? (
                                                order.orderStatuses.map(orderStatus => {
                                                    const m = STATUS_META[orderStatus.status];
                                                    return (
                                                        <div key={orderStatus.id} className="flex items-start gap-3">
                                                            <div className="flex-shrink-0">
                                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${m.bg}`}>
                                                                    <span className={`${m.text}`}>{m.icon}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <div className="font-medium text-slate-800">{m.label}</div>
                                                                        {/* {h.note && <div className="text-sm text-gray-500 mt-0.5">{orderStatus.note}</div>} */}
                                                                    </div>
                                                                    <div className="text-xs text-gray-400">{formatDateTime(orderStatus.createdAt.toString())}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-sm text-gray-500">Không có lịch sử.</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Customer note */}
                                    {order.note && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Ghi chú của khách</h3>
                                            <div className="p-3 rounded-lg border bg-gray-50 text-gray-700">{order.note}</div>
                                        </div>
                                    )}
                                </div>

                                {/* Right (summary, address, actions) */}
                                <aside className="space-y-5">
                                    {/* Address */}
                                    <div className="p-4 rounded-lg border bg-white">
                                        <h4 className="text-sm text-gray-500 mb-2">Địa chỉ giao hàng</h4>
                                        <div className="font-medium text-slate-800">{order.address.fullName}</div>
                                        <div className="text-sm text-gray-600">{order.address.phone}</div>
                                        <div className="text-sm text-gray-500 mt-2">{order.address.wardName}, {order.address.districtName}, {order.address.provinceName}</div>
                                        {order.note && <div className="text-xs text-gray-400 mt-2">Ghi chú: {order.note}</div>}
                                    </div>

                                    {/* Payment */}
                                    <div className="p-4 rounded-lg border bg-white">
                                        <div className="flex justify-between">
                                            <h4 className="text-sm text-gray-500 mb-2">Thanh toán</h4>
                                            {getOrderCurrentStatus(order.orderStatuses) === 'DRAFT' &&
                                                <button
                                                    className="mb-2 text-xs bg-white text-sky-500 border-none focus-none hover:text-sky-600 hover:underline"
                                                    onClick={() => setIsOpenChoosePaymetMethod(true)}
                                                >
                                                    Chọn phương thức thanh toán
                                                </button>
                                            }
                                        </div>
                                        <div className="text-sm text-gray-700">{getPaymentMethod(order.paymentMethod)}</div>
                                        <div className="text-xs text-gray-400 mt-1">Tạo lúc: {formatDateTime(order.createdAt.toString())}</div>
                                    </div>

                                    {/* Price summary */}
                                    <div className="p-4 rounded-lg border bg-white">
                                        <h4 className="text-sm text-gray-500 mb-3">Tổng cộng</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <div>Tạm tính</div>
                                                <div>{formatPrice(order.subTotal ?? 0)}</div>
                                            </div>

                                            <div className="flex justify-between text-sm text-gray-600">
                                                <div>Phí vận chuyển</div>
                                                <div>{formatPrice(order.shippingFee ?? 0)}</div>
                                            </div>

                                            <div className="flex justify-between text-sm text-gray-600">
                                                <div>Giảm giá</div>
                                                <div>-{formatPrice(order.discountAmount ?? 0)}</div>
                                            </div>

                                            <div className="border-t pt-3 flex justify-between items-center">
                                                <div className="text-sm text-gray-600">Tổng</div>
                                                <div className="text-lg font-bold text-slate-800">{formatPrice(order.totalAmount)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions for mobile & summary */}
                                    <div className="space-y-2">
                                        {getOrderCurrentStatus(order.orderStatuses) === 'COMPLETED' && (
                                            <button
                                                onClick={() => { }}
                                                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition"
                                            >
                                                Thanh toán ngay
                                            </button>
                                        )}

                                        {/* {getOrderCurrentStatus(order.orderStatuses) === 'DELIVERY' && (
                                            <button
                                                onClick={() => { }}
                                                className="w-full px-4 py-2 bg-white border rounded-md hover:shadow transition flex items-center justify-center gap-2"
                                            >
                                                <FaTruck /> Theo dõi đơn
                                            </button>
                                        )} */}

                                        <div className="flex gap-2">
                                            {(getOrderCurrentStatus(order.orderStatuses) === 'DRAFT' || getOrderCurrentStatus(order.orderStatuses) === 'PENDING_PAYMENT') && (
                                                <button
                                                    onClick={() => cancelOrder()}
                                                    className="flex-1 px-4 py-2 bg-white border rounded-md hover:shadow transition"
                                                >
                                                    Hủy đơn
                                                </button>
                                            )}

                                            <button
                                                onClick={() => setIsOpenBuyAgain(true)}
                                                className="flex-1 px-4 py-2 bg-white border rounded-md hover:shadow transition flex justify-center items-center gap-2"
                                            >
                                                <FaRedoAlt /> Mua lại
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => navigate('/contact')}
                                            className="w-full px-4 py-2 bg-white border rounded-md hover:shadow transition flex items-center justify-center gap-2"
                                        >
                                            <FaPhoneAlt /> Liên hệ hỗ trợ
                                        </button>
                                    </div>
                                </aside>
                            </div>

                            {/* Footer note */}
                            <div className="mt-5 text-xs text-gray-400">
                                Giao diện mock — bạn có thể cắm API vào các handler `onAction` (pay/cancel/track/reorder/contact) và `onBack`.
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    );
}

export default OrderDetailPage