; Script generated for Scrcpy Studio Installer
#define MyAppName "Scrcpy Studio"
#define MyAppVersion "2.0"
#define MyAppPublisher "Scrcpy Tools"
#define MyAppExeName "ScrcpyStudio.exe"

#ifndef MyAppVersion
#define MyAppVersion "2.0"
#endif

[Setup]
AppId={{D37F869A-1F96-4A59-8664-927FDE39712B}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\{#MyAppName}
DisableProgramGroupPage=yes
OutputBaseFilename=ScrcpyStudio_Windows_Setup
OutputDir=installer_output
Compression=lzma
SolidCompression=yes
WizardStyle=modern
SetupIconFile=app_icon.ico
UninstallDisplayIcon={app}\{#MyAppExeName}
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog
CloseApplications=force
CloseApplicationsFilter=*.exe
RestartApplications=no

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
; Main Executable from PyInstaller dist
Source: "dist\ScrcpyStudio.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "app_icon.ico"; DestDir: "{app}"; Flags: ignoreversion
; Scrcpy & ADB engine folder (if exists)
Source: "bin\*"; DestDir: "{app}\bin"; Flags: ignoreversion recursesubdirs createallsubdirs; Tasks: ; Check: DirExists(ExpandConstant('{src}\bin'))
; UI folder
Source: "ui\*"; DestDir: "{app}\ui"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\app_icon.ico"
Name: "{userdesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\app_icon.ico"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[Code]
procedure KillProcess(const ExeName: String);
var
  ResultCode: Integer;
begin
  Exec('taskkill.exe', '/F /T /IM ' + ExeName, '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
end;

function InitializeSetup(): Boolean;
begin
  KillProcess('ScrcpyStudio.exe');
  KillProcess('adb.exe');
  Result := True;
end;

function InitializeUninstall(): Boolean;
begin
  KillProcess('ScrcpyStudio.exe');
  KillProcess('adb.exe');
  Result := True;
end;
