import { useState, type FormEvent } from "react"
import CartItem from "../components/CartItem"
import { formatPrice, getCartLocalStorage, notifySuccess, removeFromCartLocalStorage, totalPriceOfAllProducts } from "../utils"
import type { Product } from "../dtos/product.dto"
import { useNavigate } from "react-router-dom"

const Cart = () =>{
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [city, setCity] = useState<string>('');

    const [subTotal, setSubTotal] = useState<number>(0);
    const [shippingFee, setShippingFee] = useState<number>(30000);
    const [discountCode, setDiscountCode] = useState<string>('');
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [chosenProducts, setChosenProducts] = useState<number[]>([])

    const finalTotal = subTotal + shippingFee - discountAmount;
    
        const handleSubmit = (e: FormEvent) => {
            e.preventDefault();
            console.log({ name, phone, address, city, subTotal, shippingFee, discountCode, discountAmount, finalTotal });
            // TODO: xử lý thanh toán
        };

    const handleApplyDiscount = () => {
        // validate code qua API
        if (discountCode === 'DISCOUNT10') {
        setDiscountAmount(subTotal * 0.1);
        } else {
        setDiscountAmount(0);
        }
    };
    const navigate = useNavigate()

    const [products, setProducts] = useState<Product[]>(getCartLocalStorage())

    const removeFromCart = (productId: number) => {
        setProducts(products.filter(product => product.id !== productId))
        removeFromCartLocalStorage(productId)
        notifySuccess('Đã xóa sản phẩm khỏi giỏ hàng')
    }

    const chooseProduct = (productId: number) => {
        if(chosenProducts.some(id => id === productId)){
            setChosenProducts(chosenProducts.filter(id => id !== productId))
            return
        }
        setChosenProducts([...chosenProducts, productId])
    }

    const calculateSubTotal = () => {
        var sum = 0
        for (const id of chosenProducts){
            for(const product of products){
                if(id === product.id){
                    sum += product.price
                    break
                }
            }
        }

        return sum
    }

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
                    <CartItem product={product} removeFromCart={removeFromCart} chooseProduct={chooseProduct}/>
                ))}
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="order-summary p-4 rounded-md flex flex-col gap-2">
                <h2 className="text-xl font-bold text-black mb-4">Thông Tin Đơn Hàng</h2>
                
                <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(calculateSubTotal())}</span>
                </div>

                <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(shippingFee)}</span>
                </div>

                <div className="flex items-center space-x-2">
                    <span>Mã giảm giá:</span>
                    <input
                    type="text"
                    value={discountCode}
                    onChange={e => setDiscountCode(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                    type="button"
                    onClick={handleApplyDiscount}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
                    >
                    Áp dụng
                    </button>
                </div>

                <div className="flex justify-between">
                    <span>Giảm giá:</span>
                    <span className="text-green-600">- {formatPrice(discountAmount)}</span>
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                    <span className="font-semibold text-lg">Tổng cộng:</span>
                    <span className="font-bold text-xl text-red-500">
                    {formatPrice(finalTotal)}
                    </span>
                </div>

                <ul className="list-disc list-inside text-gray-800 mb-4">
                  <li>Phí vận chuyển sẽ được tính ở trang thanh toán.</li>
                  <li>Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.</li>
                </ul>

                <h2 className="text-xl font-bold text-black mb-4">Thông Tin Khách Hàng</h2>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-lg font-medium mb-1">Họ và tên</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-medium mb-1">Số điện thoại</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-medium mb-1">Thành phố</label>
                        <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-medium mb-1">Địa chỉ</label>
                        <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                <button 
                onClick={() => navigate('/checkout')}
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