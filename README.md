# Regis GPT Free

> Desktop automation tool hỗ trợ quản lý, tạo và xác minh tài khoản ChatGPT với giao diện Electron, quản lý Hotmail/Gmail, SMS OTP, proxy pool và trạng thái chạy tập trung theo workspace.

![Electron](https://img.shields.io/badge/Electron-Desktop-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-Automation-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

## Giới thiệu

**Regis GPT Free** là ứng dụng desktop được xây dựng bằng Electron để hỗ trợ vận hành workflow tạo, quản lý và xác minh tài khoản ChatGPT. Ứng dụng tập trung vào việc gom các thao tác thường gặp vào một giao diện duy nhất: quản lý danh sách tài khoản, Hotmail OAuth2/TOTP, SMSPool, proxy pool, lịch sử chạy, log runtime và cấu hình workspace.

Dự án phù hợp cho nhu cầu vận hành nội bộ, kiểm thử tự động hóa và quản lý dữ liệu tài khoản theo file workspace cục bộ.

## Tính năng chính

- Giao diện desktop trực quan bằng Electron.
- Quản lý workspace riêng cho từng bộ dữ liệu.
- Quản lý file `accounts.txt`, `accounts-hotmail.txt`, `sms_state.json`, `proxy_pools.json`, `config.json` trong workspace.
- Hỗ trợ Hotmail OAuth2/TOTP với các trạng thái `mail_ready`, `pending`, `verify`, `error`.
- Hỗ trợ SMSPool cho bước OTP phone.
- Hỗ trợ proxy pool, Round Robin proxy và kiểm tra proxy runtime.
- Hỗ trợ provider verify qua 9Router hoặc CLIProxyAPI.
- Log runtime rõ ràng, có khu vực log proxy riêng.
- Có cơ chế refresh dữ liệu khi trạng thái tài khoản thay đổi.
- Có kiểm tra preflight trước khi chạy để giảm lỗi cấu hình.

## Yêu cầu môi trường

Trước khi chạy dự án, hãy cài:

- Node.js phiên bản 18 trở lên.
- npm đi kèm Node.js.
- Git nếu muốn clone/push source.
- Windows được khuyến nghị vì nhiều đường dẫn mặc định và bundled browser hiện dùng cho môi trường Windows.

Kiểm tra phiên bản:

```bash
node -v
npm -v
git --version
```

## Cài đặt lần đầu

Clone repo:

```bash
git clone https://github.com/TINVO04/Regis_GPT_free.git
cd Regis_GPT_free
```

Cài dependency:

```bash
npm install
```

Chạy ứng dụng:

```bash
npx electron .
```

> Lần chạy đầu có thể hơi lâu do Electron/Playwright cần khởi tạo môi trường và kiểm tra runtime. Những lần chạy sau sẽ nhanh hơn.

## Cách chạy hằng ngày

Mở CMD/Terminal ngay trong thư mục dự án rồi chạy:

```bash
npx electron .
```

Nếu dùng VS Code:

1. Mở thư mục dự án bằng VS Code.
2. Mở Terminal tích hợp.
3. Chạy `npx electron .`.
4. Đợi app desktop mở lên.

## Thiết lập workspace đúng cách

Workspace là nơi ứng dụng lưu dữ liệu vận hành. Đây là phần rất quan trọng vì nếu chọn sai workspace, dữ liệu sẽ lưu nhầm chỗ hoặc app không đọc đúng file.

### Workspace sẽ chứa các file nào?

Ứng dụng sẽ đọc/ghi các file sau trong workspace đang chọn:

| File | Chức năng |
| --- | --- |
| `config.json` | Lưu cấu hình API key, provider, proxy, domain, runtime option |
| `accounts.txt` | Danh sách tài khoản ChatGPT thường |
| `accounts-hotmail.txt` | Danh sách Hotmail/Gmail theo trạng thái |
| `sms_state.json` | Trạng thái số SMS đã thuê / usage count |
| `proxy_pools.json` | Danh sách proxy pool |
| `log-*.txt` | Log chạy theo ngày |

### Cách chọn workspace

1. Mở app bằng `npx electron .`.
2. Tìm khu vực **Workspace** trên giao diện.
3. Bấm nút chọn workspace nếu muốn đổi nơi lưu dữ liệu.
4. Chọn đúng thư mục bạn muốn dùng để lưu `accounts.txt`, `accounts-hotmail.txt`, `config.json`, `sms_state.json`.
5. Sau khi chọn, kiểm tra dòng hiển thị workspace path trên UI.
6. Bấm **Refresh** để app đọc lại dữ liệu.
7. Bấm **Lưu config** sau khi nhập cấu hình.

> Khuyến nghị: tạo một thư mục riêng, ví dụ `D:\RegisGPTWorkspace`, để chứa dữ liệu chạy thật. Không nên dùng chung trực tiếp với thư mục source code nếu bạn muốn tránh nhầm dữ liệu cá nhân với mã nguồn.

## Hướng dẫn cấu hình cơ bản

### 1. Cấu hình password

Nhập password mặc định dùng cho tài khoản được tạo vào ô password trên giao diện, sau đó bấm **Lưu config**.

### 2. Cấu hình domain mail

Trong phần mail domain, chọn domain/provider phù hợp:

- Hotmail nếu dùng danh sách `accounts-hotmail.txt`.
- Gmail/shop provider nếu dùng nguồn Gmail tích hợp.
- Domain custom nếu workflow của bạn có cấu hình domain riêng.

### 3. Cấu hình Hotmail

File `accounts-hotmail.txt` hỗ trợ các trạng thái chính:

- `mail_ready`: mail trắng, sẵn sàng để tạo tài khoản.
- `pending`: tài khoản đã tạo, đang chờ verify phone.
- `verify`: tài khoản đã verify thành công.
- `error`: tài khoản lỗi.

Có thể import Hotmail trực tiếp trong UI hoặc mở file workspace để chỉnh thủ công.

### 4. Cấu hình SMSPool

1. Nhập SMSPool API key vào ô tương ứng.
2. Bấm **Lưu config**.
3. Bấm kiểm tra balance nếu cần.
4. Khi chạy verify, app sẽ dùng API key này để thuê số và lấy OTP.

### 5. Cấu hình proxy

Ứng dụng hỗ trợ quản lý proxy pool trong UI.

Format proxy thường dùng:

```text
ip:port:user:pass
```

hoặc:

```text
http://user:pass@ip:port
```

Khuyến nghị:

- Dùng HTTP proxy ổn định.
- Bật Round Robin nếu chạy nhiều tài khoản.
- Sticky = 1 nếu muốn mỗi tài khoản đổi proxy một lần.
- Kiểm tra proxy trước khi chạy để tránh treo ở bước login/create.

### 6. Cấu hình verify provider

Ứng dụng có thể dùng:

- **9Router**: flow truyền thống qua dashboard/provider.
- **CLIProxyAPI**: app tự chạy CLIProxyAPI để lấy OAuth URL rồi mở browser verify.

Nếu dùng CLIProxyAPI, hãy cấu hình đúng:

- Đường dẫn executable CLIProxyAPI.
- Đường dẫn file config CLIProxyAPI.
- Đảm bảo CLIProxyAPI chạy được lệnh `-codex-login`.

## Luồng sử dụng đề xuất

1. Chọn đúng workspace.
2. Import hoặc chuẩn bị Hotmail trong `accounts-hotmail.txt`.
3. Nhập password và API key cần thiết.
4. Cấu hình proxy nếu dùng proxy.
5. Bấm **Lưu config**.
6. Bấm **Refresh** để kiểm tra dữ liệu.
7. Chọn mode chạy và số lượng tài khoản.
8. Bấm **Run**.
9. Theo dõi log runtime, bảng Hotmail, bảng accounts và proxy log.
10. Khi chạy xong, kiểm tra trạng thái `pending`, `verify`, `error` trong bảng Hotmail.

## Lưu ý về dữ liệu nhạy cảm

Các file dữ liệu thật như `config.json`, `accounts.txt`, `accounts-hotmail.txt`, `sms_state.json`, `proxy_pools.json` có thể chứa API key, token, proxy, tài khoản và thông tin nhạy cảm. Những file này đã được đưa vào `.gitignore` và không nên commit lên GitHub.

Nếu cần chia sẻ source code, chỉ chia sẻ mã nguồn và hướng dẫn; không chia sẻ workspace thật.

## Cấu trúc dự án

```text
.
├── electron_main.js                # Main process Electron và IPC backend
├── electron_preload.cjs            # Preload bridge cho renderer
├── account_creator_core.js         # Core automation
├── chatgpt_account_creator_and_verify.js
├── src/
│   ├── core/
│   │   ├── repositories/           # Repository đọc/ghi dữ liệu workspace
│   │   └── services/               # Service SMS, mail OTP, logging, provider
│   └── shared/                     # Helper dùng chung
├── ui/
│   ├── index.html                  # Giao diện chính
│   ├── index.css                   # Style UI
│   └── app.js                      # Renderer logic
├── scripts/                        # Script hỗ trợ build/install
├── package.json
└── README.md
```

## Lệnh hữu ích

Chạy app:

```bash
npx electron .
```

Kiểm tra cú pháp file chính:

```bash
node --check electron_main.js
node --check ui/app.js
```

Cài dependency lại khi cần:

```bash
npm install
```

## Troubleshooting

### App mở lần đầu chậm

Lần đầu chạy `npx electron .` có thể chậm vì app cần khởi tạo Electron/Playwright/runtime. Các lần sau thường nhanh hơn.

### Không thấy dữ liệu tài khoản

Kiểm tra lại workspace đang chọn. Có thể bạn đang mở sai workspace nên app đọc file `accounts.txt` hoặc `accounts-hotmail.txt` ở thư mục khác.

### Bấm Run báo thiếu config

Hãy nhập đầy đủ password, SMSPool API key hoặc provider config rồi bấm **Lưu config**.

### Proxy lỗi hoặc treo web

Kiểm tra proxy pool, bật kiểm tra proxy trước khi chạy và thay proxy khác nếu proxy không vào được OpenAI/auth endpoint.

### Hotmail không đổi trạng thái trên bảng

Bấm **Refresh** để đọc lại workspace. App cũng có cơ chế tự refresh khi status đổi `pending` hoặc `verify`.

## Tác giả

Mã nguồn được phát triển bởi:

- **Võ Văn Tín**
- **Nguyễn Sơn Tùng**

## Ghi chú

Dự án này phục vụ mục đích quản lý và tự động hóa nội bộ. Người dùng tự chịu trách nhiệm khi cấu hình API key, proxy, tài khoản và khi sử dụng automation với các dịch vụ bên thứ ba.
