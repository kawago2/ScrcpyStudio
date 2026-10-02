import os
import sys
from typing import List, Dict, Any
import webview

from services import (
    IADBService,
    IScrcpyService,
    IUpdaterService,
    ADBService,
    ScrcpyService,
    ScrcpyUpdaterService,
)
from airplay_service import AirPlayService

# Path Resolution
if getattr(sys, "frozen", False):
    # PyInstaller extracts bundled data to _MEIPASS, or inside .app/Contents/Resources
    if hasattr(sys, "_MEIPASS"):
        BASE_DIR = sys._MEIPASS
    else:
        app_dir = os.path.dirname(sys.executable)
        resources_dir = os.path.join(os.path.dirname(app_dir), "Resources")
        BASE_DIR = resources_dir if os.path.exists(os.path.join(resources_dir, "ui")) else app_dir
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

BIN_DIR = os.path.join(BASE_DIR, "bin")

def resolve_binary(name: str) -> str:
    # 1. Check bin/ subdirectory
    in_bin = os.path.join(BIN_DIR, f"{name}.exe" if sys.platform == "win32" else name)
    if os.path.exists(in_bin):
        return in_bin
    # 2. Check root directory
    in_root = os.path.join(BASE_DIR, f"{name}.exe" if sys.platform == "win32" else name)
    if os.path.exists(in_root):
        return in_root
    # 3. Check macOS common brew and sdk paths directly
    if sys.platform == "darwin":
        common_mac_paths = [
            f"/opt/homebrew/bin/{name}",
            f"/usr/local/bin/{name}",
            os.path.expanduser(f"~/Library/Android/sdk/platform-tools/{name}"),
        ]
        for p in common_mac_paths:
            if os.path.exists(p):
                return p
    # 4. Fallback to system PATH
    import shutil
    which_bin = shutil.which(name)
    return which_bin if which_bin else in_bin

ADB_BIN = resolve_binary("adb")
SCRCPY_BIN = resolve_binary("scrcpy")
UI_HTML = os.path.join(BASE_DIR, "ui", "index.html")


class AppController:
    """Facade class exposed as JS API via pywebview"""

    def __init__(
        self,
        adb_service: IADBService,
        scrcpy_service: IScrcpyService,
        updater_service: IUpdaterService,
        airplay_service: AirPlayService,
    ):
        self._adb = adb_service
        self._scrcpy = scrcpy_service
        self._updater = updater_service
        self._airplay = airplay_service
        self._window = None

    def set_window(self, win):
        self._window = win

    def get_airplay_status(self) -> Dict[str, Any]:
        return self._airplay.get_status()

    def toggle_airplay(self) -> Dict[str, Any]:
        return self._airplay.toggle_receiver()

    def start_airplay(self) -> Dict[str, Any]:
        return self._airplay.start_receiver()

    def stop_airplay(self) -> Dict[str, Any]:
        return self._airplay.stop_receiver()

    def get_devices(self) -> List[Dict[str, str]]:
        return self._adb.list_devices()

    def restart_adb(self) -> str:
        return self._adb.restart_server()

    def pair_device(self, host_port: str, code: str) -> str:
        return self._adb.pair(host_port, code)

    def connect_target(self, host_port: str) -> str:
        return self._adb.connect(host_port)

    def connect_classic(self, ip: str) -> str:
        self._adb.tcpip_enable(5555)
        target = ip if ":" in ip else f"{ip}:5555"
        return self._adb.connect(target)

    def launch(
        self,
        mode: str,
        device_id: str = "",
        stay_awake: bool = False,
        turn_screen_off: bool = False,
        quality: str = "balanced",
        record_screen: bool = False,
    ) -> str:
        def _handle_log(msg: str):
            if self._window:
                try:
                    import json

                    clean = json.dumps(msg)
                    self._window.evaluate_js(f"App.log({clean}, 'info');")
                except Exception:
                    pass

        return self._scrcpy.launch(
            mode,
            device_id if device_id else None,
            stay_awake=stay_awake,
            turn_screen_off=turn_screen_off,
            quality=quality,
            record_screen=record_screen,
            on_log=_handle_log,
        )

    def get_scrcpy_version(self) -> str:
        return self._updater.get_current_version()

    def check_scrcpy_update(self) -> Dict[str, Any]:
        return self._updater.check_for_updates()

    def apply_scrcpy_update(self, download_url: str) -> Dict[str, Any]:
        def _handle_log(msg: str):
            if self._window:
                js_msg = json.dumps(msg)
                self._window.evaluate_js(f'if (window.App && window.App.log) window.App.log({js_msg}, "info");')

        res = self._updater.download_and_apply_update(download_url, on_log=_handle_log)
        if res.get("success"):
            global SCRCPY_BIN
            SCRCPY_BIN = resolve_binary("scrcpy")
            self._scrcpy.scrcpy_bin = SCRCPY_BIN
        return res

    def send_key(self, keycode: str, device_id: str = "") -> str:
        return self._adb.send_key(device_id if device_id else None, keycode)

    def take_screenshot(self, device_id: str = "") -> Dict[str, Any]:
        return self._adb.take_screenshot(device_id if device_id else None)

    def open_folder(self, folder_type: str = "pictures") -> str:
        try:
            if folder_type == "videos":
                path = os.path.join(os.path.expanduser("~"), "Videos")
            else:
                path = os.path.join(os.path.expanduser("~"), "Pictures")
            if not os.path.exists(path):
                path = BASE_DIR
            if sys.platform == "win32":
                os.startfile(path)
            elif sys.platform == "darwin":
                import subprocess
                subprocess.run(["open", path])
            else:
                import subprocess
                subprocess.run(["xdg-open", path])
            return f"Folder {folder_type.capitalize()} dibuka."
        except Exception as e:
            return f"Gagal membuka folder: {e}"

    def restart_app(self) -> None:
        """Restart application process cleanly"""
        import sys
        import os
        python = sys.executable
        os.execl(python, python, *sys.argv)


def main():
    adb_service = ADBService(ADB_BIN)
    scrcpy_service = ScrcpyService(SCRCPY_BIN)
    updater_service = ScrcpyUpdaterService(BASE_DIR, SCRCPY_BIN)
    airplay_service = AirPlayService()
    controller = AppController(adb_service, scrcpy_service, updater_service, airplay_service)

    win = webview.create_window(
        title="Scrcpy Studio",
        url=UI_HTML,
        js_api=controller,
        width=1120,
        height=720,
        resizable=True,
        min_size=(980, 640),
        background_color="#f4f6fa",
    )
    controller.set_window(win)

    def _on_webview_started():
        # Set macOS Dock Icon and Process Title dynamically
        if sys.platform == "darwin":
            try:
                import AppKit
                icon_path = os.path.join(BASE_DIR, "ui", "assets", "app_icon.png")
                if os.path.exists(icon_path):
                    app = AppKit.NSApplication.sharedApplication()
                    image = AppKit.NSImage.alloc().initWithContentsOfFile_(icon_path)
                    if image:
                        app.setApplicationIconImage_(image)
            except Exception:
                pass

    webview.start(_on_webview_started, debug=False)


if __name__ == "__main__":
    main()
