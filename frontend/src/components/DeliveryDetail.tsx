import type { District, Province, Ward } from "../pages/Checkout"

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
    setNote
} : {
    fullName: string
    setFullName: (value: string) => void
    email: string
    setEmail: (value: string) => void
    phone: string
    setPhone : (value: string) => void
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
}) => {
    return (
        <div className="w-full lg:w-[55%] bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin giao hàng</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú cho người giao (ví dụ: giờ nhận hàng, thang máy, ...)"
                className="mt-4 w-full px-4 py-3 border rounded-md focus:outline-none"
                rows={3}
            />

            <div className="mt-6 border-t pt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">Bạn đã có tài khoản? <a href="/login" className="text-sky-600 hover:underline">Đăng nhập</a></div>
                {/* <button
                    onClick={() => { }}
                    className="bg-sky-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-sky-700 disabled:opacity-60"
                >
                    Tiếp tục đến phương thức thanh toán
                </button> */}
            </div>
        </div>
    )
}

export default DeliveryDetail