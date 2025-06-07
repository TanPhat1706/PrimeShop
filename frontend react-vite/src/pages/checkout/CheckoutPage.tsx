import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../components/Login-register/style.css"; // Sử dụng style.css đã có
import "./checkout.css"; // CSS riêng cho checkout
import { Cart } from "../../types/cart";
import api from "../../api/api";
import { User } from "../../types/user";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface CheckoutForm {
  fullName: string;
  address: string;
  phone: string;
  email: string;
  note: string;
  paymentMethod: string;
}

const CheckoutPage = () => {
  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: "",
    address: "", 
    phone: "",
    email: "",
    note: "",
    paymentMethod: "cod",
  });
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    const res = await api.get("/cart");
    setCart(res.data);
  };

  const fetchUser = async () => {
    const res = await api.get("/auth/me");
    setUser(res.data);
    // Pre-fill form data with user info
    setFormData({
      fullName: res.data.fullName || "",
      address: res.data.address || "",
      phone: res.data.phoneNumber || "",
      email: res.data.email || "",
      note: '',
      paymentMethod: "cod"
    });
  };

  useEffect(() => {
    fetchCart();
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      if (!/^\d*$/.test(value)) return;
    }
    
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await api.post("/order/create", {
        fullName: formData.fullName,
        address: formData.address,
        phoneNumber: formData.phone,
        email: formData.email,
        note: formData.note,
        paymentMethod: formData.paymentMethod
      });
      
      // setMessage("Đặt hàng thành công! Vui lòng kiểm tra email để xác nhận.");
      Swal.fire({
        title: "Đặt hàng thành công!",
        text: "Trong vòng 24 giờ tới đơn hàng của bạn sẽ được xử lý. Vui lòng thanh toán trong 48 giờ tiếp theo kể từ lúc được xử lý hoặc đơn hàng của bạn sẽ bị hủy.",
        icon: "success"
      });
      navigate("/account");
      // setFormData({ fullName: "", address: "", phone: "", email: "", note: "", paymentMethod: "cod" });
    } catch (error) {
      setMessage("Có lỗi xảy ra khi đặt hàng!");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setMessage("Vui lòng nhập họ tên!");
      return false;
    }
    if (!formData.address.trim()) {
      setMessage("Vui lòng nhập địa chỉ!");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setMessage("Số điện thoại phải là 10 chữ số!");
      return false;
    }
    return true;
  };

  // const validateEmail = (email: string) => {
  //   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return re.test(email);
  // };

  const total = cart?.totalPrice;

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Thanh toán</h2>
      <div className="checkout-content">
        <div className="checkout-form">
          {message && (
            <div className={message.includes("10") ? "error-message" : "success-message"}>{message}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="fullName">Họ và tên</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="address">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ giao hàng"
                required
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại (10 chữ số)"
                required
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                required
                disabled={loading}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="note">Ghi chú</label>
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(e as any)}
                placeholder="Nhập ghi chú cho đơn hàng (nếu có)"
                style={{ resize: 'none' }}
                disabled={loading}
              ></textarea>
            </div>
            <div className="input-group">
              <label htmlFor="paymentMethod">Phương thức thanh toán</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="bank">Chuyển khoản ngân hàng</option>
                <option value="cod">Thanh toán tại cửa hàng</option>
              </select>
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Đang xử lý..." : "Xác nhận đơn hàng"}
            </button>
          </form>
        </div>
        <div className="checkout-cart">
          <h3 className="cart-title">Giỏ hàng của bạn</h3>
          {cart?.items.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.imageUrl} alt={item.productName} className="cart-item-image" onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/50?text=Image+Not+Found")} />
              <div className="cart-item-details">
                <span>{item.productName}</span>
                <span>Số lượng: {item.quantity}</span>
                <span>Giá: {(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ</span>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <strong>Tổng cộng: {total?.toLocaleString("vi-VN")} VNĐ</strong>
          </div>
          <Link to="/cart" className="back-link">
            Quay lại giỏ hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;