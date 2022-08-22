@echo off
REM Do not change the following line (this launches the batch script minimized):
if not DEFINED IS_MINIMIZED set IS_MINIMIZED=1 && start "" /min "%~dpnx0" %* && exit

REM -------------------------------------------------------------------------------------
REM -------------------------------------------------------------------------------------
REM -------------------------------------------------------------------------------------
REM -----------------------Make sure to update RULE and LAYOUT!--------------------------
REM -------------------------------------------------------------------------------------
REM -------------------------------------------------------------------------------------

REM If you are using the "while media is playing, show" rule, please change RULE=media
REM otherwise place keep it at always
set RULE=always

REM You will need to set the layout you have created for the game.
REM Remember %%20 = a space
REM Edit the next line for your layout:
set LAYOUT=Screen

REM -------------------------------------------------------------------------------------
REM -------------------------------------------------------------------------------------
REM -------------------------------------------------------------------------------------
REM --------------------------------Do not edit anything below!--------------------------
REM -------------------------------------------------------------------------------------
REM -------------------------------------------------------------------------------------

IF %RULE% == always (goto saveall)
IF %RULE% == media (goto savestatic)

:SAVEALL
FOR /F "skip=2 tokens=2,*" %%A IN ('reg query "HKEY_CURRENT_USER\SOFTWARE\WhirlwindFX\SignalRgb\effects\selected" /v "always"') DO set "CurrentEffect=%%B" > nul 2> nul
goto layoutsave

:SAVESTATIC
FOR /F "skip=2 tokens=2,*" %%A IN ('reg query "HKEY_CURRENT_USER\SOFTWARE\WhirlwindFX\SignalRgb\effects\selected" /v "dynamic"') DO set "CurrentEffect=%%B" > nul 2> nul
goto layoutsave

:LAYOUTSAVE
FOR /F "skip=2 tokens=2,*" %%A IN ('reg query "HKEY_CURRENT_USER\SOFTWARE\WhirlwindFX\SignalRgb\layouts" /v "currentLayout"') DO set "CurrentLayout=%%B" > nul 2> nul
goto gamelaunch

:GAMELAUNCH
explorer "signalrgb://layout/apply/%Layout%?-silentlaunch-"
timeout 2 > nul 2> nul
explorer "signalrgb://effect/apply/Minecraft%%20Java%%20Edition?-silentlaunch-"
for /f tokens^=2^ delims^=^" %%i in ('reg query HKEY_CLASSES_ROOT\jarfile\shell\open\command /ve') do set JAVAW_PATH=%%i
start "Minecraft Java Edition" /D "%appdata%\.minecraft\bin" "%JAVAW_PATH% -Xms512m -Xmx1g -Djava.library.path=natives/ -cp '%appdata%\.minecraft\bin\minecraft.jar;%appdata%\.minecraft\bin\lwjgl.jar;%appdata%\.minecraft\bin\lwjgl_util.jar' net.minecraft.client.Minecraft"
goto exitcheck

:exitcheck
timeout 20 > nul 2> nul
tasklist /fi "imagename eq javaw.exe"|find /i "=========================" >nul 2>nul &&(
w32tm /stripchart /computer:localhost /period:10 /dataonly /samples:2  1>nul
goto :exitcheck
)

:removemelater
explorer "signalrgb://layout/apply/%CurrentLayout%?-silentlaunch-"
timeout 2 > nul 2> nul
explorer "signalrgb://effect/apply/%CurrentEffect%?-silentlaunch-"