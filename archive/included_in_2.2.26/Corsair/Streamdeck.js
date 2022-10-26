/* eslint-disable brace-style */
export function Name() { return "Elgato Streamdeck"; }
export function VendorId() { return 0x0fd9; }
export function ProductId() { return 0x006d; }
export function Publisher() { return "WhirlwindFX"; }
export function Size() { return [ButtonSize * RowWidth + 1, ButtonSize * ColHeight + 1]; }
export function DefaultPosition(){return [240, 120];}
export function DefaultScale(){return 8.0;}
export function ControllableParameters()
{
	return [
		{"property":"hwresetdevice", "label":"Reset Device","type":"boolean","default":"false"},
		{"property":"buttontimeout", "group":"", "label":"Button Press Timeout", "step":"1", "type":"number", "min":"1", "max":"50", "default":"5"},
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

const ButtonSize = 36;
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

function colorgrabber()
{
	for(let iIdx = 0; iIdx < 15; iIdx++)
	{
		let RGBData = [];

		let iXoffset = (iIdx % 5) * ButtonSize;
		let iYoffset = Math.floor(iIdx / 5) * ButtonSize;

		RGBData = device.getImageBuffer(iXoffset, iYoffset, ButtonSize, ButtonSize, 72, 72, "JPEG");

		
		let BytesLeft = RGBData.length;
		let packetsSent = 0;

		while(BytesLeft > 0)
		{
			const BytesToSend = Math.min(1016, BytesLeft);

			if(BytesToSend < 1016)
			{
				sendZone(BytesLeft, iIdx, RGBData.splice(0,BytesLeft), packetsSent, 0x01);
			}
			else
			{
				sendZone(BytesToSend, iIdx, RGBData.splice(0,BytesToSend), packetsSent, 0x00);
			}
			BytesLeft -= BytesToSend;
			packetsSent++;
		}
	}
}


function sendZone(packetLength, iIdx, rgbdata, packetsSent, finalPacket)
{
    let packet = [0x02, 0x07, iIdx, finalPacket, packetLength & 0xFF, (packetLength >> 8) & 0xFF, packetsSent, 0x00];
    packet.push(...rgbdata);

    device.write(packet, 1024);
}

export function Validate(endpoint)
{
	return endpoint.interface === -1;
}