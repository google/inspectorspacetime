/**
 * Generates motion spec data to be rendered with the reference quicktime to share with ENG.
 * It's a stupid name with a reference to the short-lived NBC show Commpunity.
 *
 * inSPECtor SPACE+TIME = motion spec
 *
 * Current Version: 2.1 (March, 21 2019
 * Designed by: Adam Plouff (adamplouff@)
 *
 * Process:
 * • Select keyframe pairs
 * • Keys are collected
 * • Key info is gathered into one object per pair
 * • Key-pair-objs are sorted based on start tim
 * • Comp is duplicated
 * • Side panel is added
 * • Text layer is create
 * • Keys are filtered by property value type
 * • Keyframe data is added to a text string
 * • Start and End markers are added
 * • Raw text is styled by an expression
 */
(function (thisObj) {

var JSON;JSON||(JSON={}); (function(){function k(a){return a<10?"0"+a:a}function o(a){p.lastIndex=0;return p.test(a)?'"'+a.replace(p,function(a){var c=r[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function l(a,j){var c,d,h,m,g=e,f,b=j[a];b&&typeof b==="object"&&typeof b.toJSON==="function"&&(b=b.toJSON(a));typeof i==="function"&&(b=i.call(j,a,b));switch(typeof b){case "string":return o(b);case "number":return isFinite(b)?String(b):"null";case "boolean":case "null":return String(b);case "object":if(!b)return"null"; e+=n;f=[];if(Object.prototype.toString.apply(b)==="[object Array]"){m=b.length;for(c=0;c<m;c+=1)f[c]=l(c,b)||"null";h=f.length===0?"[]":e?"[\n"+e+f.join(",\n"+e)+"\n"+g+"]":"["+f.join(",")+"]";e=g;return h}if(i&&typeof i==="object"){m=i.length;for(c=0;c<m;c+=1)typeof i[c]==="string"&&(d=i[c],(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h))}else for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h);h=f.length===0?"{}":e?"{\n"+e+f.join(",\n"+e)+"\n"+g+"}":"{"+f.join(",")+ "}";e=g;return h}}if(typeof Date.prototype.toJSON!=="function")Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+k(this.getUTCMonth()+1)+"-"+k(this.getUTCDate())+"T"+k(this.getUTCHours())+":"+k(this.getUTCMinutes())+":"+k(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()};var q=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, p=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e,n,r={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},i;if(typeof JSON.stringify!=="function")JSON.stringify=function(a,j,c){var d;n=e="";if(typeof c==="number")for(d=0;d<c;d+=1)n+=" ";else typeof c==="string"&&(n=c);if((i=j)&&typeof j!=="function"&&(typeof j!=="object"||typeof j.length!=="number"))throw Error("JSON.stringify");return l("", {"":a})};if(typeof JSON.parse!=="function")JSON.parse=function(a,e){function c(a,d){var g,f,b=a[d];if(b&&typeof b==="object")for(g in b)Object.prototype.hasOwnProperty.call(b,g)&&(f=c(b,g),f!==void 0?b[g]=f:delete b[g]);return e.call(a,d,b)}var d,a=String(a);q.lastIndex=0;q.test(a)&&(a=a.replace(q,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return d=eval("("+a+")"),typeof e==="function"?c({"":d},""):d;throw new SyntaxError("JSON.parse");}})();

//================ VARIABLES ======================
var scriptName = 'Inspector Spacetime';
var scriptVersion = '2.1';
var thisComp, inspectorFolder, margin, leftEdge, panelSize = [0, 0], dataSize = [0, 0];

var exp_counter = 'var sTime = marker.key("Start").time; var eTime = marker.key("End").time; var countTime = Math.max(time - sTime, 0); countTime = Math.min(countTime, eTime - sTime); var counter = Math.round(countTime * 1000); var playIcon = (time > sTime && time < eTime) ? "\u25ba " : "\u25a0 "; playIcon + counter + "ms";';

// icon string for retina icons
var icons = {
	build: [
		'104 26.478 104.82 32.260 104 38.043 116.39 35.565 115.56 40.521 123 32.260 115.56 24 116.39 28.956',
		'93 48 93 57 34 57 34 43 32 43 32 39 34 39 34 38 30 38 30 34 34 34 34 7 36 7 36 34 69 34 69 38 36 38 36 39 80 39 80 43 36 43 36 55 91 55 91 48 63 48 63 44 91 44 91 16 38 16 38 12 91 12 91 9 36 9 36 7 93 7 93 12 96 12 96 16 93 16 93 44 98 44 98 48 93 48',
		'45 23 91 23 91 27 45 27',
		'65 49 67 51 65 53 63 51',
		'76 17 78 19 76 21 74 19',
		'40 17 42 19 40 21 38 19',
		'85 49 89 49 87.66 51 89 53 85 53 86.33 51',
		'69 28 73 28 71.66 30 73 32 69 32 70.33 30',
		'50 28 54 28 52.66 30 54 32 50 32 51.33 30',
		'160 7 160 56 170 56 170 54 160 54 160 53 174 53 174 51 160 51 160 50 167 50 167 48 168 48 168 50 173 50 173 48 160 48 160 47 166 47 166 45 160 45 160 42 172 42 172 40 160 40 160 39 170 39 170 37 160 37 160 36 167 36 167 34 168 34 168 36 177 36 177 34 160 34 160 33 172 33 172 31 160 31 160 28 170 28 170 26 160 26 160 25 172 25 172 23 160 23 160 22 167 22 167 20 168 20 168 22 175 22 175 20 160 20 160 19 169 19 169 17 160 17 160 14 176 14 176 12 160 12 160 11 173 11 173 9 160 9 160 7 181 7 181 58 157 58 131 58 131 7 157 7 157 9 133 9 133 56 157 56 157 7'
	]
};

// ================ FUNCTIONS =============


/**
 * Set the current comp to the var thisComp
 */
function setComp() {
	// activate the comp even if it isnt highlighted
	app.activeViewer.setActive();
	// stupid extendscript
	thisComp = app.project.activeItem;
	// Make sure a comp is selected
	if (!thisComp || !(thisComp instanceof CompItem)) {
		alert("Gotta select a comp first", scriptName);
		return false;
	}
	// set the workStart var
	workStart = thisComp.workAreaStart;
	// set the workEnd var
	workEnd = workStart + thisComp.workAreaDuration;
	return true;
}

/**
 * draw a text button with colored background
 *
 * @param {object} parentObj   - ScriptUI group that holds the button
 * @param {string} accentColor - background color hex
 * @param {string} buttonText  - button text
 * @returns {Button}           - created button
 */
function buttonColorText(parentObj, accentColor, buttonText) {
	// draw a regular button, make it pressable with ENTER key
	var btn = parentObj.add('button', undefined, '', {name:'ok'});
		btn.fillBrush = btn.graphics.newBrush(btn.graphics.BrushType.SOLID_COLOR, hexToArray(accentColor));

		// text to uppercase
		btn.text = buttonText;

		// button color to accent color
		btn.fillBrush = btn.graphics.newBrush(btn.graphics.BrushType.SOLID_COLOR, hexToArray(accentColor));

		// text color white
		btn.textPen = btn.graphics.newPen(btn.graphics.PenType.SOLID_COLOR, hexToArray('#ffffff'), 1);

		// do the drawing of the colors
		btn.onDraw = gfxDraw;

	// return the button for the listener
	return btn;

	/**
	 * Draws vector button
	 */
	function gfxDraw() {
		with (this) {
			graphics.drawOSControl();
			graphics.rectPath(0, 0, size[0], size[1]);
			graphics.fillPath(fillBrush);
			if (text) {
				graphics.drawString(
					text,
					textPen,
					(size[0] - graphics.measureString(text, graphics.font, size[0])[0]) / 2,
					(size[1] - graphics.measureString(text, graphics.font, size[0])[1]) / 1.75,
					graphics.font
				);
			}
		}
	}

	/**
	 * Converts a hex string to an RGB array
	 *
	 * @param {string} hexString - Hex string
	 * @return {number[]}        - Colour array
	 */
	function hexToArray(hexString) {
		var hexColor = hexString.replace('#', '');
		var r = parseInt(hexColor.slice(0, 2), 16) / 255,
			g = parseInt(hexColor.slice(2, 4), 16) / 255,
			b = parseInt(hexColor.slice(4, 6), 16) / 255;
		return [r, g, b, 1];
	}
}


/**
 * draw a icon button with colored background
 *
 * @param {object} parentObj - ScriptUI group that holds the button
 * @param {string} iconVec   - svg coords as text string
 * @param {string} iconColor - background color hex string
 * @param {number[]} size    - button size
 * @returns {number[]}       - coordinates array
 */
function buttonColorVector(parentObj, iconVec, iconColor, size) {
	// defines the artsize before resizing the button container
	var artSize = size;
	var vButton = parentObj.add('button', [0, 0, size[0], size[1], undefined]);
		vButton.coord = vecToPoints(iconVec);
		vButton.fillColor = iconColor;
		vButton.onDraw = vecDraw;

		return vButton;

	/**
	 * Converts SVG coordinates to ScriptUI voordinates
	 *
	 * @param {string[]} vecCoord - Array of SVG coordinate strings
	 * @return {number[][]}       - Array of coordinates
	 */
	function vecToPoints(vecCoord) {
		var points = [];
		var n;

		// loop through the paths in a multi path icon
		for (var i = 0; i < vecCoord.length; i++) {
			// create an array of all the numbers
			var eachNum = vecCoord[i].split(' ');
			var coordinates = [];
			var sets = [];

			// AI adds commas between coords, sketch just spaces
			for (var k = 0; k < eachNum.length; k += 2) {
				// add pairs of numbers to an array
				sets.push(eachNum[k] + ',' + eachNum[k + 1]);
			}

			// loop through all sets
			for (var j = 0; j < sets.length; j++) {
				// split each set apart
				n = sets[j].split(',');
				coordinates[j] = n;
				coordinates[j][0] = (parseFloat(coordinates[j][0]));
				coordinates[j][1] = (parseFloat(coordinates[j][1]));
			}

			// combine each x,y as a 2D array
			points.push(coordinates);
		}
		// return the 2D array
		return points;
	}

	/**
	 * Converts a hex string to an RGB array
	 *
	 * @param {string} hexString - Hex string
	 * @return {number[]}        - Colour array
	 */
	 function hexToArray(hexString) {
		var hexColor = hexString.replace('#', '');
		var r = parseInt(hexColor.slice(0, 2), 16) / 255,
			g = parseInt(hexColor.slice(2, 4), 16) / 255,
			b = parseInt(hexColor.slice(4, 6), 16) / 255;
		return [r, g, b, 1];
	}

	/**
	 * Draws a vector path button
	 */
	function vecDraw() {
		with (this) {
			graphics.drawOSControl();

			// draw background
			graphics.rectPath(0, 0, size[0], size[1]);
			graphics.fillPath(graphics.newBrush(graphics.BrushType.SOLID_COLOR, hexToArray(fillColor)));

			// draw shape
			for (var i = 0; i < coord.length; i++) {
				var line = coord[i];

				graphics.newPath();
				graphics.moveTo(line[0][0] + (size[0] / 2 - artSize[0] / 2), line[0][1]);
				for (var j = 0; j < line.length; j++) {
					graphics.lineTo(line[j][0] + (size[0] / 2 - artSize[0] / 2), line[j][1]);
				}
				graphics.fillPath(graphics.newBrush(graphics.BrushType.SOLID_COLOR, [1, 1, 1, 0.75]));
			}
		}
	}
}


/**
 * add start and end markers to the input layer
 *
 * @param {Layer} layer      - comp layer object
 * @param {number} startTime - time of first keyframe
 * @param {number} endTime   - time of last keyframe
 */
function setTimeMarkers(layer, startTime, endTime) {
	// new marker object
	var layer_marker1 = new MarkerValue("Start");
		layer_marker1.eventCuePoint = true;
		layer_marker1.setParameters({});

	layer("ADBE Marker").setValueAtTime(startTime, layer_marker1);

	var layer_marker2 = new MarkerValue("End");
		layer_marker2.eventCuePoint = true;
		layer_marker2.setParameters({});

	layer("ADBE Marker").setValueAtTime(endTime, layer_marker2);
}


/**
 * convert time to ms
 *
 * @param {number} time - time float value
 * @returns {string}    - rounded time in ms
 */
function timeToMs(time) {
	return Math.round(time * 1000) + 'ms';
}

/**
 * create the master text layer, return text layer; plain version
 *
 * @param {string} str  - Text to create
 * @returns {TextLayer} - Created text layer
 */
function buildText_plain(str) {
	// initialize propStr as empty string
	var propStr = str;

	try {
		// create new text layer
		var dynText = thisComp.layers.addText("Spec Layer Name");
		dynText.name = 'Spec Layer Name';
		dynText.comment = scriptName + '_data';

		// new text object
		var dynText_TextProp = dynText("ADBE Text Properties")("ADBE Text Document");
		var dynText_TextDocument = dynText_TextProp.value;

		// reset all text values
		dynText_TextDocument.resetCharStyle();

		dynText_TextDocument.fontSize = Math.floor(dataSize[0] / 16);
		dynText_TextDocument.font = "CourierNewPS-BoldMT";
		dynText_TextDocument.applyFill = true;
		dynText_TextDocument.fillColor = [1, 1, 1];
		dynText_TextDocument.applyStroke = false;
		dynText_TextDocument.justification = ParagraphJustification.LEFT_JUSTIFY;
		dynText_TextDocument.tracking = -30;

		if (parseFloat(app.version) >= 13.2) {
			dynText_TextDocument.verticalScale = 1;
			dynText_TextDocument.horizontalScale = 1;
			dynText_TextDocument.baselineShift = 0;
			dynText_TextDocument.tsume = 0;
		}

		// apply text properties
		dynText_TextProp.setValue(dynText_TextDocument);

		// apply text string
		dynText_TextProp.setValue(propStr);

		// define manualLineHeight
		var manualLineHeight = 10;

		// create a new text animator
		var lineHeight = dynText("ADBE Text Properties")(4).addProperty("ADBE Text Animator");
			// name it line height
			lineHeight.name = 'Line Height';
			// add a Line Spacing element
			lineHeight("ADBE Text Animator Properties").addProperty("ADBE Text Line Spacing");
			// add a selector
			lineHeight(1).addProperty("ADBE Text Selector");
			// set value
			lineHeight(2)("ADBE Text Line Spacing").setValue([0, manualLineHeight]);

		// Transforms
		dynText("ADBE Transform Group")("ADBE Anchor Point").setValue([0, -dynText_TextDocument.fontSize * 0.82, 0]);
		dynText("ADBE Transform Group")("ADBE Position").setValue([leftEdge, margin, 0]);

		return dynText;
	} catch(e) {
		alert(e.toString() + "\nError on line: " + e.line.toString(), scriptName);
	}
}

/**
 * Builds text block
 *
 * @param {object} p - Property data object
 * @return {string}  - Text block string
 */
function buildTextBlock(p) {
	var firstKeyTime = p.firstKeyTime;
	var str = '';

	// loop through collected props
	for (var j = 0; j < p.layers.length; j++) {
		layer = p.layers[j];

		// add prop name to text string
		str += '\u2261 ' + layer.name + ' \u2261\n';

		for (var i = 0; i < layer.props.length; i++) {
			prop = layer.props[i];
			str += '- ' + prop.name + ' -\n';

			// add start time
			// str += 'Start: ' + timeToMs(prop.startTime) + '\n';

			str += 'Delay: ' + timeToMs(prop.startTime - firstKeyTime) + '\n';
			str += 'Dur: ' + timeToMs(prop.dur) + '\n';
			str += 'Val: ' + getValChange(prop) + '\n';

			// add interpolation value
			str += getEase(prop) + '\n\n';
		}
	}

	return str;
}

/**
 * Gets first and last key times
 *
 * @return {number[]} - Duration between first and last keys
 */
function getKeyRange() {
		var firstKeyTime = 9999999;
		var lastKeyTime = 0;

		for (var i = 0; i < thisComp.selectedLayers.length; i++) {
			var layer = thisComp.selectedLayers[i];
			for (var j = 0; j < layer.selectedProperties.length; j++) {
				var prop = layer.selectedProperties[j];
				for (var k = 0; k < prop.selectedKeys.length; k++) {
					var key = prop.selectedKeys[k];
					// alert(prop.keyTime(key), scriptName)

					// set firstKeyTime to first keyframe's start time
					firstKeyTime = Math.min(firstKeyTime, prop.keyTime(key));
					lastKeyTime = Math.max(lastKeyTime, prop.keyTime(key));
				}
			}
		}

		return [firstKeyTime, lastKeyTime];
}

/**
 * Gets property object
 *
 * @param {object} [opt_propObj] - Initial property object
 * @return {object}              - Property object
 */
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

	// set the viewer to active
	app.activeViewer.setActive();

	// check if theres a comp selected, stop if not
	if (!setComp()) {
		return;
	}

	var selectedLayers = thisComp.selectedLayers;

	// error check that keys are selected
	try {
		// loop through all selected layers
		for (var i = 0; i < selectedLayers.length; i++) {
			var alreadyInList = false;
			// loop through all layers already in the list
			for (var k = 0; k < propObj.layers.length; k++) {
				// is this new layer in the list?
				if (selectedLayers[i].index == propObj.layers[k].index) {

					var selectedProps = getProps(selectedLayers[i]);
					var alreadyInPropList = false;
					// add each property to the layer in the list
					for (var m = 0; m < selectedProps.length; m++) {
						// check that the property isn't already in the property list
						for (var n = 0; n < propObj.layers[k].props.length; n++) {
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
			// add a new layer's properties to the list
			if (!alreadyInList) {
				layer = selectedLayers[i];
				propObj.layers.push({
					name: layer.name,
					matchName: layer.matchName,
					index: layer.index,
					props: getProps(layer),
				})
			}
		}
	} catch (e) {
		alert('Select some keyframes.', scriptName);
		return;
	}

	propObj.firstKeyTime = firstKeyTime;
	propObj.lastKeyTime = lastKeyTime;

	return propObj;

	/**
	 * Gets property data from a layer
	 *
	 * @param {Layer} layer - Layer to get property data from
	 * @return {object[]}   - Data for each selected layer property
	 */
	function getProps(layer) {
		var propCollect = [];

		// loop through selected properties
		for (var k = 0; k < layer.selectedProperties.length; k++) {
			prop = layer.selectedProperties[k];
			if (prop.canVaryOverTime &&
				// check if selected prop is keyframable
				prop.selectedKeys.length > 1) {
				// set var to store selectedKey indices
				var selKeys = prop.selectedKeys;

				for (var m = 0; m < selKeys.length-1; m++) {
					propCollect.push({
						obj: prop,
						threeDLayer: layer.threeDLayer || (layer instanceof CameraLayer),
						propertyValueType: prop.propertyValueType,
						name: prop.name,
						matchName: prop.matchName,
						dur: prop.keyTime(selKeys[m + 1]) - prop.keyTime(selKeys[m]),
						// val: 0,
						startTime: prop.keyTime(selKeys[m]),
						startValue: prop.keyValue(selKeys[m]),
						startTemporalEase: prop.keyOutTemporalEase(selKeys[m])[0],
						startEaseType: prop.keyOutInterpolationType(selKeys[m]),
						endTime: prop.keyTime(selKeys[m + 1]),
						endValue: prop.keyValue(selKeys[m + 1]),
						endTemporalEase: prop.keyInTemporalEase(selKeys[m + 1])[0],
						endEaseType: prop.keyInInterpolationType(selKeys[m + 1]),
						duration: prop.keyTime(selKeys[m + 1]) - prop.keyTime(selKeys[m]),
					});
				}
				// set firstKeyTime to first keyframe's start time
				firstKeyTime = Math.min(firstKeyTime, propCollect[0].startTime);
				lastKeyTime = Math.max(lastKeyTime, propCollect[propCollect.length-1].endTime);
			}
		}

		return propCollect;
	}
}

/**
 * Builds property text from an object
 *
 * @param {object} propObj - Property object to build text from
 * @return {string}        - Text string
 */
function getPropText(propObj) {
	var propStr = '';

	propStr += 'Total Dur: ' + timeToMs(propObj.lastKeyTime - propObj.firstKeyTime) + '\n\n';

	propStr += buildTextBlock(propObj);

	return propStr;
}

/**
 * Creates a counter
 *
 * @returns {TextLayer} - Created text layer
 */
function buildCounter() {
	try {
		// create new text layer
		var dynText = thisComp.layers.addText("Spec Name");
			// set the layer name
			dynText.name = 'Counter';
			// add a comment
			dynText.comment = scriptName + '_data';

		// new text object
		var dynText_TextProp = dynText("ADBE Text Properties")("ADBE Text Document");

		// initialize dynText_TextDocument with values
		var dynText_TextDocument = dynText_TextProp.value;
			// reset all text values
			dynText_TextDocument.resetCharStyle();

			dynText_TextDocument.fontSize = thisComp.width / 30;
			dynText_TextDocument.font = "CourierNewPS-BoldMT";
			dynText_TextDocument.applyFill = true;
			dynText_TextDocument.fillColor = [0.5, 0.5, 0.5];
			dynText_TextDocument.applyStroke = false;
			dynText_TextDocument.justification = ParagraphJustification.LEFT_JUSTIFY;
			dynText_TextDocument.tracking = -30;

			if (parseFloat(app.version) >= 13.2) {
				dynText_TextDocument.verticalScale = 1;
				dynText_TextDocument.horizontalScale = 1;
				dynText_TextDocument.baselineShift = 0;
				dynText_TextDocument.tsume = 0;
			}

			// apply text properties
			dynText_TextProp.setValue(dynText_TextDocument);

			// apply text string
			dynText_TextProp.setValue('\u25ba');

		// define manualLineHeight
		var manualLineHeight = 10;

		// create a new text animator
		var lineHeight = dynText("ADBE Text Properties")(4).addProperty("ADBE Text Animator");
			// name it line height
			lineHeight.name = 'Line Height';
			// add a Line Spacing element
			lineHeight("ADBE Text Animator Properties").addProperty("ADBE Text Line Spacing");
			// add a selector
			lineHeight(1).addProperty("ADBE Text Selector");
			// set value
			lineHeight(2)("ADBE Text Line Spacing").setValue([0,manualLineHeight]);

		// Transforms
		dynText("ADBE Transform Group")("ADBE Position").setValue([100, 100]);

		return dynText;
	} catch(e) {
		alert(e.toString() + "\nError on line: " + e.line.toString(), scriptName);
	}
}


/**
 * calculate and return cubic bezier text string
 *
 * @param {Property} activeProp - property object
 */
function getEase(activeProp) {
	try {
		// count the property dimension
		var dims = (activeProp.obj.value instanceof Array) ? activeProp.obj.value.length : 1;
		// initalize first key
		var k1 = activeProp.startValue;
		// initalize last key
		var k2 = activeProp.endValue;

		// value change logic
		var valChange;
		if (dims == 1 || activeProp.propertyType == PropertyType.PROPERTY) {
			valChange = k2 - k1;
		} else {
			if (activeProp.matchName.indexOf('Size') != -1) {
				valChange = 100000000000000;
			} else {
				valChange = Math.sqrt(Math.pow(k2[0] - k1[0], 2) + Math.pow(k2[1] - k1[1], 2));
			}
		}

		var keyOutSpeed = activeProp.startTemporalEase.speed;
		var keyInSpeed = activeProp.endTemporalEase.speed;

		if (keyOutSpeed < 0) {
			keyOutSpeed *= -1;
		}
		if (keyInSpeed > 0) {
			keyInSpeed *= -1;
		}

		var y1Mult = (activeProp.startTemporalEase.speed > 0) ? 1 : -1;
		var y2Mult = (activeProp.endTemporalEase.speed > 0) ? 1 : -1;

		var x1 = activeProp.startTemporalEase.influence / 100;
		var y1 = (keyOutSpeed * x1) * (activeProp.duration / valChange) * y1Mult;
		var x2 = 1 - activeProp.endTemporalEase.influence / 100;
		var y2 = 1 - (keyInSpeed * (x2-1)) * (activeProp.duration / valChange) * y2Mult;

		// check type of keys
		if (activeProp.startEaseType == KeyframeInterpolationType.LINEAR && activeProp.endEaseType == KeyframeInterpolationType.LINEAR) {
			// return if linear keys
			return 'Linear';
		} else if (activeProp.startEaseType == KeyframeInterpolationType.HOLD){
			// return if no change
			return 'Hold';
		} else if (isNaN(y1)){
			// return if no change
			return 'No Change';
		} else {
			// return cubic bezier string
			return '(' + round(x1) + ', ' + round(y1) + ', ' + round(x2) + ', ' + round(y2) + ')';
		}
		// error catch returns ()
	} catch(e) {
		return '()'
	}
}


/**
 * dup comp, resize new comp, add panel
 * @param {CompItem} work_comp - comp object
 */
function resizeCompNew(work_comp) {
	for (var i = 1; i <= work_comp.layers.length; i++) {
		// skip all this if there's already a panel layer
		if (thisComp.layers[i].comment === scriptName + '_panel') {
			return;
		}
	}

	// make a new folder to store spec comps
	createISTfolder();

	// duplicate comp
	thisComp = work_comp.duplicate();
	// move new comp to IST folder
	thisComp.parentFolder = inspectorFolder;
	// rename duped comp
	thisComp.name = work_comp.name + '_Spec';
	// open new comp
	thisComp.openInViewer();

	// set panelSize
	panelSize = [Math.floor(thisComp.height / 3), thisComp.height];

	// set leftEdge
	leftEdge = thisComp.width;

	// resize comp
	thisComp.width = leftEdge + panelSize[0];

	try {
		// create info panel backing layer
		var compInfo = thisComp.layers.addShape();
			// name panel layer
			compInfo.name = 'Spec Panel 1';
			// comment panel layer
			compInfo.comment = scriptName + '_panel';
			// set layer label to grey
			compInfo.label = 0;

		var shapeGroup = compInfo("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
			shapeGroup.name = "Rectangle 1";

		var rect = shapeGroup(2).addProperty("ADBE Vector Shape - Rect");
			rect("ADBE Vector Rect Size").setValue(panelSize);
			rect("ADBE Vector Rect Position").setValue(panelSize / 2);

		var stroke = shapeGroup(2).addProperty("ADBE Vector Graphic - Stroke");
			stroke.enabled = false;
			stroke("ADBE Vector Stroke Width").setValue(6);

		var fill = shapeGroup(2).addProperty("ADBE Vector Graphic - Fill");
			fill("ADBE Vector Fill Color").setValue([0.08203125, 0.5625, 0.91796875, 1]);

		var shapeGroup2 = compInfo("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
			shapeGroup2.name = "Admin";
			shapeGroup2(3)("ADBE Vector Scale").setValue(panelSize);

		compInfo("ADBE Transform Group")("ADBE Position").setValue([leftEdge, 0]);
	} catch(e) {
		alert(e.toString() + "\nError on line: " + e.line.toString(), scriptName);
	}

	// update positioning variables
	margin = Math.floor(panelSize[0] / 18);
	panelSize -= margin*2;
	leftEdge += margin;
}


/**
 * round input to maximum number if decimal places, or int
 *
 * @param {number} value          - Value to round
 * @param {number} [opt_decimals] - Number of decimals, optional
 */
function round(value, opt_decimals) {
	try{
		// default to 2 decimal places if nothing is specified
		var decimals = (opt_decimals !== undefined) ? opt_decimals : 2;
		return parseFloat(value.toFixed(decimals));
	} catch (e) {
		return value;
	}
}

/**
 * Create a SPEC folder if one doesn't exist
 */
function createISTfolder() {
	// initialize var with false
	var hasRedlineFolder = false;
	// loop through all project items
	for (var i = 1; i <= app.project.numItems; i++) {
		// find folders
		if (app.project.item(i) instanceof FolderItem) {
			// check if it's name matches the script name
			if (app.project.item(i).name == scriptName) {
				// set the var to true
				hasRedlineFolder = true;
				// set the inspectorFolder var to the found folder
				inspectorFolder = app.project.item(i);
				// stop all that looping
				break;
			}
		}
	}
	// if no spec folder is found
	if (!hasRedlineFolder) {
		// create spec folder
		inspectorFolder = app.project.items.addFolder(scriptName);
	}
}


/**
 * get the size of the current info panel
 */
function getPanelSize() {
	// loop through layers
	for (var i = 1; i <= thisComp.layers.length; i++) {
		// if layer has a panel comment
		if (thisComp.layer(i).comment == scriptName + '_panel') {
			// update vars
			panelSize = thisComp.layer(i)("ADBE Root Vectors Group")(2)(3)("ADBE Vector Scale").value;
			margin = Math.floor(panelSize[0] / 18)
			leftEdge = thisComp.layer(i)("ADBE Transform Group")("ADBE Position").value[0] + margin;
			dataSize = [panelSize[0] - margin * 2, panelSize[1] - margin * 2];
			// stop looping
			return;
		}
	}
}


/**
 * filtering func that checks the property match name then feeds the prop to the appropriate value func
 *
 * @param {Property} activeProp - current property
 */
function getValChange(activeProp) {
	// check the property match name
	switch (activeProp.obj.matchName) {
		case 'ADBE Scale':
			// is Scale
			return valScale(activeProp);
		case 'ADBE Position_0':
			// is seperated X position
			return valXPosition(activeProp);
		case 'ADBE Position_1':
			// is seperated Y position
			return valXPosition(activeProp);
		case 'ADBE Position':
			// is Position array
			return valPosition(activeProp);
		case 'ADBE Rotate Z':
			// is Rotation
			return valRotation(activeProp);
		case 'ADBE Opacity':
			// is Opacity
			return valOpacity(activeProp);
		case 'ADBE Mask Shape':
			// is a Mask
			return 'Mask data unsupported';
		case 'ADBE Vector Shape':
			// is a Path
			return 'Path data unsupported';
		default:
			// is anything else
			return valGeneric(activeProp);
	}
}

/**
 * returns the position value change
 *
 * @param {Property} activeProp - current property
 */
function valPosition(activeProp) {
	// get the first key value
	var a = activeProp.startValue;

	// get the last key value
	var b = activeProp.endValue;

	// distance vs abs position values
	if (activeProp.threeDLayer) {
		return ('[' + Math.round(a[0]) + ',' + Math.round(a[1]) + ',' + Math.round(a[2]) + ']››[' +
					  Math.round(b[0]) + ',' + Math.round(b[1]) + ',' + Math.round(b[2]) + ']');
	} else {
		return ('[' + Math.round(a[0]) + ',' + Math.round(a[1]) + ']››[' +
					  Math.round(b[0]) + ',' + Math.round(b[1]) + ']');
	}
}

/**
 * returns the position value change for a seperated position value
 *
 * @param {Property} activeProp - current property
 */
function valXPosition(activeProp) {
	// get the first key value
	var a = activeProp.startValue;

	// get the last key value
	var b = activeProp.endValue;

	// the pixel multiplier for distance in DP
	var pixelMult = ddl_resolution.selection.index + 1;

	// distance vs abs position values

	// distance selected
	if (rad_pos.children[1].value) {
		// calc the distance
		var vectDist = (b - a) / pixelMult;

		// return distance with dp
		return (Math.round(vectDist) + 'dp');
	} else {
		// return coodinates
		return (round(a, 2) + '››' + round(b, 2));
	}
}

/**
 * Gets Opacity percentage
 *
 * @param {any} activeProp - Current property object
 * @return {string}        - Opacity string
 */
function valOpacity(activeProp) {
	// get the first key value
	var a = activeProp.startValue;

	// get the last key value
	var b = activeProp.endValue;

	return (round(a, 2) + '% ››› ' + round(b, 2) + '%');
}

/**
 * Gets Rotation degrees
 *
 * @param {any} activeProp - Current property object
 * @return {string}        - Rotation string
 */
function valRotation(activeProp) {
	// get the first key value
	var a = activeProp.startValue;

	// get the last key value
	var b = activeProp.endValue;

	return round(a) + '° ››› ' + round(b) + '°';
}

/**
 * Gets Scale amounts
 *
 * @param {any} activeProp - Current property object
 * @return {string}        - Scale string
 */
function valScale(activeProp) {
	// get the first key value
	var a = activeProp.startValue;

	// get the last key value
	var b = activeProp.endValue;

	// check if the x and y values match
	var single = (round(a[0]) == round(a[1]) && round(b[0]) == round(b[1])) ? true : false;

	if (single) {
		// if values match, print single vals with percentage
		return (round(a[0]) + '% ›› ' + round(b[0]) + '%');
	} else {
		// else print arrays
		return ('[' + round(a[0]) + ',' + round(a[1]) + ']%››[' + round(b[0]) + ',' + round(b[1]) + ']%');
	}
}

/**
 * Gets generic value
 *
 * @param {any} activeProp - Current property object
 * @return {string}        - Generic string
 */
function valGeneric(activeProp) {
	// get the first key value
	var a = activeProp.startValue;

	// get the last key value
	var b = activeProp.endValue;

	// it's an array value, check if the x and y values match
	if (a instanceof Array) {
		var single = (round(a[0]) == round(a[1]) && round(b[0]) == round(b[1])) ? true : false;

		if (activeProp.threeDLayer) {
			// return coodinates
			return ('[' + Math.round(a[0]) + ',' + Math.round(a[1]) + ',' + Math.round(a[2]) + ']››[' +
						  Math.round(b[0]) + ',' + Math.round(b[1]) + ',' + Math.round(b[2]) + ']');
		} else if (single) {
			// if values match, print single vals with percentage
			return (round(a[0]) + ' ›› ' + round(b[0]));
		} else {
			// Else format as array
			return ('[' + round(a[0], 0) + ',' + round(a[1], 0) + ']››['
						+ round(b[0], 0) + ',' + round(b[1],0) + ']');
		}
	} else {
		// its not an array value, return value
		return (round(a, 2).toString() + '››' + round(b, 2).toString());
	}
}


/**
 * create an isolation layer
 */
function buildIsoLayer() {
	var isolationLayer = thisComp.layers.addShape();
		isolationLayer.name = '\u2193\u2193 Isolation \u2193\u2193';
		isolationLayer.label = 0;
		isolationLayer.adjustmentLayer = true;

	var shapeGroup = isolationLayer("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
		shapeGroup.name = "Rectangle 1";

	var rect = shapeGroup(2).addProperty("ADBE Vector Shape - Rect");
		rect("ADBE Vector Rect Size").setValue([thisComp.width, thisComp.height]);

	var stroke = shapeGroup(2).addProperty("ADBE Vector Graphic - Stroke");
		stroke.enabled = false;
		stroke("ADBE Vector Stroke Width").setValue(3);

	var fill = shapeGroup(2).addProperty("ADBE Vector Graphic - Fill");
		fill("ADBE Vector Fill Color").setValue([0, 0, 0, 1]);

	var tint = isolationLayer("ADBE Effect Parade").addProperty("ADBE Tint");
		tint("ADBE Tint-0001").setValue([0.3, 0.3, 0.3, 1]);
		tint("ADBE Tint-0002").setValue([0.35, 0.35, 0.35, 1]);
}


/**
 * Create a shape layer pointer
 */
function buildPointer() {
	try{
		if (leftEdge == undefined) {
			alert('Gotta create a spec panel first.', scriptName);
			return;
		}

		// new shape layer
		var pointer1 = thisComp.layers.addShape();
			// name shape layer
			pointer1.name = "Pointer 1";
			// set label color
			pointer1.label = 2;

		var shapeGroup = pointer1("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
			shapeGroup.name = "Pointer";
			shapeGroup(2).addProperty("ADBE Vector Shape - Rect");

		var trim = shapeGroup(2).addProperty("ADBE Vector Filter - Trim");
			trim("ADBE Vector Trim End").setValue(25);
			trim("ADBE Vector Trim Offset").setValue(-90);

		var gradFill = shapeGroup(2).addProperty("ADBE Vector Graphic - G-Fill");
			gradFill.enabled = false;

		shapeGroup(3)("ADBE Vector Anchor").setValue([0, -50]);
		shapeGroup(3)("ADBE Vector Position").setValue([-580, 0]);
		shapeGroup(3)("ADBE Vector Scale").setValue([100, 100]);

		var shapeGroup2 = pointer1("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
			shapeGroup2.name = "Arm";
			shapeGroup2(2).addProperty("ADBE Vector Shape - Rect");

		var trim2 = shapeGroup2(2).addProperty("ADBE Vector Filter - Trim");
			trim2("ADBE Vector Trim End").setValue(50);
			trim2("ADBE Vector Trim Offset").setValue(180);

		var gradFill2 = shapeGroup2(2).addProperty("ADBE Vector Graphic - G-Fill");
			gradFill2.enabled = false;
			shapeGroup2(3)("ADBE Vector Anchor").setValue([50, -50]);
			shapeGroup2(3)("ADBE Vector Scale").setValue([564, 349]);

		var stroke = pointer1("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
			stroke("ADBE Vector Stroke Width").setValue(6);
			stroke("ADBE Vector Stroke Color").setValue([0.4795, 0.4795, 0.4795, 1]);

		var fxPoint = pointer1("ADBE Effect Parade").addProperty("ADBE Point Control");
			fxPoint.name = "Arm Length";
			fxPoint("ADBE Point Control-0001").setValue([775, 200]);

		var fxSize = pointer1("ADBE Effect Parade").addProperty("ADBE Slider Control");
			fxSize.name = "Pointer Size";
			fxSize("ADBE Slider Control-0001").setValue(200);

		pointer1("ADBE Transform Group")("ADBE Position").setValue([leftEdge - margin * 2, 192, 0]);

		// Apply expressions to properties
		try {
			pointer1("ADBE Root Vectors Group")(1)(3)("ADBE Vector Position").expression = "p = effect(\"Arm Length\")(\"Point\");" + "\n" +
					"[-p[0], p[1]]";
			pointer1("ADBE Root Vectors Group")(1)(3)("ADBE Vector Scale").expression = "s = effect(\"Pointer Size\")(\"Slider\");" + "\n" +
					"[s, s]";
			pointer1("ADBE Root Vectors Group")(2)(3)("ADBE Vector Scale").expression = "effect(\"Arm Length\")(\"Point\")";
		} catch (err) {}
	} catch(e) {
		alert(e.toString() + "\nError on line: " + e.line.toString(), scriptName);
	}
}


/**
 * create clickable web links from AE
 *
 * @param {string} url - web url
 */
function visitURL(url) {
	if ($.os.indexOf("Windows") != -1) {
		system.callSystem('cmd /c "' + Folder.commonFiles.parent.fsName + "\\Internet Explorer\\iexplore.exe" + '" ' + url);
	} else {
		var cmd = 'open "' + url + '"';
		system.callSystem(cmd);
	}
}

/**
 * Prompts user to select a file path
 *
 * @param {string} filename - Default filename to prompt
 * @param {string} filter   - File type filter to use, Win only
 * @return {File | null}    - User file object
 */
function getUserFile(filename, filter) {
	var defaultPath = Folder.desktop.fullName + '/' + filename;
	var outputFile = new File(defaultPath).saveDlg(
		'Choose output path',
		filter
	);

	if (!outputFile) {
		return null;
	}

	return outputFile;
}

/**
 * Writes a file to disk
 *
 * @param {File | string} path - Path or File obj to write
 * @param {string} contents    - File contents to write
 * @returns {File}             - Written file
 */
function writeFile(path, contents) {
	var file = path instanceof File ? path : new File(path);

	file.open("w");
	var writeSuccess = file.write(contents);
	file.close();

	if (!writeSuccess) {
		throw new Error("Could not write file " + file.toString());
	}

	return file;
}

// _______ UI SETUP _______
// if the script is a Panel, (launched from the 'Window' menu), use it,
// else (launched via 'File/Scripts/Run script...') create a new window
// store it in the variable mainPalette
var mainPalette = thisObj instanceof Panel ? thisObj : new Window('palette', scriptName, undefined, {resizeable:true});

	//stop if there's no window
if (mainPalette === null) {
	return;
}

	// set margins and alignment
	mainPalette.alignChildren = ['fill','fill'];
	// mainPalette.margins = 2;
	// mainPalette.spacing = 2;

// ============ ADD UI CONTENT HERE =================
// content group
var content = mainPalette.add('group');
	content.alignChildren = ['fill','fill'];
	content.orientation = 'column';
	// content.margins = 0;
	content.spacing = 5;

// main button
var btnLaunch = buttonColorVector(content, icons.build, '#5B8BA3', [224,64]);
	btnLaunch.maximumSize.height = 64;
	btnLaunch.minimumSize.height = 64;
	btnLaunch.helpTip = 'Select keyframe pairs to build spec panel';

// button for isolation layer
// var btn_dataPanel = buttonColorText(content, '#5B8BA3', 'Panel');

var grp_options = content.add('group');
	grp_options.orientation = 'row';
	grp_options.alignChildren = ['fill', 'top'];
	grp_options.margins = 0;

var settings = grp_options.add('group');
	settings.alignment = 'fill';
	settings.alignChildren = ['fill', 'top'];
	settings.orientation = 'column';
	settings.margins = [0, 6, 0, 0];

// radio pane for coods vs distance
var grp_pos = settings.add('panel', undefined, 'Position');
	grp_pos.alignChildren = 'left';
	grp_pos.alignment = 'left';
	grp_pos.orientation = 'column';
	grp_pos.spacing = 0;
	grp_pos.margins = [8, 10, 0, 6];
	grp_pos.maximumSize.width = 110;
	grp_pos.minimumSize.width = 110;

var rad_pos = grp_pos.add('group');

// radio coord
var posCoord = rad_pos.add('radiobutton', undefined, 'Pixel');
	posCoord.helpTip = 'Print position as pixel coordinates';

// radio distance
var posDistance = rad_pos.add('radiobutton', undefined, 'DP');
	posDistance.helpTip = 'Print position as dp movement';
	posDistance.value = true;

// dropdown list for
var ddl_resolution = settings.add('dropdownlist', undefined, ['1x', '2x', '3x']);
	ddl_resolution.selection = 2;
	ddl_resolution.maximumSize.width = 110;
	ddl_resolution.minimumSize.width = 110;
	ddl_resolution.alignment = 'left';
	ddl_resolution.helpTip = 'Dp multiplier';

var grp_buttons = grp_options.add('group');
	grp_buttons.alignChildren = ['fill', 'top'];
	grp_buttons.orientation = 'column';
	grp_buttons.margins = 0;
	grp_buttons.spacing = 1;

// button for isolation layer
var btn_isolation = buttonColorText(grp_buttons, '#37474F', 'Iso Layer');
	btn_isolation.helpTip = 'Create a color adjustment layer\nthe drag below targeted layers';

// button for pointer layer
var btn_pointer = buttonColorText(grp_buttons, '#37474F', 'Pointer');
	btn_pointer.helpTip = 'Create an adjustable pointer \nline to connect text to element';

// button for counter layer
var btn_counter = buttonColorText(grp_buttons, '#37474F', 'Counter');
	btn_counter.helpTip = 'Create text counter without building a spec';

var btn_aboutScript = buttonColorText(grp_buttons, '#263238', '?');
	btn_aboutScript.helpTip = 'About ' + scriptName;
	btn_aboutScript.minimumSize = [30, 30];
	btn_aboutScript.maximumSize = [30, 30];
	btn_aboutScript.alignment = ['right', 'bottom'];

	// ============ Button Functionality =================

posCoord.onClick = function() {
	ddl_resolution.visible = false;
};
posDistance.onClick = function() {
	ddl_resolution.visible = true;
};
btn_aboutScript.onClick = function() {
	// new dialog window
	var w = new Window ('dialog', 'About ' + scriptName);
		w.spacing = 0;
		w.margins = 0;

	// group to hold intry box
	var content = w.add('group', undefined, '');
		content.alignChildren = ['fill', 'fill'];
		content.orientation = 'column';
		content.alignment = ['left', 'top'];
		content.margins = 16;
		// content metrics
		content.spacing = 8;

	var btn_url = buttonColorVector(content, icons.build, '#EF5350', [224, 64]);

	content.add('statictext', [0, 0, 400, 340],
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
		// get selected keys range
		var keyRange = getKeyRange();
		// if no keys selected use the playhead time and playhead + 1:00
		if (keyRange[0] == 9999999) {
			keyRange = [thisComp.time, thisComp.time + 1];
		}

	app.beginUndoGroup('New Counter');
	// build text layer
	var textLayer = buildCounter();
	// set markers
	setTimeMarkers(textLayer, keyRange[0], keyRange[1]);
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

		// tabs
		var tpanel = w.add ('tabbedpanel');
			tpanel.alignChildren = ['fill', 'fill'];
			tpanel.minimumSize = [350, 300];
			tpanel.maximumSize.height = 800;

		var tab_text = tpanel.add ('tab', undefined, 'Text');
			tab_text.alignChildren = ['fill', 'fill'];

		var textField = tab_text.add('edittext', undefined, '', {multiline: true});
			textField.text = propText;


		var tab_json = tpanel.add ('tab', undefined, 'JSON');
			tab_json.alignChildren = ['fill', 'fill'];

		var jsonField = tab_json.add('edittext', [0, 0, 350, 300], '', {multiline: true});
			jsonField.text = JSON.stringify(propObj, replacer, 2);

		// clear props if no keys selected on initialize
		if (propObj.firstKeyTime == 9999999) {
			clearProps();
		}

		// buttons
		var buttons = w.add ('group');
			buttons.alignment = 'right';
			buttons.minimumSize.height = 28;
			buttons.maximumSize.height = 28;

		var btn_clearProp = buttons.add ('button', undefined, '⊗ Clear ⊗');
		var btn_addProp = buttons.add ('button', undefined, '↑ Add property ↑');
		var btn_newSidePanel = buttons.add ('button', undefined, '→ Create side panel →');
		var btn_exportJson = buttons.add ('button', undefined, '⤵ Export ⤵');

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
				// start undo group
				app.beginUndoGroup('Create ' + scriptName + 'Elements');

				// resize the comp
				resizeCompNew(thisComp);

				// set the panel size in relation to the comp size
				getPanelSize();

				buildText_plain(textField.text);

				// close twirled layers
				app.executeCommand(2771);
				app.executeCommand(2771);

				app.endUndoGroup();
			} catch(e) {
				alert(e.toString() + "\nError on line: " + e.line.toString(), scriptName);
			}
		}

		btn_exportJson.onClick = function () {
			var propObj = getPropObj(propObj);
			propObj.istVersion = scriptVersion;
			propObj.aeVersion = app.version;

			var outputFile = getUserFile("spec.spacetime", "spacetime:*.spacetime;");

			if (!outputFile) {
				return;
			}

			try {
				var writtenFile = writeFile(outputFile, JSON.stringify(propObj, replacer));
				alert("Wrote file to " + writtenFile.fsName, scriptName);
			} catch(e) {
				alert(e, scriptName);
			}
		}

		/**
		 * JSON replacer filter
		 *
		 * @param {string} key - Object key
		 * @param {any} val    - Object value
		 * @return {any}       - Object value
		 */
		function replacer(key, val) {
			if (key === 'obj') {
				return undefined;
			} else {
				return val;
			};
		};

		/**
		 * Clears global variables
		 */
		function clearProps() {
			propObj = null;
			propText = null;

			jsonField.text = '';
			textField.text = '';
		}

		// visibility
		// tpanel.selection = 1;
		w.layout.layout(true);
		w.layout.resize();
		w.onResizing = w.onResize = function () {w.layout.resize();};
		w.show ();
	} catch (e) {
		alert(e.toString() + "\nError on line: " + e.line.toString());
	}
}

//__________ SHOW UI ___________
// Set layout, and resize it on resize of the Panel/Window
mainPalette.layout.layout(true);
mainPalette.layout.resize();
mainPalette.onResizing = mainPalette.onResize = function () {
	mainPalette.layout.resize();
};

//if the script is not a Panel (launched from File/Scripts/Run script...) we need to show it
if (!(mainPalette instanceof Panel)) {
	mainPalette.show();
}
//______________________________

})(this);
