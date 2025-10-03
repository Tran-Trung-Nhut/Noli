import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingAuth from "../components/LoadingAuth";
import { useState } from "react";
import orderApi from "../apis/orderApi";
import { HttpStatusCode } from "axios";
import { formatDateTime, getOrderCurrentStatus, notifyError, notifyWarning } from "../utils";
import type { OrderDto } from "../dtos/order.dto";
import type { OrderItemShow } from "../dtos/orderItem.dto";
import type { AddressDto } from "../dtos/address.dto";
import type { OrderStatusDto } from "../dtos/orderStatus.dto";
import { STATUS_META } from "./OrderDetailPage";

export function TrackOrderPage() {
    const { userInfo } = useAuth()
    const [loading, setLoading] = useState<boolean>(false)
    const [order, setOrder] = useState<OrderDto & {
        orderItems: OrderItemShow[],
        address: AddressDto,
        orderStatuses: OrderStatusDto[]
    } | null>(null)

    const fetchOrder = async () => {
        const input = document.getElementById('orderCode') as HTMLInputElement | null

        const orderCode = input?.value

        if (orderCode === '') return notifyWarning("Vui lòng nhập mã đơn hàng!")

        if (!/^[0-9]+$/.test(orderCode || '')) return notifyWarning("Mã đơn hàng chỉ được chứa số.");

        setLoading(true)
        setOrder(null)
        const result = await orderApi.getOrder(Number(orderCode),'track-order')

        if (result.status !== HttpStatusCode.Ok) {
            setLoading(false)
            if(input) input.value = ''

            if (result.status === HttpStatusCode.NotFound) {
                return  notifyError("Không tìm thấy đơn hàng. Vui lòng kiểm tra kỹ mã đơn hàng")
            }

            return notifyError("Không thể lấy dữ liệu đơn hàng. Vui lòng thử lại!")
        }

        setOrder(result.data)
        
        if(input) input.value = ''
        setLoading(false)
    }
    return (
        <>
            {loading && <LoadingAuth />}
            <main className="min-h-screen bg-white text-gray-800">
                <header className="w-full bg-sky-500 text-white py-16 shadow-md">
                    <div className="container mx-auto px-6 max-w-5xl text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Tra cứu đơn hàng</h1>
                        <p className="mt-4 text-lg md:text-xl opacity-90">Nhập mã đơn hàng để xem trạng thái mới nhất — nhanh chóng và trực quan.</p>
                    </div>
                </header>


                <section className="container mx-auto px-6 md:w-[90%] py-12">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                            <div className="lg:col-span-2">
                                <h2 className="text-2xl font-bold">Tra cứu nhanh</h2>
                                <p className="mt-2 text-gray-600">Nhập mã đơn hàng bạn nhận được qua email hoặc SMS. Hệ thống sẽ hiển thị trạng thái vận chuyển và lịch sử cập nhật.</p>


                                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                    <label htmlFor="orderCode" className="sr-only">Mã đơn hàng</label>
                                    <input
                                        id="orderCode"
                                        name="orderCode"
                                        placeholder="Nhập mã đơn hàng (ví dụ: 65)"
                                        className="w-full sm:flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300"
                                    />


                                    <button
                                        onClick={() => fetchOrder()}
                                        type="button"
                                        className="inline-flex items-center justify-center rounded-lg px-6 py-3 bg-sky-500 text-white font-semibold shadow">
                                        Tra cứu
                                    </button>
                                </div>


                                <p className="mt-3 text-sm text-gray-500">
                                    Dưới đây là thông tin tóm tắt và tình trạng hiện tại của đơn hàng.
                                    {userInfo ? " Hãy vào đơn hàng của bạn để thao tác với đơn hàng này. " : " Hãy đăng nhập để thao tác với đơn hàng của bạn."}
                                </p>


                                <div className="mt-6 flex flex-col md:flex-row md:justify-evenly gap-2">
                                    <div className={`${order ? "": "flex-1"} p-4 bg-gray-100 rounded-lg text-center`}>
                                        <div className="text-sm font-semibold">Mã đơn</div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            {order ? (
                                                <span className="text-sky-500 font-bold">#{order.id}</span>
                                            ) : "Nhập mã để bắt đầu"}
                                        </div>
                                    </div>
                                    <div className={`${order ? "": "flex-1"} p-4 bg-gray-100 rounded-lg text-center`}>
                                        <div className="text-sm font-semibold">Tình trạng</div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            {order ? (
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${STATUS_META[getOrderCurrentStatus(order.orderStatuses)].bg}`}>
                                                    <span className={`text-sm ${STATUS_META[getOrderCurrentStatus(order.orderStatuses)].text}`}>{STATUS_META[getOrderCurrentStatus(order.orderStatuses)].icon}</span>
                                                    <span className={`text-sm font-medium ${STATUS_META[getOrderCurrentStatus(order.orderStatuses)].text}`}>{STATUS_META[getOrderCurrentStatus(order.orderStatuses)].label}</span>
                                                </div>
                                            ) : "Đang chờ tra cứu"}
                                        </div>
                                    </div>
                                    <div className={`${order ? "": "flex-1"} p-4 bg-gray-100 rounded-lg text-center`}>
                                        <div className="text-sm font-semibold">Cập nhật</div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            {order ? (
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
                                            ) : "Lịch sử sẽ hiện ở đây"}
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <aside className="lg:col-span-1 bg-sky-50 border-l-4 border-sky-200 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-sky-700">Bạn cần giúp đỡ?</h3>
                                <p className="mt-2 text-gray-700 text-sm">Nếu không tìm thấy mã hoặc cần hỗ trợ, liên hệ ngay:</p>
                                <ul className="mt-3 text-sm text-gray-700 space-y-2">
                                    <li>Hotline: <strong>0328-282-023</strong></li>
                                    <li>Email: <a href="mailto:hello@noli.example" className="text-sky-600 hover:underline">hello@noli.example</a></li>
                                    <li><a href="/faq" className="text-sky-600 hover:underline">Xem Câu hỏi thường gặp</a></li>
                                </ul>


                                <div className="mt-4">
                                    <Link to={"/contact"} className="inline-block w-full text-center rounded-lg px-4 py-2 bg-white border border-sky-200 text-sky-700 font-medium">Liên hệ hỗ trợ</Link>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}