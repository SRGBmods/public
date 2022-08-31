export function Name() { return "Logitech Wireless Dongle"; }
export function VendorId() { return 0x046d; }
export function ProductId() { return 0xC547; }//0xC541
export function Publisher() { return "WhirlwindFX"; }
export function Size() { return [24, 9]; }
export function DefaultPosition(){return [10, 100];}
const DESIRED_HEIGHT = 85;
export function DefaultScale(){return Math.floor(DESIRED_HEIGHT/Size()[1]);}
export function ControllableParameters(){
    return [
        {"property":"shutdownColor", "group":"lighting", "label":"Shutdown Color","min":"0","max":"360","type":"color","default":"009bde"},
        {"property":"LightingMode", "group":"lighting", "label":"Lighting Mode", "type":"combobox", "values":["Canvas","Forced"], "default":"Canvas"},
        {"property":"forcedColor", "group":"lighting", "label":"Forced Color","min":"0","max":"360","type":"color","default":"009bde"},
        {"property":"DpiControl", "group":"mouse", "label":"Enable Dpi Control","type":"boolean","default":"false"},
        {"property":"dpi1", "group":"mouse", "label":"DPI 1","step":"50", "type":"number","min":"200", "max":"25600","default":"400"},
		{"property":"dpi2", "group":"mouse", "label":"DPI 2","step":"50", "type":"number","min":"200", "max":"25600","default":"800"},
		{"property":"dpi3", "group":"mouse", "label":"DPI 3","step":"50", "type":"number","min":"200", "max":"25600","default":"1200"},
		{"property":"dpi4", "group":"mouse", "label":"DPI 4","step":"50", "type":"number","min":"200", "max":"25600","default":"1600"},
		{"property":"dpi5", "group":"mouse", "label":"DPI 5","step":"50", "type":"number","min":"200", "max":"25600","default":"2000"},
		{"property":"dpi6", "group":"mouse", "label":"Sniper Button DPI","step":"50", "type":"number","min":"200", "max":"25600","default":"400"},
		{"property":"DpiLight", "group":"lighting", "label":"DPI Light Always On","type":"boolean","default": "true"},
		{"property":"OnboardState", "group":"", "label":"Onboard Button Mode","type":"boolean","default": "false"},
		{"property":"DPIRollover", "group":"mouse", "label":"DPI Stage Rollover","type":"boolean","default": "false"},
		{"property":"pollingrate", "group":"mouse", "label":"Polling Rate","type":"combobox", "values":[ "1000","500", "250", "100" ], "default":"1000"},
    ];
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

var Hero = false;
var DeviceId;
var TransactionId;
var deviceName;
var InfoID;
var RGBFeatureID;
var PollingRateID;
var ButtonSpyID;
var DisableKeysID;
var GKeyID;
var MKeyID;
var MRID;
var KeyboardLayout2ID;
var PersistentRemappableActionID;
var LEDCtrlID;
var DpiID;
var BattID = 0;
var UnifiedBattID;
var Sniper;
var Sleep = false;
var OnboardID;
var OnBoardState;
var DPIStage = 1;
var savedPollTimer = Date.now();
var PollModeInternal = 15000;
var battindicator = false;
var logidevicetype = "Mouse"; //Fallback as mouse is more common than keeb in case of failure.


const vLedNames = ["Primary Zone", "Logo Zone"];
const vLedPositions = [ [0,1],[0,2] ];

let vG915LedNames = [
	"logo",                         "brightness",
	"Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",         "Print Screen", "Scroll Lock", "Pause Break",     "MediaRewind", "MediaPlayPause", "MediaFastForward", "MediaStop",
	"G1", "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-_", "=+", "Backspace",                        "Insert", "Home", "Page Up",              "NumLock", "Num /", "Num *", "Num -",
	"G2", "Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\",                               "Del", "End", "Page Down",                "Num 7", "Num 8", "Num 9", "Num +",
	"G3", "CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter",                                                                     "Num 4", "Num 5", "Num 6",
	"G4", "Left Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Right Shift",                                  "Up Arrow",                      "Num 1", "Num 2", "Num 3", "Num Enter",
	"G5", "Left Ctrl", "Left Win", "Left Alt", "Space", "Right Alt", "Fn", "Menu", "Right Ctrl",  "Left Arrow", "Down Arrow", "Right Arrow",        "Num 0", "Num .",
];

let vKeymap = [
	38, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66,                   67, 68, 69,
	50, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 42, 43, 39,               70, 71, 72,
	40, 17, 23, 5,  18, 20, 25, 21, 9,  15, 16, 44, 45, 46,               73, 74, 75,
	54, 1,  19, 4,  6,  7,  8,  10, 11, 12, 48, 49, 37,
	81, 26, 24, 3,  22, 2,  14, 13, 51, 52, 53, 85,                           79,
	80, 83, 82,             41,             86, 87, 88, 84,               77, 78, 76,

];

let vG915LedPositions = [

	[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1],    		 [11, 1], [12, 1], [13, 1], [14, 1],   [15, 1], [16, 1], [17, 1],
	[1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2], [11, 2], [12, 2], [13, 2], [14, 2],   [15, 2], [16, 2], [17, 2],
	[1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3], [10, 3], [11, 3], [12, 3], [13, 3], [14, 3],   [15, 3], [16, 3], [17, 3],
	[1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [11, 4], [12, 4],          [14, 4],
	[1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [11, 5],                   [14, 5],            [16, 5],
	[1, 6], [2, 6], [3, 6],                         [7, 6],                          [11, 6], [12, 6], [13, 6], [14, 6],   [15, 6], [16, 6], [17, 6],

	[0, 0],
];
let vFAKELedPositions = [
	[0, 0],                              [6, 0],
			   [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1],          [11, 1], [12, 1], [13, 1], [14, 1],   [15, 1], [16, 1], [17, 1], [19, 1], [20, 1], [21, 1], [22, 1],
	[0, 2],    [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2], [11, 2], [12, 2], [13, 2], [14, 2],   [15, 2], [16, 2], [17, 2], [19, 2], [20, 2], [21, 2], [22, 2],
	[0, 3],    [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3], [10, 3], [11, 3], [12, 3], [13, 3], [14, 3],   [15, 3], [16, 3], [17, 3], [19, 3], [20, 3], [21, 3], [22, 3],
	[0, 4],    [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [11, 4], [12, 4],          [14, 4],                              [19, 4], [20, 4], [21, 4],
	[0, 5],    [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5], [11, 5],                   [14, 5],            [16, 5],          [19, 5], [20, 5], [21, 5], [22, 5],
	[0, 6],    [1, 6], [2, 6], [3, 6],                         [7, 6],                          [11, 6], [12, 6], [13, 6], [14, 6],   [15, 6], [16, 6], [17, 6], [19, 6], [20, 6],

];

const WIRED = 0xFF;
const WIRELESS = 0x01;
const ShortMessage = 0x10;
const LongMessage = 0x11;
const SoftwareMode = 0x02;
const HardwareMode = 0x01;
const ConnectionMode = WIRELESS; //Figure out how to poll this

const DPIStageDict =
{
	1:  function(){ return dpi1; },
	2:  function(){ return dpi2; },
	3:  function(){ return dpi3; },
	4:  function(){ return dpi4; },
	5:  function(){ return dpi5; }
}

const deviceIdMap = 
{
"405d" : "Logitech G403L",
"407f" : "Logitech G502L",          
"4070" : "Logitech G703L",
"4086" : "Logitech G703 Hero",   
"4053" : "Logitech G900L",       
"4067" : "Logitech G903L",   
"4087" : "Logitech G903 Hero",    
"4079" : "Logitech GPro Wireless",     
"4093" : "Logitech GPro X Superlight",   
"407c" : "Logitech G915 Keyboard"  
}

const devicetypedict = 
{
	0 : "Keyboard",
	1 : "Remote Control",
	2 : "Numpad",
	3 : "Mouse",
	4 : "Trackpad",
	5 : "Trackball",
	6 : "Presenter",
	7 : "Reciever",
	8 : "Headset",
	9 : "Webcam",
	10 : "Steering Wheel",
	11 : "Joystick",
	12 : "Gamepad",
	13 : "Dock",
	14 : "Speaker",
	15 : "Microphone",
	16 : "Illumination Light",
	17 : "Programmable Controller",
	18 : "Car Sim Pedals",
	19 : "Adapter"
}

const LogitechBatteryVoltageDict = 
{
    4186:	100,					
	4156:	99,					
	4143:	98,					
	4133:	97,					
	4122:	96,					
	4113:	95,					
	4103:	94,					
	4094:	93,					
	4086:	92,					
	4076:	91,					
	4067:	90,					
	4060:	89,					
	4051:	88,					
	4043:	87,					
	4036:	86,					
	4027:	85,					
	4019:	84,					
	4012:	83,					
	4004:	82,					
	3997:	81,					
	3989:	80,					
	3983:	79,					
	3976:	78,					
	3969:	77,					
	3961:	76,					
	3955:	75,					
	3949:	74,					
	3942:	73,					
	3935:	72,					
	3929:	71,					
	3922:	70,					
	3916:	69,					
	3909:	68,					
	3902:	67,					
	3896:	66,					
	3890:	65,					
	3883:	64,					
	3877:	63,					
	3870:	62,					
	3865:	61,					
	3859:	60,					
	3853:	59,					
	3848:	58,					
	3842:	57,					
	3837:	56,					
	3833:	55,					
	3828:	54,					
	3824:	53,					
	3819:	52,					
	3815:	51,					
	3811:	50,					
	3808:	49,					
	3804:	48,					
	3800:	47,					
	3797:	46,					
	3793:	45,					
	3790:	44,					
	3787:	43,					
	3784:	42,					
	3781:	41,					
	3778:	40,					
	3775:	39,					
	3772:	38,					
	3770:	37,					
	3767:	36,					
	3764:	35,					
	3762:	34,					
	3759:	33,					
	3757:	32,					
	3754:	31,					
	3751:	30,					
	3748:	29,					
	3744:	28,					
	3741:	27,					
	3737:	26,					
	3734:	25,					
	3730:	24,					
	3726:	23,					
	3724:	22,					
	3720:	21,					
	3717:	20,					
	3714:	19,					
	3710:	18,					
	3706:	17,					
	3702:	16,					
	3697:	15,					
	3693:	14,					
	3688:	13,					
	3683:	12,					
	3677:	11,					
	3671:	10,					
	3666:	9,					
	3662:	8,					
	3658:	7,					
	3654:	6,					
	3646:	5,					
	3633:	4,					
	3612:	3,					
	3579:	2,					
	3537:	1,					
	3500:	0
}

const mouseButtonDict = 
{

"4087" : 
{
	"button1" : "Left_Click",
	"button2" : "Right_Click",
	"button3" : "Middle_Click",
	"button4" : "Backward",
	"button5" : "Forward",
	"button6" : "Sniper",
	"button7" : "DPI_Down",
	"button8" : "DPI_UP",
	"button9" : "Top"	
},

"4067" :
{
	"button1" : "Left_Click",
	"button2" : "Right_Click",
	"button3" : "Middle_Click",
	"button4" : "Backward",
	"button5" : "Forward",
	"button6" : "Sniper",
	"button7" : "DPI_Down",
	"button8" : "DPI_UP",
	"button9" : "Top"
},

"4053" :
{
	"button1" : "Left_Click",
	"button2" : "Right_Click",
	"button3" : "Middle_Click",
	"button4" : "Backward",
	"button5" : "Forward",
	"button6" : "Sniper",
	"button7" : "DPI_Down",
	"button8" : "DPI_UP",
	"button9" : "Top"
},

"407f" :
{
	"button1" : "Left_Click",
	"button2" : "Right_Click",
	"button3" : "Middle_Click",
	"button4" : "Backward",
	"button5" : "Forward",
	"button6" : "Sniper",
	"button7" : "Top",
	"button8" : "DPI_UP",
	"button9" : "DPI_Down"	
},

"405d" :
{
	"button1" : "Left_Click",
	"button2" : "Right_Click",
	"button3" : "Middle_Click",
	"button4" : "Backward",
	"button5" : "Forward",
	"button6" : "DPI_UP",
	"button7" : "DPI_Down",
	"button8" : "Null",
	"button9" : "Null"
},

"4070" :
{
	"button1" : "Left_Click",
	"button2" : "Right_Click",
	"button3" : "Middle_Click",
	"button4" : "Backward",
	"button5" : "Forward",
	"button6" : "DPI_UP",
	"button7" : "DPI_Down",
	"button8" : "Null",
	"button9" : "Null"
},

"4086" :
{
	"button1" : "Left_Click",
	"button2" : "Right_Click",
	"button3" : "Middle_Click",
	"button4" : "Backward",
	"button5" : "Forward",
	"button6" : "DPI_UP",
	"button7" : "DPI_Down",
	"button8" : "Null",
	"button9" : "Null"
},

"4093" :
{
	"button1" : "Left_Click",
	"button2" : "Right_Click",
	"button3" : "Middle_Click",
	"button4" : "Backward",
	"button5" : "Forward",
	"button6" : "DPI_UP",
	"button7" : "DPI_Down",
	"button8" : "Null",
	"button9" : "Null"
},

}

export function LedNames()
{
	if(logidevicetype == "Keyboard")
	{
		return vG915LedNames;
	}
	else
	{
    	return vLedNames;
	}
}

export function LedPositions()
{
	if(logidevicetype == "Keyboard")
	{
		return vFAKELedPositions;
	}
	else
	{
    	return vLedPositions;
	}
}

export function Initialize()
{
    device.flush()
	
    device.addFeature("battery");

	GrabIds();//Grab all of our ID's of value

    let data = [0x80, 0x00, 0x00, 0x01]//Enable Hid++ Notifications
    Logitech_Short_Set(data, WIRED)

    data = [0x80, 0x02, 0x02, 0x00]
    let value = Logitech_Short_Set(data, WIRED)

    DeviceId = value[3].toString(16) + value[2].toString(16)
    TransactionId = value[0];

    deviceName = deviceIdMap[DeviceId] || "UNKNOWN"
    device.log(`Device Id Found: ${DeviceId}`);
    device.log(`Device Name: ${deviceName}`);

	CheckDeviceType();
    SetOnBoardState(OnboardState);
	DetectOnBoardState();

    battery.setBatteryLevel(GetBatteryCharge());
	
	if(logidevicetype == "Mouse")
	{
	ButtonSpySet();
		if(Hero == true)
    	{
		SetHeroDirectMode();
		SetHeroDpiLightAlwaysOn(DpiLight);
    	}
		else
		{
		SetDirectMode();
		SetDpiLightAlwaysOn(DpiLight)
		}
		if(DpiControl)
		{
		setDpi(DPIStageDict[DPIStage]());
		SetDPILights(DPIStage);
		}
		else
		{
		SetDPILights(3);
		}
	}

	if(logidevicetype == "Keyboard")
	{
		GKeySetup();
		MKeySetup();
	}
}

export function Render()
{
	if(logidevicetype == "Keyboard")
	{
	SendPacket();
	SendLogoZone();
	SendMediaZones();
	SendGkeys();
	SendNumpad();
	KeebApply();
	}
	else
	{
		if(Sleep == false)
		{	
			sendZone(0);
    		sendZone(1);
		}

	}
	DetectInputs();
	PollBattery();
}

export function Shutdown()
{   
	if(logidevicetype == "Keyboard")
	{
		SendPacket(true);
		SendLogoZone(true);
		SendMediaZones(true);
		SendGkeys(true);
		SendNumpad(true);
		KeebApply();
	}
	else
	{
		sendZone(0, true);
		sendZone(1, true);
	} 
}

export function onDpiLightChanged()
{
    if (Hero == true)
	{
	SetHeroDpiLightAlwaysOn(DpiLight);
	}
	else
	{
	SetDpiLightAlwaysOn(DpiLight);
	}
}

export function onDpiControlChanged()
{
	if(DpiControl)
	{
	setDpi(DPIStageDict[DPIStage]());
	SetDPILights(DPIStage);
	}
}

export function ondpi1Changed()
{
	if(DpiControl)
	{
	setDpi(DPIStageDict[DPIStage]());
	SetDPILights(DPIStage);
	}
}

export function ondpi2Changed()
{
	if(DpiControl)
	{
	setDpi(DPIStageDict[DPIStage]());
	SetDPILights(DPIStage);
	}
}

export function ondpi3Changed()
{
	if(DpiControl)
	{
	setDpi(DPIStageDict[DPIStage]());
	SetDPILights(DPIStage);
	}
}
export function ondpi4Changed()
{
	if(DpiControl)
	{
	setDpi(DPIStageDict[DPIStage]());
	SetDPILights(DPIStage);
	}
}

export function ondpi5Changed()
{
	if(DpiControl)
	{
	setDpi(DPIStageDict[DPIStage]());
	SetDPILights(DPIStage);
	}
}

export function ondpi6Changed()
{
	if(DpiControl)
	{
	setDpi(DPIStageDict[DPIStage]());
	SetDPILights(DPIStage);
	}
}

export function onOnboardStateChanged()
{
	SetOnBoardState(OnboardState);
	ButtonSpySet();
	
	if(OnboardState == true)
	{
		if(Hero == false)
		{
		SetDirectMode();
		}
		else
		{
		SetDPILights(3);	
		}
	}
}

export function onpollingrateChanged()
{
	setPollingRate();
}

function disablekeysbyusage()//Don't touch
{
	clearShortReadBuffer();
	clearLongReadBuffer();
	device.set_endpoint(2, 0x0001, 0xff00);
	var packet = [ShortMessage, ConnectionMode, DisableKeysID, 0x00]; //Device type
	device.write(packet,7);
	device.set_endpoint(2, 0x0002, 0xff00);
	let keydisablecapability = device.read([0x00],20);
	device.log("Total number of keys to disable" + keydisablecapability);

	packet = [LongMessage, ConnectionMode, DisableKeysID, 0x10, 0x00]; //This disables keys in game mode. NO HID OUTPUT
	device.write(packet,20);
}

function CheckDeviceType()
{
	clearShortReadBuffer();
	device.set_endpoint(2, 0x0001, 0xff00);
	var packet = [ShortMessage, ConnectionMode, InfoID, 0x02]; //Device type
	device.write(packet,7);
	let typepacket = device.read([0x00],7);
	logidevicetype = devicetypedict[typepacket[0]];
	device.log("Device Type: " + logidevicetype);

	if(logidevicetype == "Keyboard")
	{
		device.repollLeds();
	}
}

function GKeySetup()//Controls software modes for the G and M keys
{
	device.set_endpoint(2, 0x0001, 0xff00);
	var packet = [ShortMessage, ConnectionMode, GKeyID, 0x00]; //Info
	device.write(packet,7);

	packet = [ShortMessage, ConnectionMode, GKeyID, 0x20, 0x01]; //Software Enable Flag for GKeys and Mkeys
	device.write(packet,7);
}

function MKeySetup()//LED Control for the Mkey lights
{
	device.set_endpoint(2, 0x0001, 0xff00);
	var packet = [ShortMessage, ConnectionMode, MKeyID, 0x00]; //Probably Info
	device.write(packet,7);

	packet = [ShortMessage, ConnectionMode, MKeyID, 0x10, 0x00]; //Led Number Flag in binary
	device.write(packet,7);
}

function PollBattery()
{  
    	if (Date.now() - savedPollTimer < PollModeInternal) 
    	{
        return
    	}
    savedPollTimer = Date.now();
	var bc = GetBatteryCharge();
	battery.setBatteryLevel(bc);
}

function SetDPILights(dpilightid)
{
	if(Hero == true)
	{
	device.set_endpoint(2, 0x0001, 0xff00);
	let packet = [ShortMessage, ConnectionMode, RGBFeatureID, 0x20, 0x00, dpilightid, 0x00];
	device.write(packet, 7);
	}
	else
	{
	device.set_endpoint(2, 0x0002, 0xff00); 
	let packet = [LongMessage, ConnectionMode, LEDCtrlID, 0x50, 0x01, 0x00, 0x02, 0x00, dpilightid ];
	device.write(packet, 20);
	}
}

function ButtonSpySet()
{
	device.set_endpoint(2, 0x0001, 0xff00);
	let packet = [ShortMessage, ConnectionMode, ButtonSpyID, 0x00, 0x00, 0x00, 0x00];
	device.write(packet,7);
	packet = [ShortMessage, ConnectionMode, ButtonSpyID, 0x10, 0x00, 0x00, 0x00];
	device.write(packet,7);
	device.set_endpoint(2, 0x0002, 0xff00);

	if(OnboardState == false)
	{
	packet = [LongMessage, ConnectionMode, ButtonSpyID, 0x40, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x08, 0x0a, 0x0b, 0x0c];//0x40 on its own remaps everything BIG PROBLEM because you can't click anything then
	device.write(packet,20);
	}
	else
	{
	device.set_endpoint(2, 0x0001, 0xff00);
	packet = [ShortMessage, ConnectionMode, ButtonSpyID, 0x20,]; //Relinquishes control from button spy
	device.write(packet,7);
	}

	
}

function DetectInputs()
{
	device.set_endpoint(2, 0x0002, 0xff00);
	battindicator = false;
		do
    	{
    	let packet = [];
    	packet = device.read([0x00],9, 2);
    	let input = ProcessInputs(packet);
		
		if(input == "DPI_UP")
		{
			DPIStage++;
			DPIStageControl();
		}
		if(input == "DPI_Down")
		{
			DPIStage--;
			DPIStageControl();	
		}
		if(input == "Sniper")
		{		
			Sniper = true;
			setDpi(dpi6);
			SetDPILights(1);
		}
		if(input == "Top")
		{
			battindicator = true;
			let battamount = GetBatteryCharge();
			if(battamount > 49)
			{
				SetDPILights(3);
				sendZone(0);
				device.pause(10000);
				battindicator = false;
			}
			else if (battamount > 29)
			{
				SetDPILights(2);
				sendZone(0);
				device.pause(10000);
				battindicator = false;
			}
			else if (battamount > 14)
			{
				SetDPILights(1);
				sendZone(0);
				device.pause(10000);
				battindicator = false;
			}
		}

    	}
    	while(device.getLastReadSize() > 0)

	device.set_endpoint(2, 0x0001, 0xff00);
	do
	{
	let packet = device.read([0x00],7, 10);

		if(packet[0] == ShortMessage && packet[1] == ConnectionMode && packet[2] == 0x41 && packet[3] == 0x0C && packet[6] == 0x40)
		{
		device.log("Mouse Going to Sleep");
		return Sleep = true;
		}
	}
	while(device.getLastReadSize() > 0)
}

function ProcessInputs(packet)
{
	if(packet[0] == LongMessage && packet[1] == 0x01 && packet[2] == ButtonSpyID)
	{
    	if(packet[4] == 0x01)
		{
		device.log("Button 7");
		return mouseButtonDict[DeviceId]["button7"];
		}
		if(packet[4] == 0x02)
		{
		device.log("Left Scroll Wheel Pressed");
		return;
		}
    	if(packet[4] == 0x04)
		{
		device.log("Right Scroll Wheel Pressed");
		return;
		}
		if(packet[5] == 0x01)
		{
		device.log("Button 1");
		return mouseButtonDict[DeviceId]["button1"];
		}
    	if(packet[5] == 0x02)
		{
		device.log("Button 2");
		return mouseButtonDict[DeviceId]["button2"];
		}
		if(packet[5] == 0x04)
		{
		device.log("Button 3");
		return mouseButtonDict[DeviceId]["button3"];
		}
		if(packet[5] == 0x08)
		{
		device.log("Button 4");
		return mouseButtonDict[DeviceId]["button4"];
		}
		if(packet[5] == 0x10)
		{
		device.log("Button 5");
		return mouseButtonDict[DeviceId]["button5"];
		}
		if(packet[5] == 0x20)
		{
		device.log("Button 6");
		return mouseButtonDict[DeviceId]["button6"];
		}
		if(packet[5] == 0x40)
		{
		device.log("Button 9");
		return mouseButtonDict[DeviceId]["button9"];
		}
		if(packet[5] == 0x80)
		{
		device.log("Button 8");
	 
		return mouseButtonDict[DeviceId]["button8"];

		}
		if(packet[5] == 0x00 && Sniper == true)
		{
		device.log("Sniper Button Depressed");
		Sniper = false;
		
		if(DpiControl)
		{
		setDpi(DPIStageDict[DPIStage]());
		SetDPILights(DPIStage);
		}
		
		}
	}

	if(packet[0] == LongMessage && packet[1] == ConnectionMode && packet[2] == GKeyID)//G-Key Packet
	{
        if(packet[4] == 0x01)
        {
            device.log("G1 Pressed");
            return "G1";
        }

        if(packet[4] == 0x02)
        {
            device.log("G2 Pressed");
            return "G2";   
        }

        if(packet[4] == 0x04)
        {
            device.log("G3 Pressed");
            return "G3";   
        }

        if(packet[4] == 0x08)
        {
            device.log("G4 Pressed");
            return "G4";   
        }

        if(packet[4] == 0x10)
        {
            device.log("G5 Pressed");
            return "G5";   
        }
    }

    if(packet[0] == LongMessage && packet[1] == ConnectionMode && packet[2] == MKeyID)
	{
        if(packet[4] == 0x01)
        {
            device.log("M1 Pressed");
            return "M1";
        }

        if(packet[4] == 0x02)
        {
            device.log("M2 Pressed");
            return "M2";   
        }

        if(packet[4] == 0x04)
        {
            device.log("M3 Pressed");
            return "M3";   
        }
    }

    if(packet[0] == LongMessage && packet[1] == ConnectionMode && packet[2] == MRID && packet[4] == 0x01)
	{
        device.log("MR Pressed");
        return "MR";   
    }

	if(packet[0] == LongMessage && packet[1] == ConnectionMode && packet[2] == 0x06 && packet[3] == 0x00 && packet[6] == 0x00)
	{
	if(battindicator != true)
	{
	device.log("Waking From Sleep");
	device.pause(5000); //Wait five seconds before Handoff. Allows device boot time.
	Initialize();
	return Sleep = false;
	}
	}
}

function DetectOnBoardState()
{
    device.set_endpoint(2, 0x0001, 0xff00); // Short Message Endpoint

    var packet = [];
    packet[0] = ShortMessage;
    packet[1] = ConnectionMode;
    packet[2] = OnboardID;
    packet[3] = 0x20;
    
    device.write(packet, 7);

	device.set_endpoint(2, 0x0002, 0xff00);
	packet = device.read(packet,20);
	var OnBoardState = packet[4];
	device.log("Onboard State: " + OnBoardState);
    device.pause(1); 
}

function SetOnBoardState(OnboardState)
{
    device.set_endpoint(2, 0x0001, 0xff00); // Short Message Endpoint

    var packet = [];
    packet[0] = ShortMessage;
    packet[1] = ConnectionMode;
    packet[2] = OnboardID;
    packet[3] = 0x10;
	if(OnboardState == true)
	{
    packet[4] = HardwareMode;
	}
	else
	{
	packet[4] = SoftwareMode
	}
    device.write(packet, 7);

	device.set_endpoint(2, 0x0002, 0xff00);
	packet = device.read(packet,20);
	device.log("Onboard State Set to : " + OnboardState);
    device.pause(1); 
}

function DPIStageControl()
{

		if(DPIStage == 6)
    	{
        DPIStage = (DPIRollover ? 1 : 5);
    	}
		if(DPIStage == 0)
		{
		DPIStage = (DPIRollover ? 5 : 1);
		}
	device.log(DPIStage);
    setDpi(DPIStageDict[DPIStage]());
    SetDPILights(DPIStage);
}

function clearShortReadBuffer()
{
    device.set_endpoint(2, 0x0001, 0xff00); // Short Message Endpoint 
    device.read([ShortMessage,0x01],7);
    	while(device.getLastReadSize() > 0)
		{
        device.read([ShortMessage,0xFF],7);
    	}
}

function clearLongReadBuffer()
{
    device.set_endpoint(2, 0x0002, 0xff00); // Lighting IF 
    device.read([LongMessage,0x01],20);
    	while(device.getLastReadSize() > 0)
		{
        device.read([ShortMessage,0x01],20);
    	}
}

function Logitech_Short_Set(data, Mode)
{
    device.set_endpoint(2, 0x0001, 0xff00); // Short Message Endpoint 
    clearShortReadBuffer();
    var packet = [ShortMessage,Mode];
    data  = data || [ 0x80, 0x00, 0x00, 0x00];
    packet = packet.concat(data);
    device.write(packet, 7);
    packet = device.read(packet,7);

    return packet.slice(3,7);
}

function Logitech_Long_Set(Mode, data)
{
    device.set_endpoint(2, 0x0002, 0xff00); // Lighting IF 
	clearLongReadBuffer();
    var packet = [LongMessage,Mode];
    data = data || [0x00, 0x00, 0x00];
    packet = packet.concat(data);
    device.write(packet, 20);
    packet = device.read(packet,20);
	
    return packet.slice(4,7);
}

function Logitech_Long_Get()
{
	device.set_endpoint(2, 0x0002, 0xff00); // Lighting IF 
	let packet = device.read([0x00],20)

	return packet.slice(4,7);
}

function Logitech_FeatureID_Get(page)
{
  return Logitech_Long_Set(ConnectionMode, [0x00,0x00].concat(page))[0];
}

export function GetBatteryCharge()
{
	if(UnifiedBattID != 0)
	{
		LogitechGetUnifiedBatteryPercentage()
	}
	else if(BattID != 0)
	{
          let [voltage,state] = LogitechGetBatteryVoltage(BattID);
	  
	  if (state === 0) { battery.setBatteryState(1); }
          else if (state === 128) { battery.setBatteryState(2); }
          else if (state === 144) { battery.setBatteryState(5); }

          return GetApproximateBatteryPercentage(voltage);
	}
}

function LogitechGetUnifiedBatteryPercentage()
{
	let data = [UnifiedBattID, 0x10];
	Logitech_Short_Set(data, 0x01);
	let BatteryArray = Logitech_Long_Get();
	device.log(BatteryArray);
	let BatteryPercentage = (BatteryArray[0])
        let BatteryStatus = BatteryArray[2];

	device.log("Battery Percentage: " + BatteryPercentage);
	device.log("Battery Status: " + StatusDict[BatteryStatus]);
	return [BatteryPercentage];
}


function LogitechGetBatteryVoltage()// 10 06 00 //returns 15 13 3 //10 06 01 //Literally returns 1
{
	let data = [BattID, 0x00, 0x10];
	let BatteryArray = Logitech_Long_Set(0x01, data);
	let BatteryVoltage = (BatteryArray[0] << 8) + BatteryArray[1];
        let BatteryStatus = BatteryArray[2];

	device.log("Battery Voltage: " + BatteryVoltage);
	device.log("Battery Status: " + StatusDict[BatteryStatus]);
	return [BatteryVoltage, BatteryStatus];
}

const StatusDict = 
{
	0 : "Discharging", //Discharging
	128 : "Charging", //Charging 
	144 : "Wireless Charging" //Wireless Charging 	
}

const VoltageArray = 
[ 
	4186,4156,4143,4133,4122,4113,4103,4094,4086,4076,4067,4060,4051,4043,4036,4027,4019,4012,4004,3997,3989,3983,3976,3969,3961,3955,3949,3942,3935,3929,3922,3916,3909,3902,3896,3890,3883,3877,3870,3865,3859,3853,3848,3842,3837,3833,3828,3824,3819,3815,3811,3808,3804,3800,3797,3793,3790,3787,3784,3781,3778,3775,3772,3770,3767,3764,3762,3759,3757,3754,3751,3748,3744,3741,3737,3734,3730,3726,3724,3720,3717,3714,3710,3706,3702,3697,3693,3688,3683,3677,3671,3666,3662,3658,3654,3646,3633,3612,3579,3537,3500 
];

function GetApproximateBatteryPercentage(BatteryVoltage)//This needs hit with a hammer.
{ 
		const nearestVoltageBand = VoltageArray.reduce((prev, curr) => 
		{
		return (Math.abs(curr - BatteryVoltage) < Math.abs(prev - BatteryVoltage) ? curr : prev);
    	});
    device.log("Battery Percentage Remaining: " + LogitechBatteryVoltageDict[nearestVoltageBand]);
    return LogitechBatteryVoltageDict[nearestVoltageBand]
}

function setDpi(dpi)
{
    device.set_endpoint(2, 0x0001, 0xff00); // Short Message Endpoint 

    var packet = [];
    packet[0] = ShortMessage;
    packet[1] = ConnectionMode;
    packet[2] = DpiID;
    packet[3] = 0x30;
    packet[4] = 0x00;
    packet[5] = Math.floor(dpi/256);
    packet[6] = dpi%256;
	
    device.write(packet, 7);
    device.pause(1); //This is here because I was having issues with the device applying the dpi consistenly
}

function setPollingRate()
{
    device.set_endpoint(2, 0x0001, 0xff00); // Short Message Endpoint

    var packet = [];
    packet[0] = ShortMessage;
    packet[1] = ConnectionMode;
    packet[2] = PollingRateID; 
    packet[3] = 0x20;
    packet[4] = 1000/pollingrate; 
	
    device.write(packet, 7);
    device.pause(1); 
}

function SetDirectMode()
{
 	device.set_endpoint(2, 0x0001, 0xff00); 
 	let packet = [ShortMessage, ConnectionMode, RGBFeatureID, 0x80, 0x01, 0x01];//0x80 is register set. 0x01 is the first register, and the second 0x01 is true.
 	device.write(packet, 7);

	 if(OnBoardState == true)
	 {
	 packet = [ShortMessage, ConnectionMode, LEDCtrlID, 0x30, 0x00];//Software Mode for LED number
	 device.write(packet, 7);
	 }
	else
	{
	packet = [ShortMessage, ConnectionMode, LEDCtrlID, 0x30, 0x01];//Software Mode for LED number
 	device.write(packet, 7);
	}
}

function SetDpiLightAlwaysOn(DpiLight)//Fun fact: this is making use of the led control Feature ID //NOTE TO SELF: IF THIS WAS BROKEN YOU CHANGED 0x7C to 0x70
{

    device.set_endpoint(2, 0x0001, 0xff00); // Short Message Endpoint 
    var packet = [ShortMessage, ConnectionMode, 0x08, 0x070, 0x01, (DpiLight ? 0x02 : 0x04) ,0x00];//0x07 is unknown
    device.write(packet, 7);

    device.set_endpoint(2, 0x0002, 0xff00); // Lighting IF    
    packet = [LongMessage, ConnectionMode, 0x08, 0x05E, 0x01,0x00,0x02, 0x00, 0x02];//0x50 is set led state
    device.write(packet, 20);

    device.set_endpoint(2, 0x0001, 0xff00); // Short Message Endpoint //0x60 should be grabbing config from nvram
    packet = [ShortMessage, ConnectionMode, 0x08, 0x06E, 0x01];
    device.write(packet, 7);
}

function SetHeroDirectMode()
{
 	device.set_endpoint(2, 0x0001, 0xff00); 
 	let packet = [ShortMessage, ConnectionMode, RGBFeatureID, 0x50, 0x01, 0x03, 0x05];
 	device.write(packet, 7);
}

function SetHeroDpiLightAlwaysOn(DpiLight)//Hero Light Control is handled under the regular 8071 Page, rather than a separate LED Page. Hence it using a different means to handle DPI Light Settings.
{
    device.set_endpoint(2, 0x0002, 0xff00);  
    var packet = [LongMessage, ConnectionMode, RGBFeatureID, 0x30, 0x01, 0x00 ,0x08, (DpiLight ? 0x04 : 0x02), 0x07];
    device.write(packet, 20);

    device.set_endpoint(2, 0x0001, 0xff00);    
    packet = [ShortMessage, ConnectionMode, RGBFeatureID, 0x20, 0x00, 0x03, 0x00];
    device.write(packet, 7);

    packet = [ShortMessage, ConnectionMode, RGBFeatureID, 0x30, 0x00, 0x00, 0x08];
    device.write(packet, 7);
}
function KeebApply() 
{
	let packet = [];

	packet[0] = 0x11;
	packet[1] = 0x01;
	packet[2] = 0x0B;
	packet[3] = 0x7E;

	device.write(packet, 20);
}

function SendNumpad(shutdown = false) 
{
	let vNumPadPostions = [
		[19, 2], [20, 2], [21, 2], [22, 2],
		[19, 3], [20, 3], [21, 3], [22, 3],
		[19, 4], [20, 4], [21, 4],
		[19, 5], [20, 5], [21, 5], [22, 5],
		[19, 6], [20, 6],
	];
	let vNumpadMap = [
		80, 81, 82, 83,
		92, 93, 94, 84,
		89, 90, 91,
		86, 87, 88, 85,
		95, 96

	];

	for(let iIdx = 0; iIdx < vNumpadMap.length; iIdx = iIdx + 4){

		let packet = [];
		packet[0] = 0x11;
		packet[1] = 0x01;
		packet[2] = 0x0B;

		let zone = 0x1C;
		packet[3] = zone;

		for (let index = 0; index < 4 && index+iIdx < vNumpadMap.length ;index++) 
		{
			let keyNumber = index+iIdx;
			let iKeyPosX = vNumPadPostions[keyNumber][0];
			let iKeyPosY = vNumPadPostions[keyNumber][1];
			var color;

			if(shutdown){
				color = hexToRgb(shutdownColor);
			}else if (LightingMode === "Forced") {
				color = hexToRgb(forcedColor);
			}else{
				color = device.color(iKeyPosX, iKeyPosY);
			}
			let keyValue = vNumpadMap[keyNumber];


			packet[4 + index*4] = keyValue;
			packet[5 + index*4] = color[0];
			packet[6 + index*4] = color[1];
			packet[7 + index*4] = color[2];

		}

		device.write(packet, 20);
	}
}

function SendGkeys(shutdown = false) {
	let vGkeyPostions = [
		[0, 2],
		[0, 3],
		[0, 4],
		[0, 5],
		[0, 6],
	];

	for(let iIdx = 0; iIdx < vGkeyPostions.length; iIdx = iIdx + 4){

		let packet = [];
		packet[0] = 0x11;
		packet[1] = 0x01;
		packet[2] = 0x0B;

		let zone = 0x1F;
		packet[3] = zone;

		for (let index = 0; index < 4 && index+iIdx < vGkeyPostions.length ;index++) {
			let keyNumber = index+iIdx;
			let iKeyPosX = vGkeyPostions[keyNumber][0];
			let iKeyPosY = vGkeyPostions[keyNumber][1];
			var color;

			if(shutdown){
				color = hexToRgb(shutdownColor);
			}else if (LightingMode === "Forced") {
				color = hexToRgb(forcedColor);
			}else{
				color = device.color(iKeyPosX, iKeyPosY);
			}
			let keyValue = vKeymap[keyNumber];


			packet[4 + index*4] = 0xB4 + keyNumber;
			packet[5 + index*4] = color[0];
			packet[6 + index*4] = color[1];
			packet[7 + index*4] = color[2];

		}

		device.write(packet, 20);

	}
}

function SendLogoZone(shutdown = false){
	//1B 210 vLogoPositions

	for(let iIdx = 0; iIdx < 2; iIdx++){

		var color;

		if(shutdown){
			color = hexToRgb(shutdownColor);
		}else if (LightingMode === "Forced") {
			color = hexToRgb(forcedColor);
		}else{
			if(iIdx === 0) {
				color = device.color(0, 0);
			} else {
				color = device.color(4, 0);
			}
		}
		let packet = [];
		packet[0] = 0x11;
		packet[1] = 0x01;
		packet[2] = 0x0B;

		if(iIdx === 0) {
			packet[3] = 0x1B;
			packet[4] = 0xD2;
		} else {
			packet[3] = 0x19;
			packet[4] = 0x99;
		}

		packet[5] = color[0];
		packet[6] = color[1];
		packet[7] = color[2];
		packet[8] = 0xFF;
		device.write(packet, 20);
	}
}

function SendMediaZones(shutdown = false){
	let zones = [
		[12, 0], [14, 0], [13, 0], [11, 0]
	];

	for(let iIdx = 0; iIdx < zones.length; iIdx++){
		let iKeyPosX = zones[iIdx][0];
		let iKeyPosY = zones[iIdx][1];
		var color;

		if(shutdown){
			color = hexToRgb(shutdownColor);
		}else if (LightingMode === "Forced") {
			color = hexToRgb(forcedColor);
		}else{
			color = device.color(iKeyPosX, iKeyPosY);
		}
		let packet = [];
		packet[0] = 0x11;
		packet[1] = 0x01;
		packet[2] = 0x0B;

		packet[3] = 0x1B;

		packet[4] = 155+iIdx;
		packet[5] = color[0];
		packet[6] = color[1];
		packet[7] = color[2];
		packet[8] = 0xFF;
		device.write(packet, 20);
	}
}

function SendPacket(shutdown = false) {
	//1B 210 vLogoPositions
	let count = 0;

	let RGBData = [];
	let TotalKeys = 0;

	for (let iIdx = 0; iIdx < vKeymap.length; iIdx++){

		let iKeyPosX = vG915LedPositions[iIdx][0];
		let iKeyPosY = vG915LedPositions[iIdx][1];
		var color;

		if(shutdown){
			color = hexToRgb(shutdownColor);
		}else if (LightingMode === "Forced") {
			color = hexToRgb(forcedColor);
		}else{
			color = device.color(iKeyPosX, iKeyPosY);
		}

		if(OldValue[iIdx] != -1){
			//device.log(`test ${OldValue[iIdx]} ${color} ${arrayEquals(OldValue[iIdx], color)}`)
			if(arrayEquals(OldValue[iIdx], color)){
				count++;
				continue;
			}
		}

		OldValue[iIdx] = color;

		let keyValue = vKeymap[iIdx];

		if(keyValue >= 80){keyValue += 24;}

		if(vKeymap[iIdx] >= 88){keyValue -= 14;}

		RGBData[TotalKeys*4] = keyValue;
		RGBData[TotalKeys*4+1] = color[0];
		RGBData[TotalKeys*4+2] = color[1];
		RGBData[TotalKeys*4+3] = color[2];
		TotalKeys++;
	}

	while(TotalKeys > 0){
		let packet = [];
		packet[0] = 0x11;
		packet[1] = 0x01;
		packet[2] = 0x0B;

		let zone = 0x18;
		//if(vKeymap[iIdx] >= 80){zone = 0x1D;}
		//if(vKeymap[iIdx] >= 88){zone = 0x1C;}
		packet[3] = zone;

		packet = packet.concat(RGBData.splice(0, 16));
		TotalKeys -= 4;
		device.set_endpoint(2, 0x0002, 0xff00); // Lighting IF
		device.write(packet, 20);
	}

	// device.log(`Saved ${count/4} packets of ${vKeymap.length/4}`)
}

const OldValue = new Array(250).fill(-1);

function arrayEquals(a, b) {
	return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
}

function sendZone(zone, shutdown = false)
{
    device.set_endpoint(2, 0x0002, 0xff00);  
    var packet = [];
    packet[0] = LongMessage;
    packet[1] = ConnectionMode;
    packet[2] = RGBFeatureID;
    packet[3] = (Hero ? 0x10 : 0x30 );
    packet[4] = zone;
    packet[5] = 0x01;

    var iX = vLedPositions[zone][0];
    var iY = vLedPositions[zone][1];
    var color;
        if(shutdown)
		{
         color = hexToRgb(shutdownColor);
        }
		else if (LightingMode == "Forced")
		{
         color = hexToRgb(forcedColor);
        }
		else
		{
         color = device.color(iX, iY);
        }
    packet[6] = (battindicator ? 0x00 : color[0]);
    packet[7] = (battindicator ? 0xff : color[1]);
    packet[8] = (battindicator ? 0x00 : color[2]);
    packet[9] = (Hero ? 0x00 :0x02);

		if(DeviceId == "4067" || DeviceId == "4070" || DeviceId == "4086" || DeviceId == "4087") 
		{
     	 packet[16] = 0x01;
		}

    device.write(packet, 20);

	if(DeviceId == "4079" || DeviceId == "405d")
	{
	  Apply();
	}
}

function Apply()
{
    device.set_endpoint(2, 0x0001, 0xff00); // Short Message Endpoint    
    var packet = [];
    packet[0x00] = ShortMessage;
    packet[0x01] = ConnectionMode;
    packet[0x02] = 0x00;//Was 0x0B if you broke it.
    packet[0x03] = 0x20;
    packet[0x04] = 0x01;
    device.write(packet, 7);
}

function GrabIds()
{
	const InfoPage = [0x00,0x03];
	var InfoID = Logitech_FeatureID_Get(InfoPage);
		if(InfoID !== 0)
		{
		device.log("Device Info ID: " + InfoID);
		}
	
	const NamePage = [0x00,0x05];
	var NameID = Logitech_FeatureID_Get(NamePage);
		if(NameID !== 0)
		{
		device.log("Device Name ID: " + NameID);
		}
	
	const ResetPage = [0x00,0x20];
	var ResetID = Logitech_FeatureID_Get(ResetPage);
		if(ResetID !== 0)
		{
		device.log("Device Reset ID: " + ResetID);
		}

	const FriendlyNamePage = [0x00,0x07];
	var FriendlyNameID = Logitech_FeatureID_Get(FriendlyNamePage);
		if(ResetID !== 0)
		{
		device.log("Device Friendly Name ID: " + FriendlyNameID);
		}
	
	const BatteryPage = [0x10,0x01];
	BattID = Logitech_FeatureID_Get(BatteryPage);
		if(BattID !== 0)
		{
		device.log("Battery ID: " + BattID);	
		}
	
	const UnifiedBatteryPage = [0x10,0x04];
	 UnifiedBattID = Logitech_FeatureID_Get(UnifiedBatteryPage);
		if(UnifiedBattID !== 0)
		{
		device.log("Unified Battery ID: " + UnifiedBattID);	
		}
	
	const LEDCtrlPage = [0x13,0x00];
	LEDCtrlID = Logitech_FeatureID_Get(LEDCtrlPage);
		if(LEDCtrlID !== 0)
		{
		device.log("Led Control ID: " + LEDCtrlID);
		}
	
	const WirelessStatusPage = [0x1D,0x4B];
	var WirelessStatusID = Logitech_FeatureID_Get(WirelessStatusPage);
		if(WirelessStatusID !== 0)
		{
		device.log("Wireless Status ID: " + WirelessStatusID);
		}
	
	const DPIPage = [0x22,0x01];
	DpiID = Logitech_FeatureID_Get(DPIPage);
		if(DpiID !== 0)
		{
		device.log("DPI ID: " + DpiID);	
		}
	
	const PollingRatePage = [0x80,0x60];
	var PollingRateID = Logitech_FeatureID_Get(PollingRatePage);
		if(PollingRateID !== 0)
		{
		device.log("Polling Rate ID: " + PollingRateID);	
		}
	
	const OnboardProfilePage = [0x81,0x00];
	OnboardID = Logitech_FeatureID_Get(OnboardProfilePage);
		if(OnboardID !== 0)
		{
		device.log("Onboard Profiles ID: " + OnboardID);
		}
	
	const ButtonSpyPage = [0x81,0x10];
	ButtonSpyID = Logitech_FeatureID_Get(ButtonSpyPage);
		if(ButtonSpyID !== 0)
		{
		device.log("Button Spy ID: " + ButtonSpyID);
		}
	
	const ReportRatePage = [0x80,0x60];
	var ReportRateID = Logitech_FeatureID_Get(ReportRatePage);
		if(ReportRateID !== 0)
		{
		device.log("ReportRateID: " + ReportRateID);
		}
	
	const EncryptionPage = [0x41,0x00]; //0x00
	var EncryptionID = Logitech_FeatureID_Get(EncryptionPage);
		if(EncryptionID !== 0)
		{
		device.log("Encryption ID: " + EncryptionID);
		}

	const KeyboardLayout2Page = [0x45,0x40]; //0x00
	var KeyboardLayout2ID = Logitech_FeatureID_Get(KeyboardLayout2Page);
		if(KeyboardLayout2ID !== 0)
		{
		device.log("Keyboard Layout 2 ID: " + KeyboardLayout2ID);
		}

	const PersistentRemappableActionPage = [0x1b,0xc0]; //0x00
	PersistentRemappableActionID = Logitech_FeatureID_Get(PersistentRemappableActionPage);
		if(PersistentRemappableActionID !== 0)
		{
		device.log("Persistent Remappable Action ID: " + PersistentRemappableActionID);
		}

	const ReprogControlsV4Page = [0x1b,0x04]; //0x00
	var ReprogControlsV4ID = Logitech_FeatureID_Get(ReprogControlsV4Page);
		if(ReprogControlsV4ID !== 0)
		{
		device.log("Reprogram Controls V4 ID: " + ReprogControlsV4ID);
		}

	const DisableKeysPage = [0x45,0x22]; 
	DisableKeysID = Logitech_FeatureID_Get(DisableKeysPage);
		if(DisableKeysID !== 0)
		{
		device.log("Disable Keys ID: " + DisableKeysID);
		}

	const GKeyPage = [0x80,0x10]; //0x00 //2a 01 short
	GKeyID = Logitech_FeatureID_Get(GKeyPage);
		if(GKeyID !== 0)
		{
		device.log("GKey ID: " + GKeyID);
		}

	const MKeyPage = [0x80,0x20]; //0x01 0x01 //2a 01 short
	MKeyID = Logitech_FeatureID_Get(MKeyPage);
		if(MKeyID !== 0)
		{
		device.log("MKey ID: " + MKeyID);
		}

	const MRPage = [0x80,0x30];
	MRID = Logitech_FeatureID_Get(MRPage);
		if(MRID !== 0)
		{
		device.log("MR ID: " + MRID);
		}

	const BrightnessControlPage = [0x80,0x40]; //0x00
	var BrightnessControlID = Logitech_FeatureID_Get(BrightnessControlPage);
		if(BrightnessControlID !== 0)
		{
		device.log("Brightness Control ID: " + BrightnessControlID);
		}

	const HostsInfoPage = [0x18,0x15]; //0x00
	var HostsInfoID = Logitech_FeatureID_Get(HostsInfoPage);
		if(HostsInfoID !== 0)
		{
		device.log("Hosts Info ID: " + HostsInfoID);
		}

	const ChangeHostsPage = [0x18,0x14]; 
	var ChangeHostsID = Logitech_FeatureID_Get(ChangeHostsPage);
		if(ChangeHostsID !== 0)
		{
		device.log("Change Host ID: " + ChangeHostsID);
		}

	const PerKeyLightingPage = [0x80,0x80];
	var PerKeyLightingID = Logitech_FeatureID_Get(PerKeyLightingPage);
		if(PerKeyLightingID !== 0)
		{
		device.log("PerKeyLightingID: " + PerKeyLightingID);
		}
	
	const PerKeyLightingV2Page = [0x80,0x81];
	var PerKeyLightingV2ID = Logitech_FeatureID_Get(PerKeyLightingV2Page);
	if(PerKeyLightingV2ID !== 0)
	{
	device.log("PerKeyLightingV2ID: " + PerKeyLightingID);
	}
	
	const RGB8070Page = [0x80,0x70];
	RGBFeatureID = Logitech_FeatureID_Get(RGB8070Page);
		if(RGBFeatureID === 0)
		{
		const RGB8071Page = [0x80,0x71];
		RGBFeatureID = Logitech_FeatureID_Get(RGB8071Page);
			if(RGBFeatureID != 0)
			{
			Hero = true;
			device.log("Hero Mouse Found");
			}
		}
		if(RGBFeatureID != 0)
		{
		device.log("RGB Control ID : " + RGBFeatureID);
		}
}

export function Validate(endpoint)
{
    return endpoint.interface === 2 && endpoint.usage === 0x0002 && endpoint.usage_page === 0xff00
     || endpoint.interface === 2 && endpoint.usage === 0x0001 && endpoint.usage_page === 0xff00;
}

export function Image()
{
return "iVBORw0KGgoAAAANSUhEUgAABLAAAAMgCAYAAAAz4JsCAAAgAElEQVR4nOzdPa8l2Z7n9f9aK2KfzKqee9WjntEAQiOBhIHwGAkDdzAZ4fQIXgGIBzESvIMWgmmDAQmLl4GNi4GFgYWBicQI7r11qyrznLMj1lro/7Qisu6dtnD6zPfTfZWVmefsHTt27FMVP/0fBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4J97AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP65BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPz/pHAiAQAfyZzzn/lq/vIv/1K+fn2T19fXcp5nOc9e3p9v0nsvYwz7mj5EWq0yepc5psyZfz6k6P+VIvu+y75t8jwO6f2UUqpU/Z4x5NTfS5Fai+ihlCLS2iZTpj3meXZ7DP07/TP9Pn0eseeaUpo/h/65xOux//UppRY7Nn0Mf53+Wmtrcaz+P3vM+Gf9nlKrHYc6zi76yKVVmX3IMQ49WnsMVeI86GvSY9HjynOj9sduv9fj6aNLi/+UyOdMpXz7nxijiJ5nP6Z4ffr7/F59Kfb69k2GvT4/d0fv0uKxun7vnHKObr+u761tnS+J90yPuMVrGuexjm3b9vV6rnMcB1mLDD1/t2OvUuw4z9ml1iZdhpTSZNr7O6XFucoH0WPVx9f/6ePrddK7nq++3hM9frvQZNox6vlo2yajn+v5S23yPJ7yfH/Ktm/ysu/2ZyJ9HbO+lrY16Xq+RpdTj7Of8Z93fjwlrku99h7bLn0O+149thavX4/Bjkav9TFla81eqx7LtjV7pNL9nJ3nEdeHvs54jtLW+9/jNeXX+DeLn/O45sfwc6mvT8/D3pp9psbU19b89U//zA057ffb9pAx9Pzon03ZapNZ/Nofxylz6msZUos/97TjH/b51OfWx7LPhn0+mr1P2/7Qd9MfMz7H+sT6edXzap/L6cf+frz7uarVvv/xeNg/62vU8z7i/Ey7PorUtsmmf6+fTX3vS34m5voc6N/r6+rTr1l7/nVORaaeB32NebzbLg997k8v8unxMrdtswt+3/fp1/Y2t08v8o/+i3/0z/wcAgDw1xn/VgMAfCh/LMD6H/7Jfyf/z29+U76+vpbX17fteB6fnufxJ+9v79+fZ/9uFrvr1QRBnucp7+9PvTOUVvWmcZPvPn8vr29fPXDRG2G7wZ520z8iiMjAxe5Ug974HnqTLh5ibfsucwz5+vZqN6/6Z/ewSm/i+y3oeD+eMk69Ade/a9LabsFY3pTq13YLLCyNsZv6GjfVkueiVQsDNDSp+a/96sefx6y/aiigN8lzXKHYQ8MkDS2exwplRPymWr9WQwENF1qrFoz1fliokeGdh1Vi36NByMhAUEPAtq8bev17Dxi6HOMKWO7/lZIBQbEgbNjfNQs+HvLYdw/Ezi7H85DzfK6grD0edq419NOgQgMUfQ9KBC7F05U4hdWCKQsw1jmUFcwUCzK7nPG6U0Rncp6nBXvb3tbjj+5h37ZVO1aJc6znrFt4U9dz6/FamGHBnr8/Guq0unmYd57xfs0IumoEIn4N6nNaOBbHlGFVvscWTm0e8OhrsLAv/mPwjACnSbXwpkZAJxGC+HWqQUpdv7fzE9eLHqddu6Ws61ffDwvfHi/2+D1D4Qhba6sraJMIh7YSoWI8frOP5lzXg14jEp89O7bpAZo+3nEe9hjTcrM//E/ce8Bb4lqWVuK6zOO4Aji93vVayHA6P6e/DGD19ZT4WaHXhx67ftb09fn39tt/csf5isfY4nzq49uvxa9HO9d6HBGo7Y/9tOvd34Pz5eVT37bt/fHy+Dp7/6m09vb55dNz3/fx+eXzfPzJZ/mP/7P/iAALAPCh8G81AMCH8ssA67//b/+J/PDDD+XHH36/ffn686+//PT6r7893/+tMebf6/38O+/H+WuRuZdSt+P5Lu/HYZVJPapERLJyyCsk7AY1qp80MJJSV0BgN/YRiFjAoNU1cdOsN9f7tsusXq2jAULLIKAUeXns8uX1zaqFtGpDq2XygVcgkFVH8dq6Vcz4jbUeq90A28390JoquwHWAEFjiuM4PXyLQKNr8FD0NWxWQWKVZLVYBcvsp5znsNClaMimQUj8F8MeVT/62BrYaLVUylBM4zCtirp+76FZs8qUJudxrOfUkEOPPY8zq3r0tY6oVrNHnFP2ra2Kq82qzkaclyFef2Opw/oeCx9aW2FThj4aKFie07MabkYIMix0sDAhDjsDDz1p5/DjlQjULNTYaoR4TZpeD+PbCi4/qrqeR7/OAqh431oEShlg5fXr4ZdeQ36N9OO0823nrA8LmLx6q65n8mvpemavHvQARP9CK5imVgtmhV3xq0kDv7fztMfUQEWvgeGJ16pWKyuQ9EogDWusmkxDuzlux1DtGO/h13H4eW4tzlPb5WEhUbH3YsT7mK/70FD2zPPjz3M8n1Z59N13n+QZgaoFo7XKU8/NcVXZ7Y+HBWr+dR6o6jVm5794sKTHqce9WWVb/cV7Fteg/hzQz/2U9fkvURXlVZdlVT9KBF4jAsb8mREX/3q/2u5Bboa3+dm1nw0RrEpcbzIzTJvrGtPPa9vaubXteHx6+fqyv/zT2ur/UUv5Xz+/fPrfHi+P//vl5eX5+O5lfP/9n8h/+p//J/wLDgDwYWy8lQCAj+ynH34ov//d7/YvX7/+3R9///t/+Hw//nyM/ndf347v3t7f2vE8igYTVr3Su+zV23+O97d1U6w3whZCVJHH/mJnq49T3qbfyDa7iX7a10sEJ2LtW2ItZBqOaIVR3067If/08kl++vlHe9xf/fpX8v72Kj9nK5Z+Ux9W9VSahww1Ah1rT4smsvwzDVKsgsZu8t+vCioLmao8Hi8W9lg71dFXCHZ5X+14Xln29Jv0VuX9+ZSzf/Ub/61ZJY22tM1oc7NQ6bHLD7/7QT5/fpE/+1t/Jj/++LOFPFbFE/FNhj3J2jCjdU5DiGmtXt0CJf29fq8GHNvjYefXWrSmB0f6GuY8ZbYq53Fa5djb25tViz32h2yPXZ5vetyHnEe3sELfDw1K7Hm3XV4+fZL3tzd73JeXhwVFTSukHi9WMff2/rSKoWqVaFu02k15nof8+le/kk+fP8tvf/NbD0Ckydvrm1Xr6fdrW6m282m7n1XEtbJeZz+zhdLDE71mtrbJ5+++i3NwWkuZhjXvz3d77/ftEYGLn7fTgqzjqjCLCiENh+r2WC2dFoBJtFPOwyqCns+nXYcWFmYrpxSr7JqzyHvvsn3/SR4vmz2P/pleGv7Pc7UN6mu8/vlp7+8W51miskjP8dfXV+nRcqjXtL2vj08WDLXP38n333+nn0+r3NPA1CoWNVSM4CerxkoEUH+ybfLDD/q5eZfPnz/btf36ai3AFu7keZLi7YrajtrGXBVW9llqZf2qz/n+/m6Vj+cKMr3iMF+vXgf2GSteYdWiqqqUaW2Leu3p42swpcH3+3l+8+kqGciKP97jsUc15mbXql4T+v0WPGdFVwRXI8JTa6HU61D/rHjoNjfRyr75bO96cP/OtrV/v/f+P7/08388R//fn+N4m39VPzUAAH8NEWABAD6sv/iLvyi//f3v9i8//fiv/Pjjz//lTz//9A+ex/k3xxj1eD+LhSbWAuQ3znqjqsFHVl5pZYfeVNaodNGbW71h12oKsYoLbYc65YjbxKyC0htpb6E6V+ClUc5x6sypU96eT3u8T58+WcubVqToTbrezP785Wf59OJzcVqvFm5olcvr66vdtEu0LI0IsLLiyFr6tBqkxqynak1MdrP/9BqQOMbqlUTadrb6Hr1wR0OIqm1uUSEy47VoG1dWCmnIojfgGuZouPP++lW+++7FHuG3v/mNh1V2E+6VPBLzoWymUPdZRJI39FqBExUrYq2SOdvqIbMNDxq0de75vCpgdEzQ6Tf7VjGkAU7MJtPnOJ85o6nJ58/7rUKpWdWbVtRki6G2Hvr3+Tl4++ph3SNatTz0kphJVa0CTNv7Xn/+2QI4iRY4DfayKk+DtH5eVVH9HBaOXW13c1U+vTw++TX1/m7HbpVWGpy1Yo85rF2xy67vw97sPFowefvAlggELTyaI1rvrvlpJSqurGUw5l7ZdX4c3iZoxXH+3Pr+6/WYYUopV4vfqmrb/Pvt+l5zvrQybrOvPbUtUr9m+qy1Ya+7StHKveLzpmrb7XX+9NOPdh2c1upa7FqpfkT+4vSPV6CzyZfXV2sxbXpu9Lxp8KXHEFVNFjjWzYO6DLX2TXsvfW6a/p9+Y51ST62SmnJoe18rUTU1JD4+V4tk8WvUmxL9Pe7WEthlK7sFVh4ENnste4SD+RhZwffIz1mEcRoQa1trziEr1kL8YqGbRAXXrp/hCNIs9Bwiz3msz/FzDHloE2qtWynlX+79/PPjqC972/6rs5T/c+z94N9uAICPhAALAPAh/dd/+Y/lxx9+X3/86ae/8/Wnn/7D3/3ud//e+/vxp2P2+uXLF53ybDfwX7US5+g+KypCpDXzR9vJNGQ5dJaPV6Pozbve5FvllQ5nb36TqZVV2lr1+vYaQ6G9jdCru5rfCNt8oyEvu1eq6KwkH/A9LOjQag+tEOpWsaRTuou8v/nw6C1mPKVVEVMihJjfBg3a8uc3x9UqdoZ02dsWgd2MQenTQguJG/X8c6vosUHY1QeH31vwLNgZFhxZhUqtEaJUnxelHVBWddK8TVGi/XJ8O+w7K8e8PfIa2i7Fh3Pr9+rg8F6GD7afLQbhjxyVbd9zRDWQBl1nhGd9dgu6vFLNQx99lW36a7WzqO+tzcyOap/h4YQN6dZwwSqX4nxWWe2KRa+PprOLir1nPYMKn0Iv8Wat47S5Tfpam6z2U60ge8QMsAzkvGqtfjNbyf4+Wuz02K1Sp0eopsd/XlVts3i9m7aK2uwlC1X89fXb9WJHqNU/rVlrn8/OanYu9D3TWWZecRQzuc6xWt5mXL9rPlmdUoa3wPn7OtZnaM1KizB4rmtkeGAsp/1ZPzyw8/C329dbQBZVU2cGdBZYeXVTtrZaldwes8x0ppgFP4cFScM6ebvI81b5F7PMbDD/8PdGq+T0PA5ZyZX9c84Qk9uwf1kVhV7Zp62OM2aVvVvIKvaZzvdJw6z8WVLqtYjAWoxPO0NW0aV/lC28ej7P6fPg9MLzVtrTWor1/OlnWKsEX9/fbJC8BoWfPn1XfF7/9ifSx98fffwvZYz/S3PLb4aMAQDw1xwBFgDgQ/rxxx/L//ub33z3+vXnv//ly5c/f317/dNmk7O9N0krk6wCK246Dw0/jm43pRrOWLBxSsytEhvunmNyztg2V+I+fsa8mvN4roHOJWbW6A3oHt+o1R3FNhL6UPZs8Bm3Th+vHKlr2LaFQsPnKNlNvYxoJ2urTS+rqfRmvMegdA0eyu5zo2Q0q0Cx2U/xGtrWYmtiX22Q+jjneOqGszUk24aOR8XNjOHZOfS7RnWShife4hehiQ0AzxDGX6dWsz1srNcWQ63lm/lNWfUmMR/Khr5P3/wo0YY4s8LIBsifdj604qZGy+OMjYlZ4XQPHnSuWI1qNdsoWTNYilCrHz4s3QbSj2+eW4MxbyeMSqrp71kO85cYSJ7bIq2CaZwxgyvCrGhDy6ooffQtKrjK7u+jViLtEX76/CRNgDYpm7egjhEpn20V9ADGZ3qNqIzzxxu+StOO3o4z20pjwLlEi6ltFpwR2Gig9X5IPw4PL/X82+D7azZVjRZWbweNeWq6J7Bf/0GpAYu1LfYIJZsPNrdZWBpA6TmwkHjY8Zbd2xXL6UGWB196nMM+dxLD+zW8mhHATQtzDzsHU4ewawuozAicYp5WyQqo+BBZgVeLCr8IJbuHVM3C6GoVWd2q3KoFU/r+6/sZV9AKcvMY/X2ySWFWmbe1fc2/en9/ky4vfj7O2/ZNDSl3nzP32B5xboe1E3to2Py91GsxKuG0Qs+r0Pzxc6Nhj8UKGmhpa+GYsz7a9qfbtv/bs5b/aYz5hQALAPCREGABAD6cv/jH/4385re/bV9fv/5LP3/5+h+8vr79rXNMbbSxlqMzt5jZ1jetOPEzkLvNdKV+VirVqES5Bq9X+9+MYMArMPRGeq6ZTzVa/HQuksQcnRwavlsIUK3qaw1lvw3v1moja7Oz1j0PgrR9zdqWpn/tOaZ8emlW9WWBl76O2AQXR7TuW2cGF/20NkkNKvLrZwQ7Nqxa53dF8KbtgW1cgYvlCDp3Sdufsj1NZ089T2uZ0zlf1mCV7U76yDMDhL6qefS4W/Hz6AVLc7VjbrGJzc9gW8/9fPpw8ajzuob0z6vyyf6oz2jPK9a+aAHQrN6SFRsCWwRQLauw4j3Ox9RQTNNJ/bXVfb23km2hw4fT23mLoMpCTDu/EejYzCI9lVtsVvTgJ7f9ZQWaVmRlEKGBmIURfcibVsCVIu8xO8oq3eKY9hqvZfbYXudVhENDKA0sMxyz1lg/bq/SirCtzCyF8io/fb97bIF8esBpAZ4e5xm/L9fmvdylp9fi1rbYlNjtM5TtcFvxENAqGWuJd81DWH282vy8WGCqn5vnGWGhfj7KGrRv5/SM1r88T3osdr12C5sskO3+Oo95+sa/mcFm8wrE2DxZZvFzNcSr1Kyqq8Zcueljs2LOnFVHamWW+CB9C7m0skrPvbVeRiVZVHrpP1upk7YTnxal2bl9e3+X8slDxazGyoUAGvo+55B9xBlqzQbpP6oHu/o6zh7Xd6k2l23funTdRBpVW49W5e047H35/rF5SLxt2+v5/q9us//q+Xz+U/7tBgD4SAiwAAAfzuvPP5cvv/9x//r16997f339N37++mU/3w55+/q+BmrbDBm9ER7TZvZIBBg2VNkylRJb/cY3NQy28c5uMIcU7x9ba/2tDS9atsQb0jzcihv4mcPY54zKGK9wsSAhsgUb1ByDeIaVywz7OmuzEg+ySlQk1TosONBwasTzSM6/Kj5NyKpoxKtQ7PX0HnOSirVr9Ujv9OhaBCK2QS2qaWrMvdLj1pv8Lt0CGgtholpKq40kKpV8y9u2wosRrX8lqqE0HPQB4N3mBmU104jwUOMlm9FUvBJNw4A+vHJLcjh5HLNWX5V4ryx+HGMNEdcB5FldlWGjngnLNLKNMqqn8u8lq7OKt03O3NoYwZh+cwYYFrJEULe+LlrFtgipdFxRj81/9y12kuHoVn2zYLatiqzqMllVT15hpUFNL9FuOTwAy8jVAo2MX6efSQ2mLCCL66I1D2bW7KqoIpzNq5q6vd8+QF6sUq9GK2ePIFU8vBtXe6NE1Zi1P1ZvZ9UZb/q5sO/vY0WFFobVcm3QHOO2MdLbL+f6u77ORVxsvj0xn/PsqyIw3yeJ6sUSlVb2/hbfIGiz1qLa0M6VfSaarVZssUQglwzM6mPwrZKvXXPjrM1wnB6+asXZ2PxcrGvGf529r8qpzcK2w9two5rPzlXxcM1aB2NDo75vGgSLLRTwnxPT5vLlNk6dBXd6UL755/v91Y9p/xu/splsvnGxltnHd+d4vrw93/mXGwDgQyHAAgB8OF9+/El+/vnLd29vx795vB2/fn99L2cMZN90SLnFIlcutWYOxcDlGaGV3TCPK73KKhAbBh1VM3bvqbNpVq2JxNp9i17s+2cEPVZ9oYPWp7cuWpDQfLZR9hPWbZc6urUs6v2zVXFJhGRleLucDt0Wr1bRW+P3uJm3dqUY6O4DwbuFNhnIeN4y1+wkrfbKXkH93qbbzWYMd9eqrNqlTg8ytmgFs3Bq+uY035JYV5uWhX+1yMMqubxV0g49jl8iDLCb86wUmz6nqU1/XRaWlGmh2RjNBoxr6HVqGZKFIt3mGLUIPqanNFbONH9RzebDys9V+aKByhEVTn7Isdkw2i5bzJEa417l5Y/Ti4cf/vc57irDjximXq/AzN48myfW/LxPr/bTWUYzhnnrOdV5asd5WKtqbqXzb/fZUpHk+ND7ccpWNxnFwyDNT0aEXxJtgXNtIYwx+SVb38oKfrw91WdU+QZLD2Csiqs0eR7vVqln742GMtXno7Ucdn52nxsXaVS2m2pLYpllzSQbMfOr1KjOm9ex6fulf65VhPq+aJBX6hVS5afO3pPi1VPeZuoBnFVNWSNmi6UBw4I3W4gg0QI6vV7Q3pcY0u6vY4vrK4a0xzIHG3A//XXoa5b1c8FDzGEVW9MqneKSW2FXtmmOCLOyck2f86Gfmfg7+1593bJHxeJVLeav0Vth9eD0HI8c+u+pqxzHkHKIhWM2e0znrR1dXr+82hbO1y9vuqVwfzxeXkpfPY8AAHwIBFgAgA/ny89fNLD6G/18/mvnee5a8VB3kfeYkaQVG/32okfM17FNblXnR8l14z2u6iFZDW63mU03M+frWPpVYxB8uwZ6S247m3Ldk17tdlZBYvNvylUFUnTGU1ZsRbdRvZ6mPTbZRg5C9xv6DCysGsxmL8U8n+IhgrfG6cwviRAqh0yP1WImRWK9f7dtfcnDHw3QTr+Bbl5FJBEi+Ea7dr2+6a81Z0EVn1oevZYSQUOsm4sqIqtYuc1empLDwLI98goTsyIr54KVCGas8mnWNavJworpFXetlsjorjZJ2xa4eyWTDZAvMbNI/77GdTN95pZVpA1vyZsW0twqhbRAx9f+XRdG8RBls8q9K1x7f75/OxBfQ9YMRYcHXntUnlVZp8TmSlmoludIH6NWC+eu5/SAMybl21Xrw9ijsqsWG+Ju536rPjPNvrH7a5DY2lejtVP/v17Vej7Q/jYHTK+JVvIylzJvmwqHV8PZrC4NYbO6UcPI4tVs+TpmftYiJLXXHudHIqTrT10KMK0lttRh4au+dF+0OFZFXWSHPqMsquIklhXktTVuYZlfU/Hn54ifCR4U1ngPSixZOGL7oFWe9bEC6vy5oJ/REUHlaeHdWFV8b8cpn8RDOQ2yaszLs89z3SzMent/8yq/7tfDmRs69e3a/JrwKsZqxzK/fJXxecrj8aLLJLYcGg8AwEdCgAUA+HC+/vhj6cf797Off9vvf6vfhLbThrXLakXzZMMCiwhTrGWrxteUqLSpsmY/+UydDH3yz+ZqaaoRHmWVVg7/tu+KViRtB7TKD62e2bbolCpW4TGGz3RqMetnRCVNtqlVW63v4ZKFBKPYcc44Qp+71GOwegz0rv54MrLqSwdpy7pZb+VWObTaHT3QspbG4Tfzdrt/Pw7bkjdvc5K8FWzkxkL7U0+qysytiAMZKYsAACAASURBVCNmcPm5r/H4Vmllx3v619t5K15FFCHBjAo0n1NUrT1LVithlMNItgZGYDWjjc5PmgdFU9aAcp3hlSlGj5BMVotenJMYqC0ROPp5ix2HEVrauWg+9Lufc20KnN03IWpbqrUMHuf6uPWoBrMh7WvmlMT2xmnzpCRaC30LXVnX2z2AtQbMUWJu2xkta/HnMzYErrY/r0SygeUagOjLG9WO3SuwNnk8fCi/VgDVdgtvx1hhk4d7/vq1bbDF7y0o1XbNNURd3/gMZKcFThKtlDmvSwNCC0J7BJulRFVcVtplGOqLFVJu8PPquWi7Gz4cfuSg82jF84I5DyDt86TtvZ5qRmtjxHdRjbXZNkr/LG+trGUH2Vo4jzMqCGvk1e1WgykRd2WL5LBtixZq28bSFi2rzb4sW0trLD+wMFGL1LpfoxrAbzrcXX8+VT9vVmW5bRbeafXe4+XFNlva9klbbFAt7AMA4CMhwAIAfDjvb+/1fD9+fbw/f2UVMt23tI2onMjV/iPW5Jdo3cmbc2v1y/aoLN/JcVelXjept+2BkgFBBA4zvyHUuLH3WUBtbfZbXxJVMblBLWcqSVQglaxsiZtdq4K5tSvlBKFW/TF1rX/J4ePzatWzfx736qUh+6Ot30tsB5xxbiyIikqubCOcsXXP8qpS7T8mTksIS7Rd9hhw7tsdq20P9Jfpw7/7VUKWAd+4htrrTfxmg+vPVR5TLODqa+ZYBlFe9OPBobbIlXg/xccKRSVds2M4xrQwIts6dW6QnX/bSOfvswWHNYfBeyVXiZZDrQTyx9VqmdM3Qq75RuWb9r8S4Yfmhj02U3pAVOR5PC10yIuqH08Ltq5qJrHWugyIrNJnaxHGjAiq+jXQ3s6oBlebVWflJaWD6C00lbmqmTLwycHpkpWEwzca5jfr7CUdsm9Vc+JVaF6FNSzk0et5NG/5K15KF6GMV5fZlksNT/PPJLYS2nPMNRct2zizKqrbcXnQY5+l2r75HGhVmm9T9JlwHqYWWzLg7423b9bmmyCz4q3fqueyNk5fry9H0EC12iIB31Dp50x3Qx4RODa73vyclXlVsvVYjLDlNssx1/m3P7EQqtqMt1Z2Gw5vw+Pt0a8h9xZsjWrBrn6W+nlau+H765t8//13su8PD7Oqz9U7q8h3j02Httu5tqHzGnDJZtfwtm2bhdYAAHwgBFgAgA/nfB6lH8+/eT6f30/xNENvLH3uzfj25VavXNqahzg6pLtEi2BWdNj/PK2x1iDd3HdvK1xugYK3F12VTdlSpEGJhhA1bvBrVJsca6C1Vn/4XKc+PNjxACGqfOqUsx8xmDs2m0luLrMUYs350ddi1R5aJXOeUb0RW9eiwmy3yp4a86Rii2CkOhlyZKudnascEh5DvXOzng+bL6taS2yo+2mVTlZFtVWrIpkRSjwe1yBwH7B+bXFcw+FXG6WGdj5PzCqZsk1rtZ5NOadvrNNQYKu7txPWLru2tlXfTNiieiyHW9kob61yitdtYUvz6psRw9JHtuhZyHautzjnQtWMQ7Syx6p0Ymi9DtzXAe0rYPHQw9vxphw6YDvbTOM86PWgFWE2f2nENsqobOvVq7u8DdA3D2rYszfflmiD1+OYNajJ2Vn20F4sJmVkNVMEJ1lmNkZsRKwraNNrTN/X8xwxn6muuWVZfZfuLZm+tTKC2OpBWI2qIwvD7Lz5YoAZ165sXrOo89a84tCDwRafI1sSML0d14fdexWeVyT5VaPh4kMktlrGc8j1Wc8toJLXVPUFAX7uJKqtrjlm3j57RkWgBope3eStglql5q/x7LefJ7X6zwdrTfQNhhLj0La2e3AVc+O2eLwM8/Rk2dGUmI+2+bbGx+dPvrFQW4v1s1z8urfirVZkezwssMoCxE+Ph7xoRda+fxNwAgDwERBgAQA+nPM82ujjb9faPklUvPimtyZX11/MOJIrBPEqkWtWlcTN+el39x5IZevc2lI3r0HZOVhc/0+DqhktVfov3L1JHVHNEo9tW8oi0LCGr6hcsU1nUXZl1SDRujVzltH0qqASg+atlW56S+PIACH64mbM/+k2pyq2n8VsK32u1q4qn03Dkxhobmz0UQQYxatcvFUy2iq1UsTuwUtUGdXVTjmiRTOiMW/RatccolYf9jw+h6hHBZZ/bVsBSLXKEomwTWdUWUBk1TjdK3tyG11UCtWc/WPnpsUMJw8ic1i7jazKoeARBjyyhUureqwqxx8mN/TNaO20DYhxDVgFzoyB2nq6IhDyNtDTAjy9vlppEcR4GLfZTLFhAYdW+Fg1W1xr1nA5PFyzlseYOzae3sJ2r5Ly54pZTDqbyV7jKeN4elXhriFPbEQ8r9lhXsVT4tyJD4iPDZoxXz2qEYsNfJ8Rms2IvnRbngW8Ee74P48YNCa22dDebiv2i9lqOqBfWyh7hEb6Jfr5sTbLCAbXBsHu58cqlbyqqUXwulnrqAeDJRYuROdopHTNX0cOV8+qwpgBZ611bYs/8/DVH9tne0kOwLf31q/bWq5KpmLvvVfO6fvr15y/57rM1PMzX9SgYWTGW1Yt2VqEf74YYRTdgHpd3/ZzY1w/B9rQINYfQc9dic+HBpz6mdTgSmd0ZXjls7GGbVX9/N2nb0JGAAA+AgIsAMCHc/a+TZF/YYzxYuO4Y86NbiXTFjK9mRyxadAqeiSHfGsA4HOudJuZ5BB0WR2FMZz62qq35vxolYnOc5oSQ9vFgym9qW3RZlabbI8SN8zFK5zsS69KCR8y78fiFTHzCpKiJahE21bOu8oqkD2CFT1mDU1kr/YacjPaiCqnai1Wdc2VmhmWxdfYcOhoo9Jh5FakpMd2jmi38+Chi8/WGnK1WQ0/QAvr1uwt8eq0rGaxWGDzgd8aaHgFjwc8zW7CZ8zamta2ZVU2M9+FEjVEzWcaafw1vbUzwyubbWRtgC1mMh3y1HlOOqw8Nshp6LK1FudZW65iwPr0mV2nBkMx5FtDjLP4rC+7LvJaaJ5Y5NZJifBjhWoxv8vCimhz9EDNQ0kNPTQkGRpiaVCkL6Qfa6h+jeBQA5TDhvuP1fYqUYVkRxdhhlcedRsiP7P90zb89VWlVGK4/3oNpayarGwx1Wtc34escNMtiVYlFxVhdp5ntm5GI1yL6sIiURFk/+CzpLLSLobwZ/OoVQLaLDexVj4N1nTD4gqPI39ZmzjtfHW7ZmrMqZKoxGrFZ1aVmGNV1jWVWxdlBas6J8yC25h8NSO806vFi9Sa/wyQEfOxZLW35mdPrymbYaafg5gzp9egXnc5V05f9iZNA3X7nK1zUHxxRJXVEWvVexpA6fPp8WuIXaKKzSogZ7u2oNYi++PFrj2tzLJQbH9IfdlsqUPX9kmt+mIGFgDggyHAAgB8KP/w3/0Heku4tVb/xTbaptu8pq3X91Yju9nMAdLiydW4j6uyIMpvEm3LWvyxzVWyIeyn3ai2NX/qujkfsXFPb+BnVl0UD4tyO9veHjE8eljl0hHbxWI0fGxS01vkdm1e271aqEwPPewGel4BT7G2uRiuHTOYrD3LAjhZrXDFXquVTtnX2hytc66KpOfztKH12UaVLX02D0kDtK2uNjEbRp5r/6dXmZ1RMZTtk33120WgM6JFqkzfgCclwglZM7J8RlhdLVQaslmliw1vj0BPxprpZO1WLYZiS4Zxvo3RnjIiqFY9GNkee66m8/lH+rd6nmKLoA02j0H8WvmjlXP+MkYMQD89uNL/iLLZYyWeI7YSapWfhkgR6ElWZEXVjliL3iFPbemMKiettqk580v8eqkxT8wH1Gs1U7EqupGtk9WrB3PDpG+b9PbMXbwkx6vzzmh7K9Fu5++nnzwPwfw8xTUSFVV2vTWdz+WVX30c8VqjjTGXEmjoGOv+bG5Ua9Hi6bOs9JrJrYA+bP62XTAqBfX1tu2qitpuWwclvtJDwWtunIZ6fjxirak2QD+2jJYI1bR6KSuxrJpPtzfqexMz8WwQ+stjzYg77zPxLNys63NtRWMtN3j262eCVUdlVaCfwZy7VSMYnjEXzwLA0zcl6jl4PB7eqti7PN+f8niZ3iYZ7Y6bhcNe4Sf3sDHaeT1U7FK00m50eX9/yv7ysIo6m831x9qcAQD4a4wACwDwwVgdxOfezz/r/WhTstXIbwpr3LufUXmVxVT2XVrts20RxpzeBrV7OGJzifSmfL/9q3O1DcoKbraa4cfQAVMerERgYM+l84wkqqJs1pGHX5s9bwzCHrERsdVoD2pxsy9RSeZB1IyQYFXEjLFCEttmd3avOGoRxumhnEccr7eiWQuV+Aa5rqsJR40b8XhVNTYClhrBQpenBhjZLhbb+/R57GZ78xvwnhsRbzOCNPipscHR5hFZaJMhoVcd5UwoD25GbIn07x9+snxjX4QlLcK8LOuxVst4PmsbjNdyr5zqxavcJLcr6nwtC2r8uX0mWFTMdA8/dNaUVv5YqKYVPNVb8TL40ZZBe3V2/rcIJXu0h3qY5K18I1+t/brnsPOYkaaztraYk5Szyaz9M2eQRfVSnXnR1VXZ5K13Phh9aw8LNawdtfgA+hzaf99meEaLqf2JzvjKgfkaNJ0xWH9eiw30zyTa4aKMSjSus9a8PbdoxmB26dKm/5kHk369W8i6qqKijTTa5vJzkudLMhC1WXESWyw9+Otz3K4br+LyJQ3F5qFlW2ZuTPT5U2VVk41sDdW5cvG58KC7XfOjSm4gnbEJMdr8rFWveZVf8Xlv1h45b1sbrc3Rh7w3+3wNq1LTc2JnSEO0uM50L8Dr+7t8/vSwE+DVcFGBV1tUzRWrIrS5dRrktbrmkVlFXxk+t0+r5vopj0+f+JcbAOBDIcACAHw0et/6uUj5O9n5Z6v6tWKjaStWj6qHIVkWZS2F3TfcraVy0wMeq3aSviqodCbTLDHEXH6xiVADAcsLZjzzjEHP3W/KRVt+fD6R/e82zGhEBc2+xaY/HaR9+FD2hwYD4i1RFlIUb6/yeUFR2RKVRPYCsuKpeHtUGV5VYyFCvK6WgUgEMbnhUG989eWuv7eAQFZAoDfUtnGt1ahk85Ynr/KpqxLsjNlePqi7rDCuRog1VugV7VY5pH5tl8vB8S2fymdBda+i09k/1zbJuTYi+hyu3HLoLJRqTc6YheaB5RVuaLulDRWvmTWeXvVUPQy09rSYlZTztrLN04IUHapvFTqyZnTFM0vJxCna0LwKbkb4EVWA5bR/3qtXVo14n7VlUIOWU9sfW1ThFa9Q0lCrZIg2vbLJ3/e+ApU8vpyvVqNqxzcAllWx5jOuqj3+Gds6vVqxe1gWlVY5Y2xIjRa9GNSus85a9gXGxsPqId1zPFdLZMnqvx6BlV5fbfewbA556tIBDZo0lKtztRhKhNC++TJmdU1PunIboBWv5dD6Ge9pbpAsXh2XA/DtXFpVk7+vNlPLrqlqmxwlKgFlbSgtmUFHi6mfd982Wf398XTvCuokh/z78PteYxOqfvu+e5XkHHI+x3o+2zTZveJNbPHC4dVw2S4pXoVmbY76Xj8PeXx68etIP5u7v089KzMbFVgAgI+FAAsA8KHYPKhaPvU5v3t7eyuz+VY3myvTzzXNaohXYWxWyeEtcbq5T2+wW91iy9lc4YMNXpZrBpBVmsR8rHIb6j1z3lRU2mSVU43WsG4VLHJtP7Ph0rGNzqpvPNjIKqcZtR/W+nT4TbVVqhSJtjnXIgwp0bImNsj6Ckrs2A8Nlp72+nxweFnb5YY+tt6szxKTgSKQaBJD7f0PjtjkJlFtZXO0egxG19/PDAo8WLD2sJhVZKHY0LbJY4VVdnu+7rOj5U4jklFts+B6Lg06rMrFK4pKzK/q+VxWhOYVW1q9NS0wOvPNi0HhHtw0ySq1DMH8AU47vxHmtHIFETHXqEaAY6GCHb8HPv0c0faXVUU+Cd23PnrwMGJ+moUy1bdYWlBzPi042etuc7Zsu6A+piYdGmZa4GaNg6vNVcOtUupqKVstehFcZsBqwWBUOGmQ9PLy4sGUBWkeFHpVW49WzmuOl4WP3n25NnfmBkJ9O1tUHz5Pf/zjeURIm5s9PRw6zi7RvWuLA0q8HyXCQVtkUL3iqHa/Zmw7pFYhnR5w7jl0feY1Ulf7nrVm6nmd13WytjpKbkUUn1untWKRROkreuj1Oq7NpDXCX69Sy3OhofT041yzsHTRgC9gyMUGErPl9Pqst/ZWr46KANzSQG/D9K2RxSupcjh/7G7Qtks79pzV18WnzOlWwvaImXg9NhNuMcy9xc8Ov9ZLofoKAPDxEGABAD6UUksZZ3+pW9sfnz/LeRxy9mxS22JI84hKHy2z2aT0vtqqfECzthheQU22lo0Mv/IGNSocrJJqXpUiGWKVeg1dthas4o9lVU5nVgDFVsPqf6eBTC1+w6xDsK9ZRmMNq7ah5yW25UW4Zsc4sx1vxIDtFpVPRc7TWxZzI162KebGxMOGh9c1v0uDLw0ftpjR1KMNLOdp2WBrCy9GzNu6Zg1ZGCEZUJWo8ukyo5Knx/ysnO2j7XlHDC/X6iJr/Zt9zSfTx9LWsHmrdsvnymqcfP8sZOinDevX13pGG50NKddwobUYzJ1VRCOGk3tljl8BZVXcWU4zig0X7zHjzAqPbJ7SGVsJvfVvrjbOmH0Uc79s+5yGfzlLKVpINeywWUgvL9bCZgO5473cY5h9y9lmxR/fgqYYEO4bHL1aa8hc1UFr0H3MUrPrXcPTnO+lrbQ6MFyvkRlhyYzKn3h9dv1sHmU+NdzVkGW7rvcZX2vP0T2M8qq2uN712tNAzjZgeoVatrtd1XbeVlejosmqtoq3zZ1xbluEfRItqTWfcy1PuIogfRtjs3DtPGMovC4J0PZcuw5mDKmfq3Iw57RVq77zcNl+ndcMM9ub2KPdNqrUzt6jvTPCryb2cyaPTyIc9vctfpbkUHqrmNL3eouqumIVhfefKRZotXoN7Y/PggW47YzzVeX1PKS9PGTXasxW1+egXh8VAAA+DAIsAMCHojeGUmXbS9tPrWQSv3G0yosSLT222ctTmBqbxiRmW82Yy5NtbH21EmULmdXQWPiiFVvWvtfHmuW06Y3xreWpRrWP3eweQ3xRWZWMAi4582fIseZG6Wysh92EW/gS1VfDtqudqwVxRgWKzTmKihy7sS96bLJatJQNJR/eVqk36q3s3io2fMvhOi4N0mJwfT6HVTvFvCXba9e9Gq1E5Y9Wsb28PNb58rldPsNJA5tt36zSS49lk21VevUIT1rOfIrNiRmW+ea6uaqZ9OWdz9MGVvsGu2lVPtYqFoFaH9m7F3PFVpuiBx6nPqetgxsWjtnzbzFUPStpIlDrMaMpt01qRZ/PO5prsLmGK1615+HHGu6vx92vqj5t7dIh6j6PzINTDVlLiSql6q11zaqSxEOjkW2YW7TI5XXavfooryEb9O8hm0RoKFEptq1KIG/LtOrDCEisBbB6lZ6FgTqTre0r4GsxZ+u63vycakCl32ebJKPSLgfz63t4nNkGGkPV4zCLD3bzyrJR5ZhnbEec/h5osHfGfKvW1sD9/NTYdVGGtdWNcmv3K16xds6xNi2WmA9nQdXtmrJw0FK1qKbUP9H5WS+xuU/nZFX/LOj56KV/0y7sw92vofJaWFny/Soxk276J2XGnDG7huL6tutB2xAjNM2h/HX9/PFga8R73aOa0dslT5nNX8VDq/S6z/2aGVxXtg8CAD4mAiwAwIdSYvvbWcc25injOCwwanbj6M1cHpZka5Hfbz723Qcgr8qbIuPwNsHc5pXVGlvJSqy+Bmi3++a+Udaw6DMqTDS00Jk2tmEv5mitKqf6yyonWVsJe1QeeVuYbxtrdf5illFWHh12U59DnWe0EmrAUKJ9KQeX+2ynPbYW6oNvEbT5Tf+MqjNrL5yyNqvNCEjs9cV8pNUdpcdt7XRFjuOUaZvQmj2WhX0jgsAIeEa0pEnM2bLWwZhxJPneSHT4acHVVtbGNw+ffBD8tIHwW9Qd1QjUonrKcwvZ9yY9Vh3qOdUQQYdhWxXOmJFflsjuZszAipbA0SMknLGWcfo2RA1qxKustHrq5ZHbJ6dX1GU1k57uMVZgaYFJbHOsUXEzLLxp/l5MH0LuIaQ//qg+98y/tq86qzOq/ayyrpYI62bM4vJgx7Y4RqDiQYnPdJoRjA05rW2vRJuoVcLFVsAeSwZkBYne7jcODST3+DxFPDU9jNT3QK+DIzb91RjOvtkg/KvSzgfi96gkG1atZ9d7zpAbGU55a6qGQdcAerHKQauoi3lXEu2tNsA9twbar3MN07+tDLBf9bzJFhVrM2ZJFd8OuscGyBlB7FqVKR7ySbQW6ns0nqeM6lWQFnKOKzwrMYhdor5vjyrD1so1X0xD6bhepw15n7G2QWKW3LTruMR8q12rt+I90nPd2/DlBnu2QzL/CgDw8RBgAQA+lNUGNXxI+IygxSqGbPJ2kboXayvSm2WfiyXWgqM3oxkcZPVOa75pzitR2hXkRKWTbWWrdW2Psw1iWSUSVU572aNiZ9jsHC9AiSqn2PQns3xT5WRhgN609hlVTh5qaQVT1dX/4rOmsrYlw4Verrlds19tbDa7fXiIV2fOMvL5V1X/c2BEK9etgiTnK43YNpfzjWakfCVa5nKelQUGY1wD7mMToFWitQiW9Ib99MDKKr5igFXOK4pCOQ/EWvlmzldWu1gAqa1ps0c7X7VWLg2ASpxDC/nWt055Hk+vbNGKHh2Mr685Wsnsfcvwzvc6XjPGYlh5iQHlpt7CD6tSm9FC2dfMoxrhR14r2QwpM68dDxke+8OGy1v13lbt+6y6LoqlPIj0p/HB7N6CZuFZVB6tqW4zQsEZ1WZyhVg2MLzHNWzLCHz4vDU06vmKRKxtu70W/Wxo8KSfn/2xrW2Sed1JBLg+0N9fpwUo+v7v3p5n1YoWLEZwp+d/bVfMysGxNnEeFirPNQ/Kr/dDHi9+PY71/kdFo3jwk3pURNkCAP1MdL9OtXoq40PfHDnyjNn8L293bXb9dqtWFLtOhoVM29omOeu4ZVhTHpp6RknfaHW9VznTbcZr0deobcq2ubJtVomox6HXrz7XFkGqxLZTfX9ahJz6xsySYeiwTQGbXVtVNt8aYG2H3pboQ+9rIbwCAHxMBFgAgA+n97Hpjf7j5ZM851vMauq2WdCHHGc1kd/wblkFEyHOiARFQy6bw3NrdbMAIEKavBHPVjithrHKE1vl70HQVvcIHYpXCRUPuFpWObVos4tWRJGr4qXKvcrJb+5n3ChXmx902qwhieqsHOK9AgOJ6rBow3rGrK8Wc6Dy+UbJ7WZ1zf1Z86ZsIL0PePeB62X9XSl1/bN+zYjKFG/lmzbDa53bNfy9rAAsw6u+tgaWFQLlLKhZ87mu57WB9qPf5jxFJZTMVWWWGxC9Oi5CRc0IrGonWyOnD+7vXpW2tZxZFOcl287iPNQYHC+38MMCBD0zrUSl1rfhx5wZ5LQYHe5BmIYYWgGmVXkWRGr1Vds9xBtZ01aikieutWh104TJNvqNq51znWMNg2qPc+psI19sU9SQ6eXhbZ4eiHWrBLS2P3sPT29bzbY1W8hZvKqqe7utBb3R1vrU6yZCXAvAtEU1Kuss9FuVemUNcJ8RVq6qqNv1LlEBaDO3pm/azO2BI2d3lRzK7iGjH59EFdWw77HXd5w+m0zfc7uWajzu9Twj5sYN277pVU4W7kaGOyR+JnjEGkGzH6sGT9M+92dU/PnWSauqis9ebtW05Q17E9EqSW2f1YrLo/vnJD8ZZcZst6j8i82UtV6fs7lm9UnErcWqLvVa83AuF0fQRggA+HgIsAAAH0qJOURWnaE3daXa5jxty7EZMlqFdB/a3ny2kAcfc80YEpG46b1VAU1ZLWYWcFWfGWSVIjETKWk1iLYKerAhUvfNZiGV2NZ3TQSKCqn4rVc5tSskmtGSFlvfarmOR+cOaYjgc7FGVEN5S1M+lt3wV68S2YZXJ+nxbqXeXlAEcjp+KIKmGkO213yhiF+yFc03+HkrmqyKrGEhns8K87a9ohVFUSlllSTdg4A26jetjTZXflVbRSBxawXUm3N77+4BkgYa2l5WfXObtmPWe/hmw+g3H4yvVVH2Pl/tnxKhSc7QykByrEClejua90x6ABTvnA31z1BBtwZ2bxvzdszcDjhuc4xyALwHao9tt++3Trksept+HVlAqeckqvj0HOmge537ZC1kdv169ZIGcvt2hRU6g8muST0XWuFWiw3I9xlMPQa++3wvvW62+oi2TJEeYWEfvl1TrBopZnzp99rWTR/0b9U/cttQqK+reNjiWwCilVZ8u2az81CiUszDsRFVg+VeaTe8bTIXG7RYbOAfCw8GtQWvR1XU0CK4Ec+p76PN7orNjxZ0+kyx/HyNiJZspUOxXYIWhp1R7ZhD+S3k0vleGjJV/wxGFmvXlLVv6gyzzVsY90duL/T2yEPOGPDe/Zx883Eb8nx/W1V4ei40DNPPjth5LPa68vqpFuJFddv6QeQ/sqxyTYO6aCesva5h+QAAfDQEWACAD+ZqndKqim5taXO1c5VaV9WD3hg+YljyjK/z4cvDvm7EtGwNiXR+j918ildz1LwpjvYyvzePGVktwzL/Xusq6jnbKW4up1zBVYlqqOozcmot32xWmzEMSqu77KY/5urYjfWt0qNHBdS9pdCCkuKb+WZUxFTJ6qustop5Uc3bySxU2q82upUH6ea82xY3P+bYehZb+PbY7qbDtzUY0depN/rJ5j5Z+FV9sL5VSG0eFs0jhsdPC3fy72fM9MoKHauQ8YlIFspoJZPpwzb9WaBTvXLsvA5dtt23yGn1VmQJPocp50npOYpwyjY/RpXX1aTnAYNFUc0Hps+YTzQj/NDqn6wcsqqb6q2cObRKh+jXUWwzX4mgsuamxnVdVqty0uHm02zJugAAIABJREFUVkmlhV7HUx6P3TfRHV7VVWMb4ZAMFNsK1mYvUfWmM5eahSM+c8vP9dpuV3w224xg0a6Necbr9QvDgjULfnX2UrWWNVuWINFaurU1c2nEVj4rELP3MqoPb7PNJIKvHObuQXFe77cKOF2OID537B4M9ti26O2SYsFezu7K693DOomv8+A1A1aJz8GaBxdz8+wajgH97bHHZ2PYLDytLLNKtn7IWUQ+6c+DuE7t0KOq0YbIjx7D7OuaVZdbSDWc1s/D1lpUZ4kP4h8ekFq1XfWZfXNtvRzfhLI+FL7ZfDILd7XCK+fNiVf3tUYFFgDg4yHAAgB8KDNCKqtyeD6jJc0HQUvc8OYmOomqogyvbBD0yBvaa0lg3tj7tjEPZzTsKdmWpiGM3kTG19psp5i1M84IAaIVTduEtHVIoo1Qb9hXO1xuWcsQrdRvq5z05rb7kGp7juFtbfp4s3xbeaTbyaw9r58eWtQi+8tuoY7eJPs8pBota15ltJVtDQLXm+xqz+1tdK3kDXFuOZuxGbHGDKozgg0PhHYpEUKdUbHlbZD+Wqu0ffPgQmdWnWcMY4+5P/WqT8sgUIOBGUGJvgYLB/R7Z5dt7h7g7M1mmWmFzGpRK55eaSXcZi19suY55bn2ZYtXS540fzyxoCvb+XSb4ryX0VztXBF++Hnt8ogWPRtQ3r1NsUYwIjbr6mGBhbae2Vyo2DrYbKueVl6VmKHmIZW91803B2aV4GpfzTbNDGAjcMoqI1seEHOeWlTpaEWWVQU2b23z4/Lru8cuu3V+tIqqeYTXs73PPl9lVdDpTCarjuq3oLLHNsTh11rxcqNbVV98ENf1niFcbNqLYKjHefANix469/OqivKW1uJbE+21nR7eaJj12GJ75JDbS/LKRZl2XD7/LKr39Hx0nxW2RSWUbRt96DW+R3jmMeqZ2x6Ht87qjw0LAeN/W/Nr1WpBbQul/0ywa0p/NmTlpPcs2hx5K16buXEzZ+nFbLiodKu5TMKuVf1sP/zaGn7M9vq2jSHuAIAPiQALAPCh+H2yj+LWFsJ5HLHq3yfa9F6iwsnX4Ovcp3WrN64baRuqXZqcZdgNrwYluqVsRltb71dFUFmBgVjboN5MzzXTKpt+ol2q3OfZ1MhXvh0Sfs4eVU76GHUNhdYwQ9fn6wYyq7h48SoRC41ii53dNGsooZsVdUaPtQx2C5qsRTAGbGt41WwL4rlmYZ31lC0rT45TDt0oaMFV9jcWe+5SroqhbCHTQEqDpRkD4qXKmhU047nkPOVpbVBDzqcOB9/tllyrWg47pnL1Klafp1RjDtaMjZA211rnB2k1mt60t9wUN1dGoRVF3r41VyBprZzWfndaGJDzrEZWy+zeRlosdDtkTB+KrV+z5fo/mavS7B5+9Ag/rAWtzzUc3lrNbLj/7iHoiFBpROnM8La7GW2L1gYa+ZiGr3mdtAi4RsyjatHuOsZVWZihxjlHVOx4WJpbDn1Wl79nviXRPwdazXXatsBmr6U2b1m7qn6m5Dgt27hn56SvwfbVXp//5+Q5bhVWWRXW6hrU7rPy/Rh9KcD0irLcGlg89LP6uuJBtLWyRmXTHsGgVWB9UxV1Si+nPCwY9M9CjWonfZx+jNxPaeFO8/RL5jj9fbSqpWbX17TtlC1akfPVVNue+Mer1K6qMQsjI0zMeXQ2xL14gGbz9HSIuw1wH7JqpCwMzSqqK8CbsaUxh7LXW1ugtS/WFXn7a4rzriHeNocc7+/8yw0A8KEQYAEAPhStYLFQStv4ht7A+iY1venu42rXqquNb6wB1OL3tT4zKm6UraWv5Kiq2DKX1T0xFPpW+BSVUL7S3mZSxQB2a2kqRV52n5+TVUUlggxbjX9r+7mqnHzOU1bLeJtfbDe8VR49arOb87K2sOVWvGpzj07JbXTRprZFkDZ8MPfetrXSP4dmZ9VVrS3mJN3nOo0r7JteVWbtTHvM4ikehpSiwVBfYVeNGUE+12esMKVFG6ZVvLR2bU9sEfhEqmXPdXrF0BbPZed6ekhlg8i1EmhVKc2ouBsxZ6msqiWtqMrKlvI8IyAZPvT/6HEdRABZrvCjx7yx00JMD1Ky0seCugj4RtT9+aD2fttQF8PoY0vdtoa9z9XeaGGaVthVf+5VdVO8UspGNOnGSJvhda8oG/YUZatXiBIzxcqtMsuuv7gm9u3hg+1vIVeGr9ZyW2S1yZacSRXXiFcKeaXdmje1qseKFK0Gyuo7fZ+aB4N+3fn1lUHYXFVRfv3cg0F9zj3bBLUC8uHBoFdFxdKCcV2bfXrLZ85V0xliuaVQA6V5m6/mr8erurbdA9weLYhelXX+lVVqvkzA2399Tt1crYNWnbdd50RDWo2+HvvumyJntgkP+0zkrLv1QyXah2ssX7BKP2sXLtHCOjyQ3dvVHnwOOc9rLhYAAB8F/2YDAHwoJWYXHboh7ehrO9i2F5HDb1aLDWpuPlw7A6zc6bXCKZ+js1pxbsPdp+/494oVvTk9fJaVbwu8QiKbZWOVR12OCBl0M5pVHukA+H5VfGm1V+YbWR2VAUS2XFlQcg4LM/Zb5VEen85VyjYzezWWDwwrQsq5WGtAuBRvsYybbLG5XW1t9pNoJbTjy1OQs5BuwcCI4/XXm+dHvBpl5KDzIqdWFEV4UuO8WRdZ8yBhPVdUv3m2Nn2/4JirokgrmsptY92Q6/u80s5nEPngbm+TrDlvSL9Xq+iGV8vYsPLi86a25q1tOd8rZ3vpn1vFl5ec+eu7hR82WD7Cjz0CA28RnTHnq3twE2GP95vdAqfiFU0SG/Xy8fWYusUU14bMDPvu89GsYixCq4sHI/40MzY0xvfUnJ0m6zxrjpQbA72a6IylBv4ZsKCwrNH6XgGW7W/is6X0etKNeVr1eMqxhuSfR5XtsdmFra2iGgZJbOiMq9Rmk2VV3xhRxSbZYudB8C+Dwf2PVEX1qIqyz6JFix5c+1ZAWYP1bT7YbdNji8/4agmN+WsZ0Ol7+Mer1HweXI9KP/25UGZd14VEdVmtfm3uGdhlm2c8h23ArH6NlTXHzn++WIgZx2EtxfZzYtrmQf2+fd8sDLOqz9g+OMVn3mUrKwAAHwUBFgDgQ9Fbv6N7VPI8njbLylubomLnecpTW+O6V0dltZXkprgWrXxzRHXG6ZvU9C+Kz7Y5o7LJqj3OsQKVWFx2VVIMbwUaUeVUa8wgOn29v98v5xyguarBrNXvzK2GZW2os7lU4jet/jg9qleKhSa/rDw6b7OeJKqu/Oa5WAglNSo28vizSinPiVUrRZXNCl2K3Xjbl1jAMFeAIFFZliFYtnPN2OZoYUE+hgUyV+hlG+cidPDp1HLNORLfmDdHzv4pMmpEd1GVZP98enCkVTQtXtuMkEfKtXlQ//l4P2Mbn4dUpdU13srev+FVP77qrcSg7WGB07iV3N3Dj1XltEIwnw1mgZoN6PYZULoxUeLxc8vcaRVccXwaTpx9nZ8Z2wavdr6ckXS1qfbcWKcVQ+M+9LvcrjMPh3KDpD3Slsc47PNRY0+fbbLTdjStaBs9Wi6jss7CX5/4lte1zXYr0b7Y/f23SrvY/DliplvJDZlWabetVsUSs8pKXC96bmYGg/sfBoM6xysrGL0i6dvr0EKlCGq9bdM/G7l10q+3Zv/cbYbdFV6tUPe2rdKr1K7P7JS5Fi+0iA97hNt6avLniu0btYCq2rZCiWtWbp25JWbF2XWXwWSGXNqCaIF1bDQtM7Zg+nWgLZr7vtvn+VEf9hznoe/LWK2HAAB8FARYAIAPxTeU+Vp6vYHWG1CrZhkzhj/HzWbcLGvCZZUTPqY9Egw/IzYja0zfKmiBgf9FVkHYzJxo+ZlRoaPhUCtR86KzjN4P+1U35fWYbdNGtHjVYSvwrUWvlGuI+7gPtY5UzFqwRgQ+fgM9owzIhtZH5ZHPDfKZONm6NGOT24i5UCPCDJ31Y8PcW4v2yZjdcy2Si411c7Vfisg3wZus1jRZs5K8AuWqDtNnzOfybW3Xc+WMKvu65hsi+xjfPP69vMhzmfnNc/3yNj2P0wK64oGbxEDwPKa1va3Ge3hr0ZOo4mnZohdPZuFHj/DDgiIPPzImmb8IP3rMdtJZZC0qZiSeKrcCaoWNz32yNZD2fRqtPa3ip9oQ9RnhWV6TeQ2WXN23tiNe186q1tLn0SqyKiscHBLBX7avWcAk6/XUmBlmc81iG+DM8G+LKqloXbP5VBpOTQ8D359HDCKPNt6a85u8TdfnYeU5Gh4ERVVUVi1lKCsR/mRV4z0YnFrNZcGgb5z8ZVVUvkYL2TQE6mNVnkm9XSPxdVeVml9Qv8x+VtBtrbU6NH3Gdewz67x91z+HeU5rzP8qNjOrSIsWzFlWnvjNZZ4tpx5q+rVWY9tlbv3MFkKb/2YzvzTYPuxny1a//c/6e9AKAMBHQIAFAPhQmk9KkrpvVlHy9nZe85Tixt6Gb7eYpyS+IS9vtEe0lflv4mZ4emtQzcoQ8UqlmfO2Viud33B75VMMdW/Vq2tEYgOizzMqNt8n1xwOGRGSzRzCHVUbMzbyVQvjDvtyD6RuVSKnhxpeeVRjjo6nPTYfRyRCsLKqXMru6/yz4iXnElklWp0x88jnK3nlkdwqhmK+UjzviBDJq518oHiLqrEZg7xzE93MwCQDmWyZshv0Hu1wHrxItmV2b1t0ZW2EvG+vuypevI1QB3d7RVFZlTlreL61Y27eHhc1YTaw3UKJW7tdiaBw3Ab2/5Hw4z5A/g8SiQg/Rgzh9nDPHy/Pm1dMRUiilXaHB1/DBopvVlhmbZcxD8rnMc0VJI5sGV3XT1RrTW9jlflte6JEZU9eP5qDtVGu92dOeR5aJThXRZdEOCc2O8u/xq418fezxzWbga43xJbb3LRbm25UMmUbasn2STu3MSjeqs/8OhzZfJoD62Pz334LBrNK0QKkqL7Lt8BnpvnnJFvx9BHu+c69Ss3yylbW0HQNm/WzouGfVoOdUdVXbEi8vl+HtRiuay3mhWUSrO+XbRm089usXdhOZfdh/vr5aDGDbg1w7zm/TL4J8CQ2c9pzS3y2ztN/3m2+2bPaAopiVYQAAHwkBFgAgA9J51xVq+yIm9e4wdeWwBmh07xV1lhFyXmuaqYMUizcisqYNbg51vnbzeKt+irpDXtuqbtu4GN+Tsn2uWHHZAPL9RhjE5m13UXrkTXLTW8bylYmC19EYjrStyUcNabNr7aqqJqy4z59jtC0wfP+9br5b8sZX1ZR4xUr0/MRCwcy2LNgSvwm3LsEryHuEq12NbbjSZwODwYjCIvnymBmPZf84XPNGDZeZrZXjrXZz/7Z+zS1o9PCsjqvTY4z5g+NCG16zjlqTZ7nYRVt1i7Yxx9p0VvFTB6wyPXnZ2xytHbNcYUJ8svwY/6iRS+GkY9xrkDNqpy0nXP4uazD28J0s6VW9XloeFrVUunV2/t0hpJuMyx9BTn357c2xdmuweradvbY/XEjwLEwyl5r97lXI94jvdY8cfRQ1wLIYq2usuoCswLN57+VmOvklYDxGRse8Oh7LdFGmxVX09cOxvHGLKs+vql0ur+sDMvmvTIqv2L49VhaWY/ns7t6zG7LqqgWSZK3RebFlmHXNVPMQ+y16bF7QJxzsyxYHB6j9ZydVUUe1ZcU+HbLvhK2Gcsf9HFsM6iPlvPvnafNu/LqND9u/327VXFerzoH0+eGwpo/U+zPT6nb93asFm6Osd7/b9t+AQD4GAiwAAAfSonqheN8+uDlFYr4FkGrPJnXBjRdVzZ07HS0dNWeN88+mH1GlcyqntHvKW213Ym1lNW1EaxGNVMZI7bHxWDw1YIkXoGS862i1zBb4yRb4DIgyOHmMfw8tTrXja3ItbWtxyyjbDP0oMRb0kr357YWtqxK0Yq0vco5dWZR3pCP2/wsD6bGquSKECm37E25Va9lC9j06qLp5Vm9H98+V4+5U+u5zvVcLUMPyXApg4cMDuP97NdzzWzjWxVFsdVwBVFaUXSslkD17H0Nn9eQakZAESO8YoZWXU+sYY8OhZ+62XKFd3VVF+nX93U9RctmVn7ZLLA/3qL3fjx95Ff116bLBzRk0qBo37yaTDR0lc2upXy/73I2Vbx6/331ChyrgLMh5j6zqeTXRoWdzTjLuVHnWJsI11D3GSFK8++xz0X18+2rLm+LCKq36uU2ghHzsNYb2LNFc6z3714V5df6yI9JfK0HsOUXlXZ+vX87u2vGfCx9Pm3N1csqH7uMaz7cvZpp+sm6tRxe59CKyWqGZNWDZJsP5q/7+Tylbd4eK9lmeIpVd+UsK4kqzKdWSYlXWvnxt1imENV1tt0y3tt5q67McxGhom0y3Jr9/NJQ/Pn+XK/Z26FvrZYAAHwwBFgAgI8l2pp80LpXP1hbUdywbtGOV2PLXx9zhTQ27+gYKzySbNcrXhOVlSm+kU4HwZeohCgxQDtCseJztfTLtLrCqndiGLMGECX2udW9rm2GNmNoxmZD8Rv1DJk2mxvlM7JqzPmym1YNinRQ+NHX5rMMSiTCEwso9odVpXSbq+RbGk89ONsIt1mA49sJm2000+qVUv4wKNFAIqt8RvWQZtMqn+JVPiWqfI4Zw8Wj0klvzEcMqB/d2+D06+y5hm/o++UcK2/bbCtEsNbP23NJDFA/dCujbR1sK1SqsQEyN9bNnHUWIaEP9Z/RBtd8WLjNifJ2uSskKnH9zD8MP2ZMEyvfhh8Z7lmVX7agRaBWcnPhvUXPp4mv4qIcaP7YHxZf9OP06ju9ro8ztw14peC4ghJvP4sh/HEt6mtZlWDRtmnnulQ/7zZ7a5MS11etU04NFPXvxDchSsxS2jOwquWamyVjhUoZmJwxuyuH/XtFYYaQI+bH+YD4v7IqKn61wkV7rLGq1X45u0t/PSIYLGt21/TPRbs2/502QyqGyYufL9sIKv6ZkAiT+jHtHOhn99oUGAP77TxGoNSKDbnXwMqC4miZ9MC6xuvT67OsAVerTfBWCZo/M8ptblUOcc+Zffprn1dou5W2qrEkt1TaZ3rY/6otTCDEAgB8LARYAIAPp2xF6qGBxLBqny5XUOVVVWVVC9mAdm3hkWY339ZeJlfrkt+W1rghPnXwjoVW1oqlN6Br5lOJYe1+0zujTUpvTG2YfIYLFkB1n2l13kKiCE+y5W+LG+y2ZgdVC6BmfK0Oka4lp5pHNdcvghK95T8PDYumVR/N6VVjtup/HP4Y1TetzawY0++y48qb36tVrloVSmxrjCqf3JR4r/IRuRYZWiCgLZljWp5lYYw+Xwz/tna2P3IB5ga1Ec8lf+S5+hjffG2JiqKMBXxWVLm1dvnxzWgN1E1tY5QV3ukMMen3155KVFplZcsvwo9bi97VPjrXDLCsnvOZa37+9H32Fj2/Br3L08MPHcbdYlukXmD6q54DvT4tVIkQQ26tZjU3MeYRW0nXsKCsxly0NdMrArgM5Kwya5So9im+ACArn6wKa6z2Og1tvQrJH6t338w5VzAoKxg8Ixh8WEA7JHNB30NQbep/ycHmUdXmedYV3PzVs7uy0m6uVl4PBv397G1+c/22eC8k2mBrhJz6vtbY3Jltd+0+zN/m00Ub4OzRzeihVK3XteLn1gPA7VZBZsP8M+TTACwu+Bk/Qzx4io2K2cIcv8/3tURgPW8Bnh6znvurArJ7kHoL1QEA+EjYrwsA+FDOw0MBvXHukrNivMXrPrcoB19r+HT002/WrQrFRyzZjWGs39dWJWtf2zxEWkvuom1t3cNWry7RpOaxPWy9vd9EXi1LZc3x8ZtRDSX6bYD6fTj71eI27Hk1kLEqkghthlXrbD68PdrjbBNbycojWQHL8Tzs5vz5fPpxlCr7/8fe2yhJkhtJmgbAPbLIef8HPbnb6cpwB3BiqmoGzya5siI75AxDYJyers7MiPAfeHZDRfXT14uAcd8w350Ci67fM2KVjCAxnII1BX6XnB/j4fLBz7jzZZAN5E641+vFY8Y56LPuO0Hspg19flY7uAkff/4sOnH601FU27qPEVMTL4jXr0OUw/vJiXUrrnX3kUwrHn+HthJspqlMYZEYES6ucHjB6dbET+o/xY8Q2474vi1WGgTAAI13gttvNUkOuY3gjIIAKjfPoDhCOP+9RCkVDQS0PWDm2VE4Rq4FcMPgsBoUyR7i3hRo/6hNkPWBhruIvUGgKTxuF038nvhzgvXpTjEJLwnp11rg+jwIKm/Lbgam1qATa6bgQqedxwLjmoMPVdbPQviMKKbKCbpZxjO53t+Ml84lJLazJVi+PgTH+LWAtdNZWMBGQ7rxIPDJSRdryu/VpegrIstwyg22EZaqdV+s2Ipo4nqOm4KYGgPh1grX22QzKKPBdzYwPqcIWk8XV08Rl8L7Eqz83p51/2f+nj179uz5rNkOrD179uzZ81HjDCGvl//9fWEjW9uJzeo1L0SkYrNfoslO7WemDSaTbjX3gl0OJ1TgT0afUJFfWd8PN8egi+aQiwob3bNls587aACPn+IT+Ya7Utg5yqHPKnaiXSxJRjymYNpcAqXLAWRoGmspWPRB0Q0OKRejwiVSJZp1dv47CNzkGPPNtn/OhQ09QeJR1f+cEAsi+hhDiPeAaLhcPnSyFLlpmkDVAG4r8hXvQjB1+/FZEaFDjEyOneA2zbo+q0p8eaDgFU+bVjrvwXwcZ8Cx3RnU67Sv+uL1vSlQ+nFe/VqC1UPwpLNr8cj8DCAqzZH3oie/iS4wdyb590EjkyjR1NYHQc06oexyy1g4cvz6w8U37OpyHQ1oowLwVznIxnILImJ4LIC37iOcWx4l7HS9IUY3e8bzbAYpbaaQFeeLPkC8fcN997XMmBx/PooN+rzEghPriw8Dzx9i7E9h0FY5n+7ZckVBWIp7VcgJCzEOQmGxFY19MMresnaVH8dvySgjQ87sz846OggLWgSxfgFr/7mm0jkHvl1NR9epKPEM5plZsr8gDFYxrmrR9VOX4qQYayEw+591QfwaXXfFMx2iYVwXOLD4CwvlBh5BHNas6Zp/nRSj6wjhe/5wh+3Zs2fPnj2fMFvA2rNnz549HzW+efu+0JdntRCSfbSQX5YTIoDuaO9yscAEEn8IWv73Y66IjsmZYXKhlEkhy7/twsTlm/Rpi5vjQgOEg6rYWUeckB9DJ40zh8gaklgi/g8Fmwn5wDfPsyrKBAdJh9w0G5sQb0DrbzsO1vOjbW5QKPFomDtaANW+S55vgNJ9M+0iTnNhK1w2EOF4vOQFUZzoassjcJuuJopdM0HfvmfuEPUU0SwtBQUXZhoEsticq7FNjWklQPlqaDQL1lPHubSMSg05zQoA9cEvMrnmcBZDPCo4mFo6lcB2qnXFH13okRAEwfNvXCuM8Pl9uB9xTRO4/2/Ej0chZZOj6Nm2B1dfqYLgU7ApXFDW+rTjqyGWessVd5xNoO+W9+u+GUd1QS9cXeUhzmSjnRw+NZd1CHJ8Toq4WdmsVxbA3vQsZcukwOYA3bsgFYw0iTbkcHnb4xe//BAGb4f4j8f6DlC7v+YkEy3WAdfntJaislx9ctUN8Ns8ondaOXh8TVFGuKXKtBPra+azV9T82QueGlzzobbH+lxTgpG5I2o8jjeubbRV0o3VFo8sbrjiteTwSTiGW3GmKOyy2w34u8S6wtbH4b+z/NzvSw44Rl/nn+KA/rnN2XF+bd25pZ/7j+PI31nBE9uzZ8+ePXs+bbaAtWfPnj17PmpQnQ91QOB2bwvzBrCD7CA6Qyy6/ugt8k1fHxkjtLGa5HLzqP0g4mJlRbqS0TTkZJFAcL0f7WoPIwRaCd15JffNjTazi1Dz2rQnnqtlrxYIU1PvDydMpeDhX+tuuShi8YiNQ/dTgWPHUgCof+MqWk6VAEZL5hOXx0UUNBN6ZMqjZfH+cq5ENK2ly8dFgkJBQoBzCwcXGEsD3KIytMkulvBxF6ECGt7hXKr/28/yjT2MZcH9qWrMc7FgFogGpJdJtJxsx4OQUNm45xB5v35H4r5W5BSRQ8XTBkQy07Wqcur1vyt+DJMLadKVN+WIwscPxtOOSqcYWFOHxCxwps6fPKim+9bW2hszwPG3VbzmwDkgGjkYl7SAjivGSVWx25hcu1LEFEekYDXLWve+rtB0BxD9RFT17iFicR12ufya3EKjdmsDX+AaG0sYHP9QGKS/KxxMQy2CVS2C5U+uvmzp/OG0o4jGOC+jpHH9/PyQGlRU+Ll+3cU05RLz3w0DEdqR95uX7cGBG8vRh4iuBDcy4UrenymRsz7A9nC8tQK2WR8jr2F8LyOX4KEd2SI4x1MA5y8WP5/pz6Wup59jG4f9fv9GbBlOxybO33Zg7dmzZ8+eD5stYO3Zs2fPns8a1zU6N5++CT/caWErzjbl4sB+3Z1Lk86rKrHDY3WAmEc6TMJFROGw6ZfjBNyae73eFG3zn+uDDKL5cGeg+l7RJQgELswE/+kBGYeTxOgkiba1ENG4MbYEidMRUiCItUqxzF1Bpha5mYBqDtxAhWwmfN5FjlRApv1HXWC5xMIyCRqILpUV98OmfwR0O0SwFQ9EwKtWCSuMzjkA3F1kUWiHe3JUu6+R8cqnwGb5M+0B86bIBt7R1Kf5+aCuTs2MEhbhZNF5jVtfs9OAUq/MJuZxl+X4CvHjePCh4pjIUhMvCcyjJn7YEj9CBDPFH1OsELDcHvyrdWMMjjusHz/um269/KnyZLiNXFul+jm1FW8siqm6CAnWGI/Br487l0bET/1YH+IVnH0OwFf8kuYhCXeIXi4GFRlnJR1aEAW7iymXpwfpAARgPJZQOKzIQCtlCYOXXH20MS5XXzoBtV78YLvWAJo1gy03WAZQxcpy8dbvCZ6BXFMD18x5cbl+EQmNy6kIpeKrXKB0SEFg1foNx+V8RGSrnJ3z0aIIgXWuGHIIUrfd0uAoVEdzIBzMWJckAAAgAElEQVSREqFfx8Hn/ylcSSSlYEaBy/VEF6zaI+5LcbbKHbZnz549e/Z83mwBa8+ePXv2fNRg6+Zui3aCl3R7hNBr9Sc3yc7Bks6Bzb9H7Ip0gan4mik2RO4M43Z9VDuPQr7NkCqQESNB4gEflxtjFLsgJFEUISOKjhP/Axw33izYCH0PUQDRq9khOFRt3tFqKFi4CxzjTzQfQM89nufCwdXTYYINbw2WT2PbYCGgHDGqQbHMAk4tthfcLX4enQ4RgLe7ZbyrBxA9hAD/gM7IIeJ2EkUIo2assj3EJN9fQ3QoVY1pNYHbcOoMOnsgmOizTNE4k2zgDju6mJocRfysiFCGQBTuF37N4CjqnZGz3+Oy01sl3xKcSghq14J/i5l21PWfTACXS9mc4+FgK9I8URpQV8sf3DW8tiUoUoXsqn6N9fpRpJiWZTiSiyacajeilAVrmnFWCi8Jhy/B++pY0PfoP5xAvp6bQP8/opX46JGfVSzccz15Y1gEPYS8tgQWvxfBccJ5PNdmURHkT1efiS/XbMUP7xnNlD9dfdEaGiKYKRoJl2FhRHJKFGXb5qCQc681VcaTqTWS+ZXxXWdZzZ4/D4mtFQH1ZwpFJa5MVdvo45jAv3uIk3ld9Revv37X2JTDi+fcFGe+b4pXPAeTC2497f58V5QpWArZNwT3gsg0lwELLB63Yc+ePXv27PmI2QLWnj179uz5qPFN5/nV4D7B1lMbOt+Iu/ASDW8TzYMGAcO0MQSTyqNLISgV1dc7I+u+KHAAujzFhbohqhxyPPgGGemxTodXwtAfrYUyd4jtc4mvM9HwN3pwptjwNgWJDiYXxZQFgb6f7J1+2/e9hAyPdXmTGUDadTUK1gByl4hjSSzpdJT4NXIxLJoOY6ra5mJTTndMy+spexib2IIPBieaITZoEvv8Ove4VoqARfPggJOG5x5RqwDtB9erPNhRaP0rJmdVpUumBCdMrpZJ15k30DUIhxSQQrhxHtGA8MnPoNhU0k3jX3NhqUmA6X2EckCxBE4+k3i3xA+ILs6xsviaeFKTwgXZUJGlZAwt+GnK9SEiF9E7uoqGXFh0AWEtRIxNLXY9c26K93kr3mBD33mEGKa1FQ18YoJd91zuJ4+6JsOJ8UL/5xeaNQmSz6hjpcMNYmWVEwoCqAD+Ekzvh6tvyNXH6CUHjsE/Oe0WgJ3rvKnI4CkMAm5fi2Kf6z9tp4Ri/wyuXzrI8H6DsHw2R0rscZEQDkW+HtwzrZWqZkF/pvyaB1cOBswQrZJzRuchf0fMVaSgJCTFtnVt2q0oqSLOIXbH8xkFCeFtdAbacdAN+pfzy16vA8f/vt6Im357Q+VoW8Das2fPnj0fN1vA2rNnz549HzW+2fPolYsDvqk8X6qrD0EBjWVk4kTEiJtLbjbdQdLGTM5NVRzL671ctLnhlmg2qmr1JZbATTIpsriDp6jlzyQ+hGsJf/aNt6KNIWgwhrZA2uQq1YzecQM70aDnG3EIK4KfA3Ju4h+ZQNjeeqi4F2JNvhUfC+wcjpkpdlTXRh3imIDZr5MRxqHoYTi/anCLxKXqgr1XQa274nvAi0015blY5O4yZ/bgGA9E1th62HIzH1E4xNrw2QWuoanIFjb4ER/z626MPILH9Ig4RiwuPtuFsycTqAhWNiajln4vIYiIScTXkVdWWnC6JBbiNfXHz8K5Fvwp3dMhkDskqTHye3DkeVwV4mlJ/lHEH30Nn8dhl7F9D1y3v+NUy4hdNNX5/QvRb67znDYFlKejp6vVryT0noKqCe7O62AQVXxdmoQUh6YjSvioEfx+vxd0vBYJax3PzIjWQAlmyfca9eGKWs6sOJbVgllTmCNYvun4R4qYXItyKabTjOJdPV9rvfPdqDGVdc4Uk7ucbmtd456r6TDciuxgLPk7o0pwY/OoLcEqnFq1itHGeGi47+Ke+Pfwc7iuTW4ud4c1PmWPgoNnkUS6ENVc6NHIWvl7x4W1kW2Ze/bs2bNnz2fNFrD27NmzZ89HjQtO/brBdgKX5/ImNyNAuXU6aCAsHOQz2QMEnvEwxXvGtMsjW4Jtu8vExzfyL+cTCQDlm284Oc4DzWvYiHoTWuglQ+9Xl6AyJkHnSi8pDhdunAHw/K/XL75cG1g4N7pElLqsNuBoDYlxxeQqUaX/0TIGl5wrQaSnGtWGmD4uXlVtpA0NcS9u7oea99AAN1X7TztJg5to/efEGbB4QfCDDWQSBy1cbQ+xAj9fZ4Lap8RFtLPFVn0q2gZ22AJ+x3tA1JjrmhSJU0VCFmNZPHfG2QaylE3OrjrKElIAyz7Xsen8o53PI4jRUpdsokCMq8GR4iYFNYgirWTRH9UlxuaGrcjZHQ6hOdJdxOs+5N6SoDG5JuGAmywlCLfSE5aecPQh4YZWIVyXqnZGugpj3S5WGY7nKTh61BLQ8CVeAfauqOhQE2VrNZltsy3nWo11ViiAnRAGefy+DqtEvnD65fFXlgJkT2e15HDhszoFu8PZdXGdqqlhUM9bZ/tgj8IFXVaTmAj3o+5nODLBEIvz0HHDVabLi7UwB0XiWBf3TSG7SOgK6HwL953uy7jN7iOvG4RiCMlHYvfmZNTTz9GbVIOrVscS4EKMjOfWr0Gt+e09e/bs2bPn42YLWHv27Nmz56PGxaB7THv3G6JBiBseIvTI0K/6y97vN+KFhUoI4dG+oT8O1NO7M8Tb7ChQCdp9S0xRLOt93davK6M/cFtN8a4e0TzyoOTimuLghEtjBNhbd8DdY976ZtUOCDpswiMjx9SQaFnfvwQyaiJwMlUKeO4gaYg3HvqRiQ22RQOhizqFopY3mk3B2sfsyV8qZajQcazPRrve+cOBBYGtZX4qRR+KOIBCoSmvjuAr8TVgb/n1LMXe7o5zfpfg2kXCCvjgfSQI3NTqWFXtGA2P4W4zOZ0gWoUQp+ZBP2c0PgrSVHAMDQKEf0aJeJ9EzCdpDADxOAZ93X+uteBcTTvOMwU7cpbitjKCxiZE2qMI6haYXVD9+GzGVylwFTVmhqiISGC61aKBT24yC+dNCHEhWw08F+CqAda+XHFYCZOct2jXHP9IcNQlAUT/XqBxfwbqQ4gjnYrrCtfBxVUeJNZObXQ78VlYBQBmq43vjvfW8Xs61p1euDbitA01c0aEN5o1Y/0htujOR36X9+Ko6+sSEotclH4v4ba6RwrEwUGrEuIgKlU2Ht79TncW7kNl9BYcr8Hno8u5eJaTIqp/P116FVHA/AWAxkc9M7p3EMcRJWZskBgz/i5qEMrPLDpo52nneaaTcjzExj179uzZs+cTZgtYe/bs2bPno2Y17A1sUhknvCFawV0h0STG428juVQj2Tq+uSwSEgh0L3YUupMYq1oOnFqPbKdjRJBA8IhWDQlOw+Yj2yUo+oNZFIJCk9sjodBiM7nTCejySZdOsRr9doB6h0NotpaxsSoBLNwfN0S3hrazu+Rp6F2mzVtfqGbvN9WREKemonshPrlzxTfozvy6BY9v5ZW6T08oeGFTXpl5LUwiH6NUK8bp47yqKZiTCwY0qk18vXp8c3aCqyMi12eyxaa+Ngqjayb2VjNCwQPwfstZBGD8sT7jeP3pM4apnZLiBFxJigpCo8x2SMv7ijWk8yxzqvlvxLfTrTW13gJOXxVZC1cd1uCh9ksJIbW0dAFFjJJ/haCH7J+dR03x5axHRsoISafgCCC8/106x/+R4FgUI6x0op21ZAslBDwbCwBfKKTBhSXj2ZQ7qZH7D2EGPLiIJQr4f0okLTh+/nlaxP2qvY4Tz2GX8OprK2DxFH5LOiYDwn5W3lvnWFX1ZeLnekT1ZoLsZz7fcvpJuMN1KIz3ReS36vuIHPufhfoacU8fDDgXEY/W8mv5u2gWiaMTAl2sEbhD+YMQEg8VI/i5eUXE8WUSBPU2akHcs2fPnj17PnG2gLVnz549ez5rfCP99WXjP/8XN6G+8ZsNdqfr7hlvA+A7HCNdzp4xsLlM1LQEJWtltZ8VupUAoD4qRS05RriR5wa6BhcoXBxyqIRwEmDmI/SscNAYIfCzr1hhLcshRbfQVIqPzg8/xvOg+wfsK4Gju7s5oqZfTXHu4JkP1eru/QcvJ5w/EL4cyj0K3GoR2ypqGGyFDi82CTqbi5vmoWsD5pQxlhjsH4hhoyzHmQDtgYF37hM3+cXuOrBJf4sn5j/rosat8wtodooOj/sTMxQZi2ZGHKswWV8ej5TAAWca3E4FAgc5TbzWQ04yNDaahKlGN90t6DyOP+npvHYB/ZZFjd+uvG7PKQEgHwHfL6lxIvbJesCE/ZsicRBLIKo1sKGesbtwHC1IO8WaJjciHE3/BYIj3EeI26oJEzD4A2sc600iYziXbokx/torPqu4iw3gtCxdCHh/yWbFgmcm2FvR8FgbeXCIPrpYrShetHZe950QdIiBil+yjGAIXl/zvE2OPFzDzkKIBh5ZgzMKLYW5Xgde1xQXZVS1pvMwIp8Wrs06wbaiGFqzRMAyTsxzDtebuw/9GoK3VwZ+z/hrEOGVqOi/tzpaHZtipx4DbVjP5eH03LNnz549ez5ltoC1Z8+ePXs+a1youn5zA1yEXX7EgcYld4JcOjGI6Q1Cl7ERP1pCvRGnqkMSAtlaBl7O6TtNK+746CYBqavFjZtLilCVIkKwqeQWKmLdFFXow9WhlBlbCjtg575ZdkGMgpJ0DAkx7npBbOm+FC9rdpyKf5ncLWOkwyU2xr4hR8Sr6gOrYo5FLh9/dfNredNh5BvuEIEUZwwwt8f+DqspcKGtbfZ0m5jg6yZxhFykH+YvbvI9MijhJxvoyvr779+/GR+sZYkEdUCoCwBYkRuIjK+RLYBNLYCtLrEnomYAaCsl5w61aFpMhtKYKYZVRdRcvIAQYqvNL6Di0QBpcq0VObJCMNVilIurKApn6aAbGbmzdOGh1Q5Lsa/3VQwPUHlfi2qRtORNiTw15z9VcAynG65Gv3D8cEeJ5cVzJMsLrCZfs73nsZqumckdZhJ3IzqZ60xiLgWnJWROuQLhVpIjCs/+q2Rs1j9rOQkp3B4prlW5uGq2Hk4B7f0f+oxMLZ2JsR5ibcS1CTE4ooh1MDZKsD2bHqctl17ca7MVww3XnKnNEO8zKcJNiXmm30M4bhfpXl8JsMfd8wj1dduvX1vA2rNnz549nzVbwNqzZ8+ePR81dA4NiAHtKDavCbC7712vgLD7Bve+yFqqat5zsSMiQOGoQDRI4o9Ehqr6egKWWVV/S7QKQQHiiotDArXj89x1MiPwZ9juA4gNHWNqo2/KFpKFNSUGvbxNrXITXhx4fR5ke6HZ8LbjeD1YPRRYfAfOqFtdTjJtfCnwiOU0Fkjd1JrXJb6Fy+Y5U861gLSnq2Yy+tfhvmGMzK8P3DFqcNNpIwbpAmFG00xwbo8ijiuvpb8fXFLJd6IMBCh5jUgXBcaa15tCkAsv49HoyCioxBedc4gRRYJhxBTnI9JWQ0h7wPQjVjjTOVf0TwJ5P6KoAHqjHdAUS7V8Xbjd6IqK9Bpf5+6hE3wjCl04Tt0HvF+rEm46/jmu49X/ewTHcPi5+8mvIW61Q/H9WWmMmsLNVqaa+/qKQj5QTTVdi/FXCJUGF1KIRCHskS8ngadTdOO1vyVYHSnymURLMLP8HhVy0iKqOcSswnNgFJ/YrakzV1w1xKsA0oc4+vea/3DOcO1ZviaOs6gxlIwwrr90iinmOVUK8BTx8MpW1N7J+GkBQP+QOq5rYfVvjmfPnj179uz5d54tYO3Zs2fPno8abOCJEYLAc3e2ef16+ab1N2Jf4eowej8QAuvVm+cO/OXvERyZKvYNoM7D0vVR5KIIHo0LW4C/uxtrVrhT6IGqeL+maFq0FWLE+zFV6jcBxQHgrowiIv53Tjgr0Iz3YqTJFDEzcXnQSAY3h0DRfo53Rwys1HBwTDht0E7o4lI4v8RxAgNM7KCIXxW5Vg5ne0XsrFHkCTEBDqNCsDcb5wrcbeFqw3VSk1uMHxuA2mIxBYgJjKOIpzmbCE1zFLGmWgMNokDNhsHuAmErqnOcEMhMvCm4ceZMMLqfmwsQh53opQvGlx/j79/fPFcXjhQJ7IhlLc72zAZGMY4yAlozRjruN9eO31t344h/1gVK/1kTl2+cwha4Ve1kS54tyDsiZJcYVia2mt4rBI//LsExrlcJHlMlaN+jmngbd2TdN8TFu19GHZExzfmICtaTEHW0K0aLnz1aFo3CZFwPxgFDEl5xQj/Pozc61yTkoWVSrq8q7hmPY1B0G/bDJQehtInPVgSn91jhoHAVa98CBR/xWxU2UPgeiP2xZVBtheYtjIcaDOn6pLusyDVacYPyvkUEWULWeTYrx8tGv1N4RrOjjrs9oPZ79uzZs2fPJ80WsPbs2bNnz0dNkwAAVxRcSR0bxEvOqHkTjBxOKRtdESFu/PqQ+0ib5BAYiq0K/XB5zHDpNLpR+rxTRCrvy86vl7Vh9r4HHC5Zwy+HTFWjHBwjkz/jm+gzYn4eb3O3FaJuRqdFKWB5RQzuLmxTm+JERfzLRYCM4dn6XsSovs4vnhc+l8IWmDvHgfNHtFGtb2bhVFqOrBEi4KA4BbGlMLYW3CSP47UXP8cUiwvhZT7jV7auJ9vyoo2OLXx+DeBSkdMqGxPNxK6yFB9AeCKkifwwKz8EI0Lc/WUTLDF33PweFwD/EAz6tPd4L4HoT+PX6ihqj4xmvhC29OcDbXAHrumUsBIRwjjPEmKc2Fsj3g8g9UZwf6eQc4izhHa8x+eFM8ev7TVva6P9NwmOJp4UxRsXifzPfg3SmeTiqI5t3D1jhzEUA0uyvoL/NtEiWbLtL0HzD4EmRDX/x4glHmJZ1S5TUuNzUaYaDueKPULgHOHIW+JYecT54ncAxM02bL7lpoyYqaKI/nsAEVMX0ocg/4rxztLpDizrP7+jOCIA9FxSAyL4RKywQSiMn/X7SsF5qpTgwLVveE/9cilTpQK7hXDPnj179nzWbAFrz549e/Z81ITI4hvI48VIzff7t/25Ub4I3hwRLP+5677IGYKbpWSULWaJXobIEaN+Jr4PhZOqCnsHNXNzOtIlQQHJG9aa4lFDTq4hlw9jcObOCrW6VW34g7FEV1kXOJuNbgmhDrGtrWga4l/iFiVPqlLIcsfRfcnF4a6sulwh9gCiB28KAlwAxsdyvZgt5wocKg6c9uvY2ICYUatodjTFsR7XN0QvF2vAKLrZXpcMsTLorFKUDqKfCzoSqoZF+rIKfl3UEMioWNV9dacNfn7q/obg+SbIfWaboWKDipm1EJfSgBSRTAkZcNDwex7Di3vvgkYwmkKUM0XzXPzAP1VCyi1EmWo/XElFEcIerqTgu2EtFruMscFS7b9BcJT4a5YOrnQxaU07bL2XajIOYi3nuugR7ywQbLpEnxYOtrpa/sJFlkUM6QYrEgdHioPzER8N5xJYZ1CwbF3baPsTI8vdjTMaJOtijHW53kzssFvwdNzrTvEZ4mi2XDImCMHrEf/TlzOi+n5fEDLDnRXrcboL1MWwbI+kCHh3OrbOV1UzZkHMEte9LrF2bvfVnj179uz5wNkC1p49e/bs+aiJzeLrOOz19WX/z/v/RXTp9fqC6HJPcmZu38Y74FlOi3A3jYhr2dMpoU1xHdhkY4Op9rsp58f39zsvoztVEOMBo6dhdz+04U+xxTfF2Ml3hf74Oc/4T2yv+6QbxcUhh9Aj1ubimcselaIY+VA0XTDONVN8qNrwB9/Hf+aP339wg8+skxrk5Og5zcodolaz2OWH82lBpgnwDieaRewK9iezs3Bzj2NA9G/4jp7AexcaRmM009g419QiR9YQmWRgfqmBjg6pAbcSeUGMXbk6VaVgBZh/yuX2o20ynGZ1be6LbqDfH7S5qXEQomEJsakuALgR8D4U84TQGCKRHC9xrQecPVQs2p8FhfrzmiaUPoQXCTtN9yREyhDmUvTxOCTcRuVfLjiOp1g1RgpcLqwEqBzQ+b4ESmVyxdXidQrulj+bp0Q53N/j0SgphlZcOoha/pZ1IgQMISzOrGT4Ds60gKHj+GuA8zsjtHLoPa+/O+D8GbOHaExmVs0Ch0PP3HWv6+m/Z7BO2pHinCcT63FSDJ1RIPF4Fv3n8PzpHyXQDjC9brt0H2qItogN+vcUF42vKZYMUL+vS39OE5K/Z8+ePXv2fMZsAWvPnj179nzUTLkufEf4fV3ciB8nId2DQpBzsOiQqOnmmXIv1CneTaFLokB8oWvnLX4SoO/gVgksHgymIeaSb6gn291Mm09u2pvA6QsQ3gO8LvfKk7cU8aZw58Qm3dsP8V6VrWPgBXXCyIsEMISwJCaF0OKxuYgeZnudRBswwwYjjOEA8mgbGFQ2fjiC4ACTSFXhGpN0UGo6Syjg0DmWDplw0MBlotjYKBKRqr38PnkMrN8WZh9co05GEMQltQvi2qAxb0JsgmjRBMgOYS5ESYmaEPQQLaVoyfgm75G7YMB+GkWC0bQwtHisMoUMzZDo+XLRDcDvjtsdMUR7CEb+ntnUN7rWKNsxWRpg6QbzBshROp1g1TI6NzvdelgvaqEsamPEffkXC45waLnQ50Kq4noJvi8102uMvN5LHKJNDMfp7j96A8k1Q4NjPc0l3ft6Y/3BwWQjXZE5c4mLESUMxyFunJ7NZLtpDRz1wPv7/YWJ8uB9rRL/eN1WS2WayUIsja/DhbXu82y8YS6Qgp/34Gnd/bYpwbNJ3ArRrEbQzw+1ujj7EO0i4qvfH3xuwg0IeFsKq+Dsdf9994IgPuXw27Nnz549ez5ptoC1Z8+ePXs+arDRnnRRvN/fFK3A7RnpdPJNokf8fHN4C6zO6BZ5RBZBL7WDwYGDjeUlwUd8IjUHuihxOLfK1kYYwhZiXMM69sEVgkQ4r2o0Dq49cjqzfCr+rm+W3K/TxCIKUA0guCDQ/l0Xlxwgz8+LZjM1y83LYscM/lExcIp8U3+PO0WHaForRjHp2Y7Wk3mkn6USxVY135DPmsLZmITTHxBlxBgTXwyuMp33IffI7ZDvg59zvtqKbUmvgDbhKcIyJSYwRubvdR4lGwIZ3+xyDyli2Uo2D/rXPLpVi4SKMSgGKHZZJCqyZVKtef6/EGhmyagYDWyLJeWCyBTzCOtG7LRoqAwhZOIzK5hIHkFFq57a6pJLBRFN66EWVQ6MjOCNe+b7/6sFx2khyqbvCeuGsVY6xvCsQFgkSF+cd0b5JCgREqYWSVvf7y6KASDPiCvaDP26V66VISEN68CzjiYWnCKnxaOA1xQyPVx5E2ISooL1hde6a+rqF55XB7vXcJ0F2yqigNYyLhoxP5xzCQehPUS8mtHCewQrzH8PCfSO6J8eNzRUKlcokW9GBWNMuPLmSFi8qX0xxDty/waeoV+Pe79nz549e/Z80mwBa8+ePXv2fNQchbEa36gaNsOEnvsm+aiMCPp4tAscakXT6O4J15MldBtb+bl4WBSvem7uwcFyR1YnKajiZ0c6ndwuM6FLuAjSIDa5iHENOSlagwATrpiQA2LXSqh5YZ1/McG9u92z22mvFKSiSa9cNyJFiBVC4Jlw9GBWgZ6uDR0hEVmLiXNH7GoIQH6EeYzXJ1rkTI6iouhiCG21MdLG1jmPcLKNDsJZnxDZ/PNvuVW+vFXNCNTH2VaKPe7SwbEWRsBwfwS7NrXJ5SlNW2LRpEgE5lVtyVrCn6/O+KE+H+LOUPRt0Ll0vBrdULOzue7hqMF9mHTDxPGFQ6wqMmoSPxLeLvEjY4q33DlD60YClws2T9ZUCEwRZ5wWMbeSwdN/leB4zCWmQkPx18Y1l9PJr3euGxdx+0ye2Ot14D4EtDx4Xowiym2n442mzY7CArq9ZoDZM7ao9W093VYuxEKYFew8RbQS94A8Ndenru9LglaTsFiXc20u91rEMeGsiwKHuPpoubRkbuV1enDdVhyYz3W4J4sEcJM7MK4b11LVMfwUI+OcsM4i9pixSBfkb+p5/ntv7Ajhnj179uz5rNkC1p49e/bs+aghr0exu7LkoJmbajo1rkHxBS6UNrh57avlDZvjSi3C3R+mRKCD3gHd9o3rQWeV//+3R3gawUbYcE8Skcq9Nro1oNGo16eLpIZbS61yiCQ1tetNnstMuJWBw9P1NbxPJ3j8wDEd9jbymYaEArhh5LYKwWpUijIJMHdgtIsPcY3Emfo6o/FsZLNc8JhaWy1ydNjwOnmcDKwuF30Uf0OkU/Dts51WX4RlA6Q+KAzCYYNIX2dzpNoEZ7CKALbm/R1UCvC5GYHz++QSoVhHJkMLhKeDzqz+2NAHcNyFtJj3daW7xY8TYshYLqch7pkFayrcdmJyFQgtV/KUgs8U8UN3hXmEzwVRB/TfHvm6B66ri2fRRpkMK90/OJuCOzUouA4JdfYvEhxLsrd+tgf6z/46f/F4O0WgEBrjdX5+iHsWF7C+4YYrcpX5dWZc16QA3VgH7evFc2nejFjAkZpRBFq5ZhCTczFZQlCRmBQtmlVRu6kGP7K9utamu/DeGQ8NwSwilKbjQ0OkkSeFdTwL1oyf5+XrY3K1NYLOMrqIj9A9GeKiDT030QyaPLP854pWURe4IK4ORWlVvOBzthd/T+h3lK/5lzU59Ch2HsfBconrbXv27NmzZ88nzRaw9uzZs2fPR02f84ebCFwj8Yd8Q+hNa9hOBqNHzXLDRratwbXRajbejWAfKcY1xT8yEpgQT7SICUEQITjao3kuGNwJbIba429IB4YYTFnVD4OIBIJw4Uwygtoj1kQ4uRxXhQD093Xb0RiXnE/+khWBusXBagRRV3vA6B9urNsuCC0+13XbC02IDsm+AKyucouYHDPlOLKtrc0hgaXiOlBEGxApojnOkovUF2+pKw6oO5ABNhchfMM/5hJzCs8FLCY55eYjLoUo3rSEc4M5dc1H092jSdKbOZYAACAASURBVE8JTReTrvd7tTSWYr9//6ZgUh+A7+pxxWIBKivT0tkzFVEF58hqur1GOPOcsdUlBp1cN5GZc1HjiGgcBMeHqwtg+qFrzBIARg9rugD/mYIjv1/TIejXExFYiT5zLg6TC3NDTqiKaKRg5zqOMUPkjXslN5Qim/He7YwYZifTq1kKq3nvJNSRHWaredDXZ6coNOSKKroG/JmSDqfXr69sulwOrTj21XhYw+WmFkc+R82qr2E1iGI9dsvr3FWqEE2J0QbpP4t7Y4T/i+XPRsdR5bIKR9fjmZnxc3M59Vq1NloeE77fKZc1Oc/27NmzZ8+eT5otYO3Zs2fPns8aQbs9YuduC9+oRuMXNuSvF1xUJdhGnc6KmdwfDuDQNRwujFEBPO0CwzVsNkWMFJGCuwLwaooUDZX8B/hGs/bkXJmEH0QIq4jtEoAOiEUlBSQ4d3zj3LEzVqNdxUsQ89L21r98FsWtXBA5D7qNuqWQkpvZ0TOWVupqXAQ4XJEvfL0dOIcR7XL+tTSTtZ+OoeA76XToQKF4dhwnXuNRPbQ9yo2E6KAYSrh+PbbyBt4UxRuJHUVOIQiKE4ILjvnByAqxDjDrUlLQ8FN93992ni971RPMohAMo9HQXXkefRv34PqReObvCIeX3E4UNcRrCucNBNCSYkk4fRQkzXinSagKIa+Il1XVLIh7LfEH1+u6EI/0Ns275KXB14KDdLZm7/v+pwqO6f6TOOwDUUvXCS4vwa1mOI58jYVzze+BN206YP31Zazxm4/WQMHKQ7wqjOq9x5tQ97PJJdh13yhQhfAbzrBwfs141ktdbkdLzVHCn6UbKq5dFzMtGhTHuNMxB5emC21ieQUc3ypZe3gOos1T99idW4yekqVG/pXp81zFajYOQ1R2qFFzqgHSjx3nU5ZgZxIzL0WjXQRFe2S0Y+oE/bjv+23W/prrbs+ePXv27PmU2QLWnj179uz5rPFY2Ou0P65vu77fbOtSRT8q+8+DApaEI7eJlFoTlByV/mBjRaNfZVRwWER5JGQcLTfrcIsIFg+wuLNqxBRaQca1IYU7JiDLqusHR6jM5OqEeyOb5kxNaOF4uQcdJYG3glhVJPQUiBkQcmzkhn+CvzTYlOZmrACZm7c2fivOxFY+wLblTimzLCZQAK7nzFjdfEKn1e4Y5J/Y3M9K14k7jPq4GXkzxqVqW/E3/J9/jrtS5nK1+H2YapOscgXBkSWgOpxLARgXFWqES8nvSYgV/SEUuOBySwzx9+wUsaaaCXkta7YY9micVANdt8Uu4z2U663wOvvnH3ZSjFDbIJw9AnpTBCxwIbEYgAKjC0rJWZIAqNOycoiXJQH1nyk4FrHVnK2FiKGElkUE489G+5+LaKdzsAqdYc4bc6dXhVi0nIps5GspIDvTqWRclg6qAJoXrSaKbXRChmgEDbjys0uIyWJd4Zj03FqwrCTe1bqaD9NBVqJUgQ43k8sMwl1frj46qNRIquIAP45RH4wxeQqLtXRtSr9dn6UJd2TcqzhORpWX+OxC68FqyvWo6S6QjXUg3sr72hJ4v2fPnj179nzK7H+z7dmzZ8+ejxp3SNXXYeP/G3BhuTsGPKp3xyb2GuTCTDF3mmKBvvGGUCKRJFg/0UI3S7fTK/gnBSXtrxklghOHzCAA1gcr873dzPQ5RQ6iqTjYCUD4SGGHzWwDm+dZIlLEtsLizq/B6n8HbznrihvcCdcO+FEQ1A4IaGBtHeQZRXOez/f7ne4ZC3fZ7JGGzHr/ZhI5HoIHprIBMYDRFu1zkw6p4PvYXK2JAcWPSv+IgbkjiqKHoOvGcwmRgFeNjjbLGBXvqb95Yb6PDYJiDEFw0DlDlHDu1bzpdJLQgIhev+2oJ64BhC0JMK4xuXstRTLF9CisiUs2LIHuQ5yucJI9jx0/3uiw8iZBF4iCOYXmwT5WnPEwiaAj3XFglUHMoug36liNior4va+3iuv++YIjWxXtHwqOfs3ddVQlNEF4UasjnpGnSOTiz1g6jK8bXGvnnykqGFwx03sdcj8Nvcf5ddr9vh+NjfIjSrgruj9T5xLrnXWKy72F4yqrWdDkOItr9lyzsyjKp0iiyf0YQiqnyKk2JZAWpIZxjXrc2wpHFmN+gZavcuzNLAHA8/FgtMG8ZjM8a3SG6n8ObG/nCW3bSxzciXW0c//Lbc+ePXv2fNRsAWvPnj179nzUzMo40K04XQ2W0ElWjMeZEAmqjNPByYJNftS0UaCCeJAXpsgFUSAmHWcFrxmbVZv2AjC7kj006QoxsbNq+wm9LoqmYYP8Q0Og08XdYeH+aMUeMS7xsaa4XmNtmF1C86094nMuZ7gIo4a7GETGxP8ZCZRerWd+DU6PHsKZpYgYImbzWVzINjZt4H+08j1CkilqhPBk5cf37eFAebblkd/EaJ8LSXA/VQk2cvrAneSb/jYFrm4JKj9f/M8awMT9ehYHq1e5fSrcQBTWyEKCwNcZI3WIORw1hVymLjGhhPBzU1RphW2V5IMzLhcwbpOQUdXqiAZEXMeSwlRMf4pILrRJCAyxEO6dwiAizF4eMT3oNFtwdIqd/1MEx0olT9E7OcOMazl4baaGSRNPK11oiN4KoD6jsIAcrZCi4Frz51otkO1YMV+7J9ZbiTbBEKLlOoxjj/PBvZZTbmq9QqyTA3FK2PWI5uMXQUZVh3hnKV4NMbI83utr1xywvpoDn8+6/9CNCtQbDreq2DOuQ2FMFvr0UVlcMFdE0IKrJUedXzMvqEABhR9r+8qSgXTt7dmzZ8+ePR8yW8Das2fPnj0fNS5GQFw5mn3ZCxvm+74U2dPGufcMGpncMM2WSyWq9MOxcxwtN7eAaGvzCCeHNpS+h4Sj4u6q7pfZY7Lh0B0RRbypiTibrrq7ZgaB5hENdGHgEGEcDg9F35qA4kEcwkZWtfp3QunFjQpXFaJ1XWJBTe5Sik/iMcHl0wUWrzzu4HvN58bdY2ESY7ra30KgCN4Q+dMlN/pk+6yYlDfSubjnTZCn/6eI0pV+HhTNulWPsDk7yLlVYywuWCEDbNx9cb38/Q/C3kO7CUeOO85mtBFK8AkWEZ0wft6NDiLF6EKYCUbWFKMI8U1vjpSCNbSeEA0r5GDVxzpywWw8nDwhEgVoPoSm3hc0PVxf/lpqP4wFdoG/GYzkPfLI2P8kwbFIKK0hzkpk08LUdRn5XmBb3V1updW6+HSxFQm2FgyvQv5YV4smzltrMtr8noce6xDiUKeg5fFMtEPiXKL50gWoyvXiTYXDku9VHgJfAV9vXUva0uTwGj9jivgzLFF8qLjeDv2+qLlOX1+/eO3899JT8Cp0a/n6GPNPsPoZ9zeiknKIVYlmrgHeP1SzPXv27Nmz599+toC1Z8+ePXs+ari51ma2MFaFFjKPQQlSne1gg1Dns4STo5BsIyi1x4tc2HFd5pYNwx1Wp9Qpj7MxalgoOExbbimwdSxZO4BYR1NYAKAlBkxjvX/tU2JUz/jgVKwMrpIifSkayR6b3ajsL3FulU4UuIzcoNEn4nWm5jwHxpPRo410mYtlFK1rg44YiGgEN+XGG9cUDKKSsOwQ+Lpa5Yr4XPbgFUGAGfyZqSZEYyoQx3pGFBOCDaNqDrAHkH7MR7SSqlQ0y8GFVcU5O1pyrRB1gwAVHCHG6Dwy6hf06+vLxvgN4Q/iVe8pQgxBwXHMLkr6EUs4gzDUVxNiiDAjommC8c9ZEl6Pu1MpWEHgUBsg43pLfCniMoWbCufUBO2fU4LoVLzyf4bgWFJkCjehSjdLsflDR1mOQqzDo0nEosA8xCcDPD2fJE62Dk66nUrGClcLH1s7CVGPz5gSwkrA+8eUWMiY47iGns9h82AMczyA+is6qMZB/4wiYao+7m8C4qd4XcVSyRbfyhQh5LVnNBIOQD0rNcRDiVRw6sl5iKbKSnh/uPUSGu/Xsh521pMA+Dl/xkT37NmzZ8+eD5hdT7Jnz549ez5qwCLK5jG2B0J0cYtSNpQVOK5YST+S52Oi0fgG9Fa8cAz+zH2TK+N/fl+X3e6oKu3Hv0ghNB10w7jLwyHKACtbQMnF95EIERtztJSVlmJUUYQsTFrYqNYFb3bBAJwtfb02ArGnjBszN+4EfZdoh9ObU9ir9jpecnQNG/edx5lOpVYBgm/HAkkzRsc/U5BZgGoLN1Ktj3PW/n0socF0n1o0KRaKCy4qudBIJhK5Sc458o15q+3vtqoFDN0e7h8AwcEe0mfVRsEjGuV8XXgac7Kx7evXiyB4iBoUmZQ4A6OoCtw/1JTn74tYYmHTZFODZQ3LXPCv3LnnoPKhdjy4ptQ0+YC9mwSI5D+NmW6q673a+KqicFVRwmiks6fg6GsVrX/kVoWIEULPuk8jWwXj7xl3C7FoMiY4FLMNwRGfZUsg8TUSK29IwIloIASfQpdSxhiDyZXxRD5HXDsNotaqXbSMvJq4UBRu+WQE6L6FsFrq37jHcJ39nh1QlBkPBisu2igXQN+f7RC3+6PlMtb2ENsqhEtfrxDrQpSbdIFiLQUDrUqoTveZC3cHhDv/vK5n+cealoiFllCwtBpFaa2ZjE4GtB/XRQ2lYOQ9mkf37NmzZ8+eD5ntwNqzZ8+ePR81AFrD2XDQ2dNjEz8ATjaBsO8RXXXcdEJQYJUfxR6v8r9vuWlClKHL4nKRBSpHJ+eGO810jpBVRTfVlEvD4ICZEIMYIaIzBc14hRvdEg6Noa+rYQ1frXRqwG3lgpU4RpYAcwMX68GSFmRbIsFxpOvEQqDoF8WJu0uoGOIlsZ0RYsJ5Is73Z1FgiqsEYHYyxdgA6T/qm/MpYWEKNH/Mpja4akOb8KLSNrb1VcYdw2XzTYfRH9+/CcMulc6xYJ87Y6qdgFa7EGDiH7l4EwBzP5Zr3HKscPxnXnKzELLd4IC5LwpCEElsLrEi0mLHQ7Ck1in2FGOhYF7Vli2H+PNFd000KX6/vxWXG4S5+9v0YCpJdOxLeKLbath8L+o5YqxuTBsUiZog/xAcfZ0ATB/3ybBWXbR7Co72jwRHgckhOFX7IThOaylCVq27PNem84ZQRZeR39UoR4h7vS5eiI+M1h212/u2jNf5p72v244pRtSPC18SJI/13MJBVbGOAeSvlsD6XpYja8q95WeCxtApQH24zQJ0H4KeP7u+JqclID4EP1yTuhh3+PzkyzWsmy5HXixaF8H9P7975314f7/pnvr1F/1ZLZkpllGwqg8OVvLrdP0hmkdstfP6HPg9+POZ3bNnz549e/7dZwtYe/bs2bPnowaRv4eTBE4UuV18LvCA+iPqZWwjlAvLBS+AlQOADqcNWTasuKcog0iioN9F4hU243I4UQjqRP/0SBKFO+dgzCidYoMxufjMaUuUQDuZ/wubYgc4WHLwnBJFot0sHDoPfUJfJ3vHvwcQ+ugZOXPRxRStQ5shuEpDLho28EFMCwHhAbSugpdHrCtA9OEYowMsXG/h4CoAph/2BE2X5EFB1BihD6VCp8+dgVbiBh9fuyHyBLvKhccFR2fMbD7uf/CnnNnUR5znkPOpw8VS4TKy1cjX+T7kS/F9but5jqZjAmfrUPvhWADtEHC6HFJ+v89w5smBlhHQwv48OHu8be/1sj/++APcttfJeOX1zSZNiIIQav61giPumYt+T6cV1qD+Wcyyp9Mq3EEjRRaD0yqei+KuocLGwSEnHcQcxGfb4lhNct8g5ikeyDXLa5KA9RSs5Iy0kp+f99DdTxnvo0sMQPZsC2yC1et4rQqg1vOaNrSN3vwdYhHDtIxzhkcsHGJ+nR1iH6KhC+3+7Pznf/4vFT7o2SiMzEJILHzWTNcDbKty4HedbGHQzAFyN7lGH27HPXv27Nmz51NmC1h79uzZs+ejZqh5DELO0ez9jqZBihXYmrqgc5Jh4/Xz7ryCoCFHUlNT3wGXBzfZdEcROl21ga7J55kpwXS04FMMglNk0plRjlMc66pNeH1wmdh4N0NgqTWzgBNOHYpyDphGLG6sBrknnJttdsuRMVKEI7j+HhcFk74cMPF9Z1l9nYs/hShfLXb3K2H2Ndw7cqfUs3Kjria2EAFD7AoHDI7dxTPEMl1cOSH0MMrJmCMbE12U88giwfMxEJEUq4rY2WwSeqba+/xcOq/fCRccEEMQCqJ9MIobESdrNWHbXWy02tpqrjOKGVhHdbGuIp5pDzEsWEdgXl1yzVhRLNWyEc8kihj77yjUHFUix4RQw/dVNHBMOLbs8ZlDAoXfGxdugpH1rxAcIcKB9eYCmwu9RzqCIPCK3cXWxo57FIwrv2+1lhRbFxuLgPMugLm/d5NLMl87ia4PJls6ixRr7H2dZLidArzvDX1F69P/5xw4iEBjihMX8Pi4XlnvgPtSuuG5i5nFklNHFhfXKSKIRnGNYhuLGiAqt4ZYn5/jcRhcgx6b5PNr6c6rxnjjjN8LGbmUI/DBtEIT5Vnwu+L5TEIA9J91lpue5z179uzZs+dTZgtYe/bs2bPno6YIdI6NtW+EjZG/EVRkOZWi3QwCk1f/K3NFoYAiVnKk3Kmkn6ewQw6Rb3HdSXP3m+4rZ+wMigCQylz0EG8qoOAWhqJOLHxstLGN941uOzM+VNGIFjX9jDEVwaMhrgxuXvuf3BbTRbaDESu4ZVRROBL6Ld6Ti0o3nTKnt8jJTYP3F28KMPXHBt4CED4l0jy8XrHR9igeIl4QTFYczxCzUgzNnW5y6Pj/PwV/v7HJb/nzpqa1aOMj/LqkAAQous0Hw8wSDO9zebRQx+b3+p6MWI0QwkKUEkLbL/5Ujg4ChoSz8eAhBSDdnTdNzrtJ7cXe97ed58te3p5Y6AbDda1sBwxwv3J6cstRlBql5/EPQdbLqAlVxzUZU6SpBnENK+0e/xLB0dSE50KbPy+DeTrGWqNscFKUm7rOcDTKZTWeYlpAz13oQZNiiIX6vpHhNEZcm1wNuX7BWXeemVHIKY9WSH9Mru9Lb7baF0O8mz/aISViqWmS8P0BxdOF64jXglWniObzdRb0rzD+FcaYIRS76Dzi2S8QryBYVa6XJmZb0/E0iXlcZ8MitBprrh10gYUoVkOwmxTCIIL1ab/v284fPsw9e/bs2bPn33+2gLVnz549ez5qwoFx9Q7u0/f7grDkW7v76tr8rzifobWQm/hw8VS3SUjsgRvJha6DDgpu/tsSUSYbzSIi1CU80C0x0yXiwPc51GLm1fmvE4JKn6Ro+Y67qDqfIOZGh492ul06A9wmem9sZi1a7FZ8KpsONdE4l+weWw6uZ0wPsOg2rTtrqsVrGVtCu6N4R3QX0WGCV/u5uwPlHglaD1dORKF6HM8Tuh5usEK+VOkUbpyblIJCQKvnApz7Xt9/1t1mLvBE06FlJPThWIpGRH1uQ+sbxahol6vRHOexQLlhplxT+Dy1xoXog7iiQ+8zqimHEG1aOPeIEMY1O1qTeFUBD0dks4eIRRnNXWfBNUvtQRy0iJyZOG9FlPk6xLX6JwqOfq+veyZHzT9/uktssJ2x9iE4/rA3rq2cSkd9RPKWmBdxPjoeI0ooR1454EBjk95QXPfisVZGdF28uuXQO5rKDzKiSIfkVEvhfV+IQkbjIJsYa/7MrfvEmG1Nx1qGi/WMQEyW645Os2M1iTojy0WqsthYcHm5E1S/W5x9dd8D8HYcb6e41x5ONxfO3IHY4Za86a6rjH0G3A6vr4wzD7my/Oe+JBJ6m6nfvWqLu7Znz549e/Z8ymwBa8+ePXv2fNTERt/5UJdYQL7Z5MaVghDjPV1iEDeHrKQ/4HroaBkkTNrUKDge7x3iCKJ+QNM0gbHLD/5SQL4tm8ikPUE8CuGnYNM65fzCHrgtd8iQSnIEQ+d6wxVyKApVtFlGTDE+Ta6e8nAMPdk/2VzmH3UQNj0jDtXXZ1IpEtR8Mmp3aFN8A4QtZ48LCtFY5241AL17unnA5JGLyAKaX8gpmhIkonWtPpreioSQMoiin+IfZbxtBg6pQAihfqC2t0bRcja62CKuCaFFAlKIjlPC2VScjcc47Pbr4cIPDxLHYQnNrxlHqxI+XIyE863WdEH1cOfJhQeZjCcD101XZC2b8hSfgxNocq0iOhoROglyFo4piR9xX/6rBUe/ViUcWXLHVY/P4fgGnEYu/IwEz5MZ5a4iikwl2Vi8SSVjgGRdrWfKmz6LHJK3oPOTyqresyTAn/e+yG1VIYaRBVXFt1OLpKWlKz+LcT/FRMWhK1IOXUh10alrLbDYgNfsKXqHGBbNi0XstLiHLk7BGalniG6x5RD0aw/XmLs/9dwB6m4U6w79JzqOdIpNVsgf4zq8cZ1ex1fGnMHcQxmCFxzUPLc9e/bs2bPnU2YLWHv27Nmz57MGzJ5m3Ru91FTnbWYzhAbEw4piSSNdO2jCc4fVc883KIQc4vog0tS5ea2AopeMgdF9wz49OooO+/FmLuYEc6cViiZGp1XEk2jIcVdRI3dJkSzncwWvqfaGjWovh52VETIKKG5laWD2zD+9BxxaLn74xjidG+LrlIfrpBTELYuA0VUuHwDl/RpiO10pzk1LSLfJCTPHw48ksa6E46dEXKpmTJGiYMO5h6hQ0kVn6ZDqgllbRESLFIxwu9mjWTHFErMLjqqKd/XPcefT9WBrMXrGKCBdcjVB+oDdQxicNtvUuTYx1szOF/8TqnTC1z0uWHpNJw9YUXLCeUSVzXoRB+vJoyK4a/GLQmN8y+0HcDdcZ3G/yorEkVAO1407pf6rBUdLMP35EHDZ2niCm8WlMyXCRSAU7rnJqB6KAXTMEJbAtorGziWeoQ0TgrN/zsGo6aCb7HXKXdW5Zoo9XHyDQhEEISOva6iB0J/RX2LXRVw33WVilzEiKMHuBvAK79sUC+U6VAvg0LpW5NOv1xsgfTmdqkQ6sOqqnZGHlLvx9arpNAuhs0kYC5bWdJeWn2+tcGHh2tahmOFC88PNaSyQ8PhvPBvkat2INi/P3p49e/bs2fMZswWsPXv27NnzWTMpMPSILQG03TO+dLSCWn1vaoMQRckkuTfh/AHvphGmfuu9nkyhFiBvsX7onOkUQSQSgKGjVsJg4CCyFCgqsJGo9IToQw2I7iRGCqu9XEAog7EkvJKvCXZQOlXGcqWMx3vImJTHTIfIXIyvMRTFUqMixA0eY6strx3hXYxmNTnUsMFGyxx/Hu8DLpda0aaJ78P392MmIL/laxhJk1vuqIjSDb1/MMngekle1FisMxdbynxEB0FPEpw83p/3tx0nom9+DNEw584buNdwPHIrPcQ9fM7d0/UFgfGQWJeGNkpneU6DYg+jexSW6PYhrylEEXK2ir3OkxwtcZTmiBjqyCidC4cRlxty14VbzSTenaX9lwqO7gzkGh8QlBL67nrUeYoTJXdc74zPRrEBxKf6AJQbGi/jPcI9RrFsxQt5nSkpu2gD4dYdc6OnPw7cOB23f+a4pmK3NdcU2jq1dtEu6Y4oQfeLxGh+XoNLjuD8A+dhaoXErUyxcCyI+uwSJC2F1vqIZ/b4PSLGGARLuegsYOtNYhbg+DPvBdb/JJsv7gOcnX59LURgccBcXC/uBDz0TCjGDPHz4T7bs2fPnj17PmT2v9n27NmzZ89HDTbVlQ6ZpnjUYgIhF6dNbYgef6qaH4xCuesK0a1qAjUv15T/Pwe3351tcWgtnGvjb3JOhf8Kgk9hayE3ugMb5oByl6YWNjGehNKx4zzwl3N8yqDr5HU0O4+m+Jma0AR8hzg0KCTEe0wxtRidtNzgo+FMsSqwswDTvlOge7nDKAS7IqGkWEYRq0Qc/CXnB6J8D6EgRBwLw5Reb+EEEjfqfb2xaQeMvdKh5q4inNchibGWRxyOkKoq6LYzmNjKR/EK2LA5JEgutw4cLZOAfo/ChbgCIdMdWikw1CUGDIHW5wJ3h+jiEblwxvnaqE1w/EagfzjZAFsfjOwF68oFJogO4KcVW6vF4Ajzq1OjjbKYHGJxbhI8G51Nx3GmC+gfCo41XGDrHoV7D1HKumKZuJZl8ZOStyQhaNx0Gk5xyWo4sST8MpZIgW4kkNwSlW9RpCAXVtwjAPGN4tdMHhzFxygbGFo7wQUD66mU9YwHzF8Clb/20n2qWltVQmMIZxZRQ63JZMnpe2R21YxbPqN5EUONFkaPG+Pnp4TNaDgslqUFU9D1krHV9X2cxyxsNAxx1waF7xCL53Iq+jP/x+/fiD0fhSy+obKJPXv27Nmz59NmC1h79uzZs+fjJnhTv379ys00GTEDDKmuGJkzr9gIJuEhttfuHAFs2Sg6hOgj50dwdoYa8bgZFgNocoPqUbwOkavb9b4kLtFVdCA2d7LqXhtfgLL7lRFDCFGIJ3GTT1cHGT0Qj1xoOA5GtBqjfi76+OfObOv7OS64tUpxpQkqHpGqLlEDVwtOnwPti5HeQ1Oh1/+/jtyIW4o/2vRL2EnY/aSjqI9gElGsMXGaTJt5F+ggqE0CxW+JHuAlQWijGFLB63IX22XHq9l//Md/4FxmRMYkmNFdRoA4YmePe4P45jSJMCEOMU7n3ztc+HxwwZ5TngD6MdXkSJdQEbesCRbu9wbgdt07tv9R9GK730hH1B1Cx6S7rJWSrXTL8deyRbJJKMM5SywJcSvO6f9WcORauvTPM7lNXWUA7zedbKX9IE1RlPOI5cnnaoLbdqlZTwUDk662qTWdYqKcamvljnTbSTpinFfHbGK44Zngt+XsInQKr41onRx1EAVVeOCffw+6y87jVKRRbq/O5890vbA23JUpl1iUDLC4cih+qQbShyYeMU8XMc9H7DiiqnHl/BgAdB9kfUHuniWfIf8+11545Eo+a4DwH82Or5dYf+WHcLtnz549e/Z8yuwI4Z49e/bs+aiJTZ2LR9+/f0PQidYz3wm6iINN/JKrMIR7a1NZ6eSA0OAb/UZIOMQQAK1PYojStVSWM0KuG5OYk3E26gAAIABJREFUYXDx3L7TxgbZwfIHXDtsN3xpv+2Cx8tdXw50NzKBCsSNCab7JJ07xaZwb0HgGRSSDrF3QrwKN5Z/7gnRq6WLxKNzQ5vjgKAjVibX1Zi3HGyKSnrbX/vpV5sZ/5Lk4BpR5UZ9CEh/HiUdQzOaBdtyuVSePIWU+6ZwKMcLYluDIohNiofetufCZMQhD4guRrbVw3SCWNcMYHi4qTqtQLVIULE8TrDGAMc/7J53up8I4a5gqVF0vO19XXTrIBJ553VwyNRIAWGIoVUToo/7JUdbEU8qHFZonLvpoAu3T7/85gyWC7jQkpnFJQBKmUV7oPPPrnGni8gFR4huj3gbY7NIwSXPqwenylbrYaEqBnGEuonYTR7RbMWuizE6RnXlioqyPLCdGr2GECCDdQVLGEQ8OOGsoe1yaq3Ph6Mp1lewocCBK1Wi3431Up7ORxUmxKvpsuSCAHi+kIHmwhuEQDjVKBxbk3gHTl1chvGjiZCc9ZGCILhkLURGy/uWjkOUOIh558wxP5ab6xLlAp0MviK3WxXzyn8gIP14HksTP6/CoQi4vynK6vFXX5fHYV+//sp7EiKr36P7vf/ltmfPnj17Pmq2gLVnz549ez5qhotGviF2KPTNjS4YV7NDSOp3xJ5mRoncQQHBw2v3+xC7Wht+j1h5Zf647FIrnTtKjtcLu2av+AdAutQfTKcAd1PgqToOtiOyTW7A9RFMI1PA6u4X2+PcrTOLHa5PZZIsEc7YyLsIA5EiGUuWYa2ujT1ErfgMgLC1wbaiTXtPJw/0lM52xvb6ImBcglnRW99yU0EUOAmqh+tr6jrOB69KP4eviWsVzC4IRwDp09ni7/t9d1yTuIoQmdpqG7yuO0jVdo2Z5zhkE+tqnUzwOYDjbP9DrOrqFvpiJ2xK4mbJxrnLLt4nb570z+4jXUYDUcUDAgoEpG7piuLnyU3j6yj0JQlGzkPrDuMWH6tkjFOikN9Pd9H1iXZDcpIORvbk1oGjqVMUgjAH3lik5ma6klAwcLT1ulg1/4eCY7YaqGmzibmU7CYcCp1zS/BilA8CZaXzi6KqRCDFBcOJyBhnXfc5IPH10TSYa53PoL/mAqMqcPGWbYm1lhQL47VT7/njtf7+XsQwVpQ1mFy1+rPk7ZNsYvTX5DryP99cG6NQoKO7MIRrv+7z4eyicDqqeFxW6YA8ol2wQGD19+HviQXpB5RfoiUpZpUQ+aV30sQVjDnwzDruZYUsaNZ/v63+df9n/p49e/bs+azZ/2bbs2fPnj0fNYzg0fnkG8uvry+73m9CrYM9Q/sURKQRTqxwwky2oBHIXXODGu4qd+HURuj4clyx6c435P79gpgVdYD+eC02tp3H+IJQU35AzW85xxAgklDjDWQBfe/i/ZDPFAKAqvXnlPtq8j0KhQdujJfbzH8WUSVv37tuRL2qGt5c4HHXWW1L/IhoXjbVmeDtAvu4WHJCyHOXGd0iFJboaArnz3zwjqKhDtB0F+oURfuyF6OHij8d5eBtKXTQIebozrBSfx7jpJNFpZK85mpdPB+upXDPGBxpFI5M2CS02UF0KHacpwQLgrMjKhjAe5z5pCPHhSI/LsfW31eXo+aVVrUUlVzMsUYguQVZXyB/vK8cRAF/d4i6v7eLQddIV9U12KgJWcwjsQ9OUzoNxcmagr3nPZB4Fa68zIf+WXB8rMcqGPozOusib320EsbM0L6AV1vHZsZzGXKYmWKq0AAHmwel8tkYj3bCHsKdYU1fcBtOgeorjy/v78T9qMffvnbotSP4WDpWP+82lyg8xpWFDHBo+XqQeIwSgHbkup1aAzwZ/W3OdIS9PM6nZ82fs5cL3lO/X0451B4tjF1OM19xFAPdEdqjvyDv8dC5xbPkMc9znhKi/Vk+sL6Dv7Vnz549e/Z80mwBa8+ePXv2fNQgIjfmclbc3JnX44SQFUoVokPsxucG1dj45gwkRtdiV1rs/v4OzxL5Q63lxhIaiBrKAvw9xcG61WwYk2DsGhtgbnhr8GoEyIaJTLyemk1mlnytpOCEs2oQfu5uF7jOBsHa8ID8eI+Z/CmHwpNbNZLb5EJMbY+YYSkSFTIFRnaWnDRob+ur8bGMFRVjyxqB61PsL3CPQjhQwx3ZRHzvIVEFAlhdQoYf31Cr3WknhTS19aF1Ut10VulRcxPRqFVCHXlXcCxVcrHIkOI1IW+rpMjo4sBtF/58d4mULjzVKQGyZ5QOLqxBt5ZpDVm493xN3GqDC/i3xBf6ZOQcK4rK6bX+XgnzFlAe4pvHQXsIGg/AvI3FZAqAvBoGQ7AJ1laRuBtRRI+sMRY7xWarECR5395Wx1icNK1Bd+iR1UYRhqLXYf1idNEjbf6zWBNqKPRlFLFBC0nNhbShyK9/dSwhCY2UR0tH5BCzbnY1EQJ6xnvUy3ywnqbNm+B/vrbD+Wdq5otnrxRLUS8YZV2RRMRQxWtzmL4vQX9ufU22o0Lc9HNJ11gjryqEwdHZONjM0hFWLcTbqt8Thb9DtGamosDhFPTr6m49PCdWszExBr/X5Bi1cBTOYa9W0iXnUdvxYNXt2bNnz549nzBbwNqzZ8+ePZ812MhTaHExwDk3qJt34QYxrYg0qfJ/PsQdo/ADkcdDZhKGsOlF3Gdw+z3VFhgbxMJNLgWhnhX84ZTxOOGItkBBt02Rv+DdhDPl9ToJlY82PfGOGI2ret8lXsE5o+PImOL5SvEmHDjrPfizZE/peCvPpbGWMCNRkFrqzOMLUTBiYGhrPFbbo3/9ui47z3CXjXShuAwCcVAg8WjvC/FtPtxetfM6/4jAxWv0j1OxuTjWbLJrjCxWcaUINGcMi6algZgeeGhqtjMJc8EWGxLk+PkukqzjIBCdfqf+/Q2H1LwHztkdM/GTMNRU5h/BG7sJA3e1xl1vEXSbEcELI4/uMUD4Yzmn0DLpf39A7V148vULJhMRXMmZCuA6Y6J0LAE0r2ICCCWtodXSSjip6Lz6vn7jS/79YXQ/+TVBIybaMj1ruLhXwbkqsish+iYo/0xBl9c6XEG+Tl6IqUZ8r+QxdCsJOY9rBDEsGjG7hEE9q2DEyc3Xi9ZKrhOKZSEUDzHlcNXEp7KL99qjlOUgJN6vcZsNlqkoIDCJkOVhbCpysMFhOHnPm+K9DcIiQfOWjaA/4fyWYvRy4E2twfYQoEKENjVHxvtgXdw9f+by4ge/j8dqkdyzZ8+ePXs+ZbaAtWfPnj17PmvGTIaOiwrf33JvZJtbkRDDjbk9nDO+MUeEzjeOXbGmwc0gOFdo57MUYWKiAQ6gct9oyyHDav7H1Z3hzpnp8vhzURhYWmInhSMDjhuApF39OBCVC4h3sUd74vN4BKaHS0XiEz7aN8b+Ho8mvSGnTQnhDYJKWxHJbAskEyva0EK4ChHIgetok7MiRpe4VE0wdT+PMhD1CpEh2u1ycz9mbtbjvJJtJU0DwspD3IlzxrkEF6uzTe4U/DtcQF2w/WiEfHKZzKJx0TIiGWsFcTJvFjwb1shQ9NOVIxcN3BlWZCfzazxrzTUyyhIxPE7mfzU5cMJVF+MxtnDwRVOgSdrBecf9qGQ0ITqmBkF/L48xejwy1kfERSnGWgpM/ExFQcUu85/5PbqejS4RhvcaTLCIHmptDz1PM1s+JerGvbGf8dUiAHxwrQzrrkhcrRKhdJsFQS/B94Jw0/BaF7+4VrVG/b0kpk29duq1EFz9rRpjkM6xmpVRTvDoOo+yiRUXYHqsDxeKJjlTiPkG8ypk1EmWWjMx4opJgGJUEBHOtmKCJiYd+VU9o7Hr18NEiYA/r35UffK+cemo7VKi7zA6xrwVFHHiSlD9db31DG0Ba8+ePXv2fN5sAWvPnj179nzchOjijpXr+sbG+Z59CQXalHN73ROy3B/cJ1Md/yEYdrinwM0KF8awFREKBxR2yUOcnogj2gK8lyVquSCwmFaWYHbwcLzWf8gVI/aQs3zKTb5VgNDh8npEjFxk88iVQ85P/9e8gNwOSuexd6uAozc6ibTrD14SolLRnPgQp5wLVkqXa6k+Nvs9BUM6bJp4QYxbjt4YWexqb5MTDHByRblqKRn9NLlKHGZvtkSt2RbCvsRxDUapphxtFMx43E2tj3HP51zOtXjfIkdOCEYQC/G9hjVyhDAnKYZOH4oPvlYOxfxcnEJp31EfQhgFNH9vd6lVwcmbRBgIi2AZKc4nUeQvX1/2/f0tIY3HVzL22Fg8MMefxEWyq/xeOGfLv/46T4qAHnvzZsV+yz21hDuQu7CeSt6b0ulkivH1ABB7ZUyxOjssYpTx9YixAiQvNxAXY7qm4ppAQ5OQxTKD1QAIF5zJbeXr8yFSwh0FccgddE1xVPLabrinGsH8viYerzW91o873WE6vut96b5WiHsQpy7Fj/3n/FqtdKLWphxa/vwVQdv/pEKTiyeJDRy4kYy9cPhBpJWoGwUMy18Yn6mHsy7WHUQ/iFUUs/z9TgjrFeuGcPmSscU9e/bs2bPnk2YLWHv27Nmz56PG3TG/qpwq9xBvyl0+d57mFDQ5tncRQWuCkcMF9WAwgcET0cMuvpH2mojxVYpD+gLFhRERQEWk2ormtYfAls2BrEzjhj8cOEZgtMe/zkoHErg8hRtfwucVTZRLxD8X72ty2XRV99diZ33l+aDZrDRyodDQaOIzCR6f7qwQSjquy+tV051jGVmTS00NhWgLtAKA/hi/ITxUAesjtgXxTZE9ONvkUnExyI+pFzKI4lq8WsvYoYsWfv7OcMI9Fg/Ij6+7aDaiaS8cXEPC1nK8ULwKsSmEyy7eFt0tiUGT+ODr5h4j2+3I61LcEdd+gbPL5D3q6sN7v29dx5kC3iGGkYuC+Hm5ZryJ0eHcU1HG8DDBrdTvJVwpMurvAyB9JWMrUOWxLmbmE7VGyhIAI5rJOKKlAIWWQAlU9uBPsVuAQlSJuJuilojSqekv3H81rkeTWGhFHC2uXYiXfl4kkRHCD84VxUkyzijIMc44E5wWQm63R1GCsSDgKY5CzBMIPsQrMM7GTbGyMf7nTDFnasGNhfWgYgIJX7e/V6O4WSXoYe1E9FWiFC+0oqZB1dcgwqqTDNZcTi7OcG9ORJMJa2eME/e/3vZlX3RfoW21A93l66e9WCDwvi48f3v27NmzZ88nzRaw9uzZs2fPR02FsNEzYlYVnSuCiNuzGbBWW9Ai/s3dDXCmKLaG5jNtpOEMcgdTIWDaN5QlWtX8f40Q8GTrPOJGwTGy4DcpYjXEMAqxDJyehHLz7y4IuYMKgGxt1gkXl2kJbYXLXcRYV5NYUR7vIZFkiJfzflv79QvXowuSjgiX2EkZM3R3D77vrqOT7pTgNE1Guo7jLzh2d7oVoJ9uu+9iX79edBoFQ0jge2dUw8EiUQfigqDoJYj1NsUXK4whiqnlasPE/VxOJDjRasRG3xQ36oJat/bK+GAIVlNuunAk+WvrA95uj6Y5uIvu/iMSVh6OLr8/7uApamEE5Nw5bA4T99jgHeDzasUZWH3IsVcyblaJ6aKwMlVZhzgc5aj39c01YiWbNGsIsjYUAOXxeJQM6wCuvotGHolOY7JxsWSVHoVUiFeTgtiUoFbVHnjpMUnGlrXVfgk4vMQlPQ1DgtQMh6IENohYWrj4PHdHyeWFiGopP6494q6TzKx6UsT0GKcLRGgDHHpt//lav2TO7IIw1S9rdsiZdqTT0oVCuBeDgzboSiNIvcBBGec/p0oBBEwfnc92uNfMFhiev2cqgPB+zCaXF+OH/tpieqssR1gcN7NHGJLx5tvsfb/z99RZedy983r6MxbX6Ndf/sL7/35vB9aePXv27Pm42QLWnj179uz5qPnyfb9v6Aejgb6Ju13cmA2uK3cbGWJyrKp3CDea+1wAagfCXO7qSTYSnDfdjkJnDhSjo2DzO6q30hXFiHQVq1xaRrB0BSto2Ot8KTbWabRwIeNmzAwuD8G5/XtHiYYysXdMG/TOqBga3czknhoQ1Y4pYDjq9ylwBE8o3sMFmBEOFbHB/vj+TaeVWYKzXeih0aRaOYqxJ87B9cXe45uiliJ3EWGaeq0LFa96qEWQrXcQhS5F+6LVzmbGKcNF4012fmJ+rfzaHrMlqwri1ZRja5AHdssFdrQQBicYR8cRmTUjb0v/6DEyvzcoyIv3EqC9zNW0F/yueE8Xrdyd974vONxc6CoPnhlZYBSgnFtkgsSDU6QoIL53XXDI+BUdUyByLxFwkU7o/3sEl21mSyHWXLhzhpxQep3pvgHmfihqdt8U/Vx88VbFd7evrxeh/qPg+SgWYgzdTowUlh/tfO04eRZPmL6Lfy7EKWbXtQ6LCgzQfSmB9SY8zHqp6WrLNVB5Ti5c+jWZEgX9PV20anpW/HH9hWeHkVv/HMRha4UrCY17cs+BU3ae67V3sV/nyZZBRW2hIfv3r05noID8KClwJ9uky2nWQ+tqiaM+7/eVTsqJ1zQ+t40OSTRoOrTf72Cf2X5p4uTjPkUZggvFs2SRgx8Hm0sVGy18bwLdG2KgftwuzOH9r27z1y/761/+an/8flNkLoL2l2aPAtQ9e/bs2bPnI2YLWHv27Nmz56NmBGxGbpEyFisIQoLEoCn2kRBRrNH3av5J4caFInBlru/k+ATcGe6PORKO/idyjdrZSooccGvZFLtJkSw5u0otCXOHS6XRgUFxJrDqEqsIq8o/h5MkGFpTTqXDHsycx3v4JrtEWtGWyGNyPPWVNLNhi4tlxngVmuQSUE93yXy4q7pcSU0uF0YK5VbxjbkLCIDRS5cRBL3LKYUmP5sPuD7FI0Lt6ZBpZ4Uw4Ne/KUaG81JroX8vGhrjnj+h4DNcborBmVxxFHIUkevhXGNbJa7/cYA/xuvF4yp3T5aVCyk4BsX6wqk1xYYCL+vk/XfBNLhJdAjSqeSCTDi+IGC4kOZOJaN4ieRZgNTLcoeZrkHETiGojcVocxmFbqkQ3dZ56SAghhGoPslBC97URd4XYp0uSuF+DytfX4y3TrniRknuV22LCYVIptaiC0JVbim8/yCTK9hkHh+t9cWWxikx6BE9pfNvceqm3Fz+vcMZWa+G10bstMDNNsAuo+uSwm/XPTJFZG3cq9FzrNhePD8A4qPFdGRbqJ/L0V55nnwf8u5ClB2k4f9w6iGeHPdusMDAjqo12fW0Cspem1yOSxweZUCgrEaHn6+339+/6Rrz40a5wgEhbM+ePXv27Pm02QLWnj179uz5qMGGT+4Hd+lMsYvo3DjQOlbhAqKr6FEmqE1vebT4FcYFz8XCmi4+NIkQFpwdxrKKolKo4ld1PzbXDnKOhjZF11yYAIjZN6mD7YXuHDnLIR7XxNdvOFcc5H7ynKqiRdowu4hwKDbpgkC1M9k7z/cwOKVOa95Qd6/NLQQNCUDzIb5UHugPcQ6tek2Om2hz7BQRkhfVCGQPXhVjewPcKlyDJ9tLTpwQm0xiXrqAYjtflwAXrLEA17P5cSZlyN12tWSNIF1FQ62DVDsC5ES31Qyxk8fpkb8F3Ce/aKq9zhQv6+6i6ctFE+PC0dEYM/V7c5wnxVK5qeCOg/tKApFe/4NpVSzjjx5bm3ZB5IBwUyViKCYajYQR0csIpgt7BxlWlzcv+lrtvAcucXANlWwjDMbXyMhmTTHHJJ4iRuoOOcVHPRJ5nC8EBPv9ZiQxnFiKxJ3R7OcxU8VUh6D3iFBOOqYi5lokKF/uLBJzC5HKB1Q+7jmdeSVfO+3vv5ZOOK2fGsB0ilsmCLqNJXoONSTG+d8SU4O3VRv/07nKvYW15Wu8k6vHqkdTuUCsQRYj8HeA5VpPDVFYrymhzIWpqeNBnNSWo9KCw/ciY8tf88fv33Atus3PGzF/4fnjn/fs2bNnz55Pmi1g7dmzZ8+ez5pHw2A5D0KXf/+mo8Ojgr7hnKzvv29GoCxcU9MyCuTCwxBE2+OCiB46yLmFu0k1+4+Lhw0/2geVIgs3WKOg4pv+It5SK/ZDHCoBjHcnWAg2zukpbK8Lt5ZH8bB59q8/4nhmjA3BSfJ33oPumU7Y+uOTIVapBS7A53Qz0bEEEWtkhR9dPD1cMHKG+PHMEBqWC2lKiqKLi1Dq4B8B2N0k+Anmbk9n2JDQIcGriy0Wcc3ycNmYMSoYAHqCy5czrsh5V9YdoXhYCOWagonHm/G9AQqTm46f1eDY4fHPBP+XdNVAODvNxjUV51S736BzhyKEBE2tuSkxC+41OYX8DpXRUvx8VzHJoq3Sys9rZRFPozj1bOGEs83XrwSViJD2Ge6wkS40Mt86IOMAmVeKjEBjuVAJFx0jfGi7GxShqlhbKCiojQLMnD/4ZBE9DJaY//Dr4H+GdsH6m1o4b4Hqi8Q6e0QYI+IZrqb12qrXdmmUem2XfKU2yxS9wuEX4lGyp9YzmGsSLLMjnz9TZNHux+VHDLSB6xbPRLjFKqnsbPkctB8e3jJajLy4EfB93buiSORUYyHO98AjeH6duhAhLjJ82hQ79t9x/RHX3LNnz549ez5ptoC1Z8+ePXs+arwp7DIyjpxjVAZFq8ubz+Ca0uY1ysGGnBoSS4q4SfF3OoIGnFIehzvaEjS6YM9k1EDBwNd6WcIOwM1dTC1FB4s2/MH8MWxEj+XEQUMf3TBwvrjAc49sLQNPSA12ZdBlxTcp//A9Sqfzx2HucKyUiC7SwcKY3+Sm2mN9EFFW0yGa17RQ4jNCvChtwdID2B4iU5VbzKXCaNmbameEI+VYjYT4notcNz8yztdjbPFZXW1rLhTEa+wRHW2KqRVd37DihEAYscsmNxQdOSMZUxFhhCg1lwBBaL+/j1w6EkTaKSh+lfBw6zWHmGme5rvZnBiKGtw+HoEsdDY9ofwWkdDK8yzOWBsd7rlwCT3Tf0MiUsQoI+KJ66v/hRCYoix1Pgm5irTp/eL1pvZMCiUFAPkpaHzVNR4pBJYsRrAa15HrA26odFCNFFpynU66D4saD93l6OIwwf2G567KrTbV0DmgDhOsbmJbsVWQUcnnaxFBnWScsU1Q/KqMiCpSGzG/1rJhM44LT4Ge7TiWLmekX9t0NFbGd/09welyQbGHOOZfH8m74hohO+3pnIMwqHtjKQDSR8amTYqeDnU/X3KvNd4LNHWGSNj7hrjv2bNnz56Pmy1g7dmzZ8+ejxo2ANKt4vGrLgfDeN/YLCIqF6ynWi1534W4dbhx4Jqy5EW5KOHCxcxyMDGrqiJEcNcskLhJhADoGq4atiIiXta74oPcID/bCeFu8ma+ISbRg1/F5jM2w5E5xPjgkIsm3Dl/8x5V71G4SQ94egnXiSJhIeIkT0s8qCrXUdF547MQRas24bQZKXqQ0bMicqa4E4SMR6irOHheO/uqFsYegscI2DbB7VUOsRIOou5NiHQ+3X2kGNGmpSjHDzZBtQf4Ue3RNhcTsPYQqpCgKw0MITCM5FYytd3x59Z52CPKCQFCohgcThLy4MJ6CI9+/1/uUor75df3ekLSeU/J5+IaO+QEi/sbYlUfy7kWh5URy2jG8+tfRkblGKir4rE9hKQ+VpxxhgBKF9CMZ8rfovHscS+CI1ZWw+EMZlTow7p+4Q4caiWM5sMRgt0km8rP5uUgdn8viaYRGcw1hs+vWCsh0tz6/t+8FoJXT6Et+Wj+WRKM4NwaXfec9w1in69tYyQ4WknzWXSH1NHARuO6FNdNZQwmAfuHy9K4rkOArBJJg+8FZbeF2KbfI+GOHGSFhTgLoUvLGcdW/F4dALzHszd2hHDPnj179nzYbAFrz549e/Z81Mxwx3hszJ0iTZv/32/EABkbW61uYQ4pEpMwYg1ZHQnC9o2sc6j6vAGppiun2TUuU9kaW+ce7Xom2LMY8PmxU9vkiBWhLdEFGwG/nZrU5MLJ9xiLpyOEk2VIrjB+VeW+CE5RVZxrKKJXwvki5wlcZuOxWQ6WlTbQ4HhZy8/NiNMwlwbVAFfwObVM8JZigttzeaObSWCTyBDiQCt0n2BD7p/jLjkBw1PgcfHjVDzq6nk/IS7UB8C9c5N/+f1RPHDKXUYY+LQVJLQUUhgnI7Dc9JrzPChmuagD50vJZknyqSiolbpiijeA/hQYDTG523NiuC8On09Xj2J8R8TsRjQyCt4dMPY54BiMcTEiAO5N19ZFyhBOi6JxzqkKIS/5To0NlH3cEOfWPSLrrKClz37A3YfcSiFCcR31FVWbIwWoUIRrXO/xcBqVh9w3Q1ecKz9bQk1e9QEVn7GuSYkWxkkmlT+HIM7J0fecgOKnYKVjgejVu53uRgx2WQizug93/H6oTcLyEipx/wDLXw63olhyMNY6IOyVvzbQfLoE4R9pz4cLC+sIeWKB+HtnrDnijoK14zebNzbKkebKeynL6ehq+3V/Wym/8Fz6a+/H+tmzZ8+ePXs+YbaAtWfPnj17Pmpudzppk0+8T7X7egN0XupBRg02z6rftxAWLMUEjMQrxNLkpBjhljDaV8JphNp9b5o72ooTzhA1KFTBRcN9ptxHZFZhf1sZvSt4PzpVEC/CBrknVNxFD2y+jWyfKW6Q2zb8czrg1Wy8SxC5VcHdCX329xsjmEolbEdiAXEjLo1KrKf5iA7quj7jbuBldWvOWRo3jgEMJDiRipxPhFIXObhM7hN8jotelRtuvzav42Tzns4FLpKAaoe5SrB9gYwgMs0UEJrUAjGoCoH7DsN2QP4IUWJQRKwR/ZxyzLmQcfcUmBC37IyKje4H3NX0pnt9VINWFQKlKhNbXYyqFEZxDw9+tgTHEKno9KoqHaBIeTszTU6+ovecOp6nawhA8EHAvzsJh5xZvMcT7+Pn5C2PznKKyGasdUbUuu4nzkSNhJRk6YbrKcCOGY4oudPi69Gu6TB1j1eK/zbmw+Umt2Osn3APRnHhrAeeJ3eloZVSkbmj0nHFiO4Fp9zU8xViWUHD4Y37cgoOH0KUX9/3vAzLTQ0h3x4DAAAgAElEQVSPfv3ezrSqek7kRAvnH+5XJXC+qFWwDYrL85Dz67rUhFmtzZLx3nRn9ljvBmFuRoOlSdybBMPPykipO7p8TYz7olA1KeghIlkfkV7ERYsESrHk5Nby5wXti39H4NuzZ8+ePXv+nWcLWHv27Nmz50NnUFDR5rqdBf/a8w1zOInmI+5TxJ2J7w05LOBBGs4q4r8yA8wcUayIJZLF84gUpWlkqIVwpPvEhSvCnFuKUB5TZFRL7ypGVMC3myJ1wUDCZt2FIxPkvUZcy35Aqt/XmwKK3ts3u3QDFbhRKCCF+iBGECDx2ni7SHO2qKkjbPqOJsC1QXaBCMfpkO+j6fpOnU/7Ea10UeXZxOhinLtevLUPTqrZJYYYAfhky2e8E1wn35w38pCmYpkGtwq5UuE2G53OI7MApC/4O8UgCo3+fohnorWvU9iSWwzcq3sinjbeFI7+f/bebceyJTvPG3GYc63Mql17c/MAGr7wA9iA4QfwnQH5yq9g2BBMWt1NUWSLIgVZfgrd+sJvINg3gmW0RNNsukGKokQTbpK2QYLgsQ/a3bt3Za45I8IY//hHRKzshi8EX5hZMRrVVZm5cq05Y8bKqvnt/3DeLGNIPz/sdAYwdL30PBUapUYQFtSu6nlRFd9XQrHgdT0ONvglgFHBddPJ2RRuXWF12uub0K4SWG72HGelxY42PbUsAjYJ7Z9cykYIi5w3XhehJS1QFcZ9FCmwUqiSobgbICnMLXshdtBpKsAmRR1xDMT3vC3/3VVRfDtRJcetWFvP0HL5ou6rtG92LFAitaHoal4WQLjmn+N1xvdqVhWsfidVfAn7UKGnNkrqNVMYJQS0CrAy1G32M0L3mBsaBTlsmXZE2nOjyRf19zz9rMDhJ8KsWKguo+rKVZI5A7ImhMVHZM89e8snGkaPYVsNBqd2QLkp886Vl2hE9Ly5FeS+Zs2aNWte1yyAtWbNmjVrXtWoUuM9gYE1eqky6fDodtyYQtVUa88LMsuW2+tMVaU3gqZw0Wa5yMazAotW2jKhQIWiJdOyZilaRnmsZdA+9pvzWqyJrngIfCt2I2x3wFRTjekwq0gHagq+kluQGqFMDFPQtNmjUg9zPrvtTRvUuhImhJHXoyCJYdRnvcnj9VH27UGenp9wzMjvyskUZWVkPUFdEmkXbAbH9F5bYRygV/DzrABLiVZIABiqjMRtVGK2QAC6RKVXNDCx7zuuIasd7dRpt0SgdzXomNjwCBWNW6ukmaqL16AxN8un0loYPBwc6r1qds6uUKry9GRACfCl1a5CisxDE7Frg313zsogAhBaOFVR5qHmqr7xU/Lg+67YSWZ3RD4aQ+8V6wF8NkKZlLpNsEZrpIO1DyolUxUJc5MibZmN2U/CYwlTHhfOqZQeOA97HJRmB/dvk20LKN9TmAVlnV5L2iPFs9V0w0ZTOgEY+9p3W56u38hagwqLisAeDB9Dh8Rup4yNllgGspsz1BRHDnISPYuu7NLfbwqHNAxflY5HQ47XZd+lPj3huuv7Wa+PAlQ9AFP6eWsolZJ8rtYSoXeAapLlmiNvTUw1GQiFHSY70C2sLtyR09UAYbHOyNUK8vxsa+nNoNu+o5RC38eRP9MA42pho+WAWLqGgHTG1E49/jVr1qxZs+ZV/Tv//wfHsGbNmjVr1vx/NrDwVGsxK4AydsPYxIK11TL0/1YxD2wQGE5ud+H2nJ6DI97QRhC0bbCbHbebePL2DMbsDxVwwdRZVKxQgZEIl16OA5o5YFxVOm4B03vfLYeeqeRh257P1VU4+njNctKb+GywzG/Ga2XINMO4W4pyvV47IMtsmkO21RSn02h9wnmIt/sVKrRCX6euFqM1MscsZzvNqtfb6prkMJrmYN20L1g7XEqS8ya3202evniSx8cHwCVkkfFc7Ga/GLwpBpcyA+YR1K/2xvPEGtTJktc8pN0VQNXCvqHEagan0rbjGDfkLnlgvgEG7AOHUbrm0db1LM2sgpzgmVTVlGI9E0zzsZjR5XDS85vEHIWm9au2hlCeBVonuWdif322LdZwL7wJDLCnnQ7qN88AU9VZSL1Vz9SJPBdmYTkEqWzkKziHCoC1bRqAHkfOU38PBWSZqXItsERAbY/7ZbdSg+KQJnG9KsoUDCJHKppiV1gp5MvcV4BEgTD0xfcKvxfnJGYtBZAOpqRrVFjpr+Nmf45UC8IK3MwS6seox4yQfUJiFR6q0hCKQuZcob0Qtt+Rt6Zr7OAxeM4a3nOmdwPELNHyuIJZGcULHaafTfqxgjsLpY+9SbNRmYZyCV2bLVvumF9wwsEe8LdmzZo1a9a8klkAa82aNWvWvKqZ27qg1jg92yeYDe9QddBmIIDqICiyqMJCnpBmWgVTtEQoPiqAUs8bYgvYXcMYVR8i9n362ggw91a4MNmkCD8sMJoKsN6QONQqsNm5asXD1qf6f1VF4WaWuVYSB7wKsIEFaz6sTZ41AylvfrQGEdIIlj80C4hrctQ2VGN83d7CFiz4HfAoWSMaAqyPIs5WcJtOAAQLJBrz7BgLrw/sh81zoszedpY6QEw0G6dem+f6HhBuv1yomAq9HRCAsdTenHdo1lXaqLSrPW/KFGA7g8nDXZC4QwOFNicUa2L5SwBiBhXiFqWdBm9wjaVHbdn3SpuuNRU7wcPwmRWFTC6B+giPrYFr5QV0sbMHKRba7rZJz8DSdbY9xmN26ykhEhroYprYha2RCbUM5iDbrBpU9fWD8goB555x5dbSwH1YRLsZ9Rop6KvRoFQtP6rpbgTkCwEmcrT08y30TKpSHWS5FC92WIMlUPjMrDRpDu8M+vh1QHZas1wtgMlo/7RFthgrEpvDst7o1+QUf2073sJcuoLaAq5lzgDCaI8EdKrinsrmJQJBequnfhBdESZmG2x8f6slFz83FNbSonwy/w17hcURHeQChFVTHtJ2CMvzFm39FapmW9MCZeeAW1BrIVfrh8H4mjVr1qxZ89d5FsBas2bNmjWvbCwMHKoKtQ/mJM/vDxMQ5STbZbcbzmYoRG9WTzFg0zOMADvMWqeqCb3hPKcWPzQCRjbCJcKslrvay2r6CzOuXaE0lDdQ07B50G11pjhq4jE7jaHPkSqOm7YdKkChwkQteh12UbHi+UoWwGWgAkolVW4pkKnDPgdbVBNmHUVrBqwFuT+AdgQE3hJoa2oQDvZLfU6X+lTpGVCBgfUGrkQ8M7+epUOVoQ4LXQGE4OpiAdi5q8YKPv9wuVqodrUsMLMbUuFV7XwdADpUsKZDh3+CAPuAhkFr01Pop/AI16XVDqMC8skEii0o6+o5NfoZ6MEe0Fyq8KNjhszyRpjEVsJRt8ecMomEaKGrpMCasoGPQnjpoM4zsLRlUVVRW9unhstmiqnqSqwIZVBfZ/F8twILXLc8KpSqpnTytXSVVWUb5K75TLovmEVmmWIF6jyomiiVc1Wf0Pq6Jbcz2vFbDpxZHUXGPhIGuOM1FR7mbGUFgJPMrQKErlDD6XM7RBMAHxYdtANqSNhI2RBq0MnOBaHuzcLOmYROIEsbJq2OGmJfxN4n3uaHAHi3drryTRtOJXT4Bvss9mc2+6MXQrj1V3nxlggYI9Za1y/LNsAb7Ybz6PPjuNhIeJ7PeG4tTUhpwDxVqJmiTeF0O3eJp2ajrVmzZs2aNa9pFsBas2bNmjWvagLhTZsa0oRgKkoBKKhu0eMNombfhJPNbcVvZGnDq+7Par21zxrKqGpBS6CBBrOlmX3RmUW3muExdnPtYeI4kESLWYojK4g318hBUntSK1NroPRGv3nMzkfVC22EheHm6mZT62GhRQytiGkAMKhvcFOeka/TRUB1UoVFKlmc2kRCnbP27J/5GKDE4uuFfrwjD8yexsCMqojcOgc71c0LIANUYx7GHRh07gO400yN4sDSQYqqUBSObdlgWGXwfI2mAjNfXugwSRjMn6K3y50GPNgyqQ1zyB1yFU238E0KO+Y1Wdi+QpCN11mvv2WumY0vWEYarIWxB/VbEDfBKbK23BpqirrGdkAPsj8JfTJy1IRh8rXnv6V5jwBC0mTGIH3xa8TQ9crCAdBBcfgasHcclHhgPb5Xm/KmprvAAHWR8EM23RDNsqlB6bqnoUIKbP7jY6zt07Kgeq4ToZFaQ/U6QKoEgGjgzb85JGvsQ1MklV/Jg/z5ftdrp+dnIfjVlE2wcdq1C8wekzpsuaVw7+n/sl17rGULfd8ntg4CcFJhKGwbhDWRkLUr/sSvvanbTn4+x9QbG/HMtMbGMNRsQkCoj9X3d9YfUCnJ7WZZd/lyVTh+KEhbLYRr1qxZs+a1zQJYa9asWbPmVU0NdrPe4N0xBQ9awDSgnLlN4je2CEK2EOuWCHIirU6s27cc7AbQhRa1Uru1DPk1xovsBhatclRYMJ9I/3QiA8vAlb++3uSaxbABGqnCperxNbM2zS1vuBnXm2QGszt4AlwKjZlDxbJ30MBnsMGzmjrYiA7QKtRHwBm1UVUULRwa0qGE5xE9PmndZoib8GjWQWvwqzBi+U13ACK0VsDI1/LjFM8pakO15LlPnlXltjMoc9jOB+WOt/wFU9bgmGhNhFLMpV5Uq8GYGMyi6dCoMdRdLXh+DTIBTQ0DLhzHYblcOUPppM2DMW34/j3vXV3j2WMSR/ZRq5XrGGVnoPqpAd0KT2MiLJO+CICe0SCq2h1NkTPa/4TqG5mvOe2NkS2UpmpqkpvcWVCdQtY6MrpwrlB1VYLW5CWAdlQOfr0UAN9/2l6JmdlhgfDTrqe+H2APrCfBmFndCq81AGw9DcTExOcspkyzVPseXB/yUId5yYE1S2YE+lvOWoHiMVBV5lbCHEYWF7Rmbk/URkDAyoq2Rpw5baZ8MJRcqrRUUKe/41oqSCtktR6mz2uS0VbJY3aVH1Vseg2FpQSZxRCAoG2E91f+AND3tFtCAcY3vQaJ2yNCxaY/0ABmWXKQ1B6rylL9uVaCnJoRVzPBbQ/sP2IMz8Ep5Zo1a9asWfNKZgGsNWvWrFnzqibRVgVlAxUjyK9CJhLD15lF5EBIVSyIkHI7EC1xuE1muxggEZPMNSg7umpK7V6RbYV+c16EeT2TEiVaex0ylqJZl7qDLFpdfiXQMkthNSdgLBYKX4WNhnVYrISQIEdJlWikmNrL2/ZgoywK79heqOosvfHVRkKFdVSOoZUQN98Mhj/tz6o8qmHkf6GZ0bOEqPbhCZo9i/BgFuDgxhr5StGygILcBX/P9kfNSDrZMtezjoLlIcXLDpiBZkWCHdzaR2+za5YpVQckrG6nVFVVtfZJu4hidqtWpuO073MVlqq/AiGmf86zthyCxQkaQWXE41UrYtXgeLV3qaotSP+eZGSRofV2/a2yzsBPZs6T53Q5QKxUFcoU7q8Neg5dA4P8cbp15KvxsA00Cpv0oDoqPfAbKjlXldFmF5hNZi7BCljrz+d5aKYcNGtltupNZK6B5wZr1lSYrOtQ4eLNeA80AtZahirND7SKX7ORfxXw3rZr71ZYV4R1ZeK4QHf6xBiGrdRUlxlbJPEalGqtnbfjJtzCvUUSOW9ss6yEbYXvEai6stlttSBC1WUhGkCO/j5yOMfWz6McklseWVdi7Z1mX26wQrqeEVlWUMkFg+FxtKG2ZlCtsqG0qVV4vyDWLod4qBM2LgHWmjVr1qx5ZbPSHdesWbNmzaualO1mVRUZ7Tglqm1KVSKtypaa7FtGa5nhIANCCnIiFU6mYDB1jAVZswGujRvRyPwqod1P7Wm346CaIhCm2KpWWg4D1RFuQYPdzoO4aY+ynKIJvvCmGVCKLXt9OhfjDXO04HA8A2+aWw9pCv3YXZGjyiY0IBL2QVFWrY0tMCheaAmr9R7YuOqkNzFy3RGST9ubZUuNZjl/Xai3CGeaJV8zVJ4QgNlh0BxVg2GW+ZO78gfPHfz8OLxmAFu+rmz3y7RSdeBG26DbGe2LERbKfc9U1FS05sFeKsw0qqa+c6BpIfWB6iTmUTHAW9VbDUHbO5U/dq4WnJ7szwj0phVO89QANUNXRQGoRgZ7UwmEa8j19RD8FDzAW0Z2mZEgjO4t2O88e4vQMjBwrSr8SN5hN0AS9knakLekO0CPw+Ep8ttynNbWlU+mHMR7KfhzpJ5N5XbP4KUJ/p7S7DMP0wcQGk2FJJ4EWaGrAn0/Ys92dVftxQ2zNRGKPi95mPYtDhJw6zRlXY1QZTYCs36+YsrA1q9O488QO1ddX0DhWmXft/5eDVwEV7TpzwhTGLaukszRmk/1UWpZFJYXQA3J92OlgxDwStdQ7Ywb1Wm8npEZcK21H7QSnlLclwJrzZo1a9a8qlkKrDVr1qxZ8+pGc49KeIKa4ixHD/cWRjfjdwixRrD4yNe2m/pG9RTUG9mUQElGVhUseVRo1f6sVBa9CNAGDAvSc7LsWKi0opIDIIzWNJ3n44bwcrTmATwJ2w9d6VV5XjJsY7xRPsUUMVvIFgoOJUjsqixhRhLgnEboSOqNfn7M3e5WpWcBFbewaa6UB88HQiFVqsVhzxRaOT0YX6GJwgC0Ih4HVDrIW4oEdR1OlA74rKnPQKPa5qCC0TwqtdwRKJm9MlmYu+c78QSgRIPqzU5poxUQ9lJCObTFCdVkug4KWqA4S2Yx5T44PKC/mB200kJoir+h4ukh7QAqBrXMJumxadbEp9ZPnDePLfDrsLNWhvzjf7VnogFcNLO2elOgQreuvprUbG6vCw6t7uCLjJwsDQMnXDypAIQSL2rrn/0z0SLfMq2e+nG2UHXaO6Hya2dXOtZillt9uKregnk7AWpstcNk8Ru5XJZN1SyM3Fa7r49aR91Si/WclHIIntdjrmahFVpHHW+6dQ9WvD3jfTAAKvPwmJHlYDY4LGoDqgGgErJpILtmivnPAt1b4WJKRlt3Uyu2Ij2LKtoOs/cDj0e34smCAy2EaBNUjSxUQDbWZH12hSGaObfAnynB1We6mT/ft3gLZuRcs2bNmjVrXs0sBdaaNWvWrHmF085GlZBmGbkKQm/xc8zMs4lmbWJ+kd9kA1qI5dxE5s5EgpfA/BtXMrW7fCEDNieVVD6hq5BMJeU5Qm4RCwQhrbQeAu0qGgc4yPEK0tVRhaos/R3tbQyg79DHLWEeaj61zpVJTSWu0jI/JY/VG/Bq/7iH1VdT4QA0OQSgLa1QNWPHTrAw3YzXOrKnGgOp3QLWj0VoZ3SQFvhUkVle/J+/1vH8bGdd6p2aqk3rbxY4OxdXlnlbYn8Njl9HBQt5zzzuOq5xdYAy1hD2zDJsiFDnsREuTk2FYXopV1MJz8PX0q9VoP0MLYy0zPnrWUtmMpDKaw4rXN9PVHBVO85iKfoD0nhOFNV+fV1oIcQ+ywmQCjlQhK6JzZS61woyrRpD/qUXHJjCLUCZha+3Qi7sxQaVSjw75kBrICAkz9kUZYG6PLMnRtrvsF9cleU20Uk15rDHGvsGpJN+DcK9XbE2No3WDiH13Fy6pu9ltFlK67ZXQDDmjfnPCLg/UwDYzXHAKvyPge5uT57eEP1150FbYnL7ol033QP2HKaa9PcHChBcQdkaAWCpMbRvb9t+vgzSX7NmzZo1a/66z1JgrVmzZs2aVzU5jv82g/r8tMkZihz1ZooQKGkMFuknElvKpAsYZpsSgoKgMho3wJ7tM90Ii9ACNEEKMUtcJRhLhDie1dQIm5CepTefaFjj97YBJRAYrfZE/UbNgaLqxW/a9TV69pErvFqVo5kdLwRTDplqhxlHbuUq05VnK6MDONwi+1oGKmBo09PnVTjh1i1YtqKFggc2zPVcJrl/DYUywSECQY7fxHvLY+Fa+Hn6Ouu5JgZt41qWJkkZHzOwCkDFdFI95wnGTobye/vbyKRyFRaC4gl89HM5R3k+ngFtFOogLusszM+qPSsJYEY/1rrHauoolbbNj4lT5hfC5IU2y2otcpnXxELFx5p49pi4LTBaVlgFmWJjokIW2kY9R6xSGQQLrV+EGHgNk4WAJyoLmcdkAfqlt2maMtAC1/UxFqZe+3sL4ITXXDPRPXy+WyBnWNbVU3UKW5cOZrBGULPVqe1SekmAUHmVxN6vlVlnsCaylTDw+qYacd29wRDrTSgLOypff9j8Yv8vulCRbdmgnNokg1kPhfZfHHJp0k6DdY1wUPd1ZLZZmByKDoR1XzTmZ6mCzzLNqBRriYDM4GdDjJ6tpUE/dFrifa1A3soqCQFRqpA6pGu11RDC93POtxTzUmCtWbNmzZpXNQtgrVmzZs2aVzVQp/BmtitVDr0pfLabQw0JPyttXY1B657PE9kMdkIZE5mNBWVIsJtEDWH2LCsHHxgPOqeljMnXZrFrdhNdCU3CZG8SV/kQdBRa1ZCbhWB1y+wxJdjWVVvCXB6zijWL8iE0wk18M8sXrFXRoQqVISngJrvIBCMqLVkO8mg/syDt0XZodkKzmmENHBqwZc/sZGxQZPC43dcnAygAhgzRZ7ZTYZA3vhcwoFIR5Kqg0BsMTSFjA/DC31V9AkCoV9GVZ4B4DDuPZstT21fgHqkMdbdAbkHTnVkhqwSE7W9QugEEpmGt9L2i1xbXH5+zAPdCKGELa9+gjjsopcKwfxaCiTA1BIons2lzIY45ASDpMWfa6rolk946u8aV6qoAkNrBjB8LvnGopXDMsfWst57lJBagr5lYeEgyiAmoVANa+jqEldHEaGqg1M8f111BKK8T9iXLByKbAANA0TbscFS+FbcIEvJag6XZFdXuWJhztjnIjQb+FKJGgJxhwwUcYnjUbLMd4JKg2pVd+nMgDxut78/AzKqKjCqz5wqVYHpO9hIGq7XtVL+ecp5+vph6T/PU9Ny0MdSyu8TKG8SvpV0LtRIqqBJm9HVYjZ8N9nPNbYPetqmfSymDOMYQvxVqK6H5u3nNmjVr1qx5HbMA1po1a9aseVXDEPczbxtIhzau1fKEU4SaJ2WJvGGFPYqKoX6b578zqF1vOl3dArVMlW5lE7GbyzDZg9xyJ8GVHYHB5pOtjfCJ8T92Ux4NUrx98waqH4Q9t8n21Wp/frT8iWVKNcbeBDbXqboDypcsZj1soVujcMMOhYqpqWLhjbE3HraAYyiEM95OiLVrs9rM2uW8JU9v9BUizSHzwx5o8MGtl4BS1aCEL1SkCs6tbLDYTfBqVmnV1jqMCGkokBrVNVijSHjGa5kYPu7H67Y5yxbi9aECxoEM1uTp2eyBYSjdOtwIBrH0+dQ6pllOx3Fir0SRYX9scYTS02qH5yZYFJEOJWuzHC3AQgqvDn0+lFZmqMO8gS8mV+KJZYIFA4uWoVV4ncKwlPo+JQi0HCsbs6gGKNgsf4pZV8Ggo3ihAfeqr7UHshdT/vDtYzZGP17bm6Zkgg4Ol972O0L/hZbZag2SjcfmrZTCbC+0BorbDeNoaKytK7wqmkft655l1cPgg0FnVx92qOVh8A69vZmUWWDRCwcAw5ovH/Z0bxqc2jjd5ju/D1wh2S20XXEoLI+wZkFVh2LPa3h8aB3a2n6IXaGI4Pc8lygMBWNM8TlK+LNSiloIF7xas2bNmjWvahbAWrNmzZo1r2pC3lrYtpJux/H09AzYU2hTsra9Ex8jy4bZStJVM3aLqeqJ2GgbdHDibXhqL2rSlVIa8G5x2yM/ydU1UDQlIymmELIMKdjM4rBY4bWi3dzDSlil34BXKmbUvgUlVakdkI28K1McBW9HxPF5+rWBqkK4AIWRghKhuqRJVxCJN/wROrjlLhCwCWCRhZijNa9WhLHbsbSez5NbsjweBoerAi26vc1oh4G3YAobKEp4E67HJXmzYw+dcfWb9JyiAStCh0jVWodPkSBMGMCvT5cyFFS5DUuWEIBpGDfsnSch1gRNiqu3+HwnLacKNRX6tDIC5735zo87eFlA4OsV+FsBtABD4jgnYY6Y/n42A2bIQApUCUH1VjpcAwDtDY6ER8xl8n1pzlVbg6GWi5Ol0fZlAaippsprFqIfqVDrGVExUKVXZdb09Oy3yXobaTUMPdMqYV17+YAqmELvOrTngcpLYA/s+Wt8Llec4f0hcKoOAEW7obCVMk55WIGvgbVh02AK3rDZaCes3FO5B62XYsH9aC3Ux4lZKrVJstsBx9IDUAkhovD19bgPtj7atQflhP0UrY3Byhi8QVT3YcB7qQqqCoq9ryIVi9gdXJOcohcycu1SV50i8y9GpfV/qYe28ZzWrFmzZs2a1zILYK1Zs2bNmlc1l+0ie96fz/D+ixRDe/90ww2uZcyouiQLi/8tK4hh44h1BzihqoJZRqUHd9cR2qw3kDkauPJGuNZ69hOeXaER7G6ZvWvRGgNVMaL2LeUVKfTqe6G66On5ubeOuWLD2voMRBj8iD0sWiFQ1mdJdqOrKiCFUgqQUjB1UyEkcHgBtU+1HDAAO1XaJM8KKmgltHt4v4GWrkRJkflRxVU+VABhDcNdPhcsXeJWPlclWcA3WumIQDwrSoaKpKveZArQ9jWJaHg77QZf12ezNbbsJ7vOnus0ethCz+TSc5TmuWT2VX1chk00wibqof46WMtkaqajtLv8LFgzPcSdiiNhBprDt0hrpj6nAiY9P1UZubIHH1Nl17OsmEWFRs1K1Z2HrKv6SlHTMQXjM7NKwYla/Sw7jHuxUYXk6qNw35KZ2NwHvllMfeXgBPuhDhASqM5za20nUUV66DjMdHwvKCBEyUCx73H7qtv39HOlDkutXzcvFaiTiAjHH6VL6wLzrTSXCw2h0SzD/eto+aOllHuz2YYzgEcVW2W7pcIrKKuiHZtBN9t32GO6t88i57yWXbJpYDExC29jOyTOKQ1FmPh7kRZIgPPT3kgOtzwLa6z5CNlPDNSHurNbQAVrnK9JtW+fRYl/GWOsadvWX25r1qxZs+ZVzWohXLNmzZo1r2oeHh5azumLlrbvqhprUyilFrawi0ZlK1QuJ0sAACAASURBVGzZt81uwFXl4FaryDD3aDfi7gICsIFZLPSGPGQ+hdRhhasvJLrFp0HVYc15VDOlOMKr2cgXCEKg/ElulavdmpUciE03q3YTGwYMYPi2KWaMyDxrO5/CqTCyfMximHCDruoOWAubWcI8l0thGILYg92442bc7V1sRBTANcFttTY69vWNZn0LVEslQBlhQHci+ojMVkq2fnz9Q9v2zsNu0pOpoGIKXZnk7Xw9/wlKq4znBfzJBCyBqja2/kkcv0eABMuICsJjAiwJCIMX6u9MTWUZU4YouYYS5Hq94tiP4zCA1wZ8sya4oYjrsDDYsyRa82Lm53g+WjIgvu94XWOHGcJ8M/s4MSQcK1xetE7q6uYo25ZHNpmvCddb2KLpwDRQ6QV7J4FdzP78o/mwPxWVW75HIiEqYKC2fYZ4b6cNHvY+7IWR2U0+gWokt476+y/xPWi/CDGT8D1h+VGmRDKlH96a/fuafb4VLNeWE5RLBdleFV+HXTP5dRDYLrUsAZljsOgl5p7ZzwhVRtp7SptM7TWSR5cF28dYW1X0baZA0481ywofp8laSHhs5554DQNy9gDNpvVJ/DkQphIAg8TVsSWuVcqam5X0B9WftiTfzjnXh8vD+sttzZo1a9a8qlkKrDVr1qxZ86pmf7hK3venvG1/9vw+lhBTzvCOBSh/TjFrzr7tOG1vOEu0GukNttrDKuGJZmjBvicMV/ewbb2BrrGrgyBiSfYaprbS1jDaxULsgOpsQ80EGKOB1LvBLlNNJdob2S5G2xXuV1V5RcGHZeswT8tvjlkBt132bv+SzZQ2mf/NCnCgROlhSI2QjjfXbiu0ljQHMhQTBav7yx5uHdkWp2tV5C77J/R4IbvRd4MdlGrV1DOuhtFzzWHrmVbIX+KTaHNih1ehyWW/4PrA6kWoGLwZkrTKQ+dDHRlHeG1mGDkkQCscQYK1Hx728hNk0mviarfzLFQBDUWMgU3soKHMalP+GS2geh6B2Uy+qNFD/VlJhz2jgJGv0yZFlkPMvr4sKVA7qgXkCxRZIY4GQZU6hRf/rbJRaeX2SwV1eo62DxIUU/o8qrxy+NaGyKjvBz83qPWiP3fg8Uz7Ue73hQfcG3hpuKaAdVG4L4K1XB5mG+zqQzHVYLeqJoNs9v66Bzxm+eNeDmNPu91T6oDOrpTaehNjAnz29522eUJNRiWWsMHS2yw3zaI6PXQ+dKVXtzxGhYqbqSKDK6ZoN5wVdR54NQXI25rew0bPxSvBsrX2bLl/GnBfazlSuvx+zumzGGP7r778X8jPfOW/XH/BrVmzZs2aVzMLYK1Zs2bNmlc1b968aSmlpxDj/y1BjhDCHmMGMtJir25Z05vXtpmyQlVI2fOEKtU6Cc4wvWndoWDZe/4NMn0IqRotYq56AQThjXALbrmyzHLc8FMtpCDKspwqc6AsW+u5FNlzgrJJj0utcpUKIQUvlcoYsz9O4d/N8nQin/9WbqYwiwbP9HUDM7Qiw7Szqz8UZlBFhJyqaDYl5PsQnDj8GblHBhTAdnhuwUJ/LL/H2wmTWQYTlTiJ2U8OpXDL7s2RkyELwfawS1ENo6CE7XTJrZyO4Zorx+4hnIe4Y40CVS+8HgrhTtoe1R6m10LtlwBJ2WCYH0NBYJcFxWfY1MbrG8RxdR6kOva4bNCinAczqGxPBV534fpna4+TU9U/hUHvzUDjFrKc7RhvTx7bsKJZkDxsc2BHpT/ubgjKUjOFWnN1FEPTfbB8VSbrG62YbA1sbABstKaaas+gDfLdguU5eVZUqlRkxdEC6Jlc4nlePYTfLhiAGLPANEtNr6m+F9TWqQqpyKbNWC1wPfB9Ir2h0faegp/E4HqE5k/2PWC5FPsxqXVUM+OgEIujwdItknpOePxZkIsWWSzgCir917RCLKjNkgFL/GxwYBoiPxdN2eYWR9oLi0kRTYUVCTLZ0OjtoWmy9LrKzXOvkqnzWgvhi5DSv94u2/u0pRXgvmbNmjVrXt0sgLVmzZo1a17VKMDa9/35su+/V68PnwUJbxQAKfw4FSaI3UAiuJrqJTT98YayhunzzZrd7LGuiBjB557nU9hOKDJC30VGcLU3tqEdDYqNCgWJpXElQovam/Ese2iyhsXRFhg9ANvzv6neMfseYQKPN6WhfPF2Ob3hdfVWVwsxC8vBBMDCZHNCdrdnBYXY1UGI76kWyG4lcwbQQmkDrs15RFSjGfRBej0hW+iuKX89KI+CyKbro+tXT4NrhG/O0dB+SIun5xl5qLjBCumthuwHtKZGtTZ6KDmCvBWcbFAjuWopBVOm+bEoaJozlgDO3CqYDKjo8dwUtCCc2xofPW/K2w9nUteo0PK95b/j8269Y9QUlHYMZq+WZs6WS9oYdf9gfT3Qnmq0MqyNla8Y/cWCtf7pOZbWOrxtLY5GvWbh+Qiubx4wTzsmAZErnRQ2otWQOWcdKpo8zVoHe4uk7WWE5TOnzpY+yuaZZxpoHiyk37LODPboNU+B7ZKtDsAaGeDvzYMegk4FI/Y0z8v2Gq18W5I9XF60bYYB8ZifhWZSZJCZPbKedq2Fqk6AW77uGYq1CwJUG6S7Xi5oGxQHhihZQHVi547I0iIcjXxMYFunHmdkIP/GsHy18iov23P6dk7590KIt327rL/Y1qxZs2bNq5uVgbVmzZo1a17VfPWrX5XH67Vc9sv/ddn3P0sh1GjZ3FAzKbSIuOE95dSwblqncFMYzRYGpRLVNxmZUZaJFDpQqMyEchULYUMl6IrMvIqeYWWgATefIfWGuG3fTRml1kJvvNPQa1UxqSIHapLW7V5CEIBjdTjFfKpuzWIIt97c6nMBhjhwYRh4r/En8CmuqqGSyHLJC7O7Uv98mBrtkHmUYrdT6ceASWrrCpNSi1AhTkHWdsM/vmYFfAQebBqkcMda6WAZPC07bMpU6nY8OzsqiByYhZ6PlZGBtJmSq5mVsCIEnmBN7JwUvun19qB6mdQ6+vl936h6Yfg5nj8zt4rZW3EAG9jH9q1fi0iLZPT9kWg5g311rJkriWBHZe5aLw/gsQYPEY+Wh1WorPN1NmVOvMtUAkBstkaevWYtdmwlJDTRddqY46T7qU3qq77a3Af2emylpFrLrZCIPPO9yWvsYLYr2Oq4lrr+aNLLZmVMXC+oo2rra9vhE9v5/PkiLcB30Iy5aHo8+rxWIlAA2XT2bOHstpTBsteYLxVzkMtlx+eQswWlXxC71M17JoHkdM9eLht+xijQs2B6U1QhV4vWVm8t9HIEh8TYr74e+v2F1s5pdC8nFjhc94vEnPG6+vktpXLN+Q+3bfvjbdvKL/7S315/sa1Zs2bNmlc3S4G1Zs2aNWte3bz96KP6+eef/8XtffydGON/cJ41JbTMRUAXBVL5tJvUwHwjWPxwI2tB6ajYpxokUzljOTemiEGtPXOtVD0RX4Qsi4OjOBrXTCXDm/moN9+lq0e8Vr/xphVwIDTa18bzqnpD86IS4YoqrxpvfEP0Y/f2uGH/q2yiU9jh6qBWI6x9OEvPBxKqQppBFkCXRMUQbFbC1rwgsUYpsRg0UCXOYYAJKjKopAg1aut2rZ5J5O1qUEbVDtk8zFyVLwoaXBkGaMZw8cRQfM8DghrMc4VC68cjE0jStYSyq1q2EtRsDgKrZV05gLRnGyqhVAPAy3kzJZCq6GZ25iqlwmsHq+AE8ACnCO98jSPzkrC+2CZRTk0Kq6MdMBKARq6fQ5w5zN2VPmFqs/ScKz0vKyQIVHSZUm9uvdQVTtVDrAwWRV6XWQXW88Z4/SxIvPXX8WPu5x0NHDm88mNNbkfV76/2/ikMo29WMcj1MxjWIpVb+jy09CqEU6gUJ4Vj/0+y/eXHOfn7Sai0KwS0averhEcOuvxa9uPFfuB1ndoaxe2j3N96fMftGQHvFj934j0Vw2hwxHLx/eZZXsUz+FjEEKmkrLQewso7FQT47jE1mq5Dtkse4nPO+bdSyt+9XC7LPrhmzZo1a17lLAXWmjVr1qx5dfPw7qN6uV6+l1L69X3bfqC3kwosLCw6mR0rWraO3pRGNqB1JVVrHT845PCMqw4VaAnrM9na3MrXoQMBjAMXH81cgmKptW4lMzDglsE25zqbzSpaaLmHjyeoMEb1v+WsmyULYegx3d1kdyjF8ZwntfNF3uCrUsWtlQql5iB0wBANw3fFGNvyXKXjmVsvB0Htmjjt5MehhgzQBHXKDBx6SPrUBtjhi8DC2NjCqOesVi2FgAhhn5v4HDi02gPI3WoGOKINdJpvNAdCUWmVqCTS0RwmKPGCZZbNkMoCz5nBRHWUWe4a1F8xMKMsMrsp2TrWMivKxnnOeyvwOByu1OYwyeyD2MtsH2y0K6YUe7g/rIBUZnlrZaNazV+/56wHqt5U6VbaXSsmjpnrlwhsCxs1fW9Amcd1FbfxRYN+UFURGPvzuvKsGYU1mBsM3oorklhOALjpwfds7fP31l2BgIzPdQA3gSl/D+i5P9+eTY3VLBetPyYm5qAZXI1U2wkzzGAL5HvAgGbkdUmEzwnnkDwfD2q1dGdfxBqc43mwp/B4e21kvfEaNg+yF8tzs7KIwDdCayGnb6e8fyNv8enN45sFsNasWbNmzaucpcBas2bNmjWvbj7++CP57vXx9m/id343bulP8nP65DkcyaCFVe43VWIdN6k3gw9oGQsWAI2QbZFuqzLwZMqdyBvJ5s18VFgJVVl6048A7rzbDedJpRaVNlBeMGhdv6+4pY436P1x/B9udo0awI7mii3c36eh7IEKJk05XXRCIRsrWlOgHksRV/gE5vWMm39TqdjjfBzqWdg7Q76LWSgVmqiq7SiWrISb7dpgy1KVGwCdK7yolOlZVcHCzz0bSeaAeIIqBzTdwuaZXw3kBI+rBIQFAfHDmjigG9Fgi7SxCdRpGpCO65Lt8+ftxsa9alleYtDIu+XMXrZ1y2id7F2muKt9b0D5RNACSBUstN2vlT+nX2NrAxztfIGB+lLs8x6EboAumIrOA/2rQbuUg9wAVWz/WSj+D4NEb5s05SCuANVVCeo1h1WpK7xSVxQiS477DjlZBGBuXQS8CiM4XWhnhYWPQEevkwLSWu08WhmqP2m2P2DZPSvBHfOk6mHrirZJA0aw8uL8x17R9wr2fLN8q551l6f/ZtsEdlA9/i2a0s9YEK2JUCtWJtBZ6yQuq9pqFcRKsufdwgQV7X1u1srU/+wQW5jX5jARcKy4GssOSzP6Zlusb3P92dSSZ2OZPRM5awmR93K5Xuu+bX+wbds3c97OX/jqV9ZfamvWrFmz5lXOUmCtWbNmzZpXN1/60lfk7ds3NV0ufxxS+k3J6cBte7BGPAg/mHME0KJNhGg3M4uZi6kAKibVlDWI1bscJHFE0uxmXL+uqiXNbdLvg8IrmiUqUfUlDj04lcoKV+ykOLKRHB7oDW+miiankafk+UD+N3plQLu159WumDq0JU0crIzA8Mh2Qoc1nm00VCORQG9Ywxxy4PXaPQDT8/XPuUrHM51EJsjWhq3Qz9/tg01sDZDv4/lkVKxYbpeBG22QhI5HG+8mW915lmmNA3Oz6t2/errajiBR1S8ZKqfYM7oSlTRlCvpWaCdEGwayJtUYwUpv8aMd0fPMZMq/KrSoqjrLc60cfLUgMnsUQw8mt8fo9+pesetgj8P1ra1fV7fFdRBKG+ymKqJo19HPJ2W1pJkaUb/uexvHFEZ4fJrhSh37ROGQXRuGsfuxEu4CtGmLY7D3QI6xK8q6uiuM3Kz+fuO6eClB8xD8OIX4p0Ql1pRD1hWMVI/F0F9jVvzlNNRR876HwvB2Qq0JhSGVZpbvlXq+WlcDopkwdnWcIC9PmJtXafelSDNp+HriXjClXErh7udBV2hh35Zul9TH5223M+B7Ll93fbM8xS3/Vrps33p8fHzZQblmzZo1a9a8mlkKrDVr1qxZ8yrno7dv6+Vy+d7T9v7XY4r/WQjhknIKmlPDwjy7OYUCo0E5tCFPyFrbVKFRXPWTRMpxmnqlNIATBHvn2HODOt+hGgR5Vs3a67ySH4CsWHi01/jHye7krW1nseDrSFuateFZ+LRbCh1MaZaPUBUiVCTFbp0zwGKNggbjIpsGA7OI9KASW81UIQOVj8yWSb1hLwRriYDAGxJNreK2xw7SPFgbajILs86eEebNdM2CxyV4kPvIEdPnuWngvnhTXPd19bBtiSOMqNvuYmB+kq2ff7/nUyHoPDLHia/j7Y0eGK7niCyrSgtnaAPoMEg9BeYcUWHkuUhVLItKIZArrcxOyObHGOSyXeT5eLb11HD3nKQdtj/c1hZiFwB1eITnytxbXA89Rz0nL+8zhaH0NXRIiM8yislDzz2HLRDXugoJ6zsHocuASY2ATGPc9F+Qbo9tbABUqBYjwWAcIMktdeK22Ol5A9V4Pnqtt0yQRdUg1qVZNlb0TLU2MsGM/E3Qjvve7Xu+Hh208ne0LgaHkQVrcLlcAJ/fPz8Z0HvIppYiHBY5+z723xUEahNgz8kLli+mz6vZajGEIQwsluvl6itdiaRQlJDUZ6y/5Wa5StQ/7wUB18u1bfv27S1tv5ZS/uLx+rjsg2vWrFmz5tXOUmCtWbNmzZpXOb/wK7+sbYS3fdv/ZU75j2LONdJ+E9jktWX7hTBlVWu4ckjzhFKWPW+SLSQZSiVk1tQBZ677dbT/iamtEPrNDKmYHCrVbkucFSH+PJEB7pF2LYcvwhv90sPK2brWaMcLdhObmJOj3wJ1lmbyZFNqjbY2S9CRWX1FpYznb+EY5B5cuAqn8CY6haFmme1Rfk5QoJ0W5u5qmOCtdBNYcXtXFeZmRbOAQenCBr5aRruiMJ/LM4E8F2u2HYqMTKy7c6DyxrOnPADfvjjA12wZ9DwpYVOdKqXMdZdhq0NuFq+pr4VQ+RYJWiJVQdmbHNUyWg48x8Nlt+dqL47dM9aYGZU9r8wVOmyhdEvivlkTnR4LQEkyNRLWrtQO/4KHxlOFWLiPQri31s0gyJdIrXP1ZNbV1ALZ15bH7Ndf5B6C+fX1MP+XWXCzGs4VbvragKm83miRVAunt/bJpKgieOv7cQph73l0rd0pDB2o2XU88Vq6Xmp71fW8Xq94rAJvPweWE94du9uHFYDhOPV68GcKAtlfZLfp/ut2UawlnycN+2WI0750tRdD3lvlzyBVkGmzYkolxvQHOadvbls+9sfL+gttzZo1a9a82lkKrDVr1qxZ82rn7Zs39Xvf//xPtsv+je0p/fullIec9Sb4hASr6A037GanKTEAsuz+V6GQqq5UbSXTjbkwgFrHoIFmZ1mQdoctgVa92hh4Xvrn/cY4ANb48wFT8SFsV+vRQAlwSW1o1fOrkgElBTEK4PQUPB/J/yeTiiM4mJDYnxs5SrAvZbuB14a9NCyDGttUU5XsoIOWqBomSPTiZt6Pf27Mm2EdwJXmZQWRTV+3md0R7YW0kkXaFiOtWaYSqwPKzKq1GfLpYhYFDqeBO7YLVqldhdPXT8Z/wkPeF8PufRw2FFoRw7YxvwkHJadbD5NBjcJr56DG2/aaWtv0OqNxjgok/bMYLG0FvYOW4+S5TjKAU/KwdRkZYJo3luKAIq7aqlNOWG33kMlzthwo6hoXwkFVxhUGiOs+mC12oQOqiHU0YdjYQ4MBhp4dFkT6fneAatd9ZIZ5jpu47dKthLMtl82cUCKqgu08xnvuYpAQz0l4hTD5KWvKw+NNPcXmRbcdut1U35u19py2rmrUdVEVWBO53U4D02JWyZfvrdGEiaujCE68E7MBXhK2TqAQqrkUe1A86jHZJnrXWjiBYbPkmvbRQLptjCr1Oaf49XTZ/2q77O0rX/7Z1/wjfc2aNWvWfOCzFFhr1qxZs+bVzvXtW7XXfD+n9PWU0meKYtKeccP+pBlCzCGKyP1hsDpvojVHSbOxNCxZaL2zFsMpa4l2QHGLlQdSI1vr7NbB3qTnEAOKj3HT7GOw6l5BgnQo3lT3zCa21eHzvf1vWKXuRlVZW5bLZZfLvo8b7zDO1bOuPJeo53s5j2O2FdrXzgHjZHqOQqtizyiScQ7Cm2670a9dBaPr2Wix1PPJDLfvzXxsnQtUTnmAerfGBc8GsmDvEMZzzsCgvYQjDnRoe1PoZQCkDkVPGHlffr2aAw9V67D9b2SfNbYQFirlCB3SBnAoU8ulPtdZDjxPq1OIPfOcfAptlm22ptKGFxjAX/l1z2pC2YBb/aa4KBdVuXIL+WS1DZus5jVNqjXxVkh9blUibhnvAWRkdVWY9Jyt6u2dBDK2JxOC3V1x51bTrkqS0BWLifAuEf753urgKTJTasq4cnjk9lBh/ltXBYo1A845cgmgOXBf2Zol5srZKVXscS8ysPdFuMvWcjBm/j7px6h743bcqEA8qQaznx3egKl7xRseFabPIMzsutLJYJwKFoSAXddfYWNFM6E2IaS/zJfr/7rv+/vrsg+uWbNmzZpXPkuBtWbNmjVrXu18+umn7Tvf+tbxg89/8Ns5b78fz/MnWmvZFS2eaaU3m1WS3TCa860rPqIM9VVhi57DAgUOCje8na9n61RvMTTo4K2DUPEoDDkLb5o3/K4gzI6njptvV65Uy8Lat63DLQdA4qHtBDn4WOqdRcutcHMgN5Q3zLNSKACbmqpMmkE5BVmV4OwsbIMjiDgPUw3lkEYWF0PCq9ED4cLdqXQcSKWYCV1MFROrKeH8Zn3bdjmebz1PqzEjC+okBT6+WamucosZbJOACWbvM5vYULJpcLj+q8fBhOYQec5UCgP+6eejmOrNgsu9ma72pkjkGPG4rCDS0IZfCwM6BU14HZxxLbwEIE3tfn4OZrHjHqBsDgpBBznMUeuh9g6FsJfiHeDMPWR/wC4BQGNmWZLxHArybgfsqOLW0MbctK4MlP61GbBuaZOjHFR+NbluVlJgEKfcPbbvVy0ziHk6f+7FQmXaZBv1dUE4fmw9SN5BIRRKbaicZsUfFINU7fXwfT3xVmn5M2WVlwfgscdQX5nyKeLnBIoIe36XHedUddltitpwqTlgaENUtR7glu0Pv276GuJKTrUpHqdd32jKKhQ1hMicN8It5l+hwVAst25L+dxT/lfXbfvmtm3Hmzdv119ma9asWbPmVc9SYK1Zs2bNmlc7f+srX5a3D4912/KfxpS+HkJ4yiE0AAfYuoQ39dJv+CVaK5+2faEhLFsTGW6ieUOtN+dQ4ZQCMNLtRf63aiXkaANG4fvavUAiEICEMOxNHUy5eotwQrO4rG0tjJvr6Qa3q0E8I4qqKv3d1VH4vnhvZzIIlWCNU/WIHzNUNpFqKFohPQBdPNOLMA04iiDH8rSHcmbON9LXdRWW5TGlDg+Q+aTn+CLTyuEVmusA2di05xbAVu/AXq0OXKKtF6FB8WykKHeAz4LBE4HYyL+ar1G3gEWzfzVmjen35jwaIV0V5ucXmJkWA0FNSICWL8O6R2NgpSqre0vNMqZg5SxUplFhRTumB+KL4xRa/tz654H+jlsa97u/dmXTJnLfCFq6kooNgOft4PVu4xftf41h5YFgCTAr2LWa9zTypM6z70Nfq8w8OoSgRysFgNIobYCZwYPLm7AhcbRY+jlYoYJlv6ml1nPDZsvpD7/vLLjdM8+Q/8bsMVfBOYjU97leS38/9Uj2ziZb3+vY/5WFDfyZ4fsMBQ2nPR/y3g4WOkQ7fuztWruCDe8VV2r6+7uZYuySt5ZietpT/vU95+887Jf25S/9zfWX2Zo1a9asedWzANaaNWvWrHnV89Hbt+3hev3iYdu+ds35L0MIxj9UGSWsvFeFzr7hRlKVV1HilG1jTX+4uZbxN6c36J0jyKoroebcmh4eTciy532yyhU0nqHJj6HlDotw85vsRt6tSbiZ9hDrGDoIkLktzlUtbjkDNEnDitWGKsthwkmLHFROrXUokWABYxB8MzCkSixrRJusj9Hsf3jsdO7I/D4N4rzMZbJjc0BHMKdWsGqgwEDCCM4e3xd71pfb92bV2mxr9ND6DgiDZV11EBEt0B02QVoCodqhugfnNQGTSAsXbIpzEDmBWlfBMcBeCHTcxobrrFo/V/a0EfzukfRSR8i/K6scJmE/qMLJAttQLGD7jUHxVFQNu56vyQTMhPlQGkRP66Ouwbt372AVnB/r06iQExlA0tRSRZ6fn03xxvcU9i5VXuMJqNZS+9uWerugqfLseqBo4PRjrz0Q3ps8Z6jYn7aOvTqssdGsl1CuWSh89LZQKtD8ezvUdBUdFZP+mv44XFNeQwVZvnf6/g8G4O5G2xQ1Oy2aPVKYO4YroIqzNuywG4LfN4Pn3Bu+rWYVVkNwu/5MSPpzpOUQ/3zP+7942B/ev318u+yDa9asWbPm1c8CWGvWrFmz5lXP3/2H/6Bd3nx0ti19M+77vwohwhvobXoV4d9VQq2mBmHroDAUmhnm9nsbeUWmVhmwCvfrqigJBhVgPZsa8XzOeuBmVZUiCq/0Rtuzozq8EmZaNcvVERkWQQU8ULLgualqkntYILQnRYaym3VJOoxB1s4EoHBjzKyfLY+crlkZFnuIUpPLRTORNsAsff495w6PPMwewewIF7d8In29y34BTGh8bGEmkgOR5+cDYfUd7BDa6PMdJ6FSilMGUrWw9ik4vIfLC8PnxYLOZ9hkrYO5N+NFfOzra5Yu2AfzNr6H5+5/Bm+jBUyGGGeAz2o5WIB4BJTID+NhnO3syp2glrPYrAzA7YQyoKjDEoVUUKLxOmYeHxRM+y6bZipNwA3gFTY/29MJa0nQSlUaMslE5P37LwzuDHlWB2CR9kCDUnZsvnb9nGUEbR2HKbZGdH7peyO4qi3ax7bfWm8DtHXPfQ/OA0VUrXeFCp47VgmS23nCFpwZsB/q1ATYLPwNj1GlHqGxq5piP5dhk+xQV22D3iRKyAnI68dK4TxXQwAAIABJREFUsOx7EOfKfLaRk2b79YLm0GTqNwWIen1gZTWJoCskT16/RIAZuH56rKG285r339tS/j+3bSs//4tfXn+RrVmzZs2aVz8LYK1Zs2bNmlc/n3z8cX24Xr8dU/yaiHxuQo1oNh/BHaG1wYnlYqnxqPR8HuYbGYkwpQ6hkFnFJrjhUIUQoDetTcHVCke0mt9tWwA6sCqNm3LkbDGjqsES19jWljpoGjfxzRRMMmUXAf64x65YvhSthAAAbG+bA6LthdUSt+NYbrcDAKGDgSZdLXQiN6n2rwOytVkRM/6F0XAD7sqkswetO1yalTqq4HKAAPhVfoRqqwOeBtWctwc2turdqdIIHhQU+rQZKtJSqEAAQMED8Zl9pedX3NZFiOPPe5apSU9svXtIeo60arYe/g0QxWPzLLUY4gR/Ir5uKrbYFTrSYSlD3Sd11amqPL2eUrnm4591Hm4PSMImRm9VbLQNmjU1wZ6o+9Jyq+pQD4p05Zcv11g6g3S4ZnVSo7nirdv8Yg9LrzzXxlZJ/VrDeZz43HbZAbSiq+vqCF/XvZJ5Tj0XywPWqZQyVZcds6+ZZ3nF6bh8TTPhk17HMgFQD/KHPTgMdRf2BFRQ/L5WaBMtCOU3hR+Vj3Gcc0XTYRmKQX3vK/jdMn4GGJQrVIhpocCwFuInlCrJomVf2fs+tJTTU0zymyHH716ul/HDY82aNWvWrHnFs0Lc16xZs2bNq5+3b9626/X6tP3gi9840vEnIaZPQi1Jwc71erFsGtqOULtfpxwgZgzB5NQsRNkUPZVh4XFYtRAqnbpNqQ9vwlWRk5JZBz3fHPfXtHGpOsMVMfO4JQ2qkhi7OkccVOgxO2AjbFElmKvHxsNN+VJfqEW8mU2VKUVO3GR362DRGO9i4EAGLIDyybOMpla4EPzGW3OG1Lcl3XI1Z4B5XpWDuxjNLqmKFl2fo56aad2hlmdIARqotU82y7tyu6ReE4Srt2FfhLqO9j5XZuG5mLUUTe3iMDC0oWU72UjYVUet9rWufGyYW+J6QLnbv+xa5caGRg337iqvYkojbZNrBWo1Df4G3DqrhaW/yEtD3lbKaMbU10nTY/R6IL+sEh7WsQ7Yp3ahmQnlAftt2jt1KMhe7L3oBQG1Sw9x7lAOKnDbzALowAmKqjy+t7W5OXI0W8Zs1+DpqYw2SfzOsgC2+KVsnyvlkKbqRr5/cG2jWfscGpr1tgIetTC1WvJX4j57vt0Aj/S9fyp8UsVdGLA18P1tAfcNCrc2tTLieqDhsOB6wYJMwFxD6fujUcXpz51xvbXlsFlmF4Bc6uuq1QlnM+iVhCHzwd5L0X8U4dpL2/ftW9u2/eZl395fLtf1l9iaNWvWrPkgZimw1qxZs2bNq59f/Hu/KG+vb0oK8Y/zFn/zct1vHsbe1SJqJZqgwBxoLQwg1+waKH7aAELCG/PeQFgK1DkH291cEWWtZQJoARgRU6/X769H1UsPgGd2kN4Rq7XObXRCCDPDFoCms9KWle01mafUGGjtqqsww4/WhpWMoEGhxOP1wRr9xFQjA/7wRXurHs+P7XKRrWv+WqZWI/xSmENroVvjkEkVhj1SRIaSJYb+elCxKLw5jcq50kW60sfUb24l9CkET2aHtPwhve632w3Ko/l0VA2TCCh7NhJD/V05JK648gwqD813FVCtve2vFlPTID/M2wYJdox3sq2SFk8hGNLjKrSV9vwy5GlRmcNrqOfieyDCKpn7cfUssynXDMcrBrhqdWXQAIjDWnivfPP9g0ZKEdm3XTLXStgE6NlvBv7MrtjVcQ77ZMBMD3FH7lWx66bfq5lhUDOxkMAyrRwwVvzyzLGCMoGjFwL4cSgoAojiLz9n30cK2fQZn59vvZgB9s46QT9vOewAjsrKOhR5jWsVuE/8cwB8bSj0HF7pms1ZYnosCuoKrJum+pzVa4CevAKlDgtniKGkFP+Pfb/84eWyn9u2/jm/Zs2aNWs+jFl/461Zs2bNmg9i3r37SMPcP7uk/M/eXK+fbTk3q+u3Vjbc9JNXBcMB4uV+PVdKDDCU6uDBw7MTVTMiB6xAVRhng7EQ88IcHdrZusXPfnMlVKQSS/pNbrPHRm/wEyqCTPnktrbCwGuFBgoYPDdJzyNNoe9z4LWwxc8ztUbeVbL2PyqGcDxhauSLTIN3q2SxjCd8X8o900qYt+XP6zYqe1KB4qo392lGVDnkeL7RYpVtvQ9TaeFcCwO0g4V+G0Dj6xht6tcJ4EIhSjLrmVv5KoO0tQ3Qm+JcGTRbKvv6Ja4fvrcxC2rY1LBTXKnn30MYZNBtBJxHB2Eegj6pmvz3wID5yI+bB89T4Qd44pY2KpcAiqCSojrNX3+CnR3E8pq69U5hWXOrpivKqkNbthQW29NShzpQwRiAX7T1SdEhnl+PCOuivhFMRORqNUJVgr6UrdmyEtxZsQEzpsKAVroiBRbeuT0yDEgkvt+CgaKUxh739yDfm2gcnHLechoA1cBV7bl2niUGoDRdYxxfa3cg1a7JpKqKgUUACcfk1yUQ6vKJpJXSzyv259LHWutiDrFfwhxj2+L2nHL+rcv18u2HhzftSz/3t9ZfYmvWrFmz5oOYBbDWrFmzZs0HMR9/8kl7++6jI1/23y61/n4IsVyvV9n2S89acmsgblYJSjy/yPNrCmGKq4NCyj1U2xUzKU3qIGYFeetaD8N29UskTAADSbJtuwELKn88t8ohhWdEeeYVbszVxqT2RrUNiquAHMiYPdBzo5DL1CFP6CoZByqq9NKsqgKQcOAfCpFB4Ilh4F1xNtm0JBpECG2ALbP93ZvSFIZ5O2JXTrkahwH2HsIOaMRztRv/0BsRPVC7Q7VsMBHH04PsrTnwrENdptciwz52BeiLtBGGCT7FMOAHAMZsF+yn5pZE5qV59pefZxy/QDODhYhltgaiUTDnHrDuyi0HMq7Waq6Og4U0y/XhAfurEbjECWYhM94hz5QB5Xu652ohtD510BYmFdmcMyZUJuqgfXHLeMxxHuN9EoZyTt8HG3OlYLmcYenUXhj4fGOtouyX3eyiMuCgMPcLljq+Rwrtg9baON5jiqQSmwQdhPl70q2hUEKpqrCa8lJD8BGyzmurr3EyJ0z3ugMyA1gGp/R6eTGBT5WROefB7fpYV4EJVZXHMQBuc2smGwpt/ca+0+/T9dC9iXVNu+/TlnP+9p73b1y2y3sFWOtvsDVr1qxZ86HMAlhr1qxZs+aDmL/9S1+Vt+/elbzvf5q27Z9v18sXkpISg95SZzY7s125xc2b+HqQM5U9sCwxhNwgy2gkTIRPrq6yyHNvp/NQdAMAaD9Lqef+dEVRaKzgN9VKtzURUI1GNsuS0swj/NIWvXJ0RVWj8kt4M++ZQcmfO1C9xIFtsDXY1dSyGGgJbHOeUVeCEeREBpJDRTUCqKGacStbGFbCSJtelSlQ3X9jdlWj/REB9d4WySZIDRz3HCiFEG2CXK5yac3XmetVLSjf7Wu6Rm4Tc8WVh2vnZMcuVOk4dFBIZpRHOhA8J7udq5csKJ8B5rpH9NDRQmewJ1O5J65KowX0uB2myKltqLI8vF2D1s8DgMXD5oV7VHOcbgh0HxleaVb5TNlWbbLSCYsEEte4zY8jOPLzcrWhgzzPfmvMXTt7MLs9R2F4vFG1kbcWCN8UtqY4Qvz3y8VaH6HkC3192rS+AKjVrZps72xsGgyhB67fTisg0F8nr7Hu9cTQfFdIAYb5+3EKvve8LkAsB7QKfwn9XJnZJnnmXdtocEtl7KDXmwtt8Q1gtx4Qz/06Zed5MYR+Hpcs+N7MJeX0B9u2fXPbtmPbtvUX2Jo1a9as+WBmAaw1a9asWfPBzMef/ljbH68/yPv2T7ec/0TvEHFjnnPPWMJNeLTq+ujWpK6aIOjomVHWcFdgwatDHeWKnjjZDCdVif/ebWQdCjU0y+mXAS30eKKpnBSeqGrFoUSl+sYsUxsek3OabH7eghY6jEGukN4I82a/ML9Knzsysyjlkbl03TcL5W4i53lA1ZKZdeRQwUKzHRrdB12bUqreNdSJDFgEuxjth43NfG2y73kOla+XHqdChU2VQAye1zXK0drocE4O7sQUdZ6LFOMEUeYcombXwNU8xdV4od0Bjm4LawMC9cwroUVOjyPnAS76Cd+Hvfte8vVzW2NI6U6R43bDbjmEcs+KBkQ8CiqaqsiVb7RfelNeX/tqzYkOZDS4XAfKOsKrMB1vf/4UGXpvsK5OFkaZmhlV9aTw8mS+mR5TYCC5zLlr5trFYwtBaOrvh7Nfe2/vEyrCqlgQvloO0fI4KcYsF2puPiTs0uvgZQzRsrQcbBYo5wwKR55rnVsWaZeE6mrLhK8MWE+p2w4T87ZGoH5ly+JYo3C3B4YNMUz5d/PSb5mvxbZPQGh9f+TY8ra9zzl/fdu2v9q23L70cz8ja9asWbNmzYcyC2CtWbNmzZoPZn75l39Z3rz56NzT9oc5xq9Lbc96A6tgKPRA5gBo4/fayW86Z6VSd0U15EfVxvp+hUWV9qlmzWSuDBICK1icGJyuT1SomnFo5AoocfuYNrtpOx+siqGrYVgtZ+oZ5h7l3uQ23RBDHdWGtAavkXFjXNjiBwBEQJam51J7ZAsjP8pzk9xC6cHZ3kbo4+osV4qZ6qn2Y/cGQqiPyn02U3DrY5D+Gv3rfN5EO2O3QwYDCyGajU/BmAOOxBwsa3Iba6xWzY0wJ0wKNFOwnXK7WRtjK62DhMkUauDS1Ts9uDwDJioUChOE6kHxhDIK2RIb5mA5RRi87buHy6XbUPOkoHIQV2nbU+WZeHB9LeOxUIEVef/+vfzgiy8I8SK2S/SmRO433btnHflLM2Y0eJV6qLl/7u5jVyWmJPu+QVGVmRkmtMF5O2cHfbofHCQpPIr29aKqujk4vhhYynodATdtb2h2WWwG5Cz/K/Zr0Ailkl9nWvXwtNXsrXWyFXpouyq/9n3v3+fr6nl1lqeWqeSbzh3NmvaawqB3WG+LWXDx3K5a67bbNtRVgdlobuUNZh2OgG+h58oFZuzFmNu273++X67//OF6/eLh8rDsg2vWrFmz5oOavC73mjVr1qz5kObHf/zH2w8++953n56f/6eY4n8azvDv6L3uZdM8Is1LahZsrTfZavtpkwpGM4zCSN7xtjyh2kiG+Giyy1nboX1Sevi6g51IaIJ7Z1qXhBnpDnI8OttBg9n2xnO5VszAiOX2xOCNaJWQrHULIcLeYefarAkvWH7W6XY5BxP8ONFiWZinFBhqrkcWeYzdihfiaCX07CpfMXqvcJMOy2OUlloHSS3d/3c1BMkjs8jsd/r9apWD2izGnj1V64BEtZnVyyFKm3Kk8DWFObRyhRe5Q8M/xwY8Kur82PXxCpdKa/1Sz+qZSBVRaW2EcTP820GO9LyqgP3lrX36vLBuau4YFGNZjuPWmzG7ZU+/XwPSYQ0Vud0OqKqCKp6C7dOD+U+wl/m1nICaEIg95Av+rMeg1kS9Dm558/ysbiN8Abi6amoKig9QItFOKJUNlLa3/HU6Z/O8KN/XUzGCH6cfi3Tgq4qxIAch4r5p22YcjYGaF8XjQ1i7riuaNC3DStdcIZVlYJnaL3pAfkpyqpLS1X7Bn7f0JtB5ALVcvTfZa/U5ei5ct+3a+6Y3Per65QyAq0dZaZNMsE3a+wp2Sn3PAl5bqcSWtyNv+V+mlP5g3/dToduaNWvWrFnzIc0CWGvWrFmz5oOaTz591/78zy+3/fPtXzxu++98cZ4/2VrZUxCGrzcEmXdLIC1Iqp7SUPOcr/2GNciwu9kNNhUeYFlU5USzlCXa62Dpigye9oa+Saaj6CC7/Q83uMz4iUOBBBBUTMEh7jhrASHWeoxQ26iaKiRkPUF9ovZAiVSWKIDQb21SGAaeZDT6OZJREBLQgqaKrRMgYQYMQsiEj6cb/JwsON1VKSGyMY7HrFDgrMNa5jlZbhec4ZN4QLg+jqBH16jQdultiLj5Ry6ZwTkDWVmiAp12AiICJFndYIeBMgE7a5/zQH7pwfL9XKFmyrIp2HEwQcWXh/MXz2yKZu07qD5yC1okAEvFFFwKjrzxEWtxKyJbkIRw/iJhy31NSn8NhU2b3MrNSgWqbl6ZbGwW1L6F3K9nwLpJP0YLL5f+dV9vNCWWarzG9/gE4+qLsHphyD1ATow9z0v3gMMgVfJF/0dnh132R6zBcVqoPXOvDMaNtr8yrSFstQy7b6yPDPElXuOxWoWBOH/CNY1qDZ3VgkVuZ+kgLRG23dv6hkXWB+sH+HR0e6mDRpkspG4R9vW1sgVTv2Gtmx1fOStKBbjTetuoN3SGFNq2bd/LMX9t2/bvXK+P9b/+hdU+uGbNmjVrPqxZFsI1a9asWfNBzc99+efl04/e1cv18hf7df8nMaTvV4bxQBfVrGkwMR9oyztsS3nbZd8vo8ntxUQPfW9mEfIb/1PVMLxph7ImjZvtJq5ekQkUIJXaLH6NgUEMDkLjmypcigezN4AowWOLPS6O8G6ogc7S4VqBmkR6xtbZA+Vbt0+iyY+5SFEIHJgT1HPBqLrJyApLUIckMSui3/bjfBwyNQvbdmWPvhaAkjfvTVlTeD22MApUOwwt9zWa8rHCpAI62ZqoL3MyW0sAAHmOtFb2EHLazhzIKLxUgKAWQGuYnDKzeFxopDsPWAzLBNYMdFUo2JKH3hM0+XimUpsAEP48faz5W2aVtO9F9pNCxBeZWR6SLrxeAKRpqH7UkpimwHWnRTGM87Ln4nWZFFreyClTo16/LrS7GUy1PWPh+t60yYZAKsx8Qit9zzgY8/B3A5T8/hfwSuGSr3Ps+WUG43Rtijd58ngBwyaYWP3rvndpJ5zhlIfwH7T82YLY+w/lBJHpWKGKTI2afr1xDLrfWqUdMfV/XLfJOjlbZxVaIkcrJnn7+AZf3/atw6yUxxro7/v1ImFL9ajlj0KK33h8eHh6ePNm/cW1Zs2aNWs+uFkAa82aNWvWfHDz6SeftOv18v66X34t7+n3lT/sUIm4pa+igU/cAlROWLYMnoRhwwrjz64msjyj2O1Cs3rFIZV+bc/Zsqf0eyYopDf0t8OD4Rm4HlNXhI3XSAy3lknBFCyDyAFDo00xjeB3IaxoE4ibb5Zrm5oBeQ49mygEAxBzUDuCu8/usNLX7kHuqkKigkh4Ln252EYnvLkHgPFjckvYbN+sMzh0+2boUEVeZjjFCHudgrLAdbkLKee1if3PA/qkEO4hkz+/w4oZuMXU1VWF+VYd7tQp96tazlPPzQp2jJkB4Qp+zmnPRf8+D3Knhc6b+9COSEWfPvYkvPPQc4SzUwXWARlhT3DA6J+bXrM3DsaRZfVyr8wh+EJlGqBZTn3/9+D9YDlvJ3OhxgUaeyxzLzv08zX3c/YsqYS1tpw2f38NC+8Iu/fvnwFeoB21WwYRZH/Iqc2PzPFKnsflKjW+93igLGcwEAzYxHbDQrVcm9alsl3yh9aMLNCgV5On5xuLAzybLEGRltjYqNeVtsOnEMKvbfvlj/eHh/Kln/9ZWbNmzZo1az60WQBrzZo1a9Z8cPMLv/L35fHhoTw8PvzRvm2/uqX0fstbiwxmTt6qV91C+KJVzm9KY7i3U9Hi1lUrUxvZbEECtFJgFtNQFHHadOOOm2pk4dRuTfObc28kbIRegeDEFU8ywYhu+6ue3TQA291rUzGiypf68vOEHf7nxlyiwteH2oXB5sj8qnUCTgbZKiGWru8OpVfqMClOUK0SZJwemj0rakqh8ketX6dBn/BCMdXVNgY0Zptg965NjwWYgrLqwO+uymn9OlsQ+qxeCv35T3scA8X9+KvDF5nsbMnAZaQ1EVDPv29SGQE4EpwM5U69U6o1b+jLDP2PqSvgXCiEcHvmlN1Z4qZj9TXxPYImSle/QdVW7sAgPta1iab+Sls2Fdi8/twTY7m5r3pY+f06ygR7WzEloavtkq+zB6tPiqx5b/X3Vh4WQG+n7HufmVaVx6c5VH5Oj4+PY3+8GLObVubi2TWLbBY1aBdxHTRfS3/hfR3inYKt9mud1A7Yr+tZDr4XLShec8gUama+v5+fnvVxdb9cv3XZ9199fLx+fr1eV3j7mjVr1qz5IGcBrDVr1qxZ80HOpz/1k+3x7dvPL5fL19Jl/9Omd4l6kykiqsZ6uOySouZhPdOeJz1seZ7ZolUn5UZi89usesoeLg6AcdIiRaVUGODMAIbdfAfP1+JrKyQyZY90JUnlY6BwcbAW4oA4ftM/haTrjXSews59AJUkDlUTz7cSUlWqfkIbiqDUWxwJBmK4szLKZD90sGYNg4RJBG+RwKYHl3tg/NziVl31k3rjYpxsfj0HChlYBhb4CXxPJrwJ87Xr59emTLPaIVHiL4Cuau11bhOEnZPH6ddvDpSHWqvYmmxb7iqgQHACBVS01sGuZAppKKK4Zg7jkMV2nPe5VKfZJ3tGVqNKqPJ7ZvvglDtWp/MLBIjnZLustNNqJpb0eHG2LjZTn21ozEvSXijg6qQ2ckC2TdY4h0hdVeiAl2o1KxTwJzNwCaBWS/98m5Ru/jx39ldvIJwA7EEAJ1S96TXRc//eZ9/D1+oEmYXQTADzDCJXqqSEYAv5cd3KaVls876fVZo4vuzKNj9/oW2Xys1gWXYKUTUTLMNa2Mq2b3+Qtvy7Dw+Pt7dv3q6/tNasWbNmzQc5C2CtWbNmzZoPcv7Bf/PftneffHJs14f//bo/fOOs581sa9VuRLeICnuv3U/dqtbuGtmgWOn1+M2ghIddTzeypbYh7pha1eIEkFylkSfFlFvIXKWSmXUEOEFgEQnIQhp2J1d1yHT890HUBsEs4br2pkRjSiNXKExqJVdzKWQBEHA1lCvDYhjKrVp7XlajXcrPva+KK6Sm4HPEbpfaQ9f7Wkx2NV2zLeV+PK6W8gUGqKNKLeetf9yXv7OfYb205xoqIlctIesI6iGDZomWzMzX9l/BlToEKXguZkPhmJO3KRbAGZmAIlRcdQTkI7y/nv0YPfw9pHgH6LIDszgUVj2Iv03KJ896mtRseu28rRHtgROUC82Cy3Wv7dvWM5ma20+rgbvKlsrWRqujMP/KbaPFM8YIdF3RmAG+xvkEKh/rZMPUx7iFD9CU1wMgqpR+/Vy5tlGtKPz/6i2KL+yRrlpM3K+mdEx37w9VQ/lbM8V7S2SjIqvbOZvn1JmSzs7B1nsuRrDuheZv9r7X7P1j+WMOpwPti9fLpe3b9n5L+Z89XB7+6nK5tJ/58t9cf2mtWbNmzZoPchbAWrNmzZo1H+xc3z62/fHynbSnf1JD+zc1tHYWM3PhBj0U2Td09wEAmC2JVffKW1pkb6ACjYwcJQwVL2EGL7wB9htYy6EajqVhDxxWNVNwnR0+qYJFCDnQmOZthWJZQiO0esoBmm7IE3ONZhWLwzS/qVcVyunAqda7RjXNkTJIIF0x5eoY/9ywKY5zdVhXXAnTxuNcbebjAK0DhcliOecaHadlF92VOE6NkQqQFF4B8rgKh+vjSquujHEwJrHbRoXWwUhoImzoQz7UtqNZLzFPyXLGzI42wOY4JwdTgba8OxUfwVAjDPV1ivwnWs96osLLigAG+Ol2tlmlNkGu4Fa1s6D5rivLplHVVeP6ZW8njEOF122UHuxO26Ipn2w9GyFkVyMRjPprpWStmPp4z/3KhJB9P6miS219VDoFAL4qT7dbh3RQj52mLitocDQF4AyZFG7FyUbqYe+zBZeLC5VTnPY3vv/5Rjjne8rer7b+zDwLqe83H2v4LP39ANUYQGTrMLkh68z6ESWOzLXWazwNKF60OCJlySG2S97//JK333i8XL+4Xh+XfXDNmjVr1nywswDWmjVr1qz5YOfTT3+ivXv78fP1+vCbIcbfbSGcqr6q5yFZb8TdopZU8RPQ+GfqHbORFbSQnWgsc1WPWcDCvTqK7WkOcuxmPFFpkQx20IokU7B2ZB6WK1dOt3J5CHU5AajmwHgDJ/HuJv2lTdCn0b4Ie+OW2YxGQEYF1KxK8eP36bfcrm7R8G5CnjYpu+6ysHhz/zL7yyfymOeP3eqXCI98jepkGXR73AB3IyhbXgaR+3MT+iRCLrfO+dcVVur1RG4V4ZZQlebHGflaDgrVzhcmK6jCnkjw6cHsXeE1gzuck2VOhekaz2sHgMpQfP1enH8QQlW5e34PieeTcB/Ge5sjgWmME/TinmwoLmgdsN0F8HPNDFTZ9/s5O/BxhdWcR9b4NYU4DqTuFIjavIiMKGvyc1Cl0NRBUyLAc7tlpNLKs7akQ7/7f+JW7sWe1ZXsfRcYwu52vsu2y3bZuwpMRO5grwfoV6roHC6bwtKeLyVT/2k2lgNf5V32K5roURqA9MO2sziiwL4MWJZYalAB+255y99IKX3z7Zs359/56ld+5PtmzZo1a9as+RBmAaw1a9asWfPBzpe//GV59+5dfbg+/GneL//DHtL3LtvW9AZWb1b15jPiZp6ohtk61hBmkGAEswsgV6ZdrQeS99wg+zhRvXEXoM4sJZla1fzzMqu3eAM+ww1vBaxTaDZQzKSIKQwbB1yIrPnv1idCrhe5PUJQM4MfITQTgjqoZ6asK/39sl+wBtmbBe1I73KKZFqPl69xEiZ4ELz+UyV5kx5UYWZb86a8OIGTnqfVYQwh2qQ4AviA8iXd2Q5xLV8AOlPHGKTxFkhxpc30OKiR+BkHmB7svsGKZt9fvRWStr0YR76WK708g0nX+ca8s+b2Utgh813OFpRaMVLNE+/W0i2RvYUvp67i2phb1niOIx8rwRLoe7vDS1r6RmujnYMB0tSVcHp8psTz6yfTcdnHUEOV2p+j53M5xOLx6p/LBChVUadKLld4eZZXVwC2wkwpt3amDpgiM+VaD1MPPXutZ2JBqXb0YH1db1gYafHr177njDVaH18UCFByVOtyAAAgAElEQVSN5+ft+x37I9nPDoXjO+GWjlldA5pQXTGouzfG+Bfbtv2P1+vlO4+PK7x9zZo1a9Z82LMA1po1a9as+aDn3bt37eHx4Ys3b978z9fr9X/bUr7lQPCgN6u3J4l68w7IYKAKv2IatqV+gxv6ja7e7O9UNQkhliuxLIz96I81qyDhiwjAGRQsIdy1/7lqyVVJrvopDOsWftWtjA5aZgAFiMB8nR6cTXBSJ1UVbvYnC9nL+aHPTQH33UZIEDE0TSOX6WCjXnsB5HoWV2+PK3e5RifBx5ZMZdMzyF4owbAusIFVU+xMzZInnrMAuVCwxjywZhABLXEK0w7tf8QvPCYKVDX659ZO+6XZZ0YE8cuCws8O0hREndVsmX0NgnTrXc9LC0MZ1WhB7Va8KY8suO/Ug9d5DRNhVG915D5wK13kc3VFmpcA1NK/34Gafu/z82HgTK8Hv+dg5lXoWVAVQBHQSfetZ3r5HmLGll9DAzoDAnW1XIgyHfpdVpwQOvZA/HretUj6FLevvlCsRQCvjPdU6OBr2HALYajnWd0Os1nKdHx1Ohaf1EP7k2PEofCbVIu6NnNDY+H71EL5Ta2HRlIo/AJUWIlv6i2mL3KK/3RP8evXh+vzdV8Aa82aNWvWfNizANaaNWvWrPmg5+/9/V+Rj999XN48PPzRtu//fSv1j5KE09vdYClS+5JCLL1Jnq1UgU2BVPQIYVPxVjrm2PTgZwIUtYqdtd7dFOtNtDfD2Q2vPU9hZpLajTbW/kNNQ1CA18kWLh5mtYnChFYJaYKHRPXPhVDxOYV0lolVkfXV/OuJCqFo2hrkUim78efhL4V50UyUDCg/LMC6sTFObVDJ4IiG3CdaqFr19j6zf1m+lFrkUn9tSsWwzluOHpGN17SpOA99DlNIWTB3JJjKADx2nIEACkfaCtfVINK4nvcgDAHuJwPXp+wjUym1DiNkgheJAEyohHMsqK9dW+nrW3kcWEc9/lDxfQBkwSxu+2Xrx6yPKe0ETNNzg5InGEgrxUCbQrlE+KYf69cgkkpsv0tmb+vALZptshDEST/a2hVKAImwQIaec9UVfLo+bOcLuHb7CFVnLpgH+7tVdgZUev6zonD+Z6kHnntxQezqv4j3m7+vHCLr9TymLLa5MdSLB3oulu7T4xxfdxXdpNTDcReDc21WK86KMFek8fGN+76a9Y/vxXQHVT3gPzCzzgAhc9iQ27brWukTfRFT/I2HfP3v3l7e/MXbxzf1K7/08x/6j+s1a9asWfOBT/7QF2DNmjVr1qz5yU8/bX/57W+9L8fxtVjOf1RL/dIX79//e3mPew0Snp+e5FQ4kgLVMn7j2hQZ9Bwk1aGkMELMRyNd6vY2WI7wRW/XM/WK3mAP1cbJTB2GhgPoZLkdN6qNFHJUuzF3VQ1Dse2w6lDidJVWQQYSqQfcXW6tC1ObXTYtCfOxzMKnr28WKIMmic+tr3uyNU38BlzVMhpUXa3RUWjlC8wN03bHhqZHt9BF9rd5E90G0IMmwrlBTq1p7dSD9sX1+PXRgkc4omtla1kkigM4YKR+3V6Gw4/f2wSjrDnQFDX+aKrBqsO+ND2PgS4FWwpUkCmmcJFZUWpPG4CybxKu633emLkfRzPh2FJjT1lb4QsAV00h5S2RBlL9GOz5j+MwMJSzqcDYgmjPb7lqagUFwPGGS1VzRd8vobcCzkdn6rlKC63tbZlaAgtzpiLzwEobx92avx/kTkV111JYff09480wrlpJvWTBQfHLNdMXc+WVBqu7kk/fdwaW2ZqZItVoWapMOVdxvF7y1++ZX7qv8t1xe16e7uUOt6qF5OeQZEtbV2HtOTcNos8p1S3G86z1uw8P11+9XK7/6N27t7/z8ccfHT/xyadLfbVmzZo1az74+dEJqmvWrFmzZs1f02nt3+4+71f+7i+Fz/7qW+n5e5/9xOff/8F/8sXx/J8fz8//4fe/+MG7Wut2K2coramUwixD0XNu2KQnqthQoDVZj+rJxzBXqBLIeHsgAYEwZFpgPUz8nngHOvSxz7ebbPveGwyFyiAFWwod0I7X87ccLLUR1j7ddJdJcWINh9nAQooAEap2aQphcpZtt6yeE+AjseXQPtbHRbTJGYyKBFjeYlgnXY1CuRQZeB0DlG3CwPvoMKAHcFezRXIN9NhM1cWGx/sIsenjIJfrRRQ6Pj3d5PHxEZDi9vx0p3hTeKOGTbXWwcrl/yRKEaorz9lqE2ThihtgJBz6UYCp0e6GvCa1rjGY2+yTplTDeiLjylRpOVtWlsKk6L5GhTM5s0Xw7M9rCrutgzudbdus3Q6WNfLSarosvTb6dbQ3HgbRAEb1NdUaeDuknGe3u+r11GNM/N33a/HmR29V5HWy/W7XR1s8E21xuk4Hc9sUbDo0UtCq1+Q8bh1G2fu24nm8YVImeKSfx7oxx23e53d5bt7MGAdYnN8PeJ5y9tys5OvuVkqqxABGa2EpQe7vC/FMujDUWCENm2zsRQ3RGhhj495VqNkAunVPbgF6wppDPGOOt3a2z1KO3wop/euU8tc+/bEf+18+fvfRn3z66afPP/3jP1V/9pf/jvzbzI+y/65Zs2bNmjV/XWcpsNasWbNmzRoR+Xd/+qfbRUL5fqt/VWv9x+FJfrtd9v/4o3cf/Y3n2+0/enp+/qmn47g8lRKr2sqSEHqMgHXYhzqwarh5N/sfg9qrQZm8NQQ4156fNRoLRzZQ66AB0EfBBRRBFcHy4vDMw6xLlcYbf4Vgt9tBa6GprhQWKWxSIIBMpqPgBl3BBlRC0ULNFcJBJRPgwYOaSz+nzwUopzYuz0tS4BFHVpPCGD1n/XgHWHu2tkaCKyHEcjuVW75g0YwB31uPgo8DG+L0edG+WAc8CD1LTLpFUiFDgcWsAVbpGl7Ugqcg7GR4uEM8Wj31jwpv+lrG2DOohIBJaEFTa5cpogJARGNuVWP+WYyBaqbC42Fwez0JWywDyi1pI4up9FwwV3cZ/LoPATeAc/AY3H6XTBWoyp6c5TxvhCYGOE1RF6gKc9snz0dVaoV2Vm1r1L2hzXlQuhWAtwYougFcQYlGuAOQpq+pysDgeyDK861QvWTtjfV2Yr/HFCeF1wC8EEbVs4NVBNVHV9MFqvJSb8jUawUVYrWGzMKwf+ytuxKCWakWzV542nXYN4OmifBUYVqZCwZ0XyQDczEYWA5yAhjq+ulaVcJaV85JocVWYVji/lFraxK57lf7uIkc4WR4e6qXbb/t/w977/Zr25Zed339MsaYl7XWXnuffc6pcjmVigPCDpaQEC8IhMQzj4h/AGQSKSZIeYkSLjEImZdIRsIkUpDyykswCOWBNwQPSEhICCTi+IZju1yuU3Wq9mWtNeccl947au37+phjl02899mVB0q9ndpalznnmOM2z9n9V621L/ZfhBD+bxH5X4OUfxhi+L047L87DP3b4+FwefHsPr14+Un5S3/tq8GrpqampqamnzS1/1umqampqeknSl/VgQX97V/5L+SHP/hSHl+9dk/nc5iezvvT5fzZvCz/8pjmf3Ne5n/lNF1ePDw8BIU5NSqnEaYaKNP+Hbc6YGpnFRa/QbwtdjXWxUX8smiluJXFX//zXBhpinVxvsaw9BijQR6Cn6STB0ONI2rztJVEq5OInU7WV5STQgkAisNhT5gxAvw4v7rAquup6lqAXt/bW0eVurIIg/y1JDtvO5MsSlj3GWXZCjV0HxSAzFKyOrrgCFuLzw0qRDtf29L3YsdTgYj+bFGxlFYHD84RwZI4A4HlCsE2Bfl1+l62yY41ahfr1L4icj6feb7qxMG0KZ8nbMHxLdV95+w6F0IQQqZSVmfVPCt0Cz7adL8KXqLFCK9AJxsArZFInI9oE++0X6usx5MN9vka/wvqEMwWn4vheo4IxXjBnV17tzqoKqwqNpVTzA1IB5q9v0KiReGZCdegRlS30yf9xsFVn5+2ENeH9fkxWBG9xWihyziun4FEV5p1XHmFoIi94hgqCMY+Y5jCE66ZdcnV49dzGBntZCeaRW7ViaafU1xXTiW1+599Y3TsicS+kx2An7nQOji/CpEp4TQed3USZ1ljkunT++c/PB6O/9PQD7/WDd3/HmP8Msbu0sUuLb3LQ9+V4/GmPHt2L//+X/0rH/Wv5+bAampqamr6SVL7r1pTU1NT00+UPgZgVf3tv/W35IQF7zS7lJIf5/lwujz9s0+n07/znS+++2998cX3P0lp8ShgPp1OEuKgoMop0EFB9LI6buriXX/2Ja+LdRY2W0n6nMyVAgfTWtZePTOyRvGyRQIrnBKLiGGhTXeWjpejQyRZBxW+d1aSnu21i/URYSFf3SgVDAAI1EifrI6lpD9ysl5m2TiL320ao3CC20RAB8g1p2QvdbLbDXpseJ2VVwOc4Dj7vlshSd6Uqtd9XaaJPyPu1w87hVjZIopiLjWp0/iy9S15gihcB04glKv7q55NHnv3x43oNZqWzLUVqtPMQCSOvUbS6nbh7qnF3OiO4uTBWQu9g0UIyzqFblnfI9drYHCsOrWg6PwVqnhn/WaBr4e7DmALkA+un2SwTTvRROFgdQQ5nSy42+14fbT7LGkfWQhr1LNs3ErBStNx/8x08kUDYQaekjoN6+/qc7X3Su9jXLduGPRntfTZqS/r8AGAIMBL3BOIoybr4+qHfh2Q8A6wtOvH7jV8xgDSFnURAlJV0CYGEmtEtrOYIO9PczFWZxjvddsmgeXqNtTbf54udj8Gm77odUqlRXyDt740cTyW3pyKsw1fWK5uu7LfH5cudH9wf3//9z779PP/9uuffvb7Lz/9/PwLf/Uv/VPrt2oAq6mpqanpJ0ntv2pNTU1NTT9R+nEArP8v/Wf/8X/0M7/xG//oP//ud777b8zn8+F0OsGppbCn6xhjAjyYx0lKCFZ4rlBAF/BO+j7KdBn5c51gBrdIDD2hA6KF7AayhfZiIAgOk3GcuDD37DJShw9icoAbpTrCpovFpYQTFAG84KYZhsGcJlmnBaILqQgBUq7l0l3Hvis4jAghzEVU4Yjf/LWBk+oMaMChApg3IWq2AF5tonfogeriuq0KvQiB4ISBS8XAH4+n38nlfFZQZ/wsmPsG5ONwc5SHhwfu0363l/PprDP9ikb+hiHK5XJRsFadT9aJBGAxni+SyjXGh3Nze3tDR9XT05Oep6zuMERE+8NOxmlc44PR9+/0bTGyOM/am+/VFaUx0Wj9WjpxMdn0wS72hH9PjyctBEe8LyPu2GuRePC8fjwgr66rkhXspZxXdxyg0n6/l3maeI/g9TxucWtME/tZ4518jQ9rn9mPii4+ToaUtYPqCl+F50Wn8ul16u39Irq4cpLYD+aIS9wnHD+uH2Abtnd/dydPp9N6TXFuALYA1hhTtBL1CsIAnRRUZt6rdJr5632C3+GzNk0T76loEVhlpp5OK2/RVLx2fzzKw9s3Mo7z2tNG51sM3AeAMEYN5+ow1AmciFLi81or3D2mgfY9gZlCrcwIbt/3vAbePu/aD6f9X7ifu2GYn93d/+7h9uZX7m+f//ff+Oaf/fJv/vIvLf+0/93bAFZTU1NT00+SWgdWU1NTU1PTe6rruu/0Xfy1oev+JZnnb/UxulPO2uWUZgm7HTeEBW2pk/2wmEYXk/3s2fkU1z6mbfk0HDYADqHbazfRjCqdRSFYXiR26rDBwvz25sjnYOEfrLB6cQBROznGKEPf0+GSisbgUB7dDdrHA3dSslJwcdrl1Q8d+4zgatnvd4QIWJCz08l5Fsgzjhcc427R3Dsh2DTB0PH9GK8KjqDGmUMnwq2VtB+K7qxNkThjfegMA50qjvu12+/MlbUg8Cc3tzfy+vVrEoTT6YmRx3Ec5TKeCY26riekIHjJRW4ONyvsYYwQ5z5oCTjgQ2d9V4A9iCbieFz08szcYH3RonV12EQpoXDeJM1tLA1XR1yxXjNCIwMrdRLdtiCf8DIpzIQr63KBq8nRtxMwka73dGoBXNYoKJ1FBnECO6W8dNa1tkYXF+05UyjlWA7OEvseJfZngqx5UliKbdw9u5FpHN+52WssEsAHHVYsbbdpirsjAOGJx4jrQmC2LNwvDhNwnpG+2PcEoHRlBS/7/UG6Xv+KuUyLdU15GYYdo44AT9j3m9tbubt7xsL98/nCY+mjFqZ3/UB3I46jdk3V/rPFnFuImgI++Trp0jqs+D3vc/3ds7s77TsDLENkEGXynUUag1/7vY67vRXRJ8nTzBjnbujkiEEAFsWlu4/vH2V/UICq113kfJm3Zxa0i3fFy08+SamU7wz98CvPb+///suvffbqb/7yLyVpampqampq+iA1gNXU1NTU1PTe8tNht/8/D4fDP4o5/xnJ2QPsZK/RsOSdHHuNy4XdYNEz905EDB1HOplOi9k5Xc5gCX7PuFMIBDT4o9MBvcX7EkFQtil6cMWIKIyCuwoumn2/WxfatdsJoCFLjVcVm+6nxwzXEVxZx+NBdv2gDphc5HA8qIOrZLmMF4IIOKzgeKnbB/gCkEBJ+m6/JzSr093grPIVHMEh46rrBQt97SO6ublh/AvfozNqXiZxudC1s3V/gQJ885vfpOMK+/LmzRu6sOZ54r6riynJbX+rEUhAMzhkRDuRdKribLG0wHOayjVGVveL3WFWDA9HD51lAJSYvmicscbqxCAYXW9pIUTrOo3zAfL0sV/je1muTiYbRLnGO12xiYHmTKt9WJlT63QyINxWNTLnnVtL8fl8f43+4Z7wBk13w9f+f/Ox3g07efbsT/79j1N3d/c/9n3fPxv+2O8+OR63P5bLdHl48ez5f/f1Tz//B/vj8dVf/+X/pMGrpqampqamr6AGsJqampqamt5T3vvSxe7Lu+PxNx9y/tcXke62djTHQGdJndjX7wGAOvYAEUJgDL/F96oQMxIZbGpbXPuP4AgB2Lk5HulsuZzOsjvsCV8ANt6+fctt7uE+qU4vFG/HoIREhLE2OMGc154fTPZ78/aB2ySEgQsqZb4PXo+vdVvYNgAOwEsnuo2y0+4tH/wKqQCWenQYYUJcUkdX9MG2Y71CtVMr6iQ6tCvdHA98jAjMuoYAi+all2igaLFIIrYJyAagxbicOYEQ/cN7A9ABZvUEh9rLBMJHEJcynWOwLjl/tAmAWUFhqKXsOlnO0oAGEDWyyOvmg8Yt4cpR0iTLvnaLKTzCG/fDIGmeGb/s7wbZWf9TrhMGrbhdgl/dWQCU53Gkow7RUZ6noAX8uJYaa1NXT+oSY2pwauG6YrsEoNOfzEKGfb/2mdU46Dzrtl68eEG3FiKAuJceHx/1cqKIfIWuwWKTYS2HR6k7zh0cehDOO5xS9T3EgGMdOpA3kd46EVDta+pc024sbz1mGmP8GOH6zss1laeuqcjf8zpa/5izSYlwgY38nKhjsbrRAD+74OTh7YMB5LDpLUu8P3C/7YdB3JL/iXscolv2Yffrz++f/zefff7pH/3i3/hrDV41NTU1NTV9RTWA1dTU1NTU9L6KDiv8y/HZ7e+mjPxW2Y15cnTkoM9nQJePEFQ5OIJu7iXSxSPmkPEyjsncV/Na0I6FfamT1eDmAYzBi7Bozhr5Y/9VCBbR2q2LariNirmr4NKp3wNAAKIAFAH8AF4gagawxYgWFvahcOEudAbpQvzpdCaYAVDidmxiH4AK4FCx/X16eJTb21u+Zlqu0Sn2CG1AASFK0Wl3cBvNG+cRvq+AzU+ZTrSpKCgDD4EjDBG16sIa54mPcfLdTsEH3g/HgpOMnqNiYCdW4CCFzi2WhsN1tWiMkeccgGueCIawDRzH8eYot3d3Ml9GnrM5zbLb6/XAOc/Lon1MTkEjIBCdUZyeGCTeHPSaon+q69hVRveceAKV4nSaJNx0AJB4b8ClfrfTc2bl9excgoluxGPq8mHPk6sR1CwhONlZpxVADIEbtm0F9nDHORcZzfTmEoRTDEAQ8KzCJTjh4KxTd11QSObNtZe0tB8ZSDrlpgvdfgBDuGdRch7YsxXpiGOKLyrV5f3T1c4tt14vwsB1YIAVpsOB2EXeFwDBw24gOLzCs0T33fFwZHxxvIxrnxe2h3sc+70bwlrxiu1iX71FbBH5Uzei9llNNrWwj9rDhl4rxF/Hy6Rg0Ol59X7hOWefG4C0U2iJzxJcYmXaRgevurk7lvPpdO5i/78cnx1/q8Grpqampqamj1MDWE1NTU1NTR+g5N0ypfRFv+vHh8vpFtAB8bk5a8F1de1wEhkcL+b0gfCzxgY1krbYNDi4axg/mxMjdOP0xIU1gIWWnDvCgVKiuOTMsZIIGGqXlLCjS6etVacNYJSY2wdEpaTr9705TkQbhggKAAgAMWKM63S62phUYZAQGGQ6gObXr9YIYHVlDbGT0HXcBqKCADyETl20zivd12gF8ItBshrJ4/vAieMVEM0GZp5OT/Z6Ax5JC75rsTz27cmcRARBQQEV9hUdSwpJrJMqa9fTOM0yjRcZcN482CQA40Uu3z/LYlCC+4kuL4OQjsXf+tcnQB52TDnHcnhO73M6EZGl9pfLuj84nafHC88xHGTdXgHNYtMEWRTurh1a6+sMYtaJgcWO53wZ5Xg80uWHczZYEXqdgglYBVDJcx8VfAGY6eQ+nWI4juNayl4L73FOepx3IDcfea9i5zn5D3FXXvtr5FI27qp6P7GjCu9d1ElXp1uyX0tqpNLba6tjCsBzXAcbnE/6+/P5xPMNyAQXI87fOF10QuAyraXu3PfztDl3sgKyUvQuHkftIwPYdTb0gBM0XeH1x2ACnxz7xsbTKNNlUmiLYzM32g7Xalkknxcez+nNW3Z7DX2nwxLsnIQuiFeY+7DbD//bbrd7bP+ebWpqampq+jg1gNXU1NTU1PSeGkKQXejykt3rMZUTSri7Ya+T7lKhS0XMoQRnEV0udHZ0cr6cZDyPBFdw2SAutUy64IbbZ2KEUB1YdZIfo3wGS+hYip5AYJ2g5zRyxvcMGjmrhdaZvViL+BjpxIGTxrPjSeHDhVBH44Ka6ip8jCAAkOB8IUSCm4yxKgNPIjrtTycdOjns9yu8olvmsJeIiOI4cqGPhT/PDKbR6ZP4+q4WfwOS4fwhDmigpFjBPcrxUTpei7sR0esMjhGaBJ00ByCB/WF8LSgsQjn66fzESGfuO55XApbqCnM6Vw7QAZ1SAljhRE6EOoA8WaI4WVDyLp6T5NCjdXNzx86xu5tbxhNrnxYK+Omesrgej9uuk7Nyd9wPHl9RTo7JhoifdV4ugDsWa/vhD17zOsD1FNZeLgWV2jmW5emsEAxl7QBM66RKKzsHEBxtOiHukWCRQ7c6kzzfA+eGTi6nUyU9/1qos/wAcQB3sA3cqw73BqBTLnYPFR4zoFIWdbTheJy9n0Yz8zqFs74mBIWsOMd1XwLjk+jzSus0QjFQiruHAVmvIM9exPuoPiZOHWYOWdGP3EaZ9bMHmIly+gFuvxjkePeM9xBik8VK/P2S6cI6vX0kfEYnHaYzsmS/62R32BUXw5sc+j+cQ/dPzho2NTU1NTU1/alqAKupqampqekDFGNfvPcYPTaiEyuwdEnW/6SqCyYRAmicL8vT6ZGRp3EeZbnMVqyuICUV7Q2anx7XPiosujFRL6G4O6oTyBe3Fr/X90HvUpErXKIjqRp4atE6i84T4Zau07WfSsx1Y1k47aoKGhOke2iZ6MBRgFbWWCAAWmS3kEIROLYIRww++YuXWUbtaFoW67q6jvOvPzOOJgq0CA8MQAFEcdohisk3ry/V5WOF9rqxpP1b40jYFejQ0slyoXZKeWEMkU407Led95FgTl1upwftOsLPLOUHkMIFznptehbCW6k4nExwUO0Gubm71Wl4NuWPUxcNyiUDiOjEgotsPJ8leeHUut1uz6l7OK9l8Yy/nedZnt0/k5wWMiRvIAnXgFAzWaQ0IfIWYHOSMZ94jJHxSLiIdIrlxKilWFwuK23JskZWXdCIJiAV7itCnuLF9YET9ghAnfaTAd4AzhLylWWdYinq9RKBYwkQkD1ijrFGxhUJupLgH4LQWacRDl2w+KDYxEDc2wunICK1R2edVwhZrLtKrFurdod5qfd72tzHKOeXj94GThQL8gl2C6djOvZlLfwjdOF5/h7vswDaLToMAJ9fxn+9TvWc5rn0IbyBGXKapqu1rqmpqampqekrqQGspqampqam99TQ74mkxMmjc+4M90kgVLGF++wYz0JMi66juchiUULvdHm8IPqXrtPxsMgGoCgOj8500Yiom4bupMtijiR1uxAg2O5ezhc6iU6MbAW6QYL1CbF8OuoiHe4rdPvAVYT3jOba2gogAbHC2XqH8N4h5LVkHY6Z6ihaxDqOMDHQOo0WRhmdOXEWuo1qfxV+BxcaAJK3DXb2MwDZdD6vx4THZvMBFe6DRecMgtFVZlFEfE9QljMjdNmrGwhAJfhFi/NnLX+XaGXmTvvGnPVEXeZFY2Q7LSafx0mdXABa6Lti31GWuBvosBmOB7k5HCXue9kfjpze2Mcoh37ga7LX6yZpktNllPMTYpSjXC4nOZ3O8vZh0C6n44FdZn03EJqdLhe6zdLaD4Xr0a1OJaKUZDDGmpRqHLOeYzyEWN3ELip1YolBuCqCG+uVKqLQCdSTKBNOPVHXFO7XwqglaJqW0PN7i+bhOfWaqwNNwSA+C1Lhl7HdUiGl/Uzoxntu4+pDnLbGJ7M6EdW957WwqqZf68/4jOTrfcxorvcfvQ0Wv+tO8unVaTjKRac8iqejEfFPuK44sVIce7sAuF4edvLy+b28OT1qF573c85lWpbFtX/PNjU1NTU1fZwawGpqampqanpP/cW/8u/JL/2Nv16CD8kVNwdrYOLa2F3XzuqgETo5Ok4GxDQ5LeYGBMDiF5ChTkbjFMLgGBNM5Qob2IeUtfcoRUe3jC5ue2IAACAASURBVFgkrTqX8L6AQ3DKMKSFniGbrMf/yHuNg8HJk5dRHTZe95sAgkXwjtPlCCYQmwM4QoxMHKN/lPUAMd5WNKZVoUWyiXKOXU4Xe7pnTBCxP4d+JTrLEp1ScLdgX1lKb2CqlnpXYZssPd/87G0bnj1jnucHDqfdbsey7XryS9F9CF7fFw4qsWgiKAZcaL4oIBOr/B4tqgjoEV2QDpP49gdCveN+L4ebG7l/dseC9/2zW9kd9wRXoYvqisraQTYHAzmuyM1lknQ7E1g9np7k8ekst7dHfn37dJLd8SBfe/mZPJ3P8p0vvpCn8SzDoKXuac4EJHBHwd3DKZO8XxR6grLUWCHugwQAlPSeqfHSqgpsKsgq1p1mtxAfZ/xx0V4xxu1gQMoKV9WtVKcJet6rgDm9uLWzi/cFYrFw0HkFWV3sVled1D4q4CRGX70Ub9FIry6wteEcJfYcXuDoIDOTlB7T9bD4fe3SImD7cWyDv3Kyw5ADRGGXSeYER1YUl7Hfjs/Rz5RTZxkitgDM0dO5CHgFOBc7b9foXYjY1NTU1NTU9NXUAFZTU1NTU9MHSOGAW+gmAavIFq8S7QmCgwkL6dipIwdAKbLYWcHCLnbyNE7sD6K5xXdXiIMFNIGAxsewgAZQwD8hO0lBHUxYYKdNeXXoOwIExONGTkAsBASLoMcp6Dg767KCTYeRMafAjAfB9nB9Vw+QNSdzPJXV4eQ3UwWzlbYTg9nUPJ1E59eOLW7ZnFxaomVdXnSEKchKAFkpvTOFkRAJsAnuqs7OjbliikEzAJFi7qPaf3V1I6kTRuHMzAl7Ym4xnBPsM4DTxDhZYRyyOs58RpF74Ffs534YCK6eP3smn7x4Li8/+1SO97csQw9Dx3MClw2cXj4VOqYu1l3GKOedSObUviSv3r6Rw/Ekb857CQ+P4lC6jo4vl6U7DNINnQLJvMg0j+rsk3eL72uHFaAnrheK6u0m4GMEXooxtdtKrq9NVuCfXSaQopPI2e/Qf5X9FZ5a3LN6/QiAytXxVeN3OJ9iHVMARIhjAngtBX1xvYIpi5daQ732n8WuDgpUWGZxW2e0kl9oARPrzyoW8duo3maWmfU/pm0QxnZB4KFcY5kEbyIuBv4csnao4fzpREVM2swswB/Skc6+3eFIsPr2fOrYQxZCixA2NTU1NTV9pBrAampqampq+gDRTbJxDSFOVCenwQWDxSuKnDuDRrk4mwanBevJ3Eke3TyENTYBzkeFO8s6908LyOuUQb7HdeJefX/9mtbid2cl1Sx1N/cLXDu5OmsIoHRfdVIc9t8W9tkmxflr2qnYNEJ21Nvv6bbCc72Bg6xT3JJF8wCasvVdXQvnNV7ou07dUnZcgFOLObiytRDBoVbMgRXNaaXxNE/45bA/dO542fpaAL0AIzip0Ot5pqNs0VJvgET87jKdCbGid5uIZJIenV+4DsHJ7niUZ8+ey8uXL+TzTz6Rr/3U1+Ww30k8WNRQtH9rf9jzfMWMKZOL3B5vCKzcrJBuYWxUpBt2cvRR/K7XiGPsWKSPaCFAR4w4j7P0Pdx4O40SwlGUF+m7Ix09dMwhtorYm9eIXgWKLEYXi/zZfVF70Ai4nKwTBzUeGiUUdW6xcL2k62AA61qDI6tY3FBEi/Gldq2Juov0plWYxkinXDvOuP9pWa/PQuhZ+FpM6StlA8tKvcUVRPGDkjXyKqJwDNdFDKy5Gk9kN1eW5Py13+0jthG8t8ipTROsn4Wi0x3F+sNc/WxsBDfebPCU7qyECZM9W8d8kRYhbGpqampq+kg1gNXU1NTU1PSe+rv/5a+u/VGAM0vOjtPwEN/D4h2dSVELv1HYjmVy1++0Y6nX/+ROl5GwpGO3k3YIsXcIldhpsUhesul/hV1WBFxydWZVOECtpeszAYozYITYopjDpTqM6jb1cTijPONcdDVlcy2ZU4lOqCVxX5MBKzy3fs9tA2KJQQoAMk4F9Ju2cJ3yZz8oBEO/FMAT4JRBNl/jkjaNr4I5girr1wIAQ28Wjhp9UYfdTicRVniI/i+ep6zwCq4w68kSK4FH3CsZSCk4VyjdZvQyy3yZRA463fB4PMqnX/tcnt3dyYuXL+RnvvUtyX1kZ1UEnLR7AIBqt+8IrHaI/qUkb8dJJvSMOZGYisQwyHm+iEecMgTpJUofoixlYRQP0w3fvn4lDkDRIYbp6e46PZ1knHFPFfnGn/uG/N63f391WlXpNL9kxf61uwogxibsmTuMuAXwpubocJ2TQkYxt1mdlAgPl8sKJen8wzWye027rmyAX7Yy9xohNPipDqjCIQR0Jnktec8yy9q9z2EDmxyfEwvjKhxlb5fBLUBWMfdffR+dnOhXAKW32vVe+JhtABgG6/mqnW0KqvRr6BSIip0TXIOUJ57LXbdnjLC4LOM8yQ7vEHznnA8tQtjU1NTU1PTxagCrqampqanpPVXY4wOnS9F6KW9dPtlcMOhmAiQwhxM6ko47jbiB3uBnFonPswxDZHM6In9YQ8/jRR1Sbgso5Oq+qtCorN+umggLrN/IuoZqP1K2XmtOVcsaeWLcD5AqRP6+aKO3gi78k2ukUacTFlGw4ZPFzehs0mmAxaYiFiuev8Ir84vhfQGPrJ+LATRO7fMEZMnKwaubytVIoU01XCbOKiTEEnO+HQ8HCRZJZIG87UN1cJXVaVRdbnbSoh5nBXB4DCXtc0mMBQI+Hg4H+fTlS3n5/Lk8//Sl/Mw3/4z0twe5/eRe33+cGS2sYTREEQHWHubRrlUSF7PkOcthgJunsLtqnMb1/AKEvbi9kUd/loCS9qmT+fwkfQeoCXCnW9fzsMhv/tZvEB52+71GNDEZUNTlgygqv1rk9Ok8cUri0A+ycKBA0omDopMjAQ1RGs+pjU57yvIGjNUYqE7Q1JOqPVlxBaiANISDjIJmRmfhEMNzdDpfIbyM7DrTKYRwjUW8Lur9Ns8KkDTep7FHgC6FctkmMAbGY/EVNx970QKOxWKw5qJyPhpAs53FPYv39HEtj89Ju7bULYjrbr1o1YnlosLkrBM3Ozr2okR8RqLGCBmhXRAz9bwGcKjxs77ge3MV2qRP9r05QNXBop7b4q2mpqampqamr6IGsJqampqamt5TFaxgYd+F0MFJM1kcCQvxuRaJp8JFL0bqY7pgSvMaBawL/yiJ8GC8jFKyW4ekafIrcPBbNjcJKno4YS9li3rp2zh3bY6v0+uokggMUJLtDWxIUkRBGGDHAudUWLujFBwBqmVzb63bywq35jzz9XAcJVcfywZmCgvlQ3WsAJrBChVZFMb9S7b/cJXRd4aImbmCQlYHTNY9ZtcQe70w2S/ptDxOrXPWU6TXwCJbZQV/HGZXAZUEScG6miQT6IiBn2iRzSVr/M51UfbHo9zcv5TD/Qt59slL+enPvy5f+8bnKwC52R8kx57vD7iB90ZA7DLPcpSokbsZ0yi9dB32LcnSLXQjDX2kw86lyN/fH+9k8L18f5nptNovR+lPZ8njSAfPbojiSyJomRMAIq7/YgMCigGeyGtIN57Tbq8e0bclyZhPOu3PutXY5cRJlRPL2QMjh3aT5Q13tIgcS8qLHncpXlwfdAAAu59syiBAWrIOuKLXodTEHYKTSd1Xya4fJ3XS5VQYXU0Gt1iE7pwMXVjL5XlfcUDiQpfchOuK+4WxSYWhwe5lRnntXq39XOt9RbfchzwvMzZI4EvApfdidgqucD9yoqYUmWTRqZjRETzS3YfILu6zxB650kfEMlmv3/4129TU1NTU9JFqAKupqampqek9VSfuMc7W97M8PHJRLSLWqeS5IHZRy7OdTcCbRyejjeMHLIHLJ1mnDqDCksq6HY1waR8UQNJYsvSdOWzQaTVN2lVEZ4h2WAHYsJ/IO7miiOqm0YU7Fuy1m4cuMnZMhXXan9QFvsEQb51VTu03hDO6PS3lZqG6lYhrubusjhaxOJonjAN40bLzCsYYP2OMK11jXUWLxPEiTHvTzi4FYlKdPLqTWnCOwvx0dVLJ9si57zDV1McB0jyKq1jwznOBQnGZBQMK4ZxD2fsnLz6R2+f38vlnL+WbP/VT8tOffS73xyNjeIvIep6SQZCc/QpE8LU6weiyY6wTwKpILDb5LqmDSOxeujkc5Xw5Se1Ov58WuTy80TLwTmOBr18/EioCcSZ7H5xrFMaj8F3qVMFkQMdOk99cU3UKCifqAWA5xuqCxuw20TZCHQO0QGZKqQqxDuKHZY0pKkBip5bXkn5+b9G7UPu6AKvKdVqlOp0MftX+KSu/qj8TujHyeXUsLaSSdnVx31jXW7HpipUN1WmLvOb5WtieUr13/vTnBRsYIOYInO1zC9gsdk+LubMWewy/9OauxH388PCGnWf8vHX9zM/tpgusqampqamp6aupAaympqampqYPEKNvpSwsrM65hFr2vGj/EmADFsLRnCen85kL3KHvucCdppExqsvpxOcKO4b0/eE9IryyPilXnBaiZ40/MQ4WvE0T3OwzoEBwUuec1TLrCr2C1w4txJ+cFXRzsY0pfJ0+RmcVHGTVyWTvyRJwQ0PO4AMiYtj16Jjn4vPgTCGwsMJsLOQBeEJ9HPDLRsQBXK2l3VajxHepEKOL1mOk++uLlW4XnZ4Y6NRSmMWGpxDWUnvpHIGQq1FCj2ONGs+Eg44F3zApqRtr6HZyc7iRm9tn8vz2js6rly9ecOLg7vYoBRMGu8goJpxSt7iu1icGuEEHVFY4B+cNytsd3TcLv18M2tXrwvibJDlPJ4K3/e7AGCD29by7iCeUOtHt1pVO+8Ky1xgb7hUpMo5JJw4mLXXHseEas9tLs5xrhFQda4lgK6+F+tebp8KcNYIqZYVkyi61JwoAM9VBAIGVZzx2dTKV6/EFR7jTi7OJmnovAOjhM8M2c+84iTDbkAGx2CvvQ2exXF/We5BOvbrDWTvY6ARjXFF/zWPafia82L1rBez2IfvTnpftc7hDbxcg6YK4pRO3OAldz+PA3TVx2mjifvu8BbdCZ9zlopNGo8Z709D17V+zTU1NTU1NH6kGsJqampqamt5Tq5PESRrnkQQEzieNugVCETyusCrbBLgaHYwyTbO6YcTcSrTUAAKEdeqZZ3+OTfeziYNYfIesi2y8X7LoFxfNBpWcFXXXSXPaiZ4JLwL7ewC1dFohS9vTwp6kyzhyfwGvdCKdrECCsGXJhDAANOwEQnQuTerwqet+m4o4oa/KooDcP68T4Orivrq/EBkjqjKHGBxO3MeiRfYEGGaY4YTCXK4RtxpRZKTQMdaGeCXihJ7PXxhRxAuyOXXounK6TZbsey996CR2vUREB2+Ocnt7Ky8/+Uxefv1zAqxn9wdOBjwMg+z6TqY0ywAaN1vB/gqvirmd9DrP+aIl/KRyzlxOdvxOnXTs3jKHFFxYmFR5PCwGPdThh2v6VJ4kIq5WnMS+E2Q0PYr990GeRruXbDu1wwrnj9cgXKEMHiPwEu2aYoG5XF9bS9qzU6ceJwxaRJSdZ9nzNXYB1mteH1dnn26rRvMY27SeKtzn6JDC+VqKyBB6BVPm5qsdbwBcAFu1p97ZPwov671m0zCLWH9WsfjfRtVU5u284/gRl32f5+F+64IsUq7RS3RxOcdidtw/eP9i711jk9h+1+l95wGTs7qxSiozIHTn/I801zU1NTU1NTV9qFqjZFNTU1NT03vqF37xL9vUPDeXXJ7AaHJO6zh9xo3gZinm47B4ESBJNwzrJDzEk/qut75pjWxV0KNRvExIVV0nOmlu0dJrs5wkg1NcJNcSeblGscQgA7ZHZ07SYmzdJy+73Y7QbRh6jX5VRMRiditMF42AySZmNo+TwQy3QpNs5fDLNHM/13Jtc7YsBnu8eswUQPhaGi5rVJEsg6CjsE+s6Lmmc4ouJefXKCS7wYxBAFAVm1wI4FNhihZ7V5hnUM66jSR4ubm9Ibw63N7I8fZW7l++kBf39/LJ8+dy2O/W7VymWcJllhehk70PcsD1BMxzXm69k4OIHMRLv6k5Cs4ZiHIG7vR7dEwVr046AI8Ywzp18XDcy93NM7k53sntza30/SCd93LY72XX7wgccd1wjEMX2YUFuNIFKysHCGSUtBa8XyGnlvNbVHUtxPc2OEBWGJMtGlr7pQqnbV7dS94cfOz7qtFBA6uEq+UaqVxBVFAAlqWs29ROtGusbkk6TfHq4NvAMmNcBKP1b65wwc26H67oY2sRPYvd1WEI0ITP7Ps+Dw5LxHQXc1jVTxN6y3TgAVx7mETZ6WfJFX4GI8rw2QUGJyAcib39NdvxdHfszWpqampqamr6GDUHVlNTU1NT0wcoe1cmgauiTDmlssa4isYLvUWn6ATqO0IIuG2G3U5O55NObptmFnszqsV1emaZeMzapVW0uMriTgod6LoycKTCwnnjhklFFjhrMAkRwIfRM+2OzlKBhWgBd+1IckL4oRP+DBzY9MEA55JLunWr1sJ+oEOJEwDxGriezAWEfYBLqLp56BrjpENduNNJFaw0XK7wCgKsctW5Za+lWyro9LxiET0UUYVOYVeFIThOsQJ9QASAHXSLZYI0bMMREuG6YLuLRda63V5C37Pb6Hh7I3f3t/Ls5b0cDp3c3fR0Xo3zTPcVX5e9fVXQsc8aFTOf2Jbx8RoAIM2zQkc94c5A3vWJtf8LDjh19gXBYIBHuH2WkVvGfRN9z5L5gl500R42MTim0NStTqvrtr2BT+3SUviUJdUpfezjUsAidL+leluJS3bHIK5nVwv3tPazKfDBMwLjr9bdxq4rGwKY6z1jwIogMZmLqti9X3QaJaJ6Mq/nD9vxZfP/rzp1RokNNOD9bHArBr+eh/o+dJc5v95LYqAK98D7PC9lXDMDnl6BHV1eAIYWzUUMWEQne7LEXawDzils7kOQvu/pcqxx3ZSaAaupqampqelj1QBWU1NTU1PTB4jxMZRfRf/Iiiova4wIsEoYPUoEUgsm13UDF7an84ULXTzn6fEk43nk4r0QdkRUN63wik4d6yYCMBBX0US5ulwMEtSC9nf6gAAkqqPKaxQQi3b6l7xCAoAo7FjpDARZjxIQCUCKsxJ3q/VSUOO1s0lqsbaVyQeLJAYDWljU09EiZS2SJzzL24J5fVc6fBYt6Y6szy6c+IZtodfLiYITBXaI5llIzVxLhGcoeQeoyRpZJAvB6z2zdAQn6kbTOCG6pIa+ky56OR528vz2Rp49v5P9vpPjzVHioH1FQ9dx8hynRvogb09n/sWpQpsaA5yTyMWLLNFJXLwV2JvzSvr1Z8WEE8/zrtfzdJnUhQRHF+AHoJp3t3I+P0kIPR1Xy4TIn+P5nMzNZuE9dUGNC79HdA1AD8eIjiYAFnRSdV2v0CYX6d1A4ArgN+dFDsOOoG020AJ3F886pxtqxxPgTTToUzhR0GvqLmWFSjbdUvuqkkU2ncY22Y8W+KfUawPHEuKudi/ge7i0cE9h+1O6lvtjXyKvpec9VidMEpx2He+9VMoaaUXUluclqzOKAhxGNNH2P+sYQ/ZsOSLS6g5TVx+vt/XTL6FI5zopS2a3GKdx8txGHiOBHD5L6PUyVxbu08enBxm6QfouiIdLK7cS96ampqampo9VA1hNTU1NTU0foJTYPbSE4CfnXFl7sYoCmlQWlowD7CAiBgiDxfRlGulCivx9pwt+czsxKheDJBqudOGfLR9XrEspWHyu9irBKcVpgKnwdYwXipZsY4GeZ10wL9Z5RYuL96vrSdum1SVUwZhGz/w7LiGAhzRb51bRnqRscICxQKdgZZ12twIrc1OhF6sCDjuWOlCuWFE7wZd1dmmRtxaBcwpjWmoYUsu+7TjW/QNE6zqZ4VSjk80rNLNpjiWIla4nOot6QKkY5fbmRvbDIHe3t+y/+vTumXx+eyvDfk8HG9w90TqT8HXfq5MszVr+PumoOp6DOXvpDSb2/V6maSG8ys5roToK/4tCFU4oBOzzYYVGYq4tQJaF++3p4NkPvSSCxmzTAbPM46jQj1MdFylF/Um8Hov1fpkVihG4gl6uaXUHMi66JGIbxuUsOkcQaDYoBW/Bit2x3Xl1UzFmF+P1+hXdJic0Mo5nTj5RlxacgSVryX+yGKM+rp8FvCcAJK6VlvXLGk10ahXUAnZOIpRNP5bo9Y3eHGN6vetjP+p3Ct6K5zWjawMJNOaZcG7wHnBTOvSpiYHARHcfY5qDOildUVdaH6OMl4uBYWeDDTLfiOX+2Ddl17z3lmVx0tTU1NTU1PRRah1YTU1NTU1NHyBABmCXKH7cI/oFADDPsrjM0nIsXpcKcwAFUmY3FMAU1reYLuc7L8OhN6CkzpwFNh64RwAYbLIcHC8dYmVdz23VEu66QE/mwCk2xg+RsGI9R+jHYo9PVmdSdeuoKkgq9ri6a6rjis/P2lM0TtOmqDqxqB0OG/QPAX7h8YndV4nAg4ADHUqdQQ6nx8GuMLeJgomziJpCBPYLyTV2JovGH1GWDrDAuBf2CXHDClPMeeMJmoKkpUhOs6RlRGkRp9dlltNrR5aa2RxhxG7QPqm740Fe3N7Ii7sbOQyd9N7L/W6wXUjvwKvnNwc5Hg+cShi8AiCxyZTQruv0z67X2CIiaSHLgj+4rhFYKMoQdjLEgaAK57BeQ2xnTEnOaZHd8SDHww0dbx2PL9OLhqsOMJWnWcoEaIP7zjNOiphaBUAVjGXrlpp5HlA+r/FVdQRZHs8gqmMZfuT5dHZt6jVZe6twz1S3Ft9XXW8AedM4apRx7a7SbjacRzjCEiFeImRjmTyGHhC+qp9MK9O0yD9zIEImwJvxfU78SpeURfVYnF8djwDEadauL944yfa+EPQlm0LoNpFDsWPhvWGfJz5H/FrwjgmXxaArwagND5jGi55H3INwusVo23X8hPJ9sgZzFzsPf+9X/277V21TU1NTU9NHqDmwmpqampqaPkBd15VlWXIX4zh7hzShdgHRXZI1JgUoFTQOWAyCpBjkMl4YG2MfkAPgKHQ71e6gVGab6KYTDPtenVqrA8nia4A5cEJVA0ywwnQu+K3bB/8sDov9sAIIB1BRtMQdkImLeptm6KzwPVucCgAja0e1uVaEUAagiJE/Kaubq3YZsS/ItsOopbEo7q9cJ84x7oafg7q1tIC9rADAWSysdnW5FVIZFEnV5SN0EPH7VCvvr/CEsKrr1d00eEIGwLKbmxvCK5SjP3v2TO7x5+5GXhyP4g97upsuOcnzo8Ulbdv4ikhhtILzZD1SKXu6ugAvcxfkApceIN6+V5dQmWSWRMCWrDuqzsPjPWMg7nw5y3S50P3luk5ubg4KfLJOEFxYJO4J5qo7KeuOyMbWRujiDLS8Y/vBuRM939m6wwB/yiYGSNCZ9D5y1Yll7i+Wvqe8TgFcikZE0SEvTudm5k0/lzq0DKpZr5kY8KmPw52WqpvLFAzs1nhohWJdfZ1de45KsOJ5Xm/v18b3Gtms5yXbfmz3i07Fzb7ivEzeoGgRGwjgeN1mN/H+x32jQxqKhBKlGICsUdlMEBnUXebts2X7/2//4r/b/lXb1NTU1NT0EWoOrKampqampg+QYz+TK/N4Ycytwgz2ASFOFD2hAFwfcCsBWmFy4LJo9AwABd/P82UFI3CLZNmUe9s0wVoGzjW5oYho8S0s44O5vBgOswjbOmHOpt7V/dPi6urCMtCQtRA8WZSPEb5ikagN+SgGTDAFDwtzArdQJwdm69ayeJqRhWzghT1EBCFunVBXpxNW51F1tQinwgUeHSONTruPxCYNVqhRzxRdQZhWuHYuOXZFRRcIHxDDg3BN+mHQCYRWqA8X1uFwkPv7Z/K1z17K/uYg/tCvbqudTY07T7O6sIae3/MahO1fn+DEiqvjbqkTKSXLJEWepklGnIfgxPdxdSOdzdmGiF9wkdvHS1HwTygqjvu52w+cYhn7QfpdT/dS7IP0+0Fcp31L2sOu0wQBh/wG0rgNAOQkvOrMquAnZ5tEqAAUBfg1Juk2z0vm0AJA4yW2uF7kPRregYoVRtXrFby+pm6DbiWDVM6ijnRCVfhknVfsWFsnVBqI2gC/6ny7tscrlOJ+eO1KW+8xA1QppXdgmWxcWXXbYn43HZjpbQKi9nkBXuEzEEPH84lr4+z4FnyOCW4VABZ1sTEDGkKQpqampqampo9Tc2A1NTU1NTV9gFBxzQJrIBnABHRELUlqRTMWuOywwkLZhRVmVTiEhTELyuHAwprbW71P2nRUVciQtbi8dk5pYbswrkUXEyN/6MDKBCEEOsXiU1kX/YjPXcGRFbKnvDqhCBecLdhXF5PY83WCngva37RYrxYnLbqii/WsfUUhBwMBCrF8jZ85zwX/jBF6NsnQGQDKa+dS0A6vkqyXyLN7i+6lrOeUrhcDHM6mw9VuKbGoV2AJeaTjBTFOPNaxZD7QIQVwhH3ph510/SB3d8/k+OxWbu/vNIYXOjq6ALGKdWDN1gd2u+vlPE6Mg7o6eQ+OHTsnOev1gcMOPVsAWImPJXG+sAQ9zwrDKlwCDIqYjojXGTzBuZynRXJQt9V+t5Nh2KNKigAGYA4uOkxjDClwUmS9vgpJrvE4QiK53k/vQC2LYBabHiicWpjX8n8Wstci9FI9T4XXhcDJ7nNAHaG7yhx0RdbJhbJ5b2/v6TYwco3zOe1tq3u/Bl0r0Ko9WBt3Fb4m+zzwZ4NZzu6P2m0lBqzq78VAVq6AbS2LF4K1rcOP4M5K5CML4y0yGnVPAbG5n7bTobrKOJhgkt1uX5z3k4sx+b7bzKlsampqampq+ipqAKupqampqekDxEU4UlpY4Pog0zhpJAylz4zi+XXhzTAeS8rhWpoJozQiqAvixZe1m4cdQJjE54PBKiy2F3ZZVcMIFtLVteVtwY6f6f9AW3muMcMriCKUcOqc8eLecZjwZ++ujp1c3unKciWvXUdsOIjTUQAAIABJREFUYLL9J/gAvBJ11NC5s2TCIgINUYeW2PRBnous0+kKgFK5unOkMg6blshjC9Hg2KZMPnQKFlzmX16KOXQqKHF4DAAH7qU+ipt1MiKOBZHBx9OT9LGT3eEgg/VfHY5Hubs5St9FOrR4jvvjClC62EsX9zIvSR4uE11Sb5NGAGPSsvtrD9b1r1QELucn8cssgw+8HpdllhHT6wBqnAKolB1bnADi0CPG6CTieylLZzATEBROsoXT/TL3+XQ6cUIe3Ulw6vE0OX5fzfXOYnvrRES4wpZr35ZYP1au97QBqmIdawCsdjeoE2lrWuJ+Jt2/pBBRB/IZ7DJHEq9NjSfiHrNpkez7MpCnDjDVGm3cALBirsVaMr+NRBLQVmhlr8eOVEBVbF+dXKFarFFPQDSDatV5pUX0CvIqFFMoJeyTI1xlz5zGZvNijq5NXBZl7i666nxDf/3kQ8j1c9HU1NTU1NT01dUAVlNTU1NT0wco5eyWnHxybkhpdsncJ4AnhdE1twIkgCo4ay7zyOlkrJ1m1xUfpQMrOe1/8j6sYEF7sQze5LKCnAI3U4x0+Yh1FQFsADXMblldMKVcpwICXkWbEKf9ROqs8hY5pMvJoEFxOgFxHfdm5e/sPhKLMm7iVwBN7MWyEnjxtU9I2ANEdxa2YE4tfZMaL5OtT8fOl7f+rGTuJTEow2F+nDaojrIiBTE359aJeIxwwkVUtHwc8a7QBeljL/M88Zzub/ecMoiJj/1+J6Hv5HC8leIHud0PjAgCUg0xyuNlJLi62Q38eVwW/tyFK2BBzHC0a4NLvsjVWTZZDA+g4zLhwUX/0rXG1QrdXui1wjVcZJHzMqlzDLAvxHVbLI1Pg7h54XH1/aCR1OJkWrx2XuH6AibhEtf7pUIe3KPer/CoQtDqVHr3ulgU0xuItZLz1bW0ea43iCjb95Nr6XsFu8XccPX9a/F+mjUu6WrM0ABVdWXV81zjgFsLE114tt3yo/tjYGt9bh16kOkz1Biq12mBuR4XjgH3kgEvb++pEVZ1G0IA1vgeEVR1PF7vZ5Too5FeXZYaQbWQY57tfmhqampqamr66moAq6mpqamp6T31X//qf8X4FvwgpaSBE/bopulknCcugMs8EhD01o3DgWZ0K1lHz6ZnR8uigyTE61ItctepgEWuvVdiC2WO+teCKYsH2nQ+9EuhBypcJx+qF4wN7wYDNJ7mN04Q9hgVnermrOvn2l9UzIGi+1mnDBIcsCPLW8G84zHiOAiuasG8ASuCLCmM9klWoOeKFr2rWccKtAEIsoKGaZn4HgQZV4uQdNjGLJyoV51Fwfqz0BnFyYBRj7eLnVUjKcTD1EE4r2LXg4RJv9tLHHaSuihz52U59nIxRHK32/ErINarKNLHKMeLMEIoLI5XcHjJikkAx2YCroVOHXajxd4cc/oa4LgZ8Mi6ryC4rngPMc7nuF1AEABKurBCpw4r9FdFLfP3PrLcn44tL7KLvRau4wcfuU+pOpsMTK4dU7XvzFxNjLJuCs79Jp5XVWFSBUAs0zdXHs897+Fi8UMrV7cphcX6q+jIMniV7LpVyFaBHl9rJe3bffB6o3IbtXmMEMzAU958lhATLeYOk83UwRVy1c+MQc96Xmofl68TFDeOrsUtGi80MAznJJ1ymEAoeXW0af3cIl1QJx8+j7jni3NT7ZNvampqampq+ji1Evempqampqb31C/84l8WLFt9F2POuSfDiVbOzGl0i8YIq3vFeqq2zijJyabtmROm6Nj+bIvr2gt1hVwaR4oEB4A3izqdUJ4dvHSDFkmzG6hCH3OiaE+WM5DjVlgk9j5aTu1WeFUdUVfAVMzBk61+SP/a4EV7qtg1ZS6Wzgrtk021WwzuiMXiqioIsJQlARfMZgAJdCLld3u42B1msALvVcxFRndPLbS3IvgKQ+Ai6wctP8f5h0ts6HueRziYhr7jz/tht57vhye4qxRcXZaF4Gq+GQgiHh6f6MCCOwt/qgsLxwtQGWqnV8my6waWyIsBQprlpE7dy3RjjXPmH3akOS9zLjLlxGJ3OKvgykpZJ+TNGAYA0OLUiRS7wMmK4zjyXmDBO86hdS/Vv9jlTZdTLZj3KE+vwGgz6c9tOrLS2kum8bp6DwBcsb9rE+uck8ZC1xJ1Az+5TovMCvrKpnhdS9+1iL/e124DzGqHVAWmFVK5CuTsuGpn2LbHqu6rM6dVvf9qb9Y6/dBgG6KZvE+sNL5OOtx+/uoUyPr5wmfOBcc+OLqyzGWoQwvqtE/h9RErjU927E1NTU1NTU0fp+bAampqampq+gDBmbQEibkLN/gxDhoVGkrHBe2SF8kGf+acpMvqELo5HuTNw6Nw5puPcppOdNMABBWLfV1H/csKFvAzuqXQ5wSnDSAUisjpiloMKEV1XeHxsGiHEZfhRaEPnFLeJgEuVvRepxR6606CvwXl8Fhwh+q64VRFdf7UbiN+z/yhFqUHQgt9rjbMW+yNUweTZJvcR0jmHXucxAq7Af0IOOA8w+vzos4e2ZSOmwB20AvG/jC4ury6r6pJq/Ph2gnlavwrSoEjC8Ai9uzfcoBanE6YZRiidCnLLgvBxfHmAHrFN+wNjj3h+91Ovnh8Igj79PaFPH7/hzIQ6MCl9SCXcYL5iSAO0UH8XMaZzqoii+TpIl0JknOgi4zxwZwsQqjn/HK6yHgaZbpoV9buEGRAsf2C8vxEYNL7TmaPSGHHDq/z+UJopl1Zeh1R3i+GIhcrOWfflIG+GJ11VhVrQgta7C7X14mV4MufALukRvGqm6kWo1e3lnW1rbE9AC6bjLgWrWN72EaFRZvOtrUXaxNtdLb/tdOL7z1NBJj12KpLUTYTByvwktql5f36Gdvu79qzhW2Zo6zeeozbigIwOKzEDQTO4hRM8f6bK6jK4hcAW8BdR0fegH64tDSA1dTU1NTU9GNQA1hNTU1NTU0foJxJCDqRcjPNiyNIQul6UlgABxGAU108j+MkB/QuOW3xwYJ3HC8sXo/O28J30YgUYETRAnTvAmNKBEmulqqLFWRrsXayyYYybQCAfdUYWSHcEqstKha5I0AI19/7NWpWViDBaGF1bHmFHohtEZTY6j5ygqHTCYFp0ZGK6/tnwiw1ohUmGYURR3Vk4Tx5c6bZ4WkPUu1hqi62ekBOp8QRjBGcGFCxUvSuV5AYnO43XDreSt0R6XPojuo6id5Jb9vGua/HDjg1XkZJMYjfw361yM1xkE+6G+mHXuRbX+Pzlu872X36TL48fyFPjyd5+uGFwO78cCa4Wi4nmWe9HhPglLlwHp5OhGIziswNXuH3uD/O55OcTyeZpouMy8TifhS1A1rt9z0BFmOoRacyoosLziEARz0xOBe4B5nllBBx3bzETcn99d4IjIXqdL9wdfxtuqL4u03srl4CQBx0P9H9ZaDTbyb7bUvTEautEb1s0cN6znE9vF3r6s6qXVp1amKFUrjvYnVibZxVpb7e4NN6DPbc6rra9nZxiIB9/07P1taFZpCso/NRhyr4d6KQmTFVOAeTJJmX2TrNFiuEByT0nD4q6yTR68TNpqampqampq+uBrCampqampreU3/n7/xqdWb0OefDNE1az0TLFZwWs5aNA/wAOARPpwwWyKenJxm6QUavMTHPvqYg0zxZ4Xqka4NxQ76HLXjLtg+rEG4sU7b/gm9Gw2GRXbREagVSOenofwMETjN7+mMtszbAIhYNxLtlp9+vMUTRHimp0+ZY1pXNFVML5otG+bgftnDf7h9BQ2D8qk5DTDXy5cTcVG51zEidXOd0XzHJEecrLVdYVx1qq1uNsE07mpz1c7HEHo6l40H2+z23U6NmNeYGPZ7OdPPIqKDsZr+T25ujiHwmMl5Q2c6v8dMdT/3xXOQ3f+cP5A2A0+NJ3rx5K+PjSabxpFFIc95oIb/I6/Ei8zjTzaXXx/Px89NJLtOknUoow1+SnC8X2Q07ubs/ytvTkw2XtCIwK4Dvu16elgfJrrCsPjCmCFDkBKa3nCYOC3A1VFjq1EGFlPUfdkiZy0hvt7SWv29dTEuNFsJRVTQmW8972pTCVwhWXVXeXFayXmu3Ai9nEzNrn1m9hmvflkFN2UQLcY34/Fqitil5X+HW5h5aO928Tnusv1t7t+w+q7HfZO4vPRZ//dzUz4cBXQ5RcDqogQXtxevQAn4OnPTdwCEH3LMC52Fx735gm5qampqamj5UDWA1NTU1NTW9p7BIHtCjhP9+FumADLDc5wLeqTPoAthhC1s6g9BPBXjgnczzyEVz1wWZxlmWeVQnkfTaHWUuFJZHbyJOWx9NhTZw39TC6mCgp4p9P7GTFDwX/OhUcpu1c91uhTeIJBbCsWUt+YaZSuNp7l0gAHClzd9r1zd3O5nzxadrHM29G5tiQb1opFJxTC0U91oYHxSUlU1nFqEciuGlrOeGUTmDDXyHOvXOeXOswf2kQOhwOMjxcJTDzQ2L3cc0E04s0yzn01nePjzxfZ5/7TPZ9b2cU5BZdvLJi3/m3ZtiL3IWnW53krMc9j1L3X2a5e3rt/L27Wt5ePMgp7dvCaSWkniNRpsi6awrbZoWm7SYZZpGxgWFEUinsUqnsc/cJXn15o26zgCtCBuT5CXT4cen8nwV2e8HLYS3czmO1lu1qTplhA/usqyF76HT7UZzDXIiJu47iwXyHuLUx8xiekIdOMgMAnkDUbkWs8vG2fQjAMlvitRddVJtwJTbgC64pJy5+6oTL2+hU+05qxMHDZaV+lyLAIqVyKPMvX401s/TppheNg6s6v5SOBcMnhkAC/pauvYs9lkw9XFJay9YLc2H+7CPg01b9P2Pgtympqampqamr6YGsJqampqamt5T/VLQ74OV7xDAoRAfRJm1QZVoJdAFPU+9XyNq2WBFtkUvisQZZ7LcFhw0mK43pUn7nQzWrACorsCLWMQw1MGC1MJieK+RPq9T7UJ9YdYi9Dq3xbFTyK1wAxBEu4GyJH91R9FFtSa70lq67jW7uEKZOtWQ+8VJh4kwisfh1IlVS+S5Qa9l5tl6hvh6g1d0pYUo2aU1ppiMzMHllrgfiB7qxENnkcYVRODcOwVeMXby+Pgo+7KXZ3e3BEb3x4OUGOTpdJJxinTOnB4eJYqTm/2jBPFyTiLH45HAqgrgCj/CwfUoIgfZy42Mkt6e5PH1o7x+/VYenh4JsubzE2Nll2nm707z8g6QDLHT7rOg3WIVDs5WMM5YYFFQdpln6W2SYy28n4Jfu9bgptsjGtkPvNZP5xPdPjhHiLkhEkrA6TvG9kQMNJbqmnOcZOjLNfoXq2OK8LWTMs8a2ew0ormNwhXryaouqTrxTyN1eYVMZQuq7LnB3mexbeF9kzm7VtehOavyJqKYNtMFZRN3zAbjaqywlrHznFrx+wrB6nusRe02XZMnOegnY3Ve6fNQzF9fD/cb4p3c/xqRrEDO4DLekxDO+4lzS0OjWE1NTU1NTR+rBrCampqampreU3VB26MySVwcF+0mwuIbC1k8Pux2jCrVbikGkbqIABp7jubLxKllC8GCuoXSPLNcnVPSsMy3rqvqgEIkyVkPFRbW0SYQpjmxCBtF31V1EiAW0brkt2ltAFQWu8LC2giXxsPSYlMJNXIHAFKhWNb8muSkZfAoQUdUbZFribe3gvZQNM6lUw3V5RJcvvYH1W4t9FgBdsFFVvx18c9i+Jn7E8yfhd/RcbWNiBnMqFP1/MaJwz4ovM+SZIgdX/T973/JKOcnz5/LBV1UOH+pyHQ6S+kHmZ9O8vZ7r0SeRrnsDzLcv3znhgC4+h5cVwRXJFpy+cN/LJfXP5DHV68kjRdx6CtbZkYBx7M6q4LF7BYU7ONeKUlmRhUjXVSMxVnklLAS8NEAYDaAycmUVtAvFRJximTRbjWUyQOI7fVcnE7nd5Jq2B7QDvYBMVfeEbhX0Y829Ot1qv1Sq4PKYoOc1meT+tbXVghEEKQAlRAUj9l15oTIQuDLYvvqbsp1Il8tNTeHFGAbzs+POv7qdM71d5sy+Qqv1mOtkVADWmUzSbGCt/V+sXO8Tto0V5jTOQTi4IxDZ5pz1jeH/cwEWZfxbBHYzGuG+5/9cQSojv11iJDunTrkkGZtJe5NTU1NTU0frwawmpqampqa3lN0YojjxLvaH4VFu7pHFNQs0yTTOEm/22t5M9w7gCRYxHsnu8MgT09PXLh732mnFa1O5nCRdC3Uzmq50j4nWQGUI+AJCpkMElQXky7Ur7in2JRATPlD9xYeG3YD3TxwCun6v6zuKGfl7yQrvlwBkk34kzUu5RhnY2eWzwbCzJ3ji3ZnAcqY00gqWLDidoVYCqMqPKPfxiq7iFOKur/wSDC4sOYW7dhQhB/NqYb3D4ziAeYE2aNsG78/X2Q4HMRNmOQXuN0uizy+eiPnt4+yHwa5v7+V3U/9lNzHKH/uJoq8vnCbj/c7fiW8Ahvav5b5d74tv/f735anL9/I+HiWMs3izB2GuCZL/c25AziJ6CiuHbrL0EsF8Di7SU8VnFKx43UHwAk+6v3EaFqh0yfEd+EHJ1xOi9zd3fIx9GXNSV1yaRZ5Kic+jvsh+o4F45hiuU4MZO1V1mvtNCZXsjmUgqPbylsLW+2nEgNG1Vl0BZ42fNJihrjPBxS9T5MMXcef176x1QcokqdpvfZweqG7i91uNcJnz0vmcFrjg9terY17qp4XWZ17hQ49sUgh4pDVHeYNbvnaw2bOxFIdfUV74PA5yz5YL5dbe+tqxJXgsPeMheJ80tlWvHQ7TLqMDJymzYTFpqampqampo9TA1hNTU1NTU3vKWcF2ozywV1kC+kZMTEDRnic4/2x0C0Kk/CFPVSbQmipESwujM2hRMijUMBZvK7Ygp0TB6XYor8u2DPBVAjqV2JczFxcMxfwhb/XBX5miTq2w2JxUWDkoifYWtgndd03TOVLNS5G11fc7LP92qszrD6HcUQ7PuyX9+aOqdFBO3dayH2dKuhqOfY1vbb+jrDFupbo7PHX6XLoc0pOz5PPnnE4Zw1cMTqJReNtAIj7YSf3d7dysz/Id7/8gVxOT9xeH4P0OHfLXr74wQ9kWkTy995IerxI9+c/0/J206sv/lC+/P3fke9857vy8OoHcnrzIGGZZcpJDrGTB06myzZ1T0vaaagjyEIMT6fX6dQ9PVg68BgZXBTqpSTzPPE5XddLF6OkYlE6OoYypxDS8RaD7HcH7Q4LUS6XkfE29C8tmExZDEbB5ZTS6rCqjqPLOKpryMrR9VJVCOnXqZOZcFK7nuKPTB2sRe4EQyHIDu9H0GP3i527ZK+prrlsfVv1OZhsiN8Fe7yWyMt2nw1O4X34PGyjOrYqiKpuPICtoD10cCni+wyY5jXaWwysLdaj5v4EhxSOuf4WkHnoBx5/4v5rPFhL+q3RrRR5Oj9JN3Ry2O3sXr8OS2hqampqamr6ODWA1dTU1NTU9J5CECoBUji/LMUtKMXu+k7GyyjLMjGihYl3iMZhSTt0PeEC+q8AubbwyjubkicaqROO/68xLrZxC9NkmqOz/h2vIMvKszSql3QxbfAJfiUUedeJgAQS2WJbndC5xYU7HDPonaoGkaLT0zjN0OuENbGOJH2srB1HaRPn2sIF783tVTK/r91AdIFhQluuEwd9HYPI7+kkQ8eVGEwwC1oxJxOcXIgvsseIQS4FcqtbBsfntDhbe4ciwQGSlQBx3X4nh/1Bbg9Hef3wRmL00t0eCHtub+7k5acvZffsuRz3e7m7fya/DnfQYZD4ez+U29u38uLFnZx++FZ+/f/6h5Iuo4ynCyHIw+Ui45LlBLcR+8A0Zhe7KNOCqKjjvoT+KFJGLSPnOQk6IZJF/3pNc3a8VnCRoRhcU3Z6zxQAqxorRSl8cXTvhTDIsNsTdF3OT3pPACJ2Xl1K5qZjr5gWUWlc0RfGPaWWkuN+4YTH6z3KSCCgFO5LixXiWgKo5fIjteS1ML12XKE/K0aNIK4TLq9dVuv2zOWFfcBEzwql6kTCFepWT6G5HXEfyAZq1kgjz219fL2t1fnlrCy/bq+sQLQCOG3PIjQ2QI39WvhZBXjUz+KyZO2Q896ihRiSMGrclrHYzM8tvgIKIq5a6uevqampqamp6aPUAFZTU1NTU9N7iqBGF8dLKXl22Wkhd8xSppHL7MDFdODzKmzSLit9D7KZ6MV1WkReO4TWvnZ7Hjw3DNwV7Tuik8pp2XWFVTXup/84K5K3Y+GCPr3jrgE4QZm3Tiac6QpDdE2n+xUpQfuYkJ+is8tAwmLxv5QUKIXNYpzIrU4lLM66sxz3CD1PeBy9XAA6dVpiUVuKxKD+K8myxsMYywRIKG4tCNdepsz3ceY8w7HhuT0cSlldbIn9TCIBIGhK0vc9r8lht5eb41FePT5Kv9+B48nd8Sg/+81vyr/2cz8v8smnIp8fRcZJZPhMZNT4oAzqvoLz6gePb2T49F4ur97Kn727l7fTjewPB/n2d/9ISuzkPJ5lRpyx6+Q0X4glFWYFmdOFkTQxhx77yTDNsfPSOY1SZrsG6rxTsLPMCTcHXUu4dmnWKCA2df/JC/n888/We5KOrLVM3a8OJvweUExL1L3eKRb9y1bWz/uSjiJH+ENnnE3wm2ts1VxKBFUGmUpt9q9wE1MWl2WdUFhv6Brbcxu3Vi2N9xYPRM+Y1JJ2A2DFIrnJyuIH/M56q7L9rr4Ptl17uAi5tt1W9nxvMVRGNG3/XQVrBKvm3jLoJRbjRUS2Dz1/HudReunNWYmMa+JnKiWN3caNwywavJVNyXtTU1NTU1PTV1cDWE1NTU1NTR8g731JJY/O+bm6m4SOlUiwsqDgHC6N6HXK3eUi+51Oidv1O5ku6MiaOSUPCTM4t2qpNR1V3KZZVoo5qRRlca3Oxblov4/CoxqaU2k6zUnIXvu0LMaERTUW1/xDJw9cPYtCtmzvUNThw/dKWfqbA3uuZJnN6YJeoELYtoIMRRt0j7G4HI6qNEmHHiR0gfWdLGnWPie5Hhv+AsJOqKygJfYdJ8epI0iPRd1XWmqfq+fHKZhjoX118wCczHWq4U67vCoQBPDropQhys//7F+QHzw9sPz8G8+ey7/6c/+8yE9/TeT1ayAhkQH97GfZ3+9Z1L48vpF484zbOY8T3XTf+Jmflp/+2kvp729EXov82v/w92X89nd5/s7LK5kJPLS4/TSPMiVE/had5EgXUVkn26HfijHQJRP8VWHXA++rxHEBON6zOYjgdEMhPdx9OA5MKvQxyGk8sT0N0cVtHE7jdQpKi51/w518nM+vUwMNMjEu6Nw6CVIstofrBJeWmLuv9pqlTQzPbSYMpk0E0G1gU7FBBJxwWEGsQaZivXKLOapW8MQJjlGjh3DI0RmlLq1tR9e2H6u+Z7Ey+horrPHILFYKb11kiMnCCVbqxMxNUXwpAFPR7jXA2MhrlqwYH9Mlcc/j8wNo2TFyW4vidYpmU1NTU1NT08epAaympqampqYPVEppcs6fvPMleWdwKMg864I9BHUiocwai2NAK7g7xnnSqXPWj1UjTFIhUNGFNqebpauzhIv7pJMLhdPgUDLtxYwshEgr4JFaYq1TBDEFsNABZp1LOcsEQLAsm9fo+9TFdi2pxnO8+DX6l8yxwldh8Z7rPlrszOn3fbfTHiRM2lvfwDECllmEry4VumPyog+Xoj1ICaXe0SBD2Xa2r/Jei+HXYm86jvJ1GuEa5dTjmDD9z4nsnt/Iv/gv/HNy/+xW8iXK8vnXJd4/k/MwSNqLvDm/lmf7e3kUkZu9SNw/I8gaF4VHN4e9/MzPfovfn8+T7Ide/vy3vinf/c73CCsBLd7Mi4zLIufpwtjoDOiTFkKq6shzpTrt8Ni1E8z5ayRTu/WLjACNCR1UhW4z7bjqZH+8kdANcnvYy8PDg4xT0vghAZBdW4vDFbH7yoAj7xucw9UVltdoH+4DQKqc0trd5MwZ5cxNBJBUnX2TTVu8Xmadwle0tEvvbBxTLesHjIKzaxMtXDi1UyOFyYBY3MKzet8tyxWKGZzbTlGsn5X1g7FxankrhnfWzZWttS7apMjiCocaYMtwBkpZeL8CTPNxu5ODXI8V1xV9ZEIHYJK8FNnt9zZRkiCwxKyTCluZe1NTU1NT08erAaympqampqb3FJwZ9CJ5Py6SHtHs5NXDYvEoXSTTidR1nMLWA6Rk6+sZs5Rllj5EWZbC6XAsXkd7uSsaFyRUUAeUs4V3NW94izQp6DBDCxbpNrmvWAE3ytq1y6jQlcP0nSurWwYLbwIDA0EAHIRJorHBhGmGWJzPtIgRmgGiYEOIs9WIFqbmrZyB73ftQcI5CV2kg2thMxfr6ukqouPLVySgUUnAlwXOlhC5Lx3O53banB0b9p3A0EAJH0t5fRzbnl2RAd1SqEbHcUyzPmfo5eVf+DlCquksctmL3GCw4H5PaIXf/0BELnKWb2DqICYR3l/kxcsoX7wR+cPvfMH3wBRHQJ7v/fa35Xf+6A/kdDrLm1ev5fF0JrACaLxcJnk6PcqUCmFiF7o17odz60NktFIM8EQU0ftA5xgmCOYK5LK6qoJ1knXDTsIwyHDY817Bte664bptxEJTWTucvEUZoc4cTBoHlGt8btMLlQ0mVRcVp0vidwa2hr6X6XKRiMmaAHOcipmuEwaj9n8lg2I9JwwGutBKdXpZ91V9X0whFA5DmNduLDGHFV7Lz5ZNQGRc0YBZdWfVY9Li+47bBWSbx/GdCYUlaJRR5y5aHtUr/IXLbbGeui527ARjCT8+T11YwXLKCoYzXIVJXYCAw/oZXxR+Wa+dJgz/+PCGpqampqampq+mBrCampqampreU3/xF/+y/Kf/4X8gQdwSintM3pXZnC+6GNc4Hl0f88IF8W7Y0Z1FhxHfxq3AhdMHk8GfYgv7IlbQbtFAOK18lojydUCEGuVqIHmjAAAgAElEQVTbdBAhtgcctBSx6W6JcCTlRUu8Le6VbHIaXVWudgLBLaYOI7/2TZWrgwkgA5EygISsBd0ViHiDKtn2KURPV9Yyq5Olq/1ETrvBeDj52muFvq6lWOwMscKd9iABJjgCl6A9SPOyRuGcRQoLz7ZO+1OnlQKcuUwS9nHtP2JB+DjK69ev5Ysvvic//8MnufnGvR4AkoODfntjvVc36L0ancjwWi5fflf+n//jj+QPv/xS3p7ecMrft3/jN2WcF3jI5O3Tk3z55Zfy+vFBpvNJzpdRLjmx1P98OfO69NExmgm8A8yDCGd2Oq3RcJ6V8Rv48B0YkExwA6EnzPqvnAGobujlk5efKBQCdJmyvHr7Rh4xVRHwFAMFcp3eqCcWcTkAJBjbgsU06ajaTAl0nLR3hUvOpgzyj/VLdbsdAVBgPK5owblBMN4D8eqsk832L5eL/oz+tU0xe5062A8KBOvUv1rILvZ80TCl3hvmuvJ2H+K4cC4B2XBu4OIDNGPMENCqTl/UhjrGW+lSK+pow7bmaVIzmr0v3HJd0Mmb2nNV6CirzjnCrsWgH987qXPLexmnmXFCXD848pxz07IsFiBtampqampq+hg1gNXU1NTU1PQB0q4eRAjdg/ZWJysU15jfZbzootdrNArCQpaLeBpUOsl9lsvDIyfU9V2UNGsrEd1VYqttc4jUiWq1BDrTPVW7jRRO0bWE2FyNVuW8llcHAoewunOK00jT2ntUXVNBv7L/iNG9oFExvsZihPacRGeKQgNn0wE5/a1G+BjnihqvkjrpTUuy08aIgv0qJdHkpW4idQMR0mHfWDKfWR5ft6uT/gDrdDqhy7VuW6cfYrIftjkvE3u1UDT2+tUPJfZR/uh3/7H8z//gf5TPX76Unz4+I+T7xu4ou7tPROKsbrO3r+XXX/1Afu/735fvvXklby9PchlHuZwv8vj0RAhIUDZNLMJHaTkcd5hEB+fUYo4mOK5A6AodY4HXIyT49djET1ccC++L5z5XtxnOUz/07GTScvSg3VXi5XiD4vgjXUZwP13evJE8z/L4+EgH15j02gKMEurUfimDgfU+UBefAiuxa5cMkImdez3h1SOn8hbN0/tCy+Qzi/mvXVN1MmT9uti5CnTxJSukV2hZDBhN1u8lBq+SxQ3r11rwLxWo1QJ3V4cmeBl2O57Dzv5mW59T2FMldEZ5G0iQy1rRTrhJkBYUKiokzuKTW4cRsNcKMMvZ1EZMjwye4Er7u/RzlPlZDzzex8cHub+/LyHGMacMbXlhU1NTU1NT01dQA1hNTU1NTU0foBACPEOpSH6Yl6X0sSdgSZNGhRgd8k77r5xfwdP5fObXdSKajdefJpRi68KZnpLVaVRjUgqwtCS+rG4rMVdKsZW9c9cRhrUU25lLZRux4qK+CLeDaBtcWixLB0xI10J3TPar0wk54U7UaaXVXEV7lhBvK7p/fF6w9/da+K3dS3B7aSQN28/sgbLphskmC2Lg3aLwZ+2AgmdlhVOydh0xcslYmVuLxVFi7ul2igbShJCFUUcDKK9evZLf+u3fli+++305Ho8yxF764qT3WijuvZ4fXI/T6SKP01mdSpLlNF4Yb2PResqEVuweC+qqwjGhJwuRykyQJupcI/yJPFeMl2LqoMUG6XbKYS0iX6cD2tf9sGeEjWX14hmvxHlHP9g4Xni95nmiK+zp6UkmdG6lRSdL2rXwiKYmWWN3edNZFoICsmSOq2Bl6LXYvDrx1umDpfAc0GG1mTC4OskAUukWdBJsu2KOrv1ux/uQwNOAalUt469TEwkvN/cBu8UA1uz6+9pzVWFtveeDtlOFqBHUtTSeEwfYXK/dclZgTwiKazlPEiPOjZMueMYMUbiO/fB0UyZ1xYVgkV7Hjrs6VAHXCOeZgBJxRGfl8zr4gKa4EEPCvzfav2ebmpqampo+Tg1gNTU1NTU1fYBQ2s5wko9jXnJeSpJdgGMG8bXCBTTBBBa6Vt6MtTScV9M00pFTah6KEAeT+zp1vWzG+COv5Mq1jBqAiJFDRANtAzFfC9uVe2lBOF7m1zF8bhOhsl+xFD7ZaDqd9LfCK4sy6oaTFV13CjOSwixOqHPqoMLURCz2MfEQ/3OMmzmCHeymTjd0ul8iNgWP8/LsWN/tQVq48Bf1/VhUjLFHuMDQEeaLxQ+9dmAFjWcipgmQFZxN+dMdlGm8EC7FcZIffv8H8vT2jRz6nYIMpTVrQfn/y97bNkmOI0maBoB0j6zqkbv9/79yZbszw50EsKJqaiCjtkfuorL3m1lPTmVGutNJED5dfEZfqo47BFQQNH7QFmr2Gm+HTYJ0tAMCEJmADuGP5x7hYlstX1d9OiT0a3I106x1gcrQ5kxmVvkxt/3h0M+m/Y8/flidZr/+9U8HjlT8TCr7/vW//hffCyXY8fOndYAmQqnmUO30tszIRVsTGVPad6dsf4PKOldCAdzYXVkHaKicrCIraGRUxaXyPXNqX9gKkC8qI/BQ9ynocwGpKiiLdWKWlWygkSEVzYMX1tQ6stHxTTA1pFbje5qXJew8R7faAqYO34T8Pv3x8XFdey1SoRmPx7ZPfP3wPWARQuV5bztAKcoZ/uX3va9bzLtH2AWl5XnOOccbvAuQLCcnJycnJ+f3JgFWTk5OTk7ON6bhAZbP8ucbCpzz87Bar/86hYXoDXvX56ftf/6DAeKYJ/N5Pj00W0oqtBY+oKwatlQ4nAAGdmVImSDAOc6VgWVhLRQMcKVN0YP8XI1znHE71iosnFK++IO6h1lPhVsZg8bZLFgqPxcAqZUq+NLcphb5X7NaZ1ZXwI657F8OxpSTREHM9TDv9q3N9seTSiUoiHBJnpUE71dV5pJZDRoyvS2xKPCeaiyXoDnIO7u9afE7F5z69frFFKrj3O3zn7+4brBv0oZY/RqpavJlZIYRmxdDiYSTqq7cIXwBuOthlXOwU2AzWxbMIjjlQGVjHpKvPyxzU+CQoeuCN6Hw4b3SNXap40yAcjAg/tPeb1dDQYUF9Vo/O8EVrnsELBvjUrEpqwyv2R6PZTNtUuTxygCCZNuLO9RlQw1g1aWUWucrlRtgZ1fT3ynbK0PbpayzyK/CZ45bOP9qRaw8FtoHN1kMqfCqCqGvrowaa8+OC6Bpe/N+HZ0YzGGhlIxlWJgQAahQTgAraCgSo9nQmxL7rTGxEFLSbmt+PxCQf/SDcPHx2O18De4fq56nVfTdQlNk73P083ht2zYej0cqsHJycnJycn5zEmDl5OTk5OR8Y/jwPL1O/2N/zM9f/zKosKrydgAAjuPFnBwEmu+0D356hDRAzfaw43XwoZmgBmoVgLApxRUgicBDKE/C8gT1CpoLq0K0q4ANmwi7q2ZwXkUZWZ6s1aQekaPqBsaGwFWtRUorD+vmuVlZPycaGg5uqKARXEK7oNvSBCHMM7scUCkkXgqjfsuq4rm3UGB55lA/HfSVABWAWbDMrbWognM6SlAL84DtEW14ZdLSOZQ/hmB5Qruz288x7LkPG3uz2qf9/ITCqBBAeiOkmx71Rs/sMpERER2qeGxqDbrOGSfg2UgekG+rHY9rCWXX3rh2zKCaRrsj5p+/fvn5bQ/quboATbzf167bz5ea/aAgUoA4LI3H54tB5lh3gCNAu2juC3jFfQHQhHXcd79PUFcFHGJNpa8TIGHZrta/wj3ndsnC0oHhfM2i+TIC9Y3r3wVxwma46zqPUG2pqRPquAjzn3+xJOJPAG0EWlJijQiVD3ug6QRCYai8Kn6G7K5s+0Q+HfY/bbrFzrcaMemQBfhzm+GUtdVhrNSM5bIoxsB6OQLyAeJaURC/g0y8HX/3CJtv729kx2ULYU5OTk5Ozu9PAqycnJycnJxvTMAFWAXPzxdhxUfZ+OfX5yctX7QRIgQdFi7BGqCN2Td729vr9al+UU4SgBQUP8p1MgGJGRlEgD3iP1XKJ1P+1QI65rAolCuRXcUaf8YdFYWmT4I0Wq7qZVkssurpBzwGQtg9V6gsqx+OR8VNUbaWlEtFEMDHNUUILKedUNZERhEJpo1uut6NtiuHNVI3CQxtggLnMQgybFSprSJwHsca/DjmD1GZ45DjlPJqn43qNreCnXaM037YD+YYgRid/IxTZz1toknxOD1HrFT7PM7LLqlg9MprMgclgkSP/cnweN8flyXvPI913wAnob7yXLOdoI3Ne1y7F489CYsam/RM0CnWHMf+fL/9nigsHLZBBLmHMmrZLmUWDHtjkToKe/NQFlWNRkLBrLBIepMgzuW0E5BVRkBYGLFGAI4AOxv29hxS1l3AbJYI3K/2+PjgevI68RnVLYAb1VVN6z4uGCXbYNgt4ztgK5jdX0q4hs8fpuPWtUaqRBCcswWkpsgb7K5MCKP11+Fa5M7F96BpHYZsuWyCvGXaHbivM74zU7uHW5SAEfe5EULucRY5OTk5OTk5vzkJsHJycnJycr4xyMAqrc75Hi+HDzbf8yjj3e3du20ID7fN29aK5+4gnylq9wEtAoKZlFLMLKpl2fmqQtADINEqhc+dHqZuYd+KR3t8Rpsr6HpZDmFVKw5kECr/er3d9nQel7pGl46WtpPWKrdRPR4Ptg1GXNeQOooqLORkFYdWEagONVJYwZgEROUUQtDDLoZ1KGGWW4qsojwopmVFDlQx2wEA9+1mcawLDGHtEJ5dFFaOlYDFcasPUxS+B8QLIuGaYeGcymX6xH2iEgitdG8BJalw3l1B4Zv98eMP6683Gw2Zy7Q9fC1oe0RLY1uqoriWTvXYtHGctI/OGaor5HQ9+DMAk62dC34hB+389Nfs225tKXyqh9sDODUHl/wZsrnUnsf1wf7AZ5SwUtqylBKA3bZ3FwxbrZY3GyngS5esCtlZdgnPHA4JUsV7aUP8i7Ko3CCoZ1Mda7/6cYaUSsP65hZGkw0wKM9dmdVv5+rXNZVfNng+keMW4Ap5cJX30lQk8DX7i3Ct+775+HgsiAj7Z8A1wKu2bYJ2Yb2ttliVVIzcecrw8nWe1k8vaGjlCs2nxbd3y8nJycnJyfm9SYCVk5OTk5PzjUEGVtmaA6BWbUee0Hnaz9drPcwyAwjWJaiF6gfhFTOKhqAAFB6z2vHughjKb2LG1WWRKrLwrda1CHR3057dn/oDLkWuT1H+DyxP+/4hVUm7XWhR+PuUuqS4lW+6xQrtb0uJhaY1ZhRV2gYheprKJ6LKhAoqP05owngchVoXKaBGhHUz5Fy2quoB8gATGwBVcwtk0znxEptsh1KsUfl107QQPJwKT9/3ZTcDgOP7Ns9Wwn8ABa0Bfj3sxZa/k+qjCManugfwq7/tnwRPhdfG+9c/teAFh7B9PKjlacq7ehMqTW/4E6zENZ+ntwVSkYacLKjKbOPPMQCHx3msfLJoWsQvt6QeVpFzJTveFBAjeIm9AbudbH/jVgjA1r/YQwI9VHQhl600BvPT8Im1iDBy5UvRYni3IiqrLaAqs6KUaxWNheu9AJuyfwY4jLbBsoLXDyttpxKOeW3awyYVlu9r5VsJLhUBuUChnu01/Nymt3VGglyfd3Tnx+d7pofMn8jLKnMpGrEHy4QNeC4l3VbdSlp4+jjGZXekEm1KXejEjGvL78WmpkzurVGO4yipxMrJycnJyfm9SYCVk5OTk5PzzfFMKlnqxvVMGg/MsHZZedhWG+HPB1rv5svMxSgEQcjeWUCHEOgCVQGhCAFWi13k/HiLoCmfBz+BWsSDxQ9/QnYfITN/4vh0h207A87xnwBcVE5REePykk2ZPjgeXo+fEmBJhQKW1HUObFajE89D3XH9jUvg6iYroR5zQBFqnxE5WMrWwu/Z2heKn9JcRXUeBFkIxB4BxewWXj/DsubHA+wxhJrLpgioU5VZD/VZjaCuAytweoYVg+gnIRIAE4BOlyXus38uuOH32hVw5Exb9SB1AKxtpyIKaims1TYftiMr6TzsLTuiR3YBtL11tJMAa8U/dVfZQUkGcFV1XeXsBFa88giuJzSaNt7Hyh6D6gcAkUqpq0dS4EZrFeBIjYCwTw5mnDdZPL0VcChQnc2PsGmaFIBs3BtsYGyCrryHau6zorbB4cAJVX3kVoJNQ9ZH5GJ1J4W+5qsp87K8loBXVAlKXaYraqFILNFgWBZsrWrgHNNbNe32vSIJE8hlptzo6+9p/yRcdUgKYAkFoEm1Na6vFc8TawqrYHy+i8QagRxVd3j/s8keejuHnJycnJycnL89CbBycnJycnK+McweOqJZ8Gnv08EFFUpW2ED4gWr+6u15H88nH+63/WnlfdL6xnDwuq/MIVsWJX94DkVHhFMvpZWSs5lnpNeGoou5PkVZT9MDqGELdKXLyYfwdlNyNQEBWCLbCotvDKFmcpcggauAOtUpDVY2PqYLCp0HIVtkGdEGSE5yha5vzUEH1EJ44HeI5KoVBIozk2h6hhWtYYISUKs1ZXoBYVR2CBYpva41a1KpQWUF5dHP9y+39BGw7bwPY3owN9HOLAzdR2B7WRlixXYBiUGYNxlWjp+h1c9zkRx6MOweSrbpQOQ9ur3eb29nxJrxvh02bOexAKmKbJRj9hUUXnHtZXMrGvOe1NJIZZU3PtazL3uaBdBqHrJPSxrXye2osInimDX0fNhjDLMfzDBjsL9XTa59cijwvW6VKkEAT+6Ttl1WRFjycL1FFsnZBXOUm6Z2QzOHlIRLkR8VTYe1rn3nx4qwdjUg0h7re0LyLqtb3BknX1i7Aai7ucLKgdBc10pYOzxnbVS391m9WjerFFP8QJYdXGCSTZLmasId0GoF6W+Cv2WpxnAvsa9wH87zl5VRVkFCY9Zdc3g2B9WZiEfz3LcMcc/JycnJyfndSYCVk5OTk5PzjZlqu9uHqzCUIS7YpBY/PLzCyqRGwcf+sPfxttEPPmQfhwKmkUBNEQjoQvcndUIbz3RCRlXZrxZCVx3pgboqpnrYyhkCaOKD+g0aAAEMJlFVV18JFnleVXHrlTMmD52fc4Gc2j1DKgZ/V5UVRWjRHJd4iHexNhywXEDLVj6UWUAqHwaI43gRSD/jRKZe277kIM3rchwwVc/hguaMCrAiQNV2v34cX7DNiivcqOZhHr6Hw1O5JIiFfLEiwEP7Z4lGRc/8QrthWWHhrt4ZoQCbDtlaFeRhCL8rndDISA3R8A9jfpYaKnmPBBzD9kdrHkCgwBDuGQHeROD8EOiZUiqhNVA3D2tFMAUF2cmtZXa1By6lV6v23BzGEXqZX/cGa2M0N94yp3CfZjQACua0gFE3KOPKOr0n/jznF3BTZLENcObB/ONSHsp+SNDZPPPMQeiUfe9rmx/2T1PYe7UoC5AlsPr3Jkx7uAIC0eaB7FBI4f5tzTPbsIG8sbLelICCfbI4EhZuXthwQmEFpWAB8HQlHlWG3AfF1X+CwL5cCbBycnJycnJ+dxJg5eTk5OTkfGOK8o7wwMpA7JU35I16BQorqwQcvTd7fb7sx/MHgQYUMX06rHm/wkomZcd0413X8ZpUOXZTYrntz616br0by55EhVOPYGuHTVR6KWS8R0C8yZsFYLHeo4frHoHbVUAt7HpuMVuta1ALdW9RLHyod4AyoCiabrlqaiV0m5Yyvqq3BJaqpkSpbxQJvuAEM5fU1BgkgaHiLRRODjSYnVS8Iw8Qj+s3vX0Qn7PtTeCvOeTTZ9LmBsggYOdZWZ6lRWWQ1nlGKFTxvLBGcIZMsLdfxzrzsXK+oPDCWr9/vRxYKXerMutL+U/I+/o352aR7yVwY9JyhUsOr9tqkUKqcU3cDieQ1h2C+u2cCiWPbCnPryrKWHOINtT46CC0+duoMATQ8ntTvDXTb4jaDH0fxHdgqtXQdM/Ldv3rZRO0ojVR4K2q0bEogN7UhBiZZw7sLugWVj+/SEqdXAkY8IuNkWU1MBbBq1CHUeUG+2aZBH7DujLVpAwL2MWvwEl49nD11AprZ3PiLkUWFGaD0ke8w8Y43YIrAInQ/X98/HBgVsq7lDoTYOXk5OTk5Pz+JMDKycnJycn5xiiEerbW3gjexgM7QZGCu6cCqKFTgbXsH//4B1+DDKZfv37RZjROVxXt7cmH9THO1cJXlXHER/awLRVvRcMDNAHHcIsc8sgjKwkP67TRTW/B43+qgzA8qEOdRfCjRKJ2z5Nmg11lFlZfQeuCE7Xq8V3uLgSRFwRvT28uBAS7HYrqk5uiqjQ3HCIce/TVecjf11Zv2UCFiqVWXClFUFaVizRc5uYZTeWyjDEi3ta6o82vKHT++Xja5+tlz8eD4Aegxj9KCi9Yvc7BdQEggTUNljFkVj0fu0LnkQXlVjuGeGN9jrc3MBISnitPqm3eYocOPAa3Q8EGJESIAftk/71zQ27U600Ayma8ilWM0PzLwsmMerQ3Ds8u8zBxQL6TgIvXNcYNCtWIEnNVFoBkq8EupSCq3ON3ZZZVX3vstULF3XB4BoujubKOuWxjfLUZMlvLVYKnAs/vFr3IHzNZQ/3ymm0BN5kX1hfEWkov7vMie2J1kAQr5tnXz/ldAlxb6rSy9rUr/aZUX+E0LEsciQbNessWq8yDQ6nBpSCMRtGTIfuXHg1h+Nv2yBCsnJycnJyc35wEWDk5OTk5Od+cqRydKusRG/7QzycVSSesGPb4ePDPn+8XLYQII8fD7WFdtrNTAGdFRGvKaperehiv9W7F84dz2q+Yu1Otu4QLnj8+PPOhHKCrOrZym5qHYRcla/uDv16nsOop+51MUw7Miqt+wEkikNt5nau6bFkDp4CHFGnVwRtVXmUw6H2OuUCNsfmtS5XlAel8rRRHrpBxndNU0yFzkAQrmGl0utrLZIXDfflAFhTuiQK55/KRqQWvuXoIWVg2rqY6qOICqDFonDYzBz1dirYiBVlAl02QjTBOaqlTdjo20v2Hzu14vVUSsBFuVtomr/wyqrWonKrL0jppZ/XmTIeJqvS77aOuEDKALmwpwDZAplDwlX8DrniuspY6TAxlXb1AUTRUikJR2UYrouyPfjBXbN2PH7lvsj3itbgXkal1Evw6BBs6P6z9JtsqV6zJdBvKL61HXG+jlZM3lZfjp4g9Hsq3oXNsUmdF0Dt+7vfZc8jOBZhh3aStEBbNx8PbIBWn79+9M//PbE5OTk5Ozm9OAqycnJycnJxvTK166PYMqRFV+Z6N5KqZox8EF618LHvgc3+4oukQYGrFc5TEKPjMDgXNOWzb/GE8lChFQGEcsroBltCOOGiJmkWKjz6vXCaFqON4Dgjcrkb4AmVMCQWOwtNrZAEZrZB8+N88KyjgWmQ3wU4XVkB+7vB/MmeoPtwuJ6YFlRoohueDgTd1hwNquDMFhbfRrD6gjilUzYRCq2oN2MJYXRnmwMZBQzizqCySBa0qW2pvmzcTmtrmqAQaBDp+/dPPkyqbQcgI4AarJ3KXoDar3bOYPHgex5C6bboFbWUowT4HSLQ1a1A3DZPa7T97bp6y36RAEzgbruijKqr6uZQ2rR1fzwEWRlNWWhFU488F5LbHbnU0gq7Z+7LwmZoXPYDMYRggJ22FAKbjtpe6r9tcANYhpeeLdd03W/AKqqepfCuLhkEFr5sA1Jd2ToXolyg8KGVlbxWpBb250K2w/J3aG2fsIwa2e+C7hTVXYI8WR7gaa6dNkKAxctcIKM8FkxmSP1y9WKvnmKGREtleBcq5OW3falYQ5uTk5OTk/IcmAVZOTk5OTs43huCC2iSflaMjJcjxT2+ke6CJUNDigGrk+bD2+nRVBixF++7thcq4GracTUskQ3AiQIEn765cqqfsWcaH6C4JyVxgiFlcxaRuMelP3A7nypW5WtyQLk5OIhUU4ABBjaAEHshrU9ufctuXE1DHBDDwHKli9VlpZUSW0JAiKULep3KUCLrM88DY3qfcotW2R4Byem6RmuMIu6qC5KlUMirPqLUZHi5P8DAd9jBza1frohUFy3dmW3mrYHXwFjV3tdiPjz/4egAeKnK2h/+bEpQ2zDkaK6uL8WQGWGkOu7gc7TI1VrcC/l87t7ZR1RStloM5XNsCl66M+3oOUNDRItpt7ZVtC/g2F8zhvmLI/LUfleekfDMp62jtHLQwxn7yxkjP15orM8vhGYWLgILV//XTo8e8EKAEmCrRMFn8Wk1+PvP1a4J0kVvGPRr5YfoGYc+yzRFh+gukeUslvq/dRpQdyq5a3Aq5cqpcZdZlu8X9qWFdFbwGDN4IFCMjaxI0AlQTctfrOrhOfZQv0sOcnJycnJycb08CrJycnJycnG8MLXWtzn70Fx6iq+x8eLje+KC7raD31nY+6HIKcoyeNu3TQ6DPcoVkDxIjhyBbvN6ovGIuEXO2XHWFB+UXXzBXbtC8BX8DSFCV0qWUkVIHQGH0aA6MFrmqIGr/ez9mVZ6PSYWllr3u2UgMhCcn8NeHvWyMpvfBXlYWiDlDTXXLD2LjnRQt+PGj7fw5oImpFZCB42EtKw7yCBEU7j6PsC4WhygKUfeTUdj64dlizWvkeD79om+uMDtCQQaV1OC9cGXQqZa95We86iYBkgTWam0ygDpoCZXceYbq6P/euXVz1Q/AD9sXo80wlFZ/OYcdGWrn6Q2N10fJWui2wACEpjysKajY6r5C1k2h+WGfqyoLcCjWtPdctQQNVHk8GB6PXK9JKNQcbDW34A4ptMJmOdVOCUhXot1w+PfLav3SjFlkdYzyAtpL1ZxY9fOpIHdxXH6PTurlqjLXpvZyc8WjB6A5fMLx8XdsFWwqJmCPpe5TpWpwHif/DorDx+Mpi/Dkrej+RUx4lZOTk5OT85uTACsnJycnJ+cb47lHjaqq430OKp3GtBNAgqHV3VviqDIparyrbI+zaNgrly2q0Ep1UEkVWUZEJmqBo4WPtrELAEFZ4o151e2DAaT2usr843NjpoLC5ywLOlzqlCnrltuu3m+379GKBYVW8fPCKNIAACAASURBVN62Uvc4mgLYB0EIH/z3CLOeDD3HzwhcpCLC54Z6JnKT2qhWFaq1WunYimgrN8pD8Tuhl0Mkb1zcWlsNjt4yN9f6eX7SVBZYsV6H7XUjQKECjMftBDym7C/AF9otpega+mVSwj2QXQXI9j7l63Ml3WwOVUIlR8SIdRN0HP+Xz+2yUDrgNCmR/t05YN8wyH2a21RjD03v2luwzsqyeFLhB9XfsxEMQTUYSrQ5vzZHuhZrrLwwAkdlZvE12BNdqia1B/L4yzEoILqg2QWrXP3lWVpDeWHxazATzVVmnj3m30XmcCEmTQUCoYYqAdfqsLo/ud5Yf+wzD2eHkq3p+6DW0VIuyBbthMh143X6eUNV+T5Pqi8dXBXaCHNycnJycnL+M5MAKycnJycn55uDFsLRx9thjQLZmUPk9qkqK1hAqcaGvbdttE/J9mdDD+f3xjK3eF1wRu1oDI8+CBBaACwBHgKIGoHVjXDCrX1uu+sLTFQJmSJk3Ud57g6lTBapesGoqfygdrOXMQx7eIYQLWhUVVWqVGAtQ5NfZCgBGOCadimyqNShDQuvN4W2T2/z+9KAV66GOUEWBKif/Nxptkeul7fwEaJxzU+pmTyHytHM1HW6gq0wDJ6xVqt10XPHmsDRXNdKUAh4RnXQZrP6ihLmKBfsrpLDf07AFCirBFjKdICHm4+Q7//ouem6Yw/1lYGmvxu6r8PPIVRaVBTR3tmp9OMePR2s2donuF8e/O5h/g7UWkVO2MF7cS8X2BnY32XPq9rHl7KOQrZWr1B4EqJbw6AgG+GXVFRYK1x/DdB2+4XQenwHUJZQeU7dGwpNVtMia1/YZa2s0gHCKILHIbVj8ewzfd94ery+tr4HbnV19SBtmhFShruzV9uffzgkQxtm4/ngQh9lznLZE3NycnJycnL+7tRcuZycnJycnO/NnEQrAFgwy0mV4moS2gPBDVaGVLOP55O/HwJcsIYBLjjwUIvh5pCkBeTB+z1A6su5IXcHtqdTD/eRycUCwuNcOVJRDEjFi9QoYQFk4DweyqHI8Xwe/t4FQh5MHoBsZf9EFFGtamqzZSMk4GrNtv3B62ityoLmAd/lBuJMKiusCa7FlVwm3dileEGOFqxtdbn35rIolpsabSnZqqvKGPEk1ZBbuHwN/b2COTeWMLuDmefjSZWXM5W68o48v0rh36XQhtf2jWDDQ/HLLQvKZOUsqxWPAevzgij+2uktdv+BcyM8637fz9EX4AH04Xns+1JKzVARqe3x5HtczdV1flUthlRRVVzvzvy2YQ6XTKH7fvv9fjbBoKp/whZZZLcs0ah5ygtpl4qp0xZYCdBM+z5UTnP4+bXI+0ITocLhq1R8VYBsdIXqY3vu2zo2FYb6+hBCagi99p37vKuh078zRVltDtegGKvK5XK1oQOtaD0ENOMe0PchAO6O7wGstscb1/6stZbzHEmwcnJycnJyfnNSgZWTk5OTk/ONYXBzxKZDTWLKQEIwOoK+vcXfbVHeVGjtsds2h72QG1SL/Xp92iOgFoU9zWq3pXJhjlKtdpRTViWFhsNKNsYKe49wa1fXqJ1uZV4rY6tunrNkdlnYBH5ojdLfVLXKsVkQbYbKw/rr1BWmjQwmz8PaWlmtcse7e4vg4m7IshoCenM1DzJ83FwRFAqhegNSUxlERZCiTg+l3wTQhmCNMfeo2ft9EKgA4uyEE41gp0mFY7fcJJPlzpU387KAmkBa8fMMux4aEql2a9UebGhEhhJyz8pf4Jw317nt8byUPNoLXCydD+2UAnN/59y4hqXbZk2Wws6/RwbT/nja6/UmbENWVZddL+R0nkPl9lUHbhbyKP875WqZWhOx5/FnHkvnynwsqZIINQXlCLIg2jqJHAVQ7aass0tZVx2WlcjuEgzjtcmmOCKoXnslVG04LxpaN2/MxLlRobgaEd1a6grFuhRgLZoUG6yEAG1ncDWthSuuYEN8KJC9VG8cxJK4qlLf26oKR3zSGxcpC2Lb7PPXL5xP6aM/YIoNsJyTk5OTk5Pz9ycBVk5OTk5OzjemtYAZ27vVPghzNtjCCuGUW5u67ajT3xpVL7AKUqnVjwVd8IDs6hkPhY7wd0KP6u16bClsrpi68o0UWm22QsSdgXhDW8QYUX0jddPUn2lb6wFVPIfK2welOHHPn4WjccrqV6aHXttpUr8o6F1h7t64Ntgq52BpqFkPdrphXtk41JBoXA9AmXfvrlSxyIQyvscb3bqrzZo3Gq6EpuIh9VOh4HVzEDTVGqdlsdf7xb8ve/P1EwBbiq05pJSqUmq55bFHDpc5jCGsOoftsIRBhaR78z66Wy1nWyq5fgNRDiNd9VZlh4z7xz8vxZirsC6r2//3uZUlr8N9cQAU9/Tx/OCa0nbIpRdwOf2aqu7LnU3i7fgsxaWvhs2i42AvR8j8PLvso3Mp3LYhWDWG/fHjh78GO2Z4UDrXsvg1b1Ja1VirgFLD9++gRfbQeRa3WJ7DjhG5ax6oboKuVDwBrp0nQddpV0YW3k0we87VQAjoNAXVxhQYbGWFiU2tNfPnaFsdBLrLAUhrovLfYNE9pDIk1Ov26+fbX4bbcz7KVtsTDYRpIczJycnJyfn9SYCVk5OTk5PzjQHIGXoQx6PqAaXN6LIXVdsemz/gt0brFQKhEcR+jtOO4S1sIyxl/Gd3NcvrcJsU2+KcLiDzqEoxQvxwun2OcUqSs1BlBXtZb9ZaYbh8NKRZWPKUCeTZRq4Ys7APcpqHXNeiXC6HZ5ETxOnds7iGLHzdWwRLbX7to65Qa1PoNfRpCKgnZIHlioCu2HN/UClFeKXsqCAqhBuzrJB6QCGcE9YmgE9RJhFXhYFRg0qoFXLOgP03lTAe1u1qmQnYFIRvjKUyK8obCxBkhBqbIJDUVbIG8h5U86D69lUlN6UkCsi38YNlMVRAPu2QyvuK5rwZjZD/P85tf+681lOw7n7OeM/eIpNsI7yy7vZSwCPPS/f8JpeFzS/HcOhWrswxMRfcX0LHfoYvkFK8NhwGnbpu7jPsGzVrEsLasFVNAKBW5rL/LU0S1qwpy0v7L7K1+D1pEFqVBQhd5VgcXm1uL2Q22qmyAoXsjyn4Z65k+/jzg3ujx3FVwMAPqH6/Bq/lJHgbAoSmXDps+V3nie9HPw+C2MiiO48uCOv3dgKoHe/n++h13u5TTk5OTk5Ozt+bBFg5OTk5OTnfmDk8vBkPwQfUOQeUR8OOfvAgVGhVNcn10x/gBWI4pdpj3/gePLQjwPp9vD2faAVfV1cWQeExhwLUnSYMhZQDkNVomLOyeATtWAoB95BzB16MOi+Nxy2ng6bJQOoRehE+yDNXKQQ+Nu3RPCTd3HDlr5e1DoAKoOQYDplqnGc07QlReAi5Q5c5HJRB0YTVKUO6qxZteMpGItzqDkYADJHpxFbHLihVCAeLLGzOVa4so+ePH34Nw4EIVERYBAR/EyYwq8lW4PsI+xtzqOpSAIFI1Nm4tgHcoAhq5d+r5KZ6INkaqebBON8YNghSyWNquLtleZX//txw//CrS9Hkfs9oSmyuFnu/Pf9rEx6qnnmFz9prWUq02B8zVFyt6r7530ce1aRF0e8voRZUTwJWEuAplL0QDiHAn6Ssua3QFApPq13xnLgH86y80dAs9qavw5Cl9Gpu9LXk94dWReWNRUA8zuX1un2/xNhCJXU6vMLPaf8LSCqou+4K9pWA8Favfz2eyj7D373ehz225mBSr12vW/bIQQsnAWP1K9ifj8yczcnJycnJ+Q9MAqycnJycnJxvDB7cjzJX4DhIw1nYJbgsT1VtdLASAkRsuze5EU2VePj1Y7m1ye18bW+IUfKQ7PdlR2NQNJ6kdzPnZFJfIXBb+UdFAo9ofAurINRc9Ra6jgD5HgAHTYho9usOZPCg3x6bt9RtGwFDPMCzlW66mosZRM2DzWkXXIoWP6+qvKJzOjDAZw3BK57e8M690l2dA5hB9ZJ5kyJeS8gwHLR0ZjudnrcUDTSAd7f2RgCu4xirza8pl8rhRbd+Vv+bPhZg43qxBdFW3le1S51EKFcLs5A8jD1UT66EsptKzi1yDpTw+duCG0XqL28jHOFWk9Jp5U+ZlGXLLPn13ELA07tDH8CiUh3ONNoaPbC8Dw9fZw5ZZEDFZ2E9uO/qOqcpOyCtic1VR1Pgs3si/heAyoB22EABAu0KlceibI+d50V4h3OnfbL58WXpi8B3hqxLWedWzXlZRGdYFN1OW7tDXM8aU0batSBSNkrFRZCmTC19F0f16wQohtJwKa2EZglloapD7lXdeT7nzQ4KRSCUjZ3lAzvfT9sic8jOaw/ujTZaqMAATA+qGrdHa1s9j3Hd2JycnJycnJy/NQmwcnJycnJyvjERxlxKfWz7ozY8sS4YUQhnTgSKf9CExHysGAREEwQVr+8HRKDmh++HOuUvz7fVocPQwzzASVOmE5U4c9ydYAs0seGOoKPY8/ngg300JYo6SV0TKin/5yC0cYCA6Kom5VR8APObbjAjFCjOYBxuRZ5RualbYAsrynrauEYOvsZ0YDUj8b26pctFWTc7H7KWAGQAMna3jDF/SOosAI63gEOoog4lc7utr1iLzwBzHFWZ3mWtB1VcCrnHeUYDXtgSPb3eDxAZTMVlPA6KxlzXzEZIADc21bki6xRQi5bCGiH7CMKHUk+gyEPWJ4P9r3O7bKQm+yCuf9MqMYdKai/Cq+mZYrz+Or1tT62DvtdcKbja96Ssizwu6PBwX/xzOoPUsb+b2vjC+xctgFRn6di4N8jAmiS0poyyqWD0wT1Fiy0BnCsOGeYOS56gqzdfVrcnHgdtgqUgrP3UnqkL/kZrYXWfqL9vKNtKzYiAyzttht3hlWyeVV8ewrVRBAJ17ONko6HD2OENn1IHmmyfps9lXtbRuT+IIK/mQ8++GleDY05OTk5OTs7fnwRYOTk5OTk53xi2j81SqGYZ3nJHS9HjwYO8f/2yn58/7R+w6iG3qRb7x8cP+5/H/1p2PmRVuRVREAjQoHmg+5TdkLDg8je5EknKKDNXaVENUwE0Jm1lVWodCGBOqVqYRQSAQCfWxiD5k/ZFKcGUlzRXAPpQwDUa7vZlgftrK2GJYPhoNIz2vBt4ovJGFsdQ4SyVFiyQgmJTSiuodfjXXY1wYQ2cAg7Voc49TsgVQ4JxymGiXRAWz/NgbhFToIpsas3VcbGGJisZ1F5UKq1mQ1cuUeVFWU1d1w0QQgB4epNekZqnq0XSs64K2xFN9yeUR6VFtpOtnCcohprUWx7ML4WYYKcp4L1K6YT1pC1z2rpvJ3LDZGWszKUy3Yswcur3VIKFAq2shssAZx5MP9UK6XuzuMSOf+eKP7cPum3S4dUM9R/WRrBw2ULVGkgF3PzaughlUw14pvMzbZNOJVtTQP/hgK4Uqp8Owa1Rq8BtpW3XNVXGfDITXONxm9tIvUVQsA+w67aPAow5aKwqIvAAfFgjt90bDwug3PskrKaL8xZi7/cUOVmwGj54e95oSKzpIszJycnJyfndyf82zcnJycnJ+Xvz6H00tudJVWPD4crHxw+v9j9PqUccDP369VPh2IWKDs+oKitzyPQwbsqL8pypyGSqDjmG2+AiH8tddP4wbgGTSrXnvtnjsatF73AANgMcjAVEyvrMapt5GHVTFlQfp7fXEUhUKZKksup+rRFQThBQApMo50k5TgAxUE49nk9mFzFrKn5ZWblbAa2KVEtleFZRVa4U8qv6vbFPCikLE57OE5/DLDJcU3WlEwEaQUe7ZRdJh1UuOGX1UuVASWTdf09FGz777FIhDQdUBGabB5FXt8g57At7nY7dLnjlIe+eyYRfEcg/yiKDrrZSNhSD5CNwX/sgPnsoa2wpf2h1lP2QMMYEkVwyFutFK2WoiUy5ac3VWQSHutcOtPyeD1oahwvVdAxGXOHP8TO1UE7m/PsejX05ltX2mgjcL+NqFwywVu26T/OWidUVEF/vh6rKpjtPKdEE+KRawz5993PBtwiqH4KphJVUdZ2uDiyTkAy2QkC6dv9uHgKfw3Pfmu6zK+50j9V4OPp4P2sbP5572gdzcnJycnJ+c1KBlZOTk5OT842pBS15vUTrHB650fw2zmqnLH3tBipmabRgvY63Hac/8G7bJojVrVe32/GBF/YrABNa/q7nXcAKBppTZSQbHJvP9AKoVLrnRm1SKeFhet8aH85haYyQa9oL57Rd9ifPInJrW7v9a0F81iweQo9rXPDDA6qVw2QEB5ssaVBzIWsoQssDPCwFSqiwypVDBdiB4Oyi9rmNYGOsjCa8lllTAhyR7xWhQrRl0i7ngAXKHJPFb47K8/RjdSqE2PoX0OymCiOQ8cpGDxQ3V0ZVZXgdaJyrDknQMHm+X7btOz+vy34XqVy0Db7fq7lx33fed0C4sKFS+QZ7JJosb2sx5lhAdLRYh8nrg9VtrOyqLiOk3xtXhrmSq8X9mnOtVwyVVGrmMzUoFsX4V/uqrPN1vMLiLYDYiGXzXKq437imeG/kWJWmsH2F0VuEoGtvEDbC6idbqN1ywOa9pTEAY9g/70CVYNGUe6XGwuHnwP0nBeNUg2FYLE3gKvb8gmYT+/twiMzQeQW/jwCaCrWHlRfwbbPLCjvN3q9f9uOjTSj52ta+3oCcnJycnJycvzUJsHJycnJycr4xeGh9HwcA1oPB4e+TaqouqxJgx/vtTXcP2Qo9qL3x4fsB4HG+aUc6kJWlh3pXaXXazYpq+6m2UbD2UqXctNND8AaZTicDeC4ggawhWKYIX9pwtY+gR1H4+lCuNODYPz7+pLpoXYeVyIoPbOVATh/cj4OwBFDn+Xza+/W29nzYOA+eBm1YNytZP1z9AsiCdQEYesFapWspkTcVNrrmyqhov8MxqNCaUxlPcwGDLntjbZuCvt2S6EKpvux4AC2dmUo7wZyrxqpsZQpw73OtLddmeEMj1UXVM8b2jw8eb287/+6Q4mp0z56qApSR0xTz/nx5htO2EWbRsgaVkhRnHvRO7sLzhiHyUeu6Tlg/Y3DPCEOxTxaQsZVvFsHr89+sl2m9FgC0coEp3jDlQkWzpVRaDEgX3AtgVRfgUx5VqNuw9mBVQxlv2MsBxKY3RfZ46VA+l7kVEMrF85az1UqcadHvbX2e51jZui4qH4eXEvTIEJNyK8By0XowbL+UdX38XXVrK9eCRQcOLwlo9fNWvIWU5Qpo9qzTXi/lmLVmYx72Pof9+SfB3AunmxbCnJycnJyc358EWDk5OTk5Od+YInVHnfZ87o96Hm+2+M1QzUQV/767ZYph6jsVOB8fT/v8fBFSPfYnYQDUPKEs6sMBSJedCslO66F4uBLKpBoatywowAzPvpo3q5UrTpgV1D38OoZwRfavsBUiJJ1Wqx4h1bayovwHTrLYMucyM0KMj8cPt1Epd6oX5QKd/pk1QrpleQzRGIAX4A1hTq3qbzTlHQ2FnHtDY49mvBn2LFcFzaqsJFnkIgSd1xEKHmV/ATYO2eAiiH7atVZU6iC0u7p6Desy+z3S61IFObypDNQf3UPkpwAXlqfSOudXVJTPhfsI9RUUSgAiNhuv/woirwKYfi8B/CzsjzaXDTKyz3ANAHZN6+PwJyx2rrJr9b9ZL6mI4vVK4V8ZWK6s84y2JijYGpRmb4eIAXyK527JpSdDZl0wjdbPrSrsvBCVDVkMsc18X3QHsbon2OtLFVjsBqj8HjMQXucZW9rD7ctaS6gQh/KzTHDN6gW/uOPnXGozwrWuTDC1brryq1G95qCq2Etgusum6xC4857i++NZV4c9Hk97AnK2OsveXmXFuufk5OTk5OT8ziTAysnJycnJ+eZ4a5o/SDdr9nx82OfbM42O86Rag8/MtNMdVH78+Piw1/ttnz//p6uLmlro1H5HdRNUK2wz7J6vY/HArWyi6TlOQ8HqZXrbW1G4d1e7Hx/AWRbXPcR6KBPIJqv/aaNTgHwbDhWgGhvM+gm9lWcWeV6Wq5kAkL4EtU+pUKqDDpzA6NGG1xyE4Jyqh8jzoR+mMjzsI5erVcK1vT4If7hufawg78Aic4Q97II0EUI+lBM1Vw5ZdwAIwNGg+nELZrTvbUUNgrKVmdoGR1GmETO4zGovvu4KVMf5bwolR6B3JTiTXU7grAleBpByNtSpRsLPPgA1wqrI3LJGAPTqb7+3lF7hf67GuoBeVCbhWJ1k0fa6SWHlls6iTCycJ9fLL1JlAFdV5dAaxr4ZstURMHVX1rFI4HhTWfd6fRLInKfbJMvNjoimRLbzCU5CXQhgebx7uDIdnAX7k1XWIdlgyH6rVRBuKntMDYKtyhh5KcmKAGrsb+Sq8f7tux2v97KpTlkaWaIAaAlILFB1tYhGg2BksRmVW/MWUF+iZEHngevb6mXRhHX28/PTPj9/8buNzz2Obvv+tB+Ph99jArz5RYmXk5OTk5OT8/cmAVZOTk5OTs43pnavx3+NT3vBOgiw8dgIPF7vzod6NtKdw8rDoQxAxZSaBNY+qDVe58tVRbAIdrX8VVu5Pau/D2BHaqiOrCjABUGLLoiF4/fp4dNFuVY40TYipFxKE1nNzuGAACADajCqxfrJPwf8qcqjGpE5BbAERVTzVrioinNVjsM3gh8pbVbulT63ToWLO3Gyj+3Dgdrp6rU6Gm19oZzqI9RarnYCd2qCIW63M7fCTSmUpMKZsqeZf8xq8QNYADDb1SQXSrMhpRIbHCkxA8g4dQ6uhqJqC81zYabUxU4q2+4ZXJWNeiXOGhbTg7hRtjUHZsy7OiMIfHiTn4APlGLIId8fGw/CUPJYQ4X4E4g1gSGGr3v+GCGQ+/v4+WxdLLbUbaagd2FBNTxq798aFBvX6cOLA9r1r4oM9jdlrSm3yq14brHEhx7vF9dt23aHPLquLjjEl+me3Y+xcvXN1MgYdkgPQ+/dQ9VxTdhz++Npx+eLRQXIeCvTWzzXMdDQ+X57Q2fANXw3tJ4muMaGTvG1AFpQD04/EWnKPLYLhkJYfz3QHdlWxezT7PPXJ0FsE2hEEDyUdE8vIXjXUtJCmJOTk5OT8x+YBFg5OTk5OTnfnLra0uRYw8NztNNpoMQCnICKhc15yqDCQz1Dv8OqN2RdolIJqo/xpV3PIve8edYVAFgZDlqK4BLj3akG8yY0qK54PgIftkCDTxWUQNYQVTUIYd92KqNaDYWKg4xKlZPyqXAdsyu8vlIFdChjira4YTcbpWCLlE8MqJ+HVGJuWwt41VmB1835SzzoD1exAQrhPEqE4psH1iNQXWoeXvvWQuazVGIBR/A5VJsVW8qtqcyquH9l/d1cYM3tenbdJyiHdI593K1sssp1ZTkxm2nY+Y7Wx6K1duUWM6nYiLcptmyqgdHPawMsk51uqHUS73GU5+uDdjyqgapnRJ3d2wipKCp/c710LUtZZ65ymlgL88B+ZFphD4Sybuic8DtYaQGXKm2ADgwbc7o2V1zNy4LHwP+9SWjnVktXZKklsricLLiP53o5zNo+PpgpB8unb5Uu5dlceWm0nuKz7G5bfXmBAeyvW4TNkxIui22J3DLcR33f2PqIIPparvZHNHQOD3XHdcAqzBbK5tDv9XrZtj3z/7Tm5OTk5OT8BycBVk5OTk5OzjfmMORfjbIVezxqrZ+f3fr7pO3KqNY5+bD9fO5UdxzHmwfvTKWOnjejAgew4WR73XC1xxgLpjg4ukK3LbKulAPllWgmO924rG5jrBDq1fRXvQHOAZQrhs4+BK9czQXFSIR8t7CjhXmqXkAtoI2fz7Byy4ZydZSC0VlhqJ9DedWjGbBwjfpxBbUDrsy9LXsf4MOszTZaLHUu82rLO6ZDxCGdGpU+0Z4XgeUl1EWFqiaT2qp2V1XF8gGs0IpmHnZeFfiN27mZft5d9dRljeQ5T18vB1uhbJrrOFMqI4vGwW3n0WDF43mVaKqMaywCZ91/p/sV4y2E/I3yrZoymy6lHrK+/u162b9bL/97P/2r+Y9qMgjE2OSoxsNQ8Bk9mPaYCtQvrlyj4nC6NXH7+OHXQboj6Bf7WFyq6roGrJjNWwnZSEj1YKfmieqspj1Y7MseLM3hGoLwPfeqr5IDk/00gFTT9whQF9eEzDWc20PZbAhxP0HJWEpQVm5YUbYWIV5rtI+O1dBYaPUlhC6uvEPTIn62tYdVwGBke41zdgLac4HdnJycnJycnL8/CbBycnJycnK+MRsylaiY8hBoZBTBctRoEZwrIBrA6qzTfqCV8HWovW3jezrVWV2B0R7+XerG/CHkH81Zmck01RZoYYligPzp7+Nzeiic6lcljVrlrpT3oXY/sazuDYEl1F/T1Lbndrr4TGY1iZdFSxtUNUWB5Xy3IJqpXS4ymALS4Fih/rqCw5vnwG9qr5sBDuYCEZ435Z9NJZUyqmjpKp59ZQrcNrXU+fXLRihaQtvatJVBNGiN9FDvuN7VGEiroAOqVhzURQsinY9s1oP6bKxAddrqRmH4u0NDhzGxKlhXQKUHlHho1zs7P38poajYCVXPkOqqL9pTS7UwlHo4OZsBvqyX0WYqu2fxQPQ+Y73EOst9va51bXYp0CLI3Waoy8ybKbVOTp9k31QDYEWQ/RGWSD/w2S/wCpAEcFSkjvLr9LKCIrDo2Wfe9HdeiNftqtPVi3Mhtmnn++3gCJCvutoqbJZsDpQVEPDwVOsgCwc+PtQs6Sor3ONe3BI7A16yedDD4gG/qOZq+jmsrp78bpPX2x3AHUYI+2ybtxWOsYLy3c5b1e6Zk5OTk5OT8zuTACsnJycnJ+cbU6UDgYIDQAIKjjdaCRFkbgjaLrTv0epXpr0+DzaSoWFu/nopgHqw4YwqDwaHX5ZEaoOilQ4P64IvUEgBYPRldwrYM2+gxwQh1AInNQmD0QWoZkAzNeD5azyry5TvRNUNz2UYMrUBsRbAsCscMS/mEAAAIABJREFU3Oxq+6s3hUmAt4AOjJY6T2VlKeS8Kt9ol0WQ1/al9u+ywOlnaMJjxPnNrhkthQwmv1k42WQYsK5e7ZCDQfsuz2IoeG1UEXUBKdrGqnKq+lhZWWzJI9AZhHemEHYXUkVId3QO3nOx3CZ5SHnFhsbh7XtdcKaNqxlxha13X68SIGuWL+sFFRLWqyjXKs5xmrcympRDJqtowKNrver62bVeReu17uQCL/jfUC+xAZMNfn6lx3FKsVbtwH3Rfq4KvI98rLiH9z0ZaqdJtZKUamy3rCtrrVyYbkGpIWXbMaMJUUUC5tZF36LT6r7bPA7mU0ERN+wepu5qRNgHqUxEHt1NMTdhL21FCkUzSC4ngfVpf/zxYQP7uEsneU5v09y8QXHOq6HxVNZZZmDl5OTk5OT8/iTAysnJycnJ+f7gmfbd9LBdGGZ+LBuUKYvIAgiNk/Dl7D/Xg2yVfawwvLz4Q/z0jCmosaBA6tP/izosZfFwzAkhzYwcraAj8wsMMAZgj9V0GNAq8qWuzKoioCb7onKJXFNWqUaZav9zpVHz1/hHUik0QrmlHK+6gIynNwFaRMZTtPQRhCxispCXv63aamIMyEVwUBx+9JXr5e8L1QvhgWx3wB2wAjKjSj+DoOYcDvUY3g4AMhzKAByJgfjf16K8qHKz9Pnn1U0wboZtcK7XdCnCPPvLpDRzi+eI85S9bsra1tRg2NSu2BlaXmiVo+on4tcVil+CRq71Kv9mvQbzuKxqn1zMysGm+XXzPjCgDNBo47WZNrrpXEIFVq1cFkXByhp5WVAPSunH7LFWvtjnaJmE3a5VZnid2ve+byOby6FWU8h75MmxxVAQ68B69m6P/cHPxnfGLbgOVXkPYVuVKo7nj2Pum7dSqrAgdp7ngzUqr0xZYdtqekRz5uFWx+ph+W3b7TxfoIXWGl7T3OZZvCmUAfp2XXhaCHNycnJycn5/EmDl5OTk5OR8Y6ZCuNmSV+uAhao+kN80XelyHsjVZsg0ABIa/kppX9QueIDf9HgL1UpV4x2xBx7Sw4JWlqxKLXYKJv/L6RYFkhM2yVrYlVUFVcr8S4U/g8HnpYCJ4PS+evZsQZNtf+hzHTjF74cC2nGq+7bzMwAHjtfh8G7KMtg25mHtaOQ7I/rJVTMjArNvACrUYQAnDwKD67z76SHggCBjeOD9UEB7j1yl7raugnWP3C9CnOrKnurKNuCFN05oTgaiT61DKNM8IN3P09sZXZnEkHQrq1VvAcnifzddQKegcs9gChnR/S7AOohcLL6uS0FG6+ROVR7WH9bUMNSVyEiTIqz/Zb14z1q1OyeJ9SKcHMhtmm5BjaZKrZc1b9fDa8B8rvVyFZHDJVeD8fOKrz0LA4YDqMf2ICzEFmxBVgWielWmVbmpqWQDDQZXpHBzdaIgnCx9YfUcUgfinHa+pPHNbEWUWgvA72Cgup/vUhkGrJ2R54X8LlfyTcHWImUdVGT43rbY8zgnhLmbQ2W2hnZXtXVZJmkdJOjzvbM/n3HvHnPOev/+5+Tk5OTk5Py9SYCVk5OTk5PzjemAGbSe+eMpHqxpp9ubfb5+MZh63125gYfmfXeV1uevF9VVeM8DQdLMxTkZdB0qokLotXmGVih6ZBGbykPiBKUI2xrtSh6q7o/tzbO0GPwdyqu5soeoIBH0adVWHpPNKza+hKVNSiIGeUO5osZB5nEdpz2eD3u/X7Y9Hh7G7gnaV94RAraHHxcQiwAISpfpOVSejeRgJEARrJmECvXhodvH6XY5qX0i68vBjQfjTweKrqQpdVnBcIG0481y5WDRsjZ9PXkdnaCq8rXGUPYZLYwloMbg9S+tGNsXuVKXXVBqM+ZllQg6L1yvWPPZNmZgbdVhE9VWm6uWml4b57nDsqfz6AKHfs3z367X8xHrdWi9LuhpEey/zt/Xq4VSbq2X2ywLVWMOr2gj5CFqCJroK4XlMt7HUHsF2dO6iHa+DSqs67vFdkKcz18yrVTt6Nlb9/1Xq6CUgNu0ZXXFHqJqDblZzBY73aoqsIh7BaXfcQpgUp1WBW+nK6pUBuBfq+r7X8CPGWdNOXFqZZzKeeuyf0a+2/bY3TYMEKgWyD/++FP3OOy+XyFyTk5OTk5OzvcnAVZOTk5OTs43h7Ymm7bPYu/zpArj/T7seB98kH7ggbYf9th3+8ef/2X/+vlztcSd5bjsRHdRxrysfFV5U8jWohtPDWxh97qrbBYksWLP8vBDjU7l09ADNnHBdEgD8jbnweDxdsvlcbDlDX3etOc/Z7B5C2uhKe+o8DV4cMe5NqidBB9op7wpvEJpA4Czr7Byz0mCq+8c8XB/tfFNZVARdrBlzmjnYgg61UpruahUCjURPmt/bPqMyMgyb4mrkVxuVO7UgiD0hyux+qFrcqvjVGMk7peta3aL2IVeKlvywvYX4fGES9FAaGojnFdGWPMwJ29AhO0UAe/7LrjYPatpevOhtydOqnqak0ZBEz+rUH9N2Smv9SpUr9F6x3y26z7f18ttf7uvV2RkmVr16h2WeiMkc8JkheT1dNn1GOavnLUAZgHhBHCb9kG7oxy1JE6d8xXIHy2AJiA0qXya82qK9MypbTURxl6NsgKqtXq0Ug57fvzBXCtvV7xgoKvqmjczEtqdVGdNtYNSRdfUWcnGyif3MdRxRKdbsXpWm82bDvGafd8JuZ6PJ7Dzk7clHYQ5OTk5OTm/PQmwcnJycnJyvjEENGhMAzR4OYyKEHbYsABkDgAQ2aIAtqaAxAlLV9dDMR6g+eDsQd7h3fMMHrcieXuc5xMVPcB7G2DVg/lkS9wO5Y2wQKijqqxuABFbH/YWLChbtU1WrIAWgyHftgAMbWN+Nmqy82wvFQv651MZ5P8agQd6QhEEgAP8YI08fZ3QpyoXjBlZt2ZBytiUzTUFGmCV22znv6BMNdg1Bnp3QSu1JZYqxZXCzevVvBhh6NEeGKosb4XrVLnNUPfo3OdwVRb1a1K6IbA78rrcuhlAUcHzRcqcIqvccSpLSQ2De1vnSytcWEB531wl5OHz02lSd37jEMkWUIz6yFYuUDe1H/D5+15sl8001qvLijcCt6ldL0DRHWq5Ys3tdOP2mmjR25RFhfPAHi7t678+eotl5952q6NywMZw2COrHVVuuq9ha6U10OJa6vpcn6HstLnsfL4XZWWck+q/8Zfwfy8LQAHCFfbPcHoVHPj9GesjcHb8nmGNdW1rdYqvD1R6TRZDqM0ceMWaesYWvwL98GuijbFY2Rm2Xw+Cs5ycnJycnJzfmQRYOTk5OTk535htuooE1qKhYG0Ag+ePJxUwr/dBpdCff/xpu4LDaTnSQ/ZYAEI5V3jYZpuc26NgM0R2Ee1OCCDfH/6QPadC1ufKQaIxj8euHmpOZVNZuUgOQ6oNZHL1ovY4paPjQXycnu8z0DDn2VCREeRKFg/Ohrpmf+z2eH4Q6rg10dwCuXriAkbU1RgXcIlWs+kqGp5TuVRkHjTu2V9FCi3AASpsWqOKqJ/nalckQGpl2SIZxF3CqsdIdG8OFBCpcXoz1EGebcWGQQCHeToo1MqENRHHDbuaKY9pCjgFsFxB5oBdAjSxFlWKngA/bpO7bHzb5u2PhIiCjncVVwAW3q1WFlCJIH6CHOUuwbL2f66XspsAbFQ2EH9226DvF7fEnQskXgWEvl7ttlcBS7HH91pcCQcLn6DqKHXBvGKhNlMZQKjzCGj9O8P1iXyyehUAXB+PfDP4bf36Cb36lJrNmzFpt+yeWQbw1Nog+B1STlXCQV+v9/vtqjbtmxkqMp2ZAyfPvWKwfPU1xzpBaUf1FpoJN8jOXKGIwPkpay4zy2Yn4EPj5Of7bc/3y348HsrbyhbCnJycnJyc3538b9OcnJycnJxvziar2wm1RdmopnluD6pN8CD748cHrVk9GtqqK2KQccXmOQWZ4yG7H8cCBLDehZbkPc6FmmooT4rnJrHJTqAEQGE1uZmruZDHQ0VIn/Y+3vb5+eIDvJmHy7s9DhBj86yp5qApwMMKVi/eLFf2zX79/Gn9fDs82pssZkWB6jqHIsWKFDvFnXbWdN3+mbdGulaW2ot8Z7r6CA1vCIZvzIsKa1eX9U22yDkXbHp+PPX6m8opVF5QHm27w6WV9zSVHeZri4bCphZGQIkIbo/mQtOxtlbVAuhwxOqVWVXVDjj0T1v5YfcWPl/niEQCECJIOwcBiSnM30GjFGa3f1Mrt9bIAEO0AW4bc9U2gapoolwQLP6s/K/HxwevEzbQEeul9knmYm3bWq/IpuphCy3KoDJvXyzaNQA/sDziO1ACVklpNZedU4pA2TFDdWX6TgGAbluVtVVKNVj6UIIwTJCtuDVWkGqpDasrAmN/1dte29UEuQmUFf19rKMNrTdh6yDQC3jFT+1SPrYbeF73dfM9BsuuQCxW53h92uevX9i4zwxwz8nJycnJ+c9MKrBycnJycnK+MVShyB6IB1s+EJdin69PPrw+2D5WmIUFiPTHjz8ZXo6A7c/Xe9nZujmQOWRHZPvcdJtdaw8rxVVEzPVZOqex8oOqsqgYrG5FNioXzkRzXIRM2/q7ab/en57Ts1V7PDerZ1FzX2Njod1a4ggHpCxqHx9U95jOG2qsIvhElY+5hQ8Q6VTINbve+rjZ+EKBNFcAOs+b9raxYF8oyNDQ6GqiWyujGvSaLGrGtj3ZLUfAmLmu16QWcwDVCCJ6d0B3qpGvKMzd/1Gt7m4RbASPd3uaA7spcGhUi+2kUed52dUqm/GG1EtjnbuH7MvOVq/MsxEKvV6kYPI2w8asLFcKjdDNCTiFMipsdwAxp9RXcbZTzYhdQJLXgq1xnq7mm2qSVMNi3Jf4jGjWWwH/zcFl8Bjc5yYrJq+maw0EfqoaBJc/9gYVY0/GerVtWzCKwf+x5/ukLY+WTHNQhPuGX3WUlQEH9VP8/2UJmIufX7QcPmDlO/uCtGFbNQFbAi3CyL5y6LC/oXbkfmue49Xq7vesuGWTYBaB9uWk+gpKLoOVGLbd4yArBfi8WzZzcnJycnJy/t7kf5vm5OTk5OR8Y2rdbNuf04U8AiW0KHmOFLOujhf/rtHSddjr/Xa7EWAXMoVKPAxXwqvGBjy3Vi2FhxQ3XxLbaXsyZis1qZygkFoqpn7lCi34QKC1uZ1L6iyj2sv/CbiG0HkvYit8aI+MoYAkeB+VSaYmP8Cx87Q6I7/rUhyFNatJ6TSuU4/f0Z43lLlEYGRXplO0LwIanFKn4Vr5K2CTmhcbbXFouoPK7HPdi6Ug0ziwqm65myboU6m6AczDLwqqGJQeQflV63dr7sO5KaMKv7DG2+6KLeYn3RRSJkDXqU5zS2JVJpgJ5HBNlacFldF5O+dQ2Xm+1KDN1G5gMc7tv1uvrbnCqglCejj/ZuCiKB749fm5FFJD1syhGwWYVpUPNsOuaEW5X/5rheLz89yECTumhfrJYlvUa3uoPXGOfsu7uqyD1/sEkEzrOVVWAHjY1bQZkHLYlW8G2Dld2TdmfJdcIXceXdZBu6ycM5ooTffJgRfO6H122mUjIL7tD3zv/TMjp0x2RugmEb4PBdq27xasCrlZc8xXsWKpwsrJycnJyfn9SQVWTk5OTk7ONwYPtP6gXF82US7mD9aABxtVJGPBn4YH6fPNB9ni/i1Xw5SL+RBeUbEzV85VFyRa6EoZQiaoQAWPcnmWxUuZVeX2/5sq+l8HQ9r9+I/94UqnBSimoM2XOCvPM2KIvA6GIO39YcfPnw6naH88dT3+IjzYU8U1XKGEPK+teFPc+T7cSomHfuR8AehI+dX7XHY7BFPB+ujtcJXHKrKDzeNgeyB/LhXP4+EtdIAr3phYCTAslETm721s0esEbvvz6eBtb8Zs7eq5TbTUEeh0heVLzVUvtdfW6hemCDASIM4ZHtRYrrDqESAewAZtjWPoPHSugmm43kYllAfkY7+0ZQd0QNW0XoP7b2p9hquZ1BxYdQyqsgC0zL6Eo29sPHSlG9sqa/McMlwv1WplWf264BbVUVJixboUZVzFPWssJXS4FbuVxQPFIRzUXqf2laudBDfDOyoAe0/CCvxZtqJ9IGDlF6W3Aab2RUipLDu9KZHXQ9vovCyLrS54ZcXtiMSbUgbyGGSaBy2929Z0zg6aqbSDKqx6YPucvv8ASbG2UIixNRKgb3Pr8Dlt1Jr/yp2Tk5OTk/O7k/9tmpOTk5OT843BQ2npc2XunAoYPzoaCWFzKvZ+HfYyAK3/4oHxjP/nn/+wf/366Q+7w+2FFIMga2i4Misgwz3n6J7pNAUnqNiJPKUIQ4dtUYAl1CdNmT5QhxBeKCsolFpDn1mmAsbNCUCoTsyu3+N9B5RkQd5k0RqCRP5W/91JOc91jOP1Vuj4ZttshFtNcAhrYToG8pMO2ukOpnQ3gZRQdnn2VKjNHII5BNxkg7ysa8uqOLwZr0fLIBvoutoVzXY0BeJeFlfITcEVhWgtkAPlGj7/+fhg4P15+D0syjmzdZ5jteexlS/ymQI2mWdunVSwXQqkMc61XpVL7HlS/FuF/M/hSq6pMPpYL/yKwHVaBJn6X3292rVeXBPltFGJV2VRhJpPe2YqVJ3KrO52umghBAgdUilZ2AHtlkUlZRxVW2KrAGQMZO9+v3mftnpleFVfA76H6ey+X/3+FC9vXFvJQd+4qdFi4vux7JMRhN/udkZb3yuWL1TfsX7/CtfcAqEBKNadeVjMeDve1rTPacWcrsA6zrfntmmP4fWwAP/5j/9iI+kpdVy9FQLk5OTk5OTk/L1JgJWTk5OTk/ONQfPgYJD0abVB5VGp1Pjxx598EH7/+mXv87DnxweVGFXAgLBIahwostBo1ii7KQxu7+bKI4InWQeL1E0BBRDE/iGYQFUPAMe4Wu8+9g9Z/Pzhvgve/NgeVAoVZSJt9bHgmN1Cvm2hF1dtNcKyRmAQfx/QAH9PhUo8mEeeEKHOpHKLljkBli3aFqOd0I+2IFpYC+92q1CkEdws4FG5rm7FU2MggFxY827ZRq4scuDimVyuyIn8Km8arMq06raX5sIuKY2imY/nUNWEN7uF6Gxvm7f+9WF3PLFtuxRbrq6KNQpFVlGuWBFU8T9vXxsT8Xn87MEGuxWKvqDPdJvq3Z7GUPemwHWHawEs+XpEzAMOqaXR7FJ5xb7jvZ5u8zOd3RsW0tVqqCbJ6uATIA45bKesowC5XIPi/4rJdst5AU6CscPvJe77XpsdUjUWhewzqD1yLsZl48T3wUPnL0vq2iuxP3U9Eew+lM+2wOcYen9xi2Ir1s5Q7I2rHdMqc7ZMzZwTwJJNlLKvwvJZJr/L45bphndCUfivXy/78ePHrLW8ztFnH3dtWU5OTk5OTs7fmQRYOTk5OTk535jqcGbygR1g6vXiQy/a095vDy+HTa+yUW2zB2xjdkEVqrbwMCyJykRQ9zhtzBqF/p49JXASLXFV7XBsLWS21sljW8Rklxv4UXZSwCbGvMMuKEUMYE1Vmx5UQszTkn2uIsQaYAG2P9nT4jj834ICJkXXXLa38gW20e6Ha2+AFBsBEyAFroGh7lP2rhYQR82BgbYCUEjx06ZLkwK+AGBVCdDGuGDTPXCdyh6tyOoBlHWsStqzABogF9oYh69fqLiozmnV9qK1BrQ5Dlk5r+D8yNZqVaqwW0aUBXQaft6Ee7FWON7oXO9YuwN2NF17nHhXmDvtd9MW/PJk97Kur4c6afjru+AVjrvFTQSkErwK8GM6F7KmIpBYZANEaPqYgp+FtsBNsKvVC90xtQth68jeag4ay3SV0yjXPZhhf5T1tcqGqLpN3xewMg7tN8EtrgfhnavC+J59o8Iv9ugXleIsdszD/67cQJhF3pnbIG1zWy6+C3Q0NpULCJZVBtaf1iYMsrvbJHHf3gcthQCTQ4q2HWUMALz9sD/bHwqnr1/UYjk5OTk5OTl/bzLEPScnJycn5xuDh3lmOM35jsQeBw+mgHEftAoS2tAqqCBohKlH0LfUJMgpYrua4JUt29xl8Wt6+AUQqwwinw7GZC08AIsEFyKHKULSnXaYmgBdQQL1CPUn0217PK7eV25gpd7A2JDlkb8/ZXfTuboyx61nRaqtx8eHh4nj2kpdzYYEA6NfDXCxYJGnZBcAKhHiJTgS7YGhvCrqv2NDXGuCVrYsbXE/olEvVDmxngBVQzBsWsCKKtubQsBrWNCa7Y+nfXz8UI6UZ1NZhJyHKulmAw04x8ZDWBBxe1tde2DelE/x+yELYlMIP3OhRljmbmtVV9mff7YsfLTxUW011/uWqksD8Ip7Pm/Qp0oVF4gnCgYYTt/qtd8irwp3rhWre3NbZqjLatwvuhgJflZbpCn/TTlikc11hbYLXnKPXHsjlF6AXW5HNXu9Xvx7QCSTTa9LKYjrOd+nvd4vliiYgFWoCAP4llDVjYDEXqTge91ViUMqLKyo7+HBbLtSYg9PwisAZbQf1uduj+duG0oZiu8Nj2S7WhdzcnJycnJy/t6kAisnJycnJ+cbA1UKLEGVQOnRX/aLuTdsmqOaaWMLIbNwarXPz7c9nw/CKWRIMdxcSplI3EGjnxKx+BDd1ewXcOjUQ77zHP0+1E9QSymYe9wgRblZw07mSnVmfZezXKHcbCOcHmCtY66spLDu6VgBWUqcM8CL/hzALf5+E2TDZ56R6RWgAkHY77cLtiJ3icdoS232tbBtLttXqKIYfC/FWFm5WOWW3eWKJwa/u6TIM8as2oKO0QToxsIFT0AbymTQ0joDBvJvG1VStDDCBmrnWnMCPPz81gj4ByylJ151LqA1FbLPUHo1/IViKoL6XcG0EU5BgXQIKTXBqSFVGEDb+LpQtvRmw6HlygLbmkLsvcWy3rOjpIaqAjotRF/z9rpQ1c2T8LOPqywA7z3Csnn7/4vOaKuk8qlf2W5Su/n5mbLCfA24x2L/dlczUoFXrmD57ePDYa1smUN+Tr4OIG5rax/jPhVZEN+vt4fWt90Vh+YB8ue87Ie+V/zkPE9rKEp++ne1X2UBxvy0TffPw+sBKR/a31BlReHCsKmsvJycnJycnJzfmVRg5eTk5OTkfGMcCvjrmTNFbcX05jvjEzVVJ/7APFdz2b9+/rLPt6tHAG4IeboaDQMkyOY0/o36aT2o212tZFfWDx7Yb8dy4HDlXAX02gRi7GY5tJtCqdSv/2pQFA4eahnaDG8NdAG3Ivi7K+j7S5uczgM/x8O93cFI5FHRsiUL2uZwYmWHSV1EcENFUGM7XCh3arlph27NjsiVghKO5z0Vvl0cWAQsK1JN3cPwcV/qTSkXg3N5Hwevca0dWyib52b1vtRGUD+xNW+Oaw38d+v+FDXb8XyZbebZWNEOOaTsslszoAn03DOV2H5plUDFhtbILiUY7i1+tXWcC2AVraeruCrVVn6aF1wbM2yWbuEs09cPwPZ4vXhPA+qUpYaT6q9e9rmAsMx2o7LM7zshV7m+P6a9y9fjvG/n7Oqn6arBWhZtK0HdaNN0BVUAtXPE9xEFAwJJWIttdxBWbCmucJuGGjFrCVVf/FJG3HbZJjeq2Zru7/C1UIGCvi/PMUbB63JycnJycnJ+bxJg5eTk5OTkfGOg4Ci0mBWGNeOBGbAAUIgP/1SHbHwoR9bRH3/8IFgAOPh4PGlJYntfHwtY4TfPx9MtYFL7cPAgLLtXPPyvUPG7+iYUMAIhdrOnhe0voFccqy3wYwsu/dXWF8cLSBSqpfiMeF/XewNWjMhvslvWkwDQ6/1WrtV1/l2Wrffhyqzj88Wfwx4WOVSnWgTx6zjeDLTv3WEEc7VGtDc6eCgrD2sQ3DTZ1qL90RZY0+9l94Ryxi1uZb2G10YAhgDyzvc0WS95bNkdY10xUNv9+vnplkaCkQs4hTrNz72ttZiRdVZc37Ry0wJe6din1g/WUQs7Hex675Ofh+wyrFcXCMK5YL3i9QB7hFI6H4d4Wi/ldUXoOdbYmxZj1QZf63leg5+xCTIxM2rMpbzy45TwOLpt1S5A5HvE1zb2JeyZUyHsTQ2Z/Dm+H7XwGvnrfBMS4rsH6x5/CUhF66OXFrgy7OPH07aHf68Ig2kb7Z7bFbCseO5XVcOn74HL3sm1IpU0NzGoiXQsS6y3U47IxRqkXs9C12YCrJycnJycnN+d/G/TnJycnJycbw7sayalVAwa9/AgDuUFMpRGNTXWdT5474+NcOF9nHYe/+K7prKJaHmaUrsoj2gpsWSfis8KtdUQPGj3UHLBoC6V1IIwAZ5g90IgNpUyt/Bt2d78hBwqOIBoVOV4Q2Dn9dgST1UHSzc7FdclHviViRX2M5tXzlA3V/EYoZMsdQB8yM2qDoZsNct5bhZ+32ThC2AQGVgEOAyVb1IjKYepK+MqVD84z9bWz9Z6AvQUZWEhtL61ZQcM1VlX5tZk9veV3cRGQ4aZCzB1D2QfPF8/duQ7zWk3WHK15BHEQC2moPdB9ZCrfirXp3noOvdD4//7EevFXCpAFPwTdjgXSXkYOT+/rXOa2hMYqKawppvumQx1DrzGLePqtj68/8PPq2yK3K/GNce5OwvUe8el+uOXQg2cXGNZCA9kyUFJ9jrs4/nkOe3PJ0sK/LsxruMAKEL5Nhz84ro8U2y6Mkugio2FEmWFKgrtm/zcWdZ+ij0/3+dS+JW/KBKlbzR34l6AcX2fAC5ntV4A0w7PytqxDlUZZPwQiMUeW201oGxOTk5OTk7O358EWDk5OTk5Od8YQBwEOePBnIoctusxYpwgwi1G/hCLp+nj1W1/7PbY8dD9k+ABKpPzeFsIgKLVrt+sdlA5bVIzBbzia9XIFgM7G1VSCOWmUshDwa80n+uBfIVYT8+9WuoivbYqNwsB1TF8aAfYmf9nCDUhTLtb6coKtR5jrmPSsjcciQB0fcm5KoI0tLptCjDfl2UyFDhLSTbG+mxTUDnXb3NV0Vae4GwbAAAgAElEQVRcGYMAcrYoHsqpirwuwDFYLQUHmQeG1xHsFZ43mhjrHAqIb3Z0/wwLVVD9qsoBBHJw1Jf9EyCtn12gLwLLp9vQ2KAYIeH+Gm+rM2ZrAboMrQ0/QSonrmWZVk+puRj0Pu1ZGxK5yB5dCca0LFdDlQhXV54a1ut98Hj4/EdtbN3DNRSotvjZroqa2nRUFGFPRu2jObg6I75rXDlahKRoypw3ODi1EwXXmFEmZdkOaAmVoVRnnTlYV2B/jUbDc6wNjesDMOI6InR/a9fnTAdlJ9Vdfg/Z3InvBYBd8+9J/4vSzJRvt34ff16ks3Cd4r7jWplch0ZEwjIJ5OZcQHLOETUE9f0+70fLycnJycnJ+RuTACsnJycnJ+cbM2rhr15V7Vcd7vChe/RbkLirSKA02aaULqWqye6wz2K0dQXJiSygYjebW7vsZWxakzqFSiSBlHN9lkCUrFwxpV5Qo88hADQUNt6VXYSH8MjSKmxFZN7UdDgR8Mqh0fUcztcsqx0UMY2qo5OArxMitBmtdFPnEUotqWwMeWB+3GOpb6aFViZyn1y91Rw6hOUPIKFV+4EQeyquPPh7k8JqAREpkGhxvGWCmYBfvalrqPiaY0EqV8HVL1lY0aZ4AaxQaalJUMDObmHqnn1lS0FmarszffYxTl/34ff58XyqhdAVXXFcQr3Ns67QYEmR0tZJW/xeYI26jbLdcrOuDjx8/v7jw/fcOLkn6lBifLxGuVdDtk1/n7FZz1V5haooBN1TLWiDyiybV5YZc7jKndio7c88i6z5qjuYK2YPAD/dd+wZD9zvalesNtpkoyWh2ejMImtqFmzDP6u0ULTNlac2BHQ7/9n4e4ay89a4tTHuIRaT6sY6+F3FGlCRR7i68zzwezQbbtVVdgBtANIAVvj99FYB8y0zbZTymH8NlsvJycnJycn5W5MAKycnJycn5xszFLa+46G4CU5AAXIqGFwgqW07H2Y97+jkAy7se1DywPL2+fm5lEEEIc1tZnYL6w4YFiAC4OqKAlfm0t3G1qLXcJBcFdkUeXynEm4Oo8XP0VeEY+NnyKAKaOWh4uVqhZvqHyz6Oc5JzINWQqqCkEvlcMphV182SM+JcqXKat7TlZxU40SulkMBQoiAcUWwAX8EgJEqyhRa75lbWqtbs6PdrIMRHA+oRnQisBXtcKHwCnufhSLNY7z5es8Jd4WZS31YWkgIyDXu00KkRPBnDr/uge/MwhLYqbo8rhQtca6mA7yi8guASmAMirIBlZisivj7t9bxPOeyKurEed1T8DJyts55yfK4twCKpooH3g4sRz/cIomQfKm4YKmsoX6agEobLaBbCY1fk03UvOmPsLZdGzXunWyfDzZ1HjZrYT4X91p1Jd5GpVrjOk3sZ2VnoRkSiqdNyPbHjw8CJigQ2YpYr6IBi05PhdljmrYBmwQBHK8vh/Z/lX3THG4hLP40O063WkIdiNB3cDsAuFPfH6rDoFyDhbA27k2sB4/ToCuzx5yzzptqMicnJycnJ+fvTQKsnJycnJycb8xqzZMFCplEH3W3X/NwNQqsQ91BRAxyr2o9GT7+Oj7t1+cve/3yTJz9+eBDN7KkmloAI6Q9wtfDQlhk8VtWwceDEOdf//yn/ePPP23fdzvONzEOLYkEK56JtdWHZ3LRoqhrmG5Ng4JkvDwUe0S+F0BPcRiHvKGhXKEIcofN7xwHs5LYwjdP+/z5aY9ttyfUQ3Mou/t6cN/2Zv2cSynVlpLptNmiqa4y22lWz9GyUlejomt2ioGVERRBgYZrDBul1pzw6i+ilypFlWlN8dlvKaVWS95/I5QJ/lTVZmiLfXiT3mXpRNaTN9dFK+UCiOaWNdrfoMDi+Tfp2YZtUq8xqwrKu78AD1wT12yMpSgKhVbMkNXQrYKe2QW7K+CUmeezDaiujkHLadXadpJIfSaC0s+Taiec2b4FFPKw8gBg3pQIIHgsmyTeRwzbqjK8lHvW6lqvyDvbZeVzu+IkAGamlqAVIVDVvpeVE3PIplsIr4bv5datjkK1YykXzJxSSRLS1mLv18u29rCO8ythrfXv17A3FVZUUuIewv4JW+Tmwe4ewo/vkmmfqpVQ6+zCxk51HKyKLHgQ4KyyTObk5OTk5OT83iTAysnJycnJ+cbMWybT59shFEPYmcfT+ABseDhXGDcycqCAgdIE7wPgeeybLFRmPTKFwiYnRdUKjh5XhhFzgwim3L5GS2Ep9sfHx4IolTBJ+UfI68LTd3dLH7OaaH8qPMYDlkaEh6NF7s8/7P0+FmiYsmCdbBkcfIinEmhzO9W+N9sjkL00ez52LeIkKAA026lCMwK9mG2v9ut8U4FzBBgC2OnKwdoFgKC4OQ47a8AXXV9x1YuriIzZYhEezrUCqAq1lNatKMB8KJB9KG9pAcGwK9rXrDCGp0txd7ky56WkIlgpyxoYmU+lXOqty1JaVpvjnGUFzTfquyoBXmew+u6Wx+4Apenc4iinrIN3xdi8hdKPVS7goeVd+8YUsr63nRKjOAO3EBazTQqm3niPOvdJtePl+WxcL4X9P/edKqqd90QAVnleeP12u3aot7AP8F3Ad4D3SNbYgG8HmhLPkyH+o1V+RzqUX7TvmYL8ZeuDRfV9Wieo9b1DddnZ7fF4WIdCbLtaJIdytGz9eVDlZ0Vh/+WyG3YovKAO6yc/H+H4XK8iUHc6SGvV88iOfvC1yCzDvQO4BcxjllvzLDzaIqEE2/fMv8rJycnJyfnNSYCVk5OTk5PzjblnUq2Guc2DyQlzCBm6q0qmq2lae9B2VqMlr8oqSJDiiqB+a0Czv/ye6icqWYS9oMCRKonKJKmLCICqW58YYl08gPuxP6iuqcrwwgM4HrR3ZWnVZfmz1R5YGPINJQ7g1JN/1/u58p/eny8qa5ryrPyYxX5+/vIw87PzAZ+nqzUAVAPwAZjY8PkfT8I8fm73v7Pq+U7M19qaPbQMn8iFqm7z+vjx4NoetCiqHbA40VoNjNEkqAbE2Tz/iNY62fIIxVpbQff3iG0qiLSGAE4Inwf3aDugznutlweyh0IIIGaqfS/uY7kBLb+HG3Og/NzO6Ra9oiZDt5zerJe011U3hkZG2K0xj9Aswu3xXuwzthH2lUpelFlF6xwscYKcYJwfH0/7/HzZjlD282DyVK3bUqP9159/KoRf8OrhzZRTeyEsqHg/LHSAT2zlg83v8XGDVd4iyWPdAC1LCVqzf/zxh/34809mR70AhvtcWWdFdlgCsenQ8qwPt1jCBtoH34/LRX5WU0B9Z9NhI6A9ZTOcp/+TFkEpH6Esi9vF71F8R2yVFnp7ZzRHYs9pbQmqPXGfNtqPPx9Ut/3j4wkV1hzzfLe2XQFjOTk5OTk5OX97EmDl5OTk5OR8c5baqRT7dbytv09vOWMIeldAuLkSAzY3WLK23crpr9s2AK3XUs7cVVarTU1qrFE9QJzQxTzYHQ/8Fta3sBfqIbvJzgQ7IZv2FM4OFRigzQ9lWNGC1yiruuDXtq0ndrwPuV3ssxunLGuToCngD45ZdM1DrXH/4//9f/TwX1beO/KC3p8HwQbUXH/8cLujK6AitP3kNR7Hiz9HThjWLJRMVeH226PZ5/FeQOMSRjnoW/8UBArAx6NgzQCNcI96XxBxUgkVl+7h4W5HqzxnALzX600QeL4PgcNx44zRvOeWRFwb7v2bCr1rr8x65WExE4wWyE4wtSuIvt+C/cMGOSLbq152ypXdpGue+udGuDkp7SOwqUW5TrKOFvP8MEAnwKXa7PnjhzcBzp3WwU0AM867qgGRyio0/Gk/FmVOQRkFtRqVY82z0UJFOE25Ylvjmgze48PBVRQS6NyL7sePj22F3oeSjkD26deM8gPAtGPvbE7c9wf3BoDViw2YsWNcndd1DmTFAafC0ihgxTUEVGzF9rpftlJ9flgAeX+hylKxwcaA/c59gruBc8PHY01hjTUVIvRx5P+ZzcnJycnJ+c1JgJWTk5OTk/ONQZi0zWZllDe0NHgQBqgI0MKHduXn+AP5FaIUr9kBk7bNg9/VCLgCuAWv1rEEt/43e+/Sa1myXefNiFhr7b3POZmV9bgmKQMm3ZEgygBlW3LDP8Bw3zDgH8Gmfwp/gnvuuM2WIMuyYRsQLBjQgyIkESTvq25VZp7H3usREcYYc85YK/OyoVPpZozLw8w8Z+/1jF2V66sxxuTvzaUTvdPJAY7BAkT3ThEdPAqQOAXwrA6q0+msEcIYNDLIeFTa414WUgtp5Pc0lrURWABUAWbRZZbV7ZOlWozOpyi2lmzdTptel9QRYxG04m6aGtT5YgXogCLbuhmMKQSDOB+PnV3u7rgdxAofn54YN8Nrfdv1MCVQDBYRYhWdlOjOn2LwhyX09r4qVnyuZ2KbUMfSeTwTeCA6yXO18Yjq4hIrHY/aL+b3SoQADq8BoEkWa+TWfUKhXw93Th26rDzSqMXrer0ZJ4RjSPb15OvFt6FOpcB+qDUqJGMCE1BLijn+cCyFEUG6sgA1L2cZp4kQ7WQF8sM4cfMANHDqnc4TrwMg0QpgK0Wm0yjmISScGsxtxXPk/qJBu7wX5HvPFGJ3tlYARQnySmY08QyYl0tzOG7myIO7awYE3bIs28bXAxhdX64yw40FiDSvdHBVmxAodt7uFOMxtZiuXfO6xzC1p0xfz74uu9T6GdApmHCJYeImLi5cg4CbCiYj1zB+//gId9tFu8LagIWurq6urq6uL1EHWF1dXV1dXa+Q9VTxsRZAAYXjjxXdQl4Sbg4tAJwkraMomENLbBKaPpwHGUJSSOGvs5ibGMRosUFTMRDjMTUvVcfvzynZWLso0zTKd999Kw9fvZX7+3uZxpNcLheCisv5zKJp7A+ASN1DDlAiu4RY2B6sIwgOGH+QxzTFZWW3kFjn1Djo1DjtIwrycr0RLDDaJ4WgDKXviZHDiWAA0+PgGKvmJGOpOiDEusltnuU6v7DXaL7d5OPTo7w8PRM6jKeTvIHrBedu8EZLy9X5RnRnbiEFKdoL5Z1R9eBYa3IIdLiWdou1aJ1RvsGiZtncZVHhG2+1TUA0Bx3ByroSXnFqX5w0ZmhAZwWok9rcdsG6ufxeNydZKW0N4H3ZJiZ6WT1/XqwMH2go2LkyShpbtNRL5Hk+Y5IpjpLu7lk0D1fZ6XyiY+g/+tm3cv/wRu7u73iFAK9wLtFiouxXY2m7wkc5RE/9GuG6YQ0AdOG6uEcOZ6aOOi2JBzgDtELvGqd6jtah5n1iXBOJnVbFIoxYC3dWnI7uKVxH7GeZV7nNN+1eWzd5fNT1QgecTUPE6xhHZGl8aMD2KJToc/olwFSO/Axng3h0bRncEnNLJhrdNo1MoueNnyl1JG7LIqeHtxZTrJKkA6yurq6urq4vVQdYXV1dXV1dr9BknUl4bF885oSH6mxQyX4KWNOm0xlIwIO5OkeKOjMcrMjuqmnQ4hDjKuYk8mhhtZiiRgH3wnKAJ+z3/nKRd+++krdv38rl/kL31f3DA8vez5d77nuttj0pzf21EGR5GfwO33zfCkSCyL1Gvwbv/sr5EwfRdz9TGAEXEtwxgGGTOXsIzQCqihbSD0GhD6YY4tfHH97LdJ7krbwhaPurX/ycoAtF4C/XF/ZPYb+4jnJwqPEqoI8qqSOoGLxi/1YIGpszx5Y7nFqsD9G3TwrX94J3RAZRtJ9G7WSKHu0Mobm0fDqhwh51ZMHVJOZM06l4UZxh+NqYCVxWOaG8/BALbB1a5kAah6G5sTgP0NbF4uceYoNX3p01wF2VUDSuQG3dVu0AC1HOD2eCTfRGvfvmG5mmk7z/+EF+9rd+l3G8zUAZzIacUGk9X7hvgDjFIKkX1/P+F43ujXGwcxx4ugCbgE107a0zwV+064JjvpxPBF2ES4BbVV1qJwwKmEYZ6mBTPKukhyTPT8/s7UrpjkAM0Arn+cOP7+X28sL15hpuiRAL+yrefcXJi5nHgQ8ujqaEQlhWzamH21VljwiG1q+Gm5wYMcR0wo3DFALXt10Sc0OKjNOJvW/4WKLGfSu/Dcy6urq6urq6XqcOsLq6urq6ul4pACVO+rN+IcAVOjzc7QLnRix0VwFCwW2CCNK8LLLcbtonNA5yvd5IUujS2DY+uCeDF4AER89Gm0poIMkjZR5VFHvY/uabd/L1u6/lq7dv5O5yljiq6wXulefnZ8nyG0KcEyGAO3SE0TxEoTaPKdp2PcblkMsdN96jpABLI14AGdgO4MVgnVoDC7WrQgwcP1xYYZ/YR0gDiGUxM53wJ7KWLE+3K51B33z3rbw8P7JI/Tff/1peXl5kGE967NYRRreTQysraa92fIRUcP0copn+/WQwqhgcEoNUYuderSQezp4s7g5y+LXHFUc6qywKWDWW5hE59jmVQuBExmFwjPdsHHnfg8UL6bayay6HWGp2191xkIDLoqqRUbisbMam80W9SXSmIeYHsAZH3jdYI1+9kQnl51Xkq6/fyfc/vJdYMyN65VBQDwA3L2tbt9l73vCarZgrcHcNjsCJrRRdvz/YPZc25dI6qAzQibn4JBjs9e1zuqGW83uPFa6rg6WRn4Ug4zDJuzdv5TQOtu8sT5Ll5fqs9zTp8AGJFg8NscE1fo5j4eTLGrQLSy9iaLBR702k60/joqEV7uMeYs0zshhDc8hd51s4p7sGm7u6urq6urq+TB1gdXV1dXV1vUJwXeFBlePyS5ErJp0N7sBRJxFKy1PU2BedMObAwoM4R/wDVsARMwR9WPZ4F95vMEQMlHlPU/DOJgMRe2eVvhbg6N39V/Ltd9/Jm4d7urHWUuTl/Q/y9PxigE2hhHD/uZWB41dMkcODOCYH4tl9WzP3hol0lQ4bK0QfEp0xHivbGOPK5kapjBPKAbLM60bnDiAfAYCITQ5055lFJ0OU0zTJicX3bDnXiGWyyY0S5M2bB8Kv3/z4o3ZjAUARtqizKAxRu5DsdlaDUsEAkXic8OBky+bIkrBPhjwW6+P64DoOFs+E4yYO2tFUy8YIYaxFlrxH6hBnlHVhTBPXqXhEUccRNsAWDoDK3V+45wQgNu0x+PcA/MwRh7idu6TEJkBWtlwVgiJ0oGFdsVOMfWcDgcx4mmQ6n+Xd1+/k4e2DnO8fGAd9/+OP8nx9keW2yIJzwr20cn/G9crW4rEOlFo5Pi4APw96LIBL+NkZbkDArvnGa/r2qwe5v9xxXemUQp0IWIN3qC3K9DDsAIRw0140dRkGudgkTL1giO5lhVC4vihynyau+bvpzM/PVw9vOCkR54f93QpifQoQ02ggUNT1xc9gHGSG0y9ZtxwAdBo56ACDA4Y4mDsy6Ps8Tow+uyXznwmMyALeYkhDzrLOs5zv7tUptixtyXd1dXV1dXX9NHWA1dXV1dXV9QrpA/zG2BCjSRzzD2izMuqWfSJfCHI6JXMxKaTCQz47pMzpVNuYtUpIQwTi8TFTtTgbo2sGYAAq3CWF96H/B1HAN2/eyOVyUmcJ4ngfH+VXv/xrOpZut6s6pYpOXkNcCrAJjpoU1BEENw0EpxMezOkKA8iyXiNO2UMmapzYDYUH882AB3qrVvZaacl2LUEnIGKSIaGAulXqIWqIknFErfAaRLg8j6nuKL0GKGs/nS90k4VpYiwS+vHDB7rKNsTCDDpspTYwFjzq5yXtdl2rgySPDJrbh3FNi2o6yArmcBsOBfzCaY8rnVsAK+o+EpEdyclER9HwyX7S4f1tOqLt1ydMtgmFnNo3tAmPcgBqMerEQ3y58worgoXjOdj0yiRbzISAPnVvRAn7mGQ8jTKeL3K+3PF+/PxXv5Aff/xRPr7/KDdczw3rOEtBP5nUHbkEjc7iPOhuM1CFknhCTStxB1TCfb29qPMpxMpi9nW5yseowwAAQB3YLeui/VcWgczXF/45DoNs88LOLfxwwaTBLbNkX9exrpMWGQ26lu/vHuTbr7/heeMch5cXhX6nE9dsKYf1Z51dOZgTbByl5lVjp+ZA9J646g6y9GmXWrQIp0QDiuB5AmgmjBC68+oYse3q6urq6ur6aeoAq6urq6ur65WqtYYQwqRxosJIUWLXkk44w8Nusg4idGMBocB7hIf20zgRFIhoZxJdWXiQzxpxi4zc2VQ5gx7RIBbjcXDjWMcWVYsMBClRJnRN4UG/Vvn+l7+QX/zyV/Ly8ijz85Wz3/SBXAHN+TRwYqFsqyzbIhXT0yz2t+XI6N4lRbltmeXhdJZMkxaJ51WmCQ//RT58fC/zy43AAFDluq58WOf0wWGQGIY2jbE5jhDHgmtNEjuLCBWCvp+uIXNe4VweAV2mk3z37XfmxhkIGuh2K4WwCL9WxuREKmCIRfBwrJv1jUWDQeEACMMhJilwbnkHlfeReS+VgYzB7kGwCCcji9atNQzqcsL3s8ElHBt+fltXiacTo3IAl2JwLVlMMFjezqN5Nep0QMYNDaJlK6sX65ySQ1E7jzlU61TzHq0kMZmDjlP3ilymO3nz5q2cTye5LTeWoH/48b18/6vv5fnlhTBpWxS0sJ8sRbGRe1byj96nQhA0WmQOzq9Y984x/LmmJDMmA86z3L+5yDAFqWNkDxqOc11uMjrcBJxaX+TOnEpPT0+6v3WRui105eFzlbfZPi/6mSnWf0ZPFNYeoHKapNi0gYeHBwItANDb9coJhrjeuP4KwrjMFHZiAIFFHfNxCqGtjbIBSVW5nM50P2qkUHvfLPXKc/EeNZTEo3vs7g4gTPjZayX1XV1dXV1dXT9ZHWB1dXV1dXW9QnSdpBTyvGFCWtJ4YOKws3WFjcTnyMHRo0PQWFSe9UkXUGuISdai3TtStAwajpeAh1x7MOdQfkCsZMP+QrHYEra5dwQhiojXw1kD1vD49Ew31J//+b8huGJQih1CG10oLKHHe9eN8T4FS0FjZ7XK6Txym7nMjFBNU5LV9lfrwklt7AwqG7+mMclVNkbOEOGCG2q+oS+qWneTOlO8T0nBC2KJCg/wYL8she4tdhpNIyEMtqfwAG/Z5OPHDyyZR78Xyt0BYa7XK506FdDMtqVT3xQqeddUcztFi4cd+rEAajLjnRrTi16u7/fBJ0NaT5YrWmeVAy4vTy9WCO/RP+1IG/jnFvszN121DrC2Ve+4sihp8GO17iyxY4t23GIF/oB0MauLKBgYFUAmQJtxoLOO3WaIEY46ERHOup//5c/lV7/4FYHqels4UfPtuzfyAifWsohY4TzWKKfseYx0jM395V5BlszjOKpGbGsKcrq7KEhrrLXI3f1ZZg4OsNONIqdppLMK1ycNhdFCwNLhMpmvDf1T2m2GzwPufRgHRgIB4gA912WWtRqETeoCe4MhBueLzHezLPNi/W17f9cneb6qAwAkq1uwyMZrGIvf94zLwHsQghbUo/zdgWhahZCwtvUGqBn5ucMnd5qmHh/s6urq6ur6QnWA1dXV1dXV9QpVddsETherhTE8/Lqi2wcP+SESTg0y8YF5HLW757q82Pj/0iAEq3ciM0d0JMGd0iKERV0miGixL6lGizzpRLW1rq2/B3AIjhM8TH94/4P8+OMPUtBNtS4yw1Vzm1lCDsDwu7/znVzu7tUrAycKJufJwJJrRrUw1Y3F6KKRyE27sxBpA/Zhef0SpKSNE9nwWhTUEyJsmyxZJxmilD2URJtLsPL2LSuQSzYNjnFLsDRAmBo0OoeAZFbnExxZU1CI8eHDR3l5uRLKYGofO4/MbQUygGOgq2vby+49dlctMolrnrGPg8NqZVROWmk9S91F9tJ0d0uZm8phUjb3lUOjavdLDlHAbDDjCL+8Dy3LAf44zGI8VNRBdgBk+VDYL3l3SBWRBjxxX4ak3Ve6voQwMGi7u5wG7XOK1n/24w8/yve/+pXcnq9yW2a9HusmS73RMQToCpBUqpbyw1EHGGO71KJ3j1x6Vxv7pfQYeG5Zu+DmLXOCIvxr42nQ94Yq4xS55vWa2CRDbBNrrKx0eW0OEekgVI8XpxPCaRiLbDXLvGzsbsvLqu61ODI+iemb02mSy+XCzybWRjDnm0dLUwpKmenACoRljAB7KNQisABxPsBALH6Ia7ISPi/6uaisdOPncRg1Qrpteaq1xtKnEHZ1dXV1dX2xOsDq6urq6up6pbR/Rw1VfPiWyrJoPHAjOjRZybkDGjhSXtaFUEcaUNHtzJyMFgh7vHOJzptQ7BEa0USx9xW6YOiAwn4wiY8AIMv5fJHbbZXr87M8Pz3L4+OjAiB0XN3fSTBnEPgOS+iltuJzAKOtWCm3FVTTIbRVK3LH8ZmDShS26TS9KtuySQqDbLJZtCtonxNhVLCIl8KhMIj2baFPCAXfgF6zTl/EXrG7aPG4Oijo2QBmpMr1+iLzEuXh6UHuLhc5jSOn6QG4MVaHYnBMy1tnXnufKfgJYHJnlAMrMpZNu8Smia/PBqnatEebSuhAyd1bbcqhLZ32eyvbD+bGKjZZ0L/HKCicWHQyjQRTgGgeiQvW01UttuiAKti0xWgRQx/zV49l8AYL2YdlJfv4NU7q3EpxYJn/z//65+y9wvVnvJXAtNI9h2Nz1JI4YRITJFf+mcgHr8M6LrY6U/okZslC9KoGRDiYbrwfuk5rGDgMgBMBOclyY8QO4GoEfAMBijqkQKzsn5MKDUACjpVqpfIr7yLXJO8fStZjpvvs+vIs83yTN/d3Ml1OCnqzMKKI412WWUIm1+PnENvH5xbuMd6HWHWdyn6OAHEscPfeuiA2qRGQV7vw2IvGPKFNjty2cD7dSeJa6R1YXV1dXV1dX6oOsLq6urq6ul4hOEVQ+ywiJzzU5rBaD1bhlLdtznywrhyklmV7emJRNx7Qb9vKKFcYk8TVokxFH9oR1eLD8ZYJiwhOqsYIo5Vx021l7hB0++CBHlGwlEZ5fnoi0JmXWT68f09HmE6ns9L1Qd+zbTPn1REvBQvTDw4AACAASURBVMQbzYUCEMJj0WtRNAQoQ5t6qA/lp5HfIXzw0vdoDqFc86HzG1PbAifyoWMoFS3JLlYMvqwGvGR3EAkBm08yjIytrWWV02liyfu6bJjmxkmD2BZcWOxmYvwwccKd93wR2BC0JXXxeHm7ObCil7y7I8rifQ6vxIGTwalWwn34nhjE8u+JObWyxSHbVEPCo7iXyMseFxS7rtlcV4BR/trgPVz2q8cg6STDcdoxE7QldQKy/J5uIeH1ZddUDLJsGlnFvj58eM+plewqA9BcVr6fnV6H2CR6n/A67gM9YuIRR8V1GpQFBDVYKHpfcQ3g9gqYzDdELb0fTux/g1NO4sgJgYo6C7u8GBOMik4dFEa9yCBpdIThs8N7hmPHoEaBA2/DO+g4wxHVokMHljzL7bbINz872fVRByPA1IZ1W1frq9odc4VOR72eeq3VQehrRQx2qWNMI6F6rNoRVgib1V2ItQgwnFKceJly6VMIu7q6urq6vlCxX8Curq6urq7/cNFREzn7n7krPvAXncq2zDc6sdAdpZPmhGDApweC0SzrTMdGnAYiIjy0s6Q6m/smFAKlcZi0eNyAh046VPcUts+YnkWiAGjQ8fP8/CIz4oLoxJp0kuAQR0a2EO17ul65neIOMjhKshZ/+1Q3nQZXGI0iEkgiC9xNdWPnz1ZWQiU86SMGpgiq0MlFN45JDUKZQIDnJ1WWot1YcKJpP1QhFMFxEm4EnXC35T1uBWfYy21hMTg2yndVhWs4zoFxspEl2u7eAUAAlNBicetbOhTIe2dVOcQEtRw8W29XbQDJu8aKuaBaf5Jv34GXF7GvK4HMZKXdm8XrEuCd7cMnHOL3dF+haN56rXAu4djDVc1LZvvLdoyblc57wTsinH4sMZgpiuXmq8zeZ4Vi/TgwWocJjozt1U2GaWjn5A4zVxEt2wcUq146L4lwhxCnFnuNvnYISehV0rZ74zYKgODkouMNvWCEsqIdbYIOtCt7pgibzOkHZ1aKyn3893r5zYlWNu2Py2oHGyzmynUX1BG1rjOnAWJ94ecDPxNRHVUGAsWmKybrSCuHa+AF+2LONgBCuierQmC+B9tBLNIcljZOVD8XIYyllHFlQV5XV1dXV1fXl6g7sLq6urq6ul4hFHLPmwIHMpCiMa8wTARDNWY+1Ad7qIc7aDidWJoujGUN8uHxB075gzuoBCuGjzrxTCcRKijhQ3ErQDfIlBRyhaB9ScVcKWvRom44sNg1hUgT3EBVJ6XBZDUYGEiMaBXruqoaB4uKEtC1FQ0aRP4P0T70aVVGI9lGZE4tOJwSCBfigzCZBJ3Sx3NiaX2UMFnXV7C/clSFVMA6nNpI2lIYH2TfkFiZtqilJ+H1y6bHg2uyaGH8OA48HziLxkHBy2CF7NmgosLGgcCE9VGHgnyxWNrRZfVJT5EBI0kexYsNEGV/nxXGo1y8unPKStVZyo9o22BdSOZkqvZfD33CYXFAZQXyx6gi+7fcuSXajcV9w9EHEAlQgytuoBDT76oxRAdtNLxZ9FSdbcIhAhCmEAL4oU8t2qkXxEqrB94MCMKFhF+LAcvD/bEGr/26IfpJgFh4zlinw3TidgEji3bC87hjZZCVscJxuLToKra3WjcWI5AHuIZ3uuML61sM3OmuB13PEgjp9BATgdbpMsmyrFwv2CAcUtUGDSB26I6rOuz3xNdh8dL+TaeNwhm2WaRXXVsKEvE53QSTNLWEPsYh5FrHiikP/b8Zd3V1dXV1fbH6v027urq6urpeIY2mDXUIcakx5M26lQC2xKcEeh9Q9XH/6Kg6yd3dhZEqQCU4sVAszQicWE+Sd+gcprrVukfX4hAZB8RD/dHtVAzeJHuI9u9h/749IXNSh1UyB8qR17C/h0DpUOwk6jaRg3dkTCNByMnK6REJ8xJ3OLXgEMruitk3Y0AlSN2ygQhzOnmZ+rLQnQPgA5BACAbHDf48qFuNTjPso2oXU7VjjizUVgBENFIynWra6aXarF+qdWIZ/HOgFQwWeYQvH3qd9vM4XAiDFrju0a79Do0+TYpVm3Lo+ynHSYjH7VqJux9z69QKn5p3cJ3QZVUMWpZydJJZrDN5BxjcUoOMaZJ1Kw1OeswSbCtg0t5n91lPPxjECc0xpwdQWjl9Mmdgrfvad6jFcwWMWmf2pF/u7+RyPhlULeZw06mcvp6LdUzh8zTQJaVxUk4zDMncdtqjRphFoBcNGBeZlys7sqZp4Fq53m5263Qffnx6rNHuuzvKqn628DkyN51HDAsjjwoR6QS0+yl2HRBpZbF+UcA72DoLtY6l1KHWnh7s6urq6ur6UnWA1dXV1dXV9QoRsIRQc85L5ANwbAaUarFBaSDLYAjjgSLny4lF0s4jOLnMI2ks+9aJfnRysCNqY8t0sO4tdk7BSYUHcfQCxcAHfXyhD+t8d9dORB+6C6agSdky95XrXiTtUT7GGEXjXqAMDXgFK+02pwucONjmsmoH1cvLMx/yL+eLOZG0C8ylziF3Yok3SUlNeg7VomOcQmeDFwnDgk8j3K8joAthBs6XvVeFfWIAXIi/sVcpKYQhvNqyQYmBIKpYFLAcIJYc4nI7r9u7nKK9JxlAit5n5ffZzjE6wDI48nmH1jGCKMeupcP7jxHB2iKje4eWu8SCO+a2zA6ybBMoGUM1d1Wh2Uq7v4bhpI6hqKX5pzM6qEbhkEdAK5s0WbGWhonXi4p+zL6ePUKnkKdoNE5jmyk0eCUNvpYdaPG8NkYq7+4vHCyAL3V1WVwwqAuKdyrg2kR1zsWhnb+u2cLobJTUVhSOCRMJA9dnZN3UOt+4f+x3mV8IkHFMuBYnTiW845fDPI0pZoseGtAydxmOi2uq6me4NCdWsPhvkOk0ymWaGJ10xseIZ9na/cE2urq6urq6ur5MPULY1dXV1dX1Cg0KKmoIYam1FgCqcZw4bc3hBh5c8fCdYmhgY7MIIX4OF5VHovyxFgXacEU5TVH30P6vaXUKVU6Oo1sq73aZYBP/Roug0Z1kP4NTB0BiSmNzy2S6dPxhXRh/Y1eXRb+ClYDDxUPQgE221FiQCPiRtOB6M5cZ4JqDBYdXOAhWW+do4EodUcpELLfoJfCjniuAU/LIVi6yVosLAhxWgJYo63IjsDtNk0Yqt61Ni9usRFv7vdTtheuFSJe7w+yitWvXJvqxTN6myVkckNAI72t9Z6W5uMJhUqD/3t/n3VV8rbuvDJyxsB3QMWjM1EN4wfZRZC+Ij9bL9Dc5eLRcXO+J/Z/kAjik8Tmev2g3GbvIorqa0AMV/Vjg0st6s7QTTJ16cN61iKfslyyxC2ufvViyhw2jTtrjWEGFkwygYmBB1uL8+eXK8vSBqVGMARwsmqlOLLA5FroDttr0Rr8O1dcTIps2ZVHTgrE5CTmNcFTY6rAymyNtpGMwcDohoJJ2YSVZrWtr75oTguNa9yhrMJCp8U9MLFwkWFYTjspgXW3s4MLghk0L4ud1kfM2i57BwZHY1dXV1dXV9ZPUHVhdXV1dXV2vUMJDdM0SbaIeIlzjMFgcKVohtbmMgjqdAFvw+5fbCx1M4+nUImti8T08eDNy5ZP9UtSyabEycdF4IR7uURTvQMNdLKdp36a7bsQem2tVwBX8wb/kNmmOHUFFpyHmWnbX1ZgsxhXbAzy7k8yJMuDnaWIMknE9i1D6Q/9adY5h8F4sTKRLGrmzEBu3hQl1iPcNBCq0BCncMBVzkHlcDdMVV+sgIyCy+Nz5dJbzOMg4jXTZuKOJvVneZyV7JE/7lfavYF1T0V/j5eiIznkE8OisMgDkRe5e/M1YH/5s7wOEoUPOnHLHWOMRVIUD4Gr31iKK3oHFAnjeNy0P5+TKoPFITKPE9+8vFznhHmvdPdfPYFE5rknAsFx53ddtsQ60StgVrR+teMTOJhiGgxNMvBcK993ioDgjQK1cdfIegWhUV1wIAyN+eN3tdiMchQuRnVoGRLHPBus8TYnplYduLZzDYDFAfg5smqU6z2qDTpNF+cSg1zDo5EFsG/HFcRjl+flZlmXmcXG9Hu6rOsE8Cnk4/2hOSHPy+WdI6Fob2GHGa+ffxxTNeZEF0I7ntkd+u7q6urq6un6augOrq6urq6vrFUoxVmgY0gpMwQlycf/vQRUOlymoM8SASD04dJbVxvdHfXwfbAIgHnDZHQVHDBxERR/uq7j7JtjDtD6MA8pEFndr9HAzxwfgA50grQdKY2x+DHgtB8ShXJuRsPJbnU14sKc7iHCoNnjB0vMaG2jAcU5RH/J9u2wRD5uWh3OynsXRtmLT4oLtU4vLWXYOn9Aw2jTEwumKKVWNMzo4ADgEZMsbHVmY0ijeSWZQbK37qRTLsAFC0SGD8u7WTdYynzyM5C4slMAbTKruyML9HRSwACYVd1gdXFafRA8NUHnsrYEvizJqT9IeHfX3+bEFc1zhz9gfupXw2sWmDlbR77uirQtXIpA0NxW61kb92XQ+m81L3UBYYrhnvi8HcmIdao7Zik3YDHHvunLXVTIHHUFViw/quvXTC3AjFgU47IlCDJTRzo0uqGwAMLKUvjRopQMFbJk4QIvalwX4Ju7WMgzGtWrxvhAr7zeO783bN/Lx46Ns60IXXhgHdslxPYp+DrHeZfsUUIp32LEcrLC0nQnOot1qaVAXZbBpjxw2EDZ1X8H1OGp8Ndeylly2Y2ddV1dXV1dX109Td2B1dXV1dXW9QqtUFplPcWQ0TmyKGh6c8TCOGB96hmrQcnY8kONhuhhAEsSV4BYBw7GJaXTtLIuEbKXrVnK+T0kzV5aN/kfUMFZpMTax7qV1Xvj+YBPVGDETdRd5J1amw6k09xCAEKJfCqQCJ7nB2ZOto8uLrXWanxWdG/BASTagmcMYLbL3KJaBHFyjmti7tG6ZBdt7AXhozi04d/jaaG6wrC42XEvADZ8sGHJlFI6uG8CvqvFLOrWsuF1EJyTWUHcHlUGkBrA8mmaxQVerILfvO8gSn/6nHWjtGrZOLdmdW9ELybGNzabkOcy0CKL4X8IOkwabE+iwHBlbPHRwsbDcyuq9aB1uuXDo2kLHFPdrET+sv8V6p+bbwrU3pFF7zY7TF8M+pRLuq6OwHWxTHW/qfMJr4Lz6PN3I12SN2wknZ4rF/jTiR2gE55jBvXCIc+J+RvZanXQlufMrRAOSBs/gDhxOrRBf4SzK/6s8X2+M9N3mVZ6fr+yBE+ulQpR3Op05KTFbGX2pu/vQ4VVxdx1644rFffFZycVixBZzBaBj9VWm05HRRBTNR/68DjGuMcmSeod7V1dXV1fXF6sDrK6urq6urleIySbEg+D0SJGRJQCDeVm0KNziV1rWHnYARRikoADdTdG6nhDd0vJndQzRyYRpe4gJHpw6WqitD9yI7e1T84L1VqEbSjueAInw4F1a4ba0iXD4n5aO7yZsdcxEOqqCRcQczgjdXkW2urEkPRlsAbRgpG+efTLjofA7WOQx6f4t5gcXyjRMBCceLdRXajl4QIn7NLWYGq7FaI4ZHifOFWXttch8u5k7KnFb++9Dc6wJpyZaZLFBwE+jgw6risMljyYacIo2kY7AK39WxO3wsN3j+kkEsE09tHsIYLP55MND19XxtW271pW1LAs7vtxRFnwCXiltPeStKCRl3xMLpTRiGBSmAajg53AHoWvsfH8nYxowTNAmUvr1TuyKUmeeRU8JIt09lHhvtOw9tCmAGnUc6Uqi4S5Zsg5w19Y9ANZ4Gj5bt0cnnH5G1rLBWiVni9lquVfc16mVuAcHWmu24/A1G+Vk78W34LpK7JwLvAbsyIqR4DVXn06ohfEpjdafZr1sjD7qIXLaJK6LTYHUc8sswV+s8wqAC9caE0cdqJ3u75+HYVxz3TrC6urq6urq+kJ1gNXV1dXV1fUKRRavV5mtKyeOSXuuCES0RB2vAbRJVigO+ASX1nS66Jh+uHhGi6v5Y61F5fDaYrBmY5+Sw6hMQDMYcOCr3IZFKDYKslrLPDNGxohU8WL1wH0xZAWyEN0hpDvHQ/fAKJUCjeMkvGPULZqzig4URhgrO4WKF11bJxNLseE8Qw9TUYhm0xtlw0RG3RJLipLFwti3Zf1GBCToEwvaLeT9TQofBtnmhcfDkvdl5e+TO1/MpVM/67w6dlwldzS1wvnQJgu6GFcbx8M3AiHSaoXx0cr5j66pcgAycowIHkripc302+FVOTjDfHJh9EJ+22/bVvve7jwqVeNwHk30zifCvEziKqdxlNt1lpenJznFKHeXs9R10UmQSdr+NCxX6QZEPHUMCnIIeuyclHfV5n4iRCt5n6iJQYkWG4zDSdatSt2KnOPE7U2D3kfeG9FtB3MYAoRxvRLGaawx2WcDgGsrSwPB2fdftO3L17hONtTr/PL0qGubbrxCBxbW0ek0qnsqyl5qb662BX1idCQmuh0B/ZJtg9fXuuHu7u74OXu53niPeJ1Ee7TgHDzfXcownZ5qjNswTR1gdXV1dXV1faF6B1ZXV1dXV9crhCljteawbRuetBMmCiqc0edtTuhD19V8k/PlsnclWfkzDB6Ic1Ur41YHkk75y2oDUpAQtHuHD/dR3VF4bkcBPF1PMKxwkFvQTiJE8ZLH8fKhZ8sgSdEJeRN6nnKRkny8vxmHdGQgY3eACMWmFBqtIHSA80Sn1gkf7NeycgJjjAqUsI1BBgVXcJYBhkV1WsUDrIHL5kKXTLLIYZJpGlmszc4q9hnZvMLDBD4eJ50uVh5ukA+vAZSoFhfcHVEGqLzfCd93CHMARw6fdNLj7oBqEUHvALNjKbwf4ZPpgHvx92fysnxzTm1F7y8hJiJvHqMzaLbfe50OGXG+tkV3vxWDUs1tVrRIHRB0zUWmQWQ6nRiZYxfZwRk2TSeZ51k2A7Gw1QV2fBW+V2y6ZbH/V9xlBWtVrjZhUAcZaLLP/ypZ9/6xrCX7atgKEqexnfsQsiyM5mnXm1+xYCw2c5BB1kieKLHLh7gmY7Q1tjXOPitx11u1uGWkcw1uQhzyvK2tBw6fPUQKCZIBQ239Azp5RFc/N4n3Z0AfHL9ftfQ9qhNrmAbZlo3XaePnWehqAwickpW6DwlJxSXUWoah/5W7q6urq6vrS9UdWF1dXV1dXa8V6FGoNnFQo4MsEvfOqBAIdtDZtKGzJwUbsV/Zv1NKtrhX1QLscbBi9mJRwUpQBrk7CQ/qhCcbwM1IZ1Ywhxceml9envk6gAv6ULzYOyjQ0rgi+pHUdcNibZssGJVgaVQvhB1OtK9I5xHib2JxwWiT5bZt0QmMdJkJ4RUsPUAypRV7a6cV3g7owGthJULFYMjL7Sa3RYvK15p5LdgPBqDhp1KrXJdZ3j9+JLAaDQrAQQOIcLvN6lZjt5H2LjUYZSej5qFqTV2fymNf4ejIcph0gFt6PnnvtrKYonzu4jq8/zhJcC9BD3tk0SCXxxX5lkO0UbzM3PrMRPYpll6wLyxv19cueSUUTYgPGgRj9HKe+XMtZ9fCfg4KyOqO2ziNshJsbrlKZp9WJrjKdt3UcZcIr7yTLXHSISYXBsYI0Y+VWNoepawb17wCryB5WwkbOWigZHOQSRsokG2qoxz6sfy6In6L9UMHGjrnxhO/j/geIpLrsjAS+Oarr62LCu6pkWuysPeqEm7d5lmdegY7K9vq1D2l0z7dEafXTTvY9muO9bxYUXywSZc6cXSQu7f3Ugd1hEkIS5a6haGXuHd1dXV1dX2pOsDq6urq6up6hTY8hGefAFgZ2auASXF/6PVJZWLOkmjj+ItF8OiGSrG9Bg/N6DFqE+CixargUGqOIX9wVnCC6JJPrUPfFrq4ok3882J0sYlwwljULMMQLQZVZRiTQijZDJZlAi5MDYzeTxTEepa2FkvT+JaCNxzuZj+vNk2u+M8/k7Zvbe2bu6uqtvNqUEiYLmz7V6eUtGtzPl9ksCmEyqcOvVOiHUic9uc7O0T9avy046u5puzPgGKALj6JsLTz+qxg3TuprAR9s9cdy+Grvc63gdfiPmHaIX7uJeb1cB2iRwjdgdXWQ2jnH8wBRsBH15G0SYQsma8HN5hdz22etXssRnl5eVFXk7iDKipo9VL4YCXlnIQ4ELRtRYGT2F8eo5W1i88BNEcTV5x1llUrOPdBAJgEmPOi8Nbvh7vYAlegbACQLPovbYiBO8iwPpZ102MxByOArF8XXgf7DMzXFwVvltEF9IKL8OHhQe7v781JFfkZUAgXaWmk98q+F8UL6vdoqMcmV7qu1AE2jacGU5e88bMMoJZzxsDS+bjOu7q6urq6un66OsDq6urq6up6hRK6rVDi7tPQMBEOz9coVocDY1DoBKdHYI+TQpIl79E3aRMFrYsqW8F71Ml8BBRRQRLdH5s+tGvTEdxJG7+Ph2g8lF8uF27HC7LxNTLamLjNbA6rGtTpAwdVtigeJioGixXqpMLMZ372Wfl0P05Y3BgHQ6m6TrZbeW61OMABeFi5ExylpvZKA1IEA4AcKX0C+tyZVg/ga+CEuUGLsdfM/iSfBIdjgwsHwGA8TQ0CXu7vCOhQ7j5OIyOJwaHTceqfTxk83PJ6+MI1aU6nUnbQYxDC6+Hr0RHF2GPZe7c8Nurr41AQjz/jHsPRBrdQOfSNEZzhelj0MlrXlvd1EeRtWytBj1a8z3UYNEJIOIT3o8cpK/ThhMuU2jRCHs+m8Td2ZGWFsdG6xLSJXR1VmDIoFp2TsBevq3NOC+SzOZXaZMkWpYx0OW1lJZRatlmHE0jdS+kPjjLvQBMHmA5+7LV41WbuLbG74mXvAG2X04UAEw6vcUhyu13VLUlXoF77cUxyPp/lfJq43fW28Pr4IIRgRe10Sdr990PwyYSfR0XZ7VaKzMusMUjscysNbh4niXZ1dXV1dXX9dHWA1dXV1dXV9QodXRs6fS0ebDkeN8vWL1UIBuj0MfDlKnSR5MOkutRcVmKgRghJoj5Y2z4it5L4wAwQVVimvREieNdWtUJpMXACkHW5nK06PdK9lfMqIRSpwUNhVQvj+cCdJY1JXWU2VRHbRCQrudNkWdUlVHMDKuwIIqBJ5iD79K8ZbYKeRQ89Jin2oO+A5wgIAMMAx1bEwwy+4PqLOY78PTy3pGBO45kKCcWienRk2STB8Jnj6ejEIrSo+9TEwdxYcnydl7Ib8NsMqASbaujAhZPsGGOLDX459IreM3U4/2zbqRYzbN1b1n0lBrF8Jp8cHWG+VhjRU8jFcn7APovyAZghakmIyPJ87ZLKNrFS71eww9dfdeIewKyW7bd7GUP7HDiAZCQQ18RcS4jXwokEwIo1WL2TrF3nYl3+wSZhBp0kyes+NDgnBzjrwwDYCWdr0u9dg4BBnYn8DPhask42nc4Y2n3ftlm2dSbQC7UczsfgJ2mWxoItKMopoMn6uxzWxVJlCIlAD/13mEwYQghl2061lPg39qN1dXV1dXV1vUodYHV1dXV1db1C7CnKuwuDMaWqUAUgaV4WjRcZWCr2sF6sC6s0p9Nx8hyH7hHo5MPDMx6R8RDOwm/2DSU6YgAc4CDRB3DAndwifnB+ofeH/VsGQghhLJKHY3J0UuunUwaHqGX0+M52Wwi/fKofARWn2hWbDKfl7OjcgnPmNJ4khYFfDuKO0CHR5ZWbs0rroxL7iBS4pQY35FB8HwmeCgEW4VqQTxwt/D37hxQsANRVnxboPNCO4xPnlUe6DGR4TA/go5ibSmHlHuMMh4ifwyoAnuai+myCozumqkGxY2wwGEwJBwhVtE28RSmrdU55ZK8dh0HUYl1hDnrwU7iArrcXi+1Fne5o0NHjhwBam8HAcZjaZEmx8yGAbS7B34aQx9/7oABO2mwuur10X6wvC8eDknMW+x8nW4ZEVx+Ab87q6MP6SXG/5h4htbmRjAn6Wvnw/kPbFtYSBwFkjaoSpGKioXWJebfWmrNcrzPv4+l05uclF5sA6k6pohD5eC/UFRb0dfY5xjax1rBPdokR5NXmvCsiU0wp5rzD2q6urq6urq6fpj4Spaurq6ur6xXCQ/sagQ7qWhyHmIskm3uGsITQJynIEo3SIf7k1iqNIKrjBe6WaG4YgC24ixowqh7bUohUV/RnDTKaUwkdVABPaZjk+emZnUB4oB6iulrYPQQXFpxRBi+0OFxbqRh9NJcXBMjAUu2qYA6OGGCAYlE0B0CZ0/SiZHFnkIKX67I295Ko8YVl7snOxwEBfgXoiwaMvJS8dZ77LfF+Ine+cRJhZRyOU+W2hfAuW8G8RztrOcQHce3l0+16NC14SfrBxSMHMCaH7qvjhMLWSYVupUNhezj0VeG8lrz3RjkoY5zQX+eurkPPU7Gf8xr79WogVKEipl8SQWWdxlgtYgkgRRhkx5aGkVMrHZRNY5LHx48sZx/hzkK0MGdZC8vduH9cb5sBSLdSm1KZFN5tFunkLQ6GrKzsv9JZKG0qIaJ93oPF7aVR46xxL2ePor1wWsC/tcin3UDGAJsrygYXwFyFgQHR3Fv5ADXp/qMjL/F7p+nE3rHY4FmQebmpw24YZE0rIa3dNL3Xf0NM0G8EeuKyuSftTG1KJVreNg4YuJzO9raA5RG3bQvyN5XDdXV1dXV1df0HqwOsrq6urq6uVyiEVEvroA5ZS8EDH9JRHcTpY3AMAWDVog/sfJ/G14rFC+Oo/wqGgwuGkZjckYW+qyhTGpubw4FHNDATxwC7lGBGP74HQLVcX2TNGx1Ddd3ken0h6BKLha14kJck1fqMAqJ/ubROp4FDAdFpNFs5uBXHa0M338OC9qrOK+VwCjIwrU7ogCraoyRxBzPRzivolLfgMcxDlGx39dTd8WPv1ziglYmbkyi5S4pRS+x/lbtp4u95PatG3krZ+5qC7QdbhwOnbd/cUH6NxY4v68jEPYLmkMonGlYvL4+fuLnqoXMLkAj7ZYzws+6teoBpXvDuv4+tF0qL7kM8aAAAIABJREFU3IMXnR+AGsBl9sLxeIAr48hetDAmrh93Wu3l70nu7t9IiL/mz6Id84hzRpeUlj1JCTo1sLCYvX6CXgBwjjE7v5cK/TZ7ud7jBdepRHU4wVOYBhno6lOnImKsAFTeF+XF+Js5/Vpis+g9QxQRYb6VMUmNrdbqwDJyKiHW6ryscrnTCC/dijY1M8MphghgmtRdyAEF6IrLhLoSU4sLqsNMGjSDEBmOHK6gf0ZUcAhRnXW4d+PETjF8oPjKMExAZ7V+CsS6urq6urq6Xq8eIezq6urq6nqFfKIay7jdZWRT1OD4oHOqktvwITjyWVb7iFyI253VoWHF0dIgD94/tPhRbW6fwoflzUfzi//C1xbtlGLJ+pAklizXl6sUwAv2+rjXC1Bl4/c5QS1p55BPsCMwQ7QxF1mXVSvjreMKzh1CBrpeqhZu03Wy0TmD+FZiL9Jg26o2WbD+1l83PFaIrzat0fue6h6tdEgFcJUO1w/9XHgfHW0xMQaWplEK3EFw8FRpvWHRXERi8bjNANFoZerqnNnhVbBYnwOfYEClXfBD/5Uft4Mrlt57H5btN3qnl22nTd3z7X0Gv2rblU0itPibxxtZwG9T8I7CumHU1MvmOXlyL4lvYO0QmWwuM0C9zYYSBKzrwZZYYIF/LMryCG6zgTvmUfXPKCz3Dq+NQDbb9MsqI913OqggMHqK961St6yfC/RqWXRysHhm8TVwvB4OPZWEtVL/mtsrGJU9TWeeA6d6SuDUwmwuRYJcO8/L3dliiwqVk00l9DUIQxrWWbH+KzFoC3C4WXfbJzFW8c+vmPvMPncxTCBZGt3t6urq6urq+hJ1gNXV1dXV1fUKVbNS4PE6mvsmqdHI8nL62K39SQMfftHxQ+ADODWMhEboKhJOfdsjZywbRycRHpzdXYKn/yG2mCF+bQXe1nul2z3J5XzHKBegyel04msAmIC/AAfgupKy8XtRinU6WQwsHixBgGzTwGgeu7WCdgHluvuGcF53d3cEC/P8YpMRHbYVg1dZHWO2TZ9Ud3TvuI7AyqNyBATWN6al+JUT5AAQl9ssCdFJgzHruvHaPrz9ivuvdXd2hQMUcedUMXjjnVW4f4FTD1eNtXmMzRxaDfy4k+pziGVOuHKYViiHKGFmT1L+BFr91jQ729/RxdVea3AlGXDjdDzvVapiqPRYSn/ccCAsxDGgoy1Y55hfD1wHOosYu9OCfDjeHKnN2wICBQLInrbG3GxqJnnSpscTa5RYbWgBjpmgVwvVAXEeHx/lNu9R1Da50c6v1GM3HJxQuDeVX3L4mbR4o35/CJrQ4+cqRXn71Zs2WXNbM+EmYZZ1lu1dZd59Zuuy5PZnuhDjXt5fwh5NddiFNRcslpiSrlMCRu12C7XWCVehlBL+5E/+pP+jtqurq6ur6wvUAVZXV1dXV9crVCKATK1wpcCT5OXMzUFk0+CmYaTDpMW70D80TXScwKECGJP48JvswVnaa/XPOyxSg0ppPw/WN8RC7MqmK5Z1o99Kh6ZlAix3csFTFHwin4RW+l0PuTB348BhErCt6aSdUyxRF5aocxqdx+5souA0nbivl+cXcc+MMgXvjgoWOQz8+txhpd1g2x6Z+wzuwD1TrCibX+Y84kREOt6ibG2bRZBIm3jsQ4MTOklPwd5gpeweV/uk10pCc2DJoXMpen8SjsNL2B1OOaiz6YCDQU1/jUcM8yfQJLTIXPUoor/WfvYJ3GIMb59ZGMw9FQ+uNe/+kkN/FMrJsS5O6LriPZ1kvt3k5XptUxLb+zGFclu1pL/o+ovD0ExndPJ5uhMF58WuQdrjg1xp1gcHJxwnJgZ1JwLu4Gfo7goH95JHXJPoWpb66ZpcrQC/2LrL3iXHuGk69GIFugZfXq58Lz4LgHa6Sb3OCj/1eAG1dCpioOPMVexaMopqfXbqLFv52QHoO7q1OHmTEFmvNyYREmbTuVYJi1OMcYyj/PEf/3H/R21XV1dXV9cXqAOsrq6urq6uVyghGlikxe6GoA+0LBovBhrQSeUxPcSOlpVfDmzw/bu7C2NsbfobQE0u/JWT2MzNQSDEnqkDwAj7FLbmxrEHeWyTPT9wgQHw4OG8ask6e3z4vUSIFQl4LK7IPqxq5xMVqIV4qF3SWXjZfs/jxPlJogvlcnexnisv9FbXD95Gd45N1Ds6repnjpoGBQ7wJlkxOCcq4hpF7f4aL2cZ0HuFawg4506qITHG5kCoBo3W0YXkscAYW6m9nyDAXTVHkXzWS5UPgO1vig+Gz+5Ju08HsOn79QmEYh1Zx94nObxefFakXdPN1k4+AB49Lz9GdXel5jpT5xyuj1hn2Jv7e/n63TvtPMMasE4xuotwjlyHmffVt4E4HoFnsmuJ+xH3EnadoLm7lPx4M51PG9cVIdEwygkTItllpfdQbMgB7u1m/VNtLZjTjF9+wnbtNcZn0UrEVq2nytcV9vv89KIl7QCcHFQQGBscTxOPDZ+POa8aUY2fR1yTRSR1reL48mqQMg68HozIVo3bKvQyYFmrOSmTAr0iIw50HMde4N7V1dXV1fWF6gCrq6urq6vrFUqR/gp0US0AGyMedi0mh4dzjy2pK0fdKN75JOZ0ieaGKoc40vFfyAqv9DXqzJJDDC/u8ToDX4Y61GkEMHGa1BmDKNg0GWXAMZdPAInCpI2OE7i2GBlE15RBNjIFjzYSZgS6uVh6XQPL21d0+wTdz3AAAUeQhdiZ47djgbsc+rCOclcWt2OghPsF4LCuJcQyeY1zISwAqMEERcASOMJ8KpzY1UkGkEqwuZBR2oRAOcQMvROq9S8dphCyh8mAo0cLfbt7Db1YZ9hISORxwmTvPfZpubNrv+/pk3vzSczSHF3u2Bpswh7hpMFNTPCDS80n8uH0sSaC9auJuQAJe7Ysp5h26BX26+zXnftPul4IvOz7weJ6iMzWrezr/wBy2K02JFkBxOjCq3K93uSWVwK1IWpDnEJWL1jfuNi1Fy6xwD7bLQDAyzYdEBM2FSJlflaqdcxjMAKcZuhjy2V33fln0u8zYB+ObYq67gCoQhz45WvG1zIcfYnre9jBavt8FxbC063WJodGwrrpdGkNXtu6pv7P2K6urq6uri9XB1hdXV1dXV2vEGNRiBHh9+uWi0WaAFLwUI2un4FxvoFQqDAuWFoyyt0Z6OMp5iwSe9BmZA8QIKuLBA/a1ZxZHivEexDnU5dM8+0Q0wAm4cGaoMn6egYCopHwx0FH0JZyAg+4lXjsEhuEcAjiPV9Hd5CCNXVrIU6H1+IcbvOVca8joPIoobu8/Fh9otvnbiuHNpv3FFWNquHaAKzBcQRAAnfNDz+8577x/vu7e416VQMUWeEFe40AwqybKreOrarl8h4jjKH1mR2Lw6XWBqO8sP8YAxSPAbpLyGN5BqZaMbw5iqJFBL2Hyx1n3kPl7qnqXVbH625wa/BeqXHk+bR7yvtpv7dpjNhSK8IPQZ6vV25j5HW0dWcONF7jQWOXHEgASOjdTsNgLrKkDiq7QoCn7D6Dn4mnam4rcyUyPlrLAWwlmYaTDq/E5wbrH2XrJbTt6n2wXq/q8CrvxyuxrR9CqaL9bFKzTCnJdJr2OGUbuhCbc42fO0QMbYgAjuN2u+lnuGQFfLbCufKtCysFv/8KezMnYMrBPajOLF+nCjZxzYYRE0nXde1jCLu6urq6ur5QHWB1dXV1dXW9Qtu2Bbp1ij4YA1jhgRpTz/DAC9eIOn6SHEfna6RQ2sM3HvK1sDpbGXvQ6GCMBh4y4QHAQvns8JK5s3LxuJfHrvS9Oav7Bj1RjIRJZowqsq+oEELhQT0m7zgKrRC75FVosFpXtBJxu8WiVJyIV9RZNtBRhGNY6eLCdLcY914lnayYCRhCMufQZ66icuh1ArTarOi89UdZITyvA91OVuaeN1mWWSOPAIWyHx/K3AmHapCyKmAD6InmUMPPLW1J54+/txi8KlmBo8OmfOjfEp/m51E5e58cYZTtB/cb73G4VT+DXQ63yuGaYN/hALwcdkVzXNHpNWhxfbDoG4/VeqjYY4X95tXg4YGZxCjnafrk+hNQWkwU+47mtAKNwrYAaUbbV3sNrl3WwQWDQTWFSrpWk3m42mAC0Xji08dHnsebuwfCHkQIa9bjZUeVnX8t0u5FDBoPRTE8pxgWlla1GKqel7T10orV+dmTfYhA1ImTy6KRQfRYndDFlfTzOkw64ZJDFwY9J8LBqNcIMFqHMkT+OVvfGruy8FU3ug0J/gL9fbJgWEIcgoHPxCL8rq6urq6uri/S0C9fV1dXV1fXf7iGYag+HQ0PrQOTekXmqg+8gyQ6RrKN5kf5NDuyhsAJaR6NUzaRaQJirzgcK7HqgzqBVrJ4VBR7bDb3UtDy8uZiioRVjDlxklziQzv3DQhWi3YBwRUEFwydJYXAzaceVsbMFBCEQR/mQ1JnVgnFSrBlL+kGHOA+RzmPUZ6fVhkkymkYBDP8YomMfAmdY1lC1of/4q6rQ8l5sUigyA4ifEIe3WQepaRLaOCXdkapG4zuMusk2hBPQz/XtgMO8zopGEHiLip88Nii7x9OodH6ouQARACi4sElB2iUvR/LzsUV7Xx86mDrvjJQ1ciZOcJcvq9s1yUarHKHmLqrspaY43gOTi6sQUbgik5ULCBLS5ZzyHIaR66NeV7l7fkiCdCGYBDxPIBROIZ0neB6sHcqaO2+O45WJUp0WRG66sxBScHvg4ObQMCYg08I3J1JvA/cRpDZ3YO2NoPBICYSuc5mmyzo9wjniC65pE6+XOzzVQnAEBVkV1yuBlczu708hjqpNc6K38VAZma5upb+F+1QM8ceC+w9rslBC8lAauX57SX5lcehyyCp2yoF2fAe9nRlmYYN/0wYa4yDf167urq6urq6fro6wOrq6urq6nqFYivJhsFm5QP/NEyMZ+GBdymrFa8DSlS6oICfMAlumRe5bi98Px+MN41OIcKGbfD3JWo5elJnTLLuoVyqTV7TB2F1JCWCFxayp0gXlFpkRPKyqHNpDK1rKCUFY4Qs6ypDGumeQqcQInWAM5wyiNL1pNGpss58aE9xIATQaYZVctjBm8MGgiC9OoQd+YBp3PmTrOQbx5AOnU/HEnQHWoNF16rBH3WIbZIP0/e8Z+rrr97JfJulhoXHBxdSsDgj4I9GuxTWHKNfHJIH0GbOnmTF71F7zjQKJp67NNfYYfKduOPMHVZ2vuHgoPJ5kixxP3RrucusxQ3dVeSuLitDdweZT4qkU4vAKNLxFK20n+X0YZ+qiOvBSCtdTGgTt1L4TZ1e0zRyrSEi6cAPkyIxwU/ckccCL3w/GbALCsvqHrZszjOWbrE0qq1RPRS9XrfrVUYcoAHeah1rlcdf2KeVq/a0oavstswabEVUEQBs3mw/HtccDZ6Zi0xL5zQSO6nLsU2ItLWF9ZK3leuoMD5beY3E+r+yXwc/LoBoAYhG3DGyWk6nL4ZWXp+M4uFzQ5aWNJJbW+S0/FbBf1dXV1dXV9fr1f9t2tXV1dXV9QpteEANWia92SSywTqS4MgI/hBvHIED0syVA6fIOJ3ofsKY/QG9OV5gnZUUBOvc8TLpGKqMKJA2wOIT4uhMYpl1aDFAsX29PH6QDSAtVD5QwzcDd1YY4MTSnqPBnFY+6ZDGIDl0GmV1XgFcAZLgYX+dF0YRGYPLNlExF7nNq/Yd0Xm0ts4vTogzd4rYOR0jjw4XXEeY5Z1T0rqx1GkEhxpiZ4RpuAdwD43q1FnWRSfagS+48ycogMGcuzTGvTAcEx+zOqng2BkOkb5yjAaGw4Q92acC+usIqA4RxBZ/tO1th8L9eIBdcuja2kGHqlhssdi24ebaDt1bGpHcO6IYBbTiccJMUaiSDO6IdVnppMtM1xU6oODmgutsgpMN/U1G2gZzorXOrRDbGvPpm3YxWueVfru2kne/y9pHVnR/nM6p/VHZjn8fQRBb1xTBqgMtdqyZq61kWbZFlnnm2mmfnW1lLxyPIOvFqaHKm7cPhFPLfOU5oNzfO8GyuRSHw5oTizwy9gjIxm47BcJcgyx7Vz8kvs/euKCdXW1iYlVnYzhAVu+u6+rq6urq6voydYDV1dXV1dX1SoUQtLMaD+ro8QG0gFsIUcGkX8dOpGRxNcAj7efBexR6HCebRQcZRcEY+54YjdOCa3UQFQMs+jpXSoMs840Q5/58IXgY4b6xiXG35xex2YeMEdKzg+4e0dgie3zYri0GeFZ2F/Ed6LharMOn7O6gEMYG1Dymly36V+g6QaeQuqD4UG+T7RxQuSvlWPz++c/89YO5ZLDl83nipDcHBcOQmOVct4WF3HC7MU4Jd9w4yjROdJ4RRjjUMlDk0b4Gqdzp5d1Uhwl9XuruzrF6gF3N0XUopw+H6YPep+XvAZgpBvCOEweT9VC5g2uw9x57wQhREB2sVoTO92uHmruNcL6EfNb5VAw8ns8nOU2jjENi+T1gEdZn9UJ7RO/yXpru5+6F/DzMFD4pUucaIq1q/jMCrUSwZlMTR49sai8Vi+tzsWtQ1AmHcxsUzOJzRbhVi+/cIotRaiy8lvPtJnlGz5pGZ/EGrDfenxhY2I5Y33Q+mRPSJkROJ25O13TUEvksBGVZNJYZY2pTBenqquowcwBc22fX10FugxrmeWH0FOsw6Il1gNXV1dXV1fX/gzrA6urq6urqeoWKAZCluZYEE8Z0It4wElZoHK0QDmAq2hHUiAGOYvEkMThAoOWT81h+bkAE3Uh0sQTrEwp8QMb3MieiqTPp8cMjH8IBqS7TSc7jJNMwKozCg7y5seC6WeebbLM6pcaYNH5miTCFNwZaalYodptbrE2LpHbHyrqsBGsAIsmdVrVasfce1RODWLE5yXZ4d3QoNZfSZ196ORRkYH9p0P6mEQXciDvCMVaqjCcAq4FOIJwXXDonAC9AsSHtAI0oJLRo3+DQzMBTmw5Yyg62WheXQspgET+HXg7C6ifgLdHlhNf6xElpriNzNdm5MhIIN9g40rEUDuvlWO5+hJ4eTyy4t83TVWTNWlbPMnY4unJu6/R0Omu5OeDioNdwvJzt/VWdWuzpKs0xd5wWCYDjpf/ok3K3Gl4fwu6p8phhNJgIeKtTIjViWwy6wdKYPdq5WYl/A2Y7pNXzRW9V5GcE61onZe4F7viMoJMK6w8RRE4aYOdX4HqZ80bgidfe5oXXhwyrHo9Z2tTFoqhXzygGdlsJ+652lxrvU9Qpoih8P50mnZipq3pNIWzH69fV1dXV1dX109Q7sLq6urq6ul4hhSnqcgGg2srWSp5FdOR/zrm5NKpF67ZlY/zOBTjESYUEARqJ044qjfcpADFQkIYGEhit45TALOk0EACgPwvxOOx3HKLcnq+yrFe+ZhA8SC8Si8j88kxHEj1ZsarbB04duEhCbN1UYuep0afNuqYGjb5ZkbiMA8uqgU9O00le1lkjlOYcInrB+zct1WbR+iFaVj9zpBzB1bG3CF8o427F2ux6UmB2Pp/5K0AUgA1AFs4X1+0237hdFoffzD2GY7GJhgRW1tlFNxlKzLEfFth7cbc64ggjcN1tQqF3YgFkDeZaEit55/sMVLGD6wAuPKaoXVVhn2aoKUedsGfvr7af1a4F+sDo5PPSedtmg1v2nySJeApifQohWbyeizw+PvG838bEGB6u3fPzs/2nzMAetGmIMqMTygrXeV0N7NA56E4rsSmBMfiRH85fdEIf7tNWJaAPqoTm3mIkEtfUp/Zhayk0osdo36bF6BpjFYVWBvro9LNzDdaxVYJd/0GBE9xogLyXLdOZOJ4mncgJd9SyynLTz5p3f+kp7sHOcnC7VVvHGKjANVr1Hg3mJswctKBR2el0kW/evZPHx0dZble2d6GaDv6uYyS2q6urq6ur66epA6yurq6urq5XSDutFFah7HrJM5+9ASfg4ritVrCdBvbyhNmKvlOUbd7kentRsCCplXRzmt6hh2cYJ/4KNxZiTZwOxyqevYPIu3yiuVo8wYWphQMiUoyC3WRZZo2x1bq7eFK0yW+VkTt2VFX1JMH6gqJuumMcGn1iHkmc/IaHenCHu7s7WYvI++1JVkw2RAE4ImktgudRM4UMKLr+XBrJS+oYKvtEQlcrbB8GOlxEdLIe42B3dzKvi6zrzHNe66qT+qq0yGLhJMSqPVJW1O6OMLGuqWi/usuJx2AF7gAlY4yyWqF6sbhnsrjjasc5OKTwY3cI5vFAFIgfAJh4ZBSvAwyz/btTq5W9t8hmaJHF6PvwlKP2l7OTiRMFU7TXbwR6E+FXldt8lct5kvs39/J8fZZtnWU6nwk4OXUvGCDiGi86nRIdWNGOh9P+Kl1IeC0vdLtPUWOpHofVuZn6/4t2ngUyXJ3Wp13oLCjT+58YyGMHGzxyGp/VDqlhCKRB+lnJ/D6q5jYDvYDJWJdYu5xMSAeUrrXL3R175OBAg3Nr3WZZ103dktbL1gBb3dQtZp9BB9MhJvltF5X1Z9l7R3N24bMPRxbOcSyc6rD2Eveurq6urq4vVwdYXV1dXV1dr5CWsUeJW1GHjQRCIsbXxoHODHcT0TFD14bwAfoWhO4oVZUC6CWH/iX/SUVBtfYSRS+IZnRNnTB0eeHhHiXck0bA3r79SgFCjPL08VEe3/8goVwkz2eZUWINNwoph+jktVEnGGL/LPC2aX4xBJsQV9RRAwcZ+rBYcAWSoi6yykL1KsOUOPFvnm+STnc2lTAcInQKcTaL4pVq7iRRaCHtT9JAgscMHdI5ADpGMU93ZxknRAODDDnI821muX5GobxBMsKJosXb6syp1u+lU/iO0/+aM8x7r8xRJIQcRd1RYkApxh1AGRys5owSK3iPFjsU2aNwOB+4fvC6fJhmaC9ScHUAd+Xg7OJEvHlpcGsv7td4G6Aq71UqdKxNaSIMRM0TQOs0Af4lrh/cX8Qsf/bdt/Lh/Qc7boVEAE1giIf5kYpxwsDtY23q5D11w2nRv4YxM88z6pTCoapTsBZ1bkUdgBCzugir7O4qAi5zWGH6IBxNhGS2LthxxnPU4QlYX2BnnIy5Llqi77FFlPqHIOPpxBhmsmjrZTozZrvBhRfh0JtlwqcXkBP5y6L3rMoh1hp3l5zfR1xT9qlZ0Ts+S8GwW/VJofhnAL5fas05P8WU1tPp9Nvktqurq6urq+tV6gCrq6urq6vrFUpbkWE32LSoXbQy6JGxpNycPDqhDSP2q1xOd/Ldt9/Jj+/fEz6JFUYfRRAB8GO9WJu5O/B9ptjgRIro8pnlNm9yuX+QYZrk4e0b+bt/+2/Lj0/P8vHxo6zPvyu/+sUv5fu//isZwsbycxZg88EcMOwkebG+IsCZdbNep8CaK0SlAllJlaEknbyoKIIRNdh0tusi9TrLtmS5O59E0qhupFp1oiHcY8NocclobiCb3JisIysblBC/ppHwIhwcSpkxRCEofHj7wDjX3flMFxEgxnW7stMK1wgTHkMurQ2KHVWYvGcAgu4sAA5cTIOR3McBkjGaVtT5hjhfNkAFkFQMfn1yz6z1SaOjBkAMdHF9YDJiKRohhPOLAHQz4HPoAst5j6/JAZYxSri1fi662SyiCrdRYleTARzY8IYgm/WeZYLLIAHOuCry8PYrfT+g0POzvEtJnj9+lPS48HXXhHJ1OyOAJL2yzWiVBnUDoj8LMIiOrCAyBoAi1FktkkE6N10tYdijc9wSBxMUQiX2Z7GcXwESrk1BQftGO5h1wqW2PirOswbGdrGuFOXB3ajOLa5tc0EBYN0/PMh0nhghRI8Von0AXHSYxcqC9+huRrv3NSfrnKv0SAJC6xqpzY1V232w88IU0k243pd508EOWP+l1nNKC1ZmOAxc6Orq6urq6vpp6gCrq6urq6vrNUrR4nqF08/cdYMpa+gagjsDD8SALegZinStFP5cXU0KMOZaZEonOlradDdTtELu3NxH5mKqWYas5Gxzd84wyOl85lS+3/vd35P/8b/7H+R/+l/+Z/m3/+bPCM/yfJPby6N8/OE3si6znC6TXC4XbnfkdLqVsT4cZwleYB05PQ6AYoWjBU6WtLulEJGq2r0tj89XAq80THTugLdsdDlZlxZglWj+DHGxMARJ5sbSrivECoWACvvwCGGw64afw0WDKu37+3u5nC6cnvfmzVsZ00BH0rrmNqiO7jW6qqK5fHRa42YwrBioQCeSsHOp8Fq68yt5T5WXdOMeADZhIqMBJY8QFhYwHTrDzGXVIJhIc1n5xERsZ7Bti3VdsQfLJw2678gdXFbULj5x0VxCQYK52vSvcmNSZ5dVpSnQqgqN1Kk2ymk6s6/sm3dfyxo2eX6+yg/f/1pOaZSXGOX6cpX58VGGooAs2xoB0GE0D/cSxwj4iKEFeZMRri1Yo2Lm+g82yRKAEvc710VCHOnyE4NAkc6mQXulGFHUO85+9GTl6UWvBCO2PvWvaiQy+n2ppcE+3A+AXH5WQpQzJnEOozzcvZG7yx37vnh8cDDOmUMOtNNM47L0UNlnmRHAFv3UljR8BgC89mEEidcbn5Fkaxv38uX6wuMlAMX1G8YlhFB6iXtXV1dXV9eXqwOsrq6urq6uVyhFhVaAQwpPik4HrLmVjQNirPMm53PktDxEolCC/vz0IrfbTFiBUf7oJbquWZ0o5tCY2L0T6eIAy2EcKe49VJyCBkCRFYbh5zqJL+IJXoaffSV//x/+A/nP/4u/J//oT/+RoILnL/79v5f7NzimFz7s353vtChcqry8VD6ASwot7hXsAT1E+1kJWq7NziMFKLmqHwVdQcu88lroJL6IGnU6sYJmxFpnGI4RzieAn7xmHgMf9tl5FPjQz30EBUtw96CYG8AHiA3g4OHhgSALTqLT6SLz00d5enqSZVkI4qakBfhb0WYqxM849S4r2Bo/K1Zv0wOt04qgAYDLIoOFUw/41vatAAAgAElEQVQHjUxy6p5GKIOV4XvMrxoISxY5C95h5XFJjyvi2LZtjw76NixCF+34sK9yPFYrtPfBAGKOLp2epwgH4DOMWlDPCZVwBk6RcHPApEFMx5tG+a/+y38gOYq8vFwl1U3+yT/93+X739zLh+9/kJI32dYsL8siedAS+WDnF6v+/hwGuqB4TYfJhkMWrTurUSasm6jAE/dDirmjAKbgphu1jwvvy9aSFauWsBPeVneiRUZQ7U7pEhIt9d//BquQUhFv4vkB1l3uL3I538nD/b3Eqt1huP7rPMt8fdFjw/EAtObS4ooslo/He1PpZBNzkKVgsUOLVg4GKjlJdF0V/g7mvBPmOpdSS+kdWF1dXV1dXV+uDrC6urq6urp+gtI4yJI3c2ApxNCYnDp5irmnxnGSdV3oSHKXDh9lUf6N4vCiD+oxWgiM79VuHcIVTXK1mFnycuygDhVEy27LIg8i8jS/yJOI/K2//3f42r/3y4/yyx9/LR+enuU5JVleJrqxbkuR2/MzwRfcTXjwTmHU+B7iXXAIwTUEuKAES9Zs7hmtnlfnVDDXUhp47ttWZV1WuE5kwHbGgaALfVsATLECYE0EPbftRqhHaJS0pwgwYDUH1ggD0pQYT0tjkMtwJ/cP9/Lu3dfy7t07maZJu8CWLLfnm8wvMy8UtpGrzdCLwVw6XsRtAAkwZZ7551z2uKHfs+SdWO6oEq3/Osb9HF4BaLV7Y/eXrqnD7/UNnzlwLJbo4KoBLI/LeXfWcZu2rWDdWwRlWd17Gl9U957tgHG/0zg2KMnlFSLLzP/b/+a/l/v7s/zbv/yXktJJ/vE//ccyAMRKkQ8fPshmoJadZhYHHYaTrPNV8rbQoYVIZQw2UTMMcnd/keszpu8lQldM+tvyqgXwPMaNLik4uKqDPhspWEnfImOzueqkSfZrhYEwDu4nuPNoQBxGXieFu6PEuBFqIb473t1LiUku92/lzdu3BHeYSIlJlHVxJ53IOi8Wq7SJouaoymLgzAYo6OfZrm/a3V7cP9avTf8ExkqMyxb2axW66hLxorLoHiHs6urq6ur6UnWA1dXV1dXV9Qot1h9U8IAeFZIUm8gn5iQBPDmdRro7ECUkuELnj1QWSwMYrcvCh+5iscIhTHyoL+ZCylG7mwiKGK0yCMEoVrbCdZFtWWVG9OvlJh9++FH+8q/+nXzzH/+O3MlFfv8f/mfy7b/4f+QXv/i1ghxEozgN8UVOb+4IMnC0VzjKYOACGMD0N5scCIgAGEUghyji7UawBpcYzwfwp3g39SBDAnDJBBqYbIdjnKwD6f7uq3aR4UpD+TzdL3CQJTiEBvZZaak2Cs03xrMQR7y/XOR8usj57k7evHnDyYccuRhQ46SuNnzhPpSk96PSszUoaImVQKEVhcMhByBh0UGP+dFt9VnpejXnjl6QsMf7DiXtLgdkcnBdff4aOTiz6uF9vl0vgPdoXPDjEdG4Is5hGBglBACNViDOCqndR8QIXw06bRJF5wsmZmLd3W7yvMwSv6kiF5HfPf2+/Ndfv5F/9+u/UmfgaZCAAvTnJ15HdIZhP1UU9GyXi07zEwWyPu1QoU6S09uB/VvZ4n0xB7rzAHsxeZPTIAG1knaMaZl+ojOPUK7ovSDIykXGxDwnoReifnG0YQP4Hz4A6G0bqgJTrO2U5DRO8vbtW3ZdIdK33BZO/9SGegXIp/NIOKydb4UTJjGEoQJa4ZrloAMWqhbXF0RSOfxA1yejsLi+QYGvxw7hyORnfrDJjbXOyjp7h3tXV1dXV9eXqgOsrq6urq6uVwgP+ZnhoKKwAS6UNEim00S7eQIjYtUmrGmnzmpOK4CfOI1SMD0ND7gouwYoSMUmBBbJ2Kbtq5izS8xFxO4tAxyEW4AF6ypPT4/yq5//XP75//Z/yh/+4R8yavf8/j1dKWEcZLxc5M3Dg6zLjZ1OcGChFwgP9nfTiQ/rjK0RqsEBM0iaBnXCIG51uZcwnbRXCVGvNCqAw0P7surEQl4bIfRCXG1dN7ler3I6ndgH5v1WiPrBlYWfE8AYdRmtl0qnLp415jhodO5rOq++tpL8wq9nO4d5nglVYoytN0zn6mWJxYAWY19wdgV1xzi8MjdbOHRUCfqOggI6ums+mwwYDUxFK0dnt5a9Zkjpk8WkTiGFPF7S/omT6jAVMVhEUOhIi+11be8G4ADecosT+rS+qiAILiCPbJYs66LRz/U2yzLe5Psff5C//PlfyZ/+6Z/KH/3RH8kf/MEfyF/8xV/IV1+9lW9/73cY4/sWIOv5TqOg88z7zD40OAlLpnMPJenQDGcdAa72VWGdrvMq83rjuj6jQP1w/bCuYtynbnIiYTagiPL1qGAQwAvnczpN5lAMjOJK3rhu/Hqzl+sUCF+xxTkX+fbbr603rXJdvLw8y/VJv/A51YmL9lfgTUFxJrCsBHKIFOKeIgaZkrkmzdoWLObpn8VAhmZ9aii1LzaNsCpv9EGTHWB1dXV1dXV9uTrA6urq6urqeoXQoQQ/SnGQhYfhKLJWLerGAzOibRuK0eMm67Lpw3WQVuKOqX4AHfgzuogAiXyaoRigQP9RjermAnzBr4UdRJXRO/wbHA/c2B8gEfTzX/xc/o//9Z/In/+Lf8meqIET5j4QMEzjIF+9/UqWdZb1epUF8Ol2k/uvvjHAotcgmLtrtY4txKK8ZN6PkW4uuNDsQV1Eu4wQEWP3EiY1TmODBMFdT+uif+b3ODqOkA4F9/O8EtrAnaXntfAangFKQpC3797J23dfEfawkNsA1uPjR7leX2yb2lHVkA6dXEX7q0RBzubxvANQCEldPdXK5eXgwvqbIFc1kHV0ZrlrikDGIojFwNZg+2CHVimtEF97yPZti0UUB0LRfTst/mfQihE7xj6jOqMMqgC4rFtuxeMKtdgSJcs8yxN724r86z/7M0nTJI8/fJB/9u6fEQr+3f/k9+Xd5U7++bwwnvnN+o08Pb/Iy/MjnVvHKXrsEpsmOd+dCHuu11meHj8yyvrm4Z79bg7ylhVF77q+N7sP2BSB2DK3+1KsoyzYWhvg2IoW00Okb9J7tCyrpItIWTaek0Q9HkwCxHk8AJZOE/fLLjQA3lzk+fERhV4sk8dx3OaFYLWyrD7r5EMJdE4alVJo5eDKoBs+gxofDKIjN8XW9kZguK06ECEUq/CvZQaAS5+Bza6urq6urq7XqwOsrq6urq6uV2izqYBZtNwbTiI8R/MhFpE3OLH02ZXOEbEHXETi1OGT+QC9QwmNgKFxinEsRL8IqmIrS997lDQFtbL8XN+L76HjB9PZ4Nd6+vBR/vrhQR7ePNDBwr5vc/i8XK90zyzsZR/k3bc/kzEmOZ9PhA4oQ//Nhx/l7Zs3dJhx+lya2jTAYxG1dy4xhOU9TSa6Y6oVXbMXrGjPFhxciCsycqUADwABx38yAIECbBS8w7UG6IYOMUbKtk3ev39PZ828zDzWJ7hqXp4V2GDiXd6a40XEC/ATgWNwYGWwqZrbrNpkwXgob8e+3DUUD0CrbfwY6fukk8zKzs2NVgEzrfR9OPZa+bRB7NdAGN9zcHKJXcdiYO0YRKQjyIrTvQtqsImM2qlmkwGxX5w/oJZPuwxBfvOr7+X/fvm/5M+++tfy7ptv5P7uTt493NEl93f+4D+VX37/vfy//+pf2brNhFGIeMqx5wvr6fGFnWUARDfsg687tQmO0OV04j2DYwvHtWwLI30FBfFpkNtylcv5ojCuluYeu4sK5QB/MTESAwV+/PGDpKCl7YjwhinJGJJ2uaEYHoBp3WSFY2sc5OXlhc4zAN6yVZoYEVM9n+9knW9W3l8Vpppb0qdnIo5YrQNrGCKjpWrOyhI2klfCNsC9WlcbxBAIuLULS2dFYo3ge5fLpZdgdXV1dXV1faE6wOrq6urq6nq1KgEMIYLYpL0Y5bY80/WDB+/zOKpTigXQq4BDJY+SlSwLIoTmuIHTqAiiWSfGtraijiUUbuMrmzslFy19Z6l4VAdWigp70FO03GZBcOrjh0Venj/ymNgtlQZ9zzRJRs/PlmVEl1BGx1SQJzi45huPR8usC91T6DSiw2w82fFoK9PR9bNP4asyr7NMp7M45sKvACA4fzz8wwFT2HWkxe21hBYrxP5O5zMdPXh9TIHwCvAEpevX6zMn2BFypSRXTB68XWUBvIPLCoAm6MRGTB2MBpUIIhBXvGUWwg9hh3DoXPI/eczPY6BwSrGf6TO3FL5Ph9Th3Fux+wF2+VTDigmGRYvJq2XKCBR9qqDtnxMFhQSF1ywSRhUDIXvc0J1a9dCvhWu/YuoiI6cKG+HG4iVnAXqyyY5ZZLnJr7+/yf3zvTx9eC+/+utfyHSa5P7NA91ueZ1ZuM+1gDUCpxQmX04K1CzJSti6bCuh4fl0lnkcGCX9/9h7wy3ZjSRJzyMCyLqXvbM756zeUT+kx5F+6B119qhnmryVCUSEjpmbB1BkTzeLxZlfbi0uL6sykUAgkkN8MjN3GPnGaOX+thPswBV3TF/P0YecaJ3wCieG67XmgJQuOk1YxP1EnxQ+x7Tu+7fGffaEE6tu7JSju2k6PISzCq4rXPzz/Wm//O2v3t22HGTdjnHSMcguq+JRUroFi0/OJHzEPpyaiukX7LFaTVcchK+F68EJmJhICsfgf/tX+9/+5/+0//d//S9cUnm0/Q138DzHfTBlKpVKpVKpP6AEWKlUKpVKfVJzTuWDHGggVmSKxY3puaLJyNTJEnNE5M53fwh3B87gQ3ZjtKraY28Op14HS6hX99GcyttNH+0/1JlER5E7YViwXdwNAodVPw8HN5tH+KJX6hwny9Ifb7v3/KizB8CJ091Od+jgQR2xRET4OEJtqwu2oevnHg1z01JlZOro/v73X37I+eRRO49WOXBhfxhh3MbrNbM1hbEIVlQVzeNZ/8f7D34ezg09V+hbouvlPOyHPoeTE82dQligbXvws1nWzm6l14cooIVLSsAqoNDqKLq/ViXjQ/ct4n1cX06Z884sn8TowIi9aDfH1GPfvV9J62OKIEaEMWKIpwrjp87hlDNsu3VnNZW9z9se8SECwzqcQnBABSStdTnvopgeoOWBXidENo8n9+2rvOx17Pbzz/9OGDOL97o1AUq6vVql6833W2ck8FHevBvrQJTv3/j5+DkHFxSPirKIX66wUPRfseML0BMdWnJbwaXXA4hOf/8Q0ANIQmwPAwRG996wt4cPGEAHWzjm8HNEE7lnXk97/vhh59FXZxlukr6uHxXxUN2fwqJ4jxDie+3uNdNk0d3e3r7Zzz//zZ7Y2zzl5snDWhhr5X7y/fmGQz2fP/Jfs6lUKpVKfVEJsFKpVCqV+oQIKfrJKXjnrybMwe1TbPduK0Xl8PCPqWjHs7N/CUACzq2hP4NQNbp5vJtHFMHjhHSnuNMED+SIFcKhsj4WHU/DS6n3utmskw4UgCsAI0Cu0h3k4HzOcq6yb++rOvlwjwgWnV21yEnijhTGF48rJoc+r53QwF1aLLre3HUEoBVr4BDC+5kAOVjwjfWSA+nt8XDHzPQ4GGABJ9txuJ8fh66d87XcVIhqvT+fK8I2NfGRPV2j2Gu4E429SSwC1xLd4JNFQbyigTGRMKARXvdEZC6ikorwRfF6FHjHpD9GEQW0TCXmRcXid0iG13VGzebq0JqaKNhUPN8jznifXihHWLSBEyZtm43bsfz6bHVwVRWe0yenIQBw2uEYiNe9t6e9odz89bL3afb2/bttWyMUdLfZsHlMuu9wbwBCcU/xO++VwiS/6DZzhx3vMSYAdo/XEqgJiEYbF/ZfwKlwFOLavR+reUH86WXq2Nfv9v7h3h3DC+t/mb9w/aJT6pf3d07i5P1ohTALPW/96V10SFLSZ6ebxn1rsR9+ZYoqcduvHCpdWubxX6xhfWy+T55Pniv2Hz9n+p5BbBFXiX4tjE08z+Nx9GPLEvdUKpVKpb6uBFipVCqVSn1C4XypY+54KN2KO4sQTSLAonNkEBqtSWd44EY5+fsVt9sBGuDgMoAkBxWNRehjTVzr7LXy8nZCo3HymIjSccS/Po9Mobn7Z1NV0/k6OfYfoOLe6wNQAPcIwBPcM8/3d3tsD2v742MErrmzZYwuWOBg6Oef4Yq6JuT17qDjpSmAxil43V503Qj+EAgVxuN+KJ4G9xlABcrk54DD6kUYsDP6poL8MeiiKepHwvt+eb4TVIWwzjgvQMLJyODmwGgqRshmsJujbQgyAVSxw8ynCHrC0aN74bxaxe4qYV9RQRSy0/UU99Mjgk1OrKkpgRo/56+JiKGOHRFCu31OgBP+VL8bihKaOrgYNaR7aaw+rjhOdH+xKJ33fBJecX8q5jq0NxmVZLz1tL/++78vRxkgEM8fJeqYJtlOFrY/3irjhe/Pw7799N3evn235/sPO+Dk6gBCm7rKnlwDj8Yqzmd+XE4Z3N98v6C0H3AMsT846wB9Hg86siLuB6gHOFTVUFXkokLMdbRiv7wPRkin1ouRy9fLnV9wCFq57WkHpr5OdTkb47M4t3J67xyOg/hjxCWnnIYAuhVgrsIB9uJxGHfcmvXDHXA9Svm5vrV0G4/mAcT812wqlUqlUl9UAqxUKpVKpT4pQJLT3t11VLxA+1DZ9Qt9VoIWPl3NY1f+sNuDQ6wCdjx9YwIaoBA6doBbAGTwYI0yc6vDfvrpJzqUWOw+h09es5iKty0nU1NnlXcGqaeLD/Zdbp3KQmpEyd7m5hHI3u2vP/7Nvn//i8MxTuKr9vMPB1UAZ3A+xSQ5umUUTTOWwXdGv550BQ2+nhDH3J2CHis4a3AMlGnjOn4u1f7lv/+L921hGiIicwJbY9/Xcdi3hUgaIFb1vqFNcUmHE2YPOMUAaZrDCE5qrJttAIDEiu4s20pzh1sVsOiKlQVcAlC6ObWiqD36mJogUTi3jgCZiupNwZWh4zVBjH5zT5ncSJScWOctWnj/ud38QcU/yAEU/uMNvWB6TS0+QZJrQADTzbr2ltx97Bvj74fHRRnJKw6R9s4eqY7YIMDQ8VKnmEOwvrnTCRMfGZeE4+hHsX/rJ+Oh9KPBkXQc7IXa2+bwTgXwyynW3VWGAvcQXVoCd9+/f7OO78vzxVgshhK442+z19njltjj2xvX4v3Hk84r7Ce4oVji7q/S2v0WXPkyR+/Y5bzyKGlVH5eiraeDZHzX154QHCxTwwm6QzLem+b7fRyOS1FWP8coqLUvw7v6swMrlUqlUqmvKQFWKpVKpVKfFAFNrfbsHt8DJDjZ+F0ILF7P1wIeUdgOPR67PeH22dAwbSpJ73TCAIJUTecDrDnGi+6Tre6MaAFUnJjbz1qsysmFDkUGLSKAB3yIXiXf+Ev0g/BqsujcCFcO+wXAYQGV4pFCPLwDHOGzATsmK+X5c1T4bIj+yXF0f6jH7wHpBgvbT/YUWYsYngMZXDMBlIATurKiU6hErBKw4fS+p9c4w2BEGMb1KQ5TCCSKdyg19UHV4S6deQ46urqcbuwMQwwx3Em3KFdXMbuXdvfLCRUuGvwdrp5bVxXXkoBlrHL1eO24UmjXnxVBvNOL1YUleEMoxiJyQbCYcigQhnXvjOWdDs7i9yvW2ORSC0rj5fNVvWN0MLEXbbPSx9qn2DPHj8PG25ttD7PjCTfVoemVxaOUp9nfXn8TuDGPpM5hW9+5x4/h68ZOs2H2+vEu+KhpiNgHcjkNAsah865esD99/8SaRl+ZT4cEBMT9laMK0O3H5BRNfCeKYpOrf2x4vLY1lFEVu261x1kLYWZArYjiRiR10IFlOh7NejS5dU7KLP20t/rN3r49/N4zbuqQCzFbxBTheIwplM0Dv4y0bqXWeZyWSqVSqVTqa0qAlUqlUqnUJ3TGA+rbbvvfmh12uPMnomIsrj5t2795VMkK43F4WEcvDuAWI27hFCkADZiMNqwiKjgdwuB5ehMIMEEcgAFGngqzhz4hcGsOs85pB+HRbkPV3UWEarIXSRPtpp/ri+XZjaAJkAQAig4S9QmBFXV0JvXTQRFcYb3Y+eqrQ8oLy/npBEQEAdX7qAALcP4o3q7L5xQumOLl83OuPqIm8uOmtkJXl4Uzin1gbVmSCH2qQ7fnsy9wEdDklNso1p8BsYBIuv5gGzsAD4ruY+pflKsrBkewFCQtwImuZkYfmhWBR1/LqYjf6mpS3O9e3m432KW42ZqcWATShorccS6w8AB+tujCUsF6J68aAmzTwR6u8XQwCuPTKRfZrihnGL6wrlNgDJ/5ACgrXviPQOuB6ZnH5BS/De5AnTD2zb/+678yfkq4Wtv63QKh5vtuG+02AdChoVl0pPl/hrLAHoAK91SgB/cQZenn8+XgCxMUMWDg/al+uWuaJCES3Ymdi+pHr5HC5HtHnzc/261HTsJEzKnpohv2w3A4DCcWe+dwsOrwLiZQwl0Y3yPfgwxv8rMb3Ywej2WatOW/ZVOpVCqV+qoSYKVSqVQq9QmxCyd6iVavEcCG/6zcI0cFZc67vdglNZbjZ6q3atZOgBUC6jlRpg7vRp2cHkcwURyEHIJLFJ6nR/EoHQDCVq/SbsAhgY+iHqWXep72bWcnVmm7nEZ1uZWKyuchgAvT53NiHKDCcU3XY1cQHFdzaHpb9AdNOmDw916m7VbtOA97vT+toitI6OjRdpKGLlA1qq+JaUodXktoIehU1Vvk7h5pmHckwQnEzqbN4rdxD5puROALkxOpxaRHxQkdKtpydIXLKfqMLOBTQKVy9SsVuwqo5s1qBfeWbRvhU2CrezxQJ3o5j24gi+CsK2KnOF64+ug4Ku6igkfO1jRF3Zli6uhy1ul4pziMaXW9jq4lgTDcL65hTN2Lkx3T3va3teRTx0ekELuh0xl1eFR0er/WiPtlvj+64FHTdEkO6KveX+bfo2HHUFdWuOS0ngBkXWXw3NdjaMplu7npKh2HPqWz+FGW5e4+AdEjtoOId4Uzze+0Hwt7vNz2WfSVobONnXIcSlAZZSxHl/Pthx3TO7TQQYc447fH7sX5HHYwx7f9kfHBVCqVSqW+qARYqVQqlUp9Qni4L3hWfT8OuJ/K3OwHx+c1ulg6pgAWd+8AMByKF8m35AXvxejygGNk9qs3Cg/OuzkQc9NPXcQD5esRLOOEuO4P4ntrKkt3ZxhLv/kqgAQv7/a/OdD4cR6EXjg0HV0xma/45LquWNp6cNe0Nzpt7AI1iJrd415w8Thg8ajgIHgwRfi6T2o7HH54SXv3PiY5omrkHTtAhy2gwKJtOo0Gy+dZkg9w0TWxDmX5tdnj7dtydYXTqig+CdhzaiogzrEKStGppel4PSw5N7fVihfqnOmEagKGRdMdNf3Q75nWm6636GDqC4pNwcHQPQbonVM+LXCy7HxfHVpDbiyza9og9w2dYv45UR6+qaMNvVBcw9I0DVDxvXMQ4HHiJPuzomR+GBKxvWIfbQ7w+lzuJrgK6brDviuYwveugQMBxLzwH/enaW0JmjSdLwYTOByadDXdFY6q83R4FRBuBoELnobvDpyCpmmCuA45EP1+TcJf9NLh3J6YSIhr3pugFzrbPE6Lzjh3yJlHIRVxrKMp4uhORsCrKocbv3eb0eGGwQy4LbhXBLYAzFi3szOCGwFdnlktlkqlUqlU6mtKgJVKpVKp1CcUYITQpSPC97BWfrHHXu3H6U4Rdg2x3F1+oFrtcXuARXn1znLszbujdExGrepVQG00kPQVwWIYr0V0rPMBe5P7CACJgbzpcTK6hapdfUKEaN36+9O2x+bOK5VQV5a1ywlkczmeApxETxUfysUdCGXgLike0SJIQWTMHN7ATeS9Rj5tj5Pauke3OqNZk6XhoAf7vq1eL7ymc13LAjsAD3T0DI8o4hoD7ODYpzqJfMhfXecbzqjZ0EW0OUC6OaoiIjjltpqKWOqXDrtaW1P+cC82TM4rvuYmZ1PAq4iWuS+u8fUoOsdkRoI4TbOL6wpQhjXGpD/EDzmFr9yn53lcMJx/8bPlHRrX5MIi5xZ5aq0q9q/uzptD0b6iPeT3r26FzrdwlHH6JQYGVI/UnQSlndM2h3qzikBUU8n/XeGJKrf97p3u4XJyJ1bBdwSwa9s9MjknnXruYHNHmOdSnVyNMa/1jn4z/X2to02V2rvTanLYQLVt365JlmPaY0e8ry2XHdcYkVvsuebDAoTD1trvcQzGXb39DAATYBf32L+7Xl7vfWV0Bs5e5qvTrPgRXqZSqVQqlfq8EmClUqlUKvUJFUAM84fsum/2/PGLx7mObv08FhwiOODDbjxAFztPj8t5+XpZPUR4ED4UF0Md9VDcz0HUXDG5fa+avlc4TRBukCecWXq4x9+roFkfYwGxmOonvCZXlLuVAJYa3WNyvGhi2+v0CXMANXgvPo8Olj4uOAF4hRgVXU2CPIqn8YDVVobNy7ZNEMsdMu0Gh+hoQhn9OAW2JqFTiG4kwJNRfHoduoZ2d8+0zScW+v9XCHrgjGJ3lu4DIUhxO9qCLOjnKooqRl9Y9yJ1ggy9l5DsOBe0GMVBHqca4kxOQRmBKa63oqGEHkN+oXDfsXS8+drMoqgoHHvzA7iK82yCKHRrqZg+kKbdo4xFEGe4E4ldVhOQ88HP7izGhzsK/wE4HDpOxUdbWeeL5fdJgHJgwZnUjLFOTAakc0lT//Aan5LogHVMQS6niesaOBQgjjcLu9O8tN543YMQtq+9wImLEf8L91mLSYFyem1NrimHg0Wl7HDx0SlmU/dw82jlrCt+aOjFgi+y67tY3bnmvxoCYZumd3o0Eavb6u7fpem9XP5dnuvccS0A2DOuH/FPDRVIpVKpVCr1NSXASqVSqVTqE4qS8H3b7ESh9OvFB1s8GLNfariLB/Bgw/+ZRSRroJAaBe4/sxfJI1D+oBwOKQWt2KUFAANg9ECUC+DmcOdSuHfwsMyC8jYWvKVaClYAACAASURBVAJQcFePAEDACZWZ4/xa2RxiWLV9q3QIVUXMEKGKzilODhTw2dtGcKQcok+GW8CkqIC8rHij6TwJCXQu4eri5+6F8Svjw75cTHBYAU508wmG97J2lGrTZdVXV5SDKY/xReyrtfobZ9QdQBEKFj+ncEbhfjGIGWsIF06LKYuCheYQosj5Ndh15OfM8nv0ZzF8iVjkufqkSKWmu/CIUrS09+mN/gOPpWHf4L67c6+yEwogDcX/RpcW3FKYIthvBeRXj5OtbrW+ur6qyZ12HPzZxv10cwYWj6Oa3H9FoJGT/Fj8fyu8h3sJZjJBxRV7lMvLBOFqL/dT8uPqM2dR5A9Q9njXtL7q7rsbvLMVYS3++nOsDrNNcT066xjlHCr090hpnSe717ifGMscy3FX1duGC2KcUlHaqUmEgIvzdHBKR6IvPD8D343GAQnTu83Wmk99Z4dteyO8wjk+3h5c72Hzte+PEaA2lUqlUqnUH1cCrFQqlUqlPqkxxqQbhRMJMWL/ihqdrychQVefESa/1f1hx+vp7p0APyjUHt7hhNfBddTH5dPwCFzxh/7oA5JzCxCFThnBh1CAIZaUIzKnCYZrbJ5iVrtKqXHeQ8XbgElwRyEqBeASXVV8+O9DLiITyJmKcM0VaVyl5jOcYIJtvX9wODFSx/lz9Yo2yg1m7oXxdTxPt9Sgn0iuMEbgxm0yoY7v1/U1ZxT4XFsutbgJut4RkcSmmKViglhHIRi65fr4zUaiE4xTCgG4NCmQBf6DjqDlVBsqZ6/RceUOork5TIKjyIcqErNdEcToCOuK6DF5V70zS64tB3C+P7lutbCYHS4rnybpQI7TCOWuwx7CP9PRx9ig9g/2amu3PVXYdVblPOIa4pgxRbKFw+5ak6mYHd1NJ4cL+udeCVWf4KiuMRS0u5uweTH95v1xPvVx8/tNqHWBLpM7jDDS3Pn1wl4kiD3tAkoOy5rcYjFAwOOZ3hvXmnddbQKzdCVyn5bLyfjwzi3AKxxjf7zR3YjXf3t7W11yqVQqlUql/rgSYKVSqVQq9QnB0QInBsqhTZEhulQAjwgU3Lnz0FTAcEj99P0n++v/91fCIpseC1zdVnx49lJ2FJKXOZer5A5UOou0/UGYziMgkeggmjGxMDqcjF1FDsDUb6UIF11Ep11T3PQsX9TR5D9wJxNA0prEJ1gSESoHHnVBD49JntdiFrvAVEzQU38Q41+zOtzqtrq/4lxZ+r1AzeX8OnHu6Mgqcdw/0RlVcE3zn8Mv9nW5m2jHNEXzHrBYR0yHdDh3OXuInYq7p+AUaniNIJY76+Ry06TLMb0gnhHS4oXoPN7wQvvG6Gf1qB9LrLomYMpVNXqcjhfl9yGY5G60FwvvO4cMwC10PuEwetjr9e79ZjGnD9HR06c9NsZAG/e/u5fmmlpomkyJrYDCd44sQJQu3Fq8V4o5yqXo+8odhYw+WkygjM6xsXrMCqBSvP7o/vlaG79Guc4E6IYmE063mYFCeY96twXz+J0QAGVB/xgrChvTC1ub5gy387v/bdsNsy4Z+z1Ogji/fzpnRF/NS/Zt8/vxOg7LDqxUKpVKpb6uBFipVCqVSn1CO/uLomi626uf7EdCTxEn5NVOwICoVRRw43ePzR/yh3qI8Ncwnxg4OCGQPhH+GV08JfqNWHpdNMXNoRXiSlFgjt8FJELXVjijPConQDUdsKxOoZiKVuYqtwaUwcO6CTjs+8O7gHYvI2+3sm4AAvR54WF9q+U/jtoNBw7smdK5FJ1vlJ3PKw/3K8eTu5VQVo913cpOuLA1P+/orgon2tedUabusvmP4ZeTwQWoaq0fivLdUVXc+bMVxkg1A3Bd5IcUYYlrrSvK57THgU6UpgNE3ovcl+PMLsdZ6R6l9HvrnWEO3dDBVJA4tZd5FBNFWIClgEwHgOCbO4cAsQjjcIjd4Rz2AEAVJmh6/DXuK1xsVRHOdkU4Z7mijavPyl1u/CkgE9YrYBOL+weL//fmkUITsJ1VUx9/Z5yT92FDT5UD2y5gXOtmW925nwicBFTDWThXVNLhLm8H9sNWtU+9BP84BMkA6tBpp5gsIBzXYNvs8djs7fs3uttQzj/kNkulUqlUKvU1JcBKpVKpVOqTOjwedWylnZ5purmcFKN7fz3ZX7S/7YxyTUxsQz/OudvZD7pMGN87vSQdkbFznt51tfkUtGsamsn1NPhAzkd8AbGI8xmLso/LoVXcNURANFTuTdhUBYBuI/4BSJTfwkP51vbVV8T/jfJ3IUW1q8z9N1E7uHvOw3umikfGLGJhcs/gFLrg0t3xRDhoVyfSfbLgtnuRtwOwah9Y0BecUVzT4q6dfwi/GO8zvo6ALaYOoiicMC4mQDqI4fDEEcXsXdP7thWHpNtpmqCNn7vblAoh1T3o9md1cdG8VouX1qujquvYiAwSrv76fgNw8j5f++6PRjinJlV2TuTEvvdRhdjTI64f19J8UEGpn4tzWsQHFblFF1hhz5tD36nvalEZvhKc/vfi677TkefWwOhwQxfXqMOHCQCmwo21GTuwXii3R19bq/Z4+2b//V//h/3tbz/j8x5zzvp6vW5B3lQqlUqlUn9ECbBSqVQqlfqkzurgAhDgBISouyJ9xodilnEDCp3T6vfG5/Fffvlh+2PnpMJD0whXj5WAwjwuEMYCbjifmj9ds2tKcSi8/7E93JFzdgEThxx82Fb3DyEX4orKyTlQcThQ1U0E9xiAQ1OMEerFo4r/oevnCz1Td4jGli1BkDt8MUI5W5AugFNMdRw3gEIFFviKM6ra74NfuIbtOu/OtWtyi4012RHCfYqomkVE09zx1m7Ry0lX0ObQxuaCcv8QEP5ZXVy8p5NTET1i+vvuN7qnvgLUom8M8cYAaryNmDJZfLjAeY4/HOdk8pQF/vju6N5hzerl5CJ4xicQNnqn1jYCCG/+u3EB5KII5eDgABxf97ZU+/bt2+rDej3f+X1/HS+rj81GwfCCt4RXqVQqlUp9UQmwUqlUKpX6A4JrBLEsn1ymDh+4XDRJrgrW8OEeo/QRuVMPEWJGo5/m7/LnWvYC4QG6eIwQnUPsw0KMab/6pwgiqk9tixhfxPvoUNo2e72eDtECknSfRshCajiO6sc4E9w5dFsNP370+fxnTuDjZ2iN7Nfw5TawrVq7ps4Vj22WeL/kHVDhJHPgg36iQvCg6YwfnFGabnd3Rq1S+X8Mv+pWrnJ8Fuv7NMXp5U5+fMUycS29KxKq052CWbVtq0h83hxuW2lrkqIFQKm2zufP6+KSUwkx0HKBwt97vyO+6O6zP7ncXuDun+6xfxLnZCQWQJGuv0ro3DFEwMve3EWISKSAnbNdOdPY4+V4k/Cs7hxw8O3bd3t//+GfA4B5nCreb7zP6BZ7tGJ//etf7e3bW+nneIwx6sgEYSqVSqVSX1YCrFQqlUqlPiEG+CrG6f/QVL7osiqrDd0Lwd3RRBcGJvydnU4Qn7rW3A0yrwf7KZcVXVngBgWl2k3OD3On1SyM5AVYCMdPCO4kvI5Oq+YT6kZ8zvA+Kby+yfnkJzvXNEOWwv9XuH6qF5YXa+rb8v8cCfjirpgr3oZ1AyAA1EPksjS51uYQVNqWmytcOn59g3BqTvemwTm1JuAJJhEabh7hnPbPY4HTBMdKuMC8mRzgESXfu4q7wwFUSri7BicFMkJYqnrJxj91PAEqNgKxImfdtNH6b+BN3M/f6zjDPTFBrj9yvzm0oCqgVwN4/jnl9tZsDQ74apyT3zM4smonRJwv79oiv+LabO7AQn8WpnKaAKn+3xrX1f2+vMFFiR6747T38VoOrTEPuura/sY9gWL8MWdptTxmH/uB8qyMEKZSqVQq9SUlwEqlUqlU6hMKSALXxTkdQBiLqOMY6MeZ6mlCxKzKORUT/IyRrShOJ7Y4FfErG4ufB0AW3DtHt/LwEf54nmZ/FKDU6VPp8Gh/nv7wz+l+s1ifPjWQrhWUYwdkaQI+N+DlE/7KAgy9/1dO4PNCegI7On4u+FKqO5z8c5d1ycrs7E2amoxIGEe3W7lShIIwlevhXVxndHHh/fcurnoBRzir7HfEAmPKYjiYIAA4XC9LvUt0MA3BqhbbYumPONywVlMIqllZ5+AdZ93XtZTVUfVrxxntRcsG5NMrAeK+er8ZEdV+/zPL7f+sOOe+NTv7tHrGtEAfwNAFL/mdFFni+gtjXudygcEZ8WBBxQ1dZufL9wCK4+Hmqtf95/sAsKrVed8wqVQqlUql/pASYKVSqVQq9QcECIGHWQcVVf1RXgwNsDTYj9M5dVB5Jzo3TA/D6EeCYweOIqCsRudO8Sih3D3P80WwEg/edI3ATVTc9QJQ0MsQuKgLBvBBm+6uK4rlrKxd5eiaTOjt1W57+mpk6zOQArAMJiCCLMYC5ZxRrfYF+Ip1lOZXj1nWADRwLh2HNUzKA5vpAQF/BWFmOLyiy6gQ+t27uCabzX2K5O+JBfqBYs9Mvh7F/L72Y5XO30WX2DjtthRfdrgNOdx4Lj3goEDPvCY+HudVBs+y9FrVJ/bn3O8gPn9Guf3UgIA/K84Z3wGPofr+IXQbg/8R3LEeuj9dsUCL6Cq6yVrVPfEVfP/x7r1mAbpqpVsO++nt8c2eev+PH+/2/ft37AUQuBZAK5VKpVKp1B9XAqxUKpVKpT6heBCFIyfG6zOeZu6yQvaN0GZqytl0QGOlyWVk9joOez7fGVkCaNq2N394x2vnuaaw8TN+XVQuAOUxRaMLZI6x4nDh5mly+XRN9IuoGJw2hBr9WPCtRZfRnxDZ+r0T+DjhrqqX6O6cMTln2sbrIyQ0Lz8P+oNurQBYRWszuwroBWGidDtK1Jt6vk4VqwOgbe26NEyWxNr0iB/+g1igBRZhP1V1V9bwknp0XnFNcY7DPvR5/ec73AAuzWN41XvIHFZ5ZJPvb1fX1593v309vlxu3+WKGvYfxzkZpewrzkkYqX3+9+8b+sWm4qaIo6rsit+BDmsUI70AyPM4rH9cAAd+cvnhnLd9JyztN2Dq9+i09+cTFJh7ANMM+3niZHcw5l8DzVQqlUqlUp9XAqxUKpVKpT6heBDFuPy3fbefmQn0eNxQjpD9RaUspwuKxE84Q+YQwOkcyU/XldxZUf5eNCUNgMPfL7BRPbZ0hItLkUR38fgD/F5jSlohJDJ1Hf26PB2fFdfhZiz9+b9iAl8fdvliptZuLucMwd8CcZNrWW7gkKAI13hebrawdXkkbKiQ3T+k63WdTqLq0yG7T0Y8lltq2PfvPxFiAfbI0MROqu2xe58ZuqeGpihOOfCqnztApWkfEM4hXrb7PY+eq/InlJJ/NobHKXsEmU6YYs/YnxjRi/vtMc6vldsT5haHSQEv+ZmAj9OueB+gUvMesW3zaYF2noR3fy/O6efnCJSdVbgu7LmjW29DQwEKYVkV8OoqcYdrsWyN33ef+nny/LY55HKUWxKvr8324vFPTlB0YL2XVrftNnQglUqlUqnUH1MCrFQqlUqlPqFVFI4/yyEV3gqyFICM10T9kn42FTMDXNrdHdSq7Y+drpuY+sduprBoVQckRSXgACI+ubDr5+YQ4TzpPBoWzh6VgZ/eicSHecUF7RavQ7RsszjBojL5+l8yga8T4kWZ+q2jq0xN4JNzRqazO4/hWra2opsmsEUHzb5xIlxp/k4AiyEYNuXqgp0IkMFYQn6yT6xqrc9br1Y3uY+mO6oIf7hGcznfcOwp6FcUN7Mo0sdr2S91Rff+rFLy3+twA9MiXJpl7YEicuix1j/3foML+Rr+sXL7WDve03kywmc3aImIXxEQZpG9pjYS6vbTf6dzxPdklohzelQyIK5MWm6O2/zcsIeez6eAsrHj6sRewjrUk9/z6L8yr5rz+yn3nPdqCRqzU8tBNMve0b+V5qtUKpVKpf4UJcBKpVKpVOoTaj47j+6dWqZ9f3uzVx/243A3Dft1zGmWR9m8C8s7sw4Cka16ATScNw1TBSO3RMcReozMtr05wEBM8LHzgXjIpdXloPII4qQrZggi9OdhBYBs3z3GFiXlcKXQDUSOIzgmkIQi+N8BTb46gc9ukMITgfci9J3w4DyvmF64qzanTAtc4Uj4GaYSwqH1oOssFtEjX6tfqjpxCNAHlxriXU0R0AWt2GPk0b+YUjjiHjaBle6ABDEyzp2MXm5+RDMNF+R7feJjRE3/fMfTP3W4MYrnkxV5/sXPn+fay59+v8Px99lye3LbLgjUGp1LjFTWsaZJRtl+/PM/mtqI71gVmGOcs/k9ZfebOZBjrFbnU3WdcDoO7hH/3KG5Bz7Fc177cfpE0O1t5xq94MgqRRHi08Efv2TNI6bSofVJpVKpVCr1x5UAK5VKpVKpT8hbmgYf/AOQ8IGVIKHzgRbOKE4k01Q4OH0eW7PXOO1Fl5RHzI7XyQfvcNHAjUXAUx2cEEDNyW6dMa4HYAcTFyTpqpTmg7953C2m5aELCrE3dHCZ+qaiGyriVIA5HyJbf/IEvl9DioBZRV1f7lDzTiK1y9tUP5a/cNpUr9QVgXPwEnDp7AIe52RHFtxtvk5juW+qAAa6t7Ya5zbtXrAdcGTKaeXtYEYQEldNx5FiotuyNZ12CHz99O07jwmoQxa0Ve+m+i90uFWtX0w59N93L5Nv1/3DcRyuXf/sicPCmKuZO9H+0f023V8tchz5d5XbYxokWI8fCkDu0G/cOTUE/uJO/J6pjdauf57lOqflNNTERkJRDQCIYZFzRJzWS/1rvaJ/0af1tm1aq9PdVtyb7nxb+6fJ6mVTrq8cQphKpVKp1FeVACuVSqVSqU+oxQNtgA9FiCqJzWZve7V5+lQ9RpfoFtro2sAj+NtjswPdO3JlDbiyjrmgAqBUw7TAclqbG+ECHrDhTIkH+gVAZjCWssJ2/mCP31W6SPgIzVP2aXsAYZzEFlah6S4duon+kybw/T1IQdDGyicHOIBjXE91ERldag6sZsS1ih+L6+Q93ut+0F0DGFjMzvLRPdOaxvLV6ECaDrj4msOH1VnV6/2c6SyKy90E9ASjAuQ5zvQC/+Uas2nv58tdQ02gjMc6rVd35RAiRoTzP8nhxomXQ84xATo6jxA7vQ0E4LAAAD9NusReGZpg2bZiZVzXBVDlUAtArxHYoIOKrqU/Um6vsnZ+PoAvgDDTj9N0S9bwgU9PbVxOqMk4IsAbu6peh+5vWZNEo9cKUdR+Ch7PAKdXRxx/Xr3ofzxfBLn7482Ph8igTIB0RcaEwumF7i07sFKpVCqV+rISYKVSqVQq9QlFrGwKqHjBtz+kmzqw4K7q6qPCwzmdQ4q1wW31eh32er74wD4FWcpAL9aD8GvI5cQCczxEd3/Ix/sZXzyPFaWr5g/+4WIqchqZ+oL4utMf+kd30EGIZWVBBAKVmE73T6CJ/UmQ4hx9OXiaHF0lurEAFAAk9t3O4+BnETZNdwdtmjAYsb8SUTCsESFXISD8oIiUyVXl73X3ToActhfVsQAI3UwEadUOOOv6YXO2FQckTOFnXP1YhCTvL3tDxCxim4Rg24q1hbOsRSl4+fMdbh4bHXLx2VqPegN+/ody8c+40RZ9UdgLY5G8KC2PHim65o5j/SzO5/eW21tAodEcxOn4eB26zFiE/oWpjXS8EXhNudE6X3cgpojvQPPoLdbM3XoabhATDeU+CyC1yQmGOOAJ9xWvTWD4lhCcgsKVhfyGBTpnTQdWKpVKpVJfVQKsVCqVSqU+oZi2xgfwG4CCS+f544fVujNOhBLoIavL27dvVs/DnoJWABXn8eJrPQJXCTPe9jeb+7Dj9fK+IjyMV++5coxRfQJbHXaeXS6my+20SuRrsW3b1al1YgSfXEjiEziH6dCpRkTsk9Dkq5DCpzQWi9OfxVZptxdgowhdzq7i/V+ATo+92mlDhdm2oB0gBXq01rlqMt8sc00CdAhYuXaAGXO51iYZzb43c++WX9Nsfn/f358fepCaXFXHPD64zbDGgEc4DqHi9Hje3hy4Fbn24j0vTD3U39umqZPzjzrcPBbX731NvHeDxfWYhNnUJ1ViPbGvVgdUAK1rqiPdZYzrySW2zkm0drh7bhXqm58fIqddEcs413u5/WC5vXeYEZ7u7vTyeKuDzMppfvPLUxsZRYUL6hwep+VbTvq24prc6TcMzHmch3+HAGJrWe4rk8vOXYJmjy322mnzV6zU4edE+fustRxzzn6PqaZSqVQqlfpjSoCVSqVSqdRn5CBozjnPPmfnwzKcUXC+zKtA+9kP+7Z7eTQAxOPxIAg56LKZt44ld+IMlUC3uq3i6qpuJJ/aB39IJzDqKhMnYFCflXtRPMrFON30vivvNLr3+HiMrnN6X1X/UrhO7PdBE7hbRuP5/BFIMXXpAE6ASacKyWPCo3ccOehjNEydQyxHF5zyKKEKt3ndAg5Tkwkjg2Y+7ZDkYg55paIE36NyOOdN0wlNrja43IqcbOv6OEVy+LXh/kwHTlOuNwISvLcf3rHUvG8pnEPoyBr9oh0AnLh/WwAvs1/dq7qAnzvO/o7DTd1pUz6wuMkrFlh92iCcRgR4jMkd6zMCXkUhPPcd1hTrT7C2LbjFfag4Z1dXFtYQEzXxmuP5ImrCvRl0PMWeqhr9N+ycnv2sm59w07RH757Cejd+H/6sqY0WMzo13bObor4ojIdTS8DL/25rrVstcucNn+qJNYLrqu08Z0Qn+5DDzTQZUVFQvLfoe1hbg12yZwdWKpVKpVJfVwKsVCqVSqU+oS7oMQVbzqkSJ3p3vEcI7qlv377xoHD6/PLLL7Y/Bl1JLH1vuz32Bx+Y62zsn6KbqvtUveiF8mihTzJ8zZNRwE3QYhNYGfNyGDmksWvk//CYY1W8rxGI+Pt5Hu5dctfPHBpl9/tigTyH5v8ZQZfX74QU/LOcQoifBbjBIXdNG2Sptv5shA9d5eTeidVsk9vGz5VRN5v2st/GAn3wnq8xomNsEZtDk+38HvZzEEhEoXz0jMXv7+wB9zMwSqwJnUeKsvkJk+YR0NHpBLChji9cx44JlKYi8ZgYOBVfK1MApToM0T2xKvimmOfcbDmuCNPMVmdZEwQkmCpXZxcBj6KnnOio43EvlbImaNYP5+Wl+qfK/73wv6p7TE4ogdbpZXByHlY6nRyAVd7rqf81AbDCaYAe3uT95QADdU/9SVMb983db9vjQSA8Xt370dZUQf2l+GSp3oX12GJvjxVV3fF90n8542eIhwKqDQHBonvw9vYN7iu/lFJeuMxtqx9tc6lUKpVKpT6tBFipVCqVSn1CiGIBkJRa+NSKSYLzOP2BfH/Ycb4WyECMD8/GiFQ9X68Fj1iSrsgSYYqigQQMUVoOOKYeLY/WzQVSvGy7OoxQjNHUbwQnEYrgCS/Qv6VieAcAmrCmn/O4AlWEIuYZw8/EAgkQRvF+oVliHuJvIMWmyXjH4QBwF9TisDauU0x/MxbQL6ggubtrOqCQYw3EAOCJ0a6/GwucjHNa9EvNSEo6CdnxuYgC3kvZz9u0Rx2jLFeUInJykNHpVqfVUb3frPs8SDpwcP3HsSJ9dAsBuMxCqMP7Yv5ZB3uw5KQLeKT70WNiHhxVdJsZYdC27wsu2eoAq7foYBHAGwvOTMGrIjg2EGEEc7TtAjqAWAKFVZBq3JxPH29LcffbKZedzhtA0zvMvOC8K2KLyx3FI3aj39ZZx+/FvwutlX8YC/zU1EYWuXdew3l0JR+nu9Biz0XJenNXo2k6JfvWABuLrQhuXPcZcVd1qjEWfB4c0PCXv/zFys59GSfXW2sJsFKpVCqV+qISYKVSqVQq9Um1Me2/tTf793qecDE99VSPKJiNxvhZU+8RHsABUWYd9nz6BLhxiys1FpI3ul4iZtRvXVBTD9Ke1hMwUPyNzpJa18M0kQr6r2yjY8aKu4Msit3NYRo+EyXzcEoFvAoVlXl/JhZI2OHeJu8rUgl6QApAr33fZXYZiop9nMoWYIyRMZZqj9s54bUngV10H8XnOdjwYu9fxwJx7nTdMN7VLd5JhVNNkBAxw6qie8JDvJ4QpNl+i/I5OBrqNZ9XrG1cEyD9+Jczyu+b34NyAyEPRCjHsG+ClxGVNLmgeri3IkIZLqFwuhGNOKzkerqB68O99K3pxK0L8uzq79+0R8N9Zdcsy7gp/jO8TtFHAta4mlJia/p+rx6/xOf49TS/d93L0+fW+B+eWPIqB1jsSwt3GYFW+YexwE9NbVQpPqd99qEOsOqgruscFbPkVMJxKhNaZTYc3sml6Zc4rZ0wzvden+6EOxUJLZr4WfUdKKW+Oo2SGSFMpVKpVOqrSoCVSqVSqdQnNBZcqqtnyGKinNxFTbGnq//InUh4SO5uu1K8yx1CQE5DrimPPW3uMMHEwdIVAfPfwYE0SsT9BKVMETCWtvfVY9XZ9XT1WMUjNADbvU8oIos4dtEEvzsQ+H3dRZj4Nq5YlkWZuL/eo34eVxyeu1sQK3qYAuARHNQoDndXlLuH3A0057Gm6DHepY6wON+IBbKMvpQVJwxFhBBOIb+fADhd7iSf/kig2Jqu4Speh3MnznOOuqY/EpKZrYhkgKvIXJZbuXp0S/XbVEBG8tSp5Od2RRWLnFfxfuw7rsytT6so7snONOwTDB8sFwiMtS92Qa1Npfdd67xuxnAg26MTS31UWCOCKTmzws1V1YvlN8/3Gd1ovkG4JkNuNbwfn1seDzrUJjvRyoqBAhv9s1ggIKz9zqmNBMZyh/l7sF80fTEK7PFdQWxxnGvK4eswgtSt2vqe87uquCXAFx2SuNcAc+xG2zm84XW87Kdv37En5pzjtWHqQiqVSqVSqS8rAVYqlUqlUp8QYBHG8x+9n0MP03zYnl6mzYgS/i5X08aJhYj8Cc60KybW5QpSdZV98GiUYvvbbv35znLstjd7PN4Y6XPoUdcD/f19U66d6EAiMJTIjAAAIABJREFUuNLB2cEEsCBXCyBKlUunqjeJD+Ssg1cXV7EPscAx/n53EcGXt6zLiQUv1VB0rgiK2OoNgqtlK9eUN8T5hiJuIwDILR6H9XQX1TQDKFSH1zVBUUXj287lPQT9bBXR6/qMdMyjlyzBr4SHgCEaLOeus34StABeHGdX1LMsKOKg4yDkmr8Cm9EhFY4qRNd8imNZsTVcH8v75dKL6GKUpHONu8POk0CqrU6q6GQCYAk4ExMpB6Opc0G0iAXGeZZwWy1gOJcrrmrq5RS4wvlHfM/vimPDqELzqZSFIC5Ap+l3PrHPvwfYoXjd6x7P1H3FNEw40XB9Xvze1/rgz/HzFSO8xUp9L/7jqY13N2E4GtmvhT2rqCJfF0lP8bu+4GDzyYjFBLHq+h7X4Z5EEzxFfJf3oE9GD7EHj+dpBUB7fnQcplKpVCqV+rzy/5qmUqlUKvUJbdWnywUIqnJihdATFQ+/BBPqUGqKoXma6yoGZ5zw9vEsRhcoglMH2t8e3i10nqsbCA6Qey/PvWg8Cto5Fa9695LpYf+KLt6m/omrxDTCdTy5gyKWxkmJKq8ucup4jGrIiWXW9s3Lzas7mIikNO3w0PUDxvG8TL1MuFZd2+pqUsRrRfJwPQJhAf6KeqUi3ucd6Oieiuji5Xqy6ygL1LF4XWXtBIvh6ppjTR98ocfKo2CrW8qdSw6YyrzK2Kfu24eJjRKBE9YTayP3T1yDydXEKJuAU/SgOdTxv2yMBaUCiBUd16NxjfunycE06CgKEDP1s8lOqs79dbLYXkFHUU7jREf8j448nQfcZkSb6A0b5JSKas7rvYzdlatP6wZl2eXF87xirXy99jXvdR+CkRFT9Mjr47HbtlU6E3VjeVzEZwFC29r83kUFQBoDCOr0vV71WbjP/D7G/r99gSJK64MWMMmxcJ92TVSM7yv2Hxx+VhzMxSRNxE6rhi+gF2zjYIbxeqtt5BTCVCqVSqW+rnRgpVKpVCr1Sc1bHAzwhM4M9VlhRL8XSnf1BJntj83jXbfOJY+CeSE8O3rkehmEPI3sCK4cPCwvwBSfi7hamcv1E1FCdwkJ7Fw/pu5l3nVNuPOpbz5ZcXrH1fCOK0bMWmOUrWviW3QHNYEjurysLAcW+49653Xhn48ASTHBTrGw5WxChOzmqvFhiGOBkan3eJG6rRJ2rHONCYFD3UNlEE4gFhjxSzirUJrONV6TAtW1pU4jrG8zBxaRfsSUQN7b6GCay6BDYBIxwipwGdAKzpvJz/SYn93jewImEy6kVdTuUC4cTE3uKnzWo3lZvanHKdxCvC/LGdXXRMwpkFYEedzNFhHNKZdQIYBl1xMnXjo4G9ofcEOFa+zohxfJ96sbC3CGEK1N7lFTvLFqo414nRxYWjGW2vfhgwHaVDTQhj1aFSQdvFcWwwRmlLlfJev7/iDgqtUdc/5da7ZOTkXypp4xdGzNflovdcHCiZWeZcVP2RlGMKk/06Hlv92rO+MArmY/rL2JrS2QFY464+e8XgeBMoY8jBN9d+/27aef5ttj5yW28luomUqlUqlU6nNKgJVKpVKp1KfUvejZ3PIzDi/7HjeYBfhyPA97PKa17eEPwXRrNX/4RwfV1Ch/PGQPj40xkkigMDTRzt1a4f4IJoCpgnZ63MqnxbXL0aWpbNEJVWtZBdSF8apxRel0fAAowiuVWWNGHuEUXtcFRlQE7tBg3rqU3IGF94Tz6QQoUMk5O6sC/zCC5b1ML13fcs+ok+l8vfzPpv4puY/YrISpg9WBTriSCLTknHEXmDveAF4AC3HeiKi9jrGcWljnWrxvakwHXWY7vUMVsUrykNPXAoX3MV1Q57rcTzq/rr4wH3j4EVR0wa2IFcYkQB9P6VHQAF2eU0NoTc6wWuyhPjUCPfNIXpOTityG0/h0TTFhUHG7FSNUbDB6873Ta2gS5lhrF7FTwjiC1k5Ydu07/wzeg4BCuv6NkdD2mymOrHif28dr1LTJ6OKq1Xurhu4PbipBI/bredjWMC1yLmDKqZfT7x/u/cF75XsJoA/vP7F8AflGYLW4Pnxf67KHTbn+gKFj6uGCqtNjt3Nsbjvb3L0VXWDsKpsBKt3lhfjtqb2H6Z1jjFFrhh5SqVQqlfqqEmClUqlUKvUJweHCWNK8StrDSRMRuHDnxO/Yd7Rvto8Hu5UYWcPD73HY63nw4ZqRJsCd6EgStGFfj2BESEMP+ftTfUmmLqWI9aFfnO+bRRBioyOq3V1ZcJGsNFddEaq6XaBmTbG727mGuq8IsxyAMdZXo5NqLHcLS9GPU9PhygIY4R7rerDfFJ3DucbDf4Av7+gudLjA3RVxwzu8slWaXlacMeJcr6OrZKxyMqJPUNzoClpT/Gws4BdmGXxWL4qKRun3zX3Xb/HGpo6t+x74EKXTPaTL7jztxHp4aZhDLbm2arimdE+LCtPt6B4XFEgyFfMjLmjhyOPCnoKNN2AimAlfE+4F4VHEIulGK3aMgz1ky2S04nUOfGIypm3t6tWqdcVluauLw7lT3V3ce82BLpvR+tSe8WmFk1Mwq7rFomzdoZAXv6s4v5xWUUhf3D0Yn0nQWwS6NLygdN8n+x5A1eFVuBN9OqADxakhAHQ0yq/ma+L3A848az5J0QcDnDx/xoYBW4+D4HDIoRhVbIw1RpQWbsIO9JgOrFQqlUqlvqoEWKlUKpVKfUIAVzsKqeVaaezDir6pZq/jyQfhdoMdDl82ex5/s7/9+MX7qTA57zXp5mpl50MwH+3l1nLvioOiISdTOKFKFFKr68r0Pn8ILytmRwBFYDZtR29TROtsLlfN3W3CLiL0+NgFrDwlVQSk7DZl0Nbv6dQaAZCmzsXTYSvyFnE5uXjwcN/VIVXuExTDPaQupH7rmDJNUBxrgmJZRew4BzpjFNWM2B77tebB35EndL82Z2wnC9rf3tzlpLO+3l/8mHNrq5drRQF5XjfYpAJxM59eR4iI/qw4/xvQbFu73EC3SYJxTd6bNglK0anm4KutaYoBLGNqH11H5tFPALorHjlXLHDK7Uc4My64te0ex2ScU3trqGMqYNP4sE9uIHVEVxjum0+8jN6sLjCI5W4X05TcwaQ7bOc8uTeqpgKG66uo72x1U1lEbcNF5WAS3zus8dG7oC8+dPy28N0cMhIU7psdrxcnIRqnDboji8MIjkEHHuDwzjL7nffsDphxjpyOOW8F8zOir3Ba7rbtbzR/nYRz+W/ZVCqVSqW+qgRYqVQqlUp9Qnioftt2+yG4UTgQr9pBBxL6kxonEh7Pdzoxyjd/+H69v7tzC9XOZS53ydYeHi8rTaDGC6yLep44sY9dVU4A4n04j7KIieJOKMIuHhW8YneX42nE9DVN77sg1kfnCaBOVRE4X10Vc5umXqi+3ue9P/U3U+Jq4JZVcs8xjQt/LLS3puHJRaMOLFwTgZ06wgHy+qvzswFtEM2KTq8ATSYnz5J6rPzEp0VCLaAf1uSxb6vPqdWYqjeWa6crLjitrCgge6LGsANR0hLutXssU7G09QN3YzUVmTPz5yewnE0Bjghjtqq+sME1gYvJZhSwu0vNIhpoDrrgfirTHXOnerZ+DdyGYFmJEnXe76aJjbJeCQ7Zmjborqd6n7R4g4O+Xt73RUi0616wrN7Uf/VreqOiew004I7XdMBm7oyCVXAKyMYCxRRBh7gCtBZgyudexn6N7q6pfjQAZHfbVcKrWPO27x/OjK4t3ufGLqtep7093rzXLdyWgq/shzt8Xznsq1Zn436f83Kb8Rta04GVSqVSqdRXlQArlUqlUqlP6IkCb0KBuVJaiBLhgZalz5y0Nq1smrSn3pzHt2/2A1Crevl6VZbv9Xra4/HNHo/tig9axPS6P76jxHrb+YsRD/+rF6uu6XuVrqtO+KXUnW2YGscen7EihoRDcAQhUtZPHedaA5Zg4xgzXF1XbA4AZ2hyHHukyi3Sp4L4IrhCd5XcaMZi8KFpbw6ergf8spDWFDSji4gv66vvKZBQ2erqQ5L3aXUSWUQJlxvMlmtosJB+LEfXchQJxAGKOSCZ6rOijUngxteiEIycq9sL5xlF6KYepoBXTX/5hw+bACsRpcS9J2CyFRskzKplubnG8FgcIpU8zSGYBCh04yFwTwWkIowrEQscnNx3dY/fY6iT+wQ9YXN0Ob/w+c1hj40Po6qjXB4l9KU5bO3qmAoAeO+P2gWG3Pnk2JV9aeG8Elyry+HnkyxZug4o2Odyfo3TnY5xjeyaixJ57k7vx9pbfGZfc7YBl8KxCMRF59Zx+rFvO28V8stR5TMqhZMBGs/Tp08Ws+fryW403vdx0vV2Dgdlb2/fPKp5vuz9/efy/fHfWXX29yZTplKpVCqV+pwSYKVSqVQq9QnVeJCuHgPE0ynrrhHBqo1j/+m+GF6sfipK5c6NjUDpx49f+IAMKPV4nP6A3Lu9PR6ccAcI5mBhfCjLvvqRbDmP8CDN6Ji5uweF2PUWpaOGAxSAqclDxNS/qS7xjw4iC6CF/2fMFU/kKxRbhAuoFU08XIDJPkzFu/q8zuXauaiB4nCRgFxATg6ce+VWd9BDR1DbfOphKYIXfdm5AEcwCTBiYoQuty4pnOdj272UfThwJJgapz0e3wlFunlkD+4bwgvBKDrUJjvt2SO1CfR4HBCxUgcvpyJu8CXF5EVcm09H9FV/9S6w1yz8V/12r/vRGb1bjrbiEBA9VW2//tNtdaNxzWqgT9s3j/H9o1igr83wfYQpjYB750HwBYcZ3UeIyOp+D3W5qZbdJbjorDFKzzU9UjBrrPL4unqw6uVMEtryPrP7NErviTP2R3HqZLng2HkOkUG3Gy7gdHcCGkvgPFaK7xKmKkafl66AEFfAFQ4rDgzgAIXBwxOU8po0aOE8OVG0at/i3sNd9mI/mYNQrKsDwKnpnvYA1+29X1+RVCqVSqVSf0gJsFKpVCqV+qSGCrCVgvLibzl+EMfqmo7XFV/CnzFWf8jtRMB0eKRvf+wEIvjdcbpriUAJwIZT1fxhHy6vs9ymoylSVQQY5qx8cCZz4vn5NXEan3q0EDvkVL3pU9JMEGTl/SKyFfatiNtF19bN9bXvEcOb6o6yBQjcWeOl8B9g0dSayH01560kXucybhAk4odn+K9Yon35gnjIUdY5xaA3QBdG4boK9QUpnEENRdhMZeAOj3r/mfBRB1v+nCj4dk/b4BpURRqD5LAfKfaAYKTDRS8w52TBsqkIvBMEwYHXR8QUp7VdYOmUW+lG8ViuXtxptTCVetICvoSTznivG11GfoM+xgJ1gauDzEr8zqc3AsjA8RTOJVNfWvRTRRF6/4+6uwSkXubgqt66uzjssXgpunfHRczPzwPn5DFSh0eAxJhsONdgBIdRdKCxEB77GzDZP7NHz1XZBEiryuov59a8TVxcZx7fKcC7WW1ij/Wh4QyVx2OHmqKbPl3wYb/88gvP47E396tpCibOj9AVP53O2spIdpVKpVKp1FeVACuVSqVSqU8IfT8nwAx6rug+qYxp/fTTTxz5/+PHk5MGo1fo8fZmb28Pe75ecqP4wzKdGgALAC9wdQ0vqI54G6BInXU5lwAWmlwsMVmNx1EnVGTVcAyf4ne/JoGp6R1KEU8j+GIMaqyJg1OwgpMFMbEPkTsTGCvutCpyBPkUt2M5zFaMMCYyChaFM8VLy90J5sXvdYGVu3vGbvEuwJl9KyxvrzdbFqcA9uhkqlpXOK9M63KbhKipfDwGOdxUVC8mKA7GBwklR9dEO1sTG32lx4JHEcmE9ahEPZiTHbp1AC+8B8nWe8p0uOIUZ9IpZirpb1pv9o8FiKryNKn3bBxj3d9F6hS5xJ4BeDnVl/YfxQI/huZsdWmxM0sAjkAS60Rgczml8JmPiNmNc50CnEkEhTAjyp2I/Yf9Ne+uLH5X/PPw3VgDASyqy8rtfvp5b3XjPcNrO3rjpkNjXKeX/VdCr4Bx/E6VttaVkx0BF8c1fGBN8LzFTXFuz/7U3q5ywgF87txPMXXQJxj6xuB3RtMHh4Y5lIdHX3HvV6+YtG1bEqxUKpVKpb6oBFipVCqVSn1CcGkAwGC6G7qMphwigAEHIZVP8gOoYZwQEaOXx5foOkIvUdvtKOfNBeRl5/GEy3H97K6S04qOpW0VU9uts0pJvCse9RtnTLxOMa1bpHHhDMUN5w169dkXeGBMr7nDhP/DFMbRBQJiMptKzq2u6ypyobkDqiyAxfhhxRp29atfBfBVMUHvHfLfo09pylV2d2x9mKDYHRytUniRtqICd9wXf5OpOcm4xuRO6JC6rZORUVSt8VjXNq4D8DqrIBMcVcfwjrGhaYVnRBfFi9iRJtdZ0ZRAh03eUzVXIf3VRe89VcWn3cnBA8izEfD4+W4B4giH+opN/joWiDX3KZPhehruZmP+r3JCYaDDIQdY9IrF5EiPgEY0FX1eUyXt6u4KB51p73RfO+8dq3rtVSbPCN9tGqbH79oqxg+gy2P2abN2RmSLwFxVGNBvk1x1mtpoAn2EklxrB2qs44/BBnKg8c+Avnx9177xNRqCrBGHjPd6h5z66d4e7lgDSMTK4N8HuB+zrh6xt5b/yZ1KpVKp1FeV/9c0lUqlUqlPqB9POwwP0rbVR+OD7y+vH4QFcIsANJyvU+6M7YPrCIQIEGN/mG0oflcciq4XdRTRszTnmvBW1AHFB/N+d9+4e4hVP4q6MSqoSXbLgYWXHx6D84fs8G+pWhugKKDMvKYZLskNw5al2uRYGSsWGPAppq5N9XXhHfUGi+q2q9PoXP1WdwA1NH0w4nHl1onkfV4xsfDj+7xIHZEtWxMUt3Y5suIcw90z5IDzqYDXFMApeNQ/lG0XFeO7swlXx7JugI6trOs96fwpTJDFhMeuyFpAucts5PcvoFU/jwUTuybseUyyXB1eUxP4urlDqzhP/OB6Q08Uoc9U+f3lbMNxjfBq8h6cmqBnBRMwp157xSa3KodR93NtEbwch3rLtgWxfG9UAi86qwR+wsXksUlA2219RomIalEPm+BTqJnyoVH0rv0x2cnlRfkfpxxezi1jSX5lFxkL7EtcVdV0T3VzqWPO45+V3WIfXYRT3W2I3N7r7P27BFiNtX18e+PkQrgTvQ2+cFhBZQ8ZzF/zgZ8GOEylUqlUKvXHlQArlUqlUqlPqDIidao0uqnjB/1Er+UimYoWGh/m/QH7DQ/T+2YvdF9xOmBApunwRZPK4CSqUcCtknB2avWhmFc4lhDpQ7yvCV51j6zV+sGdFRAkzjMmC/IhXrGq6G+6updM0weLAJupC0oOGfOH9XCwrFigAID3/0The3iYhh2KwS1aoYL0abbgy32SIFxD+NmYAcuG4oLNQUz0eN3ykiwdl2tob+HAuabSmWBVgI8oyp+amLixWEk5M60z43Rtc1jTPQJYpkfHwm3Xt2q73aYg4n5h4TbvfOKKjqjXmro3xzof/7yAHF6Ez2jc6NdrzAv3/c9NXVTTpzT+ag3I6wJyjU6o4jDI/9Ov6vNmv6b08T7PX8GkGn1VJ6FXVURvaGpglMIzhijHoC1It/Of0fFmNVxzY4HFtUfPuerc/UObbXMuMLX2hBq2cB27es0IbOWN8++VO7QQ513uKvNifWyDiIeikwqQiedIOOiF9AH+cJyIw1ZFdXlsAbUAXQBzQyCa+xL/c2uiHHeFMPfZR5a4p1KpVCr1RdVcwFQqlUqlfr8Afbbu4KIWW/EilgChD+sGiopmrxWCLY82wQkERwq6ehAl3Mrmpe3Gp+TbLLlJwPF6/8G/u1tqLni1QAMjVl4uXgJsKW4WMS6Ank3uKRPgGXbBq3u3FKenTYdXRQAoJhLStTXGAkCNNjS/Xj7cl+qummoWppVwNg0CAgdQOL8up5hpTSsnOG5eRF/LAjbEbSOigXW5txy2GB0yv52gqAhZiQmO7jjDuW7sm3K31FTsz8whC0DPrl4oRienreulV0hw44rz9XWeVTHDuWBTrK2tCYp97ZXC/RCRxy4oxqmGza8nStxRHB7uoKJpkfXmTHMPkzvi4AAE7CP8a4rByZElu5O7sQiw6jr3+NxaL8eaxRBKXr87+zwK6RHZAEGxfmudAtEoGtpVJr/25K+cSABiKLD3KZFj9bFxauMUIBzhJtP7S1mDE2ZEBTmB0+OrWAezy4W2XIKDF8C/OEW0eFF87ME4b6yRw9GyStmL+tQC2B2IZ46+IrtYQ8DPqqmkG78b3qkGB9tmH/doKpVKpVKpzysdWKlUKpVKfUKoYi7tco8QeqCfqp6EPy+ACE2lo3Njerk1HrIBSQCvzDxidp4vdkk5ZCjeGt7vhdMOk/AgHG6SeM4Op9UCWd5Ozn920KS3AELdLTWaSkdQpGFtgATFbVAsG5+KJRKKqQ+q2wUeCGuKEcDhIo/uRdtVwGTzEiP/OEQUpzuWotcIEKSU3SOJdVqTk6cI8BXFywAIltsMsKlVd5uN6Pmail3O5f6pmg5pEWUr9eMEPk0ljAWKyCCPjQginG/zgjeMeT48hhcgLQrP4Uxy0DEvuLagULsiabg+dXOFc2vavK2HO9tQJH8eFxSjI604mMF6HoBsmFy5X84slIZjpw1nWQRC3psW/AWF8jun+hEK4V4THPrnssi9FndJmS1XoUMrh6jT5FC7FeLjA/d9uw0LuAxGESHkZERBOo+c+iTBe5c84BtL/4vDupga+QG8rcmHY7kW4ZjifaibTR3QY3ruVuQUUJXah7vQbiXt7ixEJlNsb2U81WMlOOZDDoyTDnn/1fMVBftd/Wnr/4/wdLp6ovvuPO2hf1ec9ve76VKpVCqVSv1+JcBKpVKpVOoTGnIsbYwz4aG2MAL1eLzZcb5snGENqizyrsUjWIBaiBn2mysEMIuQ6/bxdKKc53LyfLBK16LJelf/ERwu03NujHVxml3xQvet7nzbMQ9Gqgh4TNP6GJEafD9jec27m1BsPmysOFU4bGp3aAXXUKveeYTXzSNKzn8FAuya9lbHWBFJs6v4nW4hOr3c1UJ3GuHWza0y7YIW08EMyt/r6rfCNQytlTqX5EKiO6dVdVVFhbeDkZiwV+TG8fcNEkeeczjp5OqxFX1r6hpzd1BEJbEaAEVr2qLcbVMQCq+ZcvpEB9S1HuqpOgKGyanXu+KQngesKiU39qL5OrEIX/E6k0sJ4PHsc8XteG77g9DmICAbK3ZIiEXHVlNHVtHvqu273GE3/rmpu8tdTlcs0LmWdusQgDLvCzOBQHweCvkdEoYjy+O2HtOMKYd34GjsaGuKd+J4iOydnKLZLmecICjXip/ZuZe8PL4uqDWqg8dw6cW+sJubbN56xBjr1fRKTCLsAsS1xHfI3YXct6OxFJ9HPSK6W+W4S4CVSqVSqdRXlQArlUqlUqlP6Pv+sL8iQmXzjOgbHojRt/Tz335mhAiT0uC+gPNqfzzoVHFqUQmxCEEUkZqakDcFR8q4XDxF0cKpIncCmuW80lQ0wQXE48aCD3Z5QmoAEvUAlatI+zwHS8EfjwcBnAOTQlfKnCchXMAYUz/WvaMKkCUms/HvAAN3WBTv07S5sSYg1itupkLyAEJ/TxFpnHp/uwGuK+Lniol3QxMZsV4AD+cdmkx3oW3N+8PwuTF5b0Zn15DTJuDZMHWFVb9H5i6byUhiE+g4PziVYg3aw3uwTvZQXbMMpyCSg67OWBpL/jd3CM3p92qc6r9qG2GPAy0vpo/JkREDDfgToMXPv1kTDIPhCl1kAaoOrmklWEJJu0cMtabDY52EVVOF6+ysOtZntVY/QktuuMFFLOh/CkeaYqGEV+GcC1AVEyi1twICir25S65eHWHstFKcccVFFSNsw3hfTM5Bd2TZ+j61W+H7FPgbGqBQ7HLH+W+ufXaPIY4q96UAFaZEwm3GCCG+I8UhVtNIya7vaiqVSqVSqa8pO7BSqVQqlfqEJuDChAnFXU7AHG/7w95fT3seTx7I3VUXjNm23Y7nQVCCP+NBHL93F5K/Zp7uhhqCLlUTCFeZuPFDCcMaHUyXo4mRsVrUQ2V6+C9yUg3vOGL5tE8eZM/Q6RBkU/H0VNcRAAMcTMNuk/4UL4yfrbL2W4eUAznFyqL7SnEq78xSofo9AikgBLgGN9YQZIvP4OS46bBiqnz+yp9FPHGscKPDrRtQURQN8CpygexXQlyOJeGCEoz2+d89XuidZXHugIfs8GJBf/e1fuwEY5smPq7JercCc3RX3UvN7daXtrrFBCeLwCKOz+hg27Q20as11AXlXWhx3+kwuk1nXD1bq4sLExqnnbi3gGSYJFhUzLXWawgsRerQ9+8UyCrjKpo/2YGlrjbFVz0KWtakP9/zzXu15IozueUCePJ3TXFF7TFEJAFV3YlVfcqhqedsFgeu+I7MsbrcooONEwdrFNd7VNDoXrPVhRb7yub8AKsQA3SA6uX03M/ma8auNtxLuK30fcT5MHap6/HvwhTV8vghhwHUNlsprzLneDweWeCeSqVSqdQXlQ6sVCqVSqU+oReiUB5BQmkQvTHHHPY6Dj54A0ZEnK3OZgVxp/eX/Xj/4S6M4ZMKPYbm0MYBiYrBBVG886cv8AIAtGvC2lRsqkVJOR62WU59wR0HMbamE07F+Yoe5AP7FDl6ANiib8oLvau6hjwKx3gWTqcPTTEMtiZgUT3OxZ4m/a6zWPy0x/5wt5CcNtPtTIyAeUn7XG6WcL1MwZw4H7uVoy83TLxHa8aCeNhtwtlUqmDdXFPiyFLaBZRYeC6wFVMRxTh8fT64vXBchxQAPpyGt+/uWpNzyIvdTWCkr26mu1MpMNeAa272y5G2Jkc6JJrLFeTHLfuDzjCPoxVWprFrrWxromFAyrr2ia5dlVKAL+hzIoQKsMR9eHhJ+dZUD+Zx1aHONF72LRYINxycR3jZY985XfNemt7ZvbVp0qH2GoBTc8diTCIcck97HfvTAAAgAElEQVThWHQZVh/g6PFYn/JnmnL4a1+Uw9KPEwctzl3r12K/WdxP7yobWhce5/GmuOC4PFfRQxaF/NhjmigJmGWYuoj7co7lMnu9XoZauM0c3jV34L32bRvYJ6lUKpVKpb6mBFipVCqVSn1CATQAXwANEBeccoRsdbM+/GH6NC/7nuq/+ctPf7H35ztdPK/jmvLGB/nmD/IoQ4dnxacD1qt4WmXdEJwxdEjhYR8ROE2lI29A71GJeNNYz/TeZdU8WmfDHVwAIWrfuqKMXqDuffLNo1hy4Chk9wFeBSxpAiFG8NDdEVa8rBvX06dDlyaXEYvtwUVacSi2wMcVywqohevdvu2CXr4ahDnzKrIPJxen1PWyHD2aYahC/HJNcCxl/f6abli8ywil7Srdj6mPfsMrY3B+D04Cw5geycL2+1RCOpV8el44leq8erWuSZPG3iwIzqYFF/m5h/dCbZsSckWOKN8QUWiPz4iC/diba+Id96F/3qlzw2sAnOAe86l/J/dqmdWhW+9r73i31FBZupyAo6wpjDGx8HUcyxg31N216/i2Iq3eBwcAiP2AvQAohZNrM5x1Duu4r9S/VppK+A/BpVtbOt529vvEwbocaO5ivGKhce2aD+Cn2zz6CbdcOMtigEJbLi4HkICxW3SWoQMMMeJzrHvuDsZqmxyUhJII4p7Ha9u2MWd2YKVSqVQq9VUlwEqlUqlU6pPCA+v29mbb+7sdc9oDnVe12g+Wtnu/VXTj4JH3p3/5Fyvbxgf2g71LmuyH52PAKLqMAJe8AyvcMRF3CpDF4wmIwdlUVOpOt0dttIOteWssTg83VqNb5fXSwz4my92igIjPxdS8MaJ/qyzKQrfY82S/19XlU8Ps5ZMS8RecVuchd9nwonF1YtXlbSlrIl9EuGJS4FTBecTMSr16tCw6o2qhKwdT9eBeIkzRNDuWE3nduU9SXGk7RQ5vnV2O3uKcxgJRFrBjKGoppxvAyxQ/YWfUJmBG19nrg2PLu6/GB6dSZc/URodaAKepwi06e0b1LrS5VtfXdpV/+71GpC3imDjOmA6nsKYx4c8L9n3Nt+hVlzsspkNua0qie/osJib2l5xLTeAP5+9uqR0OwxYDHP3+A9yc04vqG91S4xowwIszla2P5eqr5oX5+GcOFxAIq6tfrZqdB+O24YabCz5dBfnuVLtK77dWFrTddC+P18seiO0WW/FArm9rHi21cNP5G5t5b5dvm2mPzaOc3Gd0qsUE0mmlFWujcv0LpzLutm0PfrYDwjk15XJ8GEyQSqVSqVTqDykBViqVSqVSn1CBA4Wj+08brRJglcdm2/xuz59/2N4Bg1Aa/sPmC/1Ym7XdHR50eaBLaXhsDA/LJyeebQZeUM5BRwndI8sx4pGpEVBJsODx2JcTBnYR/Hmnw8pWh1VMZrscTSq/jslrQ6ADgAsuFMS4xslDnnLiBD5D51PAlCII1Qk8vLydriYcrZTlDHKPVvFPK3WNFKyrQ+uQG6euCXiAT4OwQ9ExTVAMt1q5TVAETRn1mpLX1flVVNDOa+hXb1eXU47XHgX5hG22YoiAQP4+h1cAT6BAAU6m3u/RvUYeBCQVfVkRkfROqLn6mLxn6uQa4So/xALD2YOuMlz75tdOxIb3ne4KipJ7B3kOsmrdfT39NxaVT14m7vfIFN+7pux1j5xy8t/VXIVrrY/HKj2nmwlxuLULiu1V4AzxzmGCetc0QguIpxglhwtgx6ltfhbvd7MoZi+KjWqfe49b8UhkvbrOvDcr+tY87sl0IyAnnIcAdEXutmIrHsg91RzU4Z4SHM+xYqZT/XLVxw7y++ggcKqQ3nu6Gk16GMbQ6CAsdDRudpQXoSInHCKOqm634/lu37+92V7Ls2mKYiqVSqVSqa8pAVYqlUqlUp/QmAdhU6gqUvSGomfGkgANTkXlDtvbX+yBnik+Mzu0aFtld06XkwQgx3Nh1/HowhJ8ihJs75FS7xH6tcpUpG+uKJXHotSBZUWdSl7+HTFCRBVjWmE4fgCv6DTa/T8NooQdr+O0PjmU7sPUACzYdTS9BJ1TDAl3GkEFFgST9wAX5m6r4yriisMC3NQVR2P8cMpJVVUerxhbC+DAAnYHOKAVMybOyRQWfVggMbF++Gtn3DPib34ThzqMiNe6vFECg+HIagRVfk+GitTL9Ps1pgOt2na6lWyo+Nsqp1A6hCkOfKZPeSy1rnNoKh1/ezi4YaxPjrgdReFnt307rUc0ckR/la9LTGZ8sIvLY4AO37rDN0CvEZYunQ9BmOJ8fa5YoiOfYt5R3ghRp11wz6JbjY6jyljdg7Dnched6p4agqQ8hXOsXrCNmcHoq/K9hePcJ/55d5hPgqSL7VZ/Tnja/LtQ6uXOIqC7fGveSxVx1Ol9at4Z5sMMCumXuyVxzB6dY3L9DcVksVbeedd4L+peeXw6Be3qaOP0RgwMwL7E522+5/AdPuZIB1YqlUqlUn+CcgphKpVKpVKfEB0kcHIwtwZYcfrkvn7yr9fTJxHW9bDtEAqvARTYMb1ODpvoeaITSo6Q/e2ND73+AnVTMf41VmcTgApL0+vlfGHPlF4fHVbtNumurfJs/bl4qTmmxdXqheBwbgEK+fldPUq3v/E9la4aj/4hFucT18It070PjKXVxaN8dCtVn8ynMvMFkrBGADkAZ5qgWNT3BKiAuGAVdDBNUOycImgLOuCYDhmqu5c08c7sOl5cjn/2UDuWV9mDv5z01F0uJ5SZX1BF/iM5zlafkpl6pLwAnMDr7nQSBPRzubqgCLpUG1bkPIr16IwRukvv5CTL6RBQk/Nwv/BXrPWUow/76zxfHuE8vfmKe8rU51V9HX1PqE+tu/sILizeA5775r1uumqud/fjW7ihsF+2xsgcFq8pMlfo6PJ74fetuGNNrifvx/KpjoQ95+FOsNvgAcCuczqUA9gi9Np87xLwqWwL+27X1M0qxx0jrnTvFYE9B2BdUHDcSNiYH3vDpsCj+wWnVXWAERqPed03DVtAvDG+X9zfdPwddhzv9vb9zb69ffP9qJ6t53na//N//d/5r9pUKpVKpb6gdGClUqlUKvUJ/WXb7N/wsDv7uW3tYNV6B8R6sm+oCC4A2GAK29vbg2CLnVXFH/ztKVdLGfaEI8ur21mpDhCAsf6HYMHOSFJdEa4QIQIKiar/nB1NjAiyVcpG8bJ2xJyMjqXOjiL8Ix0xePCf3pQUriyIAULBMgIigAY6lOqaGsfuqj4EhtRJpHJ1XruAgTebD0bN+Lvi3UT3viOL4vA+FzBq/Bx3rCl1uFxLZd6W4QaSPP7oDrCAaRE7tDUxcS7YVEr0ZamPbKrwXdDRhLci+jg8Z8g4IR08Hxw1fg10RqGja9/XVEOcC5xfazolgI6m83VF4+LOelTO4WBXsTm7pRBJO7pFVz5BE45PKLn5tMCJXrTOiY/tof41TfgrihiGg4yQ7wYR3Y11m16p9Tzl7goLlHdowf1XeB0EiZqcWXQ8OJDw57OiHN0hIKJ17KGSq65E9xXcS/UGrxTDxFTIMxx9AKqI4B7HOl9GcPGdade0ToKtGWuJDrTh/V5lajpoZw8dgaJnAHkPGHHkgIBGZ9lUf1a4/eL+s+x99717Hqe9ffsWK0fH5LtAYodTix1qJyxkq8sO5/m//5//R/6rNpVKpVKpLygBViqVSqVSnxTgzPP9qX6jskqe3/Y3umVQ6o0o4dvjjeAKD72IeOGvf//bv9PVQQgElxS7jFghbv14EV7h+FtE5xAn87ZwAZDmsT00aAGGjCvehZjZUByL0UFBq+M8dYHnisqtSJi6oe4P6iZ3FY6P3i6UC22lrNl5nCBXPfpHlarJhOEIu+Jb7r45HOAUPtMvB1N0fFkJqOC2n74mDl4TFH2qm0/HG3KZ4YBEGowSekztGKfileVycw1NrONURb9W/BnwAsCRjiCLyxPsme62i4mG7MqaDgXxHi9o93MjOFN8EX1nbfU1+WRDrtm+8X42t11x+uKywSsCN6PrKdxVADCbqf+pLceWT7300nRPCbqzqfI+dDtfJy+lhRMMzr5tY6F5QCFCPk2AxOXzun4Vc7uK3h0meZF9UdH+NSkzHHUR18SEvqayc+9Y87jh1tzhRRA2766+y7VGx5eK96sGCQQow772frJu9VGXe9HUi7Vt7h5EjxudZ8WnT3a6uDYfgDCGOugiKtjX92CuLjF3pPXoHJsR7XW4iM+39/e15wEOiwh02zFc4JRjTB1cnBqZ/5ZNpVKpVOqrSoCVSqVSqdQndLCQudg8+zbn3KMcPGBEFJTjwRpdV2AN29tupZ/2yy8/7PX++tDhtKPEu3hPUjsrIQPAAF0gihLSHdR9qh1dT4h+jbkICPuAFE8r6sjyh2eHLH58OWTmZWAiGFHEKibSmbqptqpSak2Ci6mBF0Cqy+0UZeFFICsmCrKwvX48BovBiyDVlNsFT/fTVlV4xNS4Kr+aoChqcDejiTb5H/FZVd1GhE5nxBodcpkig/tVoMS428nie/99dHMVFc4XgY82FcHT9MCmKOi2X46dLpCDfz56lK6PVaIebijCEWwTTCiUU2nKBdZWbHPqcrEGZe0Fh3CKtQ1nOFij+F3/4K5SmbsgZm3enTblRGN5PuKK1aHpBXFsFd2He85WLb9H+eiKm3N1h8X1EXzRkTeRXHQIGpFFAiOVwHOvdEHIshxYPN84b/z+9L3FmKm3zWsAgU85BMRdHW4o3JfrEL/0YQKD7qsp+GULshqdXXBFjnq1agxOUNR0S0Q6dV0Ebfou4X0Ec9P3GSeLNo/NVrrmNkJSwDzGJ+9FXqlUKpVKpf6QEmClUqlUKvUJhUsF4Oc4D3ERn/o3UI6OdiwVbT+fL3v7/k0xrChTN3vsm4MHTnLzh2ELCCSghAdluHlqTARUfM6nAxojguE+iWgcJbZDvCTXEgvObXDCWnxm8/bpm4PmujZAigASrbmbi2XWRR+pyW0n4Bw+TbHAgGfrWNME46JnyMkP8AZhC4BYKz4tURMUHWg4oIsS+6szyx1A7lir6pEqyzEGh9lyKAnYDUGtHmuoKXgBeRgh3Ks72kpb712V5kW9SnCSWb/FF32iYxXkKYJE4VMbit6dAiYBqqpAGqDd2d2dV4eim9o3RqBldOiFW61GjPQ4/BoVe2wLGJkXksPV1xzoBAyaqxut6HXxz7i/5mDvBliufjIXI3aCnzg2BwVE6fnNtRUDBQLI+rV6mfzU/3o431hCfyrmVwga1z6+gdu5zmdwDSM2Opxgrb27pgvKbNgFUdkXNsyez+e65q229Rq4CB0uNsI7WOM4AVQg11OyF9AE7MJeQqwRzkZOB0Wp/PNlj7eHff/pu1xtk/cY3WF4XbsBslQqlUqlUn9MCbBSqVQqlfqERh+r6wgdV/6g3lZUbJzH5STZ/UEZgOqXH+98sMUDdT8BZ7q9jrHKxgNuEVaEC0nOFsIXPK/XwWiUQxpbE+jcqVTZzWMCXb1NTgfkY7hABsut8bNxMkwYTp8FMAAmiq14lUepHJwcBBEeb4Mj5QR8YCxw88lzKsmu02fBTTlVcHYABkAR6NmK2GADzGr/YILicioptshS8DjVzrhYVTeUu3k8zsfPeR4r3siC+eKl7KMv75m7Znj+HkvzInpyKU4Y9Hs713Q5FqhX9XcRivhkxEhBDrms2F/leU/vr2q3/qpfgSp0REVP01RcbZ0fOpnGVKW4F/k7sGvr3tB51uT6Y5tZcSBTPE7aIpqoo8Y9ujvwuNcCQAKeco/3Fc2sAecQl3SEpy2jfYV+qVXA7u+rgldVXWZ1OQXlfqoe7UT3m8nhdpWqrySpr3G5utcYY6x1/f5D4FGgkyX4fkPU/+UQNxyMBF7N1wZdcIgWVpatVztpivMJhphSGH1mOD/s9214X51P4/R9Qbff0fWzYa/3d13jQZjFfY6VO9OBlUqlUqnUV5UAK5VKpVKpT2jIAQIWshV/wK/hCmGB9bC3HW4QgJtixwuF7McCHaoeUhn0QffGkqBINXe4sHi6tDVxr/Rh37ef+LCNqWan+q6+fftGCNNUjo1pejsn652Xe6n6VMKBUms5uz7G6gTCisOCwAT4jPkBnJjKr3ebzVaJ+1J0Cal3Csd4oZMojmEBKOYCScIltmlSX8AAQgILUtG9J6yfcqWdVrrDCa7D9NfUemGNJngVkTfCnXVAwJyFSgTKPB5I81RV1rBOAq11eTwLtyfJe6Xo5O/sr7qBKriogBgZtfMbYtVHUrqzKzrEeuf1NoEm9qdNhy9TLiWbMdHQN9oWLimBNcbgAN9uPWU8lv45Xh9l9Ks0v6hoXa4oxvr6HbaZitTVLQWIVD52kwXgMpXql6nOraZpnP0CY2sogGKEJfrY4udBxGb0cRVNjoxOtcrv5UlAuOlOVwJMHzYw+HknnXiV4GzEcACp83uFj9ndhSgwOXV9c30mzv1k9NI2OPCudSE6Zh8bQFevMyOEqVQqlUp9WQmwUqlUKpX6hKIA+lRROfTYNntXvGjf3ziREHMF/UG/2v54sL8HcaLX4TCCPdxNnVFyz/TqrpohB0+Ra2oobhgF7jOmrQmcEG5g+lkdq2/K4YEXXtU1kU+l0tUnwtH1JVdKvcXMWvNI1SlIhmsJ4LFiWXBWFY95lZgOB4ASzpfqfVFYgwPl5zoGAB96xHbBC/KW6Z1MMUgu3GgEae0W0ZPzzYENA2ks1map/Hl45xEAxu5OLo8zqptL982BVvXpdN7M7dCHPG3YClEOua+0zuYhtv+/vXvZkW3L0rw+5mWZue8dGQnVoMVrQIN2vQqdIusmIUqCRokGHUSDWwl4C/oI8QD0aNECiUJUr1SVEedsN1trzonGZc61/FzD9z4JUsb/lwrFOfu4m5stWx4R9uUY37TrPPurdO8tx7X40/qrzlW9nPt6f7wzLdk65TwtMEWo6Mt3fj2OOMmyz4BrrnxGt5jI2T82S+H1/dlsFfQMqERiFVAu4WlKscJ5nneZbJ2z2Ndt21mynmboeelyKyUmoNruE1Y66XecAWqOEnbPnoZdn5z9tMdnm/f6nLC7nlI5n15az3PyzVQPZefNpF1gVvZ+7O++NrZoo2vNQ9g+l1JHs9dhK6B9xOspUcQvsdLrD6K/48cs/c8emh1xaqdN+UXh/e31vlZM7b2aK74AAOCrEWABAPARuVhoUXOpqfeqxc1pO2ySaqs3ac+nd+P0tCafXrdqIZbE5NAMEbxsvJ2TRrNnR+c3rp/fk68panCUSo7TB33CKI3VVOSdRrczaBj5so5l0zZ9TZSMy0rX7JmytbcSpx/atIn3PNnf20mBXXL1D/cpntfQKbJ5oqH/YF/Piudkz2tE95bvRtpr8YL6cxGsJe/mmt1K7xbE4vXb1MucIOoRjGz6kBoseHCXZ79WrN35a2vnz7KQ7FzXXPtt/i3x+mfJ+lid8RKn7mUNcuxkvF0OnXTqfvyc9Xvpc68lHjtHCBnTR/p89mGjPh48xjpiKrYOKZdAVKL4XZ/bnPi72SmG/mQ0CK0xXeTXPk5cLP76dN1N9+FmZNKjq2kGShqmllhDnddhhkbX4MgvY/frn85wbU7vzTXCeS94R1RdJ0CuqaM0J9by5cABn+SyDjJteu9zIs+nDr2fyw8hsN8b+3O/9+Z9qwX/o8/OrehIs564PZ7/OUlma5ErPCySZ2V/BFojXosHvHHq5btb0Ce2dMqqx+PqO3Ckw0vqu8h223RgLzq5oiuvlPsM5wAAwLchwAIA4CvknI+j7ceYEzHJe30sZGlD9t5ttcg+DMfD69pUickmiSJ4/xCfLJgazYuuUxSAz3UxDyrOqStZK2Ddp4dsuscnUmYA0aIfK8dk1Cy71gDBQ4Rs00Q9gidd4rLH7rIKz+cH+vlzD52kqj7hosGBnhDnJ9FFNmQnI2o0kG0Sp/3UY3SfVJkBh69rvUvronPpWFNNVrqdx1qXS2vKKf49J7nVbb3uPORSwp7iBLi0TjmcK4E+4RQdST3Gc5K/LzYJtE5v9CLzHNdYJ+W83yzH6XnjB8+/rPdNIjyxya9Lf5W/d9k7nqJDSyLy00s6A7sR94n1kVW/ZncNQ6Osvsf7bEtrEcJoGOQLl1miqkma9YL5wQDW9zV8Gs+uj/VDzQMefSVS31svpffwbYZNNjW1wiaZS36+Fmj9W2V1UPXL1NHc/LMQVu+Do8XpkGmVscsu6+TNeapgG2fY6OutZyjos2keiOnvjtgK7eFBYkzy5Ri9ssnB7Pd7mdNrukoYAaH+rvb4XbbDOPVe1xD6UuBuXVwys8ZzxdUnMr2z7hZhpT0fPaPAg65cK/+TGwCAb8V/mwIA8AE5SqrtA3Wsz6U2rBPq0XcPduY6XEwePZ+79+zEapJ9vp8reRb6iE3i9NLEjnpb4VVMqyQvU7c/bz5ZNcMKjThy80kijYLafrwLp2ROothqYLUP9doBNHJfAVOLAnR1rI6mFBMoydf9sp9sZ6uAFpi1mNA5+5Rm+GDl8mMGRF7lfn2MJHPdrHsI0b3Xak7xpCiSt14vvZRb8oLt7hNhtvsXZd+2wramyLyEexbFywwbYpWuRPin/+ZdRjYXdTmlz0M4Dc9kdmmtIbG0epKsHD0CM+ujiomuEdNedhLgr/VX6fVI8+TAvMr8PX9MZ/iTz4mymsoKS/I4p9V6Oy7rph7krMMFU3//2vT6jxmmRtgm/Qw8sz8XD1V9mkrDJuupigI3u17NO8X8dM1m11YnwM7S/75OaFyTW3PSz//EXp6HqZe1yOI/v+8+vaf3bJpDcvN9jPW+3mLVUEPXCDiTnwJgE4T6nHvKs+bMVhuLha9x3eScOOsSb3lJ6/e2r5XbMzSeN1WL65+iZN4mujSU2+ZEm39v+cFUGwAA+HoEWAAAfMTI1kGlH6C3l1c5vt9jUW74yWoR4qScLh/YRR7Pp612+SRVTM/Yp1wdkdHpDw1+4uQ9XfmykMmDiFnO3Ufzbh/7wJy8mDvCFQ1ENCjxIEAu4dSwEMCdwcFcBbN1qFjNsomfFh/u1/qUP38PnrzHqXRf7erR3dVnD1JMzLQRK17Rgy7R4tRj8kxDHl2x9D6xvOavZiG3r3AlL+Ge62irbF5mdbqf0pfjZL/dn58GgfrTPCTrUQCuHV8+YeUrkX5d9KXVuLbz56xXHR1ateSYHHtE/5h3Tq3AbDxjKs6ndazbLM+a+n72V2nIJJegJvq5DluHax5orW1Qn0zTn51jmsu6rS6nRqYSwVOsLuZaLZyZje42DRXv0DzFz0JPmw46vDjfArFu91VbIdvlfR/dT0HU90v/Kk5tnK/Bet7m9JqGglqq33yqSu+5MfcvW18hjvd4zR4sn4Qqq3R9i/AnnSFk9sk5D9hmd5esdUpbjZ3dZNLeHyqQY/oqTpDUKagevV3z3shxT/ukYLF7zqew9ETHuu4JO2xAVxMjXNX7ZrfuuPhdj997PdnQettKTGTa+mOXx+NxnhgAAAC+CgEWAAAfNKefcvEP26PLWhmbq302/WJH9HvYcUQHj06NWJdSHlJsCilb2OKnocUJadHxs1YQ52rT8I/j1VMUC0TmVJGPB/nnY5uwihUz/ec6aeOTRdEDZCcd+ve2Y/fi61ina1Zk7qXbnj/4FJGGHBKrYc13yaIc3kOErBNJsQ42z/obUW6uP0dDkz7OaRu9Bhoivd6qT67ItS9KVkm5BwyXjrC1RigW4lS7tkesoxUPJmyFbhftJ/MpmGq9ZBKnw63uqFUMLu+nbIqufXkY5xM2PuE2+40OK5qKlbpUfb0w+rf8VMkR5fbzdDx9L2vcA756th+xyiZpTSXZIJe9sGETUjahpo+RvX/pepKdTXYd8Z5Y8NQkDuOTvjc9VnCV38/rWbdq94GFo3Gf5Vhts38fPg0nc0LOTsksa7orLpWHmDFRp5mR/rWuBvYoiZ+F/S1+T2oEqBrunN1mfl00tNI/2tvuk3ESfWNxmECKGi6fRkx2XSygHDMEjK4uvcbxc6yTSrI9JwtaNTy0MNSn5yz0bP5ax7o+xU8q1K/RMDBObdTy/zx/tdbhCT7NluJ9s9cbv4YWPNYy76cxxnj0MfoPT24EAAAfR4AFAMAHlAhgtJD7bd/9A7tNHyV5in+61Q/S+7FbUFC2mzw1PEmXk+jmqWiXz7QaZGhoIhEozJPoROa0ik936ediX0P0vh8PEzxkSuv0Ni8H12mtum3+Qd8mb2agoYXzxYObY49JGJ8USZfpIj05zTqGhn/A1/XCvR2yiYcOOq0iydcC8wwf4rlKrI9JPMaIE9mOFXJ4GGXBUqyRxbFyqwdMy/JtFVGDlDmRs8rmi3cdrZPkJPqgxKaScpyMJ7GmacX3FqKs5vK47iJDV+Rikm2ufc2TEG16bG7z6XXUDrHhpfY5JnostJzrj9lPPLSgRDxQGzGRl3qOCb0Up1T29VRSLNu1KJ5fnUtRij/kXMnUibIWE0P2fucU63WHnUJ5u23WNWbTSLFy6q8jOtMu70+Pe3pV6msgp2FLTHmtNcDubWnrXrJ7pUZxvqzIUtbhAOek1pxE3Mex7vY5LDZmR1h0aiWbHuxrbdOujK4myhbrlX7dit++a9VSp/5KL3bIgLRzDbWnM2R97lHuPk95jAmxNT2lE4HWD+ZddBKh8Zxy1Pe1NYuN10mGVkbf/drq42oIdrvf1/2Vc35kPXJyq0xfAQDwjQiwAAD4iOJreNog9dS1wN0/lNtklUTwsFXJrVuAtMmrfP78Ko/9kP14etzSvXzbJ0V8GsgCjujfsYmOY/dAIbp0xCahtNi6WkC2Jjp6X0XU80PzpqGVBgi6bhh/NkvKfSnRtT2Cm/UpfawBGZvO0u705mGCTRnNEu/L6YFzJSySkJiGiQBBX0fxIMzXFcf5GHFi3VhB3dn7ZUFJGtKfxwqF/Kllm0Dg5IYAACAASURBVASbK3s2oTRPwrtMhGmQ41NlElNrZ2AxJ26SdVcNK1a317G36Fqa4UQEUzpulmdgdq6bzcmmVTav4YV2M9nPF5u+0n4pWSXssf6WtvV+JN+8kx4F8ytUsdMM6zqVcIVaUchvU0jDgyxrctI1w9Tl0GAnxpFKipAorpWFmbWuKa7513P6yybYdJpQn/8sg5fZb3UGXsPCUZ/WyxHiSYS6dgJliZ4xDVif+7v3YR44MF+n9bQdzQ8DiLBN1xptkmqMS2ApdlJjjgm7cZxZ0IgONgtwt+SncuoBCtu2JvjmiYnpEgzPibvLQYPeeWVdX37a4G1Nnvm/24qw3SEpsuds011jHHLsu73/OuV2f71Z6Hl0XTAdz7TVVrc7/zELAMA3IsACAOADRpw8lsX7kSSCmRlodOtgalLvm5R0sw/K5zSP90Q9bfJo9zXDaEqqxVewkreO++lp0RXUravJS8Jt+mf3ySufbrIz4FaHkXcXxUmCaU5E5XVinORZfn4GB7b2lOsKaSRfPuhv/j8Vhq3MeQBkQVSSs3NLf/5oUkeKk9762YFkDfU+Ldat7D7785rhRGxm2V/FaqH3PrU1wXMWxbd3p9SNmFyzPrAI7oato0XfVEzV2HXPXgpvIUiEiGnmdham5csEVawzznijy7pWPu0Wk1MRhOwxIbaG6rTbqut7OtbXzdArRxn/6sLSP4vQStfc6gptmsxzDM8S8G4B5JwBGmmeBDgsqEqxuijzsIHsJwzqC81rvfXsNLM11HmS4LicYjhP3fMffnaDzXAtJgk1ALWw1O6HrFVupsQU4Z721d8msc6a4nfGO9R8wknfU71frdBe1zdr9ec3QzQ9uVI8ze2tRx9Viu62OMkzxwpsBIojfi9kzoVd+s1s6ipWL+1d7nLeK7r+p6+he8m/ddbFyq0Hq/4LpKHeIecJifp+3babvNzvcqs3CwHtQMYxHrpHuG2FCSwAAL4Rx6IAAPAB17DKT5JLUq2L3T9ka1H73ptNw+gHZP0wrx/5dX3paLvsFijotNVmHVpiedRhIYh+ENevaxZu+ISSfzj2Cah18qB+SI8+K1/RSuvkM1ubik4oLz9vfoJdLVFIfk5kzXU2C7t0asV6rM61rN7nSYj+fV3OcMOyhe5rbOM6xlJzBBJHlHmX9bztpVxKsGegkyKg0ZJsX1Wb//JTEW1ls/kUV4kTCCXCPj/tMH629Tb5iYazo2j2d425bDjGjCLOYCYnCx3m5Fqa19NOAIyKfgt/JF6/2JScXRfx11jjdYy5fifza7NuSHr2cwzrrdL+pWR9TbF8Z6Hh7JoqsV9aLODM0YPmL28eAOA7qP71NUKYWHubj5rSWXSub4uGe9FLNd9f+57WPICL75shV56TgTFBZqcL6rRf7+d02vBifuu+ikMMplm6PgvL7Lnl1ctuq35zzfM8cdGL9z288u+zoFXvCxkWmM5+OL2/WgSVEiujNh1nRfMS/WHxHlxuT+sC09dVNyl1iwm4eLyjWVG9RYR6eqNEb53+S9+W4k++R2ea/b5EqGdrvfGfD/57/NSQTEcE5VYS4RUAAL8BJrAAAPgILY/W1bCSj7Ef3pcUK36pewxwPJvs/bAuIu3EaUeX79++2LrULOW+1SpPGxvy0932wzusrlMjI4KlGBNa/UUl+qhSfEK3AvnosdKPyhomWCG1TbU0W5PT1SZdd7wWgVvQkjxk0ZxGC929hD1bEGcf6LX4u/UVlr0TJ76tU/i6F8TPwnQ5ohB8nhqnk0nSZUt5FY/ba84p1g5LrO154GQF9OIdT0f0O81ZmJ4i9Eh+Qpx1dLW2yr6tE2lEh5YGL9F95OX7ZZ0mN0M/DVR8W63FqYSXyansAZUlSj0menJ0b+UkWznXAmWW0Pdz1bBWD7v0lDxfyctrislKzmNiqdkaY14nLs4ltxGvKc8T8WKNT+b25wwWLyt6Kd6bbBNz2YJRX9s7v0ZDrcfjsUr/U7zGdXplTMRd2XVYpxqO8/XO0DCnNU01e7BK9Le9WwsUWdN0fvGi/6p7cb2uF9o9bAXpI6bezhBxHl4w7zl76BHXv3tJ/QyQx3FYL5Wu7eq/9P2/Jkp6/0jchz35709qsTYYpwnqhJn+S6+HPy/xUv7497fv36RqKG3vd5Uvb2/281Muz+f1FAIAAPDVCLAAAPggDyWK7CL77D2SOLB/xFqdhSwaTD0e9oF2y7o66B/MNS1q4hNE+kG8bv5BfrcAKVb+uvcS+YpVhAT2gdjDAC0EP2wNca7CJV+asvWmMgeYrJTaplcsTPJApcUpdLJtqxHLJlYOD0qqrRJ6mfmwQKxFeJDO0+HsZMFuwZJNCc2Cb50eS+nsJhJ/zV1DqP2w5z1qsgDOTuTTkGX4iW++fmhnzPlaYErviuJtdCcCqzWtdOlBslW2YinI2REW01Spe0/WOUWVLk1eGvAcHuroc41Axk8hjImoVSrue4Ir3Iqpnjm55F/mnVF2LWo+C797iymoWO+MwMvK4XUST08AtFPsqpxbexH26ITW5aREe2y990ry0whn4KX3jd4DsXLZ7T279IvNPq5YI7TgSd9vDWIjvFqrhCmdJzbKdZ0wxXsQN09Mg9kqqE5jaWilpyh273nT66Pvowab8/XMsEvfrxZThamvbMt/n+ZrT2VNd80TBmVOAcb9bvdoSuvxdRXR3ja9tjoFGAGsB70+raWv6tB/fvjsmv0u5+ohcJxqOb/egjTxtcWXl1d5e/sSeVy1350e022P5yHl7eHh1ZhThintnQwLAIBvRYAFAMAH6DSIDgrlVtvn3/1u1/WrN1tx261n6X57lcfbfp6OFpMocw1vtl71+NA7wxidkLJ1qWOXUtPqDrIuoxKl2SXbWptEv5GXS88QZ7wLZTQ4ScOnXY41QeXTIRbOxKTMZJ0+8Rnb+ntGF13cynqiXqkeskSYNgvFLYSba4BRdN37OallQdnwtETLtbe6rf6rMfr62fN5S0ybza4tiUm0torihxfFR9l8HEonut/lJ9f56x0xpSYzjJN4DhGE9Rn+aEwWxfkz8Ju9TF2DRQ3/bIUtBnuit0pXR22aa56614+Y2srzIL6YDCoWenhH1vke6XOvKcuu62WxtjhPXpQ5STU8CLLZNp0ikrMjzN83nwbrfb7HHjLqNaq5rEDNTuy79D+t52Brf9GvFZN619MuZxA0TxicJe1iq4925KNdsjHi4MxR1nuao0dMInzS17bHgQU5SuI1iLplX2tMMQlo91f0ZNlpj/E9NjkWJwzalGPcJ3MKS+Y6bwRcKd67NYUmM0ydpfn+PEfcu+0Ha4Zt/KADTc7uMA2V9+dzvc59POx3Muu9HTel3WPRP3cc7Xb5NQMAAN+AAAsAgA/IMQFVkjxeb7f9X8WQTLYP0Idspdh64PH2jDBj2JTMPd/WRJWsSZNzJWwGH/rYsxdqTvOs1a4U63Pa6TR8EkqDmj7mhNVcJ4vAKpUIO3w6yet6Yi2snRMhFvLoz7msJI5VBO49RSmCLYniebF+qBGnIOpqmXZGVR80kn6e8rZqppLkm6/atR98op/TPkdMBo2YXvJ1tOOyFthF47d6KZv3B9dAyKeW9Dp4COKJSLNur2rrX/PUxxlMpCyxYjc88Ipyd/06Wz2THKXozZ7Zek35PEmxtXMtUObUlj5erAX2mI6yVcYIJHV1T2bZ/AzqIvCca3UjwiFJl3AlXSbcxKe++ly1TEl2XY+zE/LO8vl5fTT4yfN+ipMSJSbvZhH/XKtcQevw6asRz0+vRV3BY6wHRj6o66br/Yj3xkLXWDe08K34CYPaFzfvOS9cX3eCXb/S4h6yVda2Thicvzd6/ZoFaH3dP+8Crpgamz9bQ9MjivbHuize6+WdXLPQXaynTuKkwRGnK/r71ixIzNFVJhF+6VprLU/Z9f80xH6rMkqT7XaPBdN0r6XkzAAWAADfjAALAIAPuJUqX7xIu3335ctuJd85ye9eXuQP339vR+rPdac5daO2WxXNtHwAJ9upd9aB1OekzBFTVeeqmMRJcNrb06K0fJwVQtatpFNZfT9WgGJrUxbC9FWcXTUWqmM2qNv6YLquxF0mdHpM/XhGFUFa9Gv5ilpfczk20WQrgE2artod3bqnzp6tFJNTPcrIL6t2c9oopoH052xz8metmXltvIYGvbc4adFDgyP6uiRCo2qbfsWnh+z11dXFZX1N0tdfW1DXfCJnBjQ6UaR/rV9Vb7d1PUqEVHMt0KalvHjKH+eyFphihS7Fqt2w0wg9wOprzdTDqb63eI3RGzXOkw1lrgxebstrr9VZxN98Ta3464iZMp/S6vMnib1fOdvZkO+uf569XjOY6319h6/JxirocazTDUe8/xbr6CRZ9lBKO9Pm1OE1UOqX0vhyCeo8DPTgdhbI93h9GgTpPWf99N3fgzlNNq9ZvKqfCLjieUbI6+uWbZ0wqaGVdrNpCNz6mYLqlKGtUPaY+tLN1XHYhFsdZXXSWUeWrtemYuuHvpbrq6s3u2+G1O0mWU8z1GHNkm+jtfKj/jgAAPBhBFgAAHzATezUwbE/Hnt7ez5Hb+NWtbj9YbMv+gFWi8rry92P389+VL+eQKfxwpG6rRp2+xAcy2PDC7Ft+iR5p9ZxmVKyKSENUrRDaK0QFg92WluTRSX5qmHXsCiClDXNlfyDv55muKZ7xCeoRqzS6VRM1K972bWuaUW+NQOPEWXitmqmfx+rWtmmleZzntM+WY74ed5LNcOL6utm1vXlXUMlViHndJavo6VYXRzeiRUTNSu8ynKZgKo+uTWG935FeXif629xml5agZSeRjfsFD0rLC8eHJYI+OYJkE3idEOdGpIzYdK1wLlqV9KcXvJQsuha4Aqbznsr+aiedVZp+JSjoF0iBJJLK5dcSufttejzmf1X18wxDrjzANBDEn9sf7I9jRVKromk6IOy6T2/6HGjZZ+UmycQzpXMCEFt9bV7OCRRpG7B23785MSUTkP5exNThBro6XXb6go3Zw+Wv84RodLlmvkxiHGP+XqfBlwWCBV/+T6J6FN787WOpu9ddG7FuFmJtUE7dbD7qZQl+8RhTt1O6TzEf19mab+FoFbDVuTZDrnbz6p22qX1jdnli6nMONXTSvl1gi+nlHP+vf7v7b4f6ZIoAgCAr8D/OwgAgA9402P+rcJp9DHG8zaDDgsWfOXIjunXcEN7jnqXt+dTvjwecugHZZ1Kke4rV/NUtzQ/Y+dz+iomkfplE6xYf1Wcw9e7PJ/76odKKT7c97amXKbZTWQ9R/YcvPzbZH8+EiHO/X63IKtEMCURpNha4ZzKWtNePnWiBd02+RXBlj2X+NnVJqZinS56ozRg0b/Wvq8UReEaCFiw1L3HKUfA4RM1vrI4u53sa6077JwEa1E+niLwk8sa2Zw6Elu1y3YdtYR/fp9PgXl0dESg1aOMfMzn3ZqFGfrPNbx6eXlZU1FW8h2Xc9tuFpI0W8McEUie13NEmXuNwG4W8W+1rGsdh036RFiEMvavOGWxX8rQ7WdfyuRXcBbB5QwAJdYFrWw/Xu/j+ZS3xzOK+/09sisaJ+/pc9ZuNr3jLFC12yimn3J0VWlXWtvjRMJ5S/nFaHP6zMasxppM7LPAv0cXXKyI+r/7euG2VQul7ARD6+VKvoJY6wqL0gxts08iplh3nWHkaN5tplNT+r12SuW+r+ucLumi3k8WZEZ4laOs3k4fjLXBdVpkP/wkSwvKdCpw2P2kT0hPpOx2KmaKtGzceu9V75l/9l/+1/xHLQAA34AACwCAD/h7f/UPrFuql+Qn5sVhaMOmTIp9WJ5BwvPxtA/oj7eH/fX+1ADER4fmaW/P7sttXsNzTpnME9hWzVN8kJ+Bj33/vlugMgOaVYyePTRYq4wRrNnfJw+QZK6JxRSRhTMxidPWh/uYnPHxLYk/8imuyxqar+H1mOrJHo7ZJFSKeaKzh0uvh0RwkWOKR2aAYG3pyb+vzADrPBnRVi7HPA3P/1mJ6TCfzDpWeDd7m86QKda9SpZt2yyMmNNTHsZEp1Nc5xGh1XyNbZzrhzZ5dDQLj3qU2Yu1JHULrmb4ZRNn8Qb2mNYpthpX18rgLDzf5ymRsb9p7UkaIm1lTYP1H00nFX/c+Jm7Bnt2kmSN8qy8VvBkThT9YtjknVorjbvQ62/Bp4U5vr66wp54P7xHP4KvOCzAwipdZ23jXXH/vAd/dH+u15Yi2B1xb3iUO++veTriWgsUn+bS99YmvFK8xuydZz3u7T3uS1vzy+cJkxZSxnvkv5v++1cvvVde4F/stM62QsRkE4V+PKY+ziH7Y48pv5FSSraPOsZIjyh/BwAAX4cVQgAAPsjChrY6lVKaPU3jzYIbndrwAQ0Ph273zT7k6oda7d6xKZ7Dg4QyTw2UZD08qftam5Vmx7qTmSf1zRWyck7bzGAjxel7Fiatfiv/YG9dSxZ+lXenux0R0pzTVmOdNijvltrm6mK2Fbj5XCwYsBCprgUpO6wuOrb2dYKgdy3lGU6Mw05u08BqHiA4G8tHlKnPn6d/5l1SyTfm9Gua94bZhJD1I/nraN7k7hNxc+0vgsA5qaSBxxGTOBJho63XtbYm4NoKq2JdspY13WXXXAvYI7w51xl9vc5WzCK0sudYtwgk54l3NhIk2lY+d8pGFPx7WBX5i039bB6q9PMkvBShlwVc0VGmP8fX9coqQ7fXX+ek12HrqnNCTuLkvzUJ1n36rcfUW5mTWuJrijn5hJGeXZjnqZoasmmoFWGP3Zndz/mz6/SDXq4Rgd469TH/zP05DrG9xSTvyumHnGuBHjbOlvvo9ZL0vmfN2ut9es+m/uLgBO3G0vvm8fbm01vxezZPXJwnF66gNMLXaxjaxQNGDfJaXyOUFmLaPaOnP0YQ2IcuE6Zx2/if3QAAfAv+mxQAgA/47//ZfyOt7UlbmfuQm/X2aBBQIouxQm8/Rj8X/WCe5KZTIaWKZiZvNoW1xwqhdyJl60Dy6Y59nOthdiLe7FjSwKrPEnefAtI+LA1SbENrTUMlOXZfu7PerUvQpRMwGkRomHBEN5HLNukjEQzoc5ll5DlW39q7Ti4vTLf+KV2nihP8dEpmhSZd1smI9lpi0mqrfgKf/jOd/kkxuWLRlv29r6W1NjwEK2dpd/Ij49Zjprk2FifcjZieauN91ZD3c3XJzb/HTm2Mbil7vjFl5mXu8brlDA01JNry7JeaS53Zpnf6PNmwn8X7+gJLntNnM5CLqTedZNLAaLRYeUxyf/ETKnvr6+S/tgKZYuHJPp5xMuV8L5sFpb5p2v39Gr7elmKCLM1uKOu8SnGNZ3G7SIkT+3yNMs+W9UsJf4RNI62Jrdbe31t6Xw+53FtxfuWIKTJdqZM5cRVrpj6F+PP357q8EXz9KAS7ss4yzbv8ebW4ph6oxnOJUxZttS/WJyV177HaqtxvN7+tbDLNy+VLinvCOr36Oq1Sf2/8BMV4r62/rUnP/mf6e11uHgp6wKn/POu6sfzVP/5H/EctAADfgAALAIAP6F6ArYVMW6nllnqyj+27zBApppmaTwHpcfpasn7EB29d89IJprpt/mE6GtX19MKnno52ePdVjiLyESfgWcBgkzBnqXnsUfmTz+fP/vmpleEhhfjkiK+geQeRhgR9+CrZ7PrRx7aII/q4vOQ82xSODF+eGxZqHF4YHif5WS9T1nLvearddSVt2OtPMzAo56l+eeYk0S8ks+Op7b6iOYO9WGUsklfgc+3ZSpdVO/vnyVfgLAg7B9Psemjnkk1t9cOG6lIfZ79CPruSbL1tzIm0CDfmSmM8oP2skaTcYkU0JoKaTayNmP7pPr2TfFJJ/8lDS8ktpPT1O3t9zYM0Ddr60WItcD7GiOm+ZJN8OVYwvZ8srTL5W93WFJWu1slc6Zth1CWoKvOYyV7ihMG5EhfdV/nXJqLOe+uXJqJsOjGNX36MHNNccy3wByGYvTX9LMnP9Szn/7kptHVLWAea3wsletB8RTXLricXagH+7E6LIxKLN4f5lFgt9p5IlM5LTMb5UQjnSmZ5uct23zRbe+oRkP3HW5kAAOCDCLAAAPiAS39UKbVu9Sjy1Kmnpy/u2RSNdRr19aHai7a76AqRfix/7E+pFnZtfsKdrRb6BFM/vLepeimWT52McQm7xEOCHCcRxodx73vKH5xauXQStR6TNLGeVTzcsu6hWYpu0019dWSNKL22FcCcrM9LJ6yyfV3y0CkGVeykt5j86jERo49VR7Y1tpmR2HBQ9yJvLea2fqfDT0Xs83nEa9Dgqc7ps/hnR5xCtx4sEo89psH0pL5Z/m0l5BFgtHYJx7KHVLG16MXzzTuaLHiaNVGxarkmiNqcWsv284Z2UlnHWPfpsh4BlHUtxUql9lK9PWS7VZ9qO4533WK++tbXlN2w1cU4sfHwtcNrSFjjhD/tupq3jMyurR+s1s1JuzYDmEhZSpwK6H1ZXpZf5DeYiJorjL/yGKvsPu7nn1sLtMmqmjxo8rZ9ux46hTb8pos1wGynDc4pQuswk+bTgBFkHtLWJJvM8GrM0z5jUnAW+s/i/7Vg66utt+3ma8El21RXrZsOHj51WFMPRwAAAN+GAAsAgA9IUm1yKedaRmnbY9+TTk6lmuWlvMhf/+GP8rR+pRTTSNVP9duqr9TZqpHvxu22Stil6ASJfpgeu+SYYsr57KBafVCxxqT63mxaxTqTNCiYH/x/ZnVLfmFqZcQ0iReLx6hIFFTrRNY8mW52bXm4NSJgEC/N1r/bd1lbidFpVNaEmP+c5BNssTJ32D/X0OXYjzUlo8+j9LnS5muT1vcUJ+7JnB6K4EF/aBm+/uUhmYZHTbJeA82bjhaF79lX5GKVbk072amI0QFmj9t9tbN6MKbvUdNuKx8NilMJveB7zJTITu3z9cTH23MVluu/1+gT2/se76j/M/1zezZ2uqKfaGdTe9XDLMtQ+iwW0+/3ovfjudvPmv1bc3vRIkh9fm2PAvW+AqyfW63z9/PsQJM19dYuJx3+NhNRs//q1x+jxnTbL68FetDkU43zxMoUq381ZQszt+gUs+1AW9/099KmzPSRik/xWXBohfAl7hO5vIf+c9IlyLUhy+ZBmv69njKoJyfe7y9yu212qmMpeWylPnrvx3UFFwAAfB1OIQQA4CNSs5PGsozqx/vnNS3y+fWzbPebhUn657fqJ7bpB9uXl5e1WrhFb9B++Pl1ttnWveuq5ySPY5eHnjDo5xzalJWGYP1S2K4jJbODSv9aVxJtjuayujUng1IUcqcIPPKcHomwxj7At2OFN/MUPYkJK5+SGRFtxfqUrg32ORQ21nTL3EprlxMRLdxJfi1scia+qMSqm4VXMTSl3U6zZN5K0LtPsNma1+1mHVJHnBYoMTEmdh38dEP7d5vuEnk83/wkQQuXtpja8VMUU0wl2TXvc/0r/n6eAphi5C23tfpoPV/tLJgvUZyfYsJMO5xm8KHBnm6U+ZenNTk1O7/8VLvNlxKTv4falzbDS506mwGWLR6O82Q8n0iS6LY6g5V+Od0wRUhn70c8lj53nYLTwMVrvLKVzuvz1n/pX1tYpCf11WL3rh0MML7t3jp6i0Dt1x/DK99+/bmLnD1rY+6Viv++lSivX4nqpdPNk9Jhq5S2ZtiPs68qph6POZnW/X3vsT48Z9pmr1i17/FTIjXI1kDz9dNnXwH2sPahBe7XgBAAAHwdJrAAAPi4pB/on71t+kH1dr/ZRNSXx5tspay+JSusbruU+skCrO+++06+fPGTCi2QqSVW68r6MN+ifNtmZ/ZYV9yyrxNW/cTtB54V6w4Sm/b59NmnvI69/WqZ9a9OrRy7fShPOa31MT897sffJ+L9QD5p0+3Du32tBm61rMBjxPRNFZ+6OSygyhEoDZtMskBDfP1tTW0NiRCj2Ql/+txsTW+GAXFKnJ2E2GyEaU3KaIn6Vl/iVMBiAVEfOU7js0pvu0YeJJU5FOXXNs2T+3z6rFupd1kn5mm4oUHTfG0WHHafxik2vFPOoEPXQqOV3CauIvQreQ5iRefZpoFntfvBus8sSGwe1tUaE1XRFTYDq+GnBvo1SxbuWYilRfwWaP76ap3ExJVOIunj2gpmtku5+rRszfD49ntLwyKf3PuVx4jDCuzZ/cJzt1CtXYLSuGn06/X3TmICLkXZ/WaTfz063GO6KoI+DxN9AsvDWJ/w05YyPQly20qsMkrc2/rredhBAx5Sbysrs5M9xQMzH9rr+v3vTxYAAAAfRoAFAMAH9Ag0NCppz8PX3Uq1D8aPtz2CqWofYvUD/P129yDr+ZRjf/o6Xqw32Qlu44hy8HNFywKcfE6USEw56af6fDmFT0dI0ug2kWLTHn9CmbX8aGrF6dSKBgoaEs1P4n6qYPvF77OVvcNXAfVkPete0skUWwvc1wSRXyfxFa2ePZDoHsLMgZ0R4YYGFfpaNHRqVvbt64Qx0WIBW7NgIp5DlKN7F5eHEBKnGdqpdhGKJDsFsXp/VouVPWtAl9VhZeuR4l1k89G9U0tsLUy/d/ZpWbyxxwrcLEbvviKY4zQ7C1ui9LtHGOMN8hro7FEynyQP7yHTx59rbfoy6gz0dOIuwkRdgUvFQy0Pevz0SSvSPz62Wmdh0SxtTz6d5L1t0T0VoZlNNCX5pntL3x+9vr/2GHavty57TNj97HO3X4lLL1qcImjPQa918nt4BnQ/JV9WA8dcDx3dpiR76r5aagFYtt/9e62y3e+yP57We6VhrK4S2ntmYaz33+Xdr4NNdDF8BQDAb4IACwCAD7APwzGxMaemphIf+u+2BuYl5BqbaJCzRciVtUtKD3bTtaUREy76VRZO6eTSWIXVOcd62gytkn5dlFibEeFNnFQX0yS/xdSK/cPe1wmIv/R9YgGVT4vN09t0LXDEIYnHCixu0lMEFnGq4Fir8Bf2PwAAIABJREFUY93CL4n1rCS3+RM81NNT9+S81uMY63VJhEXJsrAo3NaQR/+5ZiJHzENliQL5bMHcXD/0jiSfhNN/Nl+LTTNJlML3bBNIPb6+xel8+pxzS/YcNLjcarYgs9yje2n2TMVUl5aH6+VtGlxmfx6z+NtW+IqfDmnTZsODkRSTahZe6tekSwgkERxFYPrhkFJfR5rv+Yjnc6xeLkuGxlj36LfeW+VPuD/9Xkm/+tx9QvBybS89a17i7+uoxU4ezO9+VyWmrywy1ZBU750qUvPZhTZ/B+cBASk66DRo1FVNXTHc9+f5gFG2pZN7JQ4r0ElAnYxrfZ+t7wAA4CsRYAEA8AE3n5gZOg2y3zcp+8NP5lun1CWbutD1Ig0R9KTBvBX58vZlfX7VaZbbuNuK2Ig1rnVCmnVbeY9Tnl1Bl96oHKfc+cl7TVpJ9vXWOaXPYRVhf9vUSi3RJ/Qnfp+XkedYn+xyxJqkTplp0rPCoPgI74XzseIVR/qtME7Xs47du4XmCuLloDorAbcptyMmmLxDrEdwMaTH9JP3W+mkk63dzUmrFMHX+YiXvqVjFav7hJxPdmkgo2t0IjGJpSHRONZ1HjFltbcZHM3VtUtmoYNUvViIJel9F5hde70f7Gn9zQdJ8/n5XzfRt9HeI72X2oiet9jj635/pjid8GvvrT4b037tMYYfSjDf259fC/zTrq0NsNnJg32VtKV1ymNfX6vBl56eqeGZdnbZumAcupDKnOyLEE28yP0aYlv/mL8sC6pHGlHifx6AAAAAvh4BFgAAHzA/sHo4ldbf2wfhPtYpaznWyfb2sGmgenuxMKK3IfWWrOxd1wq7zCLrOeVR5Bg/DB9mHuNrXDqNoo/11t+k2JKZl1u7b59a0YkUsVW68cFpl2YBlhaAyzEnyXyNLc+wIJ7bDBRq3uz55dWZle0kRru+cjmhUOaJcMOCCluX7MlCQA105qlyc+rJVrf0tc++rTnENifLIqzzCThPS35qcsd+fj9WAPFzP9+6sVr70eqaBWMRgM0QbgVg8dzm/WLX5xh/40HSu9W6nM9prjIDLf+eY/RYUUz+Z7/BRJRnPelXHuP8vZorlj/13P/Ua7tV76cq+n7pY+t0lK6ajijv11NC9TWmdPntSTZNZ89F/Pk0m6iaa5W+slnLOfHmXVpJtNbrdrvJbbullNK9lJwSs1cAAHwzTiEEAOADnrqaNrwHq1tRu1gP1eQdP907sjQI0VP2Lv9cy9y1FFonOzS0yTFpNdcE+/ACaZ3m2C1EaLaqZJ1Y+q9S5MvjKW+Ph/35oT8p+wfpucLo/MP/flzXAuXHUys/cTqgBiR2+t/42PcVK/z2tbUVgjw9HLEQpUepePQeXU+LK3EC3JpSe3dCoa/9nSfCnWFhjuDBJtWKT8j4aYqyJuJSTINp0XaJyR0LvNL5P4N++YTEn//5FoCl+XrPyS471dEm2TxQ8fJw76+yPq54bhqf1Vhn8xP2ohA/giQ9/VF/5vrz8esn7s0gyU7Isw6weU1+/Pwkiuav7+/szWpzaki/P13vga+/t6T/6Y/hQZZEofrHr+2IfjoLleZP1T+/nPLY5uRanCaqRe7X0qrkzf3+13q/pfhdHc3eOwvVNBBrXvivq4rz9MaqPW7VwuaspzsCAIBvQ4AFAMAH/Ad//x/NqZRjjLHrRMecffJj9w+pm0VSFshoaFK3m68Bxlqb2GTWbgXguqoksdKkYZQ+hn6Y1g/V87+k5wfy57HL8/mwP/OpryZx7J5ozKKn/3nZdopVJ/+gP6dWRpzq56HG+6kV/VeKiSQLgb7m+y4F8x8OQWIFUaJnbE4Z6XWyk+viYpQIi1pcN4kusrnS5dNxZ8hkocLm0zpacN5ixU8ikJhBj7+OtH6+RFeTTgf91M8/J97O1/vRAEwf8rbpe5asyeq6zvZV1/CDYaM9Pz1dME7Ss9XVc8suJsPi2s6Aro9vu7dyWlNYv/QYl7vf//UV4aL97tUi1/KpueKrp4WmnNeEWJ7rlN0vQFm3sp0uYO97jdMgdeJNf781zLptfopisTCxyOvrq7xaSO33k/4cuyd/cL8AAICPI8ACAOCD3uSQvUZZeXz4vWlHjn1M1lPyqty2Te7b3crbs57O93xY4DRPtNOwYW9Peban7P2QvbU4hS/Lbbvb9+uH9uITHPLcn9L0VDnLIZIFXfaBPrqR5jqjfUCfJ+B9cGrFg4qvm3aZ2vj2EKRGmXqKAnl7/AhE/Gf59Ju9+JiAmScUyizTt2zLu7JupcqmzzN3+zMNNWYJf7F+I5+q8Z/tQVi+TADZ32tYoY938zr5HE/oawKw+dyqTelUnxIq2UOV/8+CJL9H7BqVLd7bdhbYlxL9ZbJW96xfLP38NNev3SNprgTOe/eXHkP6mr4aUQKWYuLul66tfYeW4uv7Vf330Dqxupeu51kkrz1y9Zxa3IcdkSi7TcPFwQX6OlYY6PdI2ryD7n7fZMseZH16fbWDFbJOw5Ust/vNfna4p3lQAQAA+Cb8tykAAB+kYYaWkevJfzXnNWnV40O1Tszcbzdb67NTzLT7SpofmFeTdzvVmx3Hr71W80OyBRV59jaJ3HVyy7aV/O818MhaLH45lt+X0LqfuNcPCzaSBRbFJ7n+xJW8Nf2TPzbtMr9vqx5S/GYhSAQY3qnkE1k5p7Wul7yUyVc5ZazgTSdnbrVYcbaGUXcNieLUSD0d8vai132T+22Tm5bwV1/10q97uW3y+voin19fLKB4fb3L/eUurxpIbFVuL3d7TO1G2uJnbBZOyOr5Witv61/n/9iy11P867UBLM8psAggb7bi+Btew18IkiZ7PyPlyrFopwHf7Tdct5z3yJgrgfOkv/Trj2GdX3M18noKZUrr98ADv76ulV5j7aDyjqwzCdxKWSGn/v5q8X+ygDjLS6k2RaV/Vle5fQxg2aTaw+4BXenUx8zD13b1qR3H0++vslkYaNOXtcjry11f30PXgfUe/B/+u/+W/6gFAOAbsJAPAMAH6YftR/NCap3SuOciR6xzpVKl70+LVXSlyLqYNPDairy9vdmJbx4yDfn08moR1JcvX6Rud+s26rtPlViAEKfo6edonSK6rtnJmKFDhAPxEsYlDNM5phEf7GdZt67keV+UDY1YIOP9TWKhjKYrwzq8mqwj1exUweZrjfX6fUP2/SlJA5Jy86AmThfUEER7rfTkPv3esdYTXYrG9R8GGHIJMI4ohk9bkjLm5FKJf54sdplTUiN6tWyiqnpwaCtiegJcrKxpqJC7v0/6YHUrdn21MF2DwW4F6cnCHi3+tmDw6FHg7mlJqdsZyOhz1RPx+rkaeotSbw/gvAjfe848CPGiekumIuw600gN3zRQm+/5b30N1wmVxRf0NIuxcGucJ/vNZ6NrieskwwjabCJQn3dOtsJ5LZL/4T2SZwfZiIBJfFLt/ffOR//px5B+hmozIJxTd1a6r6de6vXR566TT9tm01G+zudTZTqdV6L3KsUaoE2t6dqfrpVGgb2dVKidYfbEfT1X37sav2/H4dNttpI4/MgADcR0e7NFQJUt2MxWCK/36cv97mXz+p8LrSfZD6rcAQD4BgRYAAB80LuOoShuVzp1pR+yH29v9oG41msnlK6obfJ8PC2gsEGnOB1PP+zO/qJk01m+rmQTNDrtkf3rZq9WikDGe3ssurmcoNYsqLESa/3COFlOP+yXOAnQ1p2Sf9DvsXJY7QO/r2p1DR5a9AHZaXLJT0GMw/xK8TL5NMvLxSdfRvYwR19K+g1CEAswclrXSZ9jH3oqX7EpOP/eGkHJkJkjSQRdc3JHr4dO9uggm5Zsr+tgr0UnjXpMGnlpeloH22XxTu8Uq2weZOl7kOMWWO9bnNrX+jlJpytl2cIu+0PxK+7BS8rewZSjgF1Pp7SVvtRlu1XZD5/A+i2uoYV6UZ5vZf9xT+gF0ZMO7eX1mQ11C3SsCF5ihTVONlwF5inF5Fbz5xPXfMQ5A3av66mS3YM7mdNXP/je+YZ5sOfX3EI6vdb2mseaGLOfPSfRigdZOdZeS6ybagCby5zuGh5OHc2CqbleO8v8/TTHImWun9oZAx4Qtyj91yBKQ0H/nUkW1trP0P+LtURbH95e7OclWyXdbH1wdPvZ4+XT9njZbi2lNPSeBAAAX48ACwCAD9IPvLVuraWHfoAd+mFYC9bFeo2KrRr5h+FqfUn+AXlI0g6skqU/HlJ1xbDe5N6bHE/twPI1QQ81aoRDGkB5tpBHtikPC0es5Lp7Kbl9+C+rK8gmRmIaqBf/M/0QXrayOqU0MNAC+edxSM4+iWKhlOUkyVbs+uHTPL0dkrqWlnuQlvTrIzSyKaSR11SYroxlT+Z8s02fZRGJZxvPJVmI5ImchhmHTQJZ7lDO8ED/z6bQdFUvn31EKdeYZvIgyAK97FNTvm6WL51cY004Xf/cw61sK3c5H76Sp71JNa7xZcpJp+Lm1/bof5+hU7aCdS/zPixYS9alVC1Qqd71ZD+7eAhkoaT//YgeMzl8VfLQMCSmqPR56M98PJ8WvInInxwkdQs0vevJ1uriOt2sb6tYyKavVdcMdcrs0Ik/zbKS30srutNrm+J+05+RfKJriAd8FtCugnWfKPt09/U5ewYahOm17IdNfumpnHoj2WvXaSedNoy3aa016vMsM+Tp9n36c469WfinK5uacGmvWbnf4iCDHu9rexcsz2DRA80eoaHYz9brp0GT/fv97oGdTh1aaNgsZpRYD8zxfEr8Tuvvga1Y1mq9dZtNWfnUYYrfW/1d03teWh9b2f7w8vLSaynj3/+rv89/1AIA8A0IsAAA+KD22KUmaUet34tOeSQ/Fc+CnCby+eWzfHl+sQ/ROcIYqR6K2Ife2/3sI9Li8FuV0qqfOBchz1xa0w/LOhW0VgMjvLBz63Q9ro1VXu2LTRHmjFgpk75OFvSkIdtEiv4vgJt90PdgS4On2cVlz1mfr2Y7pVq4kaPY2kKjCMJWv1ZMfDWdTNKwQsOmIqtQvkdpt63e6QRM9jUsK+DefPrMTuXTIM1fpYUg1vmlK2L7bguNutZV4xS5Hv9ci/L1eWgIcczxKz2QUVfFrBPM/3pPu60HamiY56mPGrL02bXlQdywUMu7tnwlcq6ebdJziS4nX6O0tbS4dSzs2fSa5rie0aMk/rr1mzT409XMPC6rcf5FUkd0W0XodtPH1kkhLwHzdUSbbpun2UVYE0GSBXsRatl6nU4UNX1twybXrP9Jn5deFz0MIMV7Xfx16mEDfv9JTImd00J5riuKT1N5aGRxm1/u7rGZTizVW/FS+ewBnYeaOcrSfWJv6H1pU3CHnxgYxeqbrQCWWGf0KSkZzcr37Xchur90sqzGNW5z+mtol1yLECoCTv2aUuL+zBHW2RiercB6d121WO5pa4g66RXhcQSHOsVlj6FTiskn0vT7tGOrv73ZX+vz1CDs5X7za9xFbvc6tq22WssfLB+8HHQAAAC+DgEWAAAfNMYYueTvXm73/+uPb49/V4amC/4hvafdVrReby/y5flmIcIWJ81pKfuXtzd5PL6XT58/WbBS3x7yoiHMLdtR+xY89MNOHNT+ImnFgoERSUfOl//qTl44bcGLrgWOLs89Jk9sGmxb/0XvJxz6pJP/1bDwIkVRd4mVRP9rsUCk1GaTRJOFN33E5NWwqZQyT9/TSaV8SO+7hXn6mjVM0+AnxQqZBh1z3dImmh5PqcPDmchCPCzatrXupR1TLZ53jj/X62txXPFT33wFLcst32yCxgIFndwSn6LRSa7HY06J7b42qRM42nmU6gpYLFx7ua3X2yLQs24sC5B6TCD5c7vf72vl7vl8ru/rsTZo62fxuu20Qn1OtURoNgNMDfmqNA1zmq4hSvQveTD46fVuYVKzdT8N/TzIsmsQq4E9utGsvF0n/GzCbvef28u65jr9p49cSgRxo50nV+q16WOV5nt4GKN0w09ulLgHjrb7qmXxNTsr0o96Jwt6dLLr2CVbofy2Tsy06yFxUqJOQ5VNxnFYv5T1T1lQmGV/Njna0/ujUrHQz2//4Sc+2p/76q6d2uglXtYLpz9/xDqpHy7goZidF1jFJuU2/X69d2zlsnk4qf1we7MksdiJjTMQ84mzkiJQFl/x1PdD34Pn8+GnSKYkL9tNRtXDAe7y6fWT3O+3P/be/8VxHMftvK0AAMBXIsACAOCDWj9Gzi/fjdH/VxH5u633f6uUkm1ixKZhfMVIg5jH/vRpGVsTOyws+N3vPlsos+/7GWTYiXmb9L3JcWQZNa9pHg+I/Dn25kGJVUXr1E/tMrt17EN1GjYlYhM3MXWjpdVH6hbk6JSL/n2fH8z1e6PEex6XZ2uM1udTPEiJdUYN1KzkXCd1Dl9Ds5MWk3c5HXuWXad5NLTSAvKUIzwZ8nzuZ5Bia2m6BqZdW4eta41YdxNdddM1zNvdQpijx8RV73ZNrc+q9Vh0k9X/VGv0IBVPCmbYpsHFXK200+buN5tA0seZz1PDFu2cqsnfO51O0u/VwNH6m7Zh1yPHZJz/AFkdZWNcyvXF1wGfj4elHnqNtMA/x2Pre+P3idhpkzPcEivpPyS1sVY9NSip280nuNqw/iUN6vx+8TXDWzyehp92Kp6VwDebFuvDv8cn1HzazGbcisj333/vIVsust02CwPvUYZlk3h6yyYPc8ROdtzidMRuE3SHeICj1/voPr2k79P9Xm219dg12NHXODx8tFMxkwVwZUu+g6huN3tu+rtwu1V5ef0sf2x/lO+//6MFQUkDqJrkVu++mqcTUmVOFHpwpWuH+uuxi3eczX4ziUBt0t/He775td2q3ZP6+yYWkPlqovbJaTdY0Um9oa+v+0mVURbfNGyzUz59mm57/eTBcxZ5HBpGb/K63cbvf/e7vff+f0vr/3up+utHfzsAAN+KAAsAgA/SAOFtf34vIv/zyPnf6Un+7pDxb+Za6pCW9v6UbbvL5/tn+Z1N/Rzy3ZfvpT9EPn/6LI/HU748H1ZIXu2EvWKRlK1l1WRTOBZoJF8Dk/ggbpMmzQu6pc9Jqy1Wx7RbSHerfAJJ/+zz509WKG/dXLVaD5JER9KWq69qDZ9keXuLMEUfK6ahqoUhXuZuU0PdW7p13ezlPk9DTFFnlSxsud/uq7/Lwo4InzQE0+dlpemxcqh/rmtdGgDo1JA+lE2UaefS4X1W2yzlnj1b7XLqok4ORaiUY5LJStpL8bL8dKy+rtf73YZ0HvvDQpZa7la6f2TvxCp5dpD5ymeeRecRPNiUVpxuqHTS7bAOMQ9Mihav69pZfL2GcJpqvL6+iKyTIbOtz1XLXZrc5CZjb/J4PnzdNKak/NTIEl1lh13frd5iPdBfs3ZZdSvhz/azNXTJcYJiXBq79hoO2cSUhY5d6s3XCf/i939h/WYjTlZcq5Bl87U/8T63ait18/ej2nSdPiedvrP3PGebRFt0NW8T+VSSBYV6ffY4rbFKdK1pyHnbZH8+ZNte5C//8pM8Hg+/b0eX33/+JJ8/v1qBvZ8Y6J1cPnen99RmL1Cvwf3lRT5/+iTfWSDn3Vs6DacrfiUOLpjh4qZhWY9yeH19xUM+C3T74RNiwzvNJE4y1FDLvl9/V/bdThnUIC/fi93v333/xb5uZJ9yzDmPbdv2mvP/82jtf8yS/49SSqO/HQCAb0eABQDAB1ln8xit9/5/Vkn/heTyv7Us/17v/d8WkU8vt1vVonUPkvxD9IvuEGnpeh/yzIfcyk1uL/5fw2+PpxVV20RM9VXD+aF7rqfpdNLr5mtvfkKcmx+2W5xMqAGBTVztuzy//+LBwTwxsPUogZ/rb80+8Gsc9OnT3X72rd5skkunhfQ5v7x6CLYfh08ORZdRiudnnVujx59nC3DKOsnNAzgNn7oGHTmvXiw77XAMex7ZwjcP5OaJeyO6u2p8j8Y1ujqnr61cro0GElucepdjDc2K3+0kuG59U7oOp6toGhTp11eb5KoWXqVYm9PpNN1rq9nXy6zw/Gg2SWUrejaxdbMpud2COA3dNgv4dHrIQoyXsTqRWpxuV8p5Ap5E19aI8EkDE32O+v1WJG4DaBE6HXt0QPn1TLXEel9dxfW2vmh9V5pC3nw1MLrKZtF9iwkxKyT/QQ9Tj9P9bL3T1u6GdW95SBgBaaxLzpMwtWtqVL9v52uxgGmkuNe956rnTYb2u6W7B5SxNtl908/Ctj4PJei7vG46dajvs5fGv2m4Vbywv9o931ZnlYZTs2hfH1PvdQ3lihWqZ7ndX/xUyngPUtxD9r4cx1pRLTGh6P/Mg0g7KzLCSp3Qs6+xa6WJYLKpOH2GepvqBJbopKFOsCVLqI6y1X+dS/7n33358r9s2/Y/1Vr+pX77P/gn/zH/MQsAwDeiURIA8LfK9SSyv0n/yX/0D3USJbf9qL2PT7213+/78Re9HfecS3RyW5hQddVKQ4nH402+vD1WX5KVULfDVpmaro7pGmHy0//m2Muw1a9mkzc9+qnEwo/i/y1e/IS7I9bScvQbaXBlAUWZkytjhUp2YF1vsrfdSq814NKQZ7MP9t4hlOKIuJfXl7im/hg9zVP9xEvYbSgo+UmDEYjMVUELUGJNTsSnwFJ0E404dW6eZujreMNeixXKXyaJZu+Vve48r4uvzc1AbMSkW5uBSwQT/tizM8pDmFkG7gHRvEn8OczT9+7RAaXXx9cE/XntcZ31a/TJjvXdI6Z78urA8mvw/iYcUUa/24TZ8Pdx/jN9rhpt2Wv3tURbz4zT/qykf3a353O91KfAmndkZZ9Ss5MEU7Fgzgrt227P3dYd18+zJMn+Xk/R1IkpDzTP3yP92Rrm3LZbhHN7TAvG64s1yvk/KTc7EbJb+Kd/XiMgs8MK9d7W9cboUbuuXc733A4NiIk/Xbndn/G87OTPamGRTtrdXu7+3sR11ukyn/Ar3gkXk1UtytjzWl/NHm7O0y7jXmx6Euj+lL0fth748vJiE1t1BsTakfV8ysvrq7zoxNmadvPrn0vRH3T87i9///g7/8Zf/qG1/tf3+/27+8v9qLWO//Cf/qf/v/zHLOXxAIC/TZjAAgDgK/xn//l/Jf/kH/49zWz0E/2/Tin9dc459WGpgk3S6If41nU65MUmaMa4Wdl63XwCST90zyP9ZwCQ0nnimwc9HsLk4SHJXPm7lTP4sAmSCI982kTi1ENdnxoWAugT9fLxqHCPIERDghLfM+L0Ol/vG3Ha2mYBl4iv2h0WCLUIAcSKrq0QuxSb0tJT/KyUPXmgk2QGUNUDLD0Nzla2PEiydUh9/hKh1vCAyCaSur9u68yKoGueWDdfva//eRBioV1Mbdnf22mMzZ6vJA/Q1vWKKSkNQzS4q1oG370XTNcXWzwPm+JpcXpiKe/CNbkEbDYdphNt0Vs24nvbPH0xSsxH8tCuRFDZbcXviNMF/f3yaayxCsktpBoS4aB3fNnpjnKWo8/VRqk1Qi0vd7fJpyERXnVbG5RLADmfm67j2XUbZ6g0IgSVy6Rfb7e1XjnXQMWCKw8R7TTOOBFzFv5LH6sQfwYq3VYaNUQ97NrPzjX1sPVa/d675N+fnWEWYkWPm66KPh+7/Y7Z5KIWTXV/fXMC0INYOXvL9Of36++WrxxKrMvexj3SXQ+6bjEJqRNe+ucaXunPt4srI66DTldu9nV3C722EaulXddEc06jr5MjAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/9gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD82QMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwZw8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAnz0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzCI+CAAABiklEQVQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/NkDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8GcPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwJ89AAAAAAAAAAAAAAAAAAAAAAAAAADwt5OI/L9p7T5ine/BigAAAABJRU5ErkJggg=="}