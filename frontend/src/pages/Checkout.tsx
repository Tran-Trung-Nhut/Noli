import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { formatPrice, getGuestToken, notifyError, notifySuccess, notifyWarning, setGuestToken } from "../utils";
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

    useEffect(() => {
        if (!state && !src) {
            navigate("/invalid-checkout", { replace: true });
        }
    }, [state, src, navigate]);

    if (!state && !src) {
        // Render placeholder trong lúc chờ redirect
        return <LoadingAuth />;
    }


    const handlePayment = async (paymentMethod: string) => {
        setIsOpenPaymentMethod(false)
        setLoading(true)

        if (paymentMethod === 'momo') {
            const res = await paymentApi.momo({ amount: total, orderId: "MOMOCO434kjs2049" })

            if (res.status !== HttpStatusCode.Created)
                setTimeout(() => {
                    setLoading(false)
                    notifyError("Hệ thống thanh toán đang gặp vấn đề. Vui lòng thử lại sau")
                }, 1000)


            window.location.href = res.data.data.payUrl

        } else {
            return
        }

    };

    const handleConfirm = () => {

        if(!chosenAddress) return notifyWarning("Vui lòng chọn địa chỉ giao hàng")

        setIsOpenPaymentMethod(true)
    }

    // get cart (same pattern as your Cart component)
    const getCart = async () => {
        setLoading(true)
        try {
            if (userInfo) {
                const result = await cartApi.getCartItemsByUserId(userInfo.id)

                if (result.status !== HttpStatusCode.Ok) return
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

            setListProvinces(result.data.data.results)
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

            const result = await addressApi.getListDistricts(province)

            setDistrictList(result.data.data.results)
        }

        fetchDistrict()
    }, [province]);

    useEffect(() => {
        const fetchDistrict = async () => {
            if (district === "") return

            const result = await addressApi.getListWards(district)

            setWardList(result.data.data.results)
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
            {loading && <LoadingAuth />}
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
                        onClose={() => setIsOpenPaymentMethod(false)}
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
                                            <img src={ci.product.image?.[0] ?? ""} alt={ci.product.name} className="w-20 h-20 object-cover rounded" />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-800">{ci.product.name} x{ci.quantity}</div>
                                                <div className="text-xs text-gray-500">{ci.product.name ?? ""}</div>
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900">{formatPrice(ci.priceAtAdding * ci.quantity)}</div>
                                            <button className="ml-2 text-xs text-red-500" onClick={() => { }}>Xóa</button>
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
                                        <button className="ml-2 text-xs text-red-500" onClick={() => { }}>Xóa</button>
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
                                    Đặt hàng
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
