#!/bin/bash
# ==============================================================================
# Script Build & Package Scrcpy Studio untuk macOS (.app & .dmg)
# Jalankan script ini di terminal macOS
# ==============================================================================

set -e

APP_NAME="ScrcpyStudio"
VERSION="2.0"
DMG_NAME="${APP_NAME}_macOS_v${VERSION}.dmg"

echo "=== 1. Memeriksa Prasyarat di macOS ==="
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 belum terpasang."
    exit 1
fi

if ! command -v brew &> /dev/null; then
    echo "Catatan: Homebrew sangat disarankan untuk memasang scrcpy dan adb."
fi

echo "=== 2. Memasang Dependensi Python ==="
python3 -m pip install --upgrade pip
python3 -m pip install pywebview pyobjc-framework-WebKit pyinstaller

echo "=== 3. Membersihkan Direktori Build Lama ==="
rm -rf build dist "${DMG_NAME}"

echo "=== 4. Membangun Bundle ScrcpyStudio.app ==="
# Buat file icon .icns jika belum ada dari icon png
ICON_FLAG=""
if [ -f "ui/assets/app_icon.png" ]; then
    mkdir -p app.iconset
    sips -z 16 16     ui/assets/app_icon.png --out app.iconset/icon_16x16.png &> /dev/null || true
    sips -z 32 32     ui/assets/app_icon.png --out app.iconset/icon_16x16@2x.png &> /dev/null || true
    sips -z 32 32     ui/assets/app_icon.png --out app.iconset/icon_32x32.png &> /dev/null || true
    sips -z 64 64     ui/assets/app_icon.png --out app.iconset/icon_32x32@2x.png &> /dev/null || true
    sips -z 128 128   ui/assets/app_icon.png --out app.iconset/icon_128x128.png &> /dev/null || true
    sips -z 256 256   ui/assets/app_icon.png --out app.iconset/icon_128x128@2x.png &> /dev/null || true
    sips -z 512 512   ui/assets/app_icon.png --out app.iconset/icon_256x256@2x.png &> /dev/null || true
    iconutil -c icns app.iconset -o ScrcpyStudio.icns &> /dev/null || true
    rm -rf app.iconset
    if [ -f "ScrcpyStudio.icns" ]; then
        ICON_FLAG="--icon ScrcpyStudio.icns"
    fi
fi

python3 -m PyInstaller \
    --noconfirm \
    --clean \
    --windowed \
    --name "${APP_NAME}" \
    ${ICON_FLAG} \
    --add-data "ui:ui" \
    --osx-bundle-identifier "com.scrcpy.studio" \
    scrcpy_studio.py

echo "=== 5. Membuat Installer Disk Image (.dmg) ==="
DMG_STAGING="dist/dmg_staging"
mkdir -p "${DMG_STAGING}"
cp -R "dist/${APP_NAME}.app" "${DMG_STAGING}/"

# Membuat shortcut ke folder /Applications
ln -s /Applications "${DMG_STAGING}/Applications"

# Membuat file .dmg
hdiutil create \
    -volname "${APP_NAME} Installer" \
    -srcfolder "${DMG_STAGING}" \
    -ov \
    -format UDZO \
    "${DMG_NAME}"

rm -rf "${DMG_STAGING}"

echo "=============================================================================="
echo " Berhasil! Installer macOS telah siap: ${DMG_NAME}"
echo " File bundle app: dist/${APP_NAME}.app"
echo "=============================================================================="
