import { useState } from "react";
import { Mail, User, Phone, Calendar, UserSquare } from "lucide-react";
import type { UpdateUserDto } from "../dtos/user.dto";
import { isValidEmail, notifyWarning } from "../utils";

const EditProfileModal = ({
    userInfo,
    onClose,
    onSave
}: {
    userInfo: any
    onClose: () => void,
    onSave: (formData: UpdateUserDto) => void
}) => {
    const [formData, setFormData] = useState(userInfo);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (formData.email && !isValidEmail(formData.email)) return notifyWarning("Định dạng email không chính xác")
        if (formData.phoneNumber && formData.phoneNumber.length < 10) return notifyWarning("Số điện thoại không đúng định dạng")

        onSave(formData);
        onClose();
    };

    function formatDateForInput(date: string | Date | null | undefined): string {
        if (!date) return ""; 

        const d = new Date(date);
        if (isNaN(d.getTime())) return "";

        return d.toISOString().split("T")[0];
    }


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-4 sm:p-6 relative">
                {/* Close button */}
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
                    Chỉnh sửa thông tin cá nhân
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                            <User className="text-sky-500" size={18} />
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            readOnly
                            disabled
                            className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
                        />
                    </div>

                    {/* Họ & Tên */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <UserSquare className="text-sky-500" size={18} />
                                Họ
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-sky-200"
                                placeholder="Nhập họ"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <User className="text-sky-500" size={18} />
                                Tên
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-sky-200"
                                placeholder="Nhập tên"
                            />
                        </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <Mail className="text-sky-500" size={18} />
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-sky-200"
                                placeholder="Nhập email"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <Phone className="text-sky-500" size={18} />
                                Số điện thoại
                            </label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-sky-200"
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                    </div>

                    {/* Ngày sinh */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                            <Calendar className="text-sky-500" size={18} />
                            Ngày sinh
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formatDateForInput(formData.dateOfBirth)}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-sky-200"
                        />
                    </div>

                    <div className="flex gap-5">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                            <User className="text-sky-500" size={18} />
                            Giới tính
                        </label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === "male"}
                                    onChange={handleChange}
                                    className="text-sky-500 focus:ring-sky-200"
                                />
                                Nam
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === "female"}
                                    onChange={handleChange}
                                    className="text-sky-500 focus:ring-sky-200"
                                />
                                Nữ
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="other"
                                    checked={formData.gender === "other"}
                                    onChange={handleChange}
                                    className="text-sky-500 focus:ring-sky-200"
                                />
                                Khác
                            </label>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 w-full sm:w-auto"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
