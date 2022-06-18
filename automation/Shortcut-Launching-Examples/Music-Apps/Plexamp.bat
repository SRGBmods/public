@echo off
REM -------------------------------------------------------------------------------------
REM If you are using the "while media is playing, show" rule, please change RULE=media
REM otherwise place keep it at always
set RULE=always
REM -------------------------------------------------------------------------------------

:APPLYLAYOUT
REM -------------------------------------------------------------------------------------
REM You will need to make sure an Audio Visual Effect is installed
REM "Ripple%%20Visualizer", "Fire%%20Visualizer", "Rave%%20Visualizer%, "Particle%%20Visualizer",
REM "Tesla%%20Coil", "Sunset%%20Visualizer", "Sunrise%%20Visualizer", "Sonic%%20Bubbles", "RGBarz",
REM "Bars%%20Visualizer", or "Pump%%20Up%%20Beats"
REM -------------------------------------------------------------------------------------
REM
REM Remember %%20 = a space
REM Edit the next line for your layout:
explorer "signalrgb://layout/apply/Pump%%20Up%%20Beats?-silentlaunch-"

REM -------------------------------------------------------------------------------------
REM -------------------------------------------------------------------------------------
REM -------------------------------------------------------------------------------------
REM --------------------------------Do not edit anything below!--------------------------
REM -------------------------------------------------------------------------------------
REM -------------------------------------------------------------------------------------
goto launchapp

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

:LAUNCHAPP
timeout 2 > nul 2> nul
explorer "signalrgb://effect/apply/Pump%%20Up%%20Beats?-silentlaunch-"

REM Start the program
start "Plexamp" %localappdata%\Programs\plexamp\Plexamp.exe
echo Press any key to return to previous effects
pause > nul 2> nul
explorer "signalrgb://layout/apply/%CurrentLayout%?-silentlaunch-"
timeout 2 > nul 2> nul
explorer "signalrgb://effect/apply/%CurrentEffect%?-silentlaunch-" 
