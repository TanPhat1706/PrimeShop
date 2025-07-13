-- Script kiểm tra voucher usage
-- Chạy script này để xem trạng thái voucher trước và sau khi test

-- 1. Xem tất cả voucher và trạng thái hiện tại
SELECT 
    id,
    code,
    discount_type,
    discount_value,
    min_order_value,
    current_usage,
    max_usage,
    (max_usage - current_usage) as remaining_usage,
    is_active,
    start_date,
    end_date,
    created_at,
    updated_at
FROM vouchers 
ORDER BY code;

-- 2. Xem voucher cụ thể (thay 'VOUCHER_CODE' bằng mã voucher cần kiểm tra)
SELECT 
    id,
    code,
    discount_type,
    discount_value,
    min_order_value,
    current_usage,
    max_usage,
    (max_usage - current_usage) as remaining_usage,
    is_active,
    start_date,
    end_date,
    created_at,
    updated_at
FROM vouchers 
WHERE code = 'VOUCHER_CODE';

-- 3. Xem lịch sử sử dụng voucher (nếu có bảng order_voucher)
SELECT 
    o.id as order_id,
    o.created_at as order_date,
    o.total_amount,
    o.discount_amount,
    o.final_amount,
    v.code as voucher_code,
    v.current_usage,
    v.max_usage
FROM orders o
LEFT JOIN order_voucher ov ON o.id = ov.order_id
LEFT JOIN vouchers v ON ov.voucher_id = v.id
WHERE v.code IS NOT NULL
ORDER BY o.created_at DESC;

-- 4. Reset voucher usage về 0 (chỉ dùng cho testing)
-- UPDATE vouchers SET current_usage = 0 WHERE code = 'VOUCHER_CODE';

-- 5. Xem voucher đã hết lượt sử dụng
SELECT 
    code,
    current_usage,
    max_usage,
    (max_usage - current_usage) as remaining_usage
FROM vouchers 
WHERE current_usage >= max_usage;

-- 6. Xem voucher còn lượt sử dụng
SELECT 
    code,
    current_usage,
    max_usage,
    (max_usage - current_usage) as remaining_usage
FROM vouchers 
WHERE current_usage < max_usage AND is_active = true; 