export function Name() { return "Glorious GMMK 2"; }
export function VendorId() { return 0x320F; }
export function ProductId() { return 0x504B; }
export function Publisher() { return "WhirlwindFX"; }
export function Size() { return [21, 6]; }
export function DefaultPosition(){return [10, 100]; }
export function DefaultScale(){return 8.0}
export function ControllableParameters() {
	return [
		{"property":"shutdownColor", "group":"lighting", "label":"Shutdown Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
		{"property":"LightingMode", "group":"lighting", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
		{"property":"forcedColor", "group":"lighting", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
	];
}

const vKeys65 = 
[
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14,
    15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,
    30,31,32,33,34,35,36,37,38,39,40,41,   42,43, 
    44,   45,46,47,48,49,50,51,52,53,54,55,56,57, 
    58,59,60,         61,         62,63,64,65,66,

    67,68,69,70,71,72,73,74,75,76,
    77,78,79,80,81,82,83,84,85,86,
    87 //Null Key
];
const vKeyNames65 = 
	[  
    "Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-_", "=+", "Backspace", "Delete", //15
    "Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\", "Page Up", //15
    "CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'",  "Enter", "Page Down", //14
    "Left Shift",    "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/",     "Right Shift", "Up Arrow", "End", //14
    "Left Ctrl", "Left Win", "Left Alt","Space", "Right Alt", "Fn",  "Left Arrow", "Down Arrow", "Right Arrow", //9

    "Right LED 1","Right LED 2","Right LED 3","Right LED 4","Right LED 5","Right LED 6","Right LED 7 ","Right LED 8","Right LED 9","Right LED 10",
    "Left LED 1","Left LED 2","Left LED 3","Left LED 4", "Left LED 5", "Left LED 6", "Left LED 7","Left LED 8", "Left LED 9", "Left LED 10", "Null Key",
];

const vKeyPositions65 = 
[
    [1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0], [8,0], [9,0], [10,0], [11,0], [12,0], [13,0], [14,0], [15,0],  //15
    [1,1], [2,1], [3,1], [4,1], [5,1], [6,1], [7,1], [8,1], [9,1], [10,1], [11,1], [12,1], [13,1], [14,1], [15,1], //15
    [1,2], [2,2], [3,2], [4,2], [5,2], [6,2], [7,2], [8,2], [9,2], [10,2], [11,2], [12,2],         [14,2], [15,2], //14
    [1,3],        [3,3], [4,3], [5,3], [6,3], [7,3], [8,3], [9,3], [10,3], [11,3], [12,3], [13,3], [14,3], [15,3], //14
    [1,4], [2,4], [3,4],                      [7,4],                       [11,4], [12,4], [13,4], [14,4], [15,4], //8

    [0,1],[0,1],[0,1],[0,2],[0,2],[0,2],[0,2],[0,3],[0,3],[0,3],[0,0],
    [16,1],[16,1],[16,1],[16,2],[16,2],[16,2],[16,3],[16,3],[16,3],[16,4],
    
];

const vKeys65ISO = 
[
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14,
    15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,
    30,31,32,33,34,35,36,37,38,39,40,41,   42,43, 
    44,   45,46,47,48,49,50,51,52,53,54,55,56,57, 
    58,59,60,         61,         62,63,64,65,66,

    67,68,69,70,71,72,73,74,75,76,
    77,78,79,80,81,82,83,84,85,86,
    87 //Null Key
];
const vKeyNames65ISO = 
	[  
    "Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-_", "=+", "Backspace", "Delete", //15
    "Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\", "Page Up", //15
    "CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'",  "Enter", "Page Down", //14
    "Left Shift",    "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/",     "Right Shift", "Up Arrow", "End", //14
    "Left Ctrl", "Left Win", "Left Alt","Space", "Right Alt", "Fn",  "Left Arrow", "Down Arrow", "Right Arrow", //9

    "Right LED 1","Right LED 2","Right LED 3","Right LED 4","Right LED 5","Right LED 6","Right LED 7 ","Right LED 8","Right LED 9","Right LED 10",
    "Left LED 1","Left LED 2","Left LED 3","Left LED 4", "Left LED 5", "Left LED 6", "Left LED 7","Left LED 8", "Left LED 9", "Left LED 10", "Null Key",
];

const vKeyPositions65ISO = 
[
    [1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0], [8,0], [9,0], [10,0], [11,0], [12,0], [13,0], [14,0], [15,0],  //15
    [1,1], [2,1], [3,1], [4,1], [5,1], [6,1], [7,1], [8,1], [9,1], [10,1], [11,1], [12,1], [13,1], [14,1], [15,1], //15
    [1,2], [2,2], [3,2], [4,2], [5,2], [6,2], [7,2], [8,2], [9,2], [10,2], [11,2], [12,2],         [14,2], [15,2], //14
    [1,3],        [3,3], [4,3], [5,3], [6,3], [7,3], [8,3], [9,3], [10,3], [11,3], [12,3], [13,3], [14,3], [15,3], //14
    [1,4], [2,4], [3,4],                      [7,4],                       [11,4], [12,4], [13,4], [14,4], [15,4], //8

    [0,1],[0,1],[0,1],[0,2],[0,2],[0,2],[0,2],[0,3],[0,3],[0,3],[0,0],
    [16,1],[16,1],[16,1],[16,2],[16,2],[16,2],[16,3],[16,3],[16,3],[16,4],
];

const vKeys96 = 
[
    0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10, 11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
    54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65,         66, 67, 68, 69,
    70,     71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
    87, 88, 89,             90,             91, 92, 93, 94, 95, 96, 97, 98,
    99,100,101,102,103,104,105,106,107,108,109,
       110,111,112,113,114,115,116,117,118,
];
const vKeyNames96 = 
[
	"Esc",       "F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12",  "Print Screen",                                "Delete", "Insert", "Page Up", "Page Down", //18 
     "`",        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",  "-",  "+",    "Backspace",                                   "Numlock","Num /",  "Num *",   "Num -", //18
    "Tab",       "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[",  "]",     "\\",                                          "Num 7",  "Num 8",  "Num 9",   "Num +", //18
    "CapsLock",  "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'","Enter",                                                  "Num 4", "Num 5", "Num 6",              //16                       
    "Left Shift","Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Right Shift",                  "Up Arrow",                   "Num 1",  "Num 2",  "Num 3",   "Num Enter",  //17               
    "Left Ctrl", "Left Win", "Left Alt", "Space", "Right Alt", "Fn", "Right Ctrl",  "Left Arrow",  "Down Arrow", "Right Arrow",  "Num 0", "Num .", //12
    "Right LED 1","Right LED 2","Right LED 3","Right LED 4","Right LED 5","Right LED 6","Right LED 7 ","Right LED 8","Right LED 9","Right LED 10",
    "Left LED 1","Left LED 2","Left LED 3","Left LED 4", "Left LED 5", "Left LED 6", "Left LED 7","Left LED 8", "Left LED 9", "Left LED 10",
];

const vKeyPositions96 = 
[
    [1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],       [12,0], [13,0], [14,0], [15,0], [16,0], [17,0], [18,0], [19,0], //18
    [1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],[12,1],         [14,1], [15,1], [16,1], [17,1], [18,1], [19,1], //18
    [1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],         [14,2], [15,2], [16,2], [17,2], [18,2], [19,2], //18
    [1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3],[12,3],                 [15,3], [16,3], [17,3], [18,3],         //16
    [1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],[12,4],                 [15,4], [16,4], [17,4], [18,4], [19,4], //17
    [1,5],[2,5],[3,5],                  [7,5],                   [11,5],[12,5], [13,5], [14,5], [15,5], [16,5], [17,5], [18,5],        //12
    
    [0,0],[0,1],[0,1],[0,2],[0,2],[0,3],[0,3],[0,4],[0,4],[0,5],
    [20,0],[20,1],[20,1],[20,2],[20,2],[20,3],[20,3],[20,4],[20,4],[20,5],

];

const vKeys96ISO = 
[
    0,  1,  2,  3,  4,  5,  6,  7,  8,  9,  10, 11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
    54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65,         66, 67, 68, 69,
    70,     71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
    87, 88, 89,             90,             91, 92, 93, 94, 95, 96, 97, 98,
    99,100,101,102,103,104,105,106,107,108,109,
       110,111,112,113,114,115,116,117,118
];
const vKeyNames96ISO = 
[
	"Esc",       "F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12",  "Print Screen",                                "Delete", "Insert", "Page Up", "Page Down", //18 
     "`",        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",  "-",  "+",    "Backspace",                                   "Numlock","Num /",  "Num *",   "Num -", //18
    "Tab",       "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[",  "]",     "\\",                                          "Num 7",  "Num 8",  "Num 9",   "Num +", //18
    "CapsLock",  "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'","Enter",                                                  "Num 4", "Num 5", "Num 6",              //16                       
    "Left Shift","Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Right Shift",                  "Up Arrow",                   "Num 1",  "Num 2",  "Num 3",   "Num Enter",  //17               
    "Left Ctrl", "Left Win", "Left Alt", "Space", "Right Alt", "Fn", "Right Ctrl",  "Left Arrow",  "Down Arrow", "Right Arrow",  "Num 0", "Num .", //12
    "Right LED 1","Right LED 2","Right LED 3","Right LED 4","Right LED 5","Right LED 6","Right LED 7 ","Right LED 8","Right LED 9","Right LED 10",
    "Left LED 1","Left LED 2","Left LED 3","Left LED 4", "Left LED 5", "Left LED 6", "Left LED 7","Left LED 8", "Left LED 9", "Left LED 10", 
];

const vKeyPositions96ISO = 
[
    [1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],       [12,0], [13,0], [14,0], [15,0], [16,0], [17,0], [18,0], [19,0], //18
    [1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],[12,1],         [14,1], [15,1], [16,1], [17,1], [18,1], [19,1], //18
    [1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],         [14,2], [15,2], [16,2], [17,2], [18,2], [19,2], //18
    [1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3],[12,3],                 [15,3], [16,3], [17,3], [18,3],         //16
    [1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],[12,4],                 [15,4], [16,4], [17,4], [18,4], [19,4], //17
    [1,5],[2,5],[3,5],                  [7,5],                   [11,5],[12,5], [13,5], [14,5], [15,5], [16,5], [17,5], [18,5],        //12
    
    [0,0],[0,1],[0,1],[0,2],[0,2],[0,3],[0,3],[0,4],[0,4],[0,5],
    [20,0],[20,1],[20,1],[20,2],[20,2],[20,3],[20,3],[20,4],[20,4],[20,5],

];

let LEDCount = 0;
let FirmwareType = 2;
var UniqueIdentifierByte3 = 0;

export function LedNames() 
{
    if(UniqueIdentifierByte3 == 9)
    {
    return vKeyNames96;
    }
    else if(UniqueIdentifierByte3 == 10)
    {
    return vKeyNames96ISO;
    }
    else if(UniqueIdentifierByte3 == 8)
    {
    return vKeyNames65ISO;
    }
    else
    {
    return vKeyNames65;
    }
}

export function LedPositions() 
{
    if(UniqueIdentifierByte3 == 9)
    {
    return vKeyPositions96;
    }
    else if(UniqueIdentifierByte3 == 10)
    {
    return vKeyPositions96ISO;
    }
    else if(UniqueIdentifierByte3 == 8)
    {
    return vKeyPositions65ISO;
    }
    else
    {
    return vKeyPositions65;
    }
}

export function Initialize() 
{
    ClearReadBuffer();
    checkFirmwareType();
    versionQMK();
    versionSignalRGBProtocol();
    uniqueIdentifier();
    device.repollLeds();
    effectEnable();
    totalLEDs();
}

export function Render() 
{
    sendColors();
}

export function Shutdown() 
{
    effectDisable();
}

function checkFirmwareType()
{
    let packet = [];
    packet[0] = 0x00;
    packet[1] = 0x08;

    device.write(packet, 32);

    let returnpacket = device.read(packet,32);
    let FirmwareTypeByte = returnpacket[2];
    if(FirmwareTypeByte == 1)
    {
        FirmwareType = 0x01;
    }
    if(FirmwareTypeByte == 3)
    {
        FirmwareType = 0x03;
    }
    device.log("Firmware Type: " + FirmwareTypeByte);
    device.pause(30);
}

function ClearReadBuffer(timeout = 10) //Clear Read buffer to get correct values out of our read functions
{
    let count = 0;
    let readCounts = [];

    while(device.getLastReadSize() > 0)
    {
        device.read([0x00], 32, timeout);
        count++;
        readCounts.push(device.getLastReadSize());
    }
}

function versionQMK() //Check the version of QMK Firmware that the keyboard is running
{
    let packet = [];
    packet[0] = 0x00;

    if(FirmwareType === 0x02)
    {
        packet[1] = 0x21;  
    }
    else
    {
        packet[1] = 0x01;
    }
    

    device.write(packet, 32);

    let returnpacket = device.read(packet,32);
    let QMKVersionByte1 = returnpacket[2];
    let QMKVersionByte2 = returnpacket[3];
    let QMKVersionByte3 = returnpacket[4];
    device.log("QMK Version: " + QMKVersionByte1 + "." + QMKVersionByte2 + "." + QMKVersionByte3);
    device.pause(30);
}

function versionSignalRGBProtocol() //Grab the version of the SignalRGB Protocol the keyboard is running
{
    let packet = [];
    packet[0] = 0x00;

    if(FirmwareType === 0x02)
    {
        packet[1] = 0x22;  
    }
    else
    {
        packet[1] = 0x02;
    }

    device.write(packet,32);  

    let returnpacket = device.read(packet,32);
    let ProtocolVersionByte1 = returnpacket[2];
    let ProtocolVersionByte2 = returnpacket[3];
    let ProtocolVersionByte3 = returnpacket[4];
    device.log("SignalRGB Protocol Version: " + ProtocolVersionByte1 + "." + ProtocolVersionByte2 + "." + ProtocolVersionByte3);
    device.pause(30);
}

function uniqueIdentifier() //Grab the unique identifier for this keyboard model
{
    let packet = [];
    packet[0] = 0x00;
    
    if(FirmwareType === 0x02)
    {
        packet[1] = 0x23;  
    }
    else
    {
        packet[1] = 0x03;
    }

    device.write(packet,32);  

    let returnpacket = device.read(packet,32);
    let UniqueIdentifierByte1 = returnpacket[2];
    let UniqueIdentifierByte2 = returnpacket[3];
    UniqueIdentifierByte3 = returnpacket[4];
    device.log("Unique Device Identifier: " + UniqueIdentifierByte1 + UniqueIdentifierByte2 + UniqueIdentifierByte3);
    device.pause(30);
}

function totalLEDs() //Calculate total number of LEDs
{
    let packet = [];
    packet[0] = 0x00;
   
    if(FirmwareType === 0x02)
    {
        packet[1] = 0x27;  
    }
    else
    {
        packet[1] = 0x07;
    }

    device.write(packet,32);  

    let returnpacket = device.read(packet,33);
    LEDCount = returnpacket[2];
    device.log("Device Total LED Count: " + LEDCount);
}

function effectEnable() //Enable the SignalRGB Effect Mode
{
    let packet = [];
    packet[0] = 0x00;
    
    if(FirmwareType === 0x02)
    {
        packet[1] = 0x25;  
    }
    else
    {
        packet[1] = 0x05;
    }

    device.write(packet,32);
    device.pause(30);
}

function effectDisable() //Revert to Hardware Mode
{
    let packet = [];
    packet[0] = 0x00;
    
    if(FirmwareType === 0x02)
    {
        packet[1] = 0x26;  
    }
    else
    {
        packet[1] = 0x06;
    }

    device.write(packet,32);  
}

function grabColors(shutdown = false) 
{
	let rgbdata = [];
    if(UniqueIdentifierByte3 == 9)
    {
        for(let iIdx = 0; iIdx < vKeys96.length; iIdx++)
        {
            let iPxX = vKeyPositions96[iIdx][0];
            let iPxY = vKeyPositions96[iIdx][1];
            let color;
    
            if(shutdown)
            {
                color = hexToRgb(shutdownColor);
            }
            else if (LightingMode === "Forced")
            {
                color = hexToRgb(forcedColor);
            }
            else
            {
                color = device.color(iPxX, iPxY);
            }
    
            let iLedIdx = vKeys96[iIdx] * 3;
            rgbdata[iLedIdx] = color[0];
            rgbdata[iLedIdx+1] = color[1];
            rgbdata[iLedIdx+2] = color[2];
        }
    
    }

    else if(UniqueIdentifierByte3 == 10)
    {
        for(let iIdx = 0; iIdx < vKeys96ISO.length; iIdx++)
        {
            let iPxX = vKeyPositions96ISO[iIdx][0];
            let iPxY = vKeyPositions96ISO[iIdx][1];
            let color;
    
            if(shutdown)
            {
                color = hexToRgb(shutdownColor);
            }
            else if (LightingMode === "Forced")
            {
                color = hexToRgb(forcedColor);
            }
            else
            {
                color = device.color(iPxX, iPxY);
            }
    
            let iLedIdx = vKeys96ISO[iIdx] * 3;
            rgbdata[iLedIdx] = color[0];
            rgbdata[iLedIdx+1] = color[1];
            rgbdata[iLedIdx+2] = color[2];
        }
    
    }

    else if(UniqueIdentifierByte3 == 8)
    {
        for(let iIdx = 0; iIdx < vKeys65ISO.length; iIdx++)
	{
		let iPxX = vKeyPositions65ISO[iIdx][0];
		let iPxY = vKeyPositions65ISO[iIdx][1];
		let color;

		if(shutdown)
		{
			color = hexToRgb(shutdownColor);
		}
		else if (LightingMode === "Forced")
		{
			color = hexToRgb(forcedColor);
		}
		else
		{
			color = device.color(iPxX, iPxY);
		}

		let iLedIdx = vKeys65ISO[iIdx] * 3;
		rgbdata[iLedIdx] = color[0];
		rgbdata[iLedIdx+1] = color[1];
		rgbdata[iLedIdx+2] = color[2];
	}

    }

    else
    {
        for(let iIdx = 0; iIdx < vKeys65.length; iIdx++)
	{
		let iPxX = vKeyPositions65[iIdx][0];
		let iPxY = vKeyPositions65[iIdx][1];
		let color;

		if(shutdown)
		{
			color = hexToRgb(shutdownColor);
		}
		else if (LightingMode === "Forced")
		{
			color = hexToRgb(forcedColor);
		}
		else
		{
			color = device.color(iPxX, iPxY);
		}

		let iLedIdx = vKeys65[iIdx] * 3;
		rgbdata[iLedIdx] = color[0];
		rgbdata[iLedIdx+1] = color[1];
		rgbdata[iLedIdx+2] = color[2];
	}

    }
	
	return rgbdata;
}

function sendColors()
{
    if(UniqueIdentifierByte3 == 9)
    {
    LEDCount = 119;
    }
	let rgbdata = grabColors();
    let totalpackets = Math.floor(LEDCount/9);
    let finalpacketoffset = (totalpackets*9);
    let finalpacketledstosend = (LEDCount - finalpacketoffset)
    
    for(var index = 0; index < totalpackets; index++) 
    {
	let packet = [];
    let offset = index * 9;
	packet[0] = 0x00;

    if(FirmwareType === 0x02)
    {
        packet[1] = 0x24;  
    }
    else
    {
        packet[1] = 0x04;
    }

	packet[2] = offset;
	packet[3] = 0x09;
	packet.push(...rgbdata.splice(0, 27));
	device.write(packet, 33);
    }

	let packet = []; 
	packet[0] = 0x00;
    
    if(FirmwareType === 0x02)
    {
        packet[1] = 0x24;  
    }
    else
    {
        packet[1] = 0x04;
    }

	packet[2] = finalpacketoffset;
	packet[3] = finalpacketledstosend;
	packet.push(...rgbdata.splice(0, finalpacketledstosend*3));
	device.write(packet, 33);
}


function hexToRgb(hex) 
{
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	let colors = [];
	colors[0] = parseInt(result[1], 16);
	colors[1] = parseInt(result[2], 16);
	colors[2] = parseInt(result[3], 16);

	return colors;
}

export function Validate(endpoint) 
{
	return endpoint.interface === 1;
}

export function Image() 
{
	return "";
}