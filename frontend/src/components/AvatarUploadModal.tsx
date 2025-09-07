import React, { useEffect, useRef, useState } from 'react';
import axiosClient from '../apis/axiosClient';
import { notifyError } from '../utils';
import No_Image from "../assets/No_image_user.jpg"
import { FaTrash } from 'react-icons/fa6';


const AvatarUploadModal = ({
    isOpen,
    onClose,
    currentImage,
    onUploadSuccess,
    userId
}: {
    isOpen: boolean;
    onClose: () => void;
    currentImage?: string | null;
    onUploadSuccess: () => void;
    userId: number
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);

    // create preview when file changes
    useEffect(() => {
        if (!file) return setPreview(null);
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    // close on ESC
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        if (isOpen) document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    // click outside to close
    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!isOpen) return;
            if (!modalRef.current) return;
            if (modalRef.current.contains(e.target as Node)) return;
            onClose();
        }
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [isOpen, onClose]);

    function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0] ?? null;
        if (f) setFile(f);
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files?.[0] ?? null;
        if (f && f.type.startsWith('image/')) setFile(f);
    }

    function openFilePicker() {
        inputRef.current?.click();
    }

    async function handleUpload() {
        if (!file) return;
        setUploading(true);
        setProgress(0);

        try {
            const form = new FormData();
            form.append('file', file);
            form.append('userId', userId.toString())


            await axiosClient.post("/upload/image/user-image", form, {
                headers: {
                    "Content-Type": "multipart/form-data", 
                },
                onUploadProgress: (ev) => {
                    if (ev.total) {
                        const p = Math.round((ev.loaded / ev.total) * 100);
                        setProgress(p);
                    }
                },
            });

            setUploading(false);
            setProgress(100);

            // inform parent
            onUploadSuccess();
            onClose()
        } catch (err: any) {
            console.error(err);
            setUploading(false);
            notifyError("Tải hình ảnh thất bại")
        }
    }

    function removeSelected() {
        setFile(null);
        setPreview(null);
        if (inputRef.current) inputRef.current.value = '';
    }

    if (!isOpen) return null;

    return (
        // backdrop
        <div
            aria-modal
            role="dialog"
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8"
        >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

            <div
                ref={modalRef}
                className="relative z-10 w-full max-w-lg mx-auto rounded-2xl bg-white shadow-2xl overflow-hidden transform transition-all"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold">Cập nhật ảnh đại diện</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-md hover:bg-gray-100"
                        aria-label="Đóng"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Preview circle */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32">
                            <img
                                src={preview ?? currentImage ?? No_Image}
                                alt="avatar-preview"
                                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                            />
                        </div>
                        <p className="mt-3 text-sm text-gray-500">Kéo thả hoặc chọn ảnh (jpg, png). Kích thước tối đa 5MB.</p>
                    </div>

                    {/* Drag & drop area */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`border-dashed border-2 rounded-xl p-4 cursor-pointer ${isDragging ? 'border-sky-400 bg-sky-50' : 'border-gray-200 bg-white'}`}
                        onClick={openFilePicker}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFilePick}
                        />

                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0l4-4m-4 4-4-4" />
                            </svg>
                            <div>
                                <div className="text-sm font-medium text-gray-900">Kéo thả ảnh vào đây hoặc nhấp để chọn</div>
                                <div className="text-xs text-gray-500">Ảnh sẽ được hiển thị trước khi tải lên</div>
                            </div>
                        </div>

                        {/* selected filename */}
                        {file && (
                            <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                                <div className="truncate">{file.name}</div>
                                <div className="flex items-center gap-2">
                                    <button onClick={removeSelected} className="bg-white border-none hover:scale-110">
                                        <FaTrash color='red'/>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* progress */}
                    {uploading && (
                        <div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div style={{ width: `${progress}%` }} className="h-full rounded-full transition-all bg-sky-500"></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Đang tải: {progress}%</div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-50 hover:bg-gray-100">Huỷ</button>
                    <button
                        onClick={handleUpload}
                        disabled={uploading || !file}
                        className={`px-4 py-2 rounded-md text-white ${uploading || !file ? 'bg-sky-300 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700'}`}
                    >
                        {uploading ? 'Đang tải...' : 'Lưu & Cập nhật'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AvatarUploadModal
