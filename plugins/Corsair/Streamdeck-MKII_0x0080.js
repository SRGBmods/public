export function Name() { return "Elgato Streamdeck MKII"; }
export function VendorId() { return 0x0fd9; }
export function ProductId() { return 0x0080; }
export function Publisher() { return "WhirlwindFX"; }
export function Documentation() { return "troubleshooting/corsair"; }
export function Size() { return [5, 3]; }
export function DefaultPosition(){return [240, 120];}
export function DefaultScale(){return 8.0;}
export function ControllableParameters(){
	return [
		{"property":"shutdownColor", "group":"lighting", "label":"Shutdown Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
		{"property":"LightingMode", "group":"lighting", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
		{"property":"forcedColor", "group":"lighting", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
		{"property":"hwresetdevice", "label":"Reset Device","type":"boolean","default":"false"},
		{"property":"buttontimeout", "group":"", "label":"Button Press Timeout", "step":"1", "type":"number", "min":"1", "max":"50", "default":"5"},
		{"property":"hwbrightness", "group":"", "label":"Hardware Brightness", "step":"1", "type":"number", "min":"1", "max":"100", "default":"25"},
	];
}

let vLedNames = [ "LED 1", "LED 2", "LED 3", "LED 4", "LED 5", "LED 6", "LED 7", "LED 8", "LED 9", "LED 10", "LED 11", "LED 12", "LED 13", "LED 14", "LED 15" ];
let vLedPositions =
[
	[4, 0], [3, 0], [2, 0], [1, 0], [0, 0],
	[4, 1], [3, 1], [2, 1], [1, 1], [0, 1],
	[4, 2], [3, 2], [2, 2], [1, 2], [0, 2]
];
let lastButtonRGB;

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
	lastButtonRGB = Array.from(Array(32), () => Array(3).fill(0));
	setBrightness();
}

export function Render()
{
	colorgrabber();
}

export function onhwresetdeviceChanged()
{
	resetDevice();
}

function resetDevice()
{
	let packet = [];
	packet[0] = 0x02;
	device.write(packet, 1024);
	let rpacket = [];
	rpacket[0] = 0x03;
	rpacket[1] = 0x02;
	device.send_report(rpacket, 32);
	//device.log("reseting device");
	setBrightness();
}

export function onhwbrightnessChanged()
{
	setBrightness();
}

function setBrightness()
{
	let packet = [];
	packet[0] = 0x03;
	packet[1] = 0x08;
	packet[2] = hwbrightness;
	device.send_report(packet, 1024);
}

function makeHexString(ColorArray)
{
	let hexstring = "#";
	hexstring += decimalToHex(ColorArray[0], 2);
	hexstring += decimalToHex(ColorArray[1], 2);
	hexstring += decimalToHex(ColorArray[2], 2);

	return hexstring;
}

function decimalToHex(d, padding)
{
	let hex = Number(d).toString(16);
	padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

	while (hex.length < padding)
	{
		hex = "0" + hex;
	}

	return hex;
}

function colorgrabber(shutdown=false)
{
	for(let iIdx = 0; iIdx < 32; iIdx++)
	{
		let rgbdata = [];
		let iPxX = vLedPositions[iIdx][0];
		let iPxY = vLedPositions[iIdx][1];
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

		if(lastButtonRGB[iIdx][0] !== color[0] || lastButtonRGB[iIdx][1] !== color[1] || lastButtonRGB[iIdx][2] !== color[2])
		{
			lastButtonRGB[iIdx][0] = color[0];
			lastButtonRGB[iIdx][1] = color[1];
			lastButtonRGB[iIdx][2] = color[2];

			let buttoncolor = makeHexString(color);

			rgbdata = device.ConvertColorToImageBuffer(buttoncolor, 96, 96, "JPEG");

			let RGBLength = rgbdata.length.toString(10);
			let firstbyte = RGBLength[1] + RGBLength[2];
			let secondbyte = RGBLength[0];

			sendZone(iIdx, firstbyte, secondbyte, rgbdata);
		}
	}
}

function sendZone(iIdx, firstbyte, secondbyte, rgbdata)
{
	let packet = [];
	packet[0] = 0x02;
	packet[1] = 0x07;
	packet[2] = iIdx;
	packet[3] = 0x01;
	packet[4] = firstbyte;
	packet[5] = secondbyte;
	packet[6] = 0x00;
	packet[7] = 0x00;

	packet = packet.concat(rgbdata.splice(0, 1016));

	device.write(packet, 1024);
}

export function Validate(endpoint)
{
	return endpoint.interface === -1;
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
