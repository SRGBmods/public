export function Name() { return "GMMK Pro"; }
export function VendorId() { return 0x320F; }
export function ProductId() { return 0x5044; }
export function Publisher() { return "WhirlwindFX"; }
export function Size() { return [21, 7]; }
export function DefaultPosition() {return [75,70]; }
export function DefaultScale(){return 8.0}
export function ControllableParameters(){
    return [
	    {"property":"shutdownColor", "label":"Shutdown Color","min":"0","max":"360","type":"color","default":"009bde"},
        {"property":"LightingMode", "label":"Lighting Mode", "type":"combobox", "values":["Canvas","Forced"], "default":"Canvas"},
        {"property":"forcedColor", "label":"Forced Color","min":"0","max":"360","type":"color","default":"009bde"},
		   ];
}

export function Initialize()
{	
	sendPacketString("00 06 00 FF 01 01 00 00",64);
}

	var vKeys = 
[
	0, 6,12,18,23,28,34,39,44,50,56,61,66,	     69,//Move 2 //14
	1, 7,13,19,24,29,35,40,45,51,57,62,78,85,       72,  //Move 2  	//15	
	2, 8,14,20,25,30,36,41,46,52,58,63,89,93,       75, //Move 2 //15
	3, 9,15,21,26,31,37,42,47,53,59,64,96,          86,    	//Add 1	//14
	4,10,16,22,27,32,38,43,48,54,60,   90,    94,   82,             //Add 1 //14
	5,11,17,      33,      49,55,65,       95,97,79, //Move 1 //10
	67,68,70,71,73,74,76,77,80,81,83,84,87,88,91,92 //16
];
	var vKeyNames = 
[
	"Esc","F1","F2","F3","F4",   "F5","F6","F7","F8",    "F9", "F10", "F11", "F12",         "Print Screen",  
     "`", "1",  "2", "3", "4", "5",  "6", "7", "8", "9", "0",  "-",   "+",  "Backspace",    "Del",        
    "Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\",                "Page Up",         
    "CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'","Enter",             	"Page Down",                                      
    "Left Shift","Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Right Shift",                		 "Up Arrow",   "End",              
    "Left Ctrl", "Left Win", "Left Alt", "Space", "Right Alt", "Fn", "Right Ctrl", 			"Left Arrow","Down Arrow", "Right Arrow",   
	"UnderGlow1","UnderGlow2","UnderGlow3","UnderGlow4","UnderGlow5","UnderGlow6","UnderGlow7","UnderGlow8","UnderGlow9","UnderGlow10","UnderGlow11","UnderGlow12","Underglow13","Underglow14","Underglow15","Underglow16",
];

var vKeyPositions = 
[
[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],[12,1], [13,1],  		 		 [16,1], //14
[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2], [13,2], [14,2],  				[17,2],//15  
[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3],[12,3], [13,3], [14,3],  				[17,3],//15  
[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],[12,4], [13,4], 		                [17,4], //14         
[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],[12,5], 		                 [16,5],[17,5],   //14      
[1,6],[2,6],[3,6],					[7,6],				     [11,6],[12,6],         [14,6],  [15,6] ,[16,6],[17,6],  //10
[0,0],[18,0],[0,1],[18,1],[0,2],[18,2],[0,3],[18,3],[0,4],[18,4],[0,5],[18,5],[0,6],[18,6],[0,6],[18,6], //16
];

function LedKeys()
{
	return vKeys;
}

export function LedNames()
{
    return vKeyNames;
}

export function LedPositions()
{
    return vKeyPositions;
}

export function Shutdown()
{
	sendColors();
}

export function Validate(endpoint)
{
    return endpoint.interface === 1 && endpoint.usage == 0x0061;
}

export function Render()
{       
    sendColors();
}

function sendColors(shutdown = false){

	// Build RGB Data
	var RGBData = []
	var TotalLedCount = 0;
	let KeyCount = LedKeys().length //only check the function once, a change mid loop is undefined behavior
	for(var ledIndex = 0; ledIndex < KeyCount; ledIndex++){
		let [LedPositionX, LedPositionY] = vKeyPositions[ledIndex];
		var color;

		if(shutdown){
            color = hexToRgb(shutdownColor)
        }else if (LightingMode == "Forced") {
            color = hexToRgb(forcedColor)
        }else{
            color = device.color(LedPositionX, LedPositionY);
        }
		RGBData[vKeys[ledIndex] * 3] = color[0];
		RGBData[vKeys[ledIndex] * 3 + 1] = color[1];
		RGBData[vKeys[ledIndex] * 3 + 2] = color[2];
		TotalLedCount++
	}
	

	//Stream Packets
	var LedsSent = 0;
    while(TotalLedCount > 0){
		// Find packet Size and stream
		let LedsToSend = TotalLedCount >= 20 ? 20 : TotalLedCount;
		SendColorPacket(LedsSent, LedsToSend,RGBData.splice(0,LedsToSend*3))
		// Set up for next loop
		LedsSent += LedsToSend;
		TotalLedCount -= LedsToSend;
		//device.pause(1) // may not be needed, but give the keyboard a chance to breath
	}
}

function SendColorPacket(LedsSent, LedsToSend, data){
	var packet = [];
	packet[0x00] = 0x00;
    packet[0x01] = 0x09;
	packet[0x02] = LedsSent;
	packet[0x03] = LedsToSend;
	packet = packet.concat(data);
	
	device.write(packet,64)
}
function sendPacketString(string, size){
    var packet= [];
    var data = string.split(' ');
    
    for(let i = 0; i < data.length; i++){
        packet[i] = parseInt(data[i],16);
    }

	device.write(packet, size);

}


function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	var colors = [];
	colors[0] = parseInt(result[1], 16);
	colors[1] = parseInt(result[2], 16);
	colors[2] = parseInt(result[3], 16);

	return colors;
}