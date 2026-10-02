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
    BASE_DIR = os.path.dirname(sys.executable)
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
    # 3. Fallback to system PATH (e.g. Homebrew on macOS or global install)
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
        return self._updater.download_and_apply_update(download_url)

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


def main():
    adb_service = ADBService(ADB_BIN)
    scrcpy_service = ScrcpyService(SCRCPY_BIN)
    updater_service = ScrcpyUpdaterService(BASE_DIR, SCRCPY_BIN)
    airplay_service = AirPlayService()
    controller = AppController(adb_service, scrcpy_service, updater_service, airplay_service)

    win = webview.create_window(
        title="Scrcpy Dashboard Hub",
        url=UI_HTML,
        js_api=controller,
        width=1120,
        height=720,
        resizable=True,
        min_size=(980, 640),
        background_color="#f4f6fa",
    )
    controller.set_window(win)
    webview.start(debug=False)


if __name__ == "__main__":
    main()
