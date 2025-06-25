# Blood Donation Appointment System

## Tổng quan
Hệ thống cho phép donor đặt lịch hẹn hiến máu với medical staff. Hệ thống bao gồm các tính năng:
- Donor đặt appointment
- Donor xem và hủy appointments của mình
- Medical staff xem và hoàn thành appointments
- Kiểm tra điều kiện hiến máu (56 ngày giữa các lần hiến)

## API Endpoints

### 1. Đặt Appointment (Donor)
**POST** `/api/appointment/`
```json
{
    "slotId": 1,
    "medicalStaffId": 2,
    "appointmentDate": "2024-01-15",
    "serviceId": [1, 2, 3]
}
```

### 2. Xem Appointments của Donor
**GET** `/api/appointment/my-appointments`

### 3. Xem Appointments của Medical Staff
**GET** `/api/appointment/staff-appointments`

### 4. Hủy Appointment (Donor)
**PUT** `/api/appointment/{id}/cancel`

### 5. Hoàn thành Appointment (Medical Staff)
**PUT** `/api/appointment/{id}/complete`

### 6. Xem chi tiết Appointment
**GET** `/api/appointment/{id}`

## Quy trình hoạt động

### 1. Donor đặt appointment:
1. Donor đăng nhập vào hệ thống
2. Chọn medical staff và slot thời gian
3. Chọn các dịch vụ cần thiết
4. Hệ thống kiểm tra:
   - Donor có đủ điều kiện hiến máu không (56 ngày từ lần hiến cuối)
   - Slot có available cho medical staff không
5. Tạo appointment với status PENDING

### 2. Medical staff xử lý appointment:
1. Medical staff đăng nhập và xem danh sách appointments
2. Khi donor đến hiến máu, medical staff cập nhật status thành COMPLETED
3. Hệ thống tự động cập nhật ngày hiến máu cuối của donor

### 3. Donor quản lý appointments:
1. Xem danh sách appointments của mình
2. Hủy appointment nếu cần (chỉ khi status là PENDING)
3. Khi hủy, slot sẽ được giải phóng

## Các trạng thái Appointment
- **PENDING**: Đang chờ xử lý
- **COMPLETED**: Đã hoàn thành
- **CANCEL**: Đã hủy

## Lưu ý bảo mật
- Chỉ donor mới có thể đặt và hủy appointments của mình
- Chỉ medical staff được assign mới có thể hoàn thành appointment
- Tất cả API đều yêu cầu authentication 