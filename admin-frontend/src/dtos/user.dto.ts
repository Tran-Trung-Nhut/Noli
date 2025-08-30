export type User = {
    id: number,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    phoneNumber: string,
    email?: string,
    address: string,
    gender: string,
    avatar: string,
    type: string,
    lastLogin: Date
    createdAt?: Date
    updatedAt?: Date
}

export const defaultUser: User = {
  id: 0,
  firstName: "Người",
  lastName: "Dùng",
  dateOfBirth: new Date("2000-01-01"),
  phoneNumber: "0000000000",
  email: "default@example.com",
  address: "Chưa cập nhật",
  gender: "Khác",
  avatar: "https://randomuser.me/api/portraits/lego/1.jpg", // avatar mặc định vui nhộn
  type: "default", // hoặc 'guest', 'admin', 'user' tùy theo hệ thống
  lastLogin: new Date("1970-01-01T00:00:00Z"), // thể hiện chưa từng login
  createdAt: new Date(),
  updatedAt: new Date(),
};
