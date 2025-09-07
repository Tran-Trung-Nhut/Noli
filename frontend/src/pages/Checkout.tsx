import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { confirm, formatPrice, getGuestToken, notifyError, notifySuccess, notifyWarning, setGuestToken } from "../utils";
import { useAuth } from "../contexts/AuthContext";
import cartApi from "../apis/cartApi";
import type { Cart } from "../dtos/cart.dto";
import type { Product } from "../dtos/product.dto";
import type { ProductVariant } from "../dtos/productVariant.dto";
import DeliveryDetail from "../components/DeliveryDetail";
import PaymentMethodModal from "../components/PaymentMethodModal";
import { HttpStatusCode } from "axios";
import LoadingAuth from "../components/LoadingAuth";
import paymentApi from "../apis/paymentApi";
import addressApi from "../apis/addressApi";
import { type AddressDto } from "../dtos/address.dto";
import orderApi from "../apis/orderApi";
import type { CreateOrderItemDto } from "../dtos/orderItem.dto";

export type Province = {
    province_name: string,
    province_id: string,
    province_type: string
}

export type District = {
    district_id: string
    district_name: string
    district_type: string
    location: number,
    province_id: string
}

export type Ward = {
    district_id: string,
    ward_id: string,
    ward_name: string,
    ward_type: string
}

