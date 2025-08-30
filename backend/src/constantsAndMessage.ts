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
    AUTH: {
        SUCCESS: {
            LOGOUT: 'Đăng xuất thành công',
        },
        ERROR: {
            INVALID_CREDENTIALS: 'Tên đăng nhập hoặc mật khẩu không đúng',
            USER_NOT_FOUND: 'Không tìm thấy người dùng',
            GOOGLE_LOGIN: 'Đăng nhập với Google thất bại, vui lòng thử lại',
            REFRESH_TOKEN_INVALID: 'Refresh token không hợp lệ, vui lòng đăng nhập lại',
            ACCESS_TOKEN_INVALID: 'Access token không hợp lệ, vui lòng đăng nhập lại',
            UNAUTHORIZED: 'Bạn không có quyền truy cập tài nguyên này',
            FORBIDDEN: 'Bạn không có quyền thực hiện hành động này',
            SIGNUP_FAILED: 'Đăng ký tài khoản thất bại, vui lòng thử lại sau',
            REFRESH_TOKEN_MISSING: 'Refresh token không tồn tại, vui lòng đăng nhập lại',
        }
    },


    USER: {
        SUCCESS: {
            CREATE: 'Đăng ký tài khoản thành công',
            UPDATE: 'Chỉnh sửa sản phẩm thành công',
            DELETE: 'Xoá sản phẩm thành công',
            FETCH_ALL: 'Products fetched successfully',
            FETCH_ONE: 'Product fetched successfully',
        },
        ERROR: {
            NOT_FOUND: 'Không tìm thấy sản phẩm này',
            EXISTED: 'Người dùng đã tồn tại',
            CREATE_FAILED: 'Lỗi khi tạo sản phẩm. Vui lòng thử lại sau',
            UPDATE_FAILED: 'Lỗi khi chỉnh sửa sản phẩm. Vui lòng thử lại sau',
            DELETE_FAILED: 'Lỗi khi xóa sản phẩm. Vui lòng thử lại sau',
        }
    },

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
    },
    CART: {
        SUCCESS: {
            CREATE: 'Đã tạo giỏ hàng thành công',
            UPDATE: 'Chỉnh sửa giỏ hàng thành công',
            DELETE: 'Đã xóa giỏ hàng thành công',
        },
        ERROR: {
            NOT_FOUND: 'Không tìm thấy giỏ hàng này',
            CREATE_FAILED: 'Lỗi khi tạo giỏ hàng. Vui lòng thử lại sau',
            UPDATE_FAILED: 'Lỗi khi chỉnh sửa giỏ hàng. Vui lòng thử lại sau',
            DELETE_FAILED: 'Lỗi khi xóa giỏ hàng. Vui lòng thử lại sau',
        }
    },
    CART_ITEM: {
        SUCCESS: {
            CREATE: 'Đã thêm sản phẩm vào giỏ hàng thành công',
            UPDATE: 'Chỉnh sửa sản phẩm trong giỏ hàng thành công',
            DELETE: 'Đã xóa sản phẩm khỏi giỏ hàng thành công',
        },
        ERROR: {
            NOT_FOUND: 'Không tìm thấy sản phẩm này trong giỏ hàng',
            CREATE_FAILED: 'Lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau',
            UPDATE_FAILED: 'Lỗi khi chỉnh sửa sản phẩm trong giỏ hàng. Vui lòng thử lại sau',
            DELETE_FAILED: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại sau',
        }
    }

}