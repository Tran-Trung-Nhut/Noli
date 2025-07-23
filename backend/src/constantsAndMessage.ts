export const JSON_RESPONSE = (status: number, message: string, data?: any) => {
    return {
        status,
        message,
        data: data || null
    };
}

export const APP_CONSTANTS = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    DEFAULT_SORT_BY: 'createdAt',
    DEFAULT_SORT_ORDER: 'asc',
    DEFAULT_SEARCH: '',
    FEATURE_PRODUCTS_LIMIT: 5,
}

export const MESSAGES = {
    PRODUCT: {
        SUCCESS: {
            CREATE: 'Đã thêm sản phẩm thành công',
            UPDATE: 'Chỉnh sửa sản phẩm thành công',
            DELETE: 'Xoá sản phẩm thành công',
            FETCH_ALL: 'Products fetched successfully',
            FETCH_ONE: 'Product fetched successfully',
        },
        ERROR: {
            NOT_FOUND: 'Không tìm thấy sản phẩm này',
            EXISTED: 'Sản phẩm đã tồn tại',
            CREATE_FAILED: 'Lỗi khi tạo sản phẩm. Vui lòng thử lại sau',
            UPDATE_FAILED: 'Lỗi khi chỉnh sửa sản phẩm. Vui lòng thử lại sau',
            DELETE_FAILED: 'Lỗi khi xóa sản phẩm. Vui lòng thử lại sau',
        }
    },
    PRODUCT_VARIANT: {
        SUCCESS: {
            CREATE: 'Đã thêm màu và kích thước sản phẩm thành công',
            UPDATE: 'Chỉnh sửa màu sắc và kích thước thành công',
            DELETE: 'Đã xóa màu và kích thước của sản phẩm',
            FETCH_ALL: 'Product variants fetched successfully',
            FETCH_ONE: 'Product variant fetched successfully',
        },
        ERROR: {
            NOT_FOUND: 'Không tìm thấy màu sắc và kích thước này của sản phẩm',
            CREATE_FAILED: 'Lỗi khi tạo màu sắc và kích thước sản phẩm. Vui lòng thử lại sau',
            UPDATE_FAILED: 'Lỗi khi chỉnh sửa màu sắc và kích thước sản phẩm. Vui lòng thử lại sau',
            DELETE_FAILED: 'Lỗi khi xóa màu sắc và kích thước sản phẩm. Vui lòng thử lại sau',
        }
    }

}