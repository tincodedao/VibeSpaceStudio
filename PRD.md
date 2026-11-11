# VibeSpace — Product Requirement Document (PRD)

---

## 1. Giới thiệu tổng quan (Executive Summary)

### 1.1. Tầm nhìn sản phẩm (Product Vision)
**VibeSpace** là ứng dụng nền tảng web tạo không gian làm việc và học tập tập trung cá nhân hoá (Personalized Focus & Ambient Workspace). Người dùng có thể truy cập ngay lập tức chỉ với một cú click chuột mà **hoàn toàn không cần tạo tài khoản hay đăng nhập**. 

Ứng dụng kết hợp hài hòa giữa:
- **Thị giác (Visuals):** Kho hình nền/video động thiên nhiên êm dịu (rừng thông, biển đêm, núi tuyết...).
- **Thính giác (Auditory):** Trình phát nhạc Lofi YouTube tích hợp song song bộ mixer hòa âm tiếng ồn trắng (tiếng mưa, lửa trại, tiếng gió, sóng biển...).
- **Năng suất cá nhân (Productivity):** Đồng hồ Pomodoro nổi bật ở trung tâm hỗ trợ quản lý chu kỳ tập trung sâu và Todo List tự động làm mới mỗi ngày.

### 1.2. Mục tiêu cốt lõi (Core Value Propositions)
1. **Zero Friction (Không rào cản):** Mở web lên là dùng được ngay, không bắt đăng ký, không quảng cáo gián đoạn trải nghiệm, lưu cấu hình tại trình duyệt (Local-first).
2. **Immersive & Aesthetic (Thẩm mỹ & Đắm chìm):** Thiết kế tối giản, phong cách Glassmorphism / Frosted Glass hiện đại, có chế độ Zen Mode ẩn mọi thứ chỉ giữ lại đồng hồ và âm thanh.
3. **Deep Focus Synergy (Cộng hưởng tập trung):** Tích hợp công cụ quản trị thời gian (Pomodoro + Todo) trực tiếp với không gian âm thanh - hình ảnh thư giãn.

---

## 2. Đối tượng người dùng & Chân dung khách hàng (Target Personas)

| Persona | Đặc điểm | Nhu cầu chính |
| :--- | :--- | :--- |
| **Sinh viên / Học sinh (The Learner)** | Học bài, ôn thi nhiều giờ liền, dễ mất tập trung bởi mạng xã hội. | Cần không gian yên tĩnh, nhạc lofi không lời, chia nhỏ thời gian ôn tập bằng Pomodoro. |
| **Lập trình viên / Kỹ sư (The Developer)** | Làm việc với code cần trạng thái "Flow State" kéo dài. | Cần tiếng ồn trắng che lấp tiếng ồn văn phòng, todo list nhanh trong ngày để track task mà không cồng kềnh như Jira/Trello. |
| **Nhà văn / Người sáng tạo nội dung (The Creator)** | Tìm kiếm cảm hứng và tâm trạng thoải mái. | Cần đổi bối cảnh linh hoạt (quán cà phê mưa, rừng đêm), tùy biến âm thanh theo tâm trạng. |

---

## 3. Nguyên tắc thiết kế sản phẩm (Product Principles)
- **Local-First & Privacy-Focused:** Toàn bộ dữ liệu (Todo, cài đặt âm lượng, danh sách bài hát, tùy chọn hình nền) được lưu trữ 100% trong `localStorage` / `IndexedDB` của trình duyệt. Không thu thập thông tin cá nhân.
- **Audio Harmony:** Đảm bảo nhạc Lofi và âm thanh White Noise phát song song mượt mà, không giật lag, cho phép điều chỉnh âm lượng riêng biệt từng track và Master Volume.
- **Minimalist by Default, Powerful on Demand:** Mặc định giao diện chỉ hiển thị đồng hồ Pomodoro và thanh điều khiển mờ tinh tế. Các bảng điều khiển phụ (Mixer, Todo, Background Picker) có thể thu gọn hoặc mở dạng drawer/popup.

---

## 4. Đặc tả chi tiết các tính năng (Functional Requirements)

### 4.1. FR-01: Đồng hồ Pomodoro trung tâm (Centerpiece Pomodoro Timer)
- **Vị trí:** Chính giữa màn hình, kích thước lớn, kiểu chữ hiển thị số rõ ràng, tối giản, sang trọng.
- **Chế độ thời gian:**
  - `Focus` (Tập trung): Mặc định 25 phút.
  - `Short Break` (Nghỉ ngắn): Mặc định 5 phút.
  - `Long Break` (Nghỉ dài): Mặc định 15 phút.
