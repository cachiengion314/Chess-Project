# Chess-Club project
- Ý tưởng:
    + Tên đề tài: Chess-Club
    + Đối tượng: 11-60 (tuổi)
    + Chức năng: 
        # Đăng ký, Đăng nhập
        # Chơi cờ với đối thủ trên mạng hoặc bạn bè trên một máy
        # Bảng xếp hạng
        # Chat với đối thủ
- Phân tích
    + Mặt dữ liệu (thực thể):
        User status: name, email, password, win/lose rating, elo points
        Gameplay: game match rules, chess game logic, chess game image
        Waiting table: create waiting table, modified waiting table status, see all waiting tables
        Chat: text content

    Chức năng: xác định chức năng đấy tương tác với người dùng như thế nào
        # Phân tích chức năng đăng ký:
            1. Bấm vào link đăng ký ==> hiển thị form đăng ký
            2. Người dùng nhập vào: name, email, password, password comfirm
            3. Bấm nút Resignter
                # Nếu nhập vao đủ thông tin thì => kiểm tra có email nào bị trùng không?
                    => lưu người dùng
                # Nếu không nhập đủ thông tin thì in ra thông báo lỗi.
                # Nếu password != password comfirm => in ra thông báo lỗi.
        # Phân tích chức năng chơi cờ vói đối thủ
            1. Người dùng bấm vào nút "tạo bàn" để khởi tạo một bàn đấu
            2. Hoặc người dùng có thể truy cập luôn vào một bàn đấu được tạo bởi người chơi khác.
            3. Tại bàn, nếu cả hai cùng nhấn nút "sẵn sàng" thì ván đấu sẽ bắt đầu luôn.
            4. Mỗi bên có 30 giây cho mỗi nước đi.
        # Phân tích chức năng bảng xếp hạng
            1. Người chơi nhấn vào nút "bảng xếp hạng" để xem ai là người chơi giỏi nhất
            2. Bảng xếp hạng người chơi dựa trên điểm elo của từng tài khoản
        # Phân tích chức năng Chat
            1. Người chơi nhấn vào nút "chat" để bật khung chat
            2. Mỗi lần gõ xong nội dung và ấn gửi thì nội dung đó sẽ được gửi cho người kia

- Thiết kế: 
    + Thiết kế cho chức năng đăng ký:
        Thiết kế giao diện
        Thiết kế thuật toán
    + Thiết kế cho chức năng chơi cờ với đối thủ:
        Thiết kế giao diện
        Thiết kế thuật toán
    + Thiết kế cho chức năng bảng xếp hạng:
        Thiết kế giao diện
        Thiết kế thuật toán
    + Thiết kế cho chức năng bảng chat:
        Thiết kế giao diện
        Thiết kế thuật toán
- Cài đặt

- Kiểm thử

- Triển khai