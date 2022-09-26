export function Name() { return "LG UltraGear 27GN950"; }
export function VendorId() { return 0x043e; }
export function ProductId() { return 0x9a8a; }
export function Publisher() { return "Jazo Mannucci"; }
export function Size() { return [16,16]; }
export function Type() { return "Hid"; }
export function DefaultPosition(){return [10, 100]; }
export function DefaultScale(){return 8.0}
export function ControllableParameters() {
	return [
		{"property":"shutdownColor", "group":"lighting", "label":"Shutdown Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
		{"property":"LightingMode", "group":"lighting", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
		{"property":"forcedColor", "group":"lighting", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
	];
}

const control_commands = {
	'turn_on':          'f02020100de',
	'turn_off':         'f02020200dd',
	'color1':           'a02020301d8',
	'color2':           'a02020302db',
	'color3':           'a02020303da',
	'color4':           'a02020304dd',
	'color_peaceful':   'a02020305dc',
	'color_dynamic':    'a02020306df',
	'color_video_sync': 'a02020308d1',
}

const brightness_commands = {
	 1: 'f02020101df',
	 2: 'f02020102dc',
	 3: 'f02020103dd',
	 4: 'f02020104da',
	 5: 'f02020105db',
	 6: 'f02020106d8',
	 7: 'f02020107d9',
	 8: 'f02020108d6',
	 9: 'f02020109d7',
	10: 'f0202010ad4',
	11: 'f0202010bd5',
	12: 'f0202010cd2',
}

//let lastBrightnessValue = -1;

export function Initialize() {
    const videoSyncCMD = "5343c" + control_commands.color_video_sync + "4544";
    device.write(hexToBytes("00" + videoSyncCMD), 65);
    /*const brightnessCMD = "5343c" + brightness_commands[12] + "4544";
    device.write(hexToBytes("00" + brightnessCMD), 65);*/
    //updateBrightness();
}

const vLedNames = [
    "Led 1", "Led 2", "Led 3", "Led 4", "Led 5", "Led 6", "Led 7", "Led 8", "Led 9", "Led 10",
    "Led 11", "Led 12", "Led 13", "Led 14", "Led 15", "Led 16", "Led 17", "Led 18", "Led 19", "Led 20",
    "Led 21", "Led 22", "Led 23", "Led 24", "Led 25", "Led 26", "Led 27", "Led 28", "Led 29", "Led 30",
    "Led 31", "Led 32", "Led 33", "Led 34", "Led 35", "Led 36", "Led 37", "Led 38", "Led 39", "Led 40",
    "Led 41", "Led 42", "Led 43", "Led 44", "Led 45", "Led 46", "Led 47", "Led 48"
]; 
const vLedPositions = [
    [7,0], [6,0], [5,0], [5,1], [4,1], [3,2], [2,3], [1,4], [1,5], [0,5], 
    [0,6], [0,7], [0,8], [0,9], [0,10], [1,10], [1,11], [2,12], [3,13], [4,14],
    [5,14], [5,15], [6,15], [7,15], [8,15], [9,15], [10,15], [10,14], [11,14], [12,13],
    [13,12], [14,11], [14,10], [15,10], [15,9], [15,8], [15,7], [15,6], [15,5], [14,5],
    [14,4], [13,3], [12,2], [11,1], [10,1], [10,0], [9,0], [8,0]
];

export function LedNames() {
    return vLedNames;
}

export function LedPositions() {
    return vLedPositions;
}

export function Render() {
    sendColors();
}

export function Shutdown() {
    sendColors(true);
}

function sendColors(shutdown = false){
	const newColors = [];
	for (let i=0; i<48; i++){
        let iX = vLedPositions[i][0];
        let iY = vLedPositions[i][1];
        var rgbCol;
        if(shutdown){
            rgbCol = hexToRgb(shutdownColor);
        }else if (LightingMode === "Forced") {
            rgbCol = hexToRgb(forcedColor);
        }else{
            rgbCol = device.color(iX, iY);
        }
        newColors.push(fixColor(rgbToHex(rgbCol)));
    }

	let cmd = '5343c1029100';
	cmd += newColors.join('');
	cmd += calcCrc(cmd);
	cmd += '4544';

	const cmd1 = cmd.substring(0,128);
	const cmd2 = cmd.substring(128,256);
	const cmd3 = cmd.substring(256, cmd.length) + ('0'.repeat(78)); // pad with zeroes to get to 64 bytes / 128 chars

    device.write(hexToBytes("00"+cmd1), 65);
    device.write(hexToBytes("00"+cmd2), 65);
    device.write(hexToBytes("00"+cmd3), 65);
}

/*function updateBrightness(){
    lastBrightnessValue = device.getBrightness();
    const brightnessValue = parseInt(12 * (lastBrightnessValue/100), 10);
    device.log(brightnessValue);
    const brightnessCMD = "5343c" + brightness_commands[brightnessValue] + "4544";
    device.write(hexToBytes("00" + brightnessCMD), 65);
}*/

function fixColor(colorString){
    // each RGB component must be at least 1, otherwise the monitor can 'crash'
    if (colorString.length === 6){
        let red = colorString.substring(0, 2);
        let green = colorString.substring(2, 4);
        let blue = colorString.substring(4, 6);
        const nonZero = (value)=>{
            return value === '00' ? '01' : value;
        };
        return nonZero(red)+nonZero(green)+nonZero(blue);
    }
    return colorString;
}

function calcCrc(data){
    // This is the standard CRC algorithm, with the paramaters tweaked to what's
	// used here. This implementation is based off of:
	//   https://gist.github.com/Lauszus/6c787a3bc26fea6e842dfb8296ebd630
    const bytesData = hexToBytes(data);
    let crc = 0;
    bytesData.forEach(byte => {
        crc = crc^byte;
        // this loop could be removed?
        for (let i=0; i<8; i++){
            crc = crc << 1;
            if (crc & 0x100){
                crc = crc^0x101;
            }
        }
    });
    crc = crc.toString(16);
    if (crc.length == 1){
        crc = '0' + crc;
    }
    return crc;
}

function hexToRgb(hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	let colors = [];
	colors[0] = parseInt(result[1], 16);
	colors[1] = parseInt(result[2], 16);
	colors[2] = parseInt(result[3], 16);
	return colors;
}

function rgbToHex(rgb) {
    const intToHex = (integer)=>{
        var str = Number(integer).toString(16);
        return str.length == 1 ? "0" + str : str;
    }
    return intToHex(rgb[0]) + intToHex(rgb[1]) + intToHex(rgb[2]);
};

function hexToBytes(hex) {
    const bytes = [];
    for (let c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

export function Validate(endpoint) {
	return endpoint.interface === 1 && endpoint.usage === 1 && endpoint.usage_page === 0xff01;
}

export function Image() {
	return "";
}