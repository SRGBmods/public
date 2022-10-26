export function Name() { return "Razer PWM Controller"; }
export function VendorId() { return   0x1532; }
export function ProductId() { return  0x0F3C; }
export function Publisher() { return "WhirlwindFX"; }
export function Size() { return [1, 1]; }
export function Type() { return "Hid"; }
export function DefaultPosition(){return [0, 0];}
export function DefaultScale(){return 8.0;}
export function DefaultScale(){return 8.0;}
export function ControllableParameters(){
	return [
	];
}

let ConnectedFans = [];
let savedPollFanTimer = Date.now();
let PollModeInternal = 3000;

export function LacksOnBoardLeds() {return true;}

export function Initialize() 
{
    burstFans(); //1666 0x06 0x82

}

export function Shutdown() {

}

export function Render() 
{
    PollFans();
}

function packetSend(packet,length) //Wrapper for always including our CRC
{
	let packetToSend = packet;
	packetToSend[89] = CalculateCrc(packet);
	device.send_report(packetToSend,length)
}

function CalculateCrc(report) 
{
	let iCrc = 0;

	for (let iIdx = 3; iIdx < 89; iIdx++) 
	{
		iCrc ^= report[iIdx];
	}

	return iCrc;
}

function PollFans(){
	//Break if were not ready to poll
	if (Date.now() - savedPollFanTimer < PollModeInternal) {
		return;
	}

	savedPollFanTimer = Date.now();

	if(device.fanControlDisabled()){
		return;
	}

	for(let fan = 0; fan < 8; fan++)
    {
		let rpm = getChannelRPM(fan);
		device.log(`Fan ${fan}: ${rpm}rpm`);

		if(rpm > 0  && !ConnectedFans.includes(`Fan ${fan}`)){
			ConnectedFans.push(`Fan ${fan}`);
			device.createFanControl(`Fan ${fan}`);
		}

		if(ConnectedFans.includes(`Fan ${fan}`)){
			device.setRPM(`Fan ${fan}`, rpm);

			let newSpeed = device.getNormalizedFanlevel(`Fan ${fan}`) * 100;
			setChannelRPM(fan, newSpeed);
		}
	}
}

function burstFans()
{
	if(device.fanControlDisabled())
    {
		return;
	}

	device.log("Bursting Fans for RPM based Detection");

	for(let Channel = 0; Channel < 8; Channel++){
		setChannelMode(Channel);
	}

	for(let Channel = 0; Channel < 8; Channel++){
		setChannelRPM(Channel, 75);
	}
}
function setChannelMode(channel)
{
	let packet = [0x00, 0x00, 0x1f, 0x00, 0x00, 0x00, 0x03, 0x0d, 0x02, 0x01, channel + 0x05, 0x04]; //manual is 0x04
    packetSend(packet,91);
	device.pause(2);
}

function setChannelRPM(channel,speed)
{
    let packet = [0x00, 0x00, 0x1f, 0x00, 0x00, 0x00, 0x03, 0x0d, 0x0d, 0x01, channel + 0x05, speed]; 
    packetSend(packet,91);
	device.pause(2);
}

function getChannelRPM(channel)
{
    let packet = [0x00, 0x00, 0x1f, 0x00, 0x00, 0x00, 0x06, 0x0d, 0x81, 0x01, channel + 0x05];
    packetSend(packet,91);
    let returnpacket = device.get_report(packet,91);

    let RPMHighByte = returnpacket[13];
    let RPMLowByte = returnpacket[14];
    let RPM = RPMHighByte.toString(16) + RPMLowByte.toString(16);
    RPM = parseInt(RPM,16)
    return RPM;
}


export function Validate(endpoint) 
{
	return endpoint.interface === 0;

}