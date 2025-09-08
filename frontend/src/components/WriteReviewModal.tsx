import React, { useCallback, useEffect, useRef, useState } from "react";
import { Star } from "./ProductReviews";
import { notifyError, notifySuccess } from "../utils";
import { reviewApi } from "../apis/reviewApi";
import { HttpStatusCode } from "axios";
import type { PublicUserInfo } from "../contexts/AuthContext";

// WriteReviewModal.tsx
// React + Tailwind modal for creating a review with rating, text, and image uploads.
// - Default export: WriteReviewModal
// - Props: productId, open, onClose, onSubmitted (callback to refresh parent)
// - Expects reviewApi.createReview(formData) to accept FormData: { productId, rating, text, files[] }


type UploadPreview = {
    id: string;
    file: File;
    url: string; // local preview
};

const WriteReviewModal = ({
    productId,
    open,
    onClose,
    onSubmitted,
    userInfo
}: {
    productId: number;
    open: boolean;
    onClose: () => void;
    onSubmitted?: () => void;
    userInfo: PublicUserInfo | null
}) => {
    const [rating, setRating] = useState<number>(5);
    const [text, setText] = useState<string>("");
    const [images, setImages] = useState<UploadPreview[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [progress, setProgress] = useState<number>(0)
    const [uploading, setUploading] = useState<boolean>(false)

    useEffect(() => {
        if (!open) {
            // reset internal state when closed
            setRating(5);
            setText("");
            setImages([]);
            setLoading(false);
        }
    }, [open]);

    const onFilesChosen = useCallback((files: FileList | null) => {
        if (!files) return;
        const maxFiles = 5;
        const allowed = Array.from(files).slice(0, maxFiles - images.length);

        const previews = allowed.map((f) => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            file: f,
            url: URL.createObjectURL(f),
        }));

        setImages((prev) => [...prev, ...previews]);
    }, [images.length]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        onFilesChosen(e.dataTransfer.files);
    };

    const handleSelectFiles = () => {
        inputRef.current?.click();
    };

    const removeImage = (id: string) => {
        setImages((prev) => prev.filter((p) => p.id !== id));
    };

    const validate = () => {
        if (rating < 1 || rating > 5) return "Vui lòng chọn số sao từ 1 đến 5";
        return null;
    };

    const handleSubmit = async () => {
        const err = validate();
        if (err) return notifyError(err);

        setLoading(true);
        setProgress(0)
        if(images.length > 0) setUploading(true)

        try {
            // Build FormData: backend should accept multipart/form-data
            if (!userInfo) {
                setUploading(false)
                return notifyError("Không thể đánh giá sản phẩm ngay lúc này")
            }

            const fd = new FormData();
            fd.append("productId", String(productId));
            fd.append("userId", String(userInfo.id))
            fd.append("rating", String(rating));
            fd.append("text", text.trim());
            images.forEach((p) => {
                fd.append("files", p.file, p.file.name);
            });

            const res = await reviewApi.createReview(fd, setProgress);

            if (res.status === HttpStatusCode.Created || res.status === HttpStatusCode.Ok) {
                notifySuccess("Gửi đánh giá thành công!");
                setProgress(100)
                setUploading(false)
                onClose()
                onSubmitted?.();
            } else {
                notifyError(res.data?.message || "Không thể gửi đánh giá, vui lòng thử lại.");
            }
        } catch (error) {
            console.error(error);
            notifyError("Lỗi khi gửi đánh giá. Vui lòng thử lại.");
        } finally {
            setLoading(false);
            setUploading(false)
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">Viết đánh giá</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Đóng</button>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Đánh giá</label>
                    <div className="mt-2 flex items-center gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setRating(i + 1)}
                                className="p-1"
                                aria-label={`${i + 1} sao`}
                            >
                                <Star filled={i < rating} />
                            </button>
                        ))}
                        <div className="text-sm text-gray-500">{rating}/5</div>
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Nội dung</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={5}
                        placeholder="Viết chia sẻ cho sản phẩm"
                        className="mt-2 block w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Hình ảnh (tối đa 5)</label>

                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="mt-2 border-2 border-dashed border-gray-200 rounded-lg p-3 flex flex-col gap-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">Kéo thả ảnh hoặc chọn từ máy</div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleSelectFiles}
                                    className="px-3 py-1 text-sm border rounded-md hover:bg-sky-50"
                                >
                                    Chọn ảnh
                                </button>
                                <input
                                    ref={inputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => onFilesChosen(e.target.files)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {images.map((p) => (
                                <div key={p.id} className="w-24 h-24 relative rounded-md overflow-hidden border">
                                    <img src={p.url} alt="preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removeImage(p.id)}
                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="text-xs text-gray-400">PNG, JPG, GIF — mỗi ảnh &lt; 5MB.</div>

                        {uploading && (
                            <div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div style={{ width: `${progress}%` }} className="h-full rounded-full transition-all bg-sky-500"></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Đang tải: {progress}%</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md border">Hủy</button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 rounded-md bg-sky-600 text-white disabled:opacity-60"
                    >
                        {loading ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WriteReviewModal