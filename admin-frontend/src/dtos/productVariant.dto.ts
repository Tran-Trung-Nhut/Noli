export type ProductVariant = {
  id: number
  productId: number
  size: string
  color: string
  price: number
  stock: number
  createdAt?: Date
  updatedAt?: Date
}

export type CreateProductVariant = Omit<ProductVariant, "id" | "productId">