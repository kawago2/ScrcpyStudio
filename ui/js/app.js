// =====================================================================
// Global App Facade
// =====================================================================

const App = {
  dropdown: null,

  init() {
    ThemeManager.applyTheme(ThemeManager.getTheme());
    I18nManager.apply(I18nManager.getLang());

    this.dropdown = new CustomDeviceDropdown('deviceChip', 'customDeviceMenu', (id, name) => {
      this.log(`Target device: ${name}`, 'info');
    });

    window.addEventListener('pywebviewready', () => {
      this.log("Scrcpy Studio Modern Dashboard ready.", "info");
      this.refreshDevices();
      this.startPolling();
      this.syncAirPlayStatus();
      this.hideSplash();
    });

    // Fallback if pywebviewready already fired
    setTimeout(() => {
      this.hideSplash();
    }, 600);

    this.loadLaunchOptions();

    document.addEventListener('click', (e) => {
      const chip = document.getElementById('qualityChip');
      const menu = document.getElementById('customQualityMenu');
      if (chip && menu && !chip.contains(e.target)) {
        menu.classList.remove('open');
      }
    });
  },

  hideSplash() {
    const splash = document.getElementById('appSplashScreen');
    if (splash && !splash.classList.contains('hidden')) {
      splash.classList.add('hidden');
      setTimeout(() => {
        splash.style.display = 'none';
      }, 350);
    }
  },

  toggleLanguage() {
    I18nManager.toggle();
    this.updatePresetDescriptions();
    this.refreshDevices(true);
    this.syncAirPlayStatus();
    Toast.show(I18nManager.t('toastLangSwitched'), 'info');
  },

  selectedQuality: 'balanced',

  toggleQualityDropdown(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('customQualityMenu');
    if (menu) menu.classList.toggle('open');
  },

  selectQuality(val, event) {
    if (event) event.stopPropagation();
    this.selectedQuality = val;
    const labelKey = val === 'low' ? 'presetLow' : (val === 'high' ? 'presetHigh' : 'presetBalanced');
    const label = I18nManager.t(labelKey);
    const textEl = document.getElementById('selectedQualityText');
    if (textEl) textEl.innerText = label;

    document.querySelectorAll('.custom-quality-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-val') === val);
    });

    const menu = document.getElementById('customQualityMenu');
    if (menu) menu.classList.remove('open');
    this.saveLaunchOptions();
  },

  loadLaunchOptions() {
    const stayAwake = localStorage.getItem('scrcpy_opt_stay_awake');
    const turnScreenOff = localStorage.getItem('scrcpy_opt_screen_off');
    
    if (stayAwake !== null) {
      const el = document.getElementById('optStayAwake');
      if (el) el.checked = (stayAwake === 'true');
    }
    if (turnScreenOff !== null) {
      const el = document.getElementById('optTurnScreenOff');
      if (el) el.checked = (turnScreenOff === 'true');
    }
    const recordScreen = localStorage.getItem('scrcpy_opt_record_screen');
    if (recordScreen !== null) {
      const el = document.getElementById('optRecordScreen');
      if (el) el.checked = (recordScreen === 'true');
    }
    const quality = localStorage.getItem('scrcpy_opt_quality') || 'balanced';
    const labels = {
      'low': 'Low Latency (720p • 4M)',
      'balanced': 'Balanced (1080p • 8M)',
      'high': 'High Quality (Native • 16M)'
    };
    this.selectedQuality = quality;
    const textEl = document.getElementById('selectedQualityText');
    if (textEl) textEl.innerText = labels[quality] || labels['balanced'];

    document.querySelectorAll('.custom-quality-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-val') === quality);
    });

    this.updatePresetDescriptions();
  },

  updatePresetDescriptions() {
    const quality = this.selectedQuality || 'balanced';
    const lang = I18nManager.getLang();
    const usbDesc = document.getElementById('usbModeDesc');
    const wifiDesc = document.getElementById('wifiModeDesc');
    const wifiLabel = lang === 'id' ? 'Koneksi Nirkabel' : 'Wireless Stream';

    if (quality === 'low') {
      if (usbDesc) usbDesc.innerText = '720p • 60 FPS • 4 Mbps Low Latency';
      if (wifiDesc) wifiDesc.innerText = `720p • 60 FPS • 3 Mbps ${wifiLabel}`;
    } else if (quality === 'high') {
      if (usbDesc) usbDesc.innerText = 'Native 2K/FHD • 60 FPS • 16 Mbps Ultra HD';
      if (wifiDesc) wifiDesc.innerText = `1080p • 60 FPS • 5 Mbps High Quality`;
    } else {
      if (usbDesc) usbDesc.innerText = '1080p • 60 FPS • 8 Mbps Low Latency';
      if (wifiDesc) wifiDesc.innerText = `1080p • 60 FPS • 4 Mbps ${wifiLabel}`;
    }

    const textEl = document.getElementById('selectedQualityText');
    if (textEl) {
      const labelKey = quality === 'low' ? 'presetLow' : (quality === 'high' ? 'presetHigh' : 'presetBalanced');
      textEl.innerText = I18nManager.t(labelKey);
    }
  },

  saveLaunchOptions() {
    const stayAwake = document.getElementById('optStayAwake')?.checked ?? true;
    const turnScreenOff = document.getElementById('optTurnScreenOff')?.checked ?? false;
    const recordScreen = document.getElementById('optRecordScreen')?.checked ?? false;
    localStorage.setItem('scrcpy_opt_stay_awake', stayAwake);
    localStorage.setItem('scrcpy_opt_screen_off', turnScreenOff);
    localStorage.setItem('scrcpy_opt_record_screen', recordScreen);
    localStorage.setItem('scrcpy_opt_quality', this.selectedQuality);
    this.updatePresetDescriptions();
  },

  toggleTheme() {
    ThemeManager.toggle();
  },

  log(msg, type = 'info') {
    const box = document.getElementById('terminalBox');
    const time = new Date().toLocaleTimeString('id-ID', { hour12: false });
    if (box) {
      const row = document.createElement('div');
      let color = '#94a3b8';
      if (type === 'success') color = '#4ade80';
      if (type === 'warn') color = '#fbbf24';
      if (type === 'error') color = '#f87171';
      row.style.color = color;
      row.innerText = `[${time}] ${msg}`;
      box.appendChild(row);
      box.scrollTop = box.scrollHeight;
    }

    const modalConsole = document.getElementById('updateModalConsole');
    if (modalConsole && modalConsole.style.display !== 'none') {
      modalConsole.innerText += `[${time}] ${msg}\n`;
      modalConsole.scrollTop = modalConsole.scrollHeight;
    }
  },

  clearTerminal() {
    document.getElementById('terminalBox').innerHTML = '';
    Toast.show("Console logs dibersihkan", "info");
  },

  switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    if (event && event.currentTarget) {
      event.currentTarget.classList.add('active');
    }
    document.getElementById(tabId).classList.add('active');
  },

  lastDevicesJson: '',

  async refreshDevices(isSilent = false) {
    try {
      const raw = await window.pywebview.api.get_devices();
      const list = raw || [];
      const currentJson = JSON.stringify(list);

      if (currentJson === this.lastDevicesJson) {
        return;
      }
      const hadDevicesBefore = this.lastDevicesJson && JSON.parse(this.lastDevicesJson).length > 0;
      this.lastDevicesJson = currentJson;

      const aliases = AliasStorage.getAll();
      const formatted = list.map(d => ({
        id: d.id,
        name: aliases[d.id] ? aliases[d.id] : d.name
      }));

      const prev = this.dropdown.getValue();
      const next = formatted.some(d => d.id === prev)
        ? prev
        : (formatted.length > 0 ? formatted[0].id : '');

      this.dropdown.setDevices(formatted, next);

      const badge = document.getElementById('statusBadgeChip');
      const text = document.getElementById('statusBadgeText');

      if (formatted.length > 0) {
        badge.className = 'status-badge-chip';
        const lang = I18nManager.getLang();
        text.innerText = lang === 'id' ? `${formatted.length} HP Terhubung` : `${formatted.length} Device(s) Online`;
        if (isSilent && !hadDevicesBefore) {
          Toast.show(`${lang === 'id' ? 'Perangkat terdeteksi' : 'Device detected'}: ${formatted[0].name}`, "info");
        }
      } else {
        badge.className = 'status-badge-chip offline';
        text.innerText = I18nManager.t('noDevice');
      }
    } catch (e) {
      if (!isSilent) {
        this.log(`Error membaca status perangkat: ${e}`, 'error');
      }
    }
  },

  startPolling() {
    setInterval(() => {
      if (window.pywebview && window.pywebview.api) {
        this.refreshDevices(true);
      }
    }, 3000);
  },

  async restartAdb() {
    this.log(I18nManager.t('logRestartingAdb'), "warn");
    const res = await window.pywebview.api.restart_adb();
    const isSuccess = !res.toLowerCase().includes("gagal") && !res.toLowerCase().includes("error");
    this.log(res, isSuccess ? "success" : "error");
    Toast.show(res, isSuccess ? "success" : "error");
    this.refreshDevices();
  },

  openRenameModal() {
    const id = this.dropdown.getValue();
    if (!id) {
      Toast.show(I18nManager.t('toastSelectDeviceWarn'), "warn");
      return;
    }
    const aliases = AliasStorage.getAll();
    document.getElementById('renameModalSubtitle').innerText = `ID: ${id}`;
    document.getElementById('renameInput').value = aliases[id] || '';
    document.getElementById('renameModal').classList.add('open');
    document.getElementById('renameInput').focus();
  },

  closeRenameModal() {
    document.getElementById('renameModal').classList.remove('open');
  },

  confirmRename() {
    const id = this.dropdown.getValue();
    const alias = document.getElementById('renameInput').value.trim();
    if (alias) {
      AliasStorage.save(id, alias);
      Toast.show(`${I18nManager.t('toastAliasSaved')} "${alias}"`, "success");
      this.refreshDevices();
    }
    this.closeRenameModal();
  },

  async pairDevice() {
    const ip = document.getElementById('pairIp').value.trim();
    const port = document.getElementById('pairPort').value.trim();
    const code = document.getElementById('pairCode').value.trim();

    if (!ip || !port || !code) {
      Toast.show(I18nManager.t('toastFillPairWarn'), "warn");
      return;
    }

    const target = `${ip}:${port}`;
    this.log(`adb pair ${target}...`, "info");
    const res = await window.pywebview.api.pair_device(target, code);
    const isSuccess = res.includes("Successfully");
    this.log(res, isSuccess ? "success" : "info");
    Toast.show(isSuccess ? I18nManager.t('toastPairSuccess') : res, isSuccess ? "success" : "info");
    this.refreshDevices();
  },

  async connectDirectPort() {
    const ip = document.getElementById('pairIp').value.trim();
    const port = document.getElementById('connectPort').value.trim();

    if (!ip || !port) {
      Toast.show(I18nManager.t('toastFillConnectWarn'), "warn");
      return;
    }

    const target = `${ip}:${port}`;
    this.log(`adb connect ${target}...`, "info");
    const res = await window.pywebview.api.connect_target(target);
    this.log(res, res.includes("connected") ? "success" : "info");
    Toast.show(res, res.includes("connected") ? "success" : "info");
    this.refreshDevices();
  },

  async connectClassic() {
    const ip = document.getElementById('classicIp').value.trim();
    if (!ip) {
      Toast.show(I18nManager.t('toastFillClassicWarn'), "warn");
      return;
    }
    this.log(`TCP/IP 5555 -> ${ip}...`, "info");
    const res = await window.pywebview.api.connect_classic(ip);
    this.log(res, "success");
    Toast.show(res, "success");
    this.refreshDevices();
  },

  async sendKey(keycode, label) {
    const target = this.dropdown.getValue();
    this.log(`Key [${label}] -> ${target || 'default'}`, "info");
    await window.pywebview.api.send_key(String(keycode), target);
    Toast.show(`${I18nManager.t('toastKeySent')}: ${label}`, "info");
  },

  async takeScreenshot() {
    const target = this.dropdown.getValue();
    this.log(`Capturing screenshot for ${target || 'default'}...`, "info");
    const res = await window.pywebview.api.take_screenshot(target);
    if (res.success) {
      this.log(res.message, "success");
      Toast.show(res.message, "success");
    } else {
      this.log(res.message, "error");
      Toast.show(res.message, "warn");
    }
  },

  async openFolder(type) {
    try {
      const res = await window.pywebview.api.open_folder(type);
      this.log(res, "info");
      Toast.show(`${I18nManager.t('toastFolderOpen')}: ${type}`, "info");
    } catch (e) {
      this.log(`Error opening folder: ${e}`, "error");
    }
  },

  async launchMode(mode) {
    const target = this.dropdown.getValue();

    if (mode === 'otg' && target && target.includes(':')) {
      Toast.show(I18nManager.t('toastOtgWarn'), "warn");
      this.log(I18nManager.t('logOtgWarn'), "warn");
      return;
    }

    const stayAwake = document.getElementById('optStayAwake')?.checked ?? false;
    const turnScreenOff = document.getElementById('optTurnScreenOff')?.checked ?? false;
    const recordScreen = document.getElementById('optRecordScreen')?.checked ?? false;
    const quality = this.selectedQuality || 'balanced';
    
    let infoOpts = [];
    if (mode !== 'otg') {
      if (stayAwake) infoOpts.push("Stay Awake");
      if (turnScreenOff) infoOpts.push("Screen Off");
      if (recordScreen) infoOpts.push("Recording MP4");
      infoOpts.push(`Quality: ${quality.toUpperCase()}`);
    } else {
      infoOpts.push("Kabel USB Fisik");
    }
    const optStr = ` (${infoOpts.join(', ')})`;

    this.log(`Launch [${mode.toUpperCase()}] target: ${target || 'default'}${optStr}`, "info");
    const res = await window.pywebview.api.launch(mode, target, stayAwake, turnScreenOff, quality, recordScreen);
    const isErr = res.toLowerCase().includes("error") || res.toLowerCase().includes("gagal");
    this.log(res, isErr ? "error" : "success");
    Toast.show(res, isErr ? "error" : "success");
  },

  latestUpdateUrl: '',

  async checkScrcpyUpdate() {
    const modal = document.getElementById('updateModal');
    const title = document.getElementById('updateModalTitle');
    const subtitle = document.getElementById('updateModalSubtitle');
    const content = document.getElementById('updateModalContent');
    const btn = document.getElementById('btnApplyUpdate');

    title.innerText = I18nManager.t('updateTitle');
    subtitle.innerText = I18nManager.t('updateSubtitleChecking');
    content.innerHTML = `<span style="color: var(--text-sub);">${I18nManager.t('updateChecking')}</span>`;
    btn.style.display = 'none';
    btn.onclick = () => this.applyScrcpyUpdate();
    modal.classList.add('open');

    try {
      const res = await window.pywebview.api.check_scrcpy_update();
      if (!res.has_update && res.message && !res.current_version) {
        subtitle.innerText = I18nManager.t('updateCheckFailed');
        content.innerHTML = `<span style="color: #ef4444;">${res.message}</span>`;
        return;
      }

      if (!res.has_update) {
        subtitle.innerText = I18nManager.t('updateUpToDateSub', { version: res.current_version });
        content.innerHTML = `
          <div style="color: #22c55e; font-weight: 700; margin-bottom: 6px;">${I18nManager.t('updateUpToDateTitle')}</div>
          <div>${I18nManager.t('updateUpToDateDesc', { version: res.current_version })}</div>
        `;
        return;
      }

      this.latestUpdateUrl = res.download_url;
      subtitle.innerText = res.current_version === "Belum terpasang" 
        ? I18nManager.t('updateNotInstalled') 
        : I18nManager.t('updateNewFound', { version: res.latest_version });

      const versionCompareText = I18nManager.t('updateVersionCompare', {
        current: res.current_version === "Belum terpasang" ? I18nManager.t('updateNotInstalled') : `v${res.current_version}`,
        latest: `v${res.latest_version}`
      });

      content.innerHTML = `
        <div style="margin-bottom: 6px;">${versionCompareText}</div>
        <div style="font-size: 11px; color: var(--text-sub); white-space: pre-wrap; font-family: monospace; background: var(--bg-card); padding: 8px; border-radius: 6px;">${res.release_notes}</div>
      `;
      btn.style.display = 'inline-block';
      btn.innerText = res.current_version === "Belum terpasang" 
        ? I18nManager.t('updateBtnInstallAuto') 
        : I18nManager.t('updateBtnUpdateTo', { version: res.latest_version });
    } catch (e) {
      subtitle.innerText = "Error";
      content.innerHTML = `<span style="color: #ef4444;">${e}</span>`;
    }
  },

  closeUpdateModal() {
    document.getElementById('updateModal').classList.remove('open');
  },

  async applyScrcpyUpdate() {
    if (!this.latestUpdateUrl) return;
    const subtitle = document.getElementById('updateModalSubtitle');
    const content = document.getElementById('updateModalContent');
    const btn = document.getElementById('btnApplyUpdate');

    btn.disabled = true;
    btn.innerText = "...";
    subtitle.innerText = I18nManager.t('updateInstallingSub');
    const modalConsole = document.getElementById('updateModalConsole');
    if (modalConsole) {
      modalConsole.style.display = 'block';
      modalConsole.innerText = I18nManager.t('updateStarting');
    }

    try {
      const res = await window.pywebview.api.apply_scrcpy_update(this.latestUpdateUrl);
      if (res.success) {
        subtitle.innerText = I18nManager.t('updateSuccessTitle');
        content.innerHTML = `
          <div style="color: #22c55e; font-weight: 700; margin-bottom: 6px;">✓ ${res.message}</div>
          <div style="font-size: 11.5px; color: var(--text-dark); margin-top: 6px;">
            ${I18nManager.t('updateRestartNotice')}
          </div>
        `;
        btn.disabled = false;
        btn.style.display = 'inline-block';
        btn.innerText = I18nManager.t('updateBtnRestart');
        btn.onclick = async () => {
          btn.disabled = true;
          btn.innerText = I18nManager.t('updateBtnRestarting');
          Toast.show(I18nManager.t('updateToastRestarting'), "info");
          setTimeout(() => {
            window.pywebview.api.restart_app();
          }, 300);
        };
        Toast.show(I18nManager.t('updateToastReady'), "success");
      } else {
        subtitle.innerText = I18nManager.t('updateFailedTitle');
        content.innerHTML = `<span style="color: #ef4444;">${res.message}</span>`;
        btn.disabled = false;
        btn.innerText = I18nManager.t('updateBtnRetry');
      }
    } catch (e) {
      subtitle.innerText = "Error";
      content.innerHTML = `<span style="color: #ef4444;">${e}</span>`;
      btn.disabled = false;
    }
  },

  async toggleAirPlay() {
    if (this.currentPlatform === 'darwin') {
      Toast.show(I18nManager.t('modeAirPlayMacDesc'), "info");
      return;
    }
    try {
      const res = await window.pywebview.api.toggle_airplay();
      this.updateAirPlayUI(res.running);
      if (res.success) {
        this.log(res.message, res.running ? "success" : "info");
        Toast.show(res.message, res.running ? "success" : "info");
      } else {
        this.log(res.message, "warn");
        Toast.show(res.message, "warn");
      }
    } catch (e) {
      this.log(`Error AirPlay: ${e}`, "error");
    }
  },

  currentPlatform: 'win32',

  updateAirPlayUI(isRunning) {
    const badge = document.getElementById('airplayBadge');
    const card = document.getElementById('airplayCard');
    const desc = document.getElementById('airplayDesc');

    if (this.currentPlatform === 'darwin') {
      if (badge) {
        badge.innerText = I18nManager.t('statusAirPlayMacUnavail');
        badge.style.background = 'rgba(100, 116, 139, 0.2)';
        badge.style.color = 'var(--text-sub)';
        badge.setAttribute('data-i18n', 'statusAirPlayMacUnavail');
      }
      if (desc) {
        desc.innerText = I18nManager.t('modeAirPlayMacDesc');
        desc.setAttribute('data-i18n', 'modeAirPlayMacDesc');
      }
      if (card) {
        card.classList.add('disabled');
        card.title = "AirPlay Receiver via UxPlay hanya digunakan di Windows. Di macOS, gunakan AirPlay Receiver bawaan Apple.";
      }
      return;
    }

    if (badge) {
      const activeText = I18nManager.t('statusAirPlayActive');
      const offText = I18nManager.t('statusAirPlayOff');
      badge.innerText = isRunning ? activeText : offText;
      badge.style.background = isRunning ? '#22c55e' : 'var(--bg-app)';
      badge.style.color = isRunning ? '#ffffff' : 'var(--text-sub)';
      badge.setAttribute('data-i18n', isRunning ? 'statusAirPlayActive' : 'statusAirPlayOff');
    }
    if (card) {
      card.style.borderColor = isRunning ? '#db2777' : 'var(--border-card)';
    }
  },

  async syncAirPlayStatus() {
    try {
      const status = await window.pywebview.api.get_airplay_status();
      this.currentPlatform = status.platform || 'win32';
      this.updateAirPlayUI(status.running);
    } catch {
      // Ignore if not ready
    }
  }
};

window.App = App;
App.init();
