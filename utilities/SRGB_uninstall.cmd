@echo off
if _%1_==_payload_  goto :payload

echo UAC Prompt must be accepted...
set vbs=%temp%\getadmin.vbs
echo Set UAC = CreateObject^("Shell.Application"^)                >> "%vbs%"
echo UAC.ShellExecute "%~s0", "payload %~sdp0 %*", "", "runas", 1 >> "%vbs%"
"%temp%\getadmin.vbs"
del "%temp%\getadmin.vbs"
goto error

:payload
cls
echo:
echo ====================================================
echo    [94mSignalRGB Uninstall[0m batch script by FeuerSturm
echo ====================================================
echo:
timeout /t 1 > nul 2> nul
echo Killing SignalRGB...
taskkill /IM SignalRgb.exe /t /f > nul 2> nul
timeout /t 5 > nul 2> nul
echo Creating full backup of Registry Keys...
CHCP 1251 >Nul
for /f "usebackq tokens=1,2,*" %%B IN (`reg query "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders" /v Desktop`) do set DESKTOP=%%D
CHCP 866 >Nul
for /f "delims=" %%i IN ('echo %DESKTOP%') do set DESKTOP=%%i
reg export HKEY_CURRENT_USER\SOFTWARE\WhirlwindFX %DESKTOP%\SRGB_Full_Backup_%RANDOM%.reg > nul 2> nul
timeout /t 5 > nul 2> nul
echo Running Uninstaller...
start /WAIT %LocalAppData%\VortxEngine\Update.exe --uninstall > nul 2> nul
timeout /t 1 > nul 2> nul
echo Deleting folder "%LocalAppData%\VortxEngine"...
rmdir "%LocalAppData%\VortxEngine" /s /q > nul 2> nul
timeout /t 1 > nul 2> nul
echo Deleting folder "%LocalAppData%\whirlwindengine.firebaseio.com"...
rmdir "%LocalAppData%\whirlwindengine.firebaseio.com" /s /q > nul 2> nul
timeout /t 1 > nul 2> nul
echo Deleting folder "%LocalAppData%\WhirlwindFX"...
rmdir "%LocalAppData%\WhirlwindFX" /s /q > nul 2> nul
timeout /t 1 > nul 2> nul
echo Deleting User Directories...
FOR /F "skip=2 tokens=2,*" %%A IN ('reg query "HKEY_CURRENT_USER\SOFTWARE\WhirlwindFX\SignalRgb" /v "UserDirectory"') DO set "UserDir=%%B" > nul 2> nul
timeout /t 1 > nul 2> nul
rmdir "%UserDir%" /s /q > nul 2> nul
timeout /t 1 > nul 2> nul
CHCP 1251 >Nul
for /f "usebackq tokens=1,2,*" %%B IN (`reg query "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders" /v Documents`) do set UDOCUMENTS=%%D
CHCP 866 >Nul
for /f "delims=" %%i IN ('echo %UDOCUMENTS%') do set UDOCUMENTS=%%i
IF EXIST "%UDOCUMENTS%\Documents\WhirlwindFX" (
    rmdir "%UDOCUMENTS%\Documents\WhirlwindFX" /s /q
)
timeout /t 1 > nul 2> nul
echo Deleting Registry Keys
REG DELETE "HKEY_CURRENT_USER\SOFTWARE\WhirlwindFX" /f > nul 2> nul
timeout /t 1 > nul 2> nul
echo Deleting Login Credentials...
cmdkey /delete:whirlwindengine.firebase.auth/__FIRAPP_DEFAULT[0]
cmdkey /delete:whirlwindengine.firebase.auth/__FIRAPP_DEFAULT[1]
timeout /t 1 > nul 2> nul
echo Attempting to remove SignalRgbDriver.sys
taskkill /f /im "SignalRgbLauncher.exe"
taskkill /f /im "SignalRgb.exe"
taskkill /f /im "SignalRgbSplash.exe"
net stop signalrgbdriver
takeown /f C:\Windows\System32\drivers\SignalRgbDriver.sys
icacls "C:\Windows\System32\drivers\SignalRgbDriver.sys" /Q /grant %%username%%:f
del "C:\Windows\System32\drivers\SignalRgbDriver.sys" /q /f
timeout /t 1 > nul 2> nul
echo:
echo ===============
echo    [94mAll done![0m
echo ===============
echo:
pause 10
goto exit

:error
echo UAC prompt must be accepted
goto exit

:exit