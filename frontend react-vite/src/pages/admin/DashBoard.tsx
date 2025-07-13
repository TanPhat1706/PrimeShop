import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "../../pages/admin/admin.css"
import { useNavigate } from "react-router-dom";

const DashBoard = () => {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [newsCount, setNewsCount] = useState<number | null>(null);
  const [categoryCount, setCategoryCount] = useState<number | null>(null);
  const [voucherCount, setVoucherCount] = useState<number | null>(null);
  const navigate = useNavigate();

  const getTotalProductsCount = async () => {
    const response = await api.get('/product/count');
    setProductCount(response.data);
  }
  
  const getTotalOrdersCount = async () => {
    const response = await api.get('/order/count');
    setOrderCount(response.data);
  }

  const getTotalUsersCount = async () => {
    const response = await api.get('/auth/count');
    setUserCount(response.data);
  }
  const getTotalNewsCount = async () => {
    const response = await api.get('/news/count');
    setNewsCount(response.data.count);
  }
  const getTotalCategoriesCount = async () => {
    const response = await api.get('/category/count');
    setCategoryCount(response.data.count);
  }
  const getTotalVouchersCount = async () => {
    const response = await api.get('/vouchers/count');
    setVoucherCount(response.data.count);
  }

  useEffect(() => {
    getTotalProductsCount();
    getTotalOrdersCount();
    getTotalUsersCount();
    getTotalNewsCount();
    getTotalCategoriesCount();
    getTotalVouchersCount();
  }, []);
  
  return (
    <div className="admin-content">
      <h1>Tổng quan hệ thống</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card" onClick={() => navigate('/admin/products')} style={{ cursor: 'pointer' }}>
          <span className="card-icon">📦</span>
          <div className="card-content">
            <p>{productCount ?? 0} sản phẩm</p>
            <p>Tổng sản phẩm trong kho</p>
          </div>
        </div>
        <div className="card" onClick={() => navigate('/admin/orders')} style={{ cursor: 'pointer' }}>
          <span className="card-icon">🛒</span>
          <div className="card-content">
            <p>{orderCount ?? 0} đơn hàng</p>
            <p>Tổng đơn hàng đã đặt</p>
          </div>
        </div>
        <div className="card" onClick={() => navigate('/admin/users')} style={{ cursor: 'pointer' }}>
          <span className="card-icon">👤</span>
          <div className="card-content">
            <p>{userCount ?? 0} người dùng</p>
            <p>Tổng số người dùng</p>
          </div>
        </div>
        <div className="card" onClick={() => navigate('/admin/news')} style={{ cursor: 'pointer' }}>
          <span className="card-icon">📰</span>
          <div className="card-content">
            <p>{newsCount ?? 0} tin tức</p>
            <p>Tổng số tin tức</p>
          </div>
        </div>
        <div className="card" onClick={() => navigate('/admin/categories')} style={{ cursor: 'pointer' }}>
          <span className="card-icon">📚</span>
          <div className="card-content">
            <p>{categoryCount ?? 0} danh mục</p>
            <p>Tổng số danh mục</p>
          </div>
        </div>
        {/* Voucher Manager Card */}
        <div className="card" onClick={() => navigate('/admin/vouchers')} style={{ cursor: 'pointer' }}>
          <span className="card-icon">🎟️</span>
          <div className="card-content">
            <p>{voucherCount ?? 0} voucher</p>
            <p>Tổng số voucher</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
