@echo off
REM
REM You will need to set the layout you have created for Destiny 2 (Or a generic Game layout)
REM
explorer "signalrgb://layout/apply/Rainbow%%20Six%%20Siege?-silentlaunch-"

REM We need to wait at least 2 seconds before firing the next SignalRGB command
timeout 2

REM
REM You must have the Destiny 2 Effect installed for this to work
REM SignalRGB Pro is of course required for this.
REM
explorer "signalrgb://effect/apply/Rainbow%%20Six:%%20Siege?-silentlaunch-"

explorer steam://run/359550