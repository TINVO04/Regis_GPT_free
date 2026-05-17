#!/usr/bin/env sh
set -e

fix_chrome_sandbox() {
  for sandbox in \
    /opt/Codex\ Account\ Studio/chrome-sandbox \
    /opt/codex-account-studio/chrome-sandbox
  do
    if [ -f "$sandbox" ]; then
      chown root:root "$sandbox" >/dev/null 2>&1 || true
      chmod 4755 "$sandbox" >/dev/null 2>&1 || true
    fi
  done
}

fix_chrome_sandbox

if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database /usr/share/applications >/dev/null 2>&1 || true
fi

if command -v gtk-update-icon-cache >/dev/null 2>&1; then
  gtk-update-icon-cache -q -t -f /usr/share/icons/hicolor >/dev/null 2>&1 || true
fi

exit 0
