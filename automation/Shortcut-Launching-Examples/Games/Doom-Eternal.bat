@echo off
REM -------------------------------------------------------------------------------------
REM If you are using the "while media is playing, show" rule, please change RULE=media
REM otherwise place keep it at always
set RULE=always
REM -------------------------------------------------------------------------------------

:APPLYLAYOUT
REM -------------------------------------------------------------------------------------
REM You will need to set the layout you have created for DOOM Eternal(Or a generic Game layout)
REM -------------------------------------------------------------------------------------
REM
REM Remember %%20 = a space
REM Edit the next line for your layout:
explorer "signalrgb://layout/apply/DOOM%%20Eternal?-silentlaunch-"

REM -------------------------------------------------------------------------------------
REM -------------------------------------------------------------------------------------
REM -------------------------------------------------------------------------------------
REM --------------------------------Do not edit anything below!--------------------------
REM -------------------------------------------------------------------------------------
REM -------------------------------------------------------------------------------------
goto gamelaunch

IF %RULE% == always (goto saveall)
IF %RULE% == media (goto savestatic)

:SAVEALL
FOR /F "skip=2 tokens=2,*" %%A IN ('reg query "HKEY_CURRENT_USER\SOFTWARE\WhirlwindFX\SignalRgb\effects\selected" /v "always"') DO set "CurrentEffect=%%B" > nul 2> nul
goto layoutsave

:SAVESTATIC
FOR /F "skip=2 tokens=2,*" %%A IN ('reg query "HKEY_CURRENT_USER\SOFTWARE\WhirlwindFX\SignalRgb\effects\selected" /v "dynamic"') DO set "CurrentEffect=%%B" > nul 2> nul
goto layoutsave

:LAYOUTSAVE
FOR /F "skip=2 tokens=2,*" %%A IN ('reg query "HKEY_CURRENT_USER\SOFTWARE\WhirlwindFX\SignalRgb\layouts" /v "always"') DO set "CurrentLayout=%%B" > nul 2> nul
goto applylayout

:GAMELAUNCH
timeout 2 > nul 2> nul
explorer "signalrgb://effect/apply/DOOM%%20Eternal?-silentlaunch-"
explorer steam://run/782330
goto exitcheck

:exitcheck
timeout 20 > nul 2> nul
tasklist /fi "imagename eq DOOMEternalx64vk.exe"|find /i "=========================" >nul 2>nul &&(
w32tm /stripchart /computer:localhost /period:10 /dataonly /samples:2  1>nul
goto :exitcheck
)

explorer "signalrgb://layout/apply/%CurrentLayout%?-silentlaunch-"
timeout 2 > nul 2> nul
explorer "signalrgb://effect/apply/%CurrentEffect%?-silentlaunch-" 