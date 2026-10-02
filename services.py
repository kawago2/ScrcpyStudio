import os
import sys
import subprocess
import threading
import json
import urllib.request
import zipfile
import shutil
from abc import ABC, abstractmethod
from typing import List, Dict, Optional, Any

# Cross-platform subprocess flag for hiding background console
NO_WINDOW_FLAG = subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0

def kill_scrcpy_process():
    """Kill running scrcpy instances across Windows, macOS, and Linux"""
    try:
        if sys.platform == "win32":
            subprocess.run(["taskkill.exe", "/F", "/IM", "scrcpy.exe"], capture_output=True, creationflags=NO_WINDOW_FLAG)
        else:
            subprocess.run(["pkill", "-f", "scrcpy"], capture_output=True)
    except Exception:
        pass


class IUpdaterService(ABC):
    @abstractmethod
    def get_current_version(self) -> str:
        pass

    @abstractmethod
    def check_for_updates(self) -> Dict[str, Any]:
        pass

    @abstractmethod
    def download_and_apply_update(self, download_url: str) -> Dict[str, Any]:
        pass


class IADBService(ABC):
    @abstractmethod
    def list_devices(self) -> List[Dict[str, str]]:
        pass

    @abstractmethod
    def restart_server(self) -> str:
        pass

    @abstractmethod
    def pair(self, host_port: str, code: str) -> str:
        pass

    @abstractmethod
    def connect(self, host_port: str) -> str:
        pass

    @abstractmethod
    def tcpip_enable(self, port: int = 5555) -> bool:
        pass

    @abstractmethod
    def send_key(self, device_id: Optional[str], keycode: str) -> str:
        pass

    @abstractmethod
    def take_screenshot(self, device_id: Optional[str]) -> Dict[str, Any]:
        pass


class IScrcpyService(ABC):
    @abstractmethod
    def launch(
        self,
        mode: str,
        device_id: Optional[str] = None,
        stay_awake: bool = False,
        turn_screen_off: bool = False,
        quality: str = "balanced",
        record_screen: bool = False,
        on_log=None
    ) -> str:
        pass


class ADBService(IADBService):
    def __init__(self, binary_path: str):
        self.bin = binary_path

    def _execute(self, args: List[str], timeout: Optional[int] = None) -> subprocess.CompletedProcess:
        if not os.path.exists(self.bin):
            raise FileNotFoundError(f"Binary tidak ditemukan di: {self.bin}")
        extra_kwargs = {"creationflags": NO_WINDOW_FLAG} if sys.platform == "win32" else {}
        return subprocess.run(
            [self.bin] + args,
            capture_output=True,
            text=True,
            timeout=timeout,
            **extra_kwargs
        )

    def list_devices(self) -> List[Dict[str, str]]:
        if not os.path.exists(self.bin):
            return []
        try:
            res = self._execute(["devices", "-l"])
            devices = []
            for line in res.stdout.strip().splitlines()[1:]:
                line = line.strip()
                if not line:
                    continue
                parts = line.split()
                if len(parts) >= 2 and parts[1] == "device":
                    serial = parts[0]
                    model = ""
                    for token in parts[2:]:
                        if token.startswith("model:"):
                            model = token.split(":", 1)[1].replace("_", " ")
                    if not model:
                        for token in parts[2:]:
                            if token.startswith("device:"):
                                model = token.split(":", 1)[1]
                    display = f"{model} ({serial})" if model else serial
                    devices.append({"id": serial, "name": display})
            return devices
        except Exception:
            return []

    def restart_server(self) -> str:
        try:
            self._execute(["kill-server"])
            self._execute(["devices"])
            return "ADB Server berhasil di-restart."
        except Exception as e:
            return f"Gagal merestart ADB: {e}"

    def pair(self, host_port: str, code: str) -> str:
        try:
            res = self._execute(["pair", host_port.strip(), code.strip()], timeout=15)
            out = (res.stdout + "\n" + res.stderr).strip()
            return out or f"Pairing ke {host_port} berhasil."
        except Exception as e:
            return f"Error pairing: {e}"

    def connect(self, host_port: str) -> str:
        try:
            res = self._execute(["connect", host_port.strip()], timeout=10)
            return res.stdout.strip() or f"Koneksi ke {host_port} diproses."
        except Exception as e:
            return f"Error koneksi: {e}"

    def tcpip_enable(self, port: int = 5555) -> bool:
        try:
            res = self._execute(["tcpip", str(port)])
            return res.returncode == 0
        except Exception:
            return False

    def send_key(self, device_id: Optional[str], keycode: str) -> str:
        try:
            args = []
            if device_id:
                args.extend(["-s", device_id.strip()])
            args.extend(["shell", "input", "keyevent", str(keycode)])
            self._execute(args, timeout=4)
            return f"Keyevent {keycode} terkirim."
        except Exception as e:
            return f"Error keyevent: {e}"

    def take_screenshot(self, device_id: Optional[str]) -> Dict[str, Any]:
        try:
            pictures_dir = os.path.join(os.path.expanduser("~"), "Pictures")
            if not os.path.exists(pictures_dir):
                pictures_dir = os.path.dirname(os.path.abspath(self.bin))

            import time
            filename = f"scrcpy_shot_{int(time.time())}.png"
            dest_path = os.path.join(pictures_dir, filename)

            args = []
            if device_id:
                args.extend(["-s", device_id.strip()])
            args.extend(["exec-out", "screencap", "-p"])

            extra_kwargs = {"creationflags": NO_WINDOW_FLAG} if sys.platform == "win32" else {}
            res = subprocess.run(
                [self.bin] + args,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=8,
                **extra_kwargs
            )
            if res.returncode == 0 and len(res.stdout) > 0:
                with open(dest_path, "wb") as f:
                    f.write(res.stdout)
                return {"success": True, "message": f"Screenshot disimpan ke Pictures: {filename}", "path": dest_path}
            else:
                return {"success": False, "message": "Gagal menangkap layar HP."}
        except Exception as e:
            return {"success": False, "message": f"Error screenshot: {e}"}


