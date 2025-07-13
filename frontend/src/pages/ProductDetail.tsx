import { addToCartLocalStorage, formatPrice, getCartLocalStorage, isProductInCart, notifySuccess } from "../utils";
import { useEffect, useState } from "react";
import { defaultProduct, type Product } from "../dtos/product.dto";
import { getProductInformation } from "../api/product";
import { useParams } from "react-router-dom";
import Slider from "react-slick"; // Import Slider từ react-slick

const ProductDetail = () => {
    const [product, setProduct] = useState<Product>(defaultProduct);
    const [cartProducts, setCartProducts] = useState<Product[]>(getCartLocalStorage());
    const { id } = useParams();

    const addToCart = () => {
        setCartProducts([...cartProducts, product]);
        notifySuccess('Đã thêm sản phẩm vào giỏ hàng');
    };

    useEffect(() => {
        addToCartLocalStorage(cartProducts);
        setProduct(getProductInformation(Number(id || 0)) || defaultProduct);
    }, [id, cartProducts]);

    // Cấu hình cho Slider
    const settings = {
        dots: true, // Hiển thị chấm chỉ báo
        infinite: true, // Lặp vô hạn
        speed: 500, // Tốc độ chuyển ảnh
        slidesToShow: 1, // Hiển thị 1 ảnh mỗi lần
        slidesToScroll: 1, // Chuyển 1 ảnh mỗi lần
        arrows: true, // Hiển thị nút điều hướng
    };

    return (
        <section className="p-5 min-h-[500px]">
            <nav className="text-sm text-gray-500 mb-4">
                <a href="/" className="hover:underline">Trang chủ</a> 
                <a href="/shop" className="hover:underline"> Cửa hàng</a> 
                <span> {product.name}</span>
            </nav>
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 flex justify-center">
                   <div className="md:w-1/2 flex justify-center">
                        {product.image.length > 0 ? (
                            product.image.length === 1 ? (
                                <img
                                    src={product.image[0]}
                                    alt="Product image"
                                    className="w-52 h-auto object-cover"
                                />
                            ) : (
                                <Slider {...settings} className="w-52">
                                    {product.image.map((img, index) => (
                                        <div key={index}>
                                            <img
                                                src={img}
                                                alt={`Product image ${index + 1}`}
                                                className="w-full h-auto object-cover"
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            )
                        ) : (
                            <img
                                src="path/to/default-image.jpg"
                                alt="Product"
                                className="w-52 h-auto object-cover"
                            />
                        )}
                    </div>
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
                            <button 
                                className="bg-white text-sky-500 border-2 border-sky-500 px-6 py3
                                rounded-lg hover:bg-gray-200"
                                onClick={() => addToCart()}
                            >
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

export default ProductDetail;