export type Product = {
    id: number,
    price: number,
    name: string,
    description: string,
    image: string[]
}

export const defaultProduct : Product = {
    id: 0,
    price: 0,
    description: "Đây là mô tả sản phẩm mặc định",
    name: "Sản phẩm mặc định",
    image: []
}