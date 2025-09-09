import { useNavigate } from "react-router-dom";
import type { Product } from "../dtos/product.dto";
import { formatPrice } from "../utils";
import { Star } from "./ProductReviews";
import OutOfStock from "../assets/OutofStock.png"

const ProductCard = ({
    product,
}: {
    product: Product & { averageRating: number | null, countReviews: number, outOfStock: boolean },
}) => {
    const navigate = useNavigate()

    return (
        <div className={`bg-white shadow-md rounded-md overflow-hidden hover:scale-105 duration-500 relative`}>
            <img
                src={product.image[0] || "data:image/jpeg;base64,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"}
                alt={product.name}
                className={`${product.outOfStock? "grayscale opacity-70": ""} w-full h-64 object-cover`}
                onClick={() => navigate(`/product/${product.id}`)} />
            {product.outOfStock && <img src={OutOfStock} onClick={() => navigate(`/product/${product.id}`)} className="w-52 absolute top-16 left-20 -rotate-25 sm:left-12" />}
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