// BuyAgainModal.tsx
import { useEffect, useState } from "react";
import type {OrderItemShow } from "../dtos/orderItem.dto";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils";

const BuyAgainModal = ({
    open,
    onClose,
    orderItems = [],
}: {
    open: boolean;
    onClose: () => void;
    orderItems: OrderItemShow[];
}) => {
    const safeInitial =  orderItems[0]?.id ?? null
    const [selectedId, setSelectedId] = useState<number | string | null>(safeInitial);
    const [quantity, setQuantity] = useState<number>(1);
    const navigate = useNavigate()

    // Reset/restore when open toggles
    useEffect(() => {
        if (open) {
            setSelectedId(safeInitial);
            setQuantity(1);
            // lock background scroll
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open, safeInitial]);

    // close on ESC
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (open) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    const selected = orderItems.find((i) => i.id === selectedId) ?? null;


    const handleConfirm = () => {
        if (!selectedId) return;

        navigate('/checkout', {state: { product: selected?.product, productVariant: selected?.productVariant, quantity }})
        };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
            aria-labelledby="buy-again-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-3xl mx-4 md:mx-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                        <h3 id="buy-again-title" className="text-lg font-semibold text-slate-800">
                            Mua lại đơn hàng
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Chọn 1 sản phẩm để mua lại</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            aria-label="Đóng"
                            className="text-gray-500 hover:text-gray-700 p-2 rounded-md"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-3 max-h-[60vh] overflow-auto pr-2">
                        {orderItems.length === 0 && (
                            <div className="text-sm text-gray-500">Không có sản phẩm để mua lại.</div>
                        )}

                        {orderItems.map((it) => {
                            const active = it.id === selectedId;
                            return (
                                <label
                                    key={it.id}
                                    className={`flex items-center gap-4 p-3 rounded-lg border transition-shadow cursor-pointer ${active ? "ring-2 ring-sky-400 bg-sky-50" : "hover:shadow-sm bg-white"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="buyagain-item"
                                        checked={active}
                                        onChange={() => {
                                            setSelectedId(it.id);
                                            setQuantity(1);
                                        }}
                                        className="form-radio h-4 w-4 text-sky-500"
                                    />

                                    <img
                                        src={it.product.image[0]}
                                        alt={it.product.name}
                                        className="w-16 h-16 object-cover rounded-md border"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium text-slate-800 truncate">{it.product.name}</div>
                                            <div className="text-sm font-semibold text-slate-800">{formatPrice(it.price)}</div>
                                        </div>

                                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                                           <span>{it.productVariant.color} {it.productVariant.size !== 'no_size' ? "-" + it.productVariant.color : ""}</span>
                                        </div>
                                    </div>
                                </label>
                            );
                        })}
                    </div>

                    {/* Right: details & actions */}
                    <div className="md:col-span-1 border-l pl-4">
                        <div className="text-sm text-gray-600">Sản phẩm đã chọn</div>

                        {!selected && (
                            <div className="mt-4 text-sm text-gray-500">Vui lòng chọn 1 sản phẩm ở bên trái.</div>
                        )}

                        {selected && (
                            <div className="mt-4 space-y-4">
                                <div className="flex items-center gap-3">
                                    <img src={selected.product.image[0]} alt="" className="w-20 h-20 object-cover rounded-md border" />
                                    <div>
                                        <div className="text-sm font-medium text-slate-800">{selected.product.name}</div>
                                        <div className="text-sm text-gray-500">{selected.productVariant.color + selected.productVariant.size !== 'no_size' ? selected.productVariant.size : ""}</div>
                                        <div className="text-lg font-semibold text-slate-800 mt-2">{formatPrice(selected.price)}</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-600 mb-2">Số lượng</div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {setQuantity(quantity === 1 ? quantity : quantity - 1)}}
                                            className="w-9 h-9 rounded-lg border flex items-center justify-center"
                                            aria-label="Giảm"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            min={1}
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
                                            className="w-20 text-center px-3 py-2 border rounded-lg"
                                        />
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-9 h-9 rounded-lg border flex items-center justify-center"
                                            aria-label="Tăng"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-2 border-t" />

                                <div className="text-sm text-gray-600">
                                    Tạm tính <span className="float-right font-semibold text-slate-800">{formatPrice((selected.price ?? 0) * quantity)}</span>
                                </div>

                                <div className="mt-4 flex flex-col gap-3">
                                    <button
                                        onClick={handleConfirm}
                                        disabled={!selected}
                                        className={`w-full px-4 py-3 rounded-lg text-white font-semibold ${selected ? "bg-sky-500 hover:opacity-95" : "bg-gray-300 cursor-not-allowed"}`}
                                    >
                                        Xác nhận
                                    </button>

                                    <button
                                        onClick={onClose}
                                        className="w-full px-4 py-3 rounded-lg border bg-white hover:bg-gray-50"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BuyAgainModal