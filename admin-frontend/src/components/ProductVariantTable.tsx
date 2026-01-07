import { CreateProductVariant, ProductVariant } from "../dtos/product-variant.dto"
import { PencilIcon, TrashBinIcon } from "../icons"

export default function ({
    isCreateOrUpdateProduct,
    productVariants,
    editingProductVariants,
    handleEditColorAndSize,
    handleDeleteColorAndSize
}:{
    isCreateOrUpdateProduct: string,
    productVariants: CreateProductVariant[]
    editingProductVariants: ProductVariant[]
    handleEditColorAndSize: (productVariant: ProductVariant | CreateProductVariant) => void
    handleDeleteColorAndSize: (variantColor: string, variantSize: string, variantId?: number) => void
}) {
    function hasId(variant: any): variant is ProductVariant {
        return 'id' in variant && typeof variant.id === 'number';}
        
    return(
        <table className="border-2 rounded-lg mb-2 text-gray-500">
            <thead>
                <tr className="border-2">
                    <td className="text-sm px-2 font-bold">Màu sắc</td>
                    <td className="text-sm px-2 font-bold">Kích thước</td>
                    <td className="text-sm px-2 font-bold">Số lượng</td>
                    <td className="text-sm px-2 font-bold">Giá bán</td>
                    <td className="text-sm px-2 font-bold">---</td>
                </tr>
            </thead>
            <tbody>
                {(isCreateOrUpdateProduct === 'create' ? productVariants : editingProductVariants).map((productVariant, index) => (
                    <tr className="border-2">
                        <td key={index} className="text-sm px-2">{productVariant.color}</td>
                        <td className="text-sm px-2">{productVariant.size}</td>
                        <td className="text-sm px-2">{productVariant.stock}</td>
                        <td className="text-sm px-2">{productVariant.price}</td>
                        <td className="text-sm flex gap-2 px-2">
                            <PencilIcon 
                            className="hover:scale-110" 
                            onClick={() => handleEditColorAndSize(productVariant)}/>
                            <TrashBinIcon 
                            className="text-red-500 hover:scale-110" 
                            onClick={() => handleDeleteColorAndSize(
                                productVariant.color, 
                                productVariant.size,
                                hasId(productVariant) ? productVariant.id : undefined)}/>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}