const Checkout = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isOpenPaymentMethod, setIsOpenPaymentMethod] = useState<boolean>(false)
    const { userInfo } = useAuth();
    const token = getGuestToken();
    const didRun = useRef(false);
    const [searchParams] = useSearchParams();
    const src = searchParams.get("src");
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingMessage, setLoadingMessage] = useState<string>("")

    const navigate = useNavigate()
    const location = useLocation();
    const state = location.state as { product: Product, productVariant: ProductVariant, quantity: number }

    // Shipping form
    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [addressLine, setAddressLine] = useState<string>("");
    const [province, setProvince] = useState<string>("");
    const [district, setDistrict] = useState<string>("");
    const [ward, setWard] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [isDefault, setIsDefault] = useState<boolean>(false)
    const [label, setLabel] = useState<string>("")
    const [chosenAddress, setChosenAddress] = useState<AddressDto | null>(null)

    // UI state
    const [shippingFee, setShippingFee] = useState<number | null>(null);
    const [coupon, setCoupon] = useState<string>("");
    const [discountAmount, setDiscountAmount] = useState<number>(0);

    // dependent lists
    const [listProvinces, setListProvinces] = useState<Province[]>([])
    const [districtList, setDistrictList] = useState<District[]>([]);
    const [wardList, setWardList] = useState<Ward[]>([]);

    const orderId = useRef<number | null>(null)

    useEffect(() => {
        if (!state && !src) {
            navigate("/invalid", { replace: true });
        }
    }, [state, src, navigate]);

    if (!state && !src) {
        // Render placeholder trong lúc chờ redirect
        return <LoadingAuth />;
    }

    const removeFromCheckout = async (id: number) => {
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
    }

    const handlePayment = async (paymentMethod: string) => {
        setIsOpenPaymentMethod(false)
        setLoading(true)

        if (paymentMethod === 'momo') {
            if (!orderId) {
                setLoading(false)
                notifyError("Có lỗi xảy ra. Hãy vào đơn hàng của bạn để thanh toán sau")
            }
            const res = await paymentApi.momo({ amount: total, orderId: `MOMOPAYMENT${orderId.current}` })
            if (res.status !== HttpStatusCode.Created) {
                setTimeout(() => {
                    setLoading(false)
                    notifyError("Hệ thống thanh toán đang gặp vấn đề. Vui lòng thử lại sau")
                }, 1000)
                return
            }

            window.location.href = res.data.payUrl

        } else {
            setLoadingMessage("Đang xác nhận đơn hàng. Vui lòng đợi trong giây lát!")
            if (!orderId) {
                notifyError("Có lỗi xảy ra. Hãy vào đơn hàng của bạn để thanh toán sau")
                return setLoading(false)
            }
            const result = await orderApi.updateOrderStatus((orderId.current || 0), "DELIVERY")

            if (result.status !== HttpStatusCode.Ok) {
                notifyError("Có lỗi xảy ra. Hãy vào đơn hàng của bạn để thanh toán sau")
                return setLoading(false)
            }

            setTimeout(() => { navigate(`/payment-result?orderId=${result.data.orderId}`) }, 3000)
        }

    };

    const handleConfirm = async () => {
        if (!chosenAddress) return notifyWarning("Vui lòng chọn địa chỉ giao hàng")

        setLoadingMessage("Đang tạo đơn hàng")
        setLoading(true)

        let listItems: CreateOrderItemDto[] = []
        if (src === 'cart') {
            for (const item of cart?.cartItems || []) {
                const orderItem: CreateOrderItemDto = {
                    productId: item.productId,
                    productVariantId: item.productVariantId,
                    price: item.priceAtAdding,
                    quantity: item.quantity
                }

                listItems.push(orderItem)
            }
        } else {
            const orderItem: CreateOrderItemDto = {
                productId: state.product.id,
                productVariantId: state.productVariant.id,
                price: state.productVariant.price,
                quantity: state.quantity
            }

            listItems.push(orderItem)
        }

        const result = await orderApi.createOrder({
            ...(userInfo ? { userId: userInfo.id } : {}),
            ...(getGuestToken() ? { guestToken: getGuestToken() || undefined } : {}),
            shippingFee: shippingFee ? shippingFee : 0,
            subTotal: subtotal,
            discountAmount,
            totalAmount: total,
            addressId: chosenAddress.id,
            orderItems: listItems,
            note
        }, src === 'cart')

        if (result.status !== HttpStatusCode.Created) {
            setLoading(false)
            setLoadingMessage("")
            return notifyError("Có lỗi xảy ra. Vui lòng thử lại")
        }

        orderId.current = result.data.id

        setTimeout(() => {
            setLoading(false)
            setIsOpenPaymentMethod(true)
            setLoadingMessage("")
        }, 1000)
    }

    const onClosePaymentMethodModal = () => {
        if (!userInfo) {
            confirm("Hủy chọn phương thức thanh toán", "Bạn sẽ phải thực hiện lại các bước từ đầu!", () => setIsOpenPaymentMethod(false))
        } else {
            confirm("Hủy chọn phương thức thanh toán", "Bạn có chắc muốn đóng lại? Tôi sẽ chuyển hướng bạn vào đơn hàng để thuận tiện cho việc theo dõi và thanh toán đơn hàng sắp tới", () => {
                setIsOpenPaymentMethod(false)
                setLoadingMessage("Đang chuyển hướng trang")
                setLoading(true)

                setTimeout(() => {navigate('/profile')}, 2000)
            })
        }
    }

    const getCart = async () => {
        setLoading(true)
        try {
            if (userInfo) {
                const result = await cartApi.getCartItemsByUserId(userInfo.id)

                if (result.status !== HttpStatusCode.Ok) return setLoading(false)
                setCart(result.data)
            } else {
                if (token) {
                    const res = await cartApi.getCartByGuestToken(token);
                    setCart(res.data);
                } else {
                    const res = await cartApi.createCartForGuest();
                    const guestToken = res.data?.data?.guestToken;
                    if (guestToken) {
                        setGuestToken(guestToken);
                        const cartRes = await cartApi.getCartByGuestToken(guestToken);
                        setCart(cartRes.data);
                    }
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        const fetchProvince = async () => {
            const result = await addressApi.getListProvinces()
            if (result.status !== HttpStatusCode.Ok) return notifyError("Hệ thống địa chỉ đang gặp lỗi. Vui lòng thử lại sau")
            setListProvinces(result.data.results)
        }

        if (!didRun.current) {
            getCart();
            fetchProvince()
            didRun.current = true;
        }

    }, []);


    useEffect(() => {
        const fetchDistrict = async () => {
            if (province === "") return
            setDistrictList((await addressApi.getListDistricts(province)).data.results)
        }

        fetchDistrict()
    }, [province]);

    useEffect(() => {
        const fetchDistrict = async () => {
            if (district === "") return

            setWardList((await addressApi.getListWards(district)).data.results)
        }

        fetchDistrict()
    }, [district]);

    const subtotal = src === 'cart' ? cart?.totalAmount ?? 0 : state.productVariant.price * state.quantity;

    useEffect(() => {
        if (subtotal >= 500000) {
            setShippingFee(0);
        } else if (subtotal > 0) {
            setShippingFee(30000);
        } else {
            setShippingFee(null);
        }
    }, [subtotal]);

    const handleApplyCoupon = () => {
        if (!coupon) return notifyError("Vui lòng nhập mã giảm giá");
        if (coupon.toUpperCase() === "GIAM10") {
            const disc = Math.round(subtotal * 0.1);
            setDiscountAmount(disc);
            notifySuccess("Áp dụng mã GIAM10 - giảm 10%");
        } else if (coupon.toUpperCase() === "GIAM33") {
            const disc = Math.round(subtotal * 0.33);
            setDiscountAmount(disc);
            notifySuccess("Áp dụng mã GIAM33 - giảm 33%");
        } else {
            notifyError("Mã không hợp lệ");
        }
    };


    const total = subtotal - discountAmount + (shippingFee ?? 0);

    return (
        <>
            {loading && <LoadingAuth message={loadingMessage} />}
            <div className="container mx-auto px-4 py-8 min-h-[640px]">
                <h1 className="text-3xl font-extrabold text-center text-sky-600 mb-6">Thanh Toán</h1>
                <div className="text-gray-500 mb-6 pb-2 border-b-2">
                    <a href="/" className="hover:underline">Trang chủ</a> / Thanh toán
                </div>

                {/* NOTE: changed widths here -> Left ~55%, Right ~45% */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: shipping info (55%) */}
                    <DeliveryDetail
                        setLoading={setLoading}
                        fullName={fullName}
                        setFullName={setFullName}
                        email={email}
                        setEmail={setEmail}
                        phone={phone}
                        setPhone={setPhone}
                        addressLine={addressLine}
                        setAddressLine={setAddressLine}
                        listProvinces={listProvinces}
                        province={province}
                        setProvince={setProvince}
                        district={district}
                        setDistrict={setDistrict}
                        districtList={districtList}
                        ward={ward}
                        setWard={setWard}
                        wardList={wardList}
                        note={note}
                        setNote={setNote}
                        isDefault={isDefault}
                        setIsDefault={setIsDefault}
                        label={label}
                        setLabel={setLabel}
                        chosenAddress={chosenAddress}
                        setChosenAddress={setChosenAddress}

                    />

                    <PaymentMethodModal
                        isOpen={isOpenPaymentMethod}
                        onClose={() => onClosePaymentMethodModal()}
                        subtotal={subtotal}
                        shippingFee={shippingFee}
                        discountAmount={discountAmount}
                        onConfirm={handlePayment}
                    />

                    {/* Right: order summary (45%) - made wider + image slightly larger */}
                    <div className="w-full lg:w-[45%] border-2 border-gray-500 rounded-xl">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-bold mb-4">Đơn hàng ({src === 'cart' ? cart?.cartItems.length ?? 0 : 1})</h3>

                            <div className="space-y-3 max-h-80 overflow-auto pb-2"> {/* tăng max-h để nhiều không gian */}
                                {src === 'cart' ? (cart?.cartItems.length ? (
                                    cart?.cartItems.map(ci => (
                                        <div key={ci.id} className="flex items-center gap-3 border-b pb-3">
                                            {/* tăng kích thước ảnh để phù hợp với cột rộng hơn */}
                                            <img
                                                src={ci.product.image?.[0] ?? "data:image/png;base64,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"}
                                                alt={ci.product.name}
                                                className="w-20 h-20 object-cover rounded" />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-800">{ci.product.name} x{ci.quantity}</div>
                                                <div className="text-xs text-gray-500">{ci.product.name ?? ""}</div>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900">{formatPrice(ci.priceAtAdding * ci.quantity)}</div>
                                            <button className="ml-2 text-xs text-red-500" onClick={() => removeFromCheckout(ci.id)}>Xóa</button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-500">Không có sản phẩm nào</div>
                                )) : (
                                    <div className="flex items-center gap-3 border-b pb-3">
                                        {/* tăng kích thước ảnh để phù hợp với cột rộng hơn */}
                                        <img src={state.product.image[0]} alt={state.product.name} className="w-20 h-20 object-cover rounded" />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-800">{state.product.name} <span className="text-[16px] text-gray-500 ml-3">x{state.quantity}</span></div>
                                            <div className="text-xs text-gray-500">{state.productVariant.size !== 'no_size' ? state.productVariant.size + ", " + state.productVariant.color : state.productVariant.color}</div>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900">{formatPrice(state.productVariant.price * state.quantity)}</div>
                                    </div>
                                )}
                            </div>

                            {/* Coupon */}
                            <div className="mt-4">
                                <label className="text-sm text-gray-700">Mã giảm giá</label>
                                <div className="flex gap-2 mt-2">
                                    <input
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                        placeholder="Nhập mã giảm giá"
                                        className="flex-1 px-3 py-2 border rounded-md focus:outline-none"
                                    />
                                    <button onClick={handleApplyCoupon} className="px-3 py-2 bg-gray-100 rounded-md border hover:bg-gray-200">Áp dụng</button>
                                </div>
                                <div className="mt-2 flex gap-2">
                                    <button onClick={() => { setCoupon("GIAM33"); handleApplyCoupon(); }} className="text-xs border rounded px-2 py-1">Giảm 33%</button>
                                    <button onClick={() => { setCoupon("GIAM10"); handleApplyCoupon(); }} className="text-xs border rounded px-2 py-1">Giảm 10%</button>
                                    <button onClick={() => { setCoupon("GIAM5"); handleApplyCoupon(); }} className="text-xs border rounded px-2 py-1">Giảm 5%</button>
                                </div>
                            </div>

                            {/* Price summary */}
                            <div className="mt-4 border-t pt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tạm tính</span>
                                    <span className="font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Giảm giá</span>
                                    <span className="font-medium text-red-500">- {formatPrice(discountAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phí vận chuyển</span>
                                    <span className="font-medium">{shippingFee == null ? "—" : formatPrice(shippingFee)}</span>
                                </div>

                                <div className="flex justify-between pt-3 border-t pt-3">
                                    <span className="text-lg font-bold">Tổng cộng</span>
                                    <span className="text-2xl font-extrabold text-sky-600">{formatPrice(total)}</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <button
                                    onClick={() => handleConfirm()}
                                    className="w-full bg-sky-600 text-white py-2 rounded-md font-semibold hover:bg-sky-700"
                                >
                                    Xác nhận đặt hàng
                                </button>
                            </div>

                            <div className="mt-3 text-xs text-gray-500">
                                Bằng việc đặt hàng bạn đồng ý với <a href="/terms" className="text-sky-600 hover:underline">điều khoản sử dụng</a>.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;
