@echo off
REM -------------------------------------------------------------------------------------
REM If you are using the "while media is playing, show" rule, please change RULE=media
REM otherwise place keep it at always
set RULE=always
REM -------------------------------------------------------------------------------------

:APPLYLAYOUT
REM -------------------------------------------------------------------------------------
REM You will need to set the layout you have created for Team Fortress 2 (Or a generic Game layout)
REM -------------------------------------------------------------------------------------
REM
REM Remember %%20 = a space
REM Edit the next line for your layout:
explorer "signalrgb://layout/apply/Team%%20Fortress%%202?-silentlaunch-"

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
goto GameLaunch

:GAMELAUNCH
timeout 2 > nul 2> nul
explorer "signalrgb://effect/apply/Team%%20Fortress%%202?-silentlaunch-"
explorer steam://run/440
echo Press any key to return to previous effects
pause > nul 2> nul
explorer "signalrgb://layout/apply/%CurrentLayout%?-silentlaunch-"
timeout 2 > nul 2> nul
explorer "signalrgb://effect/apply/%CurrentEffect%?-silentlaunch-" 