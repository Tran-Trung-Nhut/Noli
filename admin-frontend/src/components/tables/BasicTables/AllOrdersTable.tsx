import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { PencilIcon, TrashBinIcon } from "../../../icons";
import { confirm, formatDate, formatPrice} from "../../../utils";
import { OrderInList } from "../../../dtos/order.dto";
import { OrderStat } from "../../../enums/order.enum";
import Badge from "../../ui/badge/Badge";



export default function AllOrdersTable({
  orders,
  fetchOrders,
  editOrder
}: {
  orders: OrderInList[],
  fetchOrders: () => void,
  editOrder: (orderId: number) => void,
}) {

  const handleDeleteProduct = (id: number) => {
    confirm("Xóa sản phẩm", "Bạn có chắc chắn muốn xóa sản phẩm này?", () => {
      console.log("Delete order with id: ", id);
      // Call delete API here and refresh the table
      fetchOrders();
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
                Khách hàng
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Tổng số tiền
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Ngày đặt hàng
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Trạng thái
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
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={order.customerImage ?? '/default-avatar.png'}
                      // alt={order.user.name}
                      />
                    </div>
                    {/* <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.user.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {order.user.role}
                      </span>
                    </div> */}
                  </div>
                  {order.customerFirstName + " " + order.customerLastName}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {formatPrice(order.totalAmount)}
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
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      order.status === OrderStat.COMPLETED ? 'success' :
                      order.status === OrderStat.DELIVERY ? 'info' : 
                      order.status === OrderStat.PENDING ? 'warning' : 'error'}
                  >
                    {
                      order.status === OrderStat.COMPLETED ? 'Đã hoàn thành' :
                      order.status === OrderStat.DELIVERY ? 'Đang giao hàng' : 
                      order.status === OrderStat.PENDING ? 'Chờ thanh toán' : 'Đã hủy'
                      }
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <div className="flex gap-4">
                    <button className="hover:scale-110 active:scale-90">
                      <PencilIcon width={25} height={25} onClick={() => editOrder(order.id)} />
                    </button>
                    <button className="hover:scale-110 text-red-500 active:scale-90">
                      <TrashBinIcon width={25} height={25} onClick={() => handleDeleteProduct(order.id)} />
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
