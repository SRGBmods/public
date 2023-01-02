SFC (System File Checker)
This checks for corrupted system files that can be easily restored by the tool.

Command is: "**sfc /scannow**".

Running Deployment Image Servicing and Management (DISM.exe)
This command checks the health of the Deployment Image Servicing and Management library.

Command is: "**DISM /Online /Cleanup-Image /CheckHealth**".

DISM /Online /Cleanup-Image /CheckHealth
This command scans the health of the Deployment Image Servicing and Management library

Command is: "**DISM /Online /Cleanup-Image /ScanHealth**".

DISM /Online /Cleanup-Image /ScanHealth
This command restores any corruptions of the Deployment Image Servicing and Management library

Command is: "**DISM /Online /Cleanup-Image /RestoreHealth**".

This command verifies the WMI repository

Command is: "**winmgmt /verifyrepository**".

This command attempts to salvage the WMI repository

Command is: "**winmgmt /salvagerepository**".

This command verifies the WMI repository

Command is: "**winmgmt /verifyrepository**".

If the previous commands reports that the repository is not consistent,
then you need to run the following command manually:

if that doesn't work please review https://www.thewindowsclub.com/how-to-repair-or-rebuild-the-wmi-repository-on-windows-10

I hope you read the above, it's really important!
