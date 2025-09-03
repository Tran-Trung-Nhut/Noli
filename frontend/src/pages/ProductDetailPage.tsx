import { formatPrice, getGuestToken, notifyError, notifySuccess, notifyWarning } from "../utils";
import { useEffect, useState } from "react";
import { type ProductDetail } from "../dtos/product.dto";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick"; // Import Slider từ react-slick
import productApi from "../apis/productApi";
import cartItemApi from "../apis/cartItemApi";
import { Minus, Plus } from "lucide-react";
import { HttpStatusCode } from "axios";
import type { ProductVariant } from "../dtos/productVariant.dto";
import LoadingAuth from "../components/LoadingAuth";

const ProductDetailPage = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [listSize, setListSize] = useState<string[]>([])
    const [listColor, setListColor] = useState<string[]>([])
    const [chosenSize, setChosenSize] = useState<string>("")
    const [chosenColor, setChosenColor] = useState<string>("")
    const [price, setPrice] = useState<number>(0)
    const [quantity, setQuantity] = useState<number>(1)
    const { id } = useParams();

    const navigate = useNavigate()

    const addToCart = async () => {
        setLoading(true)
        if (!product) {
            setLoading(false)
            return notifyError("Không tìm thấy sản phẩm trong cơ sở dữ liệu. Vui lòng thử lại sau")
        }

        const guestToken = getGuestToken()
        if (!guestToken) {
            setLoading(false)
            return notifyError("Có lỗi xảy ra. Vui lòng thử lại sau")
        }

        const variant = getVariant(chosenColor, chosenSize)
        if (!variant) {
            setLoading(false)
            return notifyError("Không tìm thấy màu sắc và kích thước này trong cơ sở dữ liệu. Vui lòng thử lại")
        }

        const response = await cartItemApi.addItemToCart({ guestToken, priceAtAdding: variant.price, quantity, productId: product?.id, productVariantId: variant.id })

        if (response.status !== HttpStatusCode.Created) {
            setLoading(false)
            return notifyWarning(response.data.message)
        }

        setLoading(false)
        notifySuccess("Đã thêm sản phẩm vào giỏ hàng")
    };

    const getVariant = (color: string, size: string) => {
        for (const variant of product?.variants || []) {
            if (variant.color === color && variant.size === size) return variant
        }
    }

    const fetchProductDetail = async () => {
        setLoading(true)
        const data = (await productApi.getProduct(Number(id))).data.data
        setProduct(data)

        if (data.variants && data.variants.length > 0) {
            setChosenSize(data.variants[0].size);
            setChosenColor(data.variants[0].color);
            setPrice(data.variants[0].price)

            setListSize(Array.from(new Set(data.variants.map((variant: ProductVariant) => variant.size))))
            setListColor(Array.from(new Set(data.variants.map((variant: ProductVariant) => variant.color))))
        }

        setLoading(false)
    }

    const updatePriceByChosenColorAndSize = (colorOrSizeorQuatity: string, value: string) => {
        if (colorOrSizeorQuatity === 'color') {
            const variant = getVariant(value, chosenSize)
            setPrice((variant?.price || 0) * quantity)
        } else if (colorOrSizeorQuatity === 'size') {
            const variant = getVariant(chosenColor, value)
            setPrice((variant?.price || 0) * quantity)
        } else {
            const variant = getVariant(chosenColor, chosenSize)
            setPrice((variant?.price || 0) * Number(value))
        }
    }

    const handleChooseSize = (size: string) => {
        setChosenSize(size)
        updatePriceByChosenColorAndSize('size', size)
    }

    const handleChooseColor = (color: string) => {
        setChosenColor(color)
        updatePriceByChosenColorAndSize('color', color)
    }

    const handleChangeQuantity = (quantity: number) => {
        setQuantity(quantity)
        updatePriceByChosenColorAndSize('quantity', String(quantity))
    }



    useEffect(() => {
        fetchProductDetail()
    }, [id]);

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
        loading ? <LoadingAuth /> :
            product ? (
                <section className="p-5 min-h-[500px]">
                    <nav className="text-sm text-gray-500 mb-4">
                        <a href="/" className="hover:underline">Trang chủ </a>/
                        <a href="/shop" className="hover:underline"> Cửa hàng </a>/
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
                            <p className="text-xl text-black mt-2">{formatPrice(price)}</p>

                            {/* Chọn Size */}
                            {listSize[0] !== 'no_size' && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Chọn size</h3>
                                    <div className="flex space-x-3">
                                        {listSize.map((size) => (
                                            <button
                                                key={size}
                                                className={`px-4 py-2 border rounded-lg ${chosenSize === size ? "bg-sky-500 text-white" : "hover:border-sky-500 hover:text-sky-500"}`}
                                                onClick={() => handleChooseSize(size)}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Chọn Màu */}
                            <div className="mt-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">Chọn màu</h3>
                                <div className="flex space-x-3">
                                    {listColor.map((color) => (
                                        <button
                                            key={color}
                                            className={`px-4 py-2 border rounded-lg ${chosenColor === color ? "bg-sky-500 text-white" : "hover:border-sky-500 hover:text-sky-500"}`}
                                            onClick={() => handleChooseColor(color)}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">Số lượng</h3>
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => quantity > 0 && handleChangeQuantity(quantity - 1)}>
                                        <Minus size={16} />
                                    </button>
                                    <input
                                        type="number"
                                        className={`px-4 py-2 w-12 border rounded-lg text-center text-xl [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleChangeQuantity(quantity + 1)}>
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Nút hành động */}
                            <div className="mt-6 flex space-x-4">
                                <button
                                    className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:opacity-80"
                                    onClick={() => navigate(`/checkout`, { state: { product, productVariant: getVariant(chosenColor, chosenSize), quantity } })}>
                                    MUA NGAY
                                </button>
                                <button
                                    className="bg-white text-sky-500 border-2 border-sky-500 px-6 py-2 rounded-lg hover:bg-gray-200"
                                    onClick={() => addToCart()}
                                >
                                    THÊM VÀO GIỎ HÀNG
                                </button>
                            </div>

                            {/* Description nằm dưới cùng */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-700">Thông tin sản phẩm</h3>
                                <p className="text-base text-black mt-2 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <h1>Không tìm thấy sản phẩm</h1>
            )
    );
};

export default ProductDetailPage;