# Scrcpy Studio

Scrcpy Studio is a desktop dashboard for Android device management, wireless ADB pairing, and low-latency screen mirroring. It provides a clean graphical interface built on top of Python, PyWebView, and vanilla web standards.

---

## Features

- **Multi-Mode Streaming**: Low-latency USB mirroring, Wi-Fi stream, audio streaming, camera passthrough, and OTG simulation.
- **Wireless ADB Setup**: Connect via Android 11+ pairing codes or standard TCP/IP port 5555.
- **Remote Controls**: Hardware key simulation (Home, Back, App Switch, Volume, Power, Screen Off, Stay Awake).
- **Media Capture**: Instant screenshots and MP4 screen recording with direct folder shortcuts to Pictures and Videos.
- **Localization**: English and Indonesian language support.
- **Theme**: Persistent light and dark color schemes.

---

## Getting Started

### Windows

#### Prerequisites
- Python 3.8+
- Scrcpy and ADB binaries (bundled in `bin/` or located in system `PATH`).

#### Run from Source
```powershell
pip install -r requirements.txt # or: pip install pywebview
python scrcpy_studio.py
```

#### Build Executable
```powershell
pip install pyinstaller pywebview
python -m PyInstaller --noconfirm --clean --windowed --name "ScrcpyStudio" --icon "app_icon.ico" --add-data "ui;ui" --add-data "app_icon.ico;." scrcpy_studio.py
```

---

### macOS

Scrcpy Studio runs natively on Apple Silicon and Intel macOS using WebKit.

#### Prerequisites
Install scrcpy and adb via Homebrew:
```bash
brew install scrcpy android-platform-tools
```

#### Run from Source
```bash
git clone <repo-url>
cd scrcpy

python3 -m venv venv
source venv/bin/activate
pip install pywebview pyobjc-framework-WebKit

python3 scrcpy_studio.py
```

#### Build macOS Installer (.app & .dmg)
A build script is provided to generate a standalone application bundle and disk image:
```bash
chmod +x build_mac.sh
./build_mac.sh
```
Outputs:
- `dist/ScrcpyStudio.app`
- `ScrcpyStudio_macOS_v2.0.dmg`

---

## Project Structure

```text
scrcpy/
├── bin/                   # Local scrcpy/adb binaries (Windows runtime)
├── ui/                    # Frontend UI module
│   ├── assets/            # Static image assets
│   ├── css/               # Modular stylesheets (base, components, style)
│   ├── js/                # Modular scripts (app, components, i18n)
│   └── index.html         # Application layout
├── scrcpy_studio.py       # Main application entry point & JS bridge
├── services.py            # ADB, Scrcpy, and updater service abstractions
├── airplay_service.py     # iOS AirPlay receiver service
├── build_mac.sh           # macOS packaging automation script
├── installer.iss          # Inno Setup Windows installer script
├── LICENSE.txt
└── README.md
```

---

## Credits & Acknowledgements

Scrcpy Studio integrates and relies on outstanding open-source technologies:

- **[scrcpy](https://github.com/Genymobile/scrcpy)** by Genymobile: High-performance Android screen mirroring and control over USB and Wi-Fi.
- **[UxPlay](https://github.com/FDH2/UxPlay) / [uxplay-windows](https://github.com/leapbtw/uxplay-windows)**: AirPlay-compatible screen mirroring receiver for iOS devices (iPhone & iPad).
- **[pywebview](https://pywebview.flowrl.com/)**: Lightweight cross-platform desktop wrapper for modern web GUIs.

---

## License

Licensed under the Apache License 2.0. Scrcpy is copyright Genymobile. UxPlay is copyright its respective authors (GPL-3.0).
