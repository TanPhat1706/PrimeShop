-- =============================================
-- Cập nhật voucher FREESHIP với điều kiện đơn hàng tối thiểu thấp hơn
-- Cập nhật ngày: 2024-12-19
-- =============================================

-- Cập nhật voucher FREESHIP: giảm min_order_value từ 500k xuống 200k
UPDATE vouchers 
SET min_order_value = 200000
WHERE code = 'FREESHIP';

-- Kiểm tra kết quả
SELECT 
    code,
    discount_type,
    discount_value,
    min_order_value,
    is_active,
    start_date,
    end_date
FROM vouchers 
WHERE code = 'FREESHIP';

PRINT 'Đã cập nhật voucher FREESHIP:';
PRINT '- Mã: FREESHIP';
PRINT '- Loại: FIXED';
PRINT '- Giá trị giảm: 30,000 VNĐ';
PRINT '- Đơn hàng tối thiểu: 200,000 VNĐ (giảm từ 500,000 VNĐ)';
PRINT '- Hiệu lực: 2024-01-01 đến 2025-12-31';
PRINT '';
PRINT 'Bây giờ voucher FREESHIP sẽ áp dụng cho đơn hàng từ 200k trở lên!'; 