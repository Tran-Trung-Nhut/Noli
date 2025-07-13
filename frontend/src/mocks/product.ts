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
    { 
        id: 1, 
        name: 'Túi đeo mini Noli 1', 
        price: 200000, 
        description: 'Chiếc túi đeo mini thời trang, thiết kế nhỏ gọn, tiện lợi cho những buổi dạo phố.', 
        image: [product_1_image_1, product_1_image_2, product_1_image_3, product_1_image_4] 
    },
    { 
        id: 2, 
        name: 'Túi xách jean Noli 1', 
        price: 299000, 
        description: 'Túi xách jean phong cách trẻ trung, phù hợp với nhiều kiểu trang phục khác nhau.', 
        image: [product_2_image] 
    },
    { 
        id: 3, 
        name: 'Túi xách jean Noli 2', 
        price: 290000, 
        description: 'Phiên bản túi xách jean Noli 2 với kiểu dáng cá tính, chất liệu bền đẹp.', 
        image: [product_3_image_1, product_3_image_2, product_3_image_3] 
    },
    { 
        id: 4, 
        name: 'Túi đeo mini Noli 2', 
        price: 20000, 
        description: 'Túi đeo mini Noli 2 gọn nhẹ, thích hợp cho những buổi dạo chơi hoặc du lịch.', 
        image: [product_4_image_1, product_4_image_2] 
    },
];
