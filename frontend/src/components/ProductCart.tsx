import { useNavigate } from "react-router-dom";
import type { Product } from "../dtos/product.dto";
import { formatPrice } from "../utils";
import { Star } from "./ProductReviews";

const ProductCard = ({
    product,
}: {
    product: Product & { averageRating: number | null, countReviews: number },
}) => {
    const navigate = useNavigate()

    return (
        <div className={`bg-white shadow-md rounded-md overflow-hidden hover:scale-105 duration-500`}>
            <img
                src={product.image[0]}
                alt={product.name}
                className="w-full h-64 object-cover"
                onClick={() => navigate(`/product/${product.id}`)} />
            <div className="p-4 flex">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800" onClick={() => navigate(`/product/${product.id}`)}>{product.name}</h3>
                    <p
                        className="text-gray-600"
                        onClick={() => navigate(`/product/${product.id}`)}>
                        {formatPrice(product.defaultPrice)}
                    </p>
                </div>
                <div className="flex justify-end items-end w-full">
                    {!product.averageRating ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <Star filled={false} key={i}/>
                        ))
                    ) : (
                        Array.from({ length: 5 }).map((_, i) => (
                            <Star filled={i < (product.averageRating || 0)} key={i} />
                        ))
                    )}
                    <span className="text-[13px] flex justify-end items-end ml-1">({product.countReviews})</span>
                </div>
            </div>

            {/* <div className="flex justify-center align-center gap-3 pb-3 px-2">
                <button className="flex-1 md:flex-none bg-sky-500 p-2 rounded-[4px] text-white hover:bg-sky-600">Mua ngay</button>
                {!isProductInCart(product, cartProducts) ? (
                    <button 
                    className="flex-1 md:flex-none p-2 rounded-[4px] border-2 border-sky-500 bg-white text-sky-500 hover:bg-gray-200" 
                    onClick={() => addToCart(product)}>
                        Thêm vào giỏ hàng
                    </button>
                ) : (
                    <button 
                    className="flex-1 md:flex-none p-2 rounded-[4px] bg-gray-500 text-white" 
                    disabled>
                        Đã thêm vào giỏ hàng
                    </button>
                )}
            </div> */}
        </div>
    );
};

export default ProductCard