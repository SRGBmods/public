export function Name() { return "Asus ROG Balteus Qi"; }
export function VendorId() { return 0x0B05; }
export function Documentation(){ return "troubleshooting/asus"; }
export function ProductId() { return 0x1890; }
export function Publisher() { return "WhirlwindFX"; }
export function Size() { return [8, 11]; }
export function DefaultPosition(){return [240, 120];}
export function DefaultScale(){return 8.0;}
export function ControllableParameters(){
	return [
		{"property":"shutdownColor", "group":"lighting", "label":"Shutdown Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
		{"property":"LightingMode", "group":"lighting", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
		{"property":"forcedColor", "group":"lighting", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
	];
}

let vLedNames = [ "Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5", "Zone 6", "Zone 7", "ROG Logo", "Zone 9", "Zone 10", "Zone 11", "Zone 12", "Zone 13", "Zone 14", "Zone 15", ];

let vLedPositions = [ [1, 2], [1, 4], [1, 6], [1, 8], [1, 10], [3, 10], [5, 10], [7, 10], [7, 8], [7, 6], [7, 4], [7, 2], [7, 0], [5, 0], [3, 0], ];

export function LedNames() {
	return vLedNames;
}

export function LedPositions() {
	return vLedPositions;
}

export function Initialize() {

}

export function Render() {
	sendZone();
}

export function Shutdown() {
	sendZone(true);
}

function sendZone(shutdown = false) {
	let packet = [];
	packet[0x00] = 0xee;
	packet[0x01] = 0xC0;
	packet[0x02] = 0x81;
	packet[0x03] = 0x00;

	for(let iIdx = 0; iIdx < 15; iIdx++) {
		let iPxX = vLedPositions[iIdx][0];
		let iPxY = vLedPositions[iIdx][1];
		var color;

		if(shutdown) {
			color = hexToRgb(shutdownColor);
		} else if (LightingMode === "Forced") {
			color = hexToRgb(forcedColor);
		} else {
			color = device.color(iPxX, iPxY);
		}

		let iLedIdx = 5 + iIdx * 4;
		packet[iLedIdx] = 0x00;
		packet[iLedIdx+1] = color[0];
		packet[iLedIdx+2] = color[1];
		packet[iLedIdx+3] = color[2];
	}

	device.write(packet, 65);
}

export function Validate(endpoint) {
	return endpoint.interface === -1 && endpoint.usage === 0x0001;
}

function hexToRgb(hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	let colors = [];
	colors[0] = parseInt(result[1], 16);
	colors[1] = parseInt(result[2], 16);
	colors[2] = parseInt(result[3], 16);

	return colors;
}