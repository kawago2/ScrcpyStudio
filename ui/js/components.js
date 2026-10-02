// =====================================================================
// OOP UI Component Architecture
// =====================================================================

class Toast {
  static show(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const item = document.createElement('div');
    item.className = `toast ${type}`;
    item.innerText = msg;
    container.appendChild(item);

    setTimeout(() => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(10px)';
      item.style.transition = 'all 0.25s ease';
      setTimeout(() => item.remove(), 250);
    }, 3000);
  }
}

class CustomDeviceDropdown {
  constructor(chipId, menuId, onSelect) {
    this.chip = document.getElementById(chipId);
    this.menu = document.getElementById(menuId);
    this.label = document.getElementById('selectedDeviceText');
    this.onSelect = onSelect;
    this.selectedId = '';

    document.addEventListener('click', (e) => {
      if (this.chip && !this.chip.contains(e.target)) {
        this.menu.classList.remove('open');
      }
    });
  }

  toggle() {
    this.menu.classList.toggle('open');
  }

  setDevices(list, activeId = '') {
    this.menu.innerHTML = '';

    const autoText = typeof I18nManager !== 'undefined' ? I18nManager.t('autoDevice') : 'Auto (Default)';
    const auto = document.createElement('div');
    auto.className = `custom-device-item ${activeId === '' ? 'active' : ''}`;
    auto.innerText = autoText;
    auto.onclick = (e) => {
      e.stopPropagation();
      this.select('', autoText);
    };
    this.menu.appendChild(auto);

    list.forEach(item => {
      const row = document.createElement('div');
      row.className = `custom-device-item ${item.id === activeId ? 'active' : ''}`;
      row.innerText = item.name;
      row.onclick = (e) => {
        e.stopPropagation();
        this.select(item.id, item.name);
      };
      this.menu.appendChild(row);
    });

    const current = list.find(d => d.id === activeId);
    this.selectedId = activeId;
    this.label.innerText = current ? current.name : autoText;
  }

  select(id, name) {
    this.selectedId = id;
    this.label.innerText = name;
    this.menu.classList.remove('open');
    if (this.onSelect) this.onSelect(id, name);
  }

  getValue() {
    return this.selectedId;
  }
}

class AliasStorage {
  static getAll() {
    try {
      return JSON.parse(localStorage.getItem('scrcpy_custom_aliases') || '{}');
    } catch {
      return {};
    }
  }

  static save(id, name) {
    const data = this.getAll();
    data[id] = name;
    localStorage.setItem('scrcpy_custom_aliases', JSON.stringify(data));
  }
}

class ThemeManager {
  static getTheme() {
    return localStorage.getItem('scrcpy_app_theme') || 'light';
  }

  static applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('scrcpy_app_theme', theme);
    
    const icon = document.getElementById('themeIcon');
    if (icon) {
      if (theme === 'dark') {
        icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
      } else {
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
      }
    }
  }

  static toggle() {
    const current = this.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
    Toast.show(`${I18nManager.t('toastThemeSwitched')}: ${next.toUpperCase()}`, 'info');
  }
}
