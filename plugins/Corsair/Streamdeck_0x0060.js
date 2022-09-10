/* eslint-disable brace-style */
export function Name() { return "Elgato Streamdeck"; }
export function VendorId() { return 0x0fd9; }
export function ProductId() { return 0x0060; }
export function Publisher() { return "WhirlwindFX"; }
export function Size() { return [5, 3]; }
export function DefaultPosition(){return [240, 120];}
export function DefaultScale(){return 8.0;}
export function ControllableParameters(){
	return [
		{"property":"shutdownColor", "group":"lighting", "label":"Shutdown Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
		{"property":"LightingMode", "group":"lighting", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
		{"property":"forcedColor", "group":"lighting", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
		{"property":"buttontimeout", "group":"", "label":"Button Press Timeout", "step":"1", "type":"number", "min":"1", "max":"50", "default":"5"},
		{"property":"brightness", "group":"", "label":"Screen Brightness", "step":"1", "type":"number", "min":"1", "max":"100", "default":"50"},
	];
}

let vLedNames = [ "LED 1", "LED 2", "LED 3", "LED 4", "LED 5", "LED 6", "LED 7", "LED 8", "LED 9", "LED 10", "LED 11", "LED 12", "LED 13", "LED 14", "LED 15" ];
let vLedPositions =
[
	[4, 0], [3, 0], [2, 0], [1, 0], [0, 0],
	[4, 1], [3, 1], [2, 1], [1, 1], [0, 1],
	[4, 2], [3, 2], [2, 2], [1, 2], [0, 2]
];

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

}

export function Render()
{
	grabColors();
}

export function onbrightnessChanged()
{
	setBrightness();
}

function setBrightness()
{
	let packet = [];
	packet[0] = 0x05;
	packet[1] = 0x55;
	packet[2] = 0xaa;
	packet[3] = 0xd1;
	packet[4] = 0x01;
	packet[5] = brightness;
	device.send_report(packet, 8191);
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

	while (hex.length < padding) {
		hex = "0" + hex;
	}

	return hex;
	//return "0x" + hex;
}

function grabColors(shutdown)
{
	for(let iIdx = 0; iIdx < 15; iIdx++)
	{
		let RGBData = [];
		let RGBData2ElectricBoogaloo = [];
		let iPxX = vLedPositions[iIdx][0];
		let iPxY = vLedPositions[iIdx][1];

		if(shutdown)
		{
			RGBData = device.createColorArray(shutdownColor, 5184, "Inline", "BGR"); //NEEDS TO BE HEX String
			RGBData2ElectricBoogaloo = device.createColorArray(shutdownColor, 2601, "Inline", "BRG");
		}
		else if (LightingMode === "Forced")
		{
			RGBData = device.createColorArray(forcedColor, 5184, "Inline", "BGR"); //NEEDS TO BE HEX String
			RGBData2ElectricBoogaloo = device.createColorArray(forcedColor, 2601, "Inline", "BRG");
		}
		else
		{
			RGBData = device.createColorArray(makeHexString(device.color(iPxX, iPxY)), 2583, "Inline", "BGR"); //NEEDS TO BE HEX String
			RGBData2ElectricBoogaloo = device.createColorArray(makeHexString(device.color(iPxX, iPxY)), 2601, "Inline", "BGR");
		}

		sendZone(iIdx, RGBData, RGBData2ElectricBoogaloo);
	}
}


function sendZone(iIdx, RGBData, RGBData2ElectricBoogaloo)
{
	let packet =
	[
		0x02, 0x01, 0x01, 0x00, 0x00, iIdx+1, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
		0x42, 0x4d, 0xf6, 0x3c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x36, 0x00, 0x00, 0x00, 0x28, 0x00,
		0x00, 0x00, 0x48, 0x00, 0x00, 0x00, 0x48, 0x00, 0x00, 0x00, 0x01, 0x00, 0x18, 0x00, 0x00, 0x00,
		0x00, 0x00, 0xC0, 0x3C, 0x00, 0x00, 0x13, 0x0E,	0x00, 0x00, 0x13, 0x0E, 0x00, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00
	];


	packet = packet.concat(RGBData.splice(0, 7750));

	device.write(packet, 8191);

	let packet2electricboogaloo =
	[
		0x02, 0x01, 0x02, 0x00, 0x01, iIdx+1, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	];

	packet2electricboogaloo = packet2electricboogaloo.concat(RGBData2ElectricBoogaloo.splice(0, 7804));

	device.write(packet2electricboogaloo, 8191);
}


export function Validate(endpoint)
{
	return endpoint.interface === -1;
}