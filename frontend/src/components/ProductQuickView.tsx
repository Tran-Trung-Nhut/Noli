// src/components/ProductQuickView.tsx
import type { Product } from "../dtos/product.dto";

type Props = {
    open: boolean;
    product: Product | null;
    onClose: () => void;
};

export default function ProductQuickView({ open, product, onClose }: Props) {
    if (!product) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            aria-hidden={!open}
            role="dialog"
            aria-modal="true"
        >
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-40"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-4xl mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-4">
                        <img src={product.image[0]} alt={product.name} className="w-full h-96 object-cover rounded" />
                    </div>

                    <div className="p-6">
                        <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                        <div className="text-sky-600 font-semibold mb-4">200000₫</div>
                        <p className="text-gray-700 mb-4">{product.description || "Không có mô tả."}</p>

                        <div className="flex gap-3">
                            <button className="bg-sky-500 text-white px-4 py-2 rounded">Thêm vào giỏ</button>
                            <button className="border px-4 py-2 rounded" onClick={onClose}>Đóng</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
