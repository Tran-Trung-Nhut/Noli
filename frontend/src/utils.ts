import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import type { Product } from "./dtos/product.dto";

export const notifySuccess = (message: string) => toast.success(message, { position: 'top-right', autoClose: 2000 })

export const notifyError = (message: string) => toast.error(message, { position: 'top-right', autoClose: 3000 })

export const notifyWarning = (message: string) => toast.warning(message, { position: 'top-right', autoClose: 3000 })

export const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN', { minimumFractionDigits: 0 }) + 'đ';
};

export const getGuestToken = (): string | null => {
    return localStorage.getItem('guest_token')
}

export const setGuestToken = (token: string): void => {
    localStorage.setItem('guest_token', token)
}

export const removeGuestToken = (): void => {
    localStorage.removeItem('guest_token')
}

export function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


export const hasLoggedIn = (): boolean => {
    console.log(document.cookie);
    return document.cookie.split(";").some(c => c.trim().startsWith("loggedIn="));
}

export const totalPriceOfAllProducts = (products: Product[]): number => {
    return products.reduce((sum, product) => sum + product.defaultPrice, 0);
};

export const addToCartLocalStorage = (products: Product[]) => {
    localStorage.setItem('cart', JSON.stringify(products))
};

export const getCartLocalStorage = (): Product[] => {
    const products = localStorage.getItem('cart')

    return products === null ? [] : JSON.parse(products)
};

export const removeFromCartLocalStorage = (id: number) => {
    const products = getCartLocalStorage()
    const products_after_removed = products.filter(products => products.id !== id)
    localStorage.setItem('cart', JSON.stringify(products_after_removed))
}

export const isProductInCart = (product: Product, cartProducts: Product[]): boolean => {
    return cartProducts.some(productInCart => { if (productInCart.id === product.id) return true }) ?? false
}




export const confirm = async (title: string, text: string, confirmAction: () => void) => {
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        reverseButtons: true, // Đảo vị trí nút (Xác nhận bên phải)
        confirmButtonColor: '#3085d6', // Màu nút Xác nhận
        cancelButtonColor: 'gray', // Màu nút Hủy
        customClass: {
            icon: 'w-16 h-16',
            title: 'font-bold text-2xl md:text-3xl',
            popup: 'w-[80%] md:w-[40%]'
        },
    });

    if (result.isConfirmed) {
        confirmAction()
    }
    // else if (result.dismiss === Swal.DismissReason.cancel) {
    //   console.log('Đã hủy');
    // }
};