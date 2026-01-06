import ComponentCard from "../components/common/ComponentCard";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Select from "../components/form/Select";
import TextArea from "../components/form/input/TextArea";
import { useEffect, useState } from "react";
import { Option } from "../dtos/options.dto";
import Radio from "../components/form/input/Radio";
import { CreateProductVariant, ProductVariant } from "../dtos/productVariant.dto";
import Button from "../components/ui/button/Button";
import { FaImages } from "react-icons/fa6";
import { CreateProduct, Product } from "../dtos/product.dto";
import productApi from "../apis/product.api";
import { confirm, notifyError, notifySuccess } from "../utils";
import productVariantApi from "../apis/product-variant.api";
import { INVALID } from "../constantsAndMessage";
import ProductVariantTable from "../components/ProductVariantTable";

export default function CreateOrUpdateProduct({
    isCreateOrUpdateProduct, 
    onClose,
    editingProduct
}:{
    isCreateOrUpdateProduct: string, 
    onClose: () => void
    editingProduct: Product
}) {
    const [name, setName] = useState<string>(INVALID.EMPTY_STRING)
    const [category, setCategory] = useState<string>('bags')
    const [defaultPrice, setDefaultPrice] = useState<number>(INVALID.NUMBER)
    const [description, setDescription] = useState<string>(INVALID.EMPTY_STRING)
    const [customedPrice, setCustomedPrice] = useState<string>('default')
    const [variantId, setVariantId] = useState<number>(INVALID.NUMBER)
    const [color, setColor] = useState<string>(INVALID.EMPTY_STRING)
    const [size, setSize] = useState<string>(INVALID.EMPTY_STRING)
    const [price, setPrice] = useState<number>(INVALID.NUMBER)
    const [stock, setStock] = useState<number>(INVALID.NUMBER)
    const [images, setImages] = useState<string[]>([])
    const [imageLink, setImageLink] = useState<string>(INVALID.EMPTY_STRING)
    const [productVariants, setProductVariants] = useState<CreateProductVariant[]>([])
    const [editingProductVariants, setEditingProductVariants] = useState<ProductVariant[]>([])
    const [errors, setErrors] = useState<string[]>([])

    const resetVariantAttribute = () => {
        setColor(INVALID.EMPTY_STRING)
        setSize(INVALID.EMPTY_STRING)
        setPrice(INVALID.NUMBER)
        setStock(INVALID.NUMBER)
        setVariantId(INVALID.NUMBER)
    }

    const categoryOptions: Option[] = [
        { value: "clothes", label: "Quần áo" },
        { value: "bags", label: "Túi xách" },
        { value: "backpacks", label: "Ba lô" },
    ];

    const handleEditColorAndSize = (variant: ProductVariant | CreateProductVariant) => {
        if ('id' in variant) setVariantId(variant.id)
        setColor(variant.color)
        setSize(variant.size)
        setStock(variant.stock)
        setPrice(variant.price)
        if(isCreateOrUpdateProduct === 'create') handleDeleteColorAndSize(variant.color, variant.size)
    }

    const handleAddColorAndSize = () => {
        if(color === ''){
            setErrors([...errors, 'blank_color'])
            return
        }

        const productVariant : CreateProductVariant = {
            color: color,
            size: category[0] !== 'clothes' ? 'no_size' : size,
            price: customedPrice === 'custom' ? price : defaultPrice,
            stock: stock
        }


        if(isCreateOrUpdateProduct === 'create') {
            if(productVariants.some(pv => pv.color === productVariant.color && pv.size === productVariant.size)) {
                notifyError("Màu sắc và kích thước đã tồn tại")
                return
            }
        }else{
            if(editingProductVariants.some(pv => pv.color === productVariant.color && pv.size === productVariant.size) && variantId === 0){
                notifyError("Màu sắc và kích thước đã tồn tại")
                return
            } 
        }

        if(isCreateOrUpdateProduct === 'create') {
            setProductVariants([...productVariants, productVariant])
            resetVariantAttribute()
        }else{
            if(variantId === INVALID.NUMBER) handleCreateProductVariant(productVariant)
            else {
                productVariantApi
                .update({color, size, stock, price}, variantId)
                .then((response) => {
                    if(response.status !== 200) return notifyError(response.message)

                    resetVariantAttribute()
                    fetchProductVariants()
                    notifySuccess(response.data.message)
                })
            }
        }
    }

    const handleAddImages = () => {
        if(imageLink === INVALID.EMPTY_STRING){
            setErrors([...errors, "blank_image"])
            return
        }
        setImages([...images, imageLink])
        setImageLink(INVALID.EMPTY_STRING)
    }

    const handleDeleteColorAndSize = (variantColor: string, variantSize: string, variantId?: number) => {
        if(isCreateOrUpdateProduct === 'update') {
            confirm("Xóa màu sắc và kích thước sản phẩm", "Bạn có chắn chắn xóa màu sắc và kích thước của sản phẩm này?", async () => {
                await productVariantApi.delete(variantId || INVALID.NUMBER)
                .then((response) => {
                    if(response.status !== 200) return notifyError(response.message)

                    fetchProductVariants()

                    notifySuccess(response.data.message)
                })
            })
        }
        else setProductVariants(productVariants.filter(productVariant => !(productVariant.color === variantColor && productVariant.size === variantSize)))
    }

    const handleAddProduct = () =>{
        const newErrors: string[] = []
        if(name === INVALID.EMPTY_STRING) newErrors.push('blank_name')
        if(category === INVALID.EMPTY_STRING) newErrors.push('blank_category')
        if(defaultPrice === INVALID.NUMBER) newErrors.push('invalid_defaultPrice')
        if(description === INVALID.EMPTY_STRING) newErrors.push('blank_description')
        if(isCreateOrUpdateProduct === 'create'){
            if(productVariants.length === INVALID.NUMBER) newErrors.push('blank_variants')
        }else{
            if(editingProductVariants.length === INVALID.NUMBER) newErrors.push('blank_variants')
        }

        if(newErrors.length > 0) {
            setErrors(newErrors)
            return
        }

        const product: CreateProduct = {
            name: name,
            category: [category],
            defaultPrice: defaultPrice,
            description: description,
            image: images,
            productVariants: productVariants
        }

        if(isCreateOrUpdateProduct === 'create') productApi.create(product)
        .then((response) => {
            if(response.status !== 201) return notifyError(response.message)
            setCategory('bags')
            setDefaultPrice(INVALID.NUMBER)
            setDescription(INVALID.EMPTY_STRING)
            setCustomedPrice('default')
            resetVariantAttribute()
            setImages([])
            setProductVariants([])
            setName(INVALID.EMPTY_STRING)
            setErrors([])

            notifySuccess(response.data.message)
        })
        else productApi.update((({ productVariants, ...rest }) => rest)(product), editingProduct.id)
        .then((response) => {
            if(response.status !== 200) return notifyError(response.message)
            notifySuccess(response.data.message)
            onClose()
        })

    }

    const setUpEditingProduct = async () => {
        setName(editingProduct.name);
        setCategory(editingProduct.category[0]);
        setDefaultPrice(editingProduct.defaultPrice);
        setDescription(editingProduct.description);
        setImages(editingProduct.image);

        await fetchProductVariants();
    }

    const fetchProductVariants = async () => {
        productVariantApi.getAllByProductId(editingProduct.id)
        .then((response) => {
            if(response.status !== 200) return notifyError(response.message)
            setEditingProductVariants(response.data.data);
        })
    }

    const handleCreateProductVariant = async (productVariant: CreateProductVariant) => {
        productVariantApi.create({
            color: productVariant.color,
            size: productVariant.size,
            stock: productVariant.stock,
            price: productVariant.price,
        }, editingProduct.id)
        .then((response) => {
            if(response.status !== 201) return notifyError(response.message)

            resetVariantAttribute()

            notifySuccess(response.data.message)
            fetchProductVariants()
        })
    }

    useState(() => {
        if(isCreateOrUpdateProduct === 'update') setUpEditingProduct();
    })
    
    useEffect(() => {
    },[color, productVariantApi, editingProductVariants])

    return (
        <ComponentCard title={isCreateOrUpdateProduct === 'create' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}>
            <div className="space-y-6">
                <div>
                    <Label>Tên sản phẩm</Label>
                    <Input 
                    type="text"
                    placeholder="Vd: Túi xách Noli ThunderDrop X1" 
                    onChange={(event) => {
                        if(event.target.value.length > INVALID.NUMBER) setErrors(errors.filter(error => error !== 'blank_name'))
                        setName(event.target.value)
                    }} 
                    value={name}
                    error={errors.includes('blank_name')}
                    hint={errors.includes('blank_name')?"Vui lòng nhập tên sản phẩm" : ""}/>
                </div>
                <div>
                    <Label>Danh mục</Label>
                    <Select
                        options={categoryOptions}
                        onChange ={(value) => setCategory(value)}
                        className="dark:bg-dark-900"
                        defaultValue={category}
                        
                    />
                </div>
                <div>
                    <Label>Giá mặc định</Label>
                    <Input 
                    type="number" 
                    placeholder="Vd: 200000"
                    value={defaultPrice}
                    onChange={(event) => {
                        if(Number(event.target.value) > 0) setErrors(errors.filter(error => error !== 'invalid_price'))
                        setDefaultPrice(Number(event.target.value))
                    }}
                    hint={errors.includes('invalid_defaultPrice') ? "Vui lòng nhập giá mặc định" : ""}
                    error={errors.includes('invalid_defaultPrice')}/>
                </div>
                <div>
                    <Label htmlFor="inputTwo">Mô tả sản phẩm</Label>
                    <TextArea
                        value={description}
                        onChange={(event) => {
                            if(event.length > INVALID.NUMBER) setErrors(errors.filter(error => error !== 'blank_description'))
                            setDescription(event)
                        }}
                        rows={6}
                        hint={errors.includes('blank_description') ? "Vui lòng nhập mô tả sản phẩm" : ""}
                        placeholder="Nhập mô tả sản phẩm"
                        error={errors.includes('blank_description')}
                    />
                </div>
                <div>
                    <Label>Màu sản phẩm</Label>
                    <Input 
                    type="text"
                    placeholder="Vd: Nâu đỏ" 
                    value={color}
                    onChange={(event) => {
                        if(event.target.value.length > INVALID.NUMBER) setErrors(errors.filter(error => error !== 'blank_color' && error !== 'blank_variants'))
                        setColor(event.target.value)
                    }}
                    error={errors.includes('blank_variants') || errors.includes('blank_color')}
                    hint={errors.includes('blank_color') ? "Vui lòng thêm màu sắc" : ""}
                    />
                </div>
                {category === 'clothes' && (
                    <div>
                        <Label>Kích thước sản phẩm</Label>
                        <Input 
                        type="text"
                        placeholder="Vd: M" 
                        value={size}
                        onChange={(event) => {
                            setSize(event.target.value)
                            if(event.target.value.length > INVALID.NUMBER) setErrors(errors.filter(error => error !== 'blank_variants'))
                        }}
                        error={errors.includes('blank_variants')}
                        />
                    </div>
                )}
                <div>
                    <Label>Số lượng</Label>
                    <Input 
                    hint={errors.includes('blank_variants') ? "Vui lòng thêm ít nhất một màu và kích thước nếu có" : ""}
                    error={errors.includes('blank_variants')} 
                    type="number" 
                    placeholder="Vd: 20" 
                    value={stock}
                    onChange={(event) => setStock(Number(event.target.value))}/>
                </div>
                <div>
                    <Label htmlFor="inputTwo">Giá riêng của màu sắc hoặc kích thước</Label>
                    <div className="flex flex-wrap items-center gap-8 pb-4">
                        <Radio
                        id="radio1"
                        name="group1"
                        value="default"
                        checked={customedPrice === "default"}
                        onChange={(value) => {setCustomedPrice(value)}}
                        label="Sử dụng giá mặc định"
                        />

                        <Radio
                        id="radio2"
                        name="group1"
                        value="custom"
                        checked={customedPrice === "custom"}
                        onChange={(value) => {setCustomedPrice(value)}}
                        label="Sử dụng giá tùy chỉnh"
                        />
                    </div>
                    {customedPrice === 'custom' && (
                        <div className="pb-4">
                            <Label>Giá tùy chỉnh</Label>
                            <Input 
                            type="number"
                            placeholder="Vd: 200000"
                            value={price}
                            onChange={(event) => setPrice(Number(event.target.value))}
                            error={errors.includes('invalid_price')}/>
                        </div>
                    )}
                    {(isCreateOrUpdateProduct === 'create' ? productVariants : editingProductVariants).length > 0 && (
                        <ProductVariantTable 
                        isCreateOrUpdateProduct={isCreateOrUpdateProduct}
                        handleDeleteColorAndSize={handleDeleteColorAndSize}
                        handleEditColorAndSize={handleEditColorAndSize}
                        productVariants={productVariants}
                        editingProductVariants={editingProductVariants}/>
                    )}
                    <Button onClick={() => handleAddColorAndSize()} className="mb-6">Thêm màu và kích thước</Button>
                    <div className="mb-2">
                        <Label>Liên kết hình ảnh</Label>
                        <div className="flex flex-wrap gap-3">
                            <Input 
                            type="text"
                            placeholder="https://scontent.fsgn5-10.fna.fbcdn.net/v/....." 
                            value={imageLink}
                            onChange={(event) => {
                                setImageLink(event.target.value)
                                if(event.target.value.length > INVALID.NUMBER) setErrors(errors.filter(error => error !== 'blank_image'))
                            }}
                            error={errors.includes('blank_image')}
                            hint={errors.includes('blank_image')? "Vui lòng nhập liên kết ảnh":""}
                            />
                            {images.length > 0 && (
                                <div className="flex flex-wrap gap-2 relative">
                                    <FaImages size={40}/>
                                    <div className="w-4 h-4 bg-red-500 absolute top-[-5px] right-[-5px] rounded-full">
                                        <span className="absolute top-[-4px] right-[2px] text-white">{images.length}</span>
                                    </div>
                                </div>)}
                        </div>
                    </div>
                    <Button onClick={() => handleAddImages()} className="mb-6">Thêm ảnh</Button>
                </div>
            </div>
            <div className="flex justify-end gap-3">
                <Button className="bg-gray-500 hover:bg-gray-700" onClick={onClose}>Quay lại</Button>
                <Button onClick={() => handleAddProduct()}>{isCreateOrUpdateProduct === 'create'? "Thêm sản phẩm" : "Lưu"}</Button>
            </div>
        </ComponentCard>
)}