class ScrcpyService(IScrcpyService):
    def __init__(self, binary_path: str):
        self.bin = binary_path

    def _build_args(self, mode: str, stay_awake: bool = False, turn_screen_off: bool = False, quality: str = "balanced") -> List[str]:
        base_args = ["--video-codec=h264"]
        quality_map = {
            "low": {"size": "720", "bitrate": "4M", "fps": "60"},
            "balanced": {"size": "1080", "bitrate": "8M", "fps": "60"},
            "high": {"size": "0", "bitrate": "16M", "fps": "60"}
        }
        q = quality_map.get(quality, quality_map["balanced"])

        strategies = {
            "usb": [
                f"--max-size={q['size']}" if q['size'] != "0" else "",
                f"--video-bit-rate={q['bitrate']}",
                f"--max-fps={q['fps']}",
                "--audio-buffer=40"
            ],
            "wifi": [
                f"--max-size={q['size'] if q['size'] != '0' else '1080'}",
                f"--video-bit-rate={'5M' if quality == 'high' else ('3M' if quality == 'low' else '4M')}",
                f"--max-fps={q['fps']}",
                "--audio-buffer=50"
            ],
            "audio": [
                "--no-video",
                "--audio-buffer=100",
                "--audio-bit-rate=128K"
            ],
            "camera": [
                "--video-source=camera",
                "--camera-size=1920x1080",
                "--camera-fps=60"
            ],
            "otg": [
                "--otg"
            ]
        }
        args = [arg for arg in strategies.get(mode, []) if arg]
        if mode in ["usb", "wifi"]:
            args.extend(base_args)

        if turn_screen_off:
            args.append("-S")
        if stay_awake:
            args.append("-w")
        return args

    def launch(
        self,
        mode: str,
        device_id: Optional[str] = None,
        stay_awake: bool = False,
        turn_screen_off: bool = False,
        quality: str = "balanced",
        record_screen: bool = False,
        on_log=None
    ) -> str:
        if not os.path.exists(self.bin):
            return f"Error: scrcpy.exe tidak ditemukan di {self.bin}"

        cmd = [self.bin]
        if mode == "otg":
            cmd.append("--otg")
        else:
            if device_id:
                cmd.extend(["-s", device_id.strip()])
            cmd.extend(self._build_args(mode, stay_awake=stay_awake, turn_screen_off=turn_screen_off, quality=quality))

        record_msg = ""
        if record_screen and mode in ["usb", "wifi"]:
            import time
            videos_dir = os.path.join(os.path.expanduser("~"), "Videos")
            if not os.path.exists(videos_dir):
                videos_dir = os.path.dirname(os.path.abspath(self.bin))
            rec_filename = f"scrcpy_record_{int(time.time())}.mp4"
            rec_path = os.path.join(videos_dir, rec_filename)
            cmd.append(f"--record={rec_path}")
            record_msg = f" (Merekam ke Videos/{rec_filename})"

        def _spawn():
            try:
                extra_kwargs = {"creationflags": NO_WINDOW_FLAG} if sys.platform == "win32" else {}
                proc = subprocess.Popen(
                    cmd,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT,
                    text=True,
                    **extra_kwargs
                )
                if proc.stdout:
                    for line in iter(proc.stdout.readline, ''):
                        stripped = line.strip()
                        if stripped and on_log:
                            on_log(stripped)
                    proc.stdout.close()
                proc.wait()
                if proc.returncode != 0 and on_log:
                    on_log(f"Scrcpy berakhir dengan kode: {proc.returncode}")
            except Exception as e:
                if on_log:
                    on_log(f"Gagal menjalankan Scrcpy: {e}")

        threading.Thread(target=_spawn, daemon=True).start()
        return f"Scrcpy mode [{mode.upper()}] berjalan{record_msg}."


