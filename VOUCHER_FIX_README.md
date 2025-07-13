# 🔧 VOUCHER USAGE COUNT FIX - GIẢI PHÁP TRIỆT ĐỂ

## 🚨 **VẤN ĐỀ ĐÃ PHÁT HIỆN**

### **Hiện tượng:**
- ✅ **Có nút kiểm tra**: Ấn đặt hàng → `used_count` tăng
- ❌ **Từ trang cart**: Kéo qua checkout → Ấn đặt hàng → `used_count` KHÔNG tăng

### **Nguyên nhân gốc rễ:**

#### **1. Vấn đề ở OrderService**
```java
// TRƯỚC: Chỉ xử lý voucher từ request, bỏ qua voucher từ cart
if (request.getVoucherCodes() != null && !request.getVoucherCodes().isEmpty()) {
    // Chỉ xử lý voucher từ request
} else {
    // Bỏ qua voucher từ cart
}
```

#### **2. Vấn đề ở CheckoutPage**
```javascript
// TRƯỚC: Có thể không gửi voucherCodes đúng cách
voucherCodes: formData.voucherCodes, // Có thể rỗng
```

## 🛠️ **GIẢI PHÁP TRIỆT ĐỂ**

### **Logic mới:**
- **Cart**: Chỉ lưu voucher, tính toán lại tổng tiền → **KHÔNG TĂNG `used_count`**
- **Checkout**: Khi đặt hàng → **LUÔN TĂNG `used_count`** (bất kể voucher từ đâu)

### **Bước 1: Sửa CartController - KHÔNG tăng used_count**
```java
@PostMapping("/apply-multi-voucher")
public ResponseEntity<?> applyMultiVoucherToCart(@RequestBody ApplyMultiVoucherRequest request) {
    // CHỈ LƯU VÀO CART, KHÔNG TĂNG USED_COUNT
    List<Voucher> vouchers = voucherRepository.findAllByCodeIn(request.getVoucherCodes());
    cart.setVouchers(vouchers);
    cart.setTotalPrice(); // Tính lại tổng tiền
    cartRepo.save(cart);
}
```

### **Bước 2: Sửa OrderService - LUÔN tăng used_count khi đặt hàng**
```java
// Thu thập voucher codes từ cả request và cart
List<String> voucherCodesToProcess = new ArrayList<>();

if (request.getVoucherCodes() != null && !request.getVoucherCodes().isEmpty()) {
    voucherCodesToProcess.addAll(request.getVoucherCodes());
}

// Nếu không có voucher từ request, lấy từ cart
if (voucherCodesToProcess.isEmpty()) {
    List<Voucher> cartVouchers = cart.getVouchers();
    if (cartVouchers != null && !cartVouchers.isEmpty()) {
        voucherCodesToProcess = cartVouchers.stream()
            .map(Voucher::getCode)
            .collect(Collectors.toList());
    }
}

// LUÔN TĂNG USED_COUNT KHI ĐẶT HÀNG
if (!voucherCodesToProcess.isEmpty()) {
    appliedVouchers = voucherService.processVouchersForOrder(
        voucherCodesToProcess, 
        totalAmount.doubleValue()
    );
}
```

### **Bước 3: Sửa VoucherService - LUÔN tăng used_count**
```java
// LUÔN TĂNG USED_COUNT KHI ĐẶT HÀNG
int beforeUsage = voucher.getCurrentUsage();
voucher.incrementUsage();
voucherRepo.saveAndFlush(voucher);
```

### **Bước 4: Sửa CheckoutPage - Đảm bảo gửi voucherCodes**
```javascript
// Đảm bảo voucherCodes được gửi đúng cách
const voucherCodes = appliedVouchers.map(v => v.code);
const orderData = {
    // ... other fields
    voucherCodes: voucherCodes, // Sử dụng từ appliedVouchers
};
```

## 🔄 **LUỒNG XỬ LÝ MỚI**

### **Luồng 1: Từ Cart (ĐÃ SỬA)**
1. User áp dụng voucher vào cart → **Lưu voucher, tính toán tổng tiền** (KHÔNG tăng used_count)
2. User chuyển sang checkout → Voucher được hiển thị
3. User đặt hàng → OrderService lấy voucher từ cart → **TĂNG used_count** ✅

### **Luồng 2: Từ Checkout (ĐÃ SỬA)**
1. User nhập voucher ở checkout → Gửi `voucherCodes` đến backend
2. OrderService gọi `processVouchersForOrder()` → **TĂNG used_count** ✅
3. Order được tạo với voucher đã xử lý ✅

