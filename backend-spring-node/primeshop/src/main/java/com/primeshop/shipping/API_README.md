# Shipping API Documentation

## Tổng quan
API tính phí vận chuyển cho PrimeShop Frontend Integration.

## 🔧 **FIXES MỚI NHẤT (v1.1)**

### ✅ **Đã sửa lỗi FREESHIP chỉ áp dụng cho TPHCM:**
- **Loại bỏ điều kiện quá nghiêm ngặt**: `discountValue >= shippingFee`
- **Thêm validation đúng**: Kiểm tra `minOrderValue` thay vì so sánh với phí ship
- **Áp dụng cho tất cả tỉnh thành**: FREESHIP hoạt động ở mọi nơi
- **Lấy subtotal thực tế**: Từ cart của user thay vì hardcode 0

### ✅ **Logic FREESHIP mới:**
1. Voucher phải có `discountType = FIXED`
2. Voucher phải `isValid()` (active, chưa hết hạn, chưa hết lượt)
3. Đơn hàng phải >= `minOrderValue` (nếu có)
4. **KHÔNG cần** `discountValue >= shippingFee`

## Endpoints

### 1. GET /api/shipping/calculate
Tính phí vận chuyển dựa trên địa chỉ và mã voucher.

**Parameters:**
- `address` (required): Địa chỉ chi tiết
- `city` (required): Thành phố (hanoi, hcm, danang, etc.)
- `district` (required): Quận/huyện (baidinh, district1, etc.)
- `voucherCode` (optional): Mã voucher freeship

**Example Request:**
```
GET /api/shipping/calculate?address=123%20Nguyen%20Hue&city=hcm&district=district1&voucherCode=FREESHIP
```

**Response:**
```json
{
  "shippingFee": 0
}
```

### 2. GET /api/shipping/test
Test endpoint để kiểm tra tính năng shipping calculation với subtotal thấp (300k) để test FREESHIP voucher.

**Example Request:**
```
GET /api/shipping/test
```

**Response:**
```
=== SHIPPING CALCULATION TEST (Subtotal: 300k) ===

📍 hcm - district1:
   Không voucher: 20000 VNĐ
   Có FREESHIP: 0 VNĐ (Miễn phí)

📍 hanoi - baidinh:
   Không voucher: 50000 VNĐ
   Có FREESHIP: 0 VNĐ (Miễn phí)

📍 danang - haichau:
   Không voucher: 50000 VNĐ
   Có FREESHIP: 0 VNĐ (Miễn phí)
```

### 3. GET /api/shipping/test-auto-free
Test endpoint để kiểm tra miễn phí ship tự động với subtotal cao (600k >= 500k).

**Example Request:**
```
GET /api/shipping/test-auto-free
```

**Response:**
```
=== AUTO FREE SHIPPING TEST (Subtotal: 600k) ===

📍 hcm - district1:
   Không voucher: 0 VNĐ (Auto miễn phí)
   Có FREESHIP: 0 VNĐ (Miễn phí)

📍 hanoi - baidinh:
   Không voucher: 0 VNĐ (Auto miễn phí)
   Có FREESHIP: 0 VNĐ (Miễn phí)
```

### 4. POST /api/checkout/preview-shipping
API preview phí vận chuyển chi tiết (cho backend khác).

**Request Body:**
```json
{
  "address": {
    "province": "TPHCM",
    "district": "Quận 1",
    "ward": "Phường Bến Nghé"
  },
  "cartItems": [
    {
      "productId": 1,
      "productName": "iPhone 15",
      "quantity": 2,
      "price": 25000000,
      "totalPrice": 50000000
    }
  ],
  "subtotal": 50000000,
  "voucherCode": "FREESHIP"
}
```

**Response:**
```json
{
  "shippingFee": 20000,
  "shippingDiscount": 20000,
  "finalShippingFee": 0,
  "shippingZone": "HCMC_INNER",
  "zoneDescription": "TPHCM - Nội thành",
  "freeShipping": true,
  "freeShippingReason": "Mã giảm giá FREESHIP"
}
```

