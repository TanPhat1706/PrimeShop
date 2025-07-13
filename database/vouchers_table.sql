-- =============================================
-- Tạo bảng vouchers cho hệ thống thương mại điện tử
-- Hỗ trợ chức năng mã giảm giá
-- =============================================

-- Tạo bảng vouchers
CREATE TABLE vouchers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(10) NOT NULL,
    discount_value FLOAT NOT NULL,
    min_order_value FLOAT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    max_usage INT NOT NULL,
    used_count INT NOT NULL DEFAULT 0,
    is_active BIT NOT NULL DEFAULT 1,
    
    -- Ràng buộc CHECK cho discount_type
    CONSTRAINT CK_vouchers_discount_type 
        CHECK (discount_type IN ('PERCENT', 'FIXED')),
    
    -- Ràng buộc CHECK cho discount_value
    CONSTRAINT CK_vouchers_discount_value 
        CHECK (discount_value > 0),
    
    -- Ràng buộc CHECK cho max_usage
    CONSTRAINT CK_vouchers_max_usage 
        CHECK (max_usage >= 0),
    
    -- Ràng buộc CHECK cho used_count
    CONSTRAINT CK_vouchers_used_count 
        CHECK (used_count >= 0),
    
    -- Ràng buộc CHECK để đảm bảo used_count không vượt quá max_usage
    CONSTRAINT CK_vouchers_usage_limit 
        CHECK (used_count <= max_usage),
    
    -- Ràng buộc CHECK để đảm bảo end_date > start_date
    CONSTRAINT CK_vouchers_date_range 
        CHECK (end_date > start_date)
);

-- Tạo index cho code để tối ưu tìm kiếm
CREATE INDEX IX_vouchers_code ON vouchers(code);

-- Tạo index cho start_date và end_date để tối ưu tìm kiếm voucher theo thời gian
CREATE INDEX IX_vouchers_date_range ON vouchers(start_date, end_date);

-- Tạo index cho is_active để tối ưu lọc voucher đang hoạt động
CREATE INDEX IX_vouchers_is_active ON vouchers(is_active);

-- Thêm comment cho bảng
EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Bảng lưu trữ thông tin mã giảm giá (vouchers) cho hệ thống thương mại điện tử',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE', @level1name = N'vouchers';

-- Thêm comment cho các cột
EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Khóa chính, tự động tăng',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE', @level1name = N'vouchers',
    @level2type = N'COLUMN', @level2name = N'id';

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Mã giảm giá, duy nhất',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE', @level1name = N'vouchers',
    @level2type = N'COLUMN', @level2name = N'code';

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Loại giảm giá: PERCENT (phần trăm) hoặc FIXED (số tiền cố định)',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE', @level1name = N'vouchers',
    @level2type = N'COLUMN', @level2name = N'discount_type';

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Giá trị giảm (ví dụ: 10 cho 10% hoặc 50000 cho 50000 VNĐ)',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE', @level1name = N'vouchers',
    @level2type = N'COLUMN', @level2name = N'discount_value';

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Giá trị đơn hàng tối thiểu để áp dụng mã giảm giá',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE', @level1name = N'vouchers',
    @level2type = N'COLUMN', @level2name = N'min_order_value';

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Ngày bắt đầu có hiệu lực của mã giảm giá',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE', @level1name = N'vouchers',
    @level2type = N'COLUMN', @level2name = N'start_date';

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Ngày hết hiệu lực của mã giảm giá',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE', @level1name = N'vouchers',
    @level2type = N'COLUMN', @level2name = N'end_date';

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Số lượt sử dụng tối đa của mã giảm giá',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE', @level1name = N'vouchers',
    @level2type = N'COLUMN', @level2name = N'max_usage';

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Số lượt đã sử dụng của mã giảm giá, mặc định = 0',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE', @level1name = N'vouchers',
    @level2type = N'COLUMN', @level2name = N'used_count';

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Trạng thái hoạt động: 1 = đang hoạt động, 0 = không hoạt động',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE', @level1name = N'vouchers',
    @level2type = N'COLUMN', @level2name = N'is_active';

-- =============================================
-- Dữ liệu mẫu để test
-- =============================================

-- Thêm một số voucher mẫu
INSERT INTO vouchers (code, discount_type, discount_value, min_order_value, start_date, end_date, max_usage, used_count, is_active)
VALUES 
    ('WELCOME10', 'PERCENT', 10.0, 500000, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 1000, 0, 1),
    ('SAVE50K', 'FIXED', 50000, 300000, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 500, 0, 1),
    ('NEWUSER20', 'PERCENT', 20.0, 1000000, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 200, 0, 1),
    ('FLASH25', 'PERCENT', 25.0, 200000, '2024-06-01 00:00:00', '2024-06-30 23:59:59', 100, 0, 1),
    ('FREESHIP', 'FIXED', 30000, 500000, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 1000, 0, 1);

-- =============================================
-- Stored Procedure để tìm voucher hợp lệ
-- =============================================

CREATE PROCEDURE sp_GetValidVoucher
    @voucherCode VARCHAR(50),
    @orderValue FLOAT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        id,
        code,
        discount_type,
        discount_value,
        min_order_value,
        start_date,
        end_date,
        max_usage,
        used_count,
        is_active
    FROM vouchers 
    WHERE code = @voucherCode
        AND is_active = 1
        AND GETDATE() BETWEEN start_date AND end_date
        AND used_count < max_usage
        AND @orderValue >= min_order_value;
END;

-- =============================================
-- Stored Procedure để tăng số lượt sử dụng voucher
-- =============================================

CREATE PROCEDURE sp_UseVoucher
    @voucherId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        UPDATE vouchers 
        SET used_count = used_count + 1
        WHERE id = @voucherId
            AND is_active = 1
            AND GETDATE() BETWEEN start_date AND end_date
            AND used_count < max_usage;
            
        IF @@ROWCOUNT = 0
        BEGIN
            RAISERROR ('Voucher không hợp lệ hoặc đã hết lượt sử dụng', 16, 1);
        END
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;

PRINT 'Bảng vouchers đã được tạo thành công!';
PRINT 'Đã thêm 5 voucher mẫu để test.';
PRINT 'Đã tạo 2 stored procedures: sp_GetValidVoucher và sp_UseVoucher.'; 