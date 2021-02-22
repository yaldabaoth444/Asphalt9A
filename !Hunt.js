"auto";
const DEVICE = require('device.js');
robot = require('./robot.js');
DEVICE.checkPermission();
DEVICE.setEventListener();
    
/* C O N F I G */
var keys = {
    nitro: { x: 2138, y: 921 },
    break: { x: 400, y: 921 },
}
    
var p = /\[(.*)\]/
var o = /{(.*)}/
var key = /KEY_([a-z0-9]+)/
var tout = /TOUT_([0-9]+)/
var tlr = /TLR_([.0-9]+)/
  
var rootFolder = '/sdcard/Bot/HUNT/';
var currentFolder = 'START';

while (true) {
    var result = ProcessScreen(rootFolder + currentFolder, "0.98");
    if (result)
    {
    	toastLog('Switch to ' + result)
    	if (result == 'END')
        {
    		toastLog("Script stopped")
    		exit()
        }
    	currentFolder = result
    }
}
 
function ProcessScreen(folder, precisionDef)
{
    var list = files.listDir(folder);
    var len = list.length;
    if(len > 0){
        var img = captureScreen();
        for(let i = 0; i < len; i++){
            var fileName = list[i];
            if (fileName.toLowerCase().endsWith(".png"))
            {
                opt = ExtractParam(o, fileName, null)
			    precision = parseFloat(ExtractParam(tlr, opt, precisionDef))
			    timeOut = parseInt(ExtractParam(tout, opt, "0"))
			    keyCode = ExtractParam(key, opt, null)

                var templatePath = files.join(folder, fileName);
                var template = images.read(templatePath);

                var pos = images.findImage(img, template);
                width = template.getWidth();
                height = template.getHeight();
                template.recycle();
                if(pos){
                    if (keyCode && keyCode != '')
                    {
                        var keyPos = keys[keyCode];
                        if (keyPos)
                        {
                            robot.click(keyPos.x, keyPos.y);
                            log('Press key ' + keyCode)
                        }
                    } else {
                        var middle = {
                            x: Math.round(pos.x + width/2), 
                            y: Math.round(pos.y + height/2)
                        };
                        robot.click(middle.x, middle.y);
                        log('Click button ' + fileName + ' ' + middle.x + ', ' +  middle.y)
                    }
                   
                    if (timeOut > 0)
                    { 
                        log('timeOut: ' + timeOut)   
    					sleep(timeOut)
                    }
                    return ExtractParam(p, fileName, null) 
                }  
            }
        }
        img.recycle();
    }  
}

function ExtractParam(r, text, defaultVal)
{
	if (text && text != '')
    {  
		result = text.match(r)
		if (result)
        {
            return result[1]
        }
    }        
	return defaultVal
}