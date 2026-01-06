import { FaExternalLinkAlt } from "react-icons/fa";
import { formatDateTime, formatPrice, getOrderCurrentStatus } from "../utils";
import { useEffect, useState } from "react";
import { type OrderDto } from "../dtos/order.dto";
import type { UserDto } from "../dtos/user.dto";
import orderApi from "../apis/order.api";
import { HttpStatusCode } from "axios";
import type { AddressDto } from "../dtos/address.dto";
import { useNavigate } from "react-router-dom";
import type { OrderStatusDto } from "../dtos/orderStatus.dto";


export const STATUS_COLOR_MAP: Record<string, {
    label: string;
    hex: string;            // chính màu để dùng ở CSS inline
    bgHex: string;          // background nhẹ
    tailwindText?: string;  // optional: lớp Tailwind cho text
    tailwindBg?: string;    // optional: lớp Tailwind cho bg
}> = {
    DRAFT: {
        label: "Bản nháp",
        hex: "#6B7280",        // gray-500
        bgHex: "#F3F4F6",      // gray-100
        tailwindText: "text-gray-600",
        tailwindBg: "bg-gray-100",
    },
    PENDING_PAYMENT: {
        label: "Chờ thanh toán",
        hex: "#B45309",        // amber-700
        bgHex: "#FFFBEB",      // amber-50
        tailwindText: "text-amber-700",
        tailwindBg: "bg-amber-50",
    },
    DELIVERY: {
        label: "Đang giao",
        hex: "#0EA5E9",        // sky-500
        bgHex: "#EFF8FF",      // sky-50
        tailwindText: "text-sky-500",
        tailwindBg: "bg-sky-50",
    },
    COMPLETED: {
        label: "Hoàn thành",
        hex: "#059669",        // emerald-600
        bgHex: "#ECFDF5",      // emerald-50
        tailwindText: "text-emerald-600",
        tailwindBg: "bg-emerald-50",
    },
    CANCEL: {
        label: "Đã hủy",
        hex: "#DC2626",        // red-600
        bgHex: "#FEF2F2",      // red-50
        tailwindText: "text-rose-600",
        tailwindBg: "bg-rose-50",
    },
};

const OrderList = ({
    userProfile,
    chosen
}: {
    userProfile: UserDto
    chosen: string
}) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)
    const [orders, setOrders] = useState<(OrderDto & { address: AddressDto, totalQuantity: number, orderStatuses: OrderStatusDto[] })[]>([])

    const fetchOrders = async () => {
        setLoading(true)

        const result = await orderApi.getOrderByUserId(userProfile.id, chosen)
        if (result.status !== HttpStatusCode.Ok) return setLoading(false)

        setOrders(result.data)

        setLoading(false)
    }

    useEffect(() => { fetchOrders() }, [chosen])

    return (
        <div className="bg-white rounded-2xl shadow border overflow-hidden md:mx-10 mx-5 mb-10">
            {loading ? (
                <div className="p-8 flex justify-center">
                    <div className="animate-spin w-10 h-10 border-b-2 border-indigo-600 rounded-full" />
                </div>
            ) : orders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Không có đơn hàng nào</div>
            ) : (
                <table className="w-full table-fixed">
                    <thead className="bg-gray-50">
                        <tr className="text-left text-sm text-gray-600">
                            <th className="p-4">Mã đơn hàng</th>
                            <th className="p-4">Ngày tạo</th>
                            <th className="p-4 hidden md:block">Trạng thái</th>
                            <th className="p-4 text-right">Tổng tiền</th>
                            <th className="p-4 text-center hidden md:block">Số SP</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="border-t last:border-none hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => { }}
                            >
                                <td className="p-4 align-middle">
                                    <div className="text-sm font-medium text-slate-700">{`#${order.id}`}</div>
                                    <div className="text-xs text-gray-400">{order.address.fullName} - {order.address.phone}</div>
                                </td>

                                <td className="p-4 align-middle text-sm text-gray-600">{formatDateTime(order.createdAt.toString())}</td>

                                <td className="p-4 align-middle hidden md:block">
                                    <div className="inline-flex justify-center items-center gap-2 px-3 py-1 rounded-full bg-gray-50">
                                        <span className={`text-sm text-center ${STATUS_COLOR_MAP[getOrderCurrentStatus(order.orderStatuses)].tailwindBg} ${STATUS_COLOR_MAP[getOrderCurrentStatus(order.orderStatuses)].tailwindText}`}>{STATUS_COLOR_MAP[getOrderCurrentStatus(order.orderStatuses)].label}</span>
                                    </div>
                                </td>

                                <td className="p-4 align-middle text-right font-semibold">{formatPrice(order.totalAmount)}</td>

                                <td className="p-4 align-middle text-center text-sm hidden md:block">{order.totalQuantity}</td>

                                <td className="p-4 align-middle text-center">
                                    <button
                                        onClick={() => navigate('/order', {state: {orderId: order.id}})}
                                        className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-sm hover:shadow-sm"
                                    >
                                        <FaExternalLinkAlt size={12} />
                                        <span>Xem</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default OrderList