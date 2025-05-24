import React, { useEffect, useState } from "react";
import "../../assets/css/admin.css";
import api from "../../api/api";
import { Order } from "../../types/order";
import { 
  Table, 
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button
} from "@mui/material";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const OrderManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filters, setFilters] = useState({
    orderId: "",
    status: "all",
    search: "",
    startDate: "",
    endDate: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  
  useEffect(() => {
    fetchOrders();
    console.log(orders);
  }, [filters]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/order/all-orders", {
        params: {
          orderId: filters.orderId !== "" ? filters.orderId : undefined,
          status: filters.status !== "all" ? filters.status : undefined,
          search: filters.search || undefined,
          startDate: filters.startDate !== "" ? dayjs(filters.startDate, "DD-MM-YYYY").format("YYYY-MM-DDTHH:mm:ss") : "",
          endDate: filters.endDate !== "" ? dayjs(filters.endDate, "DD-MM-YYYY").format("YYYY-MM-DDTHH:mm:ss") : ""
        }
      });
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const showOrderDetails = (orders) => {
    Swal.fire({
      title: 'Chi tiết đơn hàng',
      html: `
        <div>
          <p><strong>Mã đơn:</strong> #${orders.orderId}</p>
          <p><strong>Sản phẩm:</strong> ${orders.orderItems.map(item => `${item.productName} - Số lượng: ${item.quantity}`).join(', ')}</p>
          <p><strong>Người nhận:</strong> ${orders.fullName}</p>
          <p><strong>Số điện thoại:</strong> ${orders.phoneNumber}</p>
          <p><strong>Địa chỉ:</strong> ${orders.address}</p>
          <p><strong>Ghi chú:</strong> ${orders.note}</p>          
          <p><strong>Ngày đặt hàng:</strong> ${orders.createdAt.split('T')[0]}</p>
          <p><strong>Tổng tiền:</strong> ${orders.totalAmount.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
          })}</p>          
        </div>
      `,
      confirmButtonText: 'Đóng'
    });
  }

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApproveOrder = async (orderId: string) => {
    try {
      await api.put(`/admin/order/update-status?id=${orders.find(order => order.orderId === orderId)?.orderId}&status=CONFIRMED`);
      fetchOrders();
    } catch (error) {
      console.error("Error approving order:", error); 
    }
  };

  const handleDeliveryOrder = async (orderId: string) => {
    try {
      await api.put(`/admin/order/update-status?id=${orders.find(order => order.orderId === orderId)?.orderId}&status=SHIPPED`);
      fetchOrders();
    } catch (error) {
      console.error("Error delivering order:", error);
    }
  };

  const handleDeliverySuccess = async (orderId: string) => {
    try {
      await api.put(`/admin/order/update-status?id=${orders.find(order => order.orderId === orderId)?.orderId}&status=DELIVERED`);
      fetchOrders();
    } catch (error) {
      console.error("Error delivering order:", error);
    }
  };

  const handleRemoveOrder = async (orderId: string) => {
    try {
      await api.delete(`/admin/order/delete?id=${orders.find(order => order.orderId === orderId)?.orderId}&status=CANCELLED`);
      fetchOrders();
    } catch (error) {
      console.error("Error removing order:", error);
    }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post("/admin/order/create");
      fetchOrders();
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };
  
  // return (
  //   <div className="admin-container">
  //     <h1 className="admin-title">Quản lý đơn hàng</h1>

  //     <div className="filters-container" style={{ marginBottom: 20, display: 'flex', gap: 20 }}>
  //       <FormControl style={{ minWidth: 120 }}>
  //         <InputLabel>Trạng thái</InputLabel>
  //         <Select
  //           value={filters.status}
  //           onChange={(e) => handleFilterChange("status", e.target.value)}
  //         >
  //           <MenuItem value="all">Tất cả</MenuItem>
  //           <MenuItem value="PENDING">Chờ xử lý</MenuItem>
  //           <MenuItem value="PAID">Chờ vận chuyển</MenuItem>
  //           <MenuItem value="SHIPPED">Đang giao hàng</MenuItem>
  //           <MenuItem value="DELIVERED">Đã giao hàng</MenuItem>
  //           <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
  //           <MenuItem value="CANCELLED">Đã hủy</MenuItem>
  //         </Select>
  //       </FormControl>

  //       <TextField
  //         label="Tìm kiếm"
  //         value={filters.search}
  //         onChange={(e) => handleFilterChange("search", e.target.value)}
  //       />

  //       <TextField
  //         type="date"
  //         label="Từ ngày"
  //         InputLabelProps={{ shrink: true }}
  //         value={filters.fromDate}
  //         onChange={(e) => handleFilterChange("fromDate", e.target.value)}
  //       />

  //       <TextField
  //         type="date"
  //         label="Đến ngày"
  //         InputLabelProps={{ shrink: true }}
  //         value={filters.toDate}
  //         onChange={(e) => handleFilterChange("toDate", e.target.value)}
  //       />
  //     </div>

  //     <TableContainer component={Paper}>
  //       <Table>
  //         <TableHead>
  //           <TableRow>
  //             <TableCell>Mã đơn</TableCell>
  //             <TableCell>Khách hàng</TableCell>
  //             <TableCell>Số điện thoại</TableCell>
  //             <TableCell>Tổng tiền</TableCell>
  //             <TableCell>Trạng thái</TableCell>
  //             <TableCell>Ngày đặt</TableCell>
  //             <TableCell>Thao tác</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {filteredOrders.map((order) => (
  //             <TableRow key={order.orderId}>
  //               <TableCell>{order.orderId}</TableCell>
  //               <TableCell>{order.fullName}</TableCell>
  //               <TableCell>{order.phoneNumber}</TableCell>
  //               <TableCell>
  //                 {order.totalAmount.toLocaleString('vi-VN', {
  //                   style: 'currency',
  //                   currency: 'VND'
  //                 })}
  //               </TableCell>
  //               <TableCell>{order.orderStatus}</TableCell>
  //               <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
  //               <TableCell>
  //                 {/* Add action buttons here */}
  //                 {order.orderStatus === "PENDING" && (
  //                   <Button variant="contained" color="primary" onClick={() => handleApproveOrder(order.orderId)}>Duyệt đơn</Button>
  //                 )}
  //                 {order.orderStatus === "PAID" && (
  //                   <Button variant="contained" color="primary" onClick={() => handleDeliveryOrder(order.orderId)}>Giao hàng</Button>
  //                 )}
  //                 {order.orderStatus === "SHIPPED" && (
  //                   <Button variant="contained" color="primary" onClick={() => handleDeliverySuccess(order.orderId)}>Giao hàng thành công</Button>
  //                 )}
  //               </TableCell>
  //             </TableRow>
  //           ))}
  //         </TableBody>
  //       </Table>
  //     </TableContainer>
  //   </div>
  // );

  return (
    <div>
      <h1>Quản lý đơn hàng</h1>
      {/* <button
        onClick={() => setShowAddForm(!showAddForm)}
        className={`btn ${showAddForm ? 'btn-secondary' : 'btn-success'}`}
      >
        {showAddForm ? 'Hủy thêm' : 'Thêm đơn hàng'}
      </button> */}

      {/* Form thêm đơn hàng */}
      {/* {showAddForm && (
        <div className="admin-form">
          <h2>Thêm đơn hàng mới</h2>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Khách hàng (ID)</label>
              <input
                type="text"
                value={""}
                onChange={(e) => {}}
                required
              />
            </div>
            <div className="form-group">
              <label>Mã sản phẩm</label>
              <input
                type="text"
                value={""}
                onChange={(e) => {}}
                required
              />
            </div>
            <div className="form-group">
              <label>Số lượng</label>
              <input
                type="number"
                value={""}
                onChange={(e) => {}}
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Giá sản phẩm</label>
              <input
                type="number"
                value={""}
                onChange={(e) => {}}
                required
              />
            </div>
            <div className="form-group">
              <label>Tổng tiền</label>
              <input
                type="number"
                value={""}
                onChange={(e) => {}}
                required
              />
            </div>
            <div className="form-group">
              <label>Trạng thái</label>
              <select
                value={""}
                onChange={(e) => {}}
                required
              >
                <option value="Chờ xác nhận">Chờ xác nhận</option>
                <option value="Đang giao">Đang giao</option>
                <option value="Đã giao">Đã giao</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>
            <div className="flex justify-start">
              <button type="submit" className="btn btn-primary">
                Thêm
              </button>
            </div>
          </form>
        </div>
      )} */}

      <form className="flex items-center gap-3 mb-4">
      <div className="flex items-center gap-2">
        <label htmlFor="status" className="font-semibold text-gray-700" style={{ marginRight: 10 }}>
          Lọc theo trạng thái:
        </label>
        <select
          id="status"
          name="status"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả</option>
          <option value="PENDING">Chờ xác nhận</option>
          <option value="CONFIRMED">Đã xác nhận</option>
          <option value="PAID">Đã thanh toán</option>
          <option value="SHIPPED">Đang giao hàng</option>
          <option value="DELIVERED">Hoàn thành</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="orderId" className="font-semibold text-gray-700 whitespace-nowrap" style={{ marginRight: 10, marginLeft: 10 }}>
          Mã đơn hàng:
        </label>
        <input
          id="orderId"
          type="number"
          name="orderId"
          value={filters.orderId}
          onChange={(e) => handleFilterChange("orderId", e.target.value)}
          placeholder="Nhập mã đơn"
          className="border border-gray-300 rounded px-3 py-1 w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-2"> 
        <label htmlFor="fromDate" className="font-semibold text-gray-700 whitespace-nowrap" style={{ marginRight: 10, marginLeft: 10 }}>Từ ngày</label>
        <input
          id="fromDate"
          type="date"
          name="fromDate"
          value={filters.startDate}
          onChange={(e) => handleFilterChange("startDate", e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex items-center gap-2"> 
        <label htmlFor="toDate" className="font-semibold text-gray-700 whitespace-nowrap" style={{ marginRight: 10, marginLeft: 10 }}>Đến ngày</label>
        <input
          id="toDate"
          type="date"
          name="toDate"
          value={filters.endDate}
          onChange={(e) => handleFilterChange("endDate", e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 w-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Hình thức</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày đặt</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.admin ? "Offline" : "Online"}</td>
                <td>{order.fullName}</td>
                <td>{order.totalAmount.toLocaleString()} VNĐ</td>
                <td>{order.orderStatus}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => showOrderDetails(order)} className="btn btn-link">
                    Xem chi tiết
                  </button>
                  {order.orderStatus === "PENDING" && (
                    <button onClick={() => handleApproveOrder(order.orderId)} className="btn btn-link">
                      Duyệt đơn
                    </button>
                  )}
                  {order.orderStatus === "PAID" && (
                    <button onClick={() => handleDeliveryOrder(order.orderId)} className="btn btn-link">
                      Giao hàng
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal xác nhận xóa
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Xác nhận xóa</h2>
            <p>Bạn có chắc chắn muốn xóa đơn hàng này?</p>
            <div className="flex justify-end">
              <button onClick={() => setDeleteId(null)} className="btn btn-secondary">
                Hủy
              </button>
              <button onClick={() => handleDelete(deleteId)} className="btn btn-danger">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )} */}

      {editOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Chỉnh sửa đơn hàng</h2>
            <form onSubmit={() => {}}>
              <div className="form-group">
                <label>Mã đơn</label>
                <input type="text" value={""} disabled />
              </div>
              <div className="form-group">
                <label>Khách hàng</label>
                <input
                  type="text"
                  value={""}
                  onChange={(e) => {}}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tổng tiền</label>
                <input
                  type="number"
                  value={""}
                  onChange={(e) => {}}
                  required
                />
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={""}
                  onChange={(e) => {}}
                  required
                >
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đang giao">Đang giao</option>
                  <option value="Đã giao">Đã giao</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => {}} className="btn btn-secondary">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
