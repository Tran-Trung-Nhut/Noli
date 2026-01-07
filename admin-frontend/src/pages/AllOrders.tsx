import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import Select from "../components/form/Select";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import { PlusIcon } from "../icons";
import { useEffect, useState } from "react";
import { Option } from "../dtos/options.dto";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { SortOrder } from "../enums/sort.enum";
import AllOrdersTable from "../components/tables/BasicTables/AllOrdersTable";
import { OrderInList } from "../dtos/order.dto";
import { orderApi } from "../apis/order.api";

export default function AllOrders() {
  const [isCreatingOrUpdatingProduct,setIsCreatingOrUpdatingProduct] = useState<string>('')
  const [orders, setOrders] = useState<OrderInList[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  const [search, setSearch] = useState<string>("");

  const viewOptions: Option[] = [
    { value: "50", label: "50" },
    { value: "20", label: "20" },
    { value: "10", label: "10" },
    { value: "5", label: "5" }
  ];

  const sortOptions: Option[] = [
    {value: "createdAt", label: "Ngày tạo đơn hàng"},
    // {value: "name", label: "Tên sản phẩm"},
    {value: "totalAmount", label: "Tổng số tiền"}
  ]

  const orderOptions: Option[] = [
    {value: SortOrder.DESC, label: "Giảm dần"},
    {value: SortOrder.ASC, label: "Tăng dần"},
  ]

  const fetchOrders = async () => {
    const response = await orderApi.getAll(
      page,
      limit,
      sortBy,
      sortOrder,
      search
    );
    if (response.status === 200) {
      setOrders(response.data);
    }
  }

  const editOrder = (editOrder: number) => {
    setIsCreatingOrUpdatingProduct('update');
    console.log("Edit order: ", editOrder);
  }

  useEffect(() => {
    if(page !== 0) fetchOrders();
  }, [page, limit, sortBy, sortOrder, search]);

  return (
    <>
      <PageBreadcrumb pageTitle="Danh sách đơn hàng" />
      <div className="space-y-6">
          {!isCreatingOrUpdatingProduct ? (
            <ComponentCard title="Tất cả đơn hàng">
              <Button onClick={() => setIsCreatingOrUpdatingProduct('create')} className="active:scale-90">
                <PlusIcon/>
                <span>Thêm sản phẩm</span>
              </Button>
              <div className="flex gap-6">
                <div>
                  <Label>Sắp xếp theo</Label>
                  <Select options={sortOptions} onChange={(event) => {setSortBy(event)}} defaultValue="createdAt"/>
                </div>
                <div>
                  <Label>Thứ tự</Label>
                  <Select options={orderOptions} onChange={(event) => {setSortOrder(event as SortOrder)}} defaultValue={SortOrder.DESC}/>
                </div>
                <div>
                  <Label>Tìm kiếm</Label>
                  <Input placeholder="Mã đơn hàng/khách hàng..." onChange={(event) => setSearch(event.target.value)}/>
                </div>
              </div>
            <AllOrdersTable orders={orders} fetchOrders={fetchOrders} editOrder={editOrder}/>
            <div className="flex items-center justify-between mt-4">
               <div className="flex items-center justify-between mt-4 gap-2">
                <Select 
                options={viewOptions} 
                onChange={(event) => setLimit(Number(event))} 
                defaultValue="5" 
                className="!p-1 !text-center !text-lg"/>
                <Label>Sản phẩm/trang</Label>
              </div>
              <div className="flex items-center gap-2">
                <Button className="active:scale-90 !p-3" onClick={() => setPage(page - 1)}><FaArrowLeft/></Button>
                <Input className="!p-1 !w-10 !text-center" value={page} onChange={(event) => setPage(Number(event.target.value))} />
                <Button className="active:scale-90 !p-3" onClick={() => setPage(page + 1)}><FaArrowRight/></Button>
              </div>
            </div>
          </ComponentCard>
        ) : (
          // <CreateOrUpdateProduct 
          // isCreateOrUpdateProduct={isCreatingOrUpdatingProduct} 
          // onClose={() => {setIsCreatingOrUpdatingProduct(''), fetchProducts()}} 
          // editingProduct={editingProduct}/>
          <></>
        )}
      </div>
    </>
  );
}