### 5. GET /api/shipping/test-soctrang-thanhtri
Test endpoint cụ thể cho địa chỉ "123, Sóc Trăng, Thành Trị" với và không có voucher FREESHIP.

**Example Request:**
```
GET http://localhost:8080/api/shipping/test-soctrang-thanhtri
```

**Response:**
```
=== TEST CỤ THỂ: 123, Sóc Trăng, Thành Trị ===

📍 Địa chỉ: 123, Sóc Trăng, Thành Trị
💰 Subtotal: 300000 VNĐ

=== KẾT QUẢ ===
🚚 Không voucher:
   - Phí vận chuyển: 50000 VNĐ
   - Phí cuối cùng: 50000 VNĐ
   - Miễn phí: Không
   - Lý do: Không có

🎫 Có voucher FREESHIP:
   - Phí vận chuyển: 50000 VNĐ
   - Giảm giá: 50000 VNĐ
   - Phí cuối cùng: 0 VNĐ
   - Miễn phí: Có
   - Lý do: Mã giảm giá FREESHIP

=== SO SÁNH ===
✅ FREESHIP được áp dụng thành công!
   Tiết kiệm: 50000 VNĐ
```

### 6. GET /api/shipping/test-frontend-api
Test endpoint mô phỏng API call thực tế từ frontend cho địa chỉ "123, soctrang, thanhtri".

**Example Request:**
```
GET http://localhost:8080/api/shipping/test-frontend-api
```

**Response:**
```
=== TEST FRONTEND API CALL ===

📝 Request Parameters:
   address: 123
   city: soctrang
   district: thanhtri
   voucherCode: FREESHIP

💰 Subtotal (mock): 300000 VNĐ

=== KẾT QUẢ API ===
🚚 Shipping Fee: 50000 VNĐ
🎫 Shipping Discount: 50000 VNĐ
💳 Final Shipping Fee: 0 VNĐ
✅ Free Shipping: true
📋 Reason: Mã giảm giá FREESHIP
📍 Zone: OTHER_PROVINCES
📝 Zone Description: Các tỉnh/thành khác

=== FRONTEND RESPONSE ===
JSON Response: {
  "shippingFee": 0
}

=== KẾT LUẬN ===
✅ FREESHIP hoạt động - Phí ship = 0 VNĐ
```

### 7. GET /api/shipping/test-freeship-comprehensive
Endpoint tổng quát để test voucher FREESHIP với bất kỳ địa chỉ nào.

**Parameters:**
- `address` (optional): Địa chỉ (default: "123")
- `city` (optional): Thành phố (default: "hanoi")
- `district` (optional): Quận/huyện (default: "baidinh")
- `subtotalStr` (optional): Subtotal (default: "300000")

**Example Request:**
```
GET http://localhost:8080/api/shipping/test-freeship-comprehensive?city=soctrang&district=thanhtri&subtotalStr=300000
```

**Response:**
```
=== TEST FREESHIP TỔNG QUÁT ===

📝 Thông tin test:
   Address: 123
   City: soctrang
   District: thanhtri
   Subtotal: 300000 VNĐ

=== TEST 1: KHÔNG CÓ VOUCHER ===
🚚 Kết quả:
   - Phí vận chuyển: 50000 VNĐ
   - Phí cuối cùng: 50000 VNĐ
   - Miễn phí: Không
   - Lý do: Không có
   - Khu vực: Các tỉnh/thành khác

=== TEST 2: CÓ VOUCHER FREESHIP ===
🎫 Kết quả:
   - Phí vận chuyển: 50000 VNĐ
   - Giảm giá: 50000 VNĐ
   - Phí cuối cùng: 0 VNĐ
   - Miễn phí: Có
   - Lý do: Mã giảm giá FREESHIP
   - Khu vực: Các tỉnh/thành khác

=== SO SÁNH KẾT QUẢ ===
✅ FREESHIP HOẠT ĐỘNG THÀNH CÔNG!
   - Phí vận chuyển cuối cùng: 0 VNĐ
   - Tiết kiệm được: 50000 VNĐ
   - Trạng thái: Miễn phí vận chuyển

=== KIỂM TRA VOUCHER FREESHIP ===
✅ FREESHIP voucher tìm thấy:
   - Code: FREESHIP
   - Discount Type: FIXED
   - Discount Value: 30000.0
   - Min Order Value: 200000.0
   - Is Active: true
   - Is Valid: true
   - Đơn hàng >= 200000.0đ: Có

=== FRONTEND API RESPONSE ===
1. Không có voucher:
   GET /api/shipping/calculate?address=123&city=soctrang&district=thanhtri
   Response: {"shippingFee": 50000}

2. Có voucher FREESHIP:
   GET /api/shipping/calculate?address=123&city=soctrang&district=thanhtri&voucherCode=FREESHIP
   Response: {"shippingFee": 0}
```

