export function Name() { return "Razer Ornata V3 X"; }
export function VendorId() { return 0x1532; }
export function ProductId() { return 0x0294; }
export function Publisher() { return "Orcus, Rafee"; }
export function Documentation() { return "troubleshooting/razer"; }
export function Size() { return [3, 3]; }
export function DefaultPosition(){return [240, 120];}
export function DefaultScale(){return 8.0;}
export function ControllableParameters(){
	return [
		{"property":"shutdownColor", "label":"Shutdown Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
		{"property":"LightingMode", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
		{"property":"forcedColor", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
	];
}

let vLedNames = [
	"Keyboard"
];

let vLedPositions = [
	[1, 1]
];

export function LedNames() {
	return vLedNames;
}

export function LedPositions() {
	return vLedPositions;
}

export function Initialize() {
}

export function Render() {
	SendColorPacket();
	device.pause(1);
}

export function Shutdown() {
	SendColorPacket(true);
}

function SendColorPacket(shutdown = false) {

	let packet = [];
	packet[2] = 0x1f;
	packet[6] = 0x08;
	packet[7] = 0x0f;
	packet[8] = 0x03;

	let iX = vLedPositions[0][0];
	let iY = vLedPositions[0][1];

	let color;

	if(shutdown){
		color = hexToRgb(shutdownColor);
	}
	else if (LightingMode === "Forced"){
		color = hexToRgb(forcedColor);
	}
	else{
		color = device.color(iX, iY);
	}

	packet[14] = color[0];
	packet[15] = color[1];
	packet[16] = color[2];

	packet[89] = CalculateCrc(packet);

	device.send_report(packet, 91);
}

function hexToRgb(hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	let colors = [];
	colors[0] = parseInt(result[1], 16);
	colors[1] = parseInt(result[2], 16);
	colors[2] = parseInt(result[3], 16);

	return colors;
}

function CalculateCrc(report) {
	let iCrc = 0;

	for (let iIdx = 3; iIdx < 89; iIdx++)
	{
		iCrc ^= report[iIdx];
	}
	return iCrc;
}

export function Validate(endpoint) {
	return endpoint.interface === 2;
}

export function Image() {
}