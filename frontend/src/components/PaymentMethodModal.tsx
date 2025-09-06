import { useEffect, useState } from "react";
import { formatPrice } from "../utils";

const PaymentMethodModal = ({
    isOpen,
    onClose,
    subtotal,
    shippingFee,
    discountAmount,
    onConfirm
}: {
    isOpen: boolean;
    onClose: () => void;
    subtotal: number;
    shippingFee: number | null;
    discountAmount: number;
    onConfirm: (pạymentMethod: string) => void;
}) => {
    const [method, setMethod] = useState<string>("cod");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) setMethod("cod");
    }, [isOpen]);

    if (!isOpen) return null;

    const total = subtotal - discountAmount + (shippingFee ?? 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Chọn phương thức thanh toán</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Đóng</button>
                </div>

                <div className="space-y-4">
                    <label className={`flex items-center gap-3 p-3 rounded border ${method === 'cod' ? 'border-sky-500' : 'border-gray-200'}`}>
                        <input type="radio" name="payment" checked={method === 'cod'} onChange={() => setMethod('cod')} />
                        <div>
                            <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                            <div className="text-xs text-gray-500">Thanh toán bằng tiền mặt cho nhân viên giao hàng</div>
                        </div>
                    </label>

                    <label className={`flex items-center gap-3 p-3 rounded border ${method === 'momo' ? 'border-sky-500' : 'border-gray-200'}`}>
                        <input type="radio" name="payment" checked={method === 'momo'} onChange={() => setMethod('momo')} />
                        <div>
                            <div className="font-medium">Thanh toán Momo</div>
                            <div className="text-xs text-gray-500">Thanh toán qua ví Momo (chuyển hướng tới cổng thanh toán)</div>
                        </div>
                    </label>

                    <div className="pt-2 border-t text-sm">
                        <div className="text-sm text-gray-600 italic mb-2">Vui lòng kiểm tra thông tin đơn hàng thật kỹ trước khi thanh toán</div>
                        <div className="flex justify-between">
                            <span>Tạm tính</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        {discountAmount > 0 && (
                            <div className="flex justify-between mt-2">
                                <span>Giảm giá</span>
                                <span className="text-red-500">- {formatPrice(discountAmount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between mt-2">
                            <span>Phí vận chuyển</span>
                            <span>{shippingFee == null ? '—' : formatPrice(shippingFee)}</span>
                        </div>
                        <div className="flex justify-between font-bold pt-3">
                            <span>Tổng cần thanh toán</span>
                            <span className="text-sky-600">{formatPrice(total)}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    await onConfirm(method);
                                } catch (err) {
                                    // onConfirm should already handle errors, but catch to stop loading
                                    console.error(err);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            className="flex-1 bg-sky-600 text-white py-2 rounded-md font-semibold hover:bg-sky-700 disabled:opacity-60"
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : 'Xác nhận và thanh toán'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodModal