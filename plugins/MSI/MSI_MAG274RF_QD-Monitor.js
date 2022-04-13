export function Name() { return "MSI MAG274QRF-QD"; }
export function VendorId() { return 0x1462; }
export function ProductId() { return 0x3fa4; }
export function Publisher() { return "Derek Huber"; }
export function Size() { return [12,1]; }
export function DefaultPosition(){return [240,120]}
export function DefaultScale(){return 8.0}
export function ControllableParameters(){
    return [
        {"property":"shutdownColor", "label":"Shutdown Color","min":"0","max":"360","type":"color","default":"009bde"},
        {"property":"LightingMode", "label":"Lighting Mode", "type":"combobox", "values":["Canvas","Forced"], "default":"Canvas"},
        {"property":"forcedColor", "label":"Forced Color","min":"0","max":"360","type":"color","default":"009bde"},
    ];
}

var vLedNames = 
[
   "Led 1", "Led 2", "Led 3", "Led 4", "Led 5", "Led 6", "Led 7", "Led 8", "Led 9", "Led 10", "Led 11", "Led 12"
];

var vLedPositions = 
[
    [11,0],[10,0],[9,0],[8,0],[7,0],[6,0],[5,0],[4,0],[3,0],[2,0],[1,0],[0,0]
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
    sendColors();
}

export function Shutdown()
{
    sendColors(true);
}

function sendColors(shutdown = false)
{
 var packet = [];
    packet[0]  = 0x72;
    packet[1]  = 0x01;
	packet[5]  = 0x01;
    packet[6]  = 0x64;
    packet[12] = 0x01;
    packet[16] = 0x01;
    packet[17] = 0x64;
	packet[23] = 0xff;
    packet[26] = 0xff;
    packet[29] = 0xff;
    packet[32] = 0xff;
    packet[35] = 0xff;
    packet[38] = 0xff;
    packet[41] = 0xff;
    packet[44] = 0xff;
    packet[47] = 0xff;
    packet[50] = 0xff;
    packet[53] = 0xff;
    packet[56] = 0xff;
    packet[59] = 0xff;
    packet[62] = 0xff;
    packet[65] = 0xff;
    packet[68] = 0xff;
    packet[71] = 0xff;
    packet[74] = 0xff;


    for(var iIdx = 0; iIdx < 12; iIdx++)
	{
     var iPxX = vLedPositions[iIdx][0];
     var iPxY = vLedPositions[iIdx][1];
     var color;
     if(shutdown)
		{
         color = hexToRgb(shutdownColor)
        }
	 else if (LightingMode == "Forced") 
		{
         color = hexToRgb(forcedColor)
        }
	 else
		{
         color = device.color(iPxX, iPxY);
        }
     

     packet[iIdx * 3 + 77] = color[0];
     packet[iIdx * 3 + 78] = color[1];
     packet[iIdx * 3 + 79] = color[2];
    }

    packet[131] = 0xff;
    packet[134] = 0xff;
    packet[137] = 0xff;
    packet[140] = 0xff;
    packet[143] = 0xff;
    packet[146] = 0xff;
    packet[149] = 0xff;
    packet[152] = 0xff;
    packet[155] = 0xff;
    packet[158] = 0xff;
    packet[161] = 0xff;
    packet[164] = 0xff;
	device.send_report(packet, 168);
}

export function Validate(endpoint)
{
    return endpoint.interface === -1;
}

function hexToRgb(hex) 
{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var colors = [];
    colors[0] = parseInt(result[1], 16);
    colors[1] = parseInt(result[2], 16);
    colors[2] = parseInt(result[3], 16);

    return colors;
}