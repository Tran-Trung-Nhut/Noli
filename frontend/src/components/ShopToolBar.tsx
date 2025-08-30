// src/components/ShopToolbar.tsx
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

type Props = {
    onSearch: (q: string) => void;
    onSort: (by: "createdAt" | "defaultPrice" | "name", order: "asc" | "desc") => void;
    initialSortBy?: "createdAt" | "defaultPrice" | "name";
    initialSortOrder?: "asc" | "desc";
    handlers?: any;
};

export default function ShopToolbar({
    onSearch,
    onSort,
    initialSortBy = "createdAt",
    initialSortOrder = "desc",
}: Props) {
    const [q, setQ] = useState("");
    const [sortBy, setSortBy] = useState(initialSortBy);
    const [sortOrder, setSortOrder] = useState(initialSortOrder);

    // debounce manual
    useEffect(() => {
        const t = setTimeout(() => {
            onSearch(q.trim());
        }, 350);
        return () => clearTimeout(t);
    }, [q, onSearch]);

    useEffect(() => {
        onSort(sortBy, sortOrder);
    }, [sortBy, sortOrder, onSort]);

    return (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="border px-4 py-2 rounded-md w-72 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                </div>
                <button className="hidden sm:inline-flex items-center  hover:shadow">
                    <Search size={20} className="" />
                </button>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-md overflow-hidden">
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [by, order] = e.target.value.split("-");
                            setSortBy(by as any);
                            setSortOrder(order as any);
                        }}
                        className="px-3 py-2 outline-none"
                    >
                        <option value="createdAt-desc">Mới nhất</option>
                        <option value="createdAt-asc">Cũ nhất</option>
                        <option value="defaultPrice-asc">Giá: thấp → cao</option>
                        <option value="defaultPrice-desc">Giá: cao → thấp</option>
                        <option value="name-asc">Tên: A → Z</option>
                        <option value="name-desc">Tên: Z → A</option>
                    </select>
                </div>
                {/* <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                    <span>Hiển thị</span>
                    <button className="p-2 rounded hover:bg-gray-100"><Grid size={16} /></button>
                    <button className="p-2 rounded hover:bg-gray-100"><List size={16} /></button>
                </div> */}
            </div>
        </div>
    );
}
