import product_1_image_1 from "../assets/mock_image/product_1/image_0.jpg"
import product_1_image_2 from "../assets/mock_image/product_1/image_1.jpg"
import product_1_image_3 from "../assets/mock_image/product_1/image_2.jpg"
import product_1_image_4 from "../assets/mock_image/product_1/image_3.jpg"
import product_2_image from "../assets/mock_image/product_2/image_0.jpg"
import product_3_image_1 from "../assets/mock_image/product_3/image_2.jpg"
import product_3_image_3 from "../assets/mock_image/product_3/image_0.jpg"
import product_3_image_2 from "../assets/mock_image/product_3/image_1.jpg"
import product_4_image_1 from "../assets/mock_image/product_4/image_0.jpg"
import product_4_image_2 from "../assets/mock_image/product_4/image_1.jpg"
import type { Product } from "../dtos/product.dto";

export const products : Product[] = [
    { id: 1, name: 'Túi đeo mini Noli 1', price: 200000, image: [product_1_image_1, product_1_image_2, product_1_image_3, product_1_image_4] },
    { id: 2, name: 'Túi xách jean Noli 1', price: 299000, image: [product_2_image] },
    { id: 3, name: 'Túi xách jean Noli 2', price: 290000, image: [product_3_image_1, product_3_image_2, product_3_image_3] },
    { id: 4, name: 'Túi đeo mini Noli 2', price: 20000, image: [product_4_image_1, product_4_image_2] },
];