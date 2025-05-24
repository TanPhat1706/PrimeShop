import React, { useState } from 'react';
import '../assets/css/account.css'; // Import CSS styles for the component
const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile'); // Quản lý tab đang active

    
  // Dữ liệu mẫu cho thông tin người dùng
  // [Kết nối BE]: Gọi API để lấy thông tin người dùng (GET /api/user/profile)
  const userData = {
    avatar: 'https://via.placeholder.com/120',
    name: 'Nguyễn Văn A',
    email: 'nguyen.van.a@example.com',
    phone: '0123 456 789',
    address: '123 Đường Láng, Hà Nội',
  };

  // Dữ liệu mẫu cho lịch sử giao dịch
  // [Kết nối BE]: Gọi API để lấy lịch sử giao dịch (GET /api/user/orders)
  const orderHistory = [
    {
      id: '12345',
      date: '06/04/2025',
      total: 15000000,
      status: 'delivered',
    },
    {
      id: '12346',
      date: '05/04/2025',
      total: 8500000,
      status: 'pending',
    },
  ];


  
  // Hàm xử lý cập nhật thông tin người dùng
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // [Kết nối BE]: Gửi dữ liệu cập nhật thông tin người dùng (PUT /api/user/profile)
    console.log('Cập nhật thông tin người dùng');
  };

  return (
    <section className="account-page">
      <div className="account-container">
        {/* Profile Section */}
        <div className="profile-section shadow rounded">
          <img src={userData.avatar} alt="Avatar" className="profile-avatar" />
          <div className="profile-info">
            <h2>{userData.name}</h2>
            <p>Email: {userData.email}</p>
            <p>Số điện thoại: {userData.phone}</p>
            <p>Địa chỉ: {userData.address}</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="account-tabs">
          <button
            className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            role="tab"
            aria-selected={activeTab === 'profile'}
          >
            Thông tin cá nhân
          </button>
          <button
            className={`tab-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Lịch sử giao dịch
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content shadow rounded">
          {/* Thông tin cá nhân */}
          <div className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}>
            <h3 className="mb-3">Thông tin cá nhân</h3>
            <form className="profile-form" onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label htmlFor="name">Họ và tên</label>
                <input
                  type="text"
                  id="name"
                  defaultValue={userData.name}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  defaultValue={userData.email}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="phone"
                  defaultValue={userData.phone}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Địa chỉ</label>
                <textarea
                  id="address"
                  defaultValue={userData.address}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Cập nhật
              </button>
            </form>
          </div>

          {/* Lịch sử giao dịch */}
          <div className={`order-history ${activeTab === 'orders' ? 'active' : ''}`}>
            <h3 className="mb-3">Lịch sử giao dịch</h3>
            {orderHistory.length > 0 ? (
              <div className="order-list">
                {orderHistory.map((order) => (
                  <div key={order.id} className="order-item">
                    <div className="order-details">
                      <h4>Mã đơn: #{order.id}</h4>
                      <p>Ngày: {order.date}</p>
                      <p>
                        Tổng:{' '}
                        {order.total.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </p>
                    </div>
                    <span className={`order-status ${order.status}`}>
                      {order.status === 'delivered' ? 'Đã giao' : 'Đang xử lý'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-orders">Bạn chưa có giao dịch nào.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountPage;
