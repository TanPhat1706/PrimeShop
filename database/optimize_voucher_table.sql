-- =============================================
-- Tối ưu hóa bảng vouchers - Loại bỏ các cột không cần thiết
-- Cập nhật ngày: 2024-12-19
-- =============================================

-- Backup dữ liệu hiện tại (nếu cần)
-- SELECT * INTO vouchers_backup FROM vouchers;

-- Loại bỏ các cột không cần thiết (nếu tồn tại)
-- ALTER TABLE vouchers DROP COLUMN IF EXISTS max_discount_value;
-- ALTER TABLE vouchers DROP COLUMN IF EXISTS expiration_date;
-- ALTER TABLE vouchers DROP COLUMN IF EXISTS applicable_products;
-- ALTER TABLE vouchers DROP COLUMN IF EXISTS applicable_categories;

-- Cập nhật dữ liệu mẫu với cấu trúc hiện tại
DELETE FROM vouchers WHERE code IN ('WELCOME10', 'SAVE50K', 'NEWUSER20', 'FLASH25', 'FREESHIP', 'SAVE15', 'BIGSAVE', 'VIP30', 'SAVE75K', 'EASY5', 'EXPIRED10', 'USEDUP', 'INACTIVE');

-- Thêm voucher mới với cấu trúc hiện tại (sử dụng used_count thay vì current_usage)
INSERT INTO vouchers (code, discount_type, discount_value, min_order_value, start_date, end_date, max_usage, used_count, is_active)
VALUES 
    -- Voucher giảm 10% cho đơn hàng từ 500k
    ('WELCOME10', 'PERCENT', 10.0, 500000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1000, 0, 1),
    
    -- Voucher giảm 50k cho đơn hàng từ 300k
    ('SAVE50K', 'FIXED', 50000, 300000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 500, 0, 1),
    
    -- Voucher giảm 20% cho đơn hàng từ 1M
    ('NEWUSER20', 'PERCENT', 20.0, 1000000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 200, 0, 1),
    
    -- Voucher giảm 25% cho đơn hàng từ 200k (flash sale)
    ('FLASH25', 'PERCENT', 25.0, 200000, '2024-12-01 00:00:00', '2025-01-31 23:59:59', 100, 0, 1),
    
    -- Voucher giảm phí ship 30k cho đơn hàng từ 200k (giảm từ 500k)
    ('FREESHIP', 'FIXED', 30000, 200000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 1000, 0, 1),
    
    -- Voucher giảm 15% cho đơn hàng từ 800k
    ('SAVE15', 'PERCENT', 15.0, 800000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 300, 0, 1),
    
    -- Voucher giảm 100k cho đơn hàng từ 2M
    ('BIGSAVE', 'FIXED', 100000, 2000000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 50, 0, 1),
    
    -- Voucher giảm 30% cho đơn hàng từ 1.5M (VIP)
    ('VIP30', 'PERCENT', 30.0, 1500000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 100, 0, 1),
    
    -- Voucher giảm 75k cho đơn hàng từ 1M
    ('SAVE75K', 'FIXED', 75000, 1000000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 200, 0, 1),
    
    -- Voucher giảm 5% cho đơn hàng từ 200k (dễ sử dụng)
    ('EASY5', 'PERCENT', 5.0, 200000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 2000, 0, 1);

-- Thêm một số voucher đã hết hạn để test hiển thị
INSERT INTO vouchers (code, discount_type, discount_value, min_order_value, start_date, end_date, max_usage, used_count, is_active)
VALUES 
    ('EXPIRED10', 'PERCENT', 10.0, 300000, '2024-01-01 00:00:00', '2024-11-30 23:59:59', 100, 0, 1),
    ('USEDUP', 'FIXED', 25000, 400000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 10, 10, 1),
    ('INACTIVE', 'PERCENT', 15.0, 600000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 100, 0, 0);

PRINT 'Đã thêm 13 voucher mẫu thành công!';
PRINT 'Cấu trúc bảng hiện tại: id, code, discount_type, discount_value, min_order_value, start_date, end_date, max_usage, used_count, is_active';
PRINT '';
PRINT 'Các voucher có hiệu lực:';
PRINT 'WELCOME10 - Giảm 10% cho đơn từ 500k';
PRINT 'SAVE50K - Giảm 50k cho đơn từ 300k';
PRINT 'NEWUSER20 - Giảm 20% cho đơn từ 1M';
PRINT 'FLASH25 - Giảm 25% cho đơn từ 200k (flash sale)';
PRINT 'FREESHIP - Giảm phí ship 30k cho đơn từ 200k (giảm từ 500k)';
PRINT 'SAVE15 - Giảm 15% cho đơn từ 800k';
PRINT 'BIGSAVE - Giảm 100k cho đơn từ 2M';
PRINT 'VIP30 - Giảm 30% cho đơn từ 1.5M';
PRINT 'SAVE75K - Giảm 75k cho đơn từ 1M';
PRINT 'EASY5 - Giảm 5% cho đơn từ 200k'; 