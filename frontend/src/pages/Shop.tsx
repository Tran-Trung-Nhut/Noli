import ProductCard from "../components/ProductCart"
import { products } from "../mocks/product"

const Shop = () => {
    return (
        <div className="min-h-screen bg-white py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">Danh Sách Sản Phẩm</h1>
                <div className="flex justify-between my-[15px] mr-[150px]">
                    <div className="flex gap-[50px] ml-[50px] item-center">
                        <p className="flex items-center justify-center">Sắp xếp</p>
                        <button className="border p-[8px] rounded-[5px] text-white bg-sky-600">Phổ biến</button>
                        <button className="border p-[8px] rounded-[5px] text-white bg-sky-600">Mới nhất</button>
                    </div>
                    <input className="border p-[3px]" placeholder="Tìm kiếm"/>
                </div>  
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard product={product} addToCart={() => {}} cartProducts={[]}/>
                ))}
                </div>
                <div className="flex justify-center gap-5 mt-[30px]">
                    <button className="border px-[15px] py-[10px]">1</button>
                    <button className="border px-[15px] py-[10px]">2</button>
                    <button className="border px-[15px] py-[10px]">3</button>
                </div>
            </div>
        </div>
    )
}

export default Shop