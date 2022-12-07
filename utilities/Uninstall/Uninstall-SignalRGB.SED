[Version]
Class=IEXPRESS
SEDVersion=3
[Options]
PackagePurpose=InstallApp
ShowInstallProgramWindow=0
HideExtractAnimation=0
UseLongFileName=0
InsideCompressed=0
CAB_FixedSize=0
CAB_ResvCodeSigning=0
RebootMode=I
InstallPrompt=%InstallPrompt%
DisplayLicense=%DisplayLicense%
FinishMessage=%FinishMessage%
TargetName=%TargetName%
FriendlyName=%FriendlyName%
AppLaunched=%AppLaunched%
PostInstallCmd=%PostInstallCmd%
AdminQuietInstCmd=%AdminQuietInstCmd%
UserQuietInstCmd=%UserQuietInstCmd%
SourceFiles=SourceFiles
[Strings]
InstallPrompt=Uninstall SignalRGB?
DisplayLicense=
FinishMessage=Please do a Full Power Cycle.
TargetName=C:\Windows\system32\Uninstall-SignalRGB.EXE
FriendlyName=Uninstall SignalRGB
AppLaunched=cmd /c SRGB_uninstall.cmd
PostInstallCmd=<None>
AdminQuietInstCmd=
UserQuietInstCmd=
FILE0="SRGB_uninstall.cmd"
[SourceFiles]
SourceFiles0=D:\Naitoshedo\Documents\GitHub\WhirlwindFX\public\utilities\
[SourceFiles0]
%FILE0%=
