export function Name() { return "Elgato Stream Deck Plus"; }
export function VendorId() { return 0x0fd9; }
export function ProductId() { return 0x0084; }
export function Publisher() { return "WhirlwindFX"; }
export function Size() { return [241, 151]; }
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

const vLedNames = [ "LED 1", "LED 2", "LED 3", "LED 4", "LED 5", "LED 6", "LED 7", "LED 8", "Big Screen" ];
const vLedPositions =
[
	[0, 0], [1, 0], [2, 0], [3, 0],
	[0, 1], [1, 1], [2, 1], [3, 1],
	[0, 2]
];

const ButtonSize = 60;

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
	setBrightness();
	lastButtonRGB = Array.from(Array(vLedNames.length), () => Array(3).fill(0));
	if(elgatoFriendly) {
		device.setSize([8, 4]);
	} else {
		device.setSize([241, 151]);
	}
	//device.setFrameRateTarget(30)
}

export function onelgatoFriendlyChanged()
{
	if(elgatoFriendly) {
		device.setSize([8, 4]);
	} else {
		device.setSize([241, 151]);
	}
}

export function Render()
{
	if(elgatoFriendly) {
		colorgrabberSingle();
		bigScreenGrabberSingle();
	} else {
		colorgrabber();
		bigScreenGrabber();
	}

}

export function Shutdown() {
	colorgrabberSingle(true);
	bigScreenGrabberSingle(true);
}

export function onhwresetdeviceChanged()
{
	resetDevice();
}

function resetDevice()
{
	device.write([0x02], 1024);
	device.send_report([0x03, 0x02], 32);
	setBrightness();
}

export function onhwbrightnessChanged()
{
	setBrightness();
}

function setBrightness()
{
	device.send_report([0x03, 0x08, hwbrightness], 32);
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
	for(let iIdx = 0; iIdx < vLedNames.length - 1; iIdx++) {
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

			RGBData = device.ConvertColorToImageBuffer(buttoncolor, 120, 120, "JPEG");

			let BytesLeft = RGBData.length;
			let packetsSent = 0;
	
			while(BytesLeft > 0) {
				const BytesToSend = Math.min(1016, BytesLeft);
	
				if(BytesToSend < 1016) {
					sendZone(BytesLeft, iIdx, RGBData.splice(0, BytesLeft), packetsSent, 0x01);
				} else {
					sendZone(BytesToSend, iIdx, RGBData.splice(0, BytesToSend), packetsSent, 0x00);
				}
	
				BytesLeft -= BytesToSend;
				packetsSent++;
			}
		}
	}
}

function bigScreenGrabberSingle(shutdown = false) {
	let RGBData = [];
	const iPxX = vLedPositions[8][0];
	const iPxY = vLedPositions[8][1];
	let color;

	if(shutdown) {
		color = hexToRgb(shutdownColor);
	} else if (LightingMode === "Forced") {
		color = hexToRgb(forcedColor);
	} else {
		color = device.color(iPxX, iPxY);
	}

	if(lastButtonRGB[8][0] !== color[0] || lastButtonRGB[8][1] !== color[1] || lastButtonRGB[8][2] !== color[2]) {
		lastButtonRGB[8][0] = color[0];
		lastButtonRGB[8][1] = color[1];
		lastButtonRGB[8][2] = color[2];

		const buttoncolor = makeHexString(color);

		RGBData = device.ConvertColorToImageBuffer(buttoncolor, 800, 100, "JPEG");

		let BytesLeft = RGBData.length;
		let packetsSent = 0;

		while(BytesLeft > 0) {
			const BytesToSend = Math.min(1008, BytesLeft);

			if(BytesToSend < 1008) {
				sendBigScreen(BytesLeft, packetsSent, RGBData.splice(0, BytesLeft), 0x01);
			} else {
				sendBigScreen(BytesToSend, packetsSent, RGBData.splice(0, BytesToSend), 0x00);
			}

			BytesLeft -= BytesToSend;
			packetsSent++;
		}
	}
}

function bigScreenGrabber() {
		let RGBData = [];

            RGBData = device.getImageBuffer(0, 120, 240, 30, {flipH: false, outputWidth: 800, outputHeight: 100, format: "JPEG"});

            let BytesLeft = RGBData.length;
            let packetsSent = 0;
    
            while(BytesLeft > 0) {
                const BytesToSend = Math.min(1008, BytesLeft);
    
                if(BytesToSend < 1008) {
                    sendBigScreen(BytesLeft, packetsSent, RGBData.splice(0, BytesLeft), 0x01);
                } else {
                    sendBigScreen(BytesToSend, packetsSent, RGBData.splice(0, BytesToSend), 0x00);
                }
    
                BytesLeft -= BytesToSend;
                packetsSent++;
            }
}

function colorgrabber() {
	for(let iIdx = 0; iIdx < 8; iIdx++) {
		let RGBData = [];

		const iXoffset = (iIdx % 4) * ButtonSize;
		const iYoffset = Math.floor(iIdx / 4) * ButtonSize;

		RGBData = device.getImageBuffer(iXoffset, iYoffset, ButtonSize, ButtonSize, {flipH: false, outputWidth: 120, outputHeight: 120, format: "JPEG"});


		let BytesLeft = RGBData.length;
		let packetsSent = 0;

		while(BytesLeft > 0) {
			const BytesToSend = Math.min(1016, BytesLeft);

			if(BytesToSend < 1016) {
				sendZone(BytesLeft, iIdx, RGBData.splice(0, BytesLeft), packetsSent, 0x01);
			} else {
				sendZone(BytesToSend, iIdx, RGBData.splice(0, BytesToSend), packetsSent, 0x00);
			}

			BytesLeft -= BytesToSend;
			packetsSent++;
		}
	}
}

function sendBigScreen(packetLength, packetsSent, rgbdata, finalPacket) {
	device.write([0x02, 0x0C, 0x00, 0x00, 0x00, 0x00, 0x20, 0x03, 0x64, 0x00, finalPacket, packetsSent, 0x00, packetLength & 0xFF, (packetLength >> 8) & 0xFF, 0x00].concat(rgbdata), 1024);
}

function sendZone(packetLength, iIdx, rgbdata, packetsSent, finalPacket) {
	device.write([0x02, 0x07, iIdx, finalPacket, packetLength & 0xFF, (packetLength >> 8) & 0xFF, packetsSent, 0x00].concat(rgbdata), 1024);
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

export function ImageUrl()
{
	return "https://raw.githubusercontent.com/SRGBmods/public/unsupported-experiments/_images/StreamdeckPlus.png";
}