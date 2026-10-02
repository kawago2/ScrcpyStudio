import os
import sys
import subprocess
import shutil
from typing import Dict, Any, Optional


class AirPlayService:
    """Service to control and detect iOS AirPlay Receiver on Windows / macOS"""

    def __init__(self):
        self._process: Optional[subprocess.Popen] = None

    def find_executable(self) -> Optional[str]:
        # 1. Check system PATH
        found = shutil.which("uxplay-windows") or shutil.which("uxplay")
        if found:
            return found

        # 2. Check standard Windows ProgramFiles install paths
        if sys.platform == "win32":
            candidates = [
                os.path.join(os.environ.get("ProgramFiles", "C:\\Program Files"), "uxplay-windows", "uxplay-windows.exe"),
                os.path.join(os.environ.get("ProgramFiles(x86)", "C:\\Program Files (x86)"), "uxplay-windows", "uxplay-windows.exe"),
                os.path.join(os.environ.get("LOCALAPPDATA", ""), "Programs", "uxplay-windows", "uxplay-windows.exe")
            ]
            for path in candidates:
                if os.path.exists(path):
                    return path

        return None

    def get_status(self) -> Dict[str, Any]:
        is_running = self._process is not None and self._process.poll() is None
        installed = self.find_executable() is not None or sys.platform == "darwin"
        return {
            "installed": installed,
            "running": is_running,
            "platform": sys.platform
        }

    def start_receiver(self) -> Dict[str, Any]:
        if sys.platform == "darwin":
            # On macOS, AirPlay receiver is built into the OS or QuickTime can be opened
            try:
                subprocess.Popen(["open", "-a", "QuickTime Player"])
                return {
                    "success": True,
                    "message": "QuickTime Player dibuka di macOS (Pilih File > New Movie Recording > iPad/iPhone)."
                }
            except Exception as e:
                return {"success": False, "message": f"Gagal membuka QuickTime: {e}"}

        # Windows
        exe_path = self.find_executable()
        if not exe_path:
            return {
                "success": False,
                "installed": False,
                "message": "UxPlay belum terpasang. Jalankan 'winget install leapbtw.uxplay' di terminal."
            }

        if self._process is not None and self._process.poll() is None:
            return {"success": True, "running": True, "message": "AirPlay Receiver sudah aktif dan siap menerima koneksi iPhone/iPad."}

        try:
            # Launch detached process so window stays open for user
            self._process = subprocess.Popen(
                [exe_path],
                creationflags=subprocess.DETACHED_PROCESS if sys.platform == "win32" else 0
            )
            return {
                "success": True,
                "running": True,
                "message": "AirPlay Receiver aktif! Buka Control Center di iPhone/iPad lalu tap Screen Mirroring."
            }
        except Exception as e:
            return {"success": False, "message": f"Gagal menjalankan UxPlay: {e}"}

    def stop_receiver(self) -> Dict[str, Any]:
        try:
            if sys.platform == "win32":
                subprocess.run(["taskkill.exe", "/F", "/IM", "uxplay-windows.exe"], capture_output=True)
                subprocess.run(["taskkill.exe", "/F", "/IM", "uxplay.exe"], capture_output=True)
            else:
                subprocess.run(["pkill", "-f", "uxplay"], capture_output=True)
            self._process = None
            return {"success": True, "message": "AirPlay Receiver dihentikan."}
        except Exception as e:
            return {"success": False, "message": f"Gagal menghentikan: {e}"}
