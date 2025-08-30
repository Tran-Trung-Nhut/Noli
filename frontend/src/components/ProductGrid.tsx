// src/components/ProductGrid.tsx
import ProductCard from "./ProductCart";
import ProductCardSkeleton from "./ProductCartSkeleton";
import type { Product } from "../dtos/product.dto";

type Props = {
    products: Product[];
    loading: boolean;
};

export default function ProductGrid({ products, loading }: Props) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!loading && products.length === 0) {
        return (
            <div className="text-center py-20">
                <h3 className="text-2xl font-bold mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {
                products.map((product) => (
                    <ProductCard product={product} key={product.id}/>
                ))
            }
        </div>
    );
}
