// src/components/ProductGrid.tsx
import ProductCard from "./ProductCart";
import ProductCardSkeleton from "./ProductCartSkeleton";
import type { Product } from "../dtos/product.dto";
import NotFoundSVG from "../assets/product-not-found.svg"

type Props = {
    products: (Product & {averageRating: number | null , countReviews: number, outOfStock: boolean})[];
    loading: boolean;
};

export default function ProductGrid({ products, loading }: Props) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!loading && products.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="flex justify-center items-center mb-2">
                    <img src={NotFoundSVG} className="w-[250px]"/>
                </div>
                <h3 className="text-2xl font-bold mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
            {
                products.map((product) => (
                    <ProductCard product={product} key={product.id}/>
                ))
            }
        </div>
    );
}
