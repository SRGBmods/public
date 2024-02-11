@echo off
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "datestamp=%YYYY%%MM%%DD%" & set "timestamp=%HH%%Min%%Sec%"
set "fullstamp=%YYYY%-%MM%-%DD%_%HH%-%Min%-%Sec%"
reg export HKEY_CURRENT_USER\SOFTWARE\WhirlwindFX\SignalRgb SignalRGB_ALL_Backup_"%fullstamp%".reg
reg export HKEY_CURRENT_USER\SOFTWARE\WhirlwindFX\SignalRgb\layouts SignalRGB_Layout_Backup_"%fullstamp%".reg
reg export HKEY_CURRENT_USER\SOFTWARE\WhirlwindFX\SignalRgb\devices SignalRGB_Devices_Backup_"%fullstamp%".reg
reg export HKEY_CURRENT_USER\SOFTWARE\WhirlwindFX\SignalRgb\lighting SignalRGB_Endpoint_Backup_"%fullstamp%".reg
reg export HKEY_CURRENT_USER\SOFTWARE\WhirlwindFX\SignalRgb\MacroBlocks SignalRGB_MacroBlocks_Backup_"%fullstamp%".reg
exit