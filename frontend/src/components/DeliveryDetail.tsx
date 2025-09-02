import { HttpStatusCode } from "axios"
import userApi from "../apis/userApi"
import { useAuth } from "../contexts/AuthContext"
import type { District, Province, Ward } from "../pages/Checkout"
import { useEffect, useState } from "react"
import addressApi from "../apis/addressApi"
import { type AddressDto } from "../dtos/address.dto"
import { confirm, getDistrictNameByDistrictId, getProvinceNameByProvinceId, getWardNameByWardId, isValidEmail, notifyError, notifySuccess, notifyWarning } from "../utils"

const DeliveryDetail = ({
    fullName,
    setFullName,
    email,
    setEmail,
    phone,
    setPhone,
    addressLine,
    setAddressLine,
    listProvinces,
    province,
    setProvince,
    district,
    setDistrict,
    districtList,
    ward,
    setWard,
    wardList,
    note,
    setNote,
    isDefault,
    setIsDefault,
    label,
    setLabel,
    chosenAddress,
    setChosenAddress
}: {
    fullName: string
    setFullName: (value: string) => void
    email: string
    setEmail: (value: string) => void
    phone: string
    setPhone: (value: string) => void
    addressLine: string
    setAddressLine: (value: string) => void
    listProvinces: Province[]
    province: string
    setProvince: (value: string) => void
    district: string
    setDistrict: (value: string) => void
    districtList: District[]
    ward: string
    setWard: (value: string) => void
    wardList: Ward[]
    note: string
    setNote: (value: string) => void
    isDefault: boolean,
    setIsDefault: (value: boolean) => void
    label: string
    setLabel: (value: string) => void
    chosenAddress: AddressDto | null,
    setChosenAddress: (value: AddressDto | null) => void
}) => {
    const { userInfo } = useAuth()
    const [addressList, setAddressList] = useState<AddressDto[]>([])
    const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false)

    const typeOfAddress = (type: string): string => {
        switch (type) {
            // Add your cases here, for example:
            case "home":
                return "Nhà riêng";
            case "office":
                return "Văn phòng";
            case "other":
                return "Khác";
            default:
                return "Không xác định";
        }
    }

    const fetchUser = async () => {
        if (!userInfo) return

        const result = await userApi.getUserById(userInfo.id)

        if (result.status !== HttpStatusCode.Ok) return

        setFullName(result.data.data.firstName + " " + result.data.data.lastName)
        setPhone(result.data.data.phoneNumber)
        setEmail(result.data.data.email)
    }

    const fetchAddressList = async () => {
        if (!userInfo) return

        const result = await addressApi.getListAddressByUserId(userInfo.id)

        if (result.status !== HttpStatusCode.Ok) return

        if (result.data.data.length === 0) {
            return fetchUser()
        }

        setAddressList(result.data.data)

        const defaultAddr = result.data.data.find((a: AddressDto) => a.isDefault)
        setChosenAddress(defaultAddr ?? null)
    }

    const handleDeleteAddress = (id: number) => {
        confirm("Xóa địa chỉ", "Bạn có chắc muốn xóa địa chỉ này?", async () => {
            const result = await addressApi.deleteAddress(id)

            if (result.status !== HttpStatusCode.Ok) return notifyError("Có lỗi xảy ra. Vui lòng thử lại sau")

            notifySuccess("Xóa địa chỉ thành công")
            if(chosenAddress?.id === result.data.data.id) setChosenAddress(null)

            if (addressList.length === 1) setAddressList([])
            else setAddressList(addressList.filter(address => address.id === result.data.data.id))
        })
    }

    const handleSaveAddress = async () => {
        if (!fullName || !phone || !province || !district || !ward || !addressLine) return notifyWarning("Vui lòng điền đủ thông tin cần thiết")


        if (phone.length < 10) return notifyWarning("Số điện thoại không đúng định dạng")
        if (email && !isValidEmail(email)) return notifyWarning("Email không đúng định dạng")

        const result = await addressApi.createAddress({
            ...(userInfo ? { userId: userInfo.id } : {}),
            fullName,
            phone,
            email,
            provinceId: province,
            provinceName: getProvinceNameByProvinceId(province, listProvinces),
            districtId: district,
            districtName: getDistrictNameByDistrictId(district, districtList),
            wardId: ward,
            wardName: getWardNameByWardId(ward, wardList),
            addressLine,
            isDefault,
            label
        })

        if (result.status !== HttpStatusCode.Created) return notifyError("Lỗi khi lưu thông tin giao hàng. Vui lòng thử lại sau!")

        notifySuccess("Lưu thông tin giao hàng thành công")

        setIsAddingAddress(false)

        if (userInfo) fetchAddressList(); else setAddressList([result.data.data])
    }

    useEffect(() => { fetchAddressList() }, [userInfo])

    return (
        <div className="w-full lg:w-[55%] bg-white p-6 rounded-lg shadow-sm">
            {addressList.length === 0 || isAddingAddress ? (
                <>
                    <h2 className="text-xl font-semibold text-gray-800">Thông tin giao hàng</h2>

                    <div className="md:flex px-3 py-2 bg-gray-50 text-sm text-gray-600 justify-between items-center">
                        <p>Thêm địa chỉ giao hàng mới của bạn</p>
                        {addressList.length > 0 && (
                            <button className="p-1 border rounded-lg hover:scale-110 mt-2" onClick={() => setIsAddingAddress(false)}>
                                Danh sách địa chỉ đã lưu
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* ... form inputs (giữ nguyên các input của bạn) ... */}
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Họ và tên"
                            className="input-field col-span-1 md:col-span-2 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200"
                        />
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email (tuỳ chọn)"
                            className="input-field w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200"
                        />
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Số điện thoại"
                            className="input-field w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200"
                        />
                        <input
                            value={addressLine}
                            onChange={(e) => setAddressLine(e.target.value)}
                            placeholder="Địa chỉ (số nhà, tên đường)"
                            className="input-field md:col-span-2 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200"
                        />
                    </div>

                    {/* ... selects tỉnh/quận/xã ... */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <select
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            className="px-4 py-3 border rounded-md focus:outline-none"
                        >
                            <option value="">Chọn tỉnh / thành</option>
                            {listProvinces.map(province => <option key={province.province_id} value={province.province_id}>{province.province_name}</option>)}
                        </select>

                        <select
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            disabled={!districtList.length}
                            className="px-4 py-3 border rounded-md focus:outline-none disabled:opacity-60"
                        >
                            <option value="">Chọn quận / huyện</option>
                            {districtList.map(district => <option key={district.district_id} value={district.district_id}>{district.district_name}</option>)}
                        </select>

                        <select
                            value={ward}
                            onChange={(e) => setWard(e.target.value)}
                            disabled={!wardList.length}
                            className="px-4 py-3 border rounded-md focus:outline-none disabled:opacity-60"
                        >
                            <option value="">Chọn phường / xã</option>
                            {wardList.map(ward => <option key={ward.ward_id} value={ward.ward_id}>{ward.ward_name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <select
                            id="address"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200"
                        >
                            <option value="">-- Loại địa chỉ --</option>
                            <option value="home">Nhà riêng</option>
                            <option value="office">Văn phòng</option>
                            <option value="other">Khác</option>
                        </select>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="defaultAddress"
                                checked={isDefault}
                                onChange={() => setIsDefault(!isDefault)}
                                className="h-5 w-5 text-sky-500 focus:ring-sky-200 cursor-pointer"
                            />
                            <span className="text-gray-700">Đặt làm địa chỉ mặc định</span>
                        </label>
                    </div>

                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ghi chú cho người giao (ví dụ: giờ nhận hàng, thang máy, ...)"
                        className="mt-4 w-full px-4 py-3 border rounded-md focus:outline-none"
                        rows={3}
                    />

                    <div className={`mt-6 border-t pt-4 flex items-center ${userInfo ? "justify-end" : "justify-between"}`}>
                        {!userInfo && <div className="text-sm text-gray-600">Bạn đã có tài khoản? <a href="/login" className="text-sky-600 hover:underline">Đăng nhập</a></div>}
                        <button
                            onClick={() => handleSaveAddress()}
                            className="bg-sky-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-sky-700 disabled:opacity-60"
                        >
                            Lưu thông tin giao hàng
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Địa chỉ đã lưu</h2>

                    {/* Wrapper có border, cố định chiều cao, scroll */}
                    <div className="border rounded-md overflow-hidden">
                        {/* header nhỏ (tuỳ chọn) */}
                        <div className="md:flex px-3 py-2 bg-gray-50 text-sm text-gray-600 justify-between items-center">
                            <p>Chọn một địa chỉ để giao hàng</p>
                            {userInfo &&
                                <button className="p-1 border rounded-lg hover:scale-110 mt-2" onClick={() => setIsAddingAddress(true)}>
                                    + Thêm địa chỉ giao hàng
                                </button>
                            }
                        </div>

                        {/* danh sách scroll */}
                        <div className="max-h-[350px] overflow-y-auto p-3 space-y-3">
                            {addressList.map(address => (
                                <label
                                    key={address.id}
                                    className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer ${chosenAddress?.id === address.id ? "border-sky-400 bg-sky-50" : "border-gray-200"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="selectedAddress"
                                        checked={chosenAddress?.id === address.id}
                                        onChange={() => setChosenAddress(address)}
                                        className="mt-1 h-4 w-4 cursor-pointer"
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium text-gray-800">
                                                {address.fullName ?? "Người nhận"} — <span className="text-sm font-normal text-gray-600">{address.phone ?? address.phone}</span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {address.isDefault ? <span className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded">Mặc định</span> : null}
                                            </div>
                                        </div>

                                        <div className="mt-1 text-sm text-gray-600">
                                            <div>{address.addressLine}</div>
                                            <div>
                                                {address.wardName ?? ""}{address.wardName ? ", " : ""}{address.districtName ?? ""}{address.districtName ? ", " : ""}{address.provinceName ?? ""}
                                            </div>
                                            {address.label && <div className="mt-1 text-xs text-gray-500">Loại: {typeOfAddress(address.label)}</div>}
                                        </div>

                                        <div className="mt-3 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => { /* mở modal sửa nếu cần */ }}
                                                className="text-xs px-3 py-1 border rounded hover:bg-gray-50"
                                            >
                                                Sửa
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteAddress(address.id)}
                                                className="text-xs px-3 py-1 border rounded text-red-600 hover:bg-red-50 disabled:opacity-60"
                                            >
                                                Xóa
                                            </button>

                                            {!address.isDefault && (
                                                <button
                                                    type="button"
                                                    onClick={() => { /* đặt mặc định */ }}
                                                    className="text-xs px-3 py-1 border rounded text-sky-600 hover:bg-sky-50 disabled:opacity-60"
                                                >
                                                    Đặt làm mặc định
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Ghi chú vẫn nằm dưới list */}
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ghi chú cho người giao (ví dụ: giờ nhận hàng, thang máy, ...)"
                        className="mt-4 w-full px-4 py-3 border rounded-md focus:outline-none"
                        rows={3}
                    />
                </>
            )}
        </div>
    )
}

export default DeliveryDetail