- **Cấu hình tùy chỉnh (Settings):** Cho phép người dùng chỉnh số phút cho từng phiên (ví dụ 50/10 hoặc tùy chỉnh tự do).
- **Trạng thái & Điều khiển:**
  - Nút Play / Pause / Reset / Skip sang phiên tiếp theo.
  - Hiển thị tiến độ trực quan (Circular Progress Ring hoặc thanh bar tinh tế).
  - Đếm số chu kỳ đã hoàn thành trong ngày (ví dụ: Session 2/4).
- **Âm thanh thông báo (Sound Chime):** Chuông âm thanh êm dịu (như chuông thiền tiếng chuông bát tây tạng hoặc chime nhẹ) khi kết thúc mỗi phiên (có toggle bật/tắt).
- **Title Bar Sync:** Cập nhật thời gian đếm ngược lên Tab Title trình duyệt (ví dụ: `(24:50) Focus - VibeSpace`).

### 4.2. FR-02: Trình phát nhạc Lofi YouTube (YouTube Lofi Player)
- **Cơ chế phát:** Nhúng YouTube IFrame Player API.
- **Bài hát mặc định:** Hệ thống tự động chọn sẵn 1 livestream hoặc playlist Lofi Hip Hop chất lượng cao (ví dụ: Lofi Girl hoặc tương đương).
- **Nguồn phát nhạc tùy biến (Custom Source):**
  - **Dán Link YouTube:** Ô input cho phép paste bất kỳ link video/livestream YouTube nào. Hệ thống tự động bóc tách Video ID và chuyển bài mượt mà.
  - **Tìm kiếm nhanh (Search):** Thanh tìm kiếm tích hợp với các gợi ý sẵn (Lofi Chill, Rain Beats, Synthwave, Jazz Coffee, Piano Chill...) hoặc tìm theo từ khóa của user.
- **Bảng điều khiển âm thanh (Audio Controls):**
  - Nút Play / Pause.
  - Next / Previous bài (nếu là playlist).
  - Thanh trượt âm lượng (Volume Slider 0% - 100%) và nút Quick Mute.
  - Hiển thị tên bài hát và thumbnail thu nhỏ tinh tế (góc dưới màn hình).

### 4.3. FR-03: Bộ phối âm tiếng ồn trắng (Ambient Sound Mixer)
- **Cơ chế âm thanh:** Web Audio API / HTML5 Audio phát các audio loop chất lượng cao.
- **Danh mục âm thanh phong phú:**
  1. *Tiếng mưa rơi (Rain / Heavy Rain)*
  2. *Lửa trại bập bùng (Campfire)*
  3. *Gió thổi qua rặng thông (Wind / Pine Forest)*
  4. *Sóng biển vỗ bờ (Ocean Waves)*
  5. *Quán cà phê đông đúc (Coffee Shop / Murmur)*
  6. *Sấm sét trầm ấm (Distant Thunder)*
  7. *Tiếng gõ bàn phím cơ (Mechanical Keyboard)*
  8. *Tiếng chim hót trong rừng (Forest Birds)*
  9. *Tiếng suối chảy róc rách (Stream)*
  10. *Tiếng ồn trắng / ồn hồng (White/Pink Noise)*
- **Tương tác điều khiển:**
  - Mỗi loại âm thanh có icon đại diện, nút Bật/Tắt (Toggle) và thanh trượt Volume độc lập.
  - Nút **Master Mute** tắt toàn bộ âm thanh môi trường ngay lập tức.
  - **Sound Presets (Combo gợi ý sẵn):** Cho phép chọn 1 click các combo phối sẵn như:
    - *Đêm mưa trên núi:* Mưa rào + Sấm xa + Lửa trại.
    - *Làm việc ven biển:* Sóng biển + Gió nhẹ + Nhạc Jazz.
    - *Quán quen chiều thu:* Tiếng cafe + Mưa nhẹ + Phím gõ.
  - Cho phép lưu Preset cá nhân của user vào LocalStorage.

### 4.4. FR-04: Bộ sưu tập hình nền thư giãn (Dynamic Relaxing Backgrounds)
- **Kho hình nền tích hợp (Curated Library):**
  - Danh mục: Rừng thông mờ sương, Đại dương sâu thẳm, Hoàng hôn bãi biển, Đỉnh núi tuyết, Góc phòng ấm cúng ngắm mưa, Bầu trời đầy sao (Galaxy), Thành phố ban đêm (Cyberpunk/Aesthetic).
  - Định dạng: Hình ảnh phân giải cao (High-res WebP) kèm video loop ngắn siêu nhẹ hoặc CSS Ambient gradient chuyển động.
- **Tùy chỉnh thị giác (Visual Customization):**
  - **Overlay Dimmer (Độ tối):** Slider điều chỉnh độ tối màn hình (0% - 80%) để bảo đảm văn bản, Pomodoro và Todo luôn tương phản tốt, không gây mỏi mắt.
  - **Background Blur (Làm mờ):** Tùy chọn làm mờ nhẹ background để tập trung hoàn toàn vào nội dung.
