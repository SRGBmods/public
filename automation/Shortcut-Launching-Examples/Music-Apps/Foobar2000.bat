@echo off
REM Do not change the following line (this launches the batch script minimized):
if not DEFINED IS_MINIMIZED set IS_MINIMIZED=1 && start "" /min "%~dpnx0" %* && exit

REM -------------------------------------------------------------------------------------
REM If you are using the "while media is playing, show" rule, please change RULE=media
REM otherwise place keep it at always
set RULE=always
REM -------------------------------------------------------------------------------------

:APPLYLAYOUT
REM -------------------------------------------------------------------------------------
REM You will need to set the layout you have created for the audio visualizers you use
REM -------------------------------------------------------------------------------------
REM
REM Remember %%20 = a space
REM Edit the next line for your layout:
set LAYOUT=Pump%%20Up%%20Beats

REM -------------------------------------------------------------------------------------
REM You will need to make sure an Audio Visual Effect is installed
REM "Ripple%%20Visualizer", "Fire%%20Visualizer", "Rave%%20Visualizer%, "Particle%%20Visualizer",
REM "Tesla%%20Coil", "Sunset%%20Visualizer", "Sunrise%%20Visualizer", "Sonic%%20Bubbles", "RGBarz",
REM "Bars%%20Visualizer", or "Pump%%20Up%%20Beats"
REM -------------------------------------------------------------------------------------
set VEFFECT=Pump%%20Up%%20Beats


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

:gamelaunch
REM Start the program
explorer "signalrgb://layout/apply/%Layout%?-silentlaunch-"
timeout 2 > nul 2> nul
explorer "signalrgb://effect/apply/%VEFFECT%?-silentlaunch-"
start "Foobar 2000" /B "C:\Program Files\foobar2000\foobar2000.exe"
timeout 2 > nul 2> nul
goto exitcheck

:exitcheck
tasklist /fi "imagename eq foobar2000.exe"|find /i "=========================" >nul 2>nul &&(
w32tm /stripchart /computer:localhost /period:10 /dataonly /samples:2  1>nul
goto exitcheck
)

explorer "signalrgb://layout/apply/%CurrentLayout%?-silentlaunch-"
timeout 2 > nul 2> nul
explorer "signalrgb://effect/apply/%CurrentEffect%?-silentlaunch-" 
exit
