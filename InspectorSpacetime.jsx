/** ===== About Inspector Spacetime =====
	Generates motion spec data to be rendered with the reference quicktime to share with ENG.
	It's a stupid name with a reference to the short-lived NBC show Commpunity.
	inSPECtor SPACE+TIME = motion specs

	Current Version: 2.1 (March, 21 2019)

	Designed by: Adam Plouff (adamplouff@)
**/

/** ===== Script Process =====
	Select keyframe pairs
	Keys are collected
	Key info is gathered into one object per pair
	Key-pair-objs are sorted based on start time

	Comp is duplicated
	Side panel is added
	Text layer is created

	Keys are filtered by property value type
	Keyframe data is added to a text string
	Start and End markers are added
	Raw text is styled by an expression
	**/

(function (thisObj) {																														//encapsulate the script in a function to avoid global variables

var JSON;JSON||(JSON={}); (function(){function k(a){return a<10?"0"+a:a}function o(a){p.lastIndex=0;return p.test(a)?'"'+a.replace(p,function(a){var c=r[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function l(a,j){var c,d,h,m,g=e,f,b=j[a];b&&typeof b==="object"&&typeof b.toJSON==="function"&&(b=b.toJSON(a));typeof i==="function"&&(b=i.call(j,a,b));switch(typeof b){case "string":return o(b);case "number":return isFinite(b)?String(b):"null";case "boolean":case "null":return String(b);case "object":if(!b)return"null"; e+=n;f=[];if(Object.prototype.toString.apply(b)==="[object Array]"){m=b.length;for(c=0;c<m;c+=1)f[c]=l(c,b)||"null";h=f.length===0?"[]":e?"[\n"+e+f.join(",\n"+e)+"\n"+g+"]":"["+f.join(",")+"]";e=g;return h}if(i&&typeof i==="object"){m=i.length;for(c=0;c<m;c+=1)typeof i[c]==="string"&&(d=i[c],(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h))}else for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h);h=f.length===0?"{}":e?"{\n"+e+f.join(",\n"+e)+"\n"+g+"}":"{"+f.join(",")+ "}";e=g;return h}}if(typeof Date.prototype.toJSON!=="function")Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+k(this.getUTCMonth()+1)+"-"+k(this.getUTCDate())+"T"+k(this.getUTCHours())+":"+k(this.getUTCMinutes())+":"+k(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()};var q=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, p=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e,n,r={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},i;if(typeof JSON.stringify!=="function")JSON.stringify=function(a,j,c){var d;n=e="";if(typeof c==="number")for(d=0;d<c;d+=1)n+=" ";else typeof c==="string"&&(n=c);if((i=j)&&typeof j!=="function"&&(typeof j!=="object"||typeof j.length!=="number"))throw Error("JSON.stringify");return l("", {"":a})};if(typeof JSON.parse!=="function")JSON.parse=function(a,e){function c(a,d){var g,f,b=a[d];if(b&&typeof b==="object")for(g in b)Object.prototype.hasOwnProperty.call(b,g)&&(f=c(b,g),f!==void 0?b[g]=f:delete b[g]);return e.call(a,d,b)}var d,a=String(a);q.lastIndex=0;q.test(a)&&(a=a.replace(q,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return d=eval("("+a+")"),typeof e==="function"?c({"":d},""):d;throw new SyntaxError("JSON.parse");}})();

//================ VARIABLES ======================
var scriptName = 'Inspector Spacetime';
var scriptVersion = '2.1';
var thisComp, inspectorFolder, margin, leftEdge, panelSize = [0, 0], dataSize = [0, 0];

var exp_conv = 'var sTime = marker.key(\'Start\').time;\r\nvar eTime = marker.key(\'End\').time;\r\nvar totalTime = Math.max(eTime - sTime, 0);\r\nvar countTime = Math.max(time - sTime, 0);\r\ncountTime = Math.min(countTime, eTime - sTime);\r\nvar counter = Math.round( countTime * 1000) + \'ms\';\r\nvar playIcon = (time > sTime && time < eTime) ? \'\\u25ba \' + counter : \'\\u25a0\';\r\n\r\nvar txtGroups = value.split(\'**\');\r\nvar groupArr = [];\r\n\r\nfor (var i = 1; i < txtGroups.length; i++) {\r\n\tvar groupLines = txtGroups[i].split(\'\\r\');\r\n\tgroupArr.push(\r\n\t\t\'\\u2261 \'+ groupLines[0].split(\':\')[1] + \' \\u2261\\r\' + \r\n\t\t\'Delay: \'+ Math.round((parseFloat(groupLines[1].split(\':\')[1]) - sTime) * 1000)  + \'ms\\t\\t\\t\' + \r\n\t\t\'Dur: \' + groupLines[2].split(\':\')[1] + \'\\r\' + \r\n\t\t\'\\u2302 Val: \' + groupLines[3].split(\':\')[1] + \'\\r\' + \r\n\t\tgroupLines[4]\r\n\t);\r\n}\r\n\r\nthisLayer.name + \'\\r\' + \t\t\t\t\/\/ layer name\r\n\'Total Dur: \' + Math.round(totalTime*1000) + \'ms\' + \'\\r\\r\' + \t\t\t\t\t\/\/ line 2 - duration\r\ngroupArr.join(\'\\r\\r\') + \r\n\r\n\'\\r\\r\u2013\u2013\u2013\\r\' + playIcon;';
var exp_counter = 'var sTime = marker.key("Start").time; var eTime = marker.key("End").time; var countTime = Math.max(time - sTime, 0); countTime = Math.min(countTime, eTime - sTime); var counter = Math.round( countTime * 1000); var playIcon = (time > sTime && time < eTime) ? "\u25ba " : "\u25a0 "; playIcon + counter + "ms";';

var icons = {																																		// icon string for retina icons
	build: ['104 26.478 104.82 32.260 104 38.043 116.39 35.565 115.56 40.521 123 32.260 115.56 24 116.39 28.956',
					'93 48 93 57 34 57 34 43 32 43 32 39 34 39 34 38 30 38 30 34 34 34 34 7 36 7 36 34 69 34 69 38 36 38 36 39 80 39 80 43 36 43 36 55 91 55 91 48 63 48 63 44 91 44 91 16 38 16 38 12 91 12 91 9 36 9 36 7 93 7 93 12 96 12 96 16 93 16 93 44 98 44 98 48 93 48',
					'45 23 91 23 91 27 45 27', '65 49 67 51 65 53 63 51', '76 17 78 19 76 21 74 19',
					'40 17 42 19 40 21 38 19', '85 49 89 49 87.66 51 89 53 85 53 86.33 51', '69 28 73 28 71.66 30 73 32 69 32 70.33 30',
					'50 28 54 28 52.66 30 54 32 50 32 51.33 30', '160 7 160 56 170 56 170 54 160 54 160 53 174 53 174 51 160 51 160 50 167 50 167 48 168 48 168 50 173 50 173 48 160 48 160 47 166 47 166 45 160 45 160 42 172 42 172 40 160 40 160 39 170 39 170 37 160 37 160 36 167 36 167 34 168 34 168 36 177 36 177 34 160 34 160 33 172 33 172 31 160 31 160 28 170 28 170 26 160 26 160 25 172 25 172 23 160 23 160 22 167 22 167 20 168 20 168 22 175 22 175 20 160 20 160 19 169 19 169 17 160 17 160 14 176 14 176 12 160 12 160 11 173 11 173 9 160 9 160 7 181 7 181 58 157 58 131 58 131 7 157 7 157 9 133 9 133 56 157 56 157 7'
]};


// ================ FUNCTIONS =============


/** Set the current comp to the var thisComp */
function setComp() {
  app.activeViewer.setActive();                             // activate the comp even if it isnt highlighted
  thisComp = app.project.activeItem;																						// stupid extendscript
  if (!thisComp || !(thisComp instanceof CompItem)) {														// Make sure a comp is selected
    alert("Gotta select a comp first");
    return false;
  }
  workStart = thisComp.workAreaStart;																						// set the workStart var
  workEnd = workStart + thisComp.workAreaDuration;															// set the workEnd var
  return true;
}


/** draw a text button with colored background
	@param {parentObj} object - ScriptUI group that holds the button
	@param {accentColor} color - background color
	@param {buttonText} string - button text
*/
function buttonColorText(parentObj, accentColor, buttonText) {
	var btn = parentObj.add('button', undefined, '', {name:'ok'});								// draw a regular button, make it pressable with ENTER key
			btn.fillBrush = btn.graphics.newBrush( btn.graphics.BrushType.SOLID_COLOR, hexToArray(accentColor));

			btn.text = buttonText;																			// text to uppercase

			btn.fillBrush = btn.graphics.newBrush(
				btn.graphics.BrushType.SOLID_COLOR, hexToArray(accentColor));						// button color to accent color
			btn.textPen = btn.graphics.newPen (
				btn.graphics.PenType.SOLID_COLOR,hexToArray('#ffffff'), 1);							// text color white
			btn.onDraw = gfxDraw;																											// do the drawing of the colors

	return btn;																																		// return the button for the listener

	function gfxDraw() {																													// func that does the drawing
		{ with (this) {
			graphics.drawOSControl();
			graphics.rectPath(0,0,size[0],size[1]);
			graphics.fillPath(fillBrush);
			if( text ) graphics.drawString(
				text,
				textPen,
				(size[0]-graphics.measureString (text,graphics.font,size[0])[0])/2,
				(size[1]-graphics.measureString (text,graphics.font,size[0])[1])/1.75,
				graphics.font);
		}}
	}
	function hexToArray(hexString) {																							// func that converts hex to AE color array
		var hexColor = hexString.replace('#', '');
		var r = parseInt(hexColor.slice(0, 2), 16) / 255,
				g = parseInt(hexColor.slice(2, 4), 16) / 255,
				b = parseInt(hexColor.slice(4, 6), 16) / 255;
		return [r, g, b, 1];
	}
}


/** draw a icon button with colored background
	@param {parentObj} object - ScriptUI group that holds the button
	@param {iconVec} string - svg coords as text string
	@param {iconColor} color - background color
	@param {size} array - button size
*/
function buttonColorVector(parentObj, iconVec, iconColor, size) {    /// from sketch
	var artSize = size;																														// defines the artsize before resizing the button container
	var vButton = parentObj.add('button', [0,0,size[0],size[1], undefined]);
			vButton.coord = vecToPoints(iconVec);
			vButton.fillColor = iconColor;
			vButton.onDraw = vecDraw;

			return vButton;

	function vecToPoints(vecCoord) {																							// func that converts SVG coords to ScriptUI coords
		var points = [];
		var n;

		for(var i = 0; i < vecCoord.length; i++) {      														// loop through the paths in a multi path icon
			var eachNum = vecCoord[i].split(' ');    																	// create an array of all the numbers
			var coordinates = [];
			var sets = [];

			for (var k = 0; k < eachNum.length; k+=2) {																// AI adds commas between coords, sketch just spaces
				sets.push(eachNum[k] + ',' + eachNum[k+1]);															// add pairs of numbers to an array
			}

			for (var j = 0; j < sets.length; j++) {																		// loop through all sets
				n = sets[j].split(',');																									// split each set apart
				coordinates[j] = n;
				coordinates[j][0] = (parseFloat(coordinates[j][0]));
				coordinates[j][1] = (parseFloat(coordinates[j][1]));
			}
		points.push(coordinates);																										// combine each x,y as a 2D array
		}
		return points;																															// return the 2D array
	}

	function hexToArray(hexString) {																							// func that converts hex to AE color array
		var hexColor = hexString.replace('#', '');
		var r = parseInt(hexColor.slice(0, 2), 16) / 255,
				g = parseInt(hexColor.slice(2, 4), 16) / 255,
				b = parseInt(hexColor.slice(4, 6), 16) / 255;
		return [r, g, b, 1];
	}
	function vecDraw() {																													// func that does the drawing
		with ( this ) {
			graphics.drawOSControl();

			// draw background
			graphics.rectPath(0,0,size[0],size[1]);
			graphics.fillPath(graphics.newBrush(graphics.BrushType.SOLID_COLOR, hexToArray(iconColor)));

			// draw shape
			for (var i = 0; i < coord.length; i++) {
				var line = coord[i];

				graphics.newPath();
				graphics.moveTo(line[0][0] + (size[0]/2 - artSize[0]/2), line[0][1]);
				for (var j = 0; j < line.length; j++) {
					graphics.lineTo(line[j][0] + (size[0]/2 - artSize[0]/2), line[j][1]);
				}
				graphics.fillPath(graphics.newBrush(graphics.BrushType.SOLID_COLOR, [1,1,1,0.75]));
			}
		}
	}
}


/** add start and end markers to the input layer
	@param {layer} object - comp layer object
	@param {startTime} float - time of first keyframe
	@param {endTime} float - time of last keyframe
*/
function setTimeMarkers(layer, startTime, endTime) {
		var layer_marker1 = new MarkerValue("Start");																// new marker object
			layer_marker1.eventCuePoint = true;
			var newMarkerParameters = new Object;
			layer_marker1.setParameters(newMarkerParameters);
			layer("ADBE Marker").setValueAtTime(startTime, layer_marker1);
		var layer_marker2 = new MarkerValue("End");
			layer_marker2.eventCuePoint = true;
			var newMarkerParameters = new Object;
			layer_marker2.setParameters(newMarkerParameters);
			layer("ADBE Marker").setValueAtTime(endTime, layer_marker2);
}


/** convert time to ms
	@param {time} float - time float value
*/
function timeToMs(time) {
	return Math.round(time * 1000) + 'ms';
}


/** create the master text layer, return text layer
	@param {p} array - of property objects
	@param {firstKeyTime} float - time of first keyframe
*/
function buildText_live(p, firstKeyTime) {
	var propStr = '';																																			// initialize propStr as empty string
	try{

	var dynText = thisComp.layers.addText("Spec Layer Name");															// create new text layer
			dynText.name = 'Spec Layer Name';																									// set the layer name
			dynText.comment = scriptName + '_data';																						// add a comment
	var dynText_TextProp = dynText("ADBE Text Properties")("ADBE Text Document");		// new text object
	var dynText_TextDocument = dynText_TextProp.value;																		// initialize dynText_TextDocument with values
			dynText_TextDocument.resetCharStyle();																						// reset all text values

		dynText_TextDocument.fontSize = Math.floor(dataSize[0] / 16);												// set font size
		dynText_TextDocument.font = "CourierNewPS-BoldMT";																	// set font
		dynText_TextDocument.applyFill = true;																							// apply color
		dynText_TextDocument.fillColor = [1,1,1];
		dynText_TextDocument.applyStroke = false;																						// no stroke
		dynText_TextDocument.justification = ParagraphJustification.LEFT_JUSTIFY;						// justify left
		dynText_TextDocument.tracking = -30;																								// set tracking
		if (parseFloat(app.version) >= 13.2 ) {
			dynText_TextDocument.verticalScale = 1;
			dynText_TextDocument.horizontalScale = 1;
			dynText_TextDocument.baselineShift = 0;
			dynText_TextDocument.tsume = 0;
		}

		for (var i = 0; i < p.length; i++) {																								// loop through collected props
			propStr += '**Name:' + p[i].name + '\n';																						// add prop name to text string
			propStr += 'Start:' + p[i].startTime + '\n';							// add start time
			propStr += 'Dur:' + timeToMs(p[i].dur) + '\n';																		// add duration
			propStr += 'Val:' + getValChange(p[i]) + '\n';																		// add value change
			propStr += getEase(p[i]) + '\n\n';																								// add interpolation value
		}

		dynText_TextProp.setValue(dynText_TextDocument);																		// apply text properties
		dynText_TextProp.setValue(propStr);																									// apply text string

	var manualLineHeight = 10;																														// define manualLineHeight
	var lineHeight = dynText("ADBE Text Properties")(4).addProperty("ADBE Text Animator");// create a new text animator
			lineHeight.name = 'Line Height';																									// name it line height
			lineHeight("ADBE Text Animator Properties").addProperty("ADBE Text Line Spacing");// add a Line Spacing element
			lineHeight(1).addProperty("ADBE Text Selector");																	// add a selector
			lineHeight(2)("ADBE Text Line Spacing").setValue([0,manualLineHeight]);						// set value


	//// Transforms
		dynText("ADBE Transform Group")("ADBE Anchor Point").setValue([0, -dynText_TextDocument.fontSize*0.82, 0]);
		dynText("ADBE Transform Group")("ADBE Position").setValue([leftEdge, margin, 0]);

		return dynText;

		} catch(e) {
			alert(e.toString() + "\nError on line: " + e.line.toString());
		}
}
function buildText_basic(p, firstKeyTime) {
	var propStr = '';																																			// initialize propStr as empty string
	try{

	var dynText = thisComp.layers.addText("Spec Layer Name");															// create new text layer
		dynText.name = 'Spec Layer Name';																									// set the layer name
		dynText.comment = scriptName + '_data';																						// add a comment
	var dynText_TextProp = dynText("ADBE Text Properties")("ADBE Text Document");		// new text object
	var dynText_TextDocument = dynText_TextProp.value;																		// initialize dynText_TextDocument with values
		dynText_TextDocument.resetCharStyle();																						// reset all text values

		dynText_TextDocument.fontSize = Math.floor(dataSize[0] / 16);												// set font size
		dynText_TextDocument.font = "CourierNewPS-BoldMT";																	// set font
		dynText_TextDocument.applyFill = true;																							// apply color
		dynText_TextDocument.fillColor = [1,1,1];
		dynText_TextDocument.applyStroke = false;																						// no stroke
		dynText_TextDocument.justification = ParagraphJustification.LEFT_JUSTIFY;						// justify left
		dynText_TextDocument.tracking = -30;																								// set tracking
		if (parseFloat(app.version) >= 13.2 ) {
			dynText_TextDocument.verticalScale = 1;
			dynText_TextDocument.horizontalScale = 1;
			dynText_TextDocument.baselineShift = 0;
			dynText_TextDocument.tsume = 0;
		}

		propStr += 'Spec Layer Name\n';
		propStr += 'Total Dur: ' + timeToMs(p[0].totalDur) + '\n\n';

		propStr += buildTextBlock(p);

		dynText_TextProp.setValue(dynText_TextDocument);																		// apply text properties
		dynText_TextProp.setValue(propStr);																									// apply text string

	var manualLineHeight = 10;																														// define manualLineHeight
	var lineHeight = dynText("ADBE Text Properties")(4).addProperty("ADBE Text Animator");// create a new text animator
			lineHeight.name = 'Line Height';																									// name it line height
			lineHeight("ADBE Text Animator Properties").addProperty("ADBE Text Line Spacing");// add a Line Spacing element
			lineHeight(1).addProperty("ADBE Text Selector");																	// add a selector
			lineHeight(2)("ADBE Text Line Spacing").setValue([0,manualLineHeight]);						// set value


	//// Transforms
		dynText("ADBE Transform Group")("ADBE Anchor Point").setValue([0, -dynText_TextDocument.fontSize*0.82, 0]);
		dynText("ADBE Transform Group")("ADBE Position").setValue([leftEdge, margin, 0]);

		return dynText;

		} catch(e) {
			alert(e.toString() + "\nError on line: " + e.line.toString());
		}
}
function buildText_plain(str) {
	var propStr = str;																																			// initialize propStr as empty string
	try{

	var dynText = thisComp.layers.addText("Spec Layer Name");															// create new text layer
		dynText.name = 'Spec Layer Name';																									// set the layer name
		dynText.comment = scriptName + '_data';																						// add a comment
	var dynText_TextProp = dynText("ADBE Text Properties")("ADBE Text Document");		// new text object
	var dynText_TextDocument = dynText_TextProp.value;																		// initialize dynText_TextDocument with values
		dynText_TextDocument.resetCharStyle();																						// reset all text values

		dynText_TextDocument.fontSize = Math.floor(dataSize[0] / 16);												// set font size
		dynText_TextDocument.font = "CourierNewPS-BoldMT";																	// set font
		dynText_TextDocument.applyFill = true;																							// apply color
		dynText_TextDocument.fillColor = [1,1,1];
		dynText_TextDocument.applyStroke = false;																						// no stroke
		dynText_TextDocument.justification = ParagraphJustification.LEFT_JUSTIFY;						// justify left
		dynText_TextDocument.tracking = -30;																								// set tracking
		if (parseFloat(app.version) >= 13.2 ) {
			dynText_TextDocument.verticalScale = 1;
			dynText_TextDocument.horizontalScale = 1;
			dynText_TextDocument.baselineShift = 0;
			dynText_TextDocument.tsume = 0;
		}

		dynText_TextProp.setValue(dynText_TextDocument);																		// apply text properties
		dynText_TextProp.setValue(propStr);																									// apply text string

	var manualLineHeight = 10;																														// define manualLineHeight
	var lineHeight = dynText("ADBE Text Properties")(4).addProperty("ADBE Text Animator");// create a new text animator
			lineHeight.name = 'Line Height';																									// name it line height
			lineHeight("ADBE Text Animator Properties").addProperty("ADBE Text Line Spacing");// add a Line Spacing element
			lineHeight(1).addProperty("ADBE Text Selector");																	// add a selector
			lineHeight(2)("ADBE Text Line Spacing").setValue([0,manualLineHeight]);						// set value


	//// Transforms
		dynText("ADBE Transform Group")("ADBE Anchor Point").setValue([0, -dynText_TextDocument.fontSize*0.82, 0]);
		dynText("ADBE Transform Group")("ADBE Position").setValue([leftEdge, margin, 0]);

		return dynText;

		} catch(e) {
			alert(e.toString() + "\nError on line: " + e.line.toString());
		}
}

function buildTextBlock(p, op_firstKeyTime) {
	var firstKeyTime = p.firstKeyTime;
	var str = '';
	for (var j = 0; j < p.layers.length; j++) {																								// loop through collected props
		layer = p.layers[j];
		str += '\u2261 ' + layer.name + ' \u2261\n';																						// add prop name to text string

		for (var i = 0; i < layer.props.length; i++) {
			prop = layer.props[i];
			str += '- ' + prop.name + ' -\n';
			// str += 'Start: ' + timeToMs(prop.startTime) + '\n';							// add start time
			str += 'Delay: ' + timeToMs(prop.startTime - firstKeyTime) + '\n';
			str += 'Dur: ' + timeToMs(prop.dur) + '\n';
			str += 'Val: ' + getValChange(prop) + '\n';
			str += getEase(prop) + '\n\n';		// add interpolation value
		}
	}

	return str;
}
function getKeyRange() {
    var firstKeyTime = 9999999;
    var lastKeyTime = 0;


    for (var i = 0; i < thisComp.selectedLayers.length; i++) {
        var layer = thisComp.selectedLayers[i];
        for (var j = 0; j < layer.selectedProperties.length; j++) {
            var prop = layer.selectedProperties[j];
            for (var k = 0; k < prop.selectedKeys.length; k++) {
                var key = prop.selectedKeys[k];
                // alert(prop.keyTime(key))

                firstKeyTime = Math.min(firstKeyTime, prop.keyTime(key));							// set firstKeyTime to first keyframe's start time
				lastKeyTime = Math.max(lastKeyTime, prop.keyTime(key));
            }
        }
    }
    return [firstKeyTime, lastKeyTime];
}
function getPropObj(opt_propObj) {
	if (opt_propObj == undefined) {
		propCollect = [],
		firstKeyTime = 9999999,
		lastKeyTime = 0;

		var propObj = {
			firstKeyTime: 9999999,
			lastKeyTime: 0,
			layers: [],
		}
	} else {
		propObj = opt_propObj;
	}


	app.activeViewer.setActive();													// set the viewer to active
	if (!setComp()) {return;}         												// check if theres a comp selected, stop if not
	var selectedLayers = thisComp.selectedLayers;

	try {                         													// error check that keys are selected
		for (var i = 0; i < selectedLayers.length; i++) {							// loop through all selected layers
			var alreadyInList = false;
			for (var k = 0; k < propObj.layers.length; k++) {						// loop through all layers already in the list
				if (selectedLayers[i].index == propObj.layers[k].index) {			// is this new layer in the list?

					var selectedProps = getProps(selectedLayers[i]);
					var alreadyInPropList = false;
					for (var m = 0; m < selectedProps.length; m++) {				// add each property to the layer in the list
						for (var n = 0; n < propObj.layers[k].props.length; n++) {	// check that the property isn't already in the property list
							if (propObj.layers[k].props[n].obj.matchName == selectedProps[m].obj.matchName) {
								alreadyInPropList = true;
								break;
							}
						}
						if (!alreadyInPropList) {
							propObj.layers[k].props.push(selectedProps[m]);
						}
					}

					alreadyInList = true;
					break;
				}
			}
			if (!alreadyInList) {													// add a new layer's properties to the list
				layer = selectedLayers[i];
				propObj.layers.push({
					name: layer.name,
					index: layer.index,
					props: getProps(layer),
				})
			}
		}
	} catch (e) {
		alert('Select some keyframes dude.');										// error alerts to select keys
		return;																																		// exit this mess
	}

	propObj.firstKeyTime = firstKeyTime;
	propObj.lastKeyTime = lastKeyTime;

	return propObj;

	function getProps(layer) {
		var propCollect = [];

		for (var k = 0; k < layer.selectedProperties.length; k++) {												// loop through selected properties
			prop = layer.selectedProperties[k];
			if (prop.canVaryOverTime &&
				prop.selectedKeys.length > 1) {  										// check if selected prop is keyframable
				var selKeys = prop.selectedKeys;												// set var to store selectedKey indices

				for (var m = 0; m < selKeys.length-1; m++) {
					propCollect.push( {
						obj: prop,
						threeDLayer: layer.threeDLayer || (layer instanceof CameraLayer),
						propertyValueType: prop.propertyValueType,
						name: prop.name,
						dur: prop.keyTime(selKeys[m+1]) - prop.keyTime(selKeys[m]),
						// val: 0,
						startTime: prop.keyTime(selKeys[m]),
						startValue: prop.keyValue(selKeys[m]),
						startTemporalEase: prop.keyOutTemporalEase(selKeys[m])[0],
						startEaseType: prop.keyOutInterpolationType(selKeys[m]),
						endTime: prop.keyTime(selKeys[m+1]),
						endValue: prop.keyValue(selKeys[m+1]),
						endTemporalEase: prop.keyInTemporalEase(selKeys[m+1])[0],
						endEaseType: prop.keyInInterpolationType(selKeys[m+1]),
						duration: prop.keyTime(selKeys[m+1]) - prop.keyTime(selKeys[m]),
					} );
				}
				firstKeyTime = Math.min(firstKeyTime, propCollect[0].startTime);							// set firstKeyTime to first keyframe's start time
				lastKeyTime = Math.max(lastKeyTime, propCollect[propCollect.length-1].endTime);
			}
		}

		return propCollect;
	}

}
function getPropData() {
	var selectedProperties = [],
	propCollect = [],
	firstKeyTime = 0,
	lastKeyTime = 0;

	app.activeViewer.setActive();																								// set the viewer to active
	if (!setComp()) {return;}         																					// check if theres a comp selected, stop if not
	var selectedLayers = thisComp.selectedLayers;																// store selected layers

	try {                         																							// error check that keys are selected
		for (var i = 0; i < selectedLayers.length; i++) {													// loop through all selected layers
			for (var j = 0; j < selectedLayers[i].selectedProperties.length; j++) {	// loop through selected properties on selected layers
				selectedProperties.push(selectedLayers[i].selectedProperties[j]);			// store selected properties
			}
		}
	} catch (e) {
		alert('Select some keyframes dude.');																			// error alerts to select keys
		return;																																		// exit this mess
	}

	//// get the props as an array of objects
	for (var k = 0; k < selectedProperties.length; k++) {												// loop through selected properties
		if (selectedProperties[k].canVaryOverTime &&
				selectedProperties[k].selectedKeys.length > 1) {  										// check if selected prop is keyframable
			var selKeys = selectedProperties[k].selectedKeys;												// set var to store selectedKey indices
		for (var m = 0; m < selKeys.length-1; m++) {
			propCollect.push( {
				obj: selectedProperties[k],
				propertyValueType: selectedProperties[k].propertyValueType,
				name: selectedProperties[k].name,
				dur: selectedProperties[k].keyTime(selKeys[m+1]) - selectedProperties[k].keyTime(selKeys[m]),
				val: 0,
				startTime: selectedProperties[k].keyTime(selKeys[m]),
				startValue: selectedProperties[k].keyValue(selKeys[m]),
				startTemporalEase: selectedProperties[k].keyOutTemporalEase(selKeys[m])[0],
				startEaseType: selectedProperties[k].keyOutInterpolationType(selKeys[m]),
				endTime: selectedProperties[k].keyTime(selKeys[m+1]),
				endValue: selectedProperties[k].keyValue(selKeys[m+1]),
				endTemporalEase: selectedProperties[k].keyInTemporalEase(selKeys[m+1])[0],
				endEaseType: selectedProperties[k].keyInInterpolationType(selKeys[m+1]),
				duration: selectedProperties[k].keyTime(selKeys[m+1]) - selectedProperties[k].keyTime(selKeys[m]),
			} );
		}
			lastKeyTime = Math.max(lastKeyTime, propCollect[propCollect.length-1].endTime);
		}
	}

	//// sort the props by start time
	propCollect.sort(function (a, b) {
		if (a.startTime > b.startTime) {
			return 1;
		}
		if (a.startTime < b.startTime) {
			return -1;
		}
		return 0;
	});

	try {
		firstKeyTime = propCollect[0].startTime;
		propCollect[propCollect[0].firstKeyTime = firstKeyTime];
		propCollect[propCollect[0].lastKeyTime = lastKeyTime];
		propCollect[propCollect[0].totalDur = lastKeyTime - firstKeyTime];
	} catch (e) { alert('Select keyframe pairs to build a spec'); return;}

	layerData = {
		propCollect: propCollect,
		firstKeyTime: firstKeyTime,
		lastKeyTime: lastKeyTime,
	}
	return layerData;
}
function getPropText(propObj) {
	var propStr = '';

	propStr += 'Total Dur: ' + timeToMs(propObj.lastKeyTime - propObj.firstKeyTime) + '\n\n';

	propStr += buildTextBlock(propObj);

	return propStr;
}

/** create the master text layer, return text layer
	@param {p} array - of property objects
	@param {firstKeyTime} float - time of first keyframe
*/
function buildCounter() {
	try{

	var dynText = thisComp.layers.addText("Spec Name");																		// create new text layer
			dynText.name = 'Counter';																													// set the layer name
			dynText.comment = scriptName + '_data';																						// add a comment
	var dynText_TextProp = dynText("ADBE Text Properties")("ADBE Text Document");		// new text object
	var dynText_TextDocument = dynText_TextProp.value;																		// initialize dynText_TextDocument with values
			dynText_TextDocument.resetCharStyle();																						// reset all text values

		dynText_TextDocument.fontSize = thisComp.width/30;												// set font size
		dynText_TextDocument.font = "CourierNewPS-BoldMT";																	// set font
		dynText_TextDocument.applyFill = true;																							// apply color
		dynText_TextDocument.fillColor = [0.5,0.5,0.5];
		dynText_TextDocument.applyStroke = false;																						// no stroke
		dynText_TextDocument.justification = ParagraphJustification.LEFT_JUSTIFY;						// justify left
		dynText_TextDocument.tracking = -30;																								// set tracking
		if (parseFloat(app.version) >= 13.2 ) {
			dynText_TextDocument.verticalScale = 1;
			dynText_TextDocument.horizontalScale = 1;
			dynText_TextDocument.baselineShift = 0;
			dynText_TextDocument.tsume = 0;
		}

		dynText_TextProp.setValue(dynText_TextDocument);																		// apply text properties
		dynText_TextProp.setValue('\u25ba');																											// apply text string

	var manualLineHeight = 10;																														// define manualLineHeight
	var lineHeight = dynText("ADBE Text Properties")(4).addProperty("ADBE Text Animator");// create a new text animator
			lineHeight.name = 'Line Height';																									// name it line height
			lineHeight("ADBE Text Animator Properties").addProperty("ADBE Text Line Spacing");// add a Line Spacing element
			lineHeight(1).addProperty("ADBE Text Selector");																	// add a selector
			lineHeight(2)("ADBE Text Line Spacing").setValue([0,manualLineHeight]);						// set value


	//// Transforms
		dynText("ADBE Transform Group")("ADBE Position").setValue([100, 100]);

		return dynText;

		} catch(e) {
			alert(e.toString() + "\nError on line: " + e.line.toString());
		}
}


/** calculate and return cubic bezier text string
	@param {activeProp} obj - property object
*/
function getEase(activeProp) {
	try{
	var dims = (activeProp.obj.value instanceof Array) ? activeProp.obj.value.length : 1;	// count the property dimension
	var k1 = activeProp.startValue;																												// initalize first key
	var k2 = activeProp.endValue;																													// initalize last key

	var change = (dims == 1 || activeProp.propertyType == PropertyType.PROPERTY) ? k2 - k1 : Math.sqrt( Math.pow(k2[0] - k1[0], 2) + Math.pow(k2[1] - k1[1], 2) );
	var keyOutSp = (activeProp.startTemporalEase.speed < 0) ? activeProp.startTemporalEase.speed : -activeProp.startTemporalEase.speed;
	var y1Mult = (activeProp.startTemporalEase.speed < 0) ? 1 : -1;
	var keyInSp = (activeProp.endTemporalEase.speed < 0) ? activeProp.endTemporalEase.speed : -activeProp.endTemporalEase.speed;
	var y2Mult = (activeProp.endTemporalEase.speed > 0) ? 1 : -1;

	var x1 = activeProp.startTemporalEase.influence/100;
	var y1 = ((keyOutSp * x1) * activeProp.duration/change) * y1Mult;
	var x2 = 1 - activeProp.endTemporalEase.influence/100;
	var y2 = 1 - ((keyInSp * (x2-1)) * activeProp.duration/change) * y2Mult;


	//// check type of keys
	if (activeProp.startEaseType == KeyframeInterpolationType.LINEAR && activeProp.endEaseType == KeyframeInterpolationType.LINEAR) {
	  return 'Linear';																																			// return if linear keys
  } else if (activeProp.startEaseType == KeyframeInterpolationType.HOLD){
	  return 'Hold';																																		// return if no change
	} else if (isNaN(y1)){
	  return 'No Change';																																		// return if no change
	} else {
	  return '(' + round(x1) + ', ' + round(y1) + ', ' + round(x2) + ', ' + round(y2) + ')';// return cubic bezier string
	}
	}catch(e) {return '()'}																																	// error catch returns ()
}


/** dup comp, resize new comp, add panel
	@param {work_comp} obj - comp object
*/
function resizeCompNew(work_comp) {
	for (var i = 1; i <= work_comp.layers.length; i++) {
		if (thisComp.layers[i].comment === scriptName + '_panel') {														// skip all this if there's already a panel layer
			return;
		}
	}

	var currentTime = thisComp.time;                																				// get the current playhead time
	createISTfolder();																																			// make a new folder to store spec comps

	thisComp = work_comp.duplicate();																												// duplicate comp
	thisComp.parentFolder = inspectorFolder;																								// move new comp to IST folder
	thisComp.name = work_comp.name + '_Spec';																								// rename duped comp
	thisComp.openInViewer();																																// open new comp

	var compSize = [thisComp.width, thisComp.height];																				// init compSize from new comp

	panelSize = [Math.floor(thisComp.height/3), thisComp.height];														// set panelSize
	leftEdge = thisComp.width;																															// set leftEdge

	thisComp.width = leftEdge + panelSize[0];																								// resize comp

	try {
		var compInfo = thisComp.layers.addShape();																						// create info panel backing layer
			compInfo.name = 'Spec Panel 1';																											// name panel layer
			compInfo.comment = scriptName + '_panel';																						// comment panel layer
			compInfo.label = 0;																																	// set layer label to grey
			compInfo("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
			compInfo("ADBE Root Vectors Group")(1).name = "Rectangle 1";
			compInfo("ADBE Root Vectors Group")(1)(2).addProperty("ADBE Vector Shape - Rect");
			compInfo("ADBE Root Vectors Group")(1)(2)(1)("ADBE Vector Rect Size").setValue(panelSize);
			compInfo("ADBE Root Vectors Group")(1)(2)(1)("ADBE Vector Rect Position").setValue( panelSize/2 );
			compInfo("ADBE Root Vectors Group")(1)(2).addProperty("ADBE Vector Graphic - Stroke");
			compInfo("ADBE Root Vectors Group")(1)(2)(2).enabled = false;
			compInfo("ADBE Root Vectors Group")(1)(2)(2)("ADBE Vector Stroke Width").setValue(6);
			compInfo("ADBE Root Vectors Group")(1)(2).addProperty("ADBE Vector Graphic - Fill");
			compInfo("ADBE Root Vectors Group")(1)(2)(3)("ADBE Vector Fill Color").setValue([0.08203125, 0.5625, 0.91796875, 1]);
			compInfo("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
			compInfo("ADBE Root Vectors Group")(2).name = "Admin";
			compInfo("ADBE Root Vectors Group")(2)(3)("ADBE Vector Scale").setValue(panelSize);
			compInfo("ADBE Transform Group")("ADBE Position").setValue([leftEdge, 0]);
	} catch(e) {
		alert(e.toString() + "\nError on line: " + e.line.toString());
	}

	margin = Math.floor(panelSize[0] / 18);																									// update positioning variables
	panelSize -= margin*2;
	leftEdge += margin;
}


/** round input to maximum number if decimal places, or int
	@param {value} float - comp object
	@param {opt_decimals} int - comp object
*/
function round(value, opt_decimals) {
	// if (value instanceof Array) {alert('ggggg')}
	try{
		var decimals = (opt_decimals !== undefined) ? opt_decimals : 2;       // default to 2 decimal places if nothing is specified
		return parseFloat(value.toFixed(decimals));
	} catch (e) {
		return value;
	}
}

/** create a SPEC folder if one doesn't exist */
function createISTfolder() {
	var hasRedlineFolder = false;																										// initialize var with false
	for (var i = 1; i <= app.project.numItems; i++) {																// loop through all project items
		if (app.project.item(i) instanceof FolderItem) {															// find folders
			if (app.project.item(i).name == scriptName) { 															// check if it's name matches the script name
				hasRedlineFolder = true;																									// set the var to true
				inspectorFolder = app.project.item(i);																		// set the inspectorFolder var to the found folder
				break;																																		// stop all that looping
			}
		}
	}
	if (!hasRedlineFolder) {																												// if no spec folder is found
		inspectorFolder = app.project.items.addFolder(scriptName);										// create spec folder
	}
}


/** get the size of the current info panel */
function getPanelSize() {
	for(var i = 1; i <= thisComp.layers.length; i++) {																							// loop through layers
		if (thisComp.layer(i).comment == scriptName + '_panel') {																			// if layer has a panel comment
			panelSize = thisComp.layer(i)("ADBE Root Vectors Group")(2)(3)("ADBE Vector Scale").value;	// update vars
			margin = Math.floor(panelSize[0] / 18)
			leftEdge = thisComp.layer(i)("ADBE Transform Group")("ADBE Position").value[0] + margin;
			dataSize = [panelSize[0] - margin*2, panelSize[1] - margin*2];
			return;																																											// stop looping
		}
	}
}


/** filtering func that checks the property match name then feeds the prop to the appropriate value func
	@param {activeProp} obj - current property
*/
function getValChange(activeProp) {
	switch (activeProp.obj.matchName) {						// check the property match name
		case 'ADBE Scale':													// is Scale
			return valScale(activeProp);
			break;
		case 'ADBE Position_0':											// is seperated X position
			return valXPosition(activeProp);
			break;
		case 'ADBE Position_1':											// is seperated Y position
			return valXPosition(activeProp);
			break;
		case 'ADBE Position':												// is Position array
			return valPosition(activeProp);
			break;
		case 'ADBE Rotate Z':												// is Rotation
			return valRotation(activeProp);
			break;
		case 'ADBE Opacity':												// is Opacity
			return valOpacity(activeProp);
			break;
		case 'ADBE Mask Shape':											// is a Mask
			return 'Mask data unsupported';
			break;
		case 'ADBE Vector Shape':										// is a Path
			return 'Path data unsupported';
			break;
		default:																		// is anything else
			return valGeneric(activeProp);
	}
}

/** returns the position value change
	@param {activeProp} obj - current property
*/
function valPosition(activeProp) {
	var a = activeProp.startValue;																											// get the first key value
	var b = activeProp.endValue;																												// get the last key value

	var pixelMult = ddl_resolution.selection.index+1;																		// the pixel multiplier for distance in DP

	//// distance vs abs position values
	if (activeProp.threeDLayer) {
		return ('['+Math.round(a[0])+','+Math.round(a[1])+','+Math.round(a[2])+']››['+
					Math.round(b[0])+','+Math.round(b[1])+','+Math.round(b[2])+']');				// return coodinates																						// return distance with dp
	} else {
		return ('['+Math.round(a[0])+','+Math.round(a[1])+']››['+
					Math.round(b[0])+','+Math.round(b[1])+']');				// return coodinates
	}
}

/** returns the position value change for a seperated position value
	@param {activeProp} obj - current property
*/
function valXPosition(activeProp) {
	var a = activeProp.startValue;																											// get the first key value
	var b = activeProp.endValue;																												// get the last key value

	var pixelMult = ddl_resolution.selection.index+1;																		// the pixel multiplier for distance in DP

	//// distance vs abs position values
	if (rad_pos.children[1].value) {																					          // distance selected
		var vectDist = (b - a) / pixelMult;																								// calc the distance
		return (Math.round(vectDist) + 'dp');																							// return distance with dp
	} else {
		return (round(a, 2) + '››' + round(b, 2) );																				// return coodinates
	}
}


/** returns the opacity value change
	@param {activeProp} obj - current property
*/
function valOpacity(activeProp) {
	var a = activeProp.startValue;																											// get the first key value
	var b = activeProp.endValue;																												// get the last key value
	return (round(a, 2) + '% ››› ' + round(b, 2) + '%');																// return opacity percentage
}


/** returns the rotation value change
	@param {activeProp} obj - current property
*/
function valRotation(activeProp) {
	var a = activeProp.startValue;																											// get the first key value
	var b = activeProp.endValue;																												// get the last key value
	return round(a) + '° ››› ' + round(b) + '°';																				// return rotation degrees
}


/** returns the scale value change
	@param {activeProp} obj - current property
*/
function valScale(activeProp) {
	var a = activeProp.startValue;																											// get the first key value
	var b = activeProp.endValue;																												// get the last key value

	var single = (round(a[0])==round(a[1])&&round(b[0])==round(b[1]))?true:false;				// check if the x and y values match

	if (single) {																																				// if values match
		return (round(a[0]) + '% ›› ' + round(b[0]) + '%');																// print single vals with percentage
	} else {
		return ('['+round(a[0])+','+round(a[1])+']%››['+round(b[0])+','+round(b[1])+']%');// print arrays
	}
}


/** returns the raw value change
	@param {activeProp} obj - current property
*/
function valGeneric(activeProp) {
	var a = activeProp.startValue;																											// get the first key value
	var b = activeProp.endValue;																												// get the last key value

	if (a instanceof Array) {																														// it's an array value
		var single=(round(a[0])==round(a[1])&&round(b[0])==round(b[1]))?true:false;				// check if the x and y values match

		if (activeProp.threeDLayer) {
			return ('['+Math.round(a[0])+','+Math.round(a[1])+','+Math.round(a[2])+']››['+
						Math.round(b[0])+','+Math.round(b[1])+','+Math.round(b[2])+']');				// return coodinates
		} else if (single) {																																			// if values match
			return (round(a[0]) + ' ›› ' + round(b[0]) );																		// print single vals with percentage
		} else {
			return ('['+round(a[0],0)+','+round(a[1],0)+']››['
								 +round(b[0],0)+','+round(b[1],0)+']');																// returns array
		}
	} else {																																						// its not an array value
		return (round(a, 2).toString() + '››' + round(b, 2).toString());									// return value
	}
}




/** create an isolation layer **/
function buildIsoLayer(opt_selectedLayers) {
	var isolationLayer = thisComp.layers.addShape();
			isolationLayer.name = '\u2193\u2193 Isolation \u2193\u2193';
			isolationLayer.label = 0;
			isolationLayer.adjustmentLayer = true;
			isolationLayer("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
			isolationLayer("ADBE Root Vectors Group")(1).name = "Rectangle 1";
			isolationLayer("ADBE Root Vectors Group")(1)(2).addProperty("ADBE Vector Shape - Rect");
			isolationLayer("ADBE Root Vectors Group")(1)(2)(1)("ADBE Vector Rect Size").setValue([thisComp.width, thisComp.height]);
			isolationLayer("ADBE Root Vectors Group")(1)(2).addProperty("ADBE Vector Graphic - Stroke");
			isolationLayer("ADBE Root Vectors Group")(1)(2)(2).enabled = false;
			isolationLayer("ADBE Root Vectors Group")(1)(2)(2)("ADBE Vector Stroke Width").setValue(3);
			isolationLayer("ADBE Root Vectors Group")(1)(2).addProperty("ADBE Vector Graphic - Fill");
			isolationLayer("ADBE Root Vectors Group")(1)(2)(3)("ADBE Vector Fill Color").setValue([0,0,0,1]);
			isolationLayer("ADBE Effect Parade").addProperty("ADBE Tint");
			isolationLayer("ADBE Effect Parade")(1)("ADBE Tint-0001").setValue([0.3,0.3,0.3,1]);
			isolationLayer("ADBE Effect Parade")(1)("ADBE Tint-0002").setValue([0.35,0.35,0.35,1]);
}


/** create a shape layer pointer **/
function buildPointer() {
	try{
	if (leftEdge == undefined) {alert('Gotta create a spec panel first.'); return;}

	var pointer1 = thisComp.layers.addShape();																																			// new shape layer
			pointer1.name = "Pointer 1";																																								// name shape layer
			pointer1.label = 2;																																													// set label color
			pointer1("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
			pointer1("ADBE Root Vectors Group")(1).name = "Pointer";
			pointer1("ADBE Root Vectors Group")(1)(2).addProperty("ADBE Vector Shape - Rect");
			pointer1("ADBE Root Vectors Group")(1)(2).addProperty("ADBE Vector Filter - Trim");
			pointer1("ADBE Root Vectors Group")(1)(2)(2)("ADBE Vector Trim End").setValue(25);
			pointer1("ADBE Root Vectors Group")(1)(2)(2)("ADBE Vector Trim Offset").setValue(-90);
			pointer1("ADBE Root Vectors Group")(1)(2).addProperty("ADBE Vector Graphic - G-Fill");
			pointer1("ADBE Root Vectors Group")(1)(2)(3).enabled = false;
			pointer1("ADBE Root Vectors Group")(1)(3)("ADBE Vector Anchor").setValue([0,-50]);
			pointer1("ADBE Root Vectors Group")(1)(3)("ADBE Vector Position").setValue([-580,0]);
			pointer1("ADBE Root Vectors Group")(1)(3)("ADBE Vector Scale").setValue([100,100]);
			pointer1("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
			pointer1("ADBE Root Vectors Group")(2).name = "Arm";
			pointer1("ADBE Root Vectors Group")(2)(2).addProperty("ADBE Vector Shape - Rect");
			pointer1("ADBE Root Vectors Group")(2)(2).addProperty("ADBE Vector Filter - Trim");
			pointer1("ADBE Root Vectors Group")(2)(2)(2)("ADBE Vector Trim End").setValue(50);
			pointer1("ADBE Root Vectors Group")(2)(2)(2)("ADBE Vector Trim Offset").setValue(180);
			pointer1("ADBE Root Vectors Group")(2)(2).addProperty("ADBE Vector Graphic - G-Fill");
			pointer1("ADBE Root Vectors Group")(2)(2)(3).enabled = false;
			pointer1("ADBE Root Vectors Group")(2)(3)("ADBE Vector Anchor").setValue([50,-50]);
			pointer1("ADBE Root Vectors Group")(2)(3)("ADBE Vector Scale").setValue([564,349]);
			pointer1("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
			pointer1("ADBE Root Vectors Group")(3)("ADBE Vector Stroke Width").setValue(6);
			pointer1("ADBE Root Vectors Group")(3)("ADBE Vector Stroke Color").setValue([0.4795,0.4795,0.4795,1]);
			pointer1("ADBE Effect Parade").addProperty("ADBE Point Control");
			pointer1("ADBE Effect Parade")(1).name = "Arm Length";
			pointer1("ADBE Effect Parade")(1)("ADBE Point Control-0001").setValue([775,200]);
			pointer1("ADBE Effect Parade").addProperty("ADBE Slider Control");
			pointer1("ADBE Effect Parade")(2).name = "Pointer Size";
			pointer1("ADBE Effect Parade")(2)("ADBE Slider Control-0001").setValue(200);
			pointer1("ADBE Transform Group")("ADBE Position").setValue([leftEdge - margin*2,192,0]);


		// Apply expressions to properties
		try {
			pointer1("ADBE Root Vectors Group")(1)(3)("ADBE Vector Position").expression = "p = effect(\"Arm Length\")(\"Point\");" + "\n" +
					"[-p[0], p[1]]";
			pointer1("ADBE Root Vectors Group")(1)(3)("ADBE Vector Scale").expression = "s = effect(\"Pointer Size\")(\"Slider\");" + "\n" +
					"[s, s]";
			pointer1("ADBE Root Vectors Group")(2)(3)("ADBE Vector Scale").expression = "effect(\"Arm Length\")(\"Point\")";
		} catch (err) {}

	} catch(e) {
		alert(e.toString() + "\nError on line: " + e.line.toString());
	}
}


/** create clickable web links from AE
    @param {url} string - web url
*/
function visitURL(url) {
	if ($.os.indexOf("Windows") != -1) {
		system.callSystem('cmd /c "' + Folder.commonFiles.parent.fsName + "\\Internet Explorer\\iexplore.exe" + '" ' + url);
	} else {
		var cmd = 'open "' + url + '"';
		system.callSystem(cmd);
	}
}


// _______ UI SETUP _______
// if the script is a Panel, (launched from the 'Window' menu), use it,
// else (launched via 'File/Scripts/Run script...') create a new window
// store it in the variable mainPalette
var mainPalette = thisObj instanceof Panel ? thisObj : new Window('palette', scriptName, undefined, {resizeable:true});

	//stop if there's no window
if (mainPalette === null) return;

	// set margins and alignment
	mainPalette.alignChildren = ['fill','fill'];
	// mainPalette.margins = 2;
	// mainPalette.spacing = 2;

// ============ ADD UI CONTENT HERE =================
var content = mainPalette.add('group');																																	// content group
		content.alignChildren = ['fill','fill'];
		content.orientation = 'column';
		// content.margins = 0;
		content.spacing = 5;

var btnLaunch = buttonColorVector(content, icons.build, '#5B8BA3', [224,64]);														// main button
	btnLaunch.maximumSize.height = 64;
	btnLaunch.minimumSize.height = 64;
	btnLaunch.helpTip = 'Select keyframe pairs to build spec panel';																		// tooltip

// var btn_dataPanel = buttonColorText(content, '#5B8BA3', 'Panel');															// button for isolation layer

var grp_options = content.add('group');
		grp_options.orientation = 'row';
		grp_options.alignChildren = ['fill', 'top'];
		grp_options.margins = 0;

var settings = grp_options.add('group');
		settings.alignment = 'fill';
		settings.alignChildren = ['fill', 'top'];
		settings.orientation = 'column';
		settings.margins = [0,6,0,0];

var grp_pos = settings.add('panel', undefined, 'Position');																						// radio pane for coods vs distance
	grp_pos.alignChildren = 'left';
	grp_pos.alignment = 'left';
	grp_pos.orientation = 'column';
	grp_pos.spacing = 0;
	grp_pos.margins = [8, 10, 0, 6];
	grp_pos.maximumSize.width = 110;
	grp_pos.minimumSize.width = 110;
var rad_pos = grp_pos.add('group');
var posCoord = rad_pos.add('radiobutton', undefined, 'Pixel');																	// radio coord
	posCoord.helpTip = 'Print position as pixel coordinates';																					// tooltip
var posDistance = rad_pos.add('radiobutton', undefined, 'DP');																	// radio distance
	posDistance.helpTip = 'Print position as dp movement';																						// tooltip
	posDistance.value = true;
var ddl_resolution = settings.add('dropdownlist', undefined, ['1x', '2x', '3x']);											// dropdown list for
	ddl_resolution.selection = 2;
	ddl_resolution.maximumSize.width = 110;
	ddl_resolution.minimumSize.width = 110;
	ddl_resolution.alignment = 'left';
	ddl_resolution.helpTip = 'Dp multiplier';																													// tooltip


var grp_buttons = grp_options.add('group');
	grp_buttons.alignChildren = ['fill', 'top'];
	grp_buttons.orientation = 'column';
	grp_buttons.margins = 0;
	grp_buttons.spacing = 1;
var btn_isolation = buttonColorText(grp_buttons, '#37474F', 'Iso Layer');															// button for isolation layer
		btn_isolation.helpTip = 'Create a color adjustment layer\nthe drag below targeted layers';				// tooltip
var btn_pointer = buttonColorText(grp_buttons, '#37474F', 'Pointer');																	// button for pointer layer
		btn_pointer.helpTip = 'Create an adjustable pointer \nline to connect text to element';						// tooltip
var btn_counter = buttonColorText(grp_buttons, '#37474F', 'Counter');																	// button for counter layer
		btn_counter.helpTip = 'Create text counter without building a spec';															// tooltip

var btn_aboutScript = buttonColorText(grp_buttons, '#263238', '?');
	btn_aboutScript.helpTip = 'About ' + scriptName;
	btn_aboutScript.minimumSize = [30, 30];
	btn_aboutScript.maximumSize = [30, 30];
	btn_aboutScript.alignment = ['right', 'bottom'];

	// ============ Button Functionality =================

posCoord.onClick = function() {
	ddl_resolution.visible =  false;
};
posDistance.onClick = function() {
	ddl_resolution.visible =  true;
};
btn_aboutScript.onClick = function() {
		var w = new Window ('dialog', 'About ' + scriptName);																// new dialog window
			w.spacing = 0;
			w.margins = 0;
		var content = w.add('group', undefined, '');																				// group to hold intry box
				content.alignChildren = ['fill','fill'];
				content.orientation = 'column';
				content.alignment = ['left', 'top'];
				content.margins = 16;
				content.spacing = 8;																														// content metrics

		var btn_url = buttonColorVector(content, icons.build, '#EF5350', [224,64]);

		content.add('statictext', [0,0,400,340],
			'Speed up the creation of animation specs for engineering while reducing miscommunication. One click to collect selected keyframe pair data to a text panel. Copy/paste this text out or build a panel along side the comp for easy reference.' +
			'\n\n' +
			'Usage:\n' +
			'• Click the big button to open the property collection panel. \n' +
			'• Additional key pairs will be added to the list, grouped by layer. The total duration and individual propery delays will update. \n' +
			'• Copy out this text or create a panel along side a duplicate of your comp. \n\n' +
			'Add ons:\n' +
			'• Pixel/DP: This data can be communicated as coordinates or in DP. Set the density dropdown based on resolution of your comp.\n' +
			'• ISO LAYER: Creates an adjustment layer below the selected layer to dims other layers. This allows layers to be hilighted while keeping things in context.\n' +
			'• POINTER: Creates an editable arrow to quickly draw a line from the text spec to on-screen element.\n\n' +
			scriptName +' - v'+ scriptVersion +' \nCreated by Adam Plouff at Google',
			{multiline: true});

		buttonColorText(content, '#406280', 'Close');
		btn_url.onClick = function() {
			visitURL('http://google.github.io/inspectorspacetime');
		}
		w.show();
}

btn_isolation.onClick = function() {
	setComp();

	app.beginUndoGroup('New Isolation Layer');
	buildIsoLayer();
	app.endUndoGroup();
};

btn_pointer.onClick = function() {
	setComp();
	getPanelSize();

	app.beginUndoGroup('New Pointer');
	buildPointer();
	app.endUndoGroup();
};

btn_counter.onClick = function() {
	setComp();
    // getPanelSize();
    var keyRange = getKeyRange();           // get selected keys range
    if (keyRange[0] == 9999999) { keyRange = [thisComp.time, thisComp.time + 1] }       // if no keys selected use the playhead time and playhead + 1:00

	app.beginUndoGroup('New Counter');
	var textLayer = buildCounter();																											// build text layer
	setTimeMarkers(textLayer, keyRange[0], keyRange[1]);										// set markers
	textLayer("ADBE Text Properties")("ADBE Text Document").expression = exp_counter;

	// close twirled layers
	app.executeCommand(2771);
	app.executeCommand(2771);
	app.endUndoGroup();
};

btnLaunch.onClick = function() {
	try {
	var w = new Window('palette', scriptName, undefined, {resizeable:true});
	w.alignChildren = ['fill', 'fill'];

	var propObj = getPropObj();
	var propText = getPropText(propObj);

	//// tabs
	var tpanel = w.add ('tabbedpanel');
		tpanel.alignChildren = ['fill', 'fill'];
		tpanel.minimumSize = [350,300];
		tpanel.maximumSize.height = 800;

	var tab_text = tpanel.add ('tab', undefined, 'Text');
		tab_text.alignChildren = ['fill', 'fill'];

	var textField = tab_text.add('edittext', undefined, '', {multiline: true});
		textField.text = propText;


	var tab_json = tpanel.add ('tab', undefined, 'JSON');
		tab_json.alignChildren = ['fill', 'fill'];

	var jsonField = tab_json.add('edittext', [0,0,350,300], '', {multiline: true});
		jsonField.text = JSON.stringify(propObj, replacer, 2);

	if (propObj.firstKeyTime == 9999999) { clearProps() }						// clear props if no keys selected on initialize

	//// buttons
	var buttons = w.add ('group');
		buttons.alignment = 'right';
		buttons.minimumSize.height = 28;
		buttons.maximumSize.height = 28;
	var btn_clearProp = buttons.add ('button', undefined, '⊗ Clear ⊗');
	var btn_addProp = buttons.add ('button', undefined, '↑ Add property ↑');
	var btn_newSidePanel = buttons.add ('button', undefined, '→ Create side panel →');

	btn_clearProp.onClick = function() {
		clearProps();
	}
	btn_addProp.onClick = function() {

		propObj = getPropObj(propObj);
		jsonField.text = JSON.stringify(propObj, replacer, 2);

		propText = getPropText(propObj);
		textField.text = propText;
	}

	btn_newSidePanel.onClick = function () {
		try {
		app.beginUndoGroup('Create ' + scriptName + 'Elements');										// start undo group

		resizeCompNew(thisComp);																											// resize the comp
		getPanelSize();																																// set the panel size in relation to the comp size

		buildText_plain(textField.text);

		// close twirled layers
		app.executeCommand(2771);
		app.executeCommand(2771);

		app.endUndoGroup();

		} catch(e) {alert(e.toString() + "\nError on line: " + e.line.toString()); }
	}

	/// json filter
	function replacer(key, val) {
		if (key === 'obj') return undefined;
		else return val;
	};
	function clearProps() {
		propObj = null;
		propText = null;

		jsonField.text = '';
		textField.text = '';
	}

	//// visibility
	// tpanel.selection = 1;
	w.layout.layout(true);
	w.layout.resize();
	w.onResizing = w.onResize = function () {w.layout.resize();};
	w.show ();
	} catch (e) { alert(e.toString() + "\nError on line: " + e.line.toString()); }
}


// ==================================================

//__________ SHOW UI ___________
{
	// Set layout, and resize it on resize of the Panel/Window
	mainPalette.layout.layout(true);
	mainPalette.layout.resize();
	mainPalette.onResizing = mainPalette.onResize = function () {mainPalette.layout.resize();};
	//if the script is not a Panel (launched from File/Scripts/Run script...) we need to show it
	if (!(mainPalette instanceof Panel)) mainPalette.show();
}
//______________________________

})(this);
