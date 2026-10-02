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
      bannerTitle: "Scrcpy Engine",
      bannerDesc: "Low latency streaming & audio mirroring for Android.",
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
      toastThemeSwitched: "Theme changed to"
    },
    id: {
      navDashboard: "Dashboard",
      navRestartAdb: "Restart ADB",
      navClearLogs: "Bersihkan Log",
      navUpdateScrcpy: "Update Scrcpy",
      bannerTitle: "Engine Scrcpy",
      bannerDesc: "Streaming latensi rendah & mirroring audio untuk Android.",
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
      updateTitle: "Pembaruan Scrcpy",
      updateSubtitle: "Memeriksa rilis engine scrcpy resmi dari GitHub...",
      btnClose: "Tutup",
      btnDownloadUpdate: "Unduh & Terapkan",
      toastScreenshot: "Screenshot disimpan ke Pictures",
      toastFolderOpen: "Membuka folder",
      toastLangSwitched: "Bahasa beralih ke Bahasa Indonesia",
      toastThemeSwitched: "Mode berganti ke"
    }
  },

  getLang() {
    return localStorage.getItem('scrcpy_app_lang') || 'en';
  },

  setLang(lang) {
    localStorage.setItem('scrcpy_app_lang', lang);
    this.apply(lang);
  },

  t(key) {
    const lang = this.getLang();
    return this.translations[lang]?.[key] || this.translations['en']?.[key] || key;
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
