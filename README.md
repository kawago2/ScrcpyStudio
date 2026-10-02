# Scrcpy Studio

Scrcpy Studio adalah dashboard desktop modern untuk mengontrol dan melakukan *mirroring* perangkat Android secara nirkabel (Wi-Fi) maupun kabel (USB), didukung antarmuka modern, kontrol remote cepat, perekaman, tangkapan layar, dan lokalisasi multi-bahasa (English & Indonesian).

Aplikasi dibangun menggunakan arsitektur **Clean Architecture & SOLID** dengan backend Python + PyWebView dan antarmuka web modern responsif.

---

## 🚀 Fitur Utama

- **Multi-Mode Streaming:** USB Ultra Low Latency, Wi-Fi Wireless Stream, Audio-Only, Webcam Mode, dan OTG Hardware Mode.
- **Wireless ADB Pairing:** Hubungkan perangkat via Wi-Fi (Android 11+ Pair Code & Classic TCP/IP port 5555).
- **Remote Controls:** Navigasi cepat (Back, Home, App Switch, Volume, Power, Screen Off, Stay Awake).
- **Media Shortcuts:** Tombol pintas Screenshot dan Rekam MP4 langsung ke folder Pictures/Videos dengan tombol pembuka folder instan.
- **Multilingual (EN / ID):** Dukungan pergantian bahasa antarmuka secara instan.
- **Theme Support:** Dark mode dan Light mode dengan persistensi lokal.

---

## 💻 Panduan Menjalankan

### 1. Di Windows

#### Prasyarat:
- Python 3.8+
- Scrcpy & ADB (sudah tersedia di folder `bin/` atau di system PATH)

#### Menjalankan Source Code:
```powershell
pip install pywebview
python scrcpy_studio.py
```

#### Build Standalone `.exe` (Opsional):
```powershell
pip install pyinstaller pywebview
python -m PyInstaller --noconfirm --clean --windowed --name "ScrcpyStudio" --icon "app_icon.ico" --add-data "ui;ui" --add-data "app_icon.ico;." scrcpy_studio.py
```

---

### 2. Di macOS (Apple Silicon / Intel)

Scrcpy Studio sudah disesuaikan secara **cross-platform** (mendukung macOS & Linux).

#### Prasyarat macOS:
Install Scrcpy & ADB menggunakan [Homebrew](https://brew.sh/):
```bash
brew install scrcpy android-platform-tools
```

#### Menjalankan di Mac:
```bash
# 1. Clone repository
git clone <repo-url>
cd scrcpy

# 2. Setup virtual environment (direkomendasikan)
python3 -m venv venv
source venv/bin/activate

# 3. Install dependency PyWebView
pip install pywebview pyobjc-framework-WebKit

# 4. Jalankan aplikasi
python3 scrcpy_studio.py
```

#### Membuat Installer macOS (.app & .dmg):
Tersedia skrip build otomatis [build_mac.sh](file:///e:/Tools/scrcpy/build_mac.sh):
```bash
chmod +x build_mac.sh
./build_mac.sh
```
Skrip ini akan otomatis menghasilkan:
- `ScrcpyStudio_macOS_v2.0.dmg` (Installer drag-and-drop ke folder Applications)
- `dist/ScrcpyStudio.app` (Bundle aplikasi native macOS)

#### Catatan untuk Pengguna macOS:
- Saat pertama kali menghubungkan HP Android via kabel USB ke Mac, pastikan pilih **"Always allow from this computer"** pada dialog USB Debugging di layar HP.
- Di macOS, PyWebView secara otomatis merender antarmuka menggunakan engine **WebKit Cocoa** bawaan sistem Apple.

---

## 📁 Struktur Direktori

```text
├── bin/                   # Binary Scrcpy & ADB engine (Windows lokal / di-ignore Git)
├── ui/                    # Frontend UI modern
│   ├── assets/            # Logo & icon
│   ├── css/               # Modular stylesheet (base.css, components.css, style.css)
│   ├── js/                # Modular scripts (app.js, components.js, i18n.js)
│   └── index.html         # Template dashboard
├── scrcpy_studio.py       # Entrypoint aplikasi & JS bridge
├── services.py            # Layer service (ADB, Scrcpy, Updater)
├── installer.iss          # Skrip installer Inno Setup (Windows)
├── LICENSE.txt
└── README.md
```

---

## 📄 Lisensi
Apache-2.0 License. Engine Scrcpy dikembangkan oleh Genymobile.
