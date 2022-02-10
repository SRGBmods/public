*** SERIOUSLY ***
*** DO NOT USE THIS FILE IT IS INCOMPLETE ***
*** IT WILL NOT ADD ANYTHING FOR YOU! ***

export function Name() { return "Nuvoton nct6798d"; }
export function ProductId() { return 0xd428;}
export function Publisher() { return "WhirlwindFX"; }
export function ControllableParameters(){
    return [
        {"property":"SensorCount", "label":"Temperature Sensor Count","type":"number","min":"1", "max":"8","default":"0"},
        {"property":"FanCount", "label":"Fan Count","type":"number","min":"1", "max":"8","default":"0"},

        ];
}

/*

https://github.com/torvalds/linux/blob/master/drivers/hwmon/nct6775.c
https://github.com/LibreHardwareMonitor/LibreHardwareMonitor/blob/master/LibreHardwareMonitorLib/Hardware/Motherboard/Lpc/Nct677X.cs

const MAX_FAN_COUNT = 7
const MAX_TEMP_SENSOR_COUNT = 8

const ASUS_AURA_CONTROLLER_ID = 0xd428

const ASUS_AURA_CONTROLLER_GET_TEMPCONFIGURATION = 0x00
const ASUS_AURA_CONTROLLER_GET_TEMPSENSORS = 0xbfff0ffe //0x80000c00

const ASUS_AURA_CONTROLLER_GET_FANCONFIGURATION = 0x00
const ASUS_AURA_CONTROLLER_GET_FANRPM = 0x00;
const ASUS_AURA_CONTROLLER_GET_FANPERCENT = 0x00;
const ASUS_AURA_CONTROLLER_SET_FANPERCENT = 0x00;
const ASUS_AURA_CONTROLLER_SET_FANRPM = 0x00;

const ASUS_AURA_CONTROLLER_STREAM    = 0x00
const ASUS_AURA_CONTROLLER_COMMIT    = 0x00
const ASUS_AURA_CONTROLLER_START     = 0x00
const ASUS_AURA_CONTROLLER_RESET     = 0x00
const ASUS_AURA_CONTROLLER_MODE      = 0x00

VENDOR_ID_HIGH_REGISTER = 0x804F;
VENDOR_ID_LOW_REGISTER = 0x004F;

FAN_PWM_OUT_REG = new ushort[] { 0x001, 0x003, 0x011, 0x013, 0x015, 0xA09, 0xB09 };

case nct6798:
        return reg == 0x150 || reg == 0x153 || reg == 0x155 ||
          (reg & 0xfff0) == 0x4c0 ||
          reg == 0x402 ||
          reg == 0x63a || reg == 0x63c || reg == 0x63e ||
          reg == 0x640 || reg == 0x642 || reg == 0x64a ||
          reg == 0x64c ||
          reg == 0x73 || reg == 0x75 || reg == 0x77 || reg == 0x79 ||
          reg == 0x7b || reg == 0x7d;
    }

    

const ASUS_AURA_CONTROLLER_TEMP_LABEL = [
    "",
    "SYSTIN",
    "CPUTIN",
    "AUXTIN0",
    "AUXTIN1",
    "AUXTIN2",
    "AUXTIN3",
    "AUXTIN4",
    "SMBUSMASTER 0",
    "SMBUSMASTER 1",
    "Virtual_TEMP",
    "Virtual_TEMP",
    "",
    "",
    "",
    "",
    "PECI Agent 0",
    "PECI Agent 1",
    "PCH_CHIP_CPU_MAX_TEMP",
    "PCH_CHIP_TEMP",
    "PCH_CPU_TEMP",
    "PCH_MCH_TEMP",
    "Agent0 Dimm0",
    "Agent0 Dimm1",
    "Agent1 Dimm0",
    "Agent1 Dimm1",
    "BYTE_TEMP0",
    "BYTE_TEMP1",
    "PECI Agent 0 Calibration", // undocumented
    "PECI Agent 1 Calibration", // undocumented
    "",
    "Virtual_TEMP"
];

*/

*** SERIOUSLY ***
*** DO NOT USE THIS FILE IT IS INCOMPLETE ***
*** IT WILL NOT ADD ANYTHING FOR YOU! ***