### 8. GET /api/shipping/test-freeship-quick
Endpoint test nhanh FREESHIP - chỉ trả về kết quả đơn giản.

**Parameters:**
- `city` (optional): Thành phố (default: "hanoi")
- `district` (optional): Quận/huyện (default: "baidinh")
- `subtotalStr` (optional): Subtotal (default: "300000")

**Example Request:**
```
GET http://localhost:8080/api/shipping/test-freeship-quick?city=soctrang&district=thanhtri
```

**Response:**
```
📍 soctrang - thanhtri:
   Không voucher: 50000 VNĐ
   Có FREESHIP: 0 VNĐ (Miễn phí)
```

### 9. GET /api/shipping/test-freeship-all-provinces
Test FREESHIP với tất cả các tỉnh thành để đảm bảo hoạt động toàn quốc.

**Parameters:**
- `subtotalStr` (optional): Subtotal (default: "300000")

**Example Request:**
```
GET http://localhost:8080/api/shipping/test-freeship-all-provinces?subtotalStr=300000
```

**Response:**
```
=== TEST FREESHIP TẤT CẢ TỈNH THÀNH (Subtotal: 300000 VNĐ) ===

📍 TPHCM - Quận 1:
   Không voucher: 20000 VNĐ
   Có FREESHIP: 0 VNĐ (✅ Miễn phí)
   💰 Tiết kiệm: 20000 VNĐ

📍 Hà Nội - Ba Đình:
   Không voucher: 50000 VNĐ
   Có FREESHIP: 0 VNĐ (✅ Miễn phí)
   💰 Tiết kiệm: 50000 VNĐ

📍 Sóc Trăng - Thành Trị:
   Không voucher: 50000 VNĐ
   Có FREESHIP: 0 VNĐ (✅ Miễn phí)
   💰 Tiết kiệm: 50000 VNĐ

...

=== TỔNG KẾT ===
✅ FREESHIP hoạt động: 15/15 tỉnh thành
❌ FREESHIP không hoạt động: 0/15 tỉnh thành
📊 Tỷ lệ thành công: 100.0%
🎉 FREESHIP hoạt động hoàn hảo trên tất cả tỉnh thành!
```

## Logic tính phí

### Phí vận chuyển cơ bản:
- **TPHCM - Nội thành**: 20.000đ
- **TPHCM - Ngoại thành**: 35.000đ  
- **Các tỉnh/thành khác**: 50.000đ

### Điều kiện miễn phí ship:
1. **Đơn hàng >= 500.000đ** (chỉ áp dụng khi có subtotal)
2. **Mã voucher FREESHIP** hợp lệ (✅ **ĐÃ SỬA**)

### Các thành phố được hỗ trợ:
- Hà Nội (hanoi)
- TP. Hồ Chí Minh (hcm)
- Đà Nẵng (danang)
- Hải Phòng (haiphong)
- Cần Thơ (cantho)
- Bình Dương (binhduong)
- Bà Rịa - Vũng Tàu (baivi)
- Sóc Trăng (socTrang)

## FREESHIP Voucher Logic (ĐÃ SỬA)

