export type Product = {
    id: number,
    price: number,
    name: string,
    image: string[]
}

export const defaultProduct : Product = {
    id: 0,
    price: 0,
    name: "Sản phẩm mặc định",
    image: []
}