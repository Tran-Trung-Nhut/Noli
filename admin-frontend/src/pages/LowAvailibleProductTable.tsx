import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import Select from "../components/form/Select";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import { useEffect, useState } from "react";
import { Option } from "../dtos/options.dto";
import { LowAvailibleProduct } from "../dtos/product.dto";
import productApi from "../apis/productApi";
import { INVALID } from "../constantsAndMessage";
import LowAvailibleProductList from "../components/tables/BasicTables/LowAvailibleProduct";

export default function LowAvailibleProductTable() {
  const [products, setProducts] = useState<LowAvailibleProduct[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [search, setSearch] = useState<string>(INVALID.EMPTY_STRING);

  const viewOptions: Option[] = [
    { value: "50", label: "50" },
    { value: "20", label: "20" },
    { value: "10", label: "10" },
    { value: "5", label: "5" }
  ];

  const fetchProducts = () => {
    productApi.getLowAvailiblePaging({
      page,
      limit,
      sortBy: "createdAt",
      sortOrder: "desc",
      search,
    }).then((response) => {
      if (response.status === 200) setProducts(response.data.data);
    })
  }


  useEffect(() => {
    if(page !== INVALID.NUMBER) fetchProducts();
  }, [page, limit, search]);

  return (
    <>
      <PageBreadcrumb pageTitle="Danh sách sản phẩm" />
      <div className="space-y-6">
            <ComponentCard title="Tất cả sản phẩm">
              <div className="flex gap-6">
                <div>
                  <Label>Tìm kiếm</Label>
                  <Input placeholder="Nhập tên sản phẩm..." onChange={(event) => setSearch(event.target.value)}/>
                </div>
              </div>
            <LowAvailibleProductList products={products}/>
            <div className="flex items-center justify-between mt-4">
               <div className="flex items-center justify-between mt-4 gap-2">
                <Select options={viewOptions} onChange={(event) => setLimit(Number(event))} defaultValue="5" className="w-10"/>
                <Label>Sản phẩm/trang</Label>
              </div>
              <div className="flex items-center gap-2">
                <Button className="active:scale-90" onClick={() => setPage(page - 1)}>Trước</Button>
                <Input value={page} onChange={(event) => setPage(Number(event.target.value))} />
                <Button className="active:scale-90" onClick={() => setPage(page + 1)}>Tiếp theo</Button>
              </div>
            </div>
          </ComponentCard>
      </div>
    </>
  );
}