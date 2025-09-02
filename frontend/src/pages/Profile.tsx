import { Mail, User, Phone, Calendar, CalendarDays, Pencil, Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import EditProfileModal from "../components/EditProfile";
import { useAuth } from "../contexts/AuthContext";
import { notifyError, notifySuccess } from "../utils";
import { type UpdateUserDto, type UserDto } from "../dtos/user.dto";
import userApi from "../apis/userApi";
import { HttpStatusCode } from "axios";
import noImage from "../assets/No_image_user.jpg"
import LoadingAuth from "../components/LoadingAuth";

const Profile = () => {
    const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<UserDto | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const { userInfo } = useAuth()

    const fetchUser = async () => {
        if (!userInfo) return notifyError("Có lỗi xảy ra vui lòng thử lại sau")

        const result = await userApi.getUserById(userInfo.id)

        if (result.status !== HttpStatusCode.Ok) return notifyError("Có lỗi xảy ra vui lòng thử lại sau")

        setUserProfile(result.data.data)
    }

    const handleEditProfile = async (editingUser: UpdateUserDto) => {
        setLoading(true)
        if (
            editingUser.dateOfBirth === userProfile?.dateOfBirth &&
            editingUser.email === userProfile.email &&
            editingUser.firstName === userProfile.firstName &&
            editingUser.lastName === userProfile.lastName &&
            editingUser.phoneNumber === userProfile.phoneNumber
        ) {
            setLoading(false)
            return notifySuccess("Cập nhật thông tin người dùng thành công.")
        }

        const result = await userApi.updateUser(userProfile?.id || 0, editingUser)

        if (result.status !== HttpStatusCode.Ok) {
            setLoading(false)
            return notifyError("Có lỗi xảy ra, vui lòng thử lại")
        }
        await fetchUser()
        setLoading(false)
        notifySuccess("Cập nhật thông tin người dùng thành công")
    }

    useEffect(() => { fetchUser() }, [])

    return (
        <>
            {isEditingProfile && (
                <EditProfileModal
                    userInfo={userProfile}
                    isOpen={isEditingProfile}
                    onClose={() => setIsEditingProfile(false)}
                    onSave={handleEditProfile}
                />
            )}

            {loading && <LoadingAuth/>}

            <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center p-6">
                <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-sky-500 h-32 relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-48px]">
                            <img
                                src={
                                    userProfile?.image || noImage
                                }
                                alt="avatar"
                                className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                            />
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                            <div className="flex items-center gap-2">
                                <User size={20} className="text-sky-500" />
                                <span className="font-medium">Username:</span>
                                <span>{userProfile?.username || "username"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={20} className="text-sky-500" />
                                <span className="font-medium">Email:</span>
                                <span>{userProfile?.email || "Chưa có email"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={20} className="text-sky-500" />
                                <span className="font-medium">Điện thoại:</span>
                                <span>{userProfile?.phoneNumber || "Chưa có số điện thoại"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={20} className="text-sky-500" />
                                <span className="font-medium">Ngày sinh:</span>
                                <span>
                                    {userProfile?.dateOfBirth
                                        ? new Date(userProfile?.dateOfBirth).toLocaleDateString("vi-VN")
                                        : "Chưa cập nhật"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 md:col-span-2">
                                <CalendarDays size={20} className="text-sky-500" />
                                <span className="font-medium">Ngày đăng ký:</span>
                                <span>
                                    {new Date(userProfile?.registeredAt || "01-01-2000").toLocaleDateString("vi-VN")}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Order Summary Section */}
                    <div className="px-8 pb-10">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Tóm tắt đơn hàng</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            <div className="bg-sky-50 rounded-xl p-4 shadow hover:shadow-md transition flex flex-col items-center">
                                <Package className="text-sky-500 mb-2" size={28} />
                                <p className="text-gray-500 text-sm text-center">Tổng đơn</p>
                                <p className="text-2xl font-bold text-sky-600">0</p>
                            </div>
                            <div className="bg-yellow-50 rounded-xl p-4 shadow hover:shadow-md transition flex flex-col items-center">
                                <Clock className="text-yellow-500 mb-2" size={28} />
                                <p className="text-gray-500 text-sm text-center">Chờ thanh toán</p>
                                <p className="text-2xl font-bold text-yellow-600">0</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4 shadow hover:shadow-md transition flex flex-col items-center">
                                <Truck className="text-blue-500 mb-2" size={28} />
                                <p className="text-gray-500 text-sm text-center">Đang giao</p>
                                <p className="text-2xl font-bold text-blue-600">0</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-4 shadow hover:shadow-md transition flex flex-col items-center">
                                <CheckCircle className="text-green-500 mb-2" size={28} />
                                <p className="text-gray-500 text-sm text-center">Hoàn thành</p>
                                <p className="text-2xl font-bold text-green-600">0</p>
                            </div>
                            <div className="bg-red-50 rounded-xl p-4 shadow hover:shadow-md transition flex flex-col items-center">
                                <XCircle className="text-red-500 mb-2" size={28} />
                                <p className="text-gray-500 text-sm text-center">Đã hủy</p>
                                <p className="text-2xl font-bold text-red-600">0</p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
};

export default Profile;
