import { useNavigate } from "react-router-dom";
import type { Product } from "../dtos/product.dto";
import { formatPrice, isProductInCart } from "../utils";

const ProductCard = ({ 
    product,
    addToCart,
    cartProducts
}: {
    product: Product,
    addToCart: (product: Product) => void,
    cartProducts: Product[]
}) => {
    const navigate = useNavigate()

    return (
        <div className={`bg-white shadow-md rounded-md overflow-hidden hover:scale-105 duration-500`}>
            <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-64 object-cover" 
            onClick={() => navigate(`/product/${product.id}`)}/>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800" onClick={() => navigate(`/product/${product.id}`)}>{product.name}</h3>
                <p className="text-gray-600" onClick={() => navigate(`/product/${product.id}`)}>{formatPrice(product.price)}</p>
            </div>

            <div className="flex justify-center align-center gap-3 pb-3 px-2">
                <button className="flex-1 md:flex-none border-2 border-sky-500 p-2 rounded-[4px] text-sky-500 hover:bg-gray-100">Mua ngay</button>
                {!isProductInCart(product, cartProducts) ? (
                    <button className="flex-1 md:flex-none p-2 rounded-[4px] bg-sky-500 text-white hover:bg-sky-600" onClick={() => addToCart(product)}>Thêm vào giỏ hàng</button>
                ) : (
                    <button className="flex-1 md:flex-none p-2 rounded-[4px] bg-gray-500 text-white" disabled>Đã thêm vào giỏ hàng</button>
                )}
            </div>
        </div>
    );
};

export default ProductCard