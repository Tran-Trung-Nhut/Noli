import { FaTrash } from "react-icons/fa"
import { confirm, formatPrice } from "../utils"
import type { CartItemShowOnCart } from "../dtos/cartItem.dto"
import { useNavigate } from "react-router-dom"


const CartItemCard = ({ cartItem, removeFromCart }: { cartItem: CartItemShowOnCart, removeFromCart: (id: number) => void }) => {

    const navigate = useNavigate()

    return (
        <>
            <div className="cart-item flex items-center bg-white p-4 rounded-md shadow-lg hover:scale-[101%]">
                <img src={cartItem.product.image[0]} 
                alt="Quần Jeans Xanh" 
                className="w-24 h-24 object-cover mr-4" 
                onClick={() => navigate(`/product/${cartItem.product.id}`)}
                />
                <div className="flex-1">
                    <h3 
                    className="text-lg font-semibold text-gray-800 cursor-default" 
                    onClick={() => navigate(`/product/${cartItem.product.id}`)}>
                        {cartItem.product.name}
                    </h3>
                    <p className="text-gray-600">{cartItem.productVariant.size !== 'no_size' ? cartItem.productVariant.size + ", " + cartItem.productVariant.color : cartItem.productVariant.color}</p>
                    <p className="text-gray-600">{formatPrice(cartItem.productVariant.price)}</p>
                    <p className="text-gray-600">Số lượng: {cartItem.quantity}</p>
                </div>
                <button
                    className="text-red-500 hover:text-red-700 ml-4"
                    onClick={() => confirm("Xóa khỏi giỏ hàng", 'Bạn có chắc chắn xóa sản phẩm khỏi giỏ hàng?', () => removeFromCart(cartItem.id))}
                >
                    <FaTrash />
                </button>
            </div>
        </>
    )
}

export default CartItemCard