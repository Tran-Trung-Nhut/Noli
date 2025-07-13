import product_1_image from "../assets/mock_image/product_1/image_0.jpg"
import product_2_image from "../assets/mock_image/product_2/image_0.jpg"
import product_3_image from "../assets/mock_image/product_3/image_2.jpg"
import product_4_image from "../assets/mock_image/product_4/image_0.jpg"
import type { Product } from "../dtos/Product.dto";

export const products : Product[] = [
    { id: 1, name: 'Túi đeo mini Noli 1', price: 200000, image: [product_1_image] },
    { id: 2, name: 'Túi xách jean Noli 1', price: 299000, image: [product_2_image] },
    { id: 3, name: 'Túi xách jean Noli 2', price: 290000, image: [product_3_image] },
    { id: 4, name: 'Túi đeo mini Noli 2', price: 20000, image: [product_4_image] },
];