import { Mail, User, Phone, Calendar, CalendarDays, Pencil, Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import EditProfileModal from "../components/EditProfile";
import { useAuth } from "../contexts/AuthContext";
import { getGender, notifyError, notifySuccess } from "../utils";
import { type UpdateUserDto, type UserDto } from "../dtos/user.dto";
import userApi from "../apis/userApi";
import { HttpStatusCode } from "axios";
import noImage from "../assets/No_image_user.jpg"
import LoadingAuth from "../components/LoadingAuth";
import orderApi from "../apis/orderApi";
import OrderList from "../components/OrderList";
import { FaCamera } from "react-icons/fa6";
import AvatarUploadModal from "../components/AvatarUploadModal";

const Profile = () => {
    const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<UserDto | null>(null)
    const [totalOrders, setTotalOrders] = useState<number>(0)
    const [totalPendingPayment, setTotalPendingPayment] = useState<number>(0)
    const [totalDelivery, setTotalDelivery] = useState<number>(0)
    const [totalCompleted, setTotalCompleted] = useState<number>(0)
    const [totalCancel, setTotalCancel] = useState<number>(0)
    const [chosenSummaryOrder, setChosenSummaryOrder] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [isOpenChangeImage, setIsOpenChangeImage] = useState<boolean>(false)
    const { userInfo } = useAuth()

    const fetchUser = async () => {
        if (!userInfo) return notifyError("Có lỗi xảy ra vui lòng thử lại sau")
        setLoading(true)

        const result = await userApi.getUserById(userInfo.id)

        if (result.status !== HttpStatusCode.Ok) {
            setLoading(false)
            return notifyError("Có lỗi xảy ra vui lòng thử lại sau")
        }

        setUserProfile(result.data.data)

        setLoading(false)
    }

    const handleEditProfile = async (editingUser: UpdateUserDto) => {
        setLoading(true)
        if (
            editingUser.dateOfBirth === userProfile?.dateOfBirth &&
            editingUser.email === userProfile.email &&
            editingUser.firstName === userProfile.firstName &&
            editingUser.lastName === userProfile.lastName &&
            editingUser.phoneNumber === userProfile.phoneNumber &&
            editingUser.gender === userProfile.gender
        ) {
            setLoading(false)
            return notifySuccess("Cập nhật thông tin người dùng thành công.")
        }

        const result = await userApi.updateUser(userProfile?.id || 0, {
            email: editingUser.email === '' ? null : editingUser.email,
            dateOfBirth: editingUser.dateOfBirth,
            firstName: editingUser.firstName,
            lastName: editingUser.lastName,
            phoneNumber: editingUser.phoneNumber,
            gender: editingUser.gender
        })

        if (result.status !== HttpStatusCode.Ok) {
            setLoading(false)

            return notifyError("Không thể cập nhật thông tin. Vui lòng thử lại sau")
        }
        await fetchUser()
        setLoading(false)
        notifySuccess("Cập nhật thông tin người dùng thành công")
    }

    const fetchOrderSummary = async () => {
        setLoading(true)

        if (!userInfo) return setLoading(false)

        const result = await orderApi.getOrderSummary(userInfo.id)

        if (result.status !== HttpStatusCode.Ok) return setLoading(false)

        setTotalOrders(result.data[0])
        setTotalPendingPayment(result.data[1])
        setTotalDelivery(result.data[2])
        setTotalCompleted(result.data[3])
        setTotalCancel(result.data[4])
        setLoading(false)
    }

    useEffect(() => {
        fetchUser()
        fetchOrderSummary()
    }, [])

    return (
        <>

            {isEditingProfile &&
                <EditProfileModal
                    userInfo={userProfile}
                    onClose={() => setIsEditingProfile(false)}
                    onSave={handleEditProfile}
                />
            }


            <AvatarUploadModal
                isOpen={isOpenChangeImage}
                onClose={() => setIsOpenChangeImage(false)}
                currentImage={userProfile?.image}
                onUploadSuccess={() => {
                    fetchUser()
                    notifySuccess("Thay đổi ảnh đại diện thành công!")
                }}
                userId={userInfo?.id || 0}
            />

            {loading && <LoadingAuth />}

            <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center p-6">
                <div className="w-full max-w-[90%] bg-white shadow-xl rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-sky-500 h-32 relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-48px]">
                            <div className="relative group w-24 h-24">
                                <img
                                    src={userProfile?.image || noImage}
                                    alt="avatar"
                                    className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                                />

                                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {/* Icon máy ảnh */}
                                    <button className=" flex flex-col items-center justify-center gap-1" onClick={() => setIsOpenChangeImage(true)}>
                                        <FaCamera color="white" />
                                        <span className="text-xs text-white italic">{userProfile?.image ? "Đổi ảnh" : "Tải ảnh"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="mt-16 px-8 pb-8">
                        {/* Name + Edit icon */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center gap-2">
                                <p className="text-2xl font-bold text-gray-800">
                                    {userProfile?.firstName || "Tên"} {userProfile?.lastName || "người dùng"}
                                </p>
                                <button
                                    onClick={() => setIsEditingProfile(true)}
                                    className="relative group"
                                >
                                    <Pencil
                                        size={20}
                                        className="text-gray-500 hover:scale-110 cursor-pointer"
                                    />
                                    {/* Tooltip */}
                                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs bg-gray-800 text-white rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                        Chỉnh sửa hồ sơ
                                    </span>
                                </button>
                            </div>
                            <p className="text-gray-500 mt-1">Thành viên</p>
                        </div>

                        {/* Info Grid */}
                        <div className="md:flex md:justify-center md:items-center">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                                {/* Cột trái */}
                                <div className="flex items-center gap-2">
                                    <User size={20} className="text-sky-500" />
                                    <span className="font-medium">Username:</span>
                                    <span>{userProfile?.username || "username"}</span>
                                </div>

                                {/* Cột phải */}
                                <div className="flex items-center gap-2">
                                    <Mail size={20} className="text-sky-500" />
                                    <span className="font-medium">Email:</span>
                                    <span>{userProfile?.email || "Chưa có email"}</span>
                                </div>

                                {/* Cột trái */}
                                <div className="flex items-center gap-2">
                                    <Phone size={20} className="text-sky-500" />
                                    <span className="font-medium">Điện thoại:</span>
                                    <span>{userProfile?.phoneNumber || "Chưa có số điện thoại"}</span>
                                </div>

                                {/* Cột phải */}
                                <div className="flex items-center gap-2">
                                    <Calendar size={20} className="text-sky-500" />
                                    <span className="font-medium">Ngày sinh:</span>
                                    <span>
                                        {userProfile?.dateOfBirth
                                            ? new Date(userProfile?.dateOfBirth).toLocaleDateString("vi-VN")
                                            : "Chưa cập nhật"}
                                    </span>
                                </div>

                                {/* Cột trái */}
                                <div className="flex items-center gap-2">
                                    <User size={20} className="text-sky-500" />
                                    <span className="font-medium">Giới tính:</span>
                                    <span>{getGender(userProfile?.gender ?? null)}</span>
                                </div>

                                {/* Cột phải */}
                                <div className="flex items-center gap-2">
                                    <CalendarDays size={20} className="text-sky-500" />
                                    <span className="font-medium">Ngày đăng ký:</span>
                                    <span>
                                        {new Date(userProfile?.registeredAt || "01-01-2000").toLocaleDateString("vi-VN")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Order Summary Section */}
                    <div className="px-8 pb-10">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center border-t-2">Đơn hàng của bạn</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            <button className={`${chosenSummaryOrder === "ALL" ? "bg-sky-300" : "bg-sky-50 hover:shadow-md"} rounded-xl p-4 shadow transition flex flex-col items-center`}
                                disabled={chosenSummaryOrder === "ALL"}
                                onClick={() => setChosenSummaryOrder('ALL')}>
                                <Package className="text-sky-500 mb-2" size={28} />
                                <p className="text-gray-500 text-sm text-center">Tổng đơn</p>
                                <p className="text-2xl font-bold text-sky-600">{totalOrders}</p>
                            </button>
                            <button className={`${chosenSummaryOrder === "PENDING_PAYMENT" ? "bg-yellow-300" : "bg-yellow-50 hover:shadow-md"} rounded-xl p-4 shadow transition flex flex-col items-center`}
                                disabled={chosenSummaryOrder === "PENDING_PAYMENT"}
                                onClick={() => setChosenSummaryOrder('PENDING_PAYMENT')}>
                                <Clock className="text-yellow-500 mb-2" size={28} />
                                <p className="text-gray-500 text-sm text-center">Chờ thanh toán</p>
                                <p className="text-2xl font-bold text-yellow-600">{totalPendingPayment}</p>
                            </button>
                            <button className={`${chosenSummaryOrder === "DELIVERY" ? "bg-blue-300" : "bg-blue-50 hover:shadow-md"} rounded-xl p-4 shadow transition flex flex-col items-center`}
                                disabled={chosenSummaryOrder === "DELIVERY"}
                                onClick={() => setChosenSummaryOrder('DELIVERY')}>
                                <Truck className="text-blue-500 mb-2" size={28} />
                                <p className="text-gray-500 text-sm text-center">Đang giao</p>
                                <p className="text-2xl font-bold text-blue-600">{totalDelivery}</p>
                            </button>
                            <button className={`${chosenSummaryOrder === "COMPLETED" ? "bg-green-300" : "bg-green-50 hover:shadow-md"} rounded-xl p-4 shadow transition flex flex-col items-center`}
                                disabled={chosenSummaryOrder === "COMPLETED"}
                                onClick={() => setChosenSummaryOrder('COMPLETED')}>
                                <CheckCircle className="text-green-500 mb-2" size={28} />
                                <p className="text-gray-500 text-sm text-center">Hoàn thành</p>
                                <p className="text-2xl font-bold text-green-600">{totalCompleted}</p>
                            </button>
                            <button
                                className={`${chosenSummaryOrder === "cancel" ? "bg-red-300" : "bg-red-50 hover:shadow-md"} rounded-xl p-4 shadow transition flex flex-col items-center`}
                                disabled={chosenSummaryOrder === "CANCEL"}
                                onClick={() => setChosenSummaryOrder('CANCEL')}>
                                <XCircle className="text-red-500 mb-2" size={28} />
                                <p className="text-gray-500 text-sm text-center">Đã hủy</p>
                                <p className="text-2xl font-bold text-red-600">{totalCancel}</p>
                            </button>
                        </div>
                    </div>
                    {userProfile && chosenSummaryOrder && <OrderList userProfile={userProfile} chosen={chosenSummaryOrder} />}
                </div>

            </div>
        </>
    );
};

export default Profile;
