-- =============================================
-- Script test voucher usage cho PrimeShop
-- =============================================

-- 1. Kiểm tra voucher hiện tại
SELECT 
    id,
    code,
    discount_type,
    discount_value,
    min_order_value,
    current_usage,
    max_usage,
    is_active,
    start_date,
    end_date,
    created_at,
    updated_at
FROM vouchers 
WHERE code = 'FREESHIP';

-- 2. Kiểm tra tất cả voucher
SELECT 
    code,
    discount_type,
    discount_value,
    current_usage,
    max_usage,
    is_active,
    CASE 
        WHEN GETDATE() BETWEEN start_date AND end_date THEN 'VALID'
        WHEN GETDATE() < start_date THEN 'NOT_STARTED'
        WHEN GETDATE() > end_date THEN 'EXPIRED'
        ELSE 'UNKNOWN'
    END as date_status
FROM vouchers 
ORDER BY code;

-- 3. Kiểm tra voucher có thể sử dụng
SELECT 
    code,
    discount_type,
    discount_value,
    current_usage,
    max_usage,
    (max_usage - current_usage) as remaining_usage
FROM vouchers 
WHERE is_active = 1
    AND GETDATE() BETWEEN start_date AND end_date
    AND (max_usage IS NULL OR current_usage < max_usage)
ORDER BY code;

-- 4. Test tăng usage count (chạy cẩn thận!)
-- UPDATE vouchers 
-- SET current_usage = current_usage + 1
-- WHERE code = 'FREESHIP';

-- 5. Reset voucher để test (chạy cẩn thận!)
-- UPDATE vouchers 
-- SET current_usage = 0
-- WHERE code = 'FREESHIP';

-- 6. Kiểm tra orders có voucher
SELECT 
    o.id as order_id,
    o.full_name,
    o.total_amount,
    o.discount_amount,
    o.final_amount,
    o.created_at,
    v.code as voucher_code
FROM orders o
LEFT JOIN order_voucher ov ON o.id = ov.order_id
LEFT JOIN vouchers v ON ov.voucher_id = v.id
ORDER BY o.created_at DESC;

-- 7. Thống kê voucher usage
SELECT 
    v.code,
    v.discount_type,
    v.discount_value,
    v.current_usage,
    v.max_usage,
    CASE 
        WHEN v.max_usage IS NULL THEN NULL
        ELSE CAST((v.current_usage * 100.0 / v.max_usage) AS DECIMAL(5,2))
    END as usage_percentage
FROM vouchers v
WHERE v.is_active = 1
ORDER BY usage_percentage DESC; 