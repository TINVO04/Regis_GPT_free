# Cập nhật app qua GitHub Releases

App đã dùng [`electron-updater`](../electron_main.js) để kiểm tra/tải/cài bản mới từ GitHub Releases của repo [`TINVO04/Regis_GPT_free`](https://github.com/TINVO04/Regis_GPT_free).

## Cách hoạt động

- Người dùng tải bản cài đặt từ trang GitHub Releases.
- Khi bạn sửa code, tăng version trong [`package.json`](../package.json), build và publish release mới.
- Người dùng bấm **Kiểm tra cập nhật** trong app.
- Nếu GitHub Releases có version mới hơn, app sẽ hiện bản mới.
- Người dùng bấm **Tải cập nhật**, sau đó **Cài & khởi động lại**.

## Cách publish bản mới

1. Tăng version trong [`package.json`](../package.json), ví dụ:

```json
"version": "1.3.7"
```

2. Đảm bảo GitHub token có quyền tạo release. Có thể đặt biến môi trường:

```cmd
set GH_TOKEN=YOUR_GITHUB_TOKEN
```

hoặc:

```cmd
set GITHUB_TOKEN=YOUR_GITHUB_TOKEN
```

3. Build và publish release:

```cmd
npm run publish:github
```

Lệnh này chạy [`scripts/electron-builder-runner.mjs`](electron-builder-runner.mjs) và publish installer + metadata update lên GitHub Releases.

## Test build không publish

```cmd
npm run dist
```

## Lưu ý quan trọng

- Auto-update của Electron cần bản app được đóng gói/cài đặt bằng installer, không hoạt động đầy đủ khi chạy dev bằng `npx electron .`.
- Mỗi lần muốn người dùng nhận update, bắt buộc version trong [`package.json`](../package.json) phải tăng.
- Release GitHub phải có file metadata do electron-builder tạo, như `latest.yml`, kèm installer `.exe`.
- Nếu repo private, token/quyền tải release phải được cấu hình phù hợp; repo public sẽ dễ update hơn.
