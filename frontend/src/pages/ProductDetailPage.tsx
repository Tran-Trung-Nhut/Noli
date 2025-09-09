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
import NotFoundSVG from "../assets/product-not-found.svg"
import { useAuth } from "../contexts/AuthContext";
import { FaFacebook, FaFacebookMessenger, FaLink } from "react-icons/fa";
import ProductReviews, { Star } from "../components/ProductReviews";
import WriteReviewModal from "../components/WriteReviewModal";
import { SiZalo } from "react-icons/si";

const ProductDetailPage = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [listSize, setListSize] = useState<string[]>([])
    const [listColor, setListColor] = useState<string[]>([])
    const [chosenSize, setChosenSize] = useState<string>("")
    const [chosenColor, setChosenColor] = useState<string>("")
    const [price, setPrice] = useState<number>(0)
    const [quantity, setQuantity] = useState<number>(1)
    const [openWriteReview, setOpenWriteReview] = useState<boolean>(false)
    const { id } = useParams();
    const { userInfo, getNumberOfCartItemByGuestToken, getNumberOfCartItemByUserId } = useAuth()
    const currentUrl = window.location.href

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

        if (userInfo) getNumberOfCartItemByUserId(userInfo.id); else getNumberOfCartItemByGuestToken(getGuestToken())
        setLoading(false)
        notifySuccess("Đã thêm sản phẩm vào giỏ hàng")
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl)
            notifySuccess("Đã sao chép liên kết sản phẩm")
        } catch (error) {
            console.error(error)
            notifyError("Có lỗi xảy ra khi sao chép liên kết sản phẩm")
        }
    }

    const handleShareFaceBook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

        window.open(url, "_blank", "width=600,height=400");
    }

    const handleShareMessager = () => {
        const url = `fb-messenger://share?link=${encodeURIComponent(currentUrl)}`;
        window.open(url, "_blank");
    }

    const handleShareZalo = () => {
        window.open(`https://zalo.me/share?url=${encodeURIComponent(currentUrl)}`, "_blank");
    };

    const getVariant = (color: string, size: string) => {
        for (const variant of product?.variants || []) {
            if (variant.color === color && variant.size === size) return variant
        }
    }

    const fetchProductDetail = async () => {
        setLoading(true)
        const response = (await productApi.getProduct(Number(id)))

        if (response.data === '') {
            setLoading(false)
            return setProduct(null)
        }

        setProduct(response.data)

        if (response.data.variants && response.data.variants.length > 0) {
            setChosenSize(response.data.variants[0].size);
            setChosenColor(response.data.variants[0].color);
            setPrice(response.data.variants[0].price)

            setListSize(Array.from(new Set(response.data.variants.map((variant: ProductVariant) => variant.size))))
            setListColor(Array.from(new Set(response.data.variants.map((variant: ProductVariant) => variant.color))))
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


    const getStockeByColorAndSize = (color: string, size: string): number => {
        for (const productVariant of product?.variants || []) {
            if (productVariant.color === color && productVariant.size === size) return productVariant.stock
        }

        return 0;
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
        if (quantity > getStockeByColorAndSize(chosenColor, chosenSize) || quantity === 0) return

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
                <>
                    <WriteReviewModal
                        open={openWriteReview}
                        productId={product.id}
                        onClose={() => setOpenWriteReview(false)}
                        userInfo={userInfo}
                        onSubmitted={() => {
                            fetchProductDetail()
                        }}
                    />
                    <section className="p-5 min-h-[500px]">
                        <nav className="text-sm text-gray-500 mb-4">
                            <a href="/" className="hover:underline">Trang chủ </a>/
                            <a href="/shop" className="hover:underline"> Cửa hàng </a>/
                            <span> {product.name}</span>
                        </nav>
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/2 flex flex-col justify-center items-center">
                                <div className="md:w-1/2 flex justify-center">
                                    {product.image.length > 0 ? (
                                        product.image.length === 1 ? (
                                            <img
                                                src={product.image[0]}
                                                alt="Product image"
                                                className="w-auto h-auto object-contain"
                                            />
                                        ) : (
                                            <Slider {...settings} className="w-[320px]">
                                                {product.image.map((img, index) => (
                                                    <div key={index}>
                                                        <img
                                                            src={img}
                                                            alt={`Product image ${index + 1}`}
                                                            className="w-full h-auto object-contain"
                                                        />
                                                    </div>
                                                ))}
                                            </Slider>
                                        )
                                    ) : (
                                        <img
                                            src="data:image/png;base64,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"
                                            alt="Product"
                                            className="w-auto h-auto object-contain"
                                        />
                                    )}
                                </div>
                                <div className="mt-10 flex justify-center items-center gap-2">
                                    <span>Chia sẻ: </span>
                                    <button className="border-none bg-white hover:scale-110" onClick={() => handleShareFaceBook()}>
                                        <FaFacebook className="text-blue-500 w-[24px] h-[24px]" />
                                    </button> |
                                    <button className="border-none bg-white hover:scale-110" onClick={() => handleShareMessager()}>
                                        <FaFacebookMessenger className="text-blue-500 w-[24px] h-[24px]" />
                                    </button>|
                                    <button className="border-none bg-white hover:scale-110" onClick={() => handleShareZalo()}>
                                        <SiZalo className="text-gray-900 w-[24px] h-[24px]" color="blue" />
                                    </button>|
                                    <button className="border-none bg-white hover:scale-110" onClick={() => handleCopyLink()}>
                                        <FaLink className="text-gray-900 w-[22px] h-[22px]" />
                                    </button>

                                </div>
                            </div>
                            <div className="md:w-1/2 md:pl-10 mt-6 md:mt-0">
                                <h1 className="text-3xl font-bold uppercase text-black">
                                    {product.outOfStock && (
                                        <>
                                            <span className="text-red-500 bg-red-200">Hết hàng</span>
                                            <span> </span>
                                        </>
                                    )}
                                    {product.name}
                                </h1>
                                <p className="flex justify-start gap-5">
                                    <span className="flex gap-1">
                                        <span className="underline">
                                            {(product.averageRating || 0).toFixed(1)}
                                        </span>
                                        <span className="flex justify-center items-center">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} filled={i < (product.averageRating || 0)} />
                                            ))}
                                        </span>
                                    </span> |
                                    <span className="flex gap-1">
                                        <span className="underline">
                                            {product.countReviews}
                                        </span>
                                        <span className="flex justify-center items-center">
                                            Đánh giá
                                        </span>
                                    </span> |
                                    <span className="flex gap-1">
                                        <span className="underline">
                                            {product.soldQuantity || 0}
                                        </span>
                                        <span className="flex justify-center items-center">
                                            Đã bán
                                        </span>
                                    </span>
                                </p>
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

                                <div className="mt-6 flex justify-start items-center gap-2">
                                    <h3 className="text-sm font-semibold text-gray-600">Kho: </h3>
                                    <span>{getStockeByColorAndSize(chosenColor, chosenSize)}</span>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Số lượng</h3>
                                    <div className="flex space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => handleChangeQuantity(quantity - 1)}>
                                            <Minus size={16} />
                                        </button>
                                        <input
                                            type="number"
                                            className={`px-4 py-2 w-16 border rounded-lg text-center text-xl [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
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
                                        className={`${getStockeByColorAndSize(chosenColor, chosenSize) === 0 ? "bg-gray-500" : "bg-sky-500 hover:opacity-80"} text-white px-6 py-2 rounded-lg`}
                                        onClick={() => navigate(`/checkout`, { state: { product, productVariant: getVariant(chosenColor, chosenSize), quantity } })}
                                        disabled={getStockeByColorAndSize(chosenColor, chosenSize) === 0}
                                    >
                                        MUA NGAY
                                    </button>
                                    <button
                                        className={`${getStockeByColorAndSize(chosenColor, chosenSize) === 0 ? "text-gray-500 border-gray-500" : "text-sky-500 border-sky-500 hover:bg-gray-200"} bg-white border-2 px-6 py-2 rounded-lg`}
                                        onClick={() => addToCart()}
                                        disabled={getStockeByColorAndSize(chosenColor, chosenSize) === 0}
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
                    <ProductReviews
                        averageRating={product.averageRating}
                        productId={product.id}
                        turnOnOpenWriteReview={() => setOpenWriteReview(true)}
                        userInfo={userInfo}
                        fetchProductDetail={async () => await fetchProductDetail()}
                    />
                </>
            ) : (
                <>
                    <div className="flex justify-center items-center">
                        <img src={NotFoundSVG} className="md:w-[400px] md:h-[400px] w-[250px] h-[250px] mt-10" />
                    </div>
                    <h1 className="text-center text-4xl text-sky-500 font-bold">SẢN PHẨM KHÔNG TỒN TẠI</h1>
                </>
            )
    );
};

export default ProductDetailPage;