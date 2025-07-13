
import { useEffect, useState } from "react";
import type { Product } from "../dtos/product.dto";
import { products } from "../mocks/product";
import { addToCartLocalStorage, getCartLocalStorage, isProductInCart, notifySuccess } from "../utils";
import ProductCard from "./ProductCart";


const FeaturedProducts = () => {
    const [cartProducts, setCartProducts] = useState<Product[]>(getCartLocalStorage())

    const addToCart = (product: Product) => {
        if(!isProductInCart(product, cartProducts)){
            setCartProducts([...cartProducts, product]);
            notifySuccess('Đã thêm sản phẩm vào giỏ hàng!')
        }
    }

    useEffect(() => {
        addToCartLocalStorage(cartProducts)
    }, [cartProducts])
    return (
        <section className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-6">Sản Phẩm Nổi Bật</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} cartProducts={cartProducts}/>
            ))}
            </div>
        </section>
    );
};

export default FeaturedProducts