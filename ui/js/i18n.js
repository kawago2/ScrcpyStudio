// =====================================================================
// Scrcpy Studio Localization Manager (i18n)
// Modular dictionaries & language switcher
// =====================================================================

const I18nManager = {
  translations: {
    en: {
      navDashboard: "Dashboard",
      navRestartAdb: "Restart ADB",
      navClearLogs: "Clear Logs",
      navUpdateScrcpy: "Update Scrcpy",
      bannerTitle: "Open Source Engines",
      bannerDesc: "Powered by Genymobile Scrcpy (Android) & UxPlay (iOS AirPlay).",
      autoDevice: "(Auto / Default Device)",
      noDevice: "No Device",
      btnRenameDevice: "Rename Device",
      btnRefreshDevice: "Refresh Devices",
      modesTitle: "Display & Streaming Modes",
      modesSubtitle: "One-Click Launch",
      modeUsbTitle: "USB Mirroring",
      modeWifiTitle: "Wi-Fi Mirroring",
      modeAudioTitle: "Audio Only Stream",
      modeAudioDesc: "Stream device audio to PC without video",
      modeCameraTitle: "Device Camera / Webcam",
      modeCameraDesc: "Use front/back camera as PC webcam",
      modeOtgTitle: "Keyboard & Mouse (OTG)",
      modeOtgDesc: "Type on phone using PC keyboard (USB required)",
      modeAirPlayTitle: "iOS AirPlay Mirror",
      modeAirPlayDesc: "Mirror iPhone / iPad wirelessly to PC",
      modeAirPlayMacDesc: "Available on Windows (Built-in AirPlay on Mac)",
      statusAirPlayActive: "ACTIVE",
      statusAirPlayOff: "INACTIVE",
      statusAirPlayMacUnavail: "WINDOWS ONLY",
      optTitle: "Device Screen Settings:",
      optStayAwake: "Stay Awake",
      optScreenOff: "Turn Screen Off",
      optRecord: "Record Screen (MP4)",
      presetLow: "Low Latency (720p • 4M)",
      presetBalanced: "Balanced (1080p • 8M)",
      presetHigh: "High Quality (Native • 16M)",
      remoteTitle: "Device Remote Control:",
      btnScreenshot: "Screenshot",
      btnPicturesFolder: "Pictures",
      btnVideosFolder: "Videos",
      tipPower: "Power Button (Turn screen on/off)",
      tipVolUp: "Volume Up",
      tipVolDown: "Volume Down",
      tipHome: "Home Button",
      tipBack: "Back Button",
      tipRecents: "Recent Apps Switcher",
      tipScreenshot: "Capture phone screen and save to PC",
      tipPictures: "Open Screenshots folder (Pictures)",
      tipVideos: "Open Recorded Videos folder (Videos)",
      tipTheme: "Toggle Light / Dark mode",
      tipLang: "Switch Language",
      tipStayAwake: "Keep device display awake while running",
      tipScreenOff: "Turn off physical phone backlight while mirroring",
      tipQuality: "Display Quality Preset (Resolution & Bitrate)",
      tipRecord: "Record mirroring session to PC Videos (.mp4)",
      phPairIp: "Device IP (192.168.18.69)",
      phPairPort: "Pair Port (37597)",
      phPairCode: "6-digit Code",
      phConnectPort: "Main Connect Port (e.g. 43151)",
      phClassicIp: "Device IP (192.168.18.180)",
      phRename: "e.g. Poco F5 Pro / Gaming Phone",
      wirelessTitle: "Wireless Connection Setup",
      tabWireless: "Android 11+ Wireless Debugging",
      tabClassic: "Port 5555 Standard",
      wirelessHelp: "On device: <b>Developer options → Wireless debugging → Pair with pairing code</b>",
      classicHelp: "Plug USB cable once to activate TCP/IP 5555:",
      btnPair: "Pair",
      btnConnect: "Connect Device",
      btnConnectClassic: "Connect Port 5555",
      consoleTitle: "Activity Console",
      consoleBadge: "Live ADB Feed",
      renameTitle: "Rename Device Alias",
      renameSubtitle: "Set a custom alias name for this device:",
      btnCancel: "Cancel",
      btnSaveName: "Save Name",
      updateTitle: "Scrcpy Update",
      updateSubtitle: "Checking official scrcpy releases from GitHub...",
      btnClose: "Close",
      btnDownloadUpdate: "Download & Update",
      toastScreenshot: "Screenshot saved to Pictures",
      toastFolderOpen: "Opened folder",
      toastLangSwitched: "Language switched to English",
      toastThemeSwitched: "Theme changed to",
      toastLogsCleared: "Console logs cleared",
      toastKeySent: "Key sent",
      toastSelectDeviceWarn: "Please select a device first!",
      toastAliasSaved: "Device alias saved:",
      toastFillPairWarn: "Please enter IP, Port, and Pairing Code!",
      toastPairSuccess: "Pairing Successful!",
      toastFillConnectWarn: "Please enter IP and Main Connect Port!",
      toastFillClassicWarn: "Please enter Device IP!",
      toastOtgWarn: "OTG mode only supports physical USB cable connection!",
      logOtgWarn: "Warning: OTG mode (--otg) operates via physical USB HID hardware and cannot run over Wi-Fi.",
      logRestartingAdb: "Restarting ADB Server...",
      updateTitle: "Scrcpy Engine Update",
      updateChecking: "Connecting to GitHub API...",
      updateSubtitleChecking: "Checking official releases from Genymobile/scrcpy...",
      updateCheckFailed: "Failed to check for updates",
      updateUpToDateTitle: "✓ Scrcpy Engine Up-to-Date",
      updateUpToDateSub: "Your version is up to date (v{version})",
      updateUpToDateDesc: "Current version: <b>v{version}</b>. No new updates required.",
      updateNewFound: "New Version Available: v{version}",
      updateNotInstalled: "Scrcpy Not Installed",
      updateVersionCompare: "Local version: <b>{current}</b> ➔ Target release: <b style=\"color: var(--primary);\">{latest}</b>",
      updateStarting: "Starting installation process...\n",
      updateInstallingSub: "Installation/update in progress...",
      updateSuccessTitle: "Installation Successful!",
      updateRestartNotice: "The app needs to be restarted to activate the newly installed Scrcpy engine.",
      updateBtnRestart: "Restart App Now",
      updateBtnRestarting: "Restarting...",
      updateToastRestarting: "Reloading application...",
      updateToastReady: "Scrcpy is ready! Please restart the application.",
      updateFailedTitle: "Update Failed",
      updateBtnRetry: "Try Again",
      updateBtnInstallAuto: "Install Scrcpy Automatically",
      updateBtnUpdateTo: "Update to v{version}"
    },
    id: {
      navDashboard: "Dashboard",
      navRestartAdb: "Restart ADB",
      navClearLogs: "Bersihkan Log",
      navUpdateScrcpy: "Update Scrcpy",
      bannerTitle: "Didukung Open Source",
      bannerDesc: "Ditenagai oleh Genymobile Scrcpy (Android) & UxPlay (iOS AirPlay).",
      autoDevice: "(Auto / Perangkat Default)",
      noDevice: "Tidak Ada HP",
      btnRenameDevice: "Ganti Nama Perangkat",
      btnRefreshDevice: "Segarkan Perangkat",
      modesTitle: "Mode Layar & Streaming",
      modesSubtitle: "One-Click Launch",
      modeUsbTitle: "Mirroring USB",
      modeWifiTitle: "Mirroring Wi-Fi",
      modeAudioTitle: "Audio Only Stream",
      modeAudioDesc: "Dengar suara HP di PC tanpa jendela layar",
      modeCameraTitle: "Kamera HP / Webcam",
      modeCameraDesc: "Gunakan kamera depan/belakang di PC",
      modeOtgTitle: "Keyboard & Mouse (OTG)",
      modeOtgDesc: "Ketik di HP pakai keyboard PC (Khusus kabel USB)",
      modeAirPlayTitle: "iOS AirPlay Mirror",
      modeAirPlayDesc: "Mirroring layar iPhone / iPad nirkabel ke PC",
      modeAirPlayMacDesc: "Tersedia di Windows (Gunakan AirPlay bawaan di Mac)",
      statusAirPlayActive: "AKTIF",
      statusAirPlayOff: "NONAKTIF",
      statusAirPlayMacUnavail: "WINDOWS ONLY",
      optTitle: "Pengaturan Layar HP:",
      optStayAwake: "Layar Tetap Nyala",
      optScreenOff: "Matikan Layar",
      optRecord: "Rekam Layar (MP4)",
      presetLow: "Low Latency (720p • 4M)",
      presetBalanced: "Balanced (1080p • 8M)",
      presetHigh: "High Quality (Native • 16M)",
      remoteTitle: "Remote Control HP:",
      btnScreenshot: "Screenshot",
      btnPicturesFolder: "Gambar",
      btnVideosFolder: "Video",
      tipPower: "Tombol Power (Nyalakan / Matikan Layar)",
      tipVolUp: "Tombol Volume Naik",
      tipVolDown: "Tombol Volume Turun",
      tipHome: "Tombol Home",
      tipBack: "Tombol Back",
      tipRecents: "Recent Apps",
      tipScreenshot: "Ambil Screenshot HP & Simpan ke PC",
      tipPictures: "Buka Folder Screenshot (Pictures)",
      tipVideos: "Buka Folder Rekaman Video (Videos)",
      tipTheme: "Ganti Mode Light / Dark",
      tipLang: "Ganti Bahasa",
      tipStayAwake: "Layar HP tetap menyala & tidak tertidur/mati otomatis",
      tipScreenOff: "Matikan fisik backlight layar HP saat streaming aktif",
      tipQuality: "Preset Kualitas Layar (Resolusi & Bitrate)",
      tipRecord: "Rekam sesi mirroring layar dan simpan video ke folder Videos PC (.mp4)",
      phPairIp: "IP HP (192.168.18.69)",
      phPairPort: "Port Pair (37597)",
      phPairCode: "Kode 6-Digit",
      phConnectPort: "Port Connect Utama (cth: 43151)",
      phClassicIp: "Masukkan IP HP (192.168.18.180)",
      phRename: "cth: Poco F5 Pro / HP Gaming",
      wirelessTitle: "Setup Koneksi Nirkabel",
      tabWireless: "Android 11+ Wireless Debugging",
      tabClassic: "Port 5555 Standard",
      wirelessHelp: "Buka HP: <b>Developer options → Wireless debugging → Pair with pairing code</b>",
      classicHelp: "Colok kabel USB sekali untuk aktivasi port 5555:",
      btnPair: "Pairing",
      btnConnect: "Hubungkan Perangkat",
      btnConnectClassic: "Hubungkan Port 5555",
      consoleTitle: "Konsol Aktivitas",
      consoleBadge: "Live ADB Feed",
      renameTitle: "Ganti Nama Alias HP",
      renameSubtitle: "Beri nama panggilan khusus untuk perangkat ini:",
      btnCancel: "Batal",
      btnSaveName: "Simpan Nama",
      updateTitle: "Pembaruan Engine Scrcpy",
      updateSubtitle: "Memeriksa rilis engine scrcpy resmi dari GitHub...",
      btnClose: "Tutup",
      btnDownloadUpdate: "Unduh & Terapkan",
      toastScreenshot: "Screenshot disimpan ke Pictures",
      toastFolderOpen: "Membuka folder",
      toastLangSwitched: "Bahasa beralih ke Bahasa Indonesia",
      toastThemeSwitched: "Mode berganti ke",
      toastLogsCleared: "Console logs dibersihkan",
      toastKeySent: "Tombol terkirim",
      toastSelectDeviceWarn: "Silakan pilih perangkat terlebih dahulu!",
      toastAliasSaved: "Nama perangkat disimpan:",
      toastFillPairWarn: "Harap isi IP, Port, dan Pairing Code!",
      toastPairSuccess: "Pairing Berhasil!",
      toastFillConnectWarn: "Harap masukkan IP dan Port Connect Utama!",
      toastFillClassicWarn: "Harap masukkan IP HP!",
      toastOtgWarn: "Mode OTG hanya mendukung koneksi kabel USB fisik!",
      logOtgWarn: "Peringatan: Mode OTG (--otg) bekerja via HID hardware USB dan tidak dapat berjalan lewat koneksi nirkabel/Wi-Fi.",
      logRestartingAdb: "Merestart ADB Server...",
      updateTitle: "Pembaruan Engine Scrcpy",
      updateChecking: "Menghubungkan ke GitHub API...",
      updateSubtitleChecking: "Memeriksa rilis resmi GitHub Genymobile/scrcpy...",
      updateCheckFailed: "Gagal memeriksa pembaruan",
      updateUpToDateTitle: "✓ Scrcpy Engine Up-to-Date",
      updateUpToDateSub: "Versi Anda Sudah yang Terbaru (v{version})",
      updateUpToDateDesc: "Versi lokal saat ini: <b>v{version}</b>. Tidak ada pembaruan baru yang diperlukan.",
      updateNewFound: "Versi Baru Ditemukan: v{version}",
      updateNotInstalled: "Scrcpy Belum Terpasang",
      updateVersionCompare: "Versi lokal: <b>{current}</b> ➔ Target rilis: <b style=\"color: var(--primary);\">{latest}</b>",
      updateStarting: "Memulai proses pemasangan...\n",
      updateInstallingSub: "Proses instalasi/pembaruan sedang berjalan...",
      updateSuccessTitle: "Pemasangan Berhasil!",
      updateRestartNotice: "Aplikasi perlu dimuat ulang (restart) agar engine Scrcpy yang baru terpasang dapat aktif sepenuhnya.",
      updateBtnRestart: "Restart Aplikasi Sekarang",
      updateBtnRestarting: "Merestart...",
      updateToastRestarting: "Memuat ulang aplikasi...",
      updateToastReady: "Scrcpy siap digunakan! Silakan restart aplikasi.",
      updateFailedTitle: "Gagal Memperbarui",
      updateBtnRetry: "Coba Lagi",
      updateBtnInstallAuto: "Install Scrcpy Otomatis",
      updateBtnUpdateTo: "Update ke v{version}"
    }
  },

  getLang() {
    return localStorage.getItem('scrcpy_app_lang') || 'en';
  },

  setLang(lang) {
    localStorage.setItem('scrcpy_app_lang', lang);
    this.apply(lang);
  },

  t(key, params = {}) {
    const lang = this.getLang();
    let text = this.translations[lang]?.[key] || this.translations['en']?.[key] || key;
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
    return text;
  },

  apply(lang) {
    const dict = this.translations[lang] || this.translations['en'];
    
    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Tooltip Titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key]) {
        el.setAttribute('title', dict[key]);
      }
    });

    const langLabel = document.getElementById('currentLangLabel');
    if (langLabel) {
      langLabel.innerText = lang.toUpperCase();
    }
  },

  toggle() {
    const current = this.getLang();
    const next = current === 'en' ? 'id' : 'en';
    this.setLang(next);
    return next;
  }
};
