import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import Select from "../components/form/Select";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import { PlusIcon } from "../icons";
import { useEffect, useState } from "react";
import { Option } from "../dtos/options.dto";
import AllUsersTable from "../components/tables/BasicTables/AllUsersTable";
import { users } from "../mock-datas/user.mock";
// import { defaultUser, User } from "../dtos/user.dto";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

export default function AllUsers() {
  const [isCreatingOrUpdatingUser,setIsCreatingOrUpdatingUser] = useState<string>('')
  // const [updateUser, setUpdateUser] = useState<User>(defaultUser);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [search, setSearch] = useState<string>("");

  const viewOptions: Option[] = [
    { value: "50", label: "50" },
    { value: "20", label: "20" },
    { value: "10", label: "10" },
    { value: "5", label: "5" }
  ];

  const sortOptions: Option[] = [
    {value: "createdAt", label: "Ngày tạo sản phẩm"},
    {value: "name", label: "Tên sản phẩm"},
    {value: "defaultPrice", label: "Giá mặc định"}
  ]

  const orderOptions: Option[] = [
    {value: "desc", label: "Giảm dần"},
    {value: "asc", label: "Tăng dần"},
  ]

  // const editUser = (user: User) => {
  //   setIsCreatingOrUpdatingUser('update');
  //   setUpdateUser(user);
  // }

  useEffect(() => {
  }, [page, limit, sortBy, sortOrder, search]);

  return (
    <>
      <PageBreadcrumb pageTitle="Danh sách người dùng" />
      <div className="space-y-6">
          {!isCreatingOrUpdatingUser ? (
            <ComponentCard title="Tất cả người dùng">
              <Button onClick={() => setIsCreatingOrUpdatingUser('create')} className="active:scale-90">
                <PlusIcon/>
                <span>Thêm người dùng</span>
              </Button>
              <div className="flex gap-6">
                <div>
                  <Label>Sắp xếp theo</Label>
                  <Select options={sortOptions} onChange={(event) => {setSortBy(event)}} defaultValue="name"/>
                </div>
                <div>
                  <Label>Thứ tự</Label>
                  <Select options={orderOptions} onChange={(event) => {setSortOrder(event)}} defaultValue="desc"/>
                </div>
                <div>
                  <Label>Tìm kiếm</Label>
                  <Input placeholder="Nhập tên sản phẩm..." onChange={(event) => setSearch(event.target.value)}/>
                </div>
              </div>
            <AllUsersTable users={users} fetchUsers={() => {}} editUser={() => {}}/>
            <div className="flex items-center justify-between mt-4">
               <div className="flex items-center justify-between mt-4 gap-2">
                 <Select 
                options={viewOptions} 
                onChange={(event) => setLimit(Number(event))} 
                defaultValue="5" 
                className="!p-1 !text-center !text-lg"/>
                <Label>Người dùng/trang</Label>
              </div>
              <div className="flex items-center gap-2">
                <Button className="active:scale-90 !p-3" onClick={() => setPage(page - 1)}><FaArrowLeft/></Button>
                <Input className="!p-1 !w-10 !text-center" value={page} onChange={(event) => setPage(Number(event.target.value))} />
                <Button className="active:scale-90 !p-3" onClick={() => setPage(page + 1)}><FaArrowRight/></Button>
              </div>
            </div>
          </ComponentCard>
        ) : (
        //   <CreateOrUpdateProduct 
        //   isCreateOrUpdateProduct={isCreatingOrUpdatingUser} 
        //   onClose={() => {setIsCreatingOrUpdatingUser(''), () => {}}} 
        //   editingProduct={editingProduct}/>
        <></>
        )}
      </div>
    </>
  );
}