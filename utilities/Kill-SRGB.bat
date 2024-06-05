@echo off
if _%1_==_payload_  goto :payload
:getadmin
echo Force Quit SignalRGB
echo UAC Prompt (Run as Administrator) must be accepted...in order for the script to work.
set vbs=%temp%\getadmin.vbs
echo Set UAC = CreateObject^("Shell.Application"^)                >> "%vbs%"
echo UAC.ShellExecute "%~s0", "payload %~sdp0 %*", "", "runas", 1 >> "%vbs%"
"%temp%\getadmin.vbs"
del "%temp%\getadmin.vbs"
goto :eof

:payload
echo Stopping Current SignalRGB Process
taskkill /f /im "SignalRgbLauncher.exe"
taskkill /f /im "SignalRgb.exe"
taskkill /f /im "SignalRgbSplash.exe"
goto cleanexit

:cleanexit
exit