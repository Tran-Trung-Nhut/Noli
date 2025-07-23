import { toast } from "react-toastify";
import Swal from 'sweetalert2';

export const notifySuccess = (message: string) => toast.success(message, { position: 'top-right', autoClose: 2000 })

export const notifyError = (message: string) => toast.error(message, { position: 'top-right', autoClose: 2000 })


export const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN', { minimumFractionDigits: 0 }) + 'đ';
};

export const formatDate = (date: Date | undefined) => {
    if (!date) return 'Chưa cập nhật';
    return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const confirm = async (title: string, text: string, confirmAction:() => void) => {
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
      customClass:{
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