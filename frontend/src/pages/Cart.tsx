import { useEffect, useState } from "react"
import CartItem from "../components/CartItem"
import { formatPrice, getCartLocalStorage, totalPriceOfAllProducts } from "../utils"
import type { Product } from "../dtos/product.dto"

const Cart = () =>{
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        setProducts(getCartLocalStorage())
    }, [products])
    return(
        <div className="container mx-auto px-4 py-8 min-h-[600px]">
          <h1 className="text-3xl font-bold text-center text-sky-500 mb-4">Giỏ Hàng Của Bạn</h1>
          <div className="text-gray-500 mb-4 pb-2 border-b-2">
            <a href="/">Trang chủ</a> / Giỏ hàng ({products.length})
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <div className="space-y-4">
                {products.map(product => (
                    <CartItem product={product}/>
                ))}
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="order-summary p-4 rounded-md">
                <h2 className="text-xl font-bold text-black mb-4">Thông Tin Đơn Hàng</h2>
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-gray-800">Tổng tiền:</span>
                  <span className="text-red-500 font-bold">{formatPrice(totalPriceOfAllProducts(products))}</span>
                </div>
                <ul className="list-disc list-inside text-gray-800 mb-4">
                  <li>Phí vận chuyển sẽ được tính ở trang thanh toán.</li>
                  <li>Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.</li>
                </ul>
                <button 
                className="checkout-btn w-full bg-sky-500 text-white py-2 rounded-md font-semibold flex items-center justify-center hover:bg-sky-600">
                  THANH TOÁN
                </button>
              </div>
            </div>
          </div>
        </div>
    )
}

export default Cart