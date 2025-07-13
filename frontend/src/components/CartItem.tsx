import { FaTrash } from "react-icons/fa"
import { confirm, formatPrice, notifySuccess, removeFromCartLocalStorage } from "../utils"
import type { Product } from "../dtos/Product.dto"

const CartItem = ({product} : {product: Product}) =>{
    const removeFromCart = (id: number) => {
        removeFromCartLocalStorage(id)
        notifySuccess('Đã xóa sản phẩm khỏi giỏ hàng')
    }
    return(
        <>
            <div className="cart-item flex items-center bg-white p-4 rounded-md shadow-md">
                <img src={product.image} alt="Quần Jeans Xanh" className="w-24 h-24 object-cover mr-4" />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-gray-600">{formatPrice(product.price)}</p>
                    <div className="flex items-center mt-2">
                        <button className="quantity-btn bg-gray-200 text-gray-700 w-4">-</button>
                        <span className="bg-gray-100 px-4 py-1">1</span>
                        <button className="quantity-btn bg-gray-200 text-gray-700 w-4">+</button>
                    </div>
                </div>
                <button 
                className="text-red-500 hover:text-red-700 ml-4" 
                onClick={() => confirm("Xóa khỏi giỏ hàng", 'Bạn có chắc chắn xóa sản phẩm khỏi giỏ hàng?', () => removeFromCart(product.id))}
                >
                    <FaTrash/>
                </button>
            </div>
        </>
    )
}

export default CartItem