class ScrcpyUpdaterService(IUpdaterService):
    GITHUB_API = "https://api.github.com/repos/Genymobile/scrcpy/releases/latest"

    def __init__(self, base_dir: str, scrcpy_bin: str):
        self.base_dir = base_dir
        self.scrcpy_bin = scrcpy_bin

    def get_current_version(self) -> str:
        if not os.path.exists(self.scrcpy_bin):
            return "0.0"
        try:
            extra_kwargs = {"creationflags": NO_WINDOW_FLAG} if sys.platform == "win32" else {}
            res = subprocess.run(
                [self.scrcpy_bin, "--version"],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                timeout=4,
                **extra_kwargs
            )
            first_line = res.stdout.strip().splitlines()[0]
            parts = first_line.split()
            if len(parts) >= 2:
                return parts[1].lstrip('v')
            return "4.1"
        except Exception:
            return "4.1"

    def check_for_updates(self) -> Dict[str, Any]:
        curr_ver = self.get_current_version()
        try:
            req = urllib.request.Request(
                self.GITHUB_API,
                headers={"User-Agent": "ScrcpyStudio-Updater"}
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                if response.status != 200:
                    return {"has_update": False, "message": "Gagal terhubung ke GitHub API."}
                data = json.loads(response.read().decode('utf-8'))

            latest_tag = data.get("tag_name", "").lstrip("v")
            body_notes = data.get("body", "")

            download_url = None
            if sys.platform == "win32":
                for asset in data.get("assets", []):
                    name = asset.get("name", "").lower()
                    if "win64" in name and name.endswith(".zip"):
                        download_url = asset.get("browser_download_url")
                        break
            elif sys.platform == "darwin":
                # Check for macOS standalone archive if available
                for asset in data.get("assets", []):
                    name = asset.get("name", "").lower()
                    if "macos" in name or "darwin" in name or name.endswith(".tar.gz"):
                        download_url = asset.get("browser_download_url")
                        break

            def _parse_version(v_str):
                clean = ''.join(c for c in v_str if c.isdigit() or c == '.')
                return [int(x) for x in clean.split('.') if x.isdigit()]

            is_newer = False
            try:
                curr_parts = _parse_version(curr_ver)
                latest_parts = _parse_version(latest_tag)
                is_newer = latest_parts > curr_parts
            except Exception:
                is_newer = (latest_tag != curr_ver)

            # On macOS, if scrcpy is installed via Homebrew, guide user to brew upgrade
            brew_instruction = ""
            if sys.platform == "darwin" and not download_url:
                brew_instruction = "\n\n(Di macOS: Jalankan 'brew upgrade scrcpy' di Terminal untuk memperbarui binary engine)."

            return {
                "has_update": is_newer,
                "current_version": curr_ver,
                "latest_version": latest_tag,
                "release_notes": (body_notes[:400] if body_notes else "") + brew_instruction,
                "download_url": download_url
            }
        except Exception as e:
            return {
                "has_update": False,
                "current_version": curr_ver,
                "message": f"Koneksi gagal atau rate limited: {e}"
            }

    def download_and_apply_update(self, download_url: str) -> Dict[str, Any]:
        temp_zip = os.path.join(self.base_dir, "scrcpy_update_temp.zip")
        extract_dir = os.path.join(self.base_dir, "scrcpy_extracted_temp")

        try:
            kill_scrcpy_process()
            req = urllib.request.Request(download_url, headers={"User-Agent": "ScrcpyStudio-Updater"})
            with urllib.request.urlopen(req, timeout=60) as response, open(temp_zip, 'wb') as out_file:
                shutil.copyfileobj(response, out_file)

            if os.path.exists(extract_dir):
                shutil.rmtree(extract_dir, ignore_errors=True)
            os.makedirs(extract_dir, exist_ok=True)

            with zipfile.ZipFile(temp_zip, 'r') as zip_ref:
                zip_ref.extractall(extract_dir)

            inner_dir = extract_dir
            subfolders = [f for f in os.listdir(extract_dir) if os.path.isdir(os.path.join(extract_dir, f))]
            if len(subfolders) == 1:
                inner_dir = os.path.join(extract_dir, subfolders[0])

            target_dest_dir = os.path.join(self.base_dir, "bin") if os.path.exists(os.path.join(self.base_dir, "bin")) else self.base_dir
            updated_files = []
            for item in os.listdir(inner_dir):
                s = os.path.join(inner_dir, item)
                d = os.path.join(target_dest_dir, item)
                if item.lower() in ["scrcpystudio.exe", "ui", "app_icon.ico", "installer.iss", "scrcpy_studio.py", "services.py"]:
                    continue
                if os.path.isfile(s):
                    shutil.copy2(s, d)
                    updated_files.append(item)

            if os.path.exists(temp_zip):
                os.remove(temp_zip)
            if os.path.exists(extract_dir):
                shutil.rmtree(extract_dir, ignore_errors=True)

            new_ver = self.get_current_version()
            return {
                "success": True,
                "message": f"Scrcpy berhasil diperbarui ke v{new_ver}!",
                "version": new_ver,
                "updated_files_count": len(updated_files)
            }
        except Exception as e:
            if os.path.exists(temp_zip):
                try: os.remove(temp_zip)
                except: pass
            if os.path.exists(extract_dir):
                try: shutil.rmtree(extract_dir, ignore_errors=True)
                except: pass
            return {"success": False, "message": f"Gagal menerapkan update: {e}"}