### ✅ **Điều kiện áp dụng FREESHIP:**
1. **Voucher tồn tại và hợp lệ** (`isValid()`)
2. **Loại voucher**: `discountType = FIXED`
3. **Đơn hàng tối thiểu**: `subtotal >= minOrderValue` (nếu có)
4. **KHÔNG cần**: `discountValue >= shippingFee`

### ✅ **Ví dụ voucher FREESHIP hợp lệ:**
```sql
INSERT INTO vouchers (code, discount_type, discount_value, min_order_value, start_date, end_date, max_usage, current_usage, is_active)
VALUES ('FREESHIP', 'FIXED', 30000, 200000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1000, 0, 1);
```

### ✅ **Test cases:**
- ✅ Hà Nội + FREESHIP = Miễn phí (50k → 0k) - Đơn hàng >= 200k
- ✅ TP.HCM + FREESHIP = Miễn phí (20k → 0k) - Đơn hàng >= 200k
- ✅ Đà Nẵng + FREESHIP = Miễn phí (50k → 0k) - Đơn hàng >= 200k
- ✅ Sóc Trăng + FREESHIP = Miễn phí (50k → 0k) - Đơn hàng >= 200k

## Frontend Integration

### Cách sử dụng trong React:
```javascript
const calculateShipping = async () => {
  try {
    const response = await api.get("/shipping/calculate", {
      params: {
        address: formData.address,
        city: formData.city,
        district: formData.district,
        voucherCode: formData.voucherCode || ""
      }
    });
    
    setShippingFee(response.data.shippingFee);
  } catch (error) {
    console.error("Shipping calculation error:", error);
  }
};
```

### Error Handling:
- **404**: API endpoint không tồn tại
- **400**: Dữ liệu không hợp lệ
- **500**: Lỗi server
- **Network Error**: Không thể kết nối đến server

## Testing

1. **Test endpoint cơ bản:**
   ```
   GET http://localhost:8080/api/shipping/test
   ```

2. **Test với parameters thực tế:**
   ```
   GET http://localhost:8080/api/shipping/calculate?address=123%20Nguyen%20Hue&city=hcm&district=district1
   ```

3. **Test với voucher FREESHIP:**
   ```
   GET http://localhost:8080/api/shipping/calculate?address=123%20Nguyen%20Hue&city=hanoi&district=baidinh&voucherCode=FREESHIP
   ```

## Debugging

### Console Logs:
API sẽ log chi tiết quá trình xử lý:
```
=== SHIPPING CALCULATION DEBUG ===
Address: socTrang - soctrang
Subtotal: 600000
VoucherCode: null
Shipping Zone: OTHER_PROVINCES
Base Fee: 50000
Extra Items Fee: 0
Total Shipping Fee (before discount): 50000
Free shipping due to subtotal >= 500000
Final Shipping Fee: 0
Is Free Shipping: true
Free Shipping Reason: Đơn hàng từ 500000đ
=== END DEBUG ===
```

### 🔍 **Phân tích log Sóc Trăng:**
```
📍 socTrang - soctrang:
   Không voucher: 0 VNĐ
   Có FREESHIP: 0 VNĐ (Miễn phí)
```

**✅ Đây là kết quả ĐÚNG!** Vì:
1. **Subtotal = 600.000đ** >= 500.000đ → **Tự động miễn phí ship**
2. **Không cần voucher FREESHIP** vì đã được miễn phí tự động
3. **Logic hoạt động chính xác** cho tất cả tỉnh thành

### Common Issues:
- **Voucher không tồn tại**: Kiểm tra database
- **Voucher hết hạn**: Kiểm tra `end_date`
- **Đơn hàng < minOrderValue**: Tăng giá trị đơn hàng
- **Voucher không active**: Kiểm tra `is_active = 1`
- **Subtotal >= 500k**: Sẽ tự động miễn phí ship (không cần voucher)

## Lưu ý

- ✅ **FREESHIP hoạt động cho tất cả tỉnh thành**
- ✅ **Không cần discountValue >= shippingFee**
- ✅ **Chỉ cần đáp ứng minOrderValue**
- ✅ **API tự động lấy subtotal từ cart của user**
- ✅ **Có logging chi tiết để debug** 