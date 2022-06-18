@echo off
REM
REM You will need to set the layout you have created for PUBG (Or a generic Game layout)
REM
explorer "signalrgb://layout/apply/PUBG?-silentlaunch-"

REM We need to wait at least 2 seconds before firing the next SignalRGB command
timeout 2

REM
REM You must have the PUBG: Battlegrounds Effect installed for this to work
REM SignalRGB Pro is of course required for this.
REM
explorer "signalrgb://effect/apply/PUBG:%%20Battlegrounds?-silentlaunch-"

explorer steam://run/578080