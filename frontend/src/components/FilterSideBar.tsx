// src/components/FiltersSidebar.tsx
import { useState } from "react";

type Props = {
    selectedCategory: string | null;
    onCategoryChange: (c: string | null) => void;
    minPrice: number | null;
    maxPrice: number | null;
    onMinPriceChange: (value: number) => void
    onMaxPriceChange: (value: number) => void
    handleApplyFilter: () => void
};

export default function FiltersSidebar({ selectedCategory, onCategoryChange, minPrice, maxPrice, onMinPriceChange, onMaxPriceChange, handleApplyFilter}: Props) {
    const [categories] = useState<{label: string, value: string}[]>([
        {label: "Túi xách", value: "hand_bag"},
        {label: "Túi đeo vai", value: "sholder_bag"},
        {label: "Balo mini", value: "mini_balo"}
    ]);


    return (
        <div className="p-4 border rounded-md sticky top-24 bg-white">
            <h3 className="font-bold text-lg mb-3">Danh mục</h3>
            <ul className="space-y-2">
                <li>
                    <button
                        onClick={() => onCategoryChange(null)}
                        className={`block w-full text-left px-3 py-2 rounded ${selectedCategory === null ? "bg-sky-50 text-sky-600" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                        Tất cả
                    </button>
                </li>
                {categories.map((category) => (
                    <li key={category.value}>
                        <button
                            onClick={() => onCategoryChange(category.value)}
                            className={`block w-full text-left px-3 py-2 rounded ${selectedCategory === category.value ? "bg-sky-50 text-sky-600" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                            {category.label}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="mt-6">
                <h4 className="font-semibold mb-2">Giá</h4>
                <div className="flex gap-2">
                    <input
                        className="w-1/2 border px-2 py-1 rounded"
                        placeholder="Giá tối thiểu"
                        value={minPrice || ''}
                        onChange={(e) => onMinPriceChange(Number(e.target.value))} />

                    <input
                        className="w-1/2 border px-2 py-1 rounded"
                        placeholder="Giá tối đa"
                        value={maxPrice || ''}
                        onChange={(e) => onMaxPriceChange(Number(e.target.value))} />
                </div>
                <button className="mt-3 w-full bg-sky-500 text-white px-3 py-2 rounded hover:bg-sky-600" onClick={() => handleApplyFilter()}>Áp dụng</button>
            </div>
        </div>
    );
}
