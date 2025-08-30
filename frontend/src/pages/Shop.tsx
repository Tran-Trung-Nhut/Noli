// src/pages/Shop.tsx
import { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import productApi from "../apis/productApi";
import { notifyError, notifyWarning } from "../utils";
import type { Product } from "../dtos/product.dto";
import FiltersSidebar from "../components/FilterSideBar";
import ShopToolbar from "../components/ShopToolBar";
import ProductGrid from "../components/ProductGrid";
import { HttpStatusCode } from "axios";
import ProductCardSkeleton from "../components/ProductCartSkeleton";

const Shop = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // query state
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<"createdAt" | "defaultPrice" | "name">("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const limit = 12;

    const [minPrice, setMinPrice] = useState<number | null> (null)
    const [maxPrice, setMaxPrice] = useState<number | null> (null)

    // quick view modal
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false); // prevents concurrent fetches

    const fetchPage = async (pageToFetch: number, append = true) => {
        setIsFetching(true);
        // show initial full-page loader only when first page and no products yet
        if (pageToFetch === 1 && products.length === 0) setLoading(true);
        try {
            const result = await productApi.getPaging({
                page: pageToFetch,
                limit,
                sortBy,
                sortOrder,
                search,
                category,
                minPrice,
                maxPrice
            });

            console.log(result)

            if (result.status !== HttpStatusCode.Ok) {
                notifyError("Lỗi hệ thống. Vui lòng thử lại");
                if (!append) setProducts([]);
                setHasMore(false);
                return;
            }

            if (append) {
                setProducts((prev) => [...prev, ...result.data.data ]);
            } else {
                setProducts(result.data.data );
            }

            // nếu items < limit => không còn page tiếp theo
            setHasMore(result.data.data.length === limit);
        } catch (error) {
            console.log(error)
            notifyError("Hệ thống gặp lỗi. Vui lòng thử lại sau");
            setHasMore(false);
        } finally {
            setIsFetching(false);
            setLoading(false);
        }
    };

    const handleApplyFilter = async () => {
        if (minPrice && maxPrice && minPrice > maxPrice) return notifyWarning("Giá tối thiểu phải bé hơn giá tối đa")

        setPage(1);
        setHasMore(true);
        // fetch page 1 (replace)
        fetchPage(1, false);
    }

    useEffect(() => {
        // reset
        setProducts([]);
        setPage(1);
        setHasMore(true);
        // fetch page 1 (replace)
        fetchPage(1, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, category, sortBy, sortOrder]);

    // When page increases (trigger by infinite scroll), fetch that page and append
    useEffect(() => {
        // If page is 1 and we already fetched it via filter effect, avoid double fetch.
        // We fetch page > 1 here only.
        if (page === 1) return;
        fetchPage(page, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const loadMore = () => {
        if (isFetching || !hasMore) return;
        setPage((p) => p + 1);
    };

    const toolbarHandlers = useMemo(
        () => ({
            setSearch,
            setSortBy,
            setSortOrder,
        }),
        []
    );

    return (
        <section className="container mx-auto px-4 py-10">
            <div className="flex flex-col lg:flex-row gap-6">
                <aside className="hidden lg:block w-72">
                    <FiltersSidebar
                        selectedCategory={category}
                        onCategoryChange={(c) => setCategory(c)}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        onMinPriceChange={setMinPrice}
                        onMaxPriceChange={setMaxPrice}
                        handleApplyFilter={() => handleApplyFilter()}
                    />
                </aside>

                <div className="flex-1">
                    <ShopToolbar
                        onSearch={(q) => setSearch(q)}
                        onSort={(by, order) => {
                            setSortBy(by);
                            setSortOrder(order);
                        }}
                        initialSortBy={sortBy}
                        initialSortOrder={sortOrder}
                        handlers={toolbarHandlers}
                    />

                    {/* Infinite scroll wrapper */}
                    <InfiniteScroll
                        dataLength={products.length}
                        next={loadMore}
                        hasMore={hasMore}
                        loader={
                            // loader shown at bottom while fetching next pages
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                                {Array.from({ length: 4 }).map((_, i) => (<ProductCardSkeleton key={i}/>))}
                            </div>
                        }
                        // optional threshold to prefetch earlier
                        scrollThreshold="200px"
                    >
                        <ProductGrid products={products} loading={loading} />
                    </InfiniteScroll>
                </div>
            </div>

            {/* Product quick view if you want:
      <ProductQuickView open={quickOpen} product={selectedProduct} onClose={closeQuick} /> */}
        </section>
    );
};

export default Shop;
