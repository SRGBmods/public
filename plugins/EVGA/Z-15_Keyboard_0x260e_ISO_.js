export function Name() { return "EVGA Z15 Keyboard"; }
export function VendorId() { return 0x3842; }
export function ProductId() { return 0x260E; }
export function Publisher() { return "WhirlwindFX"; }
export function Documentation(){ return "troubleshooting/evga"; }
export function Size() { return [42, 12]; }
export function DefaultPosition(){return [30, 115];}
export function DefaultScale(){return 13.0;}
/* global
shutdownColor:readonly
LightingMode:readonly
forcedColor:readonly
*/
export function ControllableParameters(){
	return [
		{"property":"shutdownColor", "group":"lighting", "label":"Shutdown Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
		{"property":"LightingMode", "group":"lighting", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
		{"property":"forcedColor", "group":"lighting", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
	];
}

const vKeys =
[
	1,  2,  3,  4,  5,  6,  7,  8,  9,  10, 11, 12, 13,			14, 15, 16,	   18, 19, 20, 118,
	22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,		36, 37, 38,    39, 40, 41, 42,
	44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,		58, 59, 60,    61, 62, 63, 64,
	66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 119, 78,						   79, 80, 81,
	83, 120, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 		        96,		   98, 99, 100, 101,

	103, 104, 105,           106,         107, 108, 109, 110,	    111, 112, 113,   114, 115,
];
const vKeyNames =
[
	"Esc",     "F1", "F2", "F3", "F4",   "F5", "F6", "F7", "F8",    "F9", "F10", "F11", "F12",  "Print Screen", "Scroll Lock", "Pause Break",   "Rewind", "Pause", "Skip", "Mute",
	"`", "1",  "2", "3", "4", "5",  "6", "7", "8", "9", "0",  "-",   "+",  "Backspace",        "Insert",        "Home",     "Page Up",   "NumLock", "Num /", "Num *", "Num -",
	"Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\",                       "Del",         "End",   "Page Down",   "Num 7", "Num 8", "Num 9", "Num +",
	"CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "ISO_#", "Enter",                                                  		  "Num 4", "Num 5", "Num 6",
	"Left Shift","ISO_>", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Right Shift",                   	   "Up Arrow",                    "Num 1", "Num 2", "Num 3", "Num Enter",
	"Left Ctrl", "Left Win", "Left Alt", "Space", "Right Alt", "Fn", "Menu", "Right Ctrl",  "Left Arrow",  "Down Arrow", "Right Arrow",   "Num 0", "Num .",


];

const vKeyPositions =
[
	[0, 0], [3, 0], [5, 0], [8, 0], [10, 0], [12, 0], [14, 0], [16, 0], [18, 0], [21, 0], [24, 0], [25, 0], [26, 0],  		[28, 0], [30, 0], [32, 0],  [34, 0], [36, 0], [38, 0], [40, 0],
	[0, 2], [2, 2], [4, 2], [6, 2], [8, 2], [10, 2], [12, 2], [14, 2], [16, 2], [18, 2], [20, 2], [22, 2], [24, 2], [26, 2],  [28, 2], [30, 2], [32, 2],  [34, 2], [36, 2], [38, 2], [40, 2],
	[0, 4], [2, 4], [4, 4], [6, 4], [8, 4], [10, 4], [12, 4], [14, 4], [16, 4], [18, 4], [20, 4], [22, 4], [24, 4], [26, 4],  [28, 4], [30, 4], [32, 4],  [34, 4], [36, 4], [38, 4], [40, 4],
	[0, 6], [2, 6], [4, 6], [6, 6], [8, 6], [10, 6], [12, 6], [14, 6], [16, 6], [18, 6], [20, 6], [22, 6], [24, 6], [26, 6],			                        [34, 6], [36, 6], [38, 6],
	[0, 8], [2, 8], [4, 8], [6, 8], [8, 8], [10, 8], [12, 8], [14, 8], [16, 8], [18, 8], [20, 8], [22, 8], [24, 8],		                    [30, 8],         [34, 8], [36, 8], [38, 8], [40, 8],
	[0, 10], [2, 10], [4, 10],					[12, 10],				    [20, 10], [22, 10], [24, 10], [26, 10],  [28, 10], [30, 10], [32, 10],  [36, 10], [38, 10]
];


export function LedNames() 
{
	return vKeyNames;
}

export function LedPositions() 
{
	return vKeyPositions;
}

export function Initialize() 
{

}

export function Render() 
{
	sendPacket();

}

export function Shutdown() 
{
	sendPacket(true);
}

function sendPacket(shutdown = false) 
{

	let packet = [0x06, 0xEA, 0x02, 0x01, 0x00, 0x00, 0x00, 0x02];

	for(let iIdx = 0; iIdx < vKeys.length; iIdx++) 
	
	{
		let iPxX = vKeyPositions[iIdx][0];
		let iPxY = vKeyPositions[iIdx][1];
		var color;

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

		packet[vKeys[iIdx]*4 + 8] = 0xff;
		packet[vKeys[iIdx]*4 + 9] = color[0];
		packet[vKeys[iIdx]*4 + 10] = color[1];
		packet[vKeys[iIdx]*4 + 11] = color[2];
	}

	device.send_report(packet, 792);
	device.pause(1);
}

function hexToRgb(hex) 
{
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	let colors = [];
	colors[0] = parseInt(result[2], 16);
	colors[1] = parseInt(result[4], 16);
	colors[2] = parseInt(result[6], 16);

	return colors;
}

export function Validate(endpoint) 
{
	return endpoint.interface === 1 && endpoint.usage == 0x004b && endpoint.usage_page == 0x0008;
}
