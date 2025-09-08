
import { useEffect, useState } from "react";
import type { Product } from "../dtos/product.dto";
import ProductCard from "./ProductCart";
import ProductCardSkeleton from "./ProductCartSkeleton";
import productApi from "../apis/productApi";


const FeaturedProducts = () => {
    const [products, setProducts] = useState<(Product & {averageRating: number | null, countReviews: number})[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const fetchFeaturedProducts = async () => {
        setLoading(true)
        const result = (await productApi.getPaging(
            {
                page: 1,
                limit: 4,
                sortBy: 'createdAt',
                sortOrder: 'desc',
                search: "",
                category: null
            }
        ))
        setProducts(result.data)
        setLoading(false)
    }

    useEffect(() => {fetchFeaturedProducts()}, []) 

    return (
        <section className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-6">Sản Phẩm Mới</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (<ProductCardSkeleton key={i}/>))
                ) : (
                    products.map(product => (<ProductCard key={product.id} product={product}/>))
                )}
            </div>
        </section>
    );
};

export default FeaturedProducts