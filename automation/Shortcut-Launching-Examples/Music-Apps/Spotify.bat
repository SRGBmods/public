@echo off
REM
REM You will need to set the layout you have created for Audio Visualizers
REM
explorer "signalrgb://layout/apply/Pump%%20Up%%20Beats?-silentlaunch-"

REM We need to wait at least 2 seconds before firing the next SignalRGB command
timeout 2

REM
REM You will need to make sure an Audio Visual Effect is installed
REM
REM "Ripple%%20Visualizer", "Fire%%20Visualizer", "Rave%%20Visualizer%, "Particle%%20Visualizer",
REM "Tesla%%20Coil", "Sunset%%20Visualizer", "Sunrise%%20Visualizer", "Sonic%%20Bubbles", "RGBarz",
REM "Bars%%20Visualizer", or "Pump%%20Up%%20Beats"
REM
REM Are the current values (available effects right now
REM
explorer "signalrgb://effect/apply/Pump%%20Up%%20Beats?-silentlaunch-"

REM Start the program
start %appdata%\Spotify\Spotify.exe
