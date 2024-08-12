export function Name() { return "Elgato Streamdeck Mini"; }
export function VendorId() { return 0x0fd9; }
export function ProductId() { return 0x0063; }
export function Publisher() { return "WhirlwindFX"; }
export function DeviceType() { return "other"; }
export function Size() { return [91, 61]; }
export function DefaultPosition(){return [240, 120];}
export function DefaultScale(){return 8.0;}
/* global
hwresetdevice:readonly
buttontimeout:readonly
hwbrightness:readonly
shutdownColor:readonly
LightingMode:readonly
forcedColor:readonly
*/
export function ControllableParameters()
{
	return [
		{"property":"hwresetdevice", "label":"Reset Device", "type":"boolean", "default":"false"},
		{"property":"buttontimeout", "group":"", "label":"Button Press Timeout", "step":"1", "type":"number", "min":"1", "max":"50", "default":"5"},
		{"property":"hwbrightness", "group":"", "label":"Hardware Brightness", "step":"1", "type":"number", "min":"1", "max":"100", "default":"25"},
		{"property":"shutdownColor", "group":"lighting", "label":"Shutdown Color", "min":"0", "max":"360", "type":"color", "default":"#009bde"},
		{"property":"LightingMode", "group":"lighting", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
		{"property":"forcedColor", "group":"lighting", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"#009bde"},
		{"property":"elgatoFriendly", "label":"Elgato Friendly Mode", "type":"boolean", "default":"false"},
	];
}

const vLedNames = [ "LED 1", "LED 2", "LED 3", "LED 4", "LED 5", "LED 6" ];
const vLedPositions =
[
	[0, 0], [1, 0], [2, 0],
	[0, 1], [1, 1], [2, 1],
];

const ButtonSize = 30;

export function LedNames()
{
	return vLedNames;
}

export function LedPositions()
{
	return vLedPositions;
}

export function Initialize()
{
	if(elgatoFriendly) {
        device.setSize([3, 2]);
    } else {
        device.setSize([91, 61]);
    }
	setBrightness();
	lastButtonRGB = Array.from(Array(vLedNames.length), () => Array(3).fill(0));
}

export function Render()
{
	if(elgatoFriendly) {
		colorgrabberSingle();
	} else {
		colorgrabber();
	}

}

export function Shutdown() {
	colorgrabberSingle(true);
}

export function onhwresetdeviceChanged()
{
	resetDevice();
}

export function onelgatoFriendlyChanged()
{
    if(elgatoFriendly) {
        device.setSize([3, 2]);
    } else {
        device.setSize([91, 61]);
    }
}

function resetDevice()
{
	device.send_report([0x0B, 0x63], 1024);
	setBrightness();
}

export function onhwbrightnessChanged()
{
	setBrightness();
}

function setBrightness()
{
	device.send_report([0x05, 0x55, 0xaa, 0xd1, 0x01, hwbrightness], 32);
}

function makeHexString(ColorArray) {
	let hexstring = "#";
	hexstring += decimalToHex(ColorArray[0], 2);
	hexstring += decimalToHex(ColorArray[1], 2);
	hexstring += decimalToHex(ColorArray[2], 2);

	return hexstring;
}

function decimalToHex(d, padding) {
	let hex = Number(d).toString(16);
	padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

	while (hex.length < padding) {
		hex = "0" + hex;
	}

	return hex;
}
let lastButtonRGB;

function colorgrabberSingle(shutdown = false) {
	for(let iIdx = 0; iIdx < vLedNames.length; iIdx++) {
		let RGBData = [];
		const iPxX = vLedPositions[iIdx][0];
		const iPxY = vLedPositions[iIdx][1];
		let color;

		if(shutdown) {
			color = hexToRgb(shutdownColor);
		} else if (LightingMode === "Forced") {
			color = hexToRgb(forcedColor);
		} else {
			color = device.color(iPxX, iPxY);
		}

		if(lastButtonRGB[iIdx][0] !== color[0] || lastButtonRGB[iIdx][1] !== color[1] || lastButtonRGB[iIdx][2] !== color[2]) {
			lastButtonRGB[iIdx][0] = color[0];
			lastButtonRGB[iIdx][1] = color[1];
			lastButtonRGB[iIdx][2] = color[2];

			const buttoncolor = makeHexString(color);

			RGBData = device.ConvertColorToImageBuffer(buttoncolor, 80, 80, "BMP");

			let BytesLeft = RGBData.length;
			let packetsSent = 0;
	
			while(BytesLeft > 0) {
				const BytesToSend = Math.min(1008, BytesLeft);
	
				if(BytesToSend < 1008) {
					sendZone(iIdx, RGBData.splice(0, BytesLeft), packetsSent, 0x01);
				} else {
					sendZone(iIdx, RGBData.splice(0, BytesToSend), packetsSent, 0x00);
				}
	
				BytesLeft -= BytesToSend;
				packetsSent++;
			}
		}
	}
}

function colorgrabber() {
	for(let iIdx = 0; iIdx < vLedNames.length; iIdx++) {
		let RGBData = [];

		const iXoffset = (iIdx % 3) * ButtonSize;
		const iYoffset = Math.floor(iIdx / 3) * ButtonSize;

		RGBData = device.getImageBuffer(iXoffset, iYoffset, ButtonSize, ButtonSize, {flipV: true, outputWidth: 80, outputHeight: 80, format: "BMP"});


		let BytesLeft = RGBData.length;
		let packetsSent = 0;

		

		while(BytesLeft > 0) {
			const BytesToSend = Math.min(1008, BytesLeft);

			if(BytesToSend < 1008) {
				sendZone(iIdx, RGBData.splice(0, BytesLeft), packetsSent, 0x01);
			} else {
				sendZone(iIdx, RGBData.splice(0, BytesToSend), packetsSent, 0x00);
			}

			BytesLeft -= BytesToSend;
			packetsSent++;
		}
	}
}



function sendZone(iIdx, rgbdata, packetsSent, finalPacket) {
	const packet = [0x02, 0x01, packetsSent, 0x00, finalPacket, iIdx + 1, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00].concat(rgbdata)
	device.write(packet, 1024);
}

function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	const colors = [];
	colors[0] = parseInt(result[1], 16);
	colors[1] = parseInt(result[2], 16);
	colors[2] = parseInt(result[3], 16);

	return colors;
}

export function Validate(endpoint)
{
	return endpoint.interface === 0;
}