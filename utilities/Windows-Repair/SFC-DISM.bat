@echo off
if _%1_==_payload_  goto :payload
:getadmin
echo Computer Repair Script
echo UAC Prompt (Run as Administrator) must be accepted...in order for the script to work.
set vbs=%temp%\getadmin.vbs
echo Set UAC = CreateObject^("Shell.Application"^)                >> "%vbs%"
echo UAC.ShellExecute "%~s0", "payload %~sdp0 %*", "", "runas", 1 >> "%vbs%"
"%temp%\getadmin.vbs"
del "%temp%\getadmin.vbs"
goto :eof

:payload
cls
echo.
echo UAC prompt accepted... we continue:
echo.
echo Running SFC (System File Checker)
echo This checks for corrupted system files that can be easily restored by the tool.
echo.
echo Command is: "sfc /scannow".
sfc /scannow
pause
echo.
echo Running Deployment Image Servicing and Management (DISM.exe)
echo This command checks the health of the Deployment Image Servicing and Management library.
echo Command is: "DISM /Online /Cleanup-Image /CheckHealth".
echo.
DISM /Online /Cleanup-Image /CheckHealth
pause
echo This command scans the health of the Deployment Image Servicing and Management library
echo Command is: "DISM /Online /Cleanup-Image /ScanHealth".
echo.
DISM /Online /Cleanup-Image /ScanHealth
pause
echo This command restores any corruptions of the Deployment Image Servicing and Management library
echo Command is: "DISM /Online /Cleanup-Image /RestoreHealth".
DISM /Online /Cleanup-Image /RestoreHealth
pause
echo This command verifies the WMI repository
echo Command is: "winmgmt /verifyrepository".
winmgmt /verifyrepository
pause
echo This command attempts to salvage the WMI repository
echo Command is: "winmgmt /salvagerepository".
winmgmt /salvagerepository
pause
echo This command verifies the WMI repository
echo Command is: "winmgmt /verifyrepository".
winmgmt /verifyrepository
pause
echo If the previous command reports that the repository is not consistent,
echo then you need to run the following command manually:
echo winmgmt /resetrepository
echo if that doesn't work please review https://www.thewindowsclub.com/how-to-repair-or-rebuild-the-wmi-repository-on-windows-10
pause
echo I hope you read the above, it's really important!
echo.
pause
echo Please pay attention the previous warning as it will illustrate issues with your current Windows installation!
echo If you did not see any messages about corruption, or consistentcy issues you can safely restart.
echo Otherwise please review the messages above + ask in #tech-support / google solutions if impatient.
echo.
pause
goto :eof

:eof
exit