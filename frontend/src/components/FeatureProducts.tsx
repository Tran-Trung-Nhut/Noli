
import type { Product } from "../dtos/product.dto";
import { products } from "../mocks/product";

const ProductCard = ({ product }: {product: Product}) => {
    const formatPrice = (price: number) => {
        return price.toLocaleString('vi-VN', { minimumFractionDigits: 0 }) + 'đ';
    };
    return (
    <div className="bg-white shadow-md rounded-md overflow-hidden hover:scale-105">
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
        <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600">{formatPrice(product.price)}</p>
        </div>
    </div>
    );
};

const FeaturedProducts = () => {
    return (
    <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-6">Sản Phẩm Nổi Bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
            <ProductCard key={product.id} product={product} />
        ))}
        </div>
    </section>
    );
};

export default FeaturedProducts