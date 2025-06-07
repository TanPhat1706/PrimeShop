import React, { useEffect, useState } from 'react';
import '../../assets/css/cart.css'; // Import CSS cho trang giỏ hàng
import api from '../../api/api';
import { Cart } from '../../types/cart';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const paymentMethods = [
    {
      id: 1,
      name: "Thanh toán tiền mặt",
      description: "Thanh toán tiền mặt khi nhận hàng",
    },
  ];

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Lỗi khi tải giỏ hàng:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productSlug: string, delta: number) => {
    try {
      await api.post("/cart/add", { productSlug, quantity: delta });
      await fetchCart(); // refetch cart after update
    } catch (err) {
      console.error("Không thể cập nhật số lượng:", err);
    }
  };

  const handleRemoveItem = async (productSlug: string) => {
    try {
      await api.post("/cart/remove", { productSlug });
      await fetchCart();
    } catch (err) {
      console.error("Không thể xóa sản phẩm:", err);
    }
  };

  if (!cart) return <p>Đang tải giỏ hàng...</p>;

  return (
    <div className="cart-page">
      <h1>Giỏ hàng</h1>
      {cart.items.length === 0 ? (
          <p className="text-center my-5">
          <span className="d-block mb-3 fs-4 text-secondary">Giỏ hàng trống 😢</span>
          <Link to="/all-products" className="btn btn-primary">
            Quay lại mua sắm
          </Link>
        </p>
      ) : (
        <>
        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.productSlug} className="cart-item">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.productName}</h3>
                  <p className="cart-item-price">
                    Đơn giá: {item.price.toLocaleString("vi-VN")} VND
                  </p>
                  <div className="cart-item-quantity">
                  <button style={{width: "50px"}}
                      onClick={() => updateQuantity(item.productSlug, -(item.quantity-1))}
                      className="quantity-btn"
                      disabled={item.quantity <= 1}
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => updateQuantity(item.productSlug, -1)}
                      className="quantity-btn"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productSlug, 1)}                                            
                      className="quantity-btn"
                    >
                      +
                    </button>
                    <button style={{width: "50px"}}
                      onClick={() => updateQuantity(item.productSlug, 10)}                                            
                      className="quantity-btn"
                    >
                      +10
                    </button>
                    <button style={{width: "50px"}}
                      onClick={() => updateQuantity(item.productSlug, 100)}                                            
                      className="quantity-btn"
                    >
                      +100
                    </button>
                    
                    <Button style={{marginLeft: "50px"}} variant="contained" color="error" onClick={() => {
                        Swal.fire({
                          title: 'Xác nhận xóa?',
                          text: `Bạn có chắc chắn muốn xóa ${item.productName} khỏi giỏ hàng?`,
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonText: 'Xóa',
                          cancelButtonText: 'Hủy',
                          confirmButtonColor: '#d33',    // đỏ cho "Yes"
                          cancelButtonColor: '#3085d6',  // xanh cho "No"
                          reverseButtons: true
                        }).then((result) => {
                          if (result.isConfirmed) {
                            handleRemoveItem(item.productSlug);
                          }
                        });
                      }}
                    >
                      Xóa khỏi giỏ hàng
                    </Button>
                  </div>
                  <p className="cart-item-subtotal">
                    Tổng: {(item.price * item.quantity).toLocaleString("vi-VN")} VND
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3 className="cart-total">
              Tổng tiền: {cart.items.reduce((total, item) => total + (item.price * item.quantity), 0).toLocaleString("vi-VN")} VND
            </h3>
            <Link to="/checkout" className="checkout-btn">
              Tiến hành thanh toán
            </Link>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
