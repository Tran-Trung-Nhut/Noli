import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { PencilIcon, TrashBinIcon } from "../../../icons";
import { confirm, formatDate, formatPrice, notifyError, notifySuccess } from "../../../utils";
import { Product } from "../../../dtos/product.dto";
import productApi from "../../../apis/product.api";



export default function AllProductsTable({
  products, 
  fetchProducts,
  editProduct
}: {
  products: Product[], 
  fetchProducts: () => void,
  editProduct: (product: Product) => void,
}) {

  const handleDeleteProduct = (id: number) => {
    confirm("Xóa sản phẩm", "Bạn có chắc chắn muốn xóa sản phẩm này?", () => {
      productApi.delete(id)
      .then((response) => {
        if (response.status !== 200) return notifyError(response.message)
        notifySuccess(response.data.message);
        fetchProducts();
      })
    })
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tên sản phẩm
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Giá mặc định
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Ngày tạo
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Đã bán
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                ---
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500">
                  {/* <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={order.user.image}
                        alt={order.user.name}
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.user.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {order.user.role}
                      </span>
                    </div>
                  </div> */}
                  {product.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {formatPrice(product.defaultPrice)}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {/* <div className="flex -space-x-2">
                    {order.team.images.map((teamImage, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                      >
                        <img
                          width={24}
                          height={24}
                          src={teamImage}
                          alt={`Team member ${index + 1}`}
                          className="w-full size-6"
                        />
                      </div>
                    ))}
                  </div> */}
                  {formatDate(product.createdAt)}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {/* <Badge
                    size="sm"
                    color={
                      "Còn hàng" === "Còn hàng"
                        ? "success"
                        : product.name === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    Còn hàng
                  </Badge> */}
                  {product.soldQuantity || 0}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <div className="flex gap-4">
                    <button className="hover:scale-110 active:scale-90">
                      <PencilIcon width={25} height={25} onClick={() => editProduct(product)}/>
                    </button>
                    <button className="hover:scale-110 text-red-500 active:scale-90">
                      <TrashBinIcon width={25} height={25} onClick={() => handleDeleteProduct(product.id)}/>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
