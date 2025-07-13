import { formatPrice, getCartLocalStorage, isProductInCart } from "../utils";
import { useEffect, useState } from "react";
import { defaultProduct, type Product } from "../dtos/product.dto";
import { getProductInformation } from "../api/product";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
    const [product, setProduct] = useState<Product>(defaultProduct)
    const [cartProducts] = useState<Product[]>(getCartLocalStorage())
    const { id } = useParams();
    useEffect(() => {
        setProduct(getProductInformation(Number(id || 0)) || defaultProduct)
    }, [id])
    return (
        <section className="p-5 min-h-[500px]">
            <nav className="text-sm text-gray-500 mb-4">
                <a href="/" className="hover:underline">Trang chủ</a> &gt; 
                <a href="/shop" className="hover:underline"> Cửa hàng</a> &gt; 
                <span> {product.name}</span>
            </nav>
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 flex justify-center">
                    <img
                    src={product.image}
                    alt="Product"
                    className="w-52 h-auto object-cover"
                    />
                </div>
                <div className="md:w-1/2 md:pl-10 mt-6 md:mt-0">
                    <h1 className="text-3xl font-bold uppercase text-black">{product.name}</h1>
                    <p className="text-xl text-black mt-2">{formatPrice(product.price)}</p>
                    <p className="text-lg text-black mt-4 leading-relaxed">
                    Đây là mô tả sản phẩm. Hiện chưa được cập nhật trường cho cơ sở dữ liệu. Sẽ được cập nhật trong thời gian sắp tới
                    </p>
                    <div className="mt-6 flex space-x-4">
                        <button className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:opacity-80">
                            MUA NGAY
                        </button>
                        {!isProductInCart(product, cartProducts) ? (
                            <button className="bg-white text-black border border-black px-6 py-2 rounded-lg hover:bg-gray-100">
                                THÊM VÀO GIỎ HÀNG
                            </button>
                        ) : (
                            <button disabled className="bg-gray-500 text-white border border-black px-6 py-2 rounded-lg">
                                ĐÃ THÊM VÀO GIỎ HÀNG
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
export default ProductDetail