# 🛍️ PrimeShop

PrimeShop là nền tảng thương mại điện tử chuyên cung cấp các sản phẩm công nghệ như laptop, PC, điện thoại, iPad và linh kiện điện tử. Dự án được thiết kế với kiến trúc phân lớp hiện đại, tách biệt giữa frontend và backend, hỗ trợ mở rộng dễ dàng.

## 🌐 Live Demo (Chưa có)
[https://primeshop-demo.vercel.app](https://primeshop-demo.vercel.app) *(cập nhật nếu đã deploy)*

---

## 📁 Cấu trúc dự án


---

## 🚀 Công nghệ sử dụng

### Frontend (React Vite)
- ⚛️ React 18+
- 🔥 Vite
- 🧩 React Router v6
- 💅 CSS, TailwindCSS, ModuleCSS
- 🌐 Axios

### Backend chính (Spring Boot)
- ☕ Java 17+
- 🌱 Spring Boot 3+
- 🔐 Spring Security + JWT
- 🧠 Hibernate / JPA
- 🗄️ MySQL
- 🔐 JWT Auth

### Backend phụ (Node.js)
- 🟩 Node.js 18+
- 🌐 Express.js
- 🗃️ MySQL

---

## 📦 Tính năng chính

- ✅ Đăng ký / Đăng nhập với phân quyền (Guest, Customer, Admin)
- ✅ Quản lý sản phẩm, danh mục và thương hiệu
- ✅ Giỏ hàng & Thanh toán
- ✅ Theo dõi đơn hàng
- ✅ Quản lý người dùng (Admin)
- ✅ Upload ảnh sản phẩm (Cloudinary/S3 nếu có)
- ✅ Slug SEO-friendly cho sản phẩm
- ✅ Tìm kiếm, lọc, phân trang sản phẩm

---

## 🛠️ Hướng dẫn chạy project

### Yêu cầu:
- Node.js 18+
- Java 17+ & Maven
- MySQL

### 📍 1. Clone project:
```bash
git clone https://github.com/TanPhat1706/PrimeShop.git
cd PrimeShop
```
📍 2. Chạy Frontend:
```bash
  cd frontend react-vite
  npm install
  npm run dev
```
📍 3. Chạy Backend Spring:
```bash
  cd ../backend spring-node/primeshop
  # Cấu hình DB trong file application.properties
  .mvn spring-boot:run
```
📍 4. Chạy Backend Node:
```bash
  cd ../backend spring-node/primeshop/BE-NodeJs
  lt --port 5173 --subdomain primeshop-vnpay
```
### 🔐 Tài khoản mẫu (Demo):
| Role     | Username                                      | Mật khẩu |
| -------- | --------------------------------------------- | -------- |
| Admin    | admin                                         |  admin   |
| Customer | user01                                        |  user01  |
---
🧑‍💻 Đóng góp
1. Fork dự án
2. Tạo nhánh mới git checkout -b feature/ten-tinh-nang
3. Commit và push git push origin feature/...
4. Mở Pull Request
---
📄 Giấy phép
MIT License © 2025 TanPhat1706, pht1412, nhinguyen
---
🎯 Nếu bạn thấy dự án hữu ích, hãy ⭐ Star và Fork repo để ủng hộ tinh thần nhé!








