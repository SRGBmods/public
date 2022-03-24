export function Name() { return "Asus ROG Falchion"; }
export function VendorId() { return 0x0B05; }
export function ProductId() { return 0x193E; }
export function Publisher() { return "WhirlwindFX"; }
export function Size() { return [15, 6]; }
export function DefaultPosition(){return [240, 120];}
export function DefaultScale(){return 8.0;}
export function ControllableParameters(){
	return [
		{"property":"shutdownColor", "label":"Shutdown Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
		{"property":"LightingMode", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
		{"property":"forcedColor", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
	];
}

let vKeys = [
	0, 8,  16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112,
	1, 9,  17, 25, 33, 41, 49, 57, 65, 73, 81, 89, 97, 105, 113,
	2, 10, 18, 26, 34, 42, 50, 58, 66, 74, 82, 90,     106, 114,
	3, 19, 27, 35, 43, 51, 59, 67, 75, 83, 91, 99,     107, 115,
	4, 12, 20,         52,         76, 84, 92,     100, 108, 116,
];

let vKeyNames = [
	"Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-_", "=+", "Backspace",   "Insert",
	"Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\",            "Del",
	"CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter",         "Page Up",
	"Left Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Right Shift", "Up Arrow", "Page Down",
	"Left Ctrl", "Left Win", "Left Alt", "Space", "Right Alt", "Fn", "Right Ctrl",  "Left Arrow", "Down Arrow", "Right Arrow",
];

let vKeyPositions = [
	[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0],           //15
	[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1], [10, 1], [11, 1], [12, 1], [13, 1], [14, 1],           //15
	[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2], [11, 2], [12, 2], [13, 2],                   //14
	[0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3], [10, 3], [11, 3], [12, 3], [13, 3],                   //14
	[0, 5], [1, 5], [2, 5],                      [6, 5],               [9, 4], [10, 5], [11, 5], [12, 5], [13, 5], [14, 5],           //10

];

export function LedNames() {
	return vKeyNames;
}

export function LedPositions() {
	return vKeyPositions;
}

export function Initialize() {

}

export function Shutdown() {
// revert to rainbow mode
	sendPacketString("00 51 2C 04 00 48 64 00 00 02 07 0E F5 00 FF 1D 00 06 FF 2B 00 FA FF 39 01 FF 00 48 FF F6 00 56 FF 78 07 64 FF 00 0D", 65);
	sendPacketString("00 50 55", 65);
}

export function Render() {
	sendColors();
}

function sendColors(shutdown = false) {
	let RGBData = new Array(600).fill(255);
	let TotalLedCount = 144;

	for(let iIdx = 0; iIdx < vKeys.length; iIdx++) {
		let iPxX = vKeyPositions[iIdx][0];
		let iPxY = vKeyPositions[iIdx][1];
		var col;

		if(shutdown){
			col = hexToRgb(shutdownColor);
		}else if (LightingMode === "Forced") {
			col = hexToRgb(forcedColor);
		}else{
			col = device.color(iPxX, iPxY);
		}

		RGBData[iIdx * 4 + 0] = vKeys[iIdx];
		RGBData[iIdx * 4 + 1] = col[0];
		RGBData[iIdx * 4 + 2] = col[1];
		RGBData[iIdx * 4 + 3] = col[2];
		//TotalLedCount++;
	}

	let packetCount = 0;

	while(TotalLedCount > 0){
		let ledsToSend = TotalLedCount >= 15 ? 15 : TotalLedCount;

		let packet = [];
		packet[0] = 0x00;
		packet[1] = 0xC0;
		packet[2] = 0x81;
		packet[3] = 0x90 - (0x0F * packetCount++);
		packet[4] = 0x00;
		packet = packet.concat(RGBData.splice(0, ledsToSend*4));
		device.write(packet, 65);
		//device.read(packet,65)
		TotalLedCount -= ledsToSend;
	}
}

export function Validate(endpoint) {
	return endpoint.interface === 1;
}

function sendPacketString(string, size){

	let packet= [];
	let data = string.split(' ');

	for(let i = 0; i < data.length; i++){
		packet[i] =parseInt(data[i], 16);//.toString(16)
	}

	device.write(packet, size);
}

function hexToRgb(hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	let colors = [];
	colors[0] = parseInt(result[1], 16);
	colors[1] = parseInt(result[2], 16);
	colors[2] = parseInt(result[3], 16);

	return colors;
}