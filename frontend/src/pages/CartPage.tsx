import { useEffect, useRef, useState } from "react"
import { formatPrice, getGuestToken, notifyError, notifySuccess, notifyWarning } from "../utils"
import { useAuth } from "../contexts/AuthContext"
import cartApi from "../apis/cart.api"
import type { Cart } from "../dtos/cart.dto"
import CartItemCard from "../components/CartItemCard"
import cartItemApi from "../apis/cart-item.api"
import { HttpStatusCode } from "axios"
import { useNavigate } from "react-router-dom"
import LoadingAuth from "../components/LoadingAuth"

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { userInfo, getNumberOfCartItemByGuestToken, getNumberOfCartItemByUserId } = useAuth()
  const didRun = useRef(false);
  const token = getGuestToken()

  const navigate = useNavigate()

  const removeFromCart = async (id: number) => {
    setLoading(true)
    const result = await cartItemApi.removeFromCart(id)

    if (result.status !== HttpStatusCode.Ok) {
      setLoading(false)
      return notifyError('Đã có lỗi xảy ra. Vui lòng thử lại')
    }

    setCart(prevCart => {
      if (!prevCart) return prevCart

      const updatedCartItems = prevCart.cartItems.filter(item => item.id !== id);

      const updatedCart: Cart = {
        ...prevCart,
        cartItems: updatedCartItems,
        numberOfItems: updatedCartItems.length,
        totalAmount: updatedCartItems.reduce(
          (sum, item) => sum + item.priceAtAdding * item.quantity,
          0
        ),
      };

      return updatedCart;
    });

    if(userInfo) getNumberOfCartItemByUserId(userInfo.id); else getNumberOfCartItemByGuestToken(token)
    setLoading(false)
    notifySuccess('Đã xóa sản phẩm khỏi giỏ hàng')
  }

  const handleCheckout = () => {
    if (cart?.cartItems.length === 0) return notifyWarning("Không có sản phẩm để thanh toán")
    navigate('/checkout?src=cart')
  }

  const getCart = async () => {
    setLoading(true)
    try {
      if (userInfo) {
        const result = await cartApi.getCartItemsByUserId(userInfo.id)

        if (result.status !== HttpStatusCode.Ok) return setLoading(false)
        setCart(result.data)

      } else {
        if (!token) {
          setLoading(false)
          return notifyError("Có lỗi xảy ra. Vui lòng thử lại")
        }
        setCart((await cartApi.getCartByGuestToken(token)).data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!didRun.current) {
      getCart();
      didRun.current = true;
    }
  }, [])
  return (
    loading ? <LoadingAuth /> : (
      <div className="container mx-auto px-4 py-8 min-h-[600px]">
        <h1 className="text-3xl font-bold text-center text-sky-500 mb-4">Giỏ Hàng Của Bạn</h1>
        <div className="text-gray-500 mb-4 pb-2 border-b-2">
          <a href="/">Trang chủ</a> / Giỏ hàng ({cart?.cartItems.length || 0})
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <div className="space-y-4">
              {cart?.cartItems.map(cartItem => (
                <CartItemCard key={cartItem.id} cartItem={cartItem} removeFromCart={removeFromCart} />
              ))}
            </div>
          </div>
          <div className="md:w-1/3">
            <div className="order-summary p-4 rounded-md">
              <h2 className="text-xl font-bold text-black mb-4">Thông Tin Đơn Hàng</h2>
              <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-800">Tổng tiền:</span>
                <span className="text-red-500 font-bold">{formatPrice(cart?.totalAmount || 0)}</span>
              </div>
              <ul className="list-disc list-inside text-gray-800 mb-4">
                <li>Phí vận chuyển sẽ được tính ở trang thanh toán.</li>
                <li>Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.</li>
              </ul>
              <button
                className="checkout-btn w-full bg-sky-500 text-white py-2 rounded-md font-semibold flex items-center justify-center hover:bg-sky-600"
                onClick={() => handleCheckout()}>
                THANH TOÁN
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default CartPage