- **Bộ chọn hình nền (Wallpaper Picker Modal):** Lưới thumbnail xem trước trực quan, hỗ trợ chọn nhanh hoặc chế độ "Shuffle Background" mỗi giờ.

### 4.5. FR-05: Danh sách công việc theo ngày (Daily Reset Todo List)
- **Quản lý công việc hàng ngày:**
  - Thêm mới công việc (nhập text, Enter để thêm).
  - Đánh dấu hoàn thành (checkbox) kèm hiệu ứng gạch ngang nhẹ nhàng.
  - Xóa hoặc chỉnh sửa công việc.
  - Reorder (Kéo thả sắp xếp thứ tự ưu tiên).
- **Cơ chế Tự động Reset theo ngày (Daily Auto-Reset):**
  - Hệ thống ghi nhận ngày hiện tại theo chuẩn YYYY-MM-DD.
  - Khi người dùng mở app vào một ngày mới:
    - Hệ thống tự động lưu trữ (archive) hoặc xóa các task đã hoàn thành của hôm trước.
    - Cung cấp tùy chọn cấu hình: **"Keep uncompleted tasks"** (giữ lại task chưa xong sang ngày mới) hoặc **"Fresh start"** (xóa sạch làm mới).
  - Hỗ trợ **"Daily Recurring Tasks"** (Công việc lặp lại hàng ngày): Người dùng có thể gắn cờ `Daily Routine` (ví dụ: Uống 2L nước, Đọc sách 30p, Review code) để ngày nào reset xong cũng tự động tạo sẵn các task này.
- **Tiến độ trực quan:** Hiển thị tỉ lệ phần trăm công việc đã hoàn thành trong ngày (ví dụ: 3/5 Tasks Completed - 60%).

### 4.6. FR-06: Chế độ Zen Mode & Toàn màn hình (Zen / Fullscreen Mode)
- **Zen Mode (Phím tắt `Z`):** Ẩn toàn bộ thanh công cụ, chỉ để lại hình nền, đồng hồ đếm giờ và âm thanh đang phát. Di chuột vào màn hình sẽ làm hiện nhẹ các nút điều khiển.
- **Fullscreen Mode (Phím tắt `F`):** Chuyển chế độ toàn màn hình không viền của trình duyệt để tạo trải nghiệm như một ứng dụng Native trên Desktop.

---

## 5. Yêu cầu phi chức năng (Non-Functional Requirements)

| Tiêu chí | Yêu cầu kỹ thuật |
| :--- | :--- |
| **Hiệu năng (Performance)** | - Thời gian First Contentful Paint (FCP) < 1.2s.<br>- Tiêu thụ RAM thấp (< 150MB) để user có thể treo nền làm việc cả ngày không đơ máy. |
| **Lưu trữ (Local Storage)** | Dữ liệu Todo, settings, volume được sync liên tục vào `localStorage`. Dung lượng lưu trữ < 2MB, không gây tràn bộ nhớ. |
| **Bảo mật & Quyền riêng tư** | 100% Client-side. Không gửi bất kỳ dữ liệu cá nhân hay danh sách việc cần làm lên server ngoài. |
| **Tương thích trình duyệt** | Hoạt động trơn tru trên tất cả trình duyệt hiện đại: Chrome, Edge, Safari, Firefox, Arc, Brave. |
| **Khả năng đáp ứng (Responsive)** | Tối ưu tốt nhất cho Desktop & Laptop (1920x1080, 1440x900, 1366x768). Hỗ trợ responsive cơ bản trên Tablet. |

---

## 6. Tiêu chí nghiệm thu (Acceptance Criteria - UAT Checklist)
- [ ] User vào trang web lần đầu không thấy màn hình đăng nhập, nhạc Lofi bắt đầu sẵn sàng phát khi user bấm Play.
- [ ] Paste bất kỳ link YouTube nào vào cũng phát được âm thanh mượt mà.
- [ ] Có thể bật cùng lúc tiếng mưa, tiếng sấm và tiếng lửa trại với các mức volume khác nhau mà không bị rè âm thanh.
- [ ] Thay đổi hình nền ngay lập tức đổi background của toàn trang kèm hiệu ứng chuyển cảnh mượt.
- [ ] Đồng hồ Pomodoro chuyển đổi chính xác giữa Focus - Short Break - Long Break, có tiếng chuông kết thúc.
- [ ] Tạo 3 task trong Todo List, reload trang vẫn giữ nguyên. Đổi ngày trên máy tính, hệ thống tự động reset theo đúng cơ chế đã cài đặt.
- [ ] Bật Zen mode thì các nút điều khiển ẩn đi, chỉ còn đồng hồ và background.

