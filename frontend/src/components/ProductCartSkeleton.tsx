const ProductCardSkeleton = () => {
    return (
        <div className="bg-white shadow-md rounded-md overflow-hidden">
            {/* Ảnh */}
            <div className="w-full h-64 bg-gray-300 animate-pulse"></div>

            <div className="p-4 space-y-2">
                <div className="h-5 bg-gray-300 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2"></div>
            </div>

            {/* Nút */}
            {/* Nếu muốn skeleton cho nút, có thể mở phần dưới */}
            {/* <div className="flex justify-center gap-3 pb-3 px-2">
        <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
      </div> */}
        </div>
    );
};

export default ProductCardSkeleton;
