export function Name() { return "Elgato Stream Deck MK.2"; }
export function VendorId() { return 0x0fd9; }
export function ProductId() { return 0x0080; }
export function Publisher() { return "WhirlwindFX"; }
export function Documentation() { return "troubleshooting/corsair"; }
export function Size() { return [5, 3]; }
export function DeviceMessage() { return ["This device needs additional functionality", "Edit plugin to adjust size for Canvas or Elgato-Friendly"]; }
export function DefaultPosition(){return [0, 0];}
export function DefaultScale(){return 1.0;}
export function RenderFrameDelay(){ return 15;}
/* global
LightingMode:readonly
forcedColor:readonly
hwbrightness:readonly
*/
export function ControllableParameters()
{
	return [
		{"property":"shutdownColor", "group":"lighting", "label":"Shutdown Color", "min":"0", "max":"360", "type":"color", "default":"#000000"},
		{"property":"LightingMode", "group":"lighting", "label":"Lighting Mode", "type":"combobox", "values":["Elgato-Friendly", "Canvas", "Forced"], "default":"Elgato-Friendly"},
		{"property":"forcedColor", "group":"lighting", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
		{"property":"hwresetdevice", "label":"Reset Device", "type":"boolean", "default":"false"},
		{"property":"ButtonSize", "group":"", "label":"Button Size", "step":"1", "type":"number", "min":"1", "max":"36", "default":"36"},
		{"property":"hwbrightness", "group":"", "label":"Hardware Brightness", "step":"1", "type":"number", "min":"1", "max":"100", "default":"25"},
	];
}

let vLedNames = [ "LED 1", "LED 2", "LED 3", "LED 4", "LED 5", "LED 6", "LED 7", "LED 8", "LED 9", "LED 10", "LED 11", "LED 12", "LED 13", "LED 14", "LED 15" ];
let vLedPositions =
[
	[0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
	[0, 1], [1, 1], [2, 1], [3, 1], [4, 1],
	[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]
];
let lastButtonRGB;
const RowWidth = 5;
const ColHeight = 3;

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
	lastButtonRGB = Array.from(Array(vLedNames.length), () => Array(3).fill(0));

	if (LightingMode === "Canvas")
	{
		device.setSize([ButtonSize * RowWidth + 1, ButtonSize * ColHeight + 1]);
	}

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

export function onLightingModeChanged()
{
	if (LightingMode === "Elgato-Friendly" || LightingMode === "Forced")
	{
		device.setSize([5, 3]);
		//device.setScale([8.0]);
	}
	else
	{
		device.setSize([ButtonSize * RowWidth + 1, ButtonSize * ColHeight + 1]);
	}
}

export function onButtonSizeChanged()
{
	device.setSize([ButtonSize * RowWidth + 1, ButtonSize * ColHeight + 1]);
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
	for(let iIdx = 0; iIdx < vLedNames.length; iIdx++)
	{
		let rgbdata = [];
		let iPxX = vLedPositions[iIdx][0];
		let iPxY = vLedPositions[iIdx][1];
		let color;

		if(shutdown)
		{
			resetDevice();
		}
		else if (LightingMode === "Forced")
		{
			color = hexToRgb(forcedColor);
		}
		else
		{
			color = device.color(iPxX, iPxY);
		}

		if (LightingMode === "Elgato-Friendly")
		{
			if(lastButtonRGB[iIdx][0] !== color[0] || lastButtonRGB[iIdx][1] !== color[1] || lastButtonRGB[iIdx][2] !== color[2])
			{
				lastButtonRGB[iIdx][0] = color[0];
				lastButtonRGB[iIdx][1] = color[1];
				lastButtonRGB[iIdx][2] = color[2];

				let buttoncolor = makeHexString(color);

				rgbdata = device.ConvertColorToImageBuffer(buttoncolor, 72, 72, "JPEG");

				let RGBLength = rgbdata.length.toString(10);
				let firstbyte = RGBLength[1] + RGBLength[2];
				let secondbyte = RGBLength[0];

				sendZone(iIdx, firstbyte, secondbyte, rgbdata);
			}
		}
		else if (LightingMode === "Canvas")
		{
			let RGBData = [];
			let iXoffset = (iIdx % RowWidth) * ButtonSize;
			let iYoffset = Math.floor(iIdx / RowWidth) * ButtonSize;

			RGBData = device.getImageBuffer(iXoffset, iYoffset, ButtonSize, ButtonSize, {outputWidth:72, outputHeight:72, flipV: true, flipH: true});

			let BytesLeft = RGBData.length;
			let packetsSent = 0;

			while(BytesLeft > 0)
			{
				const BytesToSend = Math.min(1016, BytesLeft);

				if(BytesToSend < 1016)
				{
					sendNewZone(BytesLeft, iIdx, RGBData.splice(0, BytesLeft), packetsSent, 0x01);
				}
				else
				{
					sendNewZone(BytesToSend, iIdx, RGBData.splice(0, BytesToSend), packetsSent, 0x00);
				}

				BytesLeft -= BytesToSend;
				packetsSent++;
			}
		}
		else
		{
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
	let packet = [0x02, 0x07, iIdx, 0x01, firstbyte, secondbyte, 0x00, 0x00];
	packet = packet.concat(rgbdata.splice(0, 1016));

	device.write(packet, 1024);
}

function sendNewZone(packetLength, iIdx, rgbdata, packetsSent, finalPacket)
{
	const packet = [0x02, 0x07, iIdx, finalPacket, packetLength & 0xFF, (packetLength >> 8) & 0xFF, packetsSent, 0x00];
	packet.push(...rgbdata);

	device.write(packet, 1024);
}

export function Validate(endpoint)
{
	return endpoint.interface === 0;
}

function hexToRgb(hex, format = "RGB")
{
	const result = /^#?(?<R>[a-f\d]{2})(?<G>[a-f\d]{2})(?<B>[a-f\d]{2})$/i.exec(hex);
	const colors = [
		parseInt(result.groups[format[0]], 16),
		parseInt(result.groups[format[1]], 16),
		parseInt(result.groups[format[2]], 16)
	];

	return colors;
}

export function ImageUrl()
{
	return "https://raw.githubusercontent.com/SRGBmods/public/unsupported-experiments/_images/Streamdeck-0x0080.png";
}