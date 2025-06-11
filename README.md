# VDT 2025 CV Management (VTIT)

## Tác giả
Nguyễn Thị Thanh Lam - Lĩnh vực Software Engineering

## Mục lục
- [Giới thiệu](#giới-thiệu)
- [Chức năng chính](#chức-năng-chính)
- [Cài đặt](#cài-đặt)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Liên kết](#liên-kết)

## Giới thiệu
VDT 2025 CV Management là một dự án thuộc Giai đoạn 1 của Chương trình Thực tập sinh tài năng Viettel Digital Talent 2025, lĩnh vực Software Engineering. Ứng dụng website Quản lý CV ra đời với mục tiêu giúp tổ chức quản lý các thông tin của nhân viên các phòng ban, bao gồm thông tin cá nhân, thông tin đào tạo, thông tin khoá học, kỹ năng, v.v. của nhân viên. Hệ thống được xây dựng bằng **ReactJS** cho frontend, **FastAPI** cho backend và **PostgreSQL** cho lưu trữ dữ liệu, cung cấp các chức năng lưu trữ, cập nhật và trích xuất thông tin liên quan tới CV của nhân viên.

## Chức năng chính
- Phân quyền theo 4 roles: Admin, Project Manager (PM), BUL/Lead, Staff (nhân viên).
- Tạo CV mới (Đối với Admin và tất cả người dùng).
- Cập nhật và Xoá CV (Đối với Admin và CV của nhân viên đó).
- Tìm kiếm nhân viên và xem CV từng nhân viên (Admin có thể xem của nhân viên toàn hệ thống, BUL/Lead có thể xem của nhân viên trong bộ phận, PM có thể xem của nhân viên trong dự án, nhân viên có thể xem của bản thân).
- Lọc xem theo từng bộ phận (Đối với Admin) và theo từng dự án (Đối với PM).
- Admin, PM và BUL/Lead có thể gửi yêu/huỷ yêu cầu cập nhật CV tới nhân viên dưới cấp tương ứng của CV đang xem (Admin có thể gửi/huỷ yêu cầu dành cho PM và BUL/Lead).
- Nhân viên dưới cấp nhận thông báo về yêu cầu cập nhật CV, có thể đánh dấu đã đọc/chưa đọc để tiện quản lý thông báo.
- Xuất CV thành dạng PDF.
- Lọc những nhân viên chưa có CV và thống kê số lượng để dễ kiểm soát.
- Đảm bảo an toàn khi xác thực người dùng và quyền truy cập.
- Giao diện thân thiện, dễ sử dụng.

## Cài đặt
### Yêu cầu hệ thống
- Node.js (Phiên bản 14 trở lên).
- React (Phiên bản 17 trở lên).
- Python (Phiên bản 10 trở lên).
- Postgres 16.

### Cài đặt dự án từ GitHub
1. **Clone dự án về local:**
   ```bash
   git clone https://github.com/tlam25/VDT25-cv-management.git
   cd VDT25-cv-management
   ```
2. **Cài đặt các dependencies:**
- Database: Tạo database mới có tên vtit-cv-mana và import data từ folder 'database'
- Frontend:
   ```bash
   cd frontend/cv-management-web
   npm install
   ```
- Backend:
   ```bash
   cd backend
   python -m venv cv-mana
   source cv-mana/bin/activate      # On Windows: cv-mana\Scripts\activate
   pip install -r requirements.txt
   ```
4. **Chạy ứng dụng trong terminal:**
- Frontend:
   ```bash
   cd frontend/cv-management-web
   npm start
   ```
- Backend:
    ```bash
   cd backend
   pttk\Scripts\activate
   uvicorn app.main:app --reload
   ```
- Ứng dụng chạy trên http://localhost:3000 (Giao diện frontend) và http://localhost:8000/docs (Giao diện backend - Swagger UI).

## Cấu trúc dự án

  ```csharp
     VDT25-cv-management/
    │
    ├── README.md
    │
    ├── backend/
    │   ├── .gitignore
    │   ├── README.md
    │   ├── requirements.txt
    │   └── app/
    │       ├── main.py
    │       ├── core/
    │       ├── models/
    │       ├── routers/
    │
    ├── database/
    │   ├── vtit-cv-management-db.sql
    │
    └── frontend/
        └── cv-management-web/
            ├── .gitignore
            ├── package.json
            ├── package-lock.json
            ├── public/
            ├── src/
                ├── assets/
                ├── components/
                ├── layouts/
                ├── pages/
                ├── routes/
                ├── utils/
                ├── App.js
                ├── App.css
                ├── ...
  ```

## Liên kết
GitHub: https://github.com/tlam25/VDT25-cv-management