## 🧪 **HƯỚNG DẪN TESTING**

### **1. Test API trực tiếp**
```bash
# Test voucher processing
curl -X POST http://localhost:8080/api/voucher/test-process \
  -H "Content-Type: application/json" \
  -d '{
    "voucherCodes": ["VOUCHER1", "VOUCHER2"],
    "orderValue": 500000
  }'

# Kiểm tra voucher usage
curl http://localhost:8080/api/voucher/check-usage/VOUCHER1
```

### **2. Test từ Frontend**
1. **Test từ Cart:**
   - Vào cart → Áp dụng voucher → **Kiểm tra `used_count` KHÔNG tăng**
   - Chuyển checkout → Đặt hàng → **Kiểm tra `used_count` TĂNG**

2. **Test từ Checkout:**
   - Vào checkout → Nhập voucher → Đặt hàng → **Kiểm tra `used_count` TĂNG**

### **3. Kiểm tra Database**
```sql
-- Xem trạng thái voucher trước và sau test
SELECT code, current_usage, max_usage FROM vouchers WHERE code = 'VOUCHER_CODE';
```

## 📊 **LOGGING CHI TIẾT**

### **CartController Logs:**
```
🛒 Applying vouchers to cart (NO USED_COUNT INCREASE): [VOUCHER1, VOUCHER2]
📝 Voucher added to cart: VOUCHER1 (current_usage: 0, max_usage: 10) - NO USED_COUNT INCREASE
🎉 Cart updated with 2 vouchers (used_count unchanged)
```

### **OrderService Logs:**
```
🛒 Vouchers from cart: 2 vouchers
🎯 Processing vouchers for order (WILL INCREASE USED_COUNT): [VOUCHER1, VOUCHER2]
✅ Vouchers processed and used_count increased: 2 vouchers
📝 Voucher applied to order: VOUCHER1 (used_count: 1, max_usage: 10)
```

### **VoucherService Logs:**
```
🔄 Starting voucher processing for order value: 500000.0
🔍 Processing voucher code: VOUCHER1
📋 Found voucher: VOUCHER1 (current_usage: 0, max_usage: 10)
✅ Voucher used_count increased for order: VOUCHER1 (0 -> 1)
```

## 🎯 **KẾT QUẢ MONG ĐỢI**

### **Trước khi sửa:**
- Cart: `used_count` = 0
- Checkout từ cart: `used_count` = 0 (KHÔNG TĂNG)
- Checkout trực tiếp: `used_count` = 1 (CÓ TĂNG)

### **Sau khi sửa:**
- **Cart**: `used_count` = 0 (KHÔNG TĂNG) ✅
- **Checkout từ cart**: `used_count` = 1 (TĂNG KHI ĐẶT HÀNG) ✅
- **Checkout trực tiếp**: `used_count` = 1 (TĂNG KHI ĐẶT HÀNG) ✅

## 🔧 **FILES ĐÃ SỬA**

1. **`CartController.java`** - KHÔNG tăng used_count khi áp dụng voucher vào cart
2. **`OrderService.java`** - LUÔN tăng used_count khi đặt hàng (từ cả request và cart)
3. **`VoucherService.java`** - LUÔN tăng used_count khi process voucher cho order
4. **`CheckoutPage.tsx`** - Đảm bảo gửi voucherCodes đúng cách
5. **`VoucherController.java`** - Thêm API test và kiểm tra
6. **`test_voucher_usage.sql`** - Script kiểm tra database

## ⚠️ **LƯU Ý QUAN TRỌNG**

1. **Logic mới**: `used_count` chỉ tăng khi đặt hàng, không tăng khi áp dụng vào cart
2. **Transaction Safety**: Tất cả thao tác tăng used_count đều trong transaction
3. **Logging**: Thêm logging chi tiết để debug
4. **Validation**: Kiểm tra voucher hợp lệ trước khi tăng used_count
5. **Consistency**: Đảm bảo used_count không vượt quá max_usage

## 🚀 **DEPLOYMENT**

1. Build và restart backend Spring Boot
2. Refresh frontend React
3. Test cả 2 luồng (cart và checkout trực tiếp)
4. Kiểm tra logs để đảm bảo hoạt động đúng

---

**Tác giả**: AI Assistant  
**Ngày**: $(date)  
**Phiên bản**: 3.0 - Logic mới: chỉ tăng used_count khi đặt hàng 