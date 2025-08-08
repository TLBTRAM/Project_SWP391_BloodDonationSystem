# Hướng dẫn cấu hình Google OAuth

## ⚠️ LỖI HIỆN TẠI: "The OAuth client was not found"

Lỗi này xảy ra vì chưa cấu hình Google OAuth Client ID đúng cách. Hãy làm theo các bước sau:

## Bước 1: Tạo Google OAuth Client ID

1. **Truy cập Google Cloud Console:**
   - Mở [Google Cloud Console](https://console.cloud.google.com/)
   - Đăng nhập bằng tài khoản Google của bạn

2. **Tạo hoặc chọn Project:**
   - Tạo project mới hoặc chọn project có sẵn
   - Đảm bảo project đã được chọn

3. **Bật Google+ API:**
   - Vào **APIs & Services** > **Library**
   - Tìm "Google+ API" hoặc "Google Identity"
   - Click **Enable**

4. **Tạo OAuth Client ID:**
   - Vào **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - Chọn **Web application**
   - Đặt tên cho OAuth client (ví dụ: "Blood Donation System")

5. **Cấu hình Authorized Origins:**
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     http://localhost:3001
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:3000
     http://localhost:3000/
     ```

6. **Tạo và copy Client ID:**
   - Click **Create**
   - Copy **Client ID** được tạo ra (có dạng: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

## Bước 2: Cập nhật Client ID trong ứng dụng

### Cách 1: Sử dụng Environment Variable (Khuyến nghị)

1. **Tạo file `.env` trong thư mục `blooddonationsystem_frontend`:**
   ```bash
   # Tạo file .env
   touch .env
   ```

2. **Thêm Client ID vào file `.env`:**
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your_actual_client_id_here
   ```

3. **Cập nhật `App.tsx`:**
   ```typescript
   const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
   ```

### Cách 2: Cập nhật trực tiếp trong code

1. **Mở file `src/App.tsx`**
2. **Thay thế dòng 29:**
   ```typescript
   const GOOGLE_CLIENT_ID = "your_actual_client_id_here";
   ```

## Bước 3: Restart ứng dụng

```bash
# Dừng server hiện tại (Ctrl+C)
# Chạy lại
npm start
```

## Bước 4: Test

1. Vào trang đăng nhập: `http://localhost:3000/login`
2. Click nút "Đăng nhập bằng Google"
3. Chọn tài khoản Google
4. Xác nhận quyền truy cập

## Troubleshooting

### Lỗi "The OAuth client was not found"
- ✅ Kiểm tra Client ID có đúng không
- ✅ Đảm bảo đã bật Google+ API
- ✅ Kiểm tra Authorized origins có `http://localhost:3000` không

### Lỗi "Redirect URI mismatch"
- ✅ Thêm `http://localhost:3000` vào Authorized redirect URIs
- ✅ Đảm bảo protocol (http) và port (3000) đúng

### Lỗi CORS
- ✅ Backend đã được cấu hình CORS
- ✅ Kiểm tra backend có chạy trên port 8080 không

## Lưu ý quan trọng

- **Bảo mật**: Không commit Client ID vào Git repository
- **Production**: Cập nhật Authorized origins cho domain production
- **Environment Variables**: Sử dụng `.env` file để quản lý Client ID

## Ví dụ Client ID hợp lệ

```
123456789-abcdefghijklmnop.apps.googleusercontent.com
```

**Lưu ý**: Client ID phải có đuôi `.apps.googleusercontent.com`
