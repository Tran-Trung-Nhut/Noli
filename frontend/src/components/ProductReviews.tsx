import { useEffect, useState } from "react";
import type { Review } from "../dtos/review.dto";
import type { UserDto } from "../dtos/user.dto";
import No_image from "../assets/No_image_user.jpg"
import { confirm, formatDateTime, notifyError } from "../utils";
import { reviewApi } from "../apis/reviewApi";
import { HttpStatusCode } from "axios";
import LoadingAuth from "./LoadingAuth";
import Not_found from "../assets/product-not-found.svg"
import type { PublicUserInfo } from "../contexts/AuthContext";
import { FaEllipsisH } from "react-icons/fa";


export const Star = ({
    filled
}: {
    filled: boolean
}) => {
    return (
        <svg
            className={`w-4 h-4 ${filled ? "text-yellow-400" : "text-gray-300"}`}
            viewBox="0 0 20 20"
            fill={"currentColor"}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.784.57-1.84-.197-1.54-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.044 9.401c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z"
                fillRule="evenodd"
                clipRule="evenodd"
            />
        </svg>
    );
}

const ProductReviews = ({
    averageRating,
    productId,
    turnOnOpenWriteReview,
    userInfo,
    fetchProductDetail,
    setListImageViewing,
    setImageActiveIndex
}: {
    averageRating: number | null,
    productId: number
    turnOnOpenWriteReview: () => void,
    userInfo: PublicUserInfo | null
    fetchProductDetail: () => void
    setListImageViewing: (list: string[]) => void
    setImageActiveIndex: (index: number) => void
}) => {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [reviews, setReviews] = useState<(Review & { user: UserDto })[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [openOptionReview, setOpenOptionReview] = useState<number>(0)


    const fetchReviews = async (productId: number) => {
        setLoading(true)
        const result = await reviewApi.getRevewByProductId(productId)

        if (result.status !== HttpStatusCode.Ok) {
            notifyError("Lỗi khi tải đánh giá. Vui lòng thử lại sau!")
            return setLoading(false)
        }


        setReviews(result.data)

        setLoading(false)
    }

    const handleDeleteReview = async (id: number) => {
        confirm("Xóa đánh giá", "Bạn có chắc muốn xóa đánh giá này. Đánh giá này sẽ bị xóa khỏi hệ thống hoàn toàn và không thể khôi phục!", async () => {
            setLoading(true)

            const result = await reviewApi.deleteReview(id)

            if (result.status !== HttpStatusCode.Ok) {
                setLoading(false)
                return notifyError("Xóa đánh giá thất bại. Vui lòng thử lại sau!")
            }

            fetchProductDetail()

            setLoading(false)
        })
    }

    useEffect(() => { fetchReviews(productId) }, [productId])

    return (
        <>
            {loading && <LoadingAuth />}
            <section className="w-full mx-auto px-6 py-12">
                <div className="flex flex-col gap-6">
                    {/* Left column: Average + Summary */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl border-t-4 border-sky-500">
                        <h1 className="text-center font-bold text-2xl">ĐÁNH GIÁ SẢN PHẨM</h1>
                        <div className="text-sm text-gray-500">Đánh giá trung bình</div>
                        <div className="mt-3 flex items-center gap-3">
                            <div className="text-3xl font-semibold text-slate-800">{(averageRating || 0).toFixed(1)}</div>
                            <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} filled={i < (averageRating || 0)} />
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">{reviews.length} đánh giá</div>

                        <div className="mt-6">
                            {userInfo ? (
                                <button
                                    className="w-[200px] inline-flex justify-center items-center gap-2 rounded-xl py-2 px-4 border border-sky-500 text-sky-600 font-medium shadow-sm hover:bg-sky-50"
                                    onClick={() => turnOnOpenWriteReview()}
                                >
                                    Viết đánh giá
                                </button>
                            ) : (
                                <h1 className="italic">Đăng nhập để viết đánh giá của bạn</h1>
                            )}
                        </div>
                    </div>

                    {/* Right column: Reviews list */}
                    <div className="">
                        <div className="grid gap-6">
                            {reviews.map((r) => (
                                <article
                                    key={r.id}
                                    className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-slate-700 font-medium">
                                                <img src={r.user.image || No_image} alt={r.user.firstName + " " + r.user.lastName} className="w-12 h-12 rounded-full object-cover" />

                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="text-sm font-medium text-slate-800">{r.user.firstName + " " + r.user.lastName}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex items-center">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star key={i} filled={i < r.rating} />
                                                            ))}
                                                        </div>
                                                        <div className="text-xs text-gray-400">• {formatDateTime(r.createdAt.toString())}</div>
                                                    </div>
                                                </div>
                                                {/* <div className="text-sm text-gray-500">{r.helpful ?? 0} hữu ích</div> */}
                                                {userInfo && userInfo.id === r.userId && (
                                                    <div className="relative">
                                                        <button className="border-none bg-white focus-none" onClick={() => setOpenOptionReview(openOptionReview === 0 ? r.id : 0)}>
                                                            <FaEllipsisH color="gray" />
                                                        </button>
                                                        {openOptionReview === r.id && (
                                                            <div className="absolute right-0 w-44 bg-white border border-gray-200 rounded-lg shadow-lg translate-y-0 transform -translate-y-2 transition-all duration-200">
                                                                <ul className="py-1">
                                                                    <li>
                                                                        <button
                                                                            onClick={() => handleDeleteReview(r.id)}
                                                                            className="block w-full text-left px-2 py-1 text-gray-700 hover:bg-gray-100">Xóa</button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-3 text-gray-700 leading-6">
                                                {expandedId === r.id ? (
                                                    <>
                                                        <p>{r.text}</p>
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            {r.images?.map((p, idx) => (
                                                                <img
                                                                    key={idx}
                                                                    src={p}
                                                                    alt={`photo-${idx}`}
                                                                    className="w-20 h-20 object-cover rounded-lg border"
                                                                    onClick={() => {
                                                                        setListImageViewing(r.images)
                                                                        setImageActiveIndex(idx)
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                        <button
                                                            className="mt-3 text-xs text-sky-600 font-medium"
                                                            onClick={() => setExpandedId(null)}
                                                        >
                                                            Thu gọn
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="line-clamp-3">{r.text}</p>
                                                        <div className="mt-3 flex flex-col items-start justify-start gap-3">
                                                            {r.images.length > 0 && (
                                                                <div className="flex items-center gap-2">
                                                                    {r.images.slice(0, 3).map((p, idx) => (
                                                                        <img
                                                                            key={idx}
                                                                            src={p}
                                                                            alt={`thumb-${idx}`}
                                                                            className="w-12 h-12 object-cover rounded-md border"
                                                                            onClick={() => {
                                                                                setListImageViewing(r.images)
                                                                                setImageActiveIndex(idx)
                                                                            }}
                                                                        />
                                                                    ))}
                                                                    {r.images.length > 3 && (
                                                                        <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-sm text-gray-600 border">
                                                                            +{r.images.length - 3}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {r.images.length > 3 &&
                                                                <button
                                                                    className="text-sm text-sky-600 font-medium"
                                                                    onClick={() => setExpandedId(r.id)}
                                                                >
                                                                    Xem thêm
                                                                </button>
                                                            }
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* <div className="mt-4 flex items-center gap-4">
                                            <button className="text-sm text-gray-600 hover:text-sky-600">Trả lời</button>
                                            <button className="text-sm text-gray-600 hover:text-sky-600">Báo cáo</button>
                                            <button className="ml-auto text-sm text-gray-600 hover:text-sky-600">Hữu ích · {r.helpful ?? 0}</button>
                                        </div> */}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Load more / pagination (simple) */}

                        <div className="mt-6 flex justify-center items-center">
                            {reviews.length === 0 ? (
                                <div className="flex flex-col justify-center">
                                    <img src={Not_found} className="w-[200px]" />
                                    <h1 className="text-center mt-5 italic">Không có đánh giá nào</h1>
                                </div>
                            ) : (
                                <></>
                                // <button
                                //     className="px-5 py-2 rounded-full border border-slate-200 text-slate-700 hover:shadow-sm"
                                // >
                                //     Xem thêm đánh giá
                                // </button>
                            )}
                        </div>

                    </div>
                </div>
            </section >
        </>
    );
}


export default ProductReviews