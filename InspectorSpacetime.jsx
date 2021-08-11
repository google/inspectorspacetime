(function (thisObj) {
    var JSON;
    JSON || (JSON = {});
    (function () { function k(a) { return a < 10 ? "0" + a : a; } function o(a) { p.lastIndex = 0; return p.test(a) ? '"' + a.replace(p, function (a) { var c = r[a]; return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4); }) + '"' : '"' + a + '"'; } function l(a, j) { var c, d, h, m, g = e, f, b = j[a]; b && typeof b === "object" && typeof b.toJSON === "function" && (b = b.toJSON(a)); typeof i === "function" && (b = i.call(j, a, b)); switch (typeof b) {
        case "string": return o(b);
        case "number": return isFinite(b) ? String(b) : "null";
        case "boolean":
        case "null": return String(b);
        case "object":
            if (!b)
                return "null";
            e += n;
            f = [];
            if (Object.prototype.toString.apply(b) === "[object Array]") {
                m = b.length;
                for (c = 0; c < m; c += 1)
                    f[c] = l(c, b) || "null";
                h = f.length === 0 ? "[]" : e ? "[\n" + e + f.join(",\n" + e) + "\n" + g + "]" : "[" + f.join(",") + "]";
                e = g;
                return h;
            }
            if (i && typeof i === "object") {
                m = i.length;
                for (c = 0; c < m; c += 1)
                    typeof i[c] === "string" && (d = i[c], (h = l(d, b)) && f.push(o(d) + (e ? ": " : ":") + h));
            }
            else
                for (d in b)
                    Object.prototype.hasOwnProperty.call(b, d) && (h = l(d, b)) && f.push(o(d) + (e ? ": " : ":") + h);
            h = f.length === 0 ? "{}" : e ? "{\n" + e + f.join(",\n" + e) + "\n" + g + "}" : "{" + f.join(",") + "}";
            e = g;
            return h;
    } } if (typeof Date.prototype.toJSON !== "function")
        Date.prototype.toJSON = function () { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + k(this.getUTCMonth() + 1) + "-" + k(this.getUTCDate()) + "T" + k(this.getUTCHours()) + ":" + k(this.getUTCMinutes()) + ":" + k(this.getUTCSeconds()) + "Z" : null; }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () { return this.valueOf(); }; var q = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, p = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, e, n, r = { "\u0008": "\\b", "\t": "\\t", "\n": "\\n", "\u000c": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, i; if (typeof JSON.stringify !== "function")
        JSON.stringify = function (a, j, c) { var d; n = e = ""; if (typeof c === "number")
            for (d = 0; d < c; d += 1)
                n += " ";
        else
            typeof c === "string" && (n = c); if ((i = j) && typeof j !== "function" && (typeof j !== "object" || typeof j.length !== "number"))
            throw Error("JSON.stringify"); return l("", { "": a }); }; if (typeof JSON.parse !== "function")
        JSON.parse = function (a, e) { function c(a, d) { var g, f, b = a[d]; if (b && typeof b === "object")
            for (g in b)
                Object.prototype.hasOwnProperty.call(b, g) && (f = c(b, g), f !== void 0 ? b[g] = f : delete b[g]); return e.call(a, d, b); } var d, a = String(a); q.lastIndex = 0; q.test(a) && (a = a.replace(q, function (a) { return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4); })); if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))
            return d = eval("(" + a + ")"), typeof e === "function" ? c({ "": d }, "") : d; throw new SyntaxError("JSON.parse"); }; })();
    var scriptName = 'Inspector Spacetime';
    var scriptVersion = '2.3';
    var thisComp, inspectorFolder, margin, leftEdge, panelSize = [0, 0], dataSize = [0, 0];
    var exp_counter = 'var sTime = marker.key("Start").time; var eTime = marker.key("End").time; var countTime = Math.max(time - sTime, 0); countTime = Math.min(countTime, eTime - sTime); var counter = Math.round(countTime * 1000); var playIcon = (time > sTime && time < eTime) ? "\u25ba " : "\u25a0 "; playIcon + counter + "ms";';
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
    function setComp() {
        if (app.activeViewer == null) {
            return false;
        }
        app.activeViewer.setActive();
        thisComp = app.project.activeItem;
        if (!thisComp || !(thisComp instanceof CompItem)) {
            return false;
        }
        return true;
    }
    function buttonColorText(parentObj, accentColor, buttonText) {
        var btn = parentObj.add('button', undefined, '', { name: 'ok' });
        btn.fillBrush = btn.graphics.newBrush(btn.graphics.BrushType.SOLID_COLOR, hexToArray(accentColor));
        btn.text = buttonText;
        btn.fillBrush = btn.graphics.newBrush(btn.graphics.BrushType.SOLID_COLOR, hexToArray(accentColor));
        btn.textPen = btn.graphics.newPen(btn.graphics.PenType.SOLID_COLOR, hexToArray('#ffffff'), 1);
        btn.onDraw = gfxDraw;
        return btn;
        function gfxDraw() {
            with (this) {
                graphics.drawOSControl();
                graphics.rectPath(0, 0, size[0], size[1]);
                graphics.fillPath(fillBrush);
                if (text) {
                    graphics.drawString(text, textPen, (size[0] - graphics.measureString(text, graphics.font, size[0])[0]) / 2, (size[1] - graphics.measureString(text, graphics.font, size[0])[1]) / 1.75, graphics.font);
                }
            }
        }
        function hexToArray(hexString) {
            var hexColor = hexString.replace('#', '');
            var r = parseInt(hexColor.slice(0, 2), 16) / 255, g = parseInt(hexColor.slice(2, 4), 16) / 255, b = parseInt(hexColor.slice(4, 6), 16) / 255;
            return [r, g, b, 1];
        }
    }
    function buttonColorVector(parentObj, iconVec, iconColor, size) {
        var artSize = size;
        var vButton = parentObj.add('button', [0, 0, size[0], size[1], undefined]);
        vButton.coord = vecToPoints(iconVec);
        vButton.fillColor = iconColor;
        vButton.onDraw = vecDraw;
        return vButton;
        function vecToPoints(vecCoord) {
            var points = [];
            var n;
            for (var i = 0; i < vecCoord.length; i++) {
                var eachNum = vecCoord[i].split(' ');
                var coordinates = [];
                var sets = [];
                for (var k = 0; k < eachNum.length; k += 2) {
                    sets.push(eachNum[k] + ',' + eachNum[k + 1]);
                }
                for (var j = 0; j < sets.length; j++) {
                    n = sets[j].split(',');
                    coordinates[j] = n;
                    coordinates[j][0] = (parseFloat(coordinates[j][0]));
                    coordinates[j][1] = (parseFloat(coordinates[j][1]));
                }
                points.push(coordinates);
            }
            return points;
        }
        function hexToArray(hexString) {
            var hexColor = hexString.replace('#', '');
            var r = parseInt(hexColor.slice(0, 2), 16) / 255, g = parseInt(hexColor.slice(2, 4), 16) / 255, b = parseInt(hexColor.slice(4, 6), 16) / 255;
            return [r, g, b, 1];
        }
        function vecDraw() {
            with (this) {
                graphics.drawOSControl();
                graphics.rectPath(0, 0, size[0], size[1]);
                graphics.fillPath(graphics.newBrush(graphics.BrushType.SOLID_COLOR, hexToArray(fillColor)));
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
    function setTimeMarkers(layer, startTime, endTime) {
        var layer_marker1 = new MarkerValue('Start');
        layer_marker1.eventCuePoint = true;
        layer_marker1.setParameters({});
        layer('ADBE Marker').setValueAtTime(startTime, layer_marker1);
        var layer_marker2 = new MarkerValue('End');
        layer_marker2.eventCuePoint = true;
        layer_marker2.setParameters({});
        layer('ADBE Marker').setValueAtTime(endTime, layer_marker2);
    }
    function timeToMs(time) {
        return Math.round(time * 1000) + 'ms';
    }
    function buildText_plain(str) {
        var propStr = str;
        try {
            var dynText = thisComp.layers.addText('Spec Layer Name');
            dynText.name = 'Spec Layer Name';
            dynText.comment = scriptName + '_data';
            var dynText_TextProp = dynText('ADBE Text Properties')('ADBE Text Document');
            var dynText_TextDocument = dynText_TextProp.value;
            dynText_TextDocument.resetCharStyle();
            dynText_TextDocument.fontSize = Math.floor(dataSize[0] / 16);
            dynText_TextDocument.font = 'CourierNewPS-BoldMT';
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
            dynText_TextProp.setValue(dynText_TextDocument);
            dynText_TextProp.setValue(propStr);
            var manualLineHeight = 10;
            var lineHeight = dynText('ADBE Text Properties')(4).addProperty('ADBE Text Animator');
            lineHeight.name = 'Line Height';
            lineHeight('ADBE Text Animator Properties').addProperty('ADBE Text Line Spacing');
            lineHeight(1).addProperty('ADBE Text Selector');
            lineHeight(2)('ADBE Text Line Spacing').setValue([0, manualLineHeight]);
            dynText('ADBE Transform Group')('ADBE Anchor Point').setValue([0, -dynText_TextDocument.fontSize * 0.82, 0]);
            dynText('ADBE Transform Group')('ADBE Position').setValue([leftEdge, margin, 0]);
            return dynText;
        }
        catch (e) {
            alert([
                e.toString(),
                'Error on line: ' + e.line.toString()
            ].join('\n'), scriptName);
        }
    }
    function buildTextBlock(p) {
        var firstKeyTime = p.firstKeyTime;
        var str = '';
        for (var j = 0; j < p.layers.length; j++) {
            layer = p.layers[j];
            str += '\u2261 ' + layer.name + ' \u2261\n';
            for (var i = 0; i < layer.props.length; i++) {
                prop = layer.props[i];
                str += '- ' + prop.name + ' -\n';
                str += 'Delay: ' + timeToMs(prop.startTime - firstKeyTime) + '\n';
                str += 'Dur: ' + timeToMs(prop.dur) + '\n';
                str += 'Val: ' + getValChange(prop) + '\n';
                str += getEase(prop) + '\n\n';
            }
        }
        return str;
    }
    function getKeyRange() {
        var selKeys = getSelKeys();
        if (selKeys.length < 1) {
            return [thisComp.time, thisComp.time + 1];
        }
        else {
            var firstKeyTime = 9999999;
            var lastKeyTime = 0;
            for (var _i = 0, selKeys_1 = selKeys; _i < selKeys_1.length; _i++) {
                var actKey = selKeys_1[_i];
                var prop = actKey.prop;
                var keys = actKey.keys;
                for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
                    var key = keys_1[_a];
                    var keyTime = prop.keyTime(key);
                    firstKeyTime = Math.min(firstKeyTime, keyTime);
                    lastKeyTime = Math.max(lastKeyTime, keyTime);
                }
            }
            return [firstKeyTime, lastKeyTime];
        }
    }
    function getSelKeys() {
        try {
            var selKeyList = [];
            var props = thisComp.selectedProperties;
            for (var i = 0; i < props.length; i++) {
                var prop = props[i];
                if (!prop.canVaryOverTime) {
                    continue;
                }
                var selKeys = prop.selectedKeys;
                if (selKeys.length < 2) {
                    continue;
                }
                if (selKeys.length % 2 > 0) {
                    selKeys.pop();
                }
                selKeyList.push({
                    prop: prop,
                    keys: selKeys || null
                });
            }
            return selKeyList;
        }
        catch (error) {
            return [];
        }
    }
    function getPropObj(opt_propObj) {
        if (opt_propObj == undefined) {
            propCollect = [],
                firstKeyTime = 9999999,
                lastKeyTime = 0;
            var propObj = {
                firstKeyTime: 9999999,
                lastKeyTime: 0,
                layers: []
            };
        }
        else {
            propObj = opt_propObj;
        }
        app.activeViewer.setActive();
        if (!setComp()) {
            return;
        }
        var selectedLayers = thisComp.selectedLayers;
        try {
            for (var i = 0; i < selectedLayers.length; i++) {
                var alreadyInList = false;
                for (var k = 0; k < propObj.layers.length; k++) {
                    if (selectedLayers[i].index == propObj.layers[k].index) {
                        var selectedProps = getProps(selectedLayers[i]);
                        var alreadyInPropList = false;
                        for (var m = 0; m < selectedProps.length; m++) {
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
                if (!alreadyInList) {
                    layer = selectedLayers[i];
                    propObj.layers.push({
                        name: layer.name,
                        matchName: layer.matchName,
                        index: layer.index,
                        props: getProps(layer)
                    });
                }
            }
        }
        catch (e) {
            alert('Select some keyframes.', scriptName);
            return;
        }
        propObj.firstKeyTime = firstKeyTime;
        propObj.lastKeyTime = lastKeyTime;
        return propObj;
        function getProps(layer) {
            var propCollect = [];
            for (var k = 0; k < layer.selectedProperties.length; k++) {
                prop = layer.selectedProperties[k];
                if (prop.canVaryOverTime &&
                    prop.selectedKeys.length > 1) {
                    var selKeys = prop.selectedKeys;
                    for (var m = 0; m < selKeys.length - 1; m++) {
                        propCollect.push({
                            obj: prop,
                            threeDLayer: layer.threeDLayer || (layer instanceof CameraLayer),
                            propertyValueType: prop.propertyValueType,
                            name: prop.name,
                            matchName: prop.matchName,
                            dur: prop.keyTime(selKeys[m + 1]) - prop.keyTime(selKeys[m]),
                            startTime: prop.keyTime(selKeys[m]),
                            startValue: prop.keyValue(selKeys[m]),
                            startTemporalEase: prop.keyOutTemporalEase(selKeys[m])[0],
                            startEaseType: prop.keyOutInterpolationType(selKeys[m]),
                            endTime: prop.keyTime(selKeys[m + 1]),
                            endValue: prop.keyValue(selKeys[m + 1]),
                            endTemporalEase: prop.keyInTemporalEase(selKeys[m + 1])[0],
                            endEaseType: prop.keyInInterpolationType(selKeys[m + 1]),
                            duration: prop.keyTime(selKeys[m + 1]) - prop.keyTime(selKeys[m])
                        });
                    }
                    firstKeyTime = Math.min(firstKeyTime, propCollect[0].startTime);
                    lastKeyTime = Math.max(lastKeyTime, propCollect[propCollect.length - 1].endTime);
                }
            }
            return propCollect;
        }
    }
    function getPropText(propObj) {
        return [
            'Total Dur: ' + timeToMs(propObj.lastKeyTime - propObj.firstKeyTime),
            '',
            buildTextBlock(propObj)
        ].join('\n');
    }
    function buildCounter() {
        setComp();
        var keyRange = getKeyRange();
        app.beginUndoGroup('New Counter');
        try {
            var dynText = thisComp.layers.addText('Counter');
            dynText.name = 'Counter';
            dynText.comment = scriptName + '_data';
            var dynText_TextProp = dynText('ADBE Text Properties')('ADBE Text Document');
            var dynText_TextDocument = dynText_TextProp.value;
            dynText_TextDocument.resetCharStyle();
            dynText_TextDocument.fontSize = thisComp.width / 30;
            dynText_TextDocument.font = 'CourierNewPS-BoldMT';
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
            dynText_TextProp.setValue(dynText_TextDocument);
            dynText_TextProp.setValue('\u25ba');
            var manualLineHeight = 10;
            var lineHeight = dynText('ADBE Text Properties')(4).addProperty('ADBE Text Animator');
            lineHeight.name = 'Line Height';
            lineHeight('ADBE Text Animator Properties').addProperty('ADBE Text Line Spacing');
            lineHeight(1).addProperty('ADBE Text Selector');
            lineHeight(2)('ADBE Text Line Spacing').setValue([0, manualLineHeight]);
            dynText('ADBE Transform Group')('ADBE Position').setValue([100, 100]);
        }
        catch (e) {
            alert(e.toString() + "\nError on line: " + e.line.toString());
        }
        setTimeMarkers(dynText, keyRange[0], keyRange[1]);
        dynText('ADBE Text Properties')('ADBE Text Document').expression = exp_counter;
        app.executeCommand(2771);
        app.executeCommand(2771);
        app.endUndoGroup();
    }
    function getEase(activeProp) {
        try {
            var dims = (activeProp.obj.value instanceof Array) ? activeProp.obj.value.length : 1;
            var k1 = activeProp.startValue;
            var k2 = activeProp.endValue;
            var valChange;
            if (dims == 1 || activeProp.propertyType == PropertyType.PROPERTY) {
                valChange = k2 - k1;
            }
            else {
                if (activeProp.matchName.indexOf('Size') != -1) {
                    valChange = 100000000000000;
                }
                else {
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
            var y2 = 1 - (keyInSpeed * (x2 - 1)) * (activeProp.duration / valChange) * y2Mult;
            if (activeProp.startEaseType == KeyframeInterpolationType.LINEAR && activeProp.endEaseType == KeyframeInterpolationType.LINEAR) {
                return 'Linear';
            }
            else if (activeProp.startEaseType == KeyframeInterpolationType.HOLD) {
                return 'Hold';
            }
            else if (isNaN(y1)) {
                return 'No Change';
            }
            else {
                return '(' + round(x1) + ', ' + round(y1) + ', ' + round(x2) + ', ' + round(y2) + ')';
            }
        }
        catch (e) {
            return '()';
        }
    }
    function resizeCompNew(work_comp) {
        for (var i = 1; i <= work_comp.layers.length; i++) {
            if (thisComp.layers[i].comment === scriptName + '_panel') {
                return;
            }
        }
        createISTfolder();
        thisComp = work_comp.duplicate();
        thisComp.parentFolder = inspectorFolder;
        thisComp.name = work_comp.name + '_Spec';
        thisComp.openInViewer();
        panelSize = [Math.floor(thisComp.height / 3), thisComp.height];
        leftEdge = thisComp.width;
        thisComp.width = leftEdge + panelSize[0];
        try {
            var compInfo = thisComp.layers.addShape();
            compInfo.name = 'Spec Panel 1';
            compInfo.comment = scriptName + '_panel';
            compInfo.label = 0;
            var shapeGroup = compInfo('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
            shapeGroup.name = 'Rectangle 1';
            var rect = shapeGroup(2).addProperty('ADBE Vector Shape - Rect');
            rect('ADBE Vector Rect Size').setValue(panelSize);
            rect('ADBE Vector Rect Position').setValue(panelSize / 2);
            var stroke = shapeGroup(2).addProperty('ADBE Vector Graphic - Stroke');
            stroke.enabled = false;
            stroke('ADBE Vector Stroke Width').setValue(6);
            var fill = shapeGroup(2).addProperty('ADBE Vector Graphic - Fill');
            fill('ADBE Vector Fill Color').setValue([0.08203125, 0.5625, 0.91796875, 1]);
            var shapeGroup2 = compInfo('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
            shapeGroup2.name = 'Admin';
            shapeGroup2(3)('ADBE Vector Scale').setValue(panelSize);
            compInfo('ADBE Transform Group')('ADBE Position').setValue([leftEdge, 0]);
        }
        catch (e) {
            alert([
                e.toString(),
                'Error on line: ' + e.line.toString()
            ].join('\n'), scriptName);
        }
        margin = Math.floor(panelSize[0] / 18);
        panelSize -= margin * 2;
        leftEdge += margin;
    }
    function round(value, opt_decimals) {
        try {
            var decimals = opt_decimals || 2;
            return parseFloat(value.toFixed(decimals));
        }
        catch (e) {
            return value;
        }
    }
    function roundArray(array, opt_decimals) {
        if (!(array instanceof Array)) {
            return round(array, opt_decimals);
        }
        var rounded = [];
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            var roundedElement = round(element, opt_decimals);
            rounded.push(roundedElement);
        }
        return rounded;
    }
    function createISTfolder() {
        var hasRedlineFolder = false;
        for (var i = 1; i <= app.project.numItems; i++) {
            if (app.project.item(i) instanceof FolderItem) {
                if (app.project.item(i).name == scriptName) {
                    hasRedlineFolder = true;
                    inspectorFolder = app.project.item(i);
                    break;
                }
            }
        }
        if (!hasRedlineFolder) {
            inspectorFolder = app.project.items.addFolder(scriptName);
        }
    }
    function getPanelSize() {
        for (var i = 1; i <= thisComp.layers.length; i++) {
            if (thisComp.layer(i).comment == scriptName + '_panel') {
                panelSize = thisComp.layer(i)('ADBE Root Vectors Group')(2)(3)('ADBE Vector Scale').value;
                margin = Math.floor(panelSize[0] / 18);
                leftEdge = thisComp.layer(i)('ADBE Transform Group')('ADBE Position').value[0] + margin;
                dataSize = [panelSize[0] - margin * 2, panelSize[1] - margin * 2];
                return;
            }
        }
    }
    function getValChange(activeProp) {
        switch (activeProp.obj.matchName) {
            case 'ADBE Scale':
                return valScale(activeProp);
            case 'ADBE Position_0':
                return valXPosition(activeProp);
            case 'ADBE Position_1':
                return valXPosition(activeProp);
            case 'ADBE Position':
                return valPosition(activeProp);
            case 'ADBE Rotate Z':
                return valRotation(activeProp);
            case 'ADBE Opacity':
                return valOpacity(activeProp);
            case 'ADBE Mask Shape':
                return 'Mask data unsupported';
            case 'ADBE Vector Shape':
                return 'Path data unsupported';
            default:
                return valGeneric(activeProp);
        }
    }
    function valPosition(activeProp) {
        var a = activeProp.startValue;
        var b = activeProp.endValue;
        var aRounded = roundArray(a);
        var bRounded = roundArray(b);
        if (!activeProp.threeDLayer) {
            aRounded.length = 2;
            bRounded.length = 2;
        }
        return JSON.stringify(aRounded) + '››' + JSON.stringify(bRounded);
    }
    function valXPosition(activeProp) {
        var a = activeProp.startValue;
        var b = activeProp.endValue;
        var pixelMult = ddl_resolution.selection.index + 1;
        if (rad_pos.children[1].value) {
            var vectDist = (b - a) / pixelMult;
            return (Math.round(vectDist) + 'dp');
        }
        else {
            return (round(a, 2) + '››' + round(b, 2));
        }
    }
    function valOpacity(activeProp) {
        var a = activeProp.startValue;
        var b = activeProp.endValue;
        return (round(a, 2) + '% ››› ' + round(b, 2) + '%');
    }
    function valRotation(activeProp) {
        var a = activeProp.startValue;
        var b = activeProp.endValue;
        return round(a) + '° ››› ' + round(b) + '°';
    }
    function valScale(activeProp) {
        var a = activeProp.startValue;
        var b = activeProp.endValue;
        var single = (round(a[0]) == round(a[1]) && round(b[0]) == round(b[1])) ? true : false;
        if (single) {
            return (round(a[0]) + '% ›› ' + round(b[0]) + '%');
        }
        else {
            var aRounded = roundArray(a);
            var bRounded = roundArray(b);
            if (!activeProp.threeDLayer) {
                aRounded.length = 2;
                bRounded.length = 2;
            }
            return JSON.stringify(aRounded) + '%››' + JSON.stringify(bRounded) + '%';
        }
    }
    function valGeneric(activeProp) {
        var a = activeProp.startValue;
        var b = activeProp.endValue;
        if (a instanceof Array) {
            var single = (round(a[0]) == round(a[1]) && round(b[0]) == round(b[1])) ? true : false;
            if (single) {
                return (round(a[0]) + ' ›› ' + round(b[0]));
            }
            else {
                var aRounded = roundArray(a);
                var bRounded = roundArray(b);
                if (!activeProp.threeDLayer) {
                    aRounded.length = 2;
                    bRounded.length = 2;
                }
                return JSON.stringify(aRounded) + '››' + JSON.stringify(bRounded);
            }
        }
        else {
            return (round(a, 2) + '››' + round(b, 2));
        }
    }
    function buildIsoLayer() {
        var isolationLayer = thisComp.layers.addShape();
        isolationLayer.name = '\u2193\u2193 Isolation \u2193\u2193';
        isolationLayer.label = 0;
        isolationLayer.adjustmentLayer = true;
        var shapeGroup = isolationLayer('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
        shapeGroup.name = 'Rectangle 1';
        var rect = shapeGroup(2).addProperty('ADBE Vector Shape - Rect');
        rect('ADBE Vector Rect Size').setValue([thisComp.width, thisComp.height]);
        var stroke = shapeGroup(2).addProperty('ADBE Vector Graphic - Stroke');
        stroke.enabled = false;
        stroke('ADBE Vector Stroke Width').setValue(3);
        var fill = shapeGroup(2).addProperty('ADBE Vector Graphic - Fill');
        fill('ADBE Vector Fill Color').setValue([0, 0, 0, 1]);
        var tint = isolationLayer('ADBE Effect Parade').addProperty('ADBE Tint');
        tint('ADBE Tint-0001').setValue([0.3, 0.3, 0.3, 1]);
        tint('ADBE Tint-0002').setValue([0.35, 0.35, 0.35, 1]);
    }
    function buildPointer() {
        try {
            if (leftEdge == undefined) {
                alert('Gotta create a spec panel first.', scriptName);
                return;
            }
            var pointer1 = thisComp.layers.addShape();
            pointer1.name = 'Pointer 1';
            pointer1.label = 2;
            var shapeGroup = pointer1('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
            shapeGroup.name = 'Pointer';
            shapeGroup(2).addProperty('ADBE Vector Shape - Rect');
            var trim = shapeGroup(2).addProperty('ADBE Vector Filter - Trim');
            trim('ADBE Vector Trim End').setValue(25);
            trim('ADBE Vector Trim Offset').setValue(-90);
            var gradFill = shapeGroup(2).addProperty('ADBE Vector Graphic - G-Fill');
            gradFill.enabled = false;
            shapeGroup(3)('ADBE Vector Anchor').setValue([0, -50]);
            shapeGroup(3)('ADBE Vector Position').setValue([-580, 0]);
            shapeGroup(3)('ADBE Vector Scale').setValue([100, 100]);
            var shapeGroup2 = pointer1('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
            shapeGroup2.name = 'Arm';
            shapeGroup2(2).addProperty('ADBE Vector Shape - Rect');
            var trim2 = shapeGroup2(2).addProperty('ADBE Vector Filter - Trim');
            trim2('ADBE Vector Trim End').setValue(50);
            trim2('ADBE Vector Trim Offset').setValue(180);
            var gradFill2 = shapeGroup2(2).addProperty('ADBE Vector Graphic - G-Fill');
            gradFill2.enabled = false;
            shapeGroup2(3)('ADBE Vector Anchor').setValue([50, -50]);
            shapeGroup2(3)('ADBE Vector Scale').setValue([564, 349]);
            var stroke = pointer1('ADBE Root Vectors Group').addProperty('ADBE Vector Graphic - Stroke');
            stroke('ADBE Vector Stroke Width').setValue(6);
            stroke('ADBE Vector Stroke Color').setValue([0.4795, 0.4795, 0.4795, 1]);
            var fxPoint = pointer1('ADBE Effect Parade').addProperty('ADBE Point Control');
            fxPoint.name = 'Arm Length';
            fxPoint('ADBE Point Control-0001').setValue([775, 200]);
            var fxSize = pointer1('ADBE Effect Parade').addProperty('ADBE Slider Control');
            fxSize.name = 'Pointer Size';
            fxSize('ADBE Slider Control-0001').setValue(200);
            pointer1('ADBE Transform Group')('ADBE Position').setValue([leftEdge - margin * 2, 192, 0]);
            try {
                pointer1('ADBE Root Vectors Group')(1)(3)('ADBE Vector Position').expression = [
                    'p = effect("Arm Length")("Point");',
                    '[-p[0], p[1]]'
                ].join('\n');
                pointer1('ADBE Root Vectors Group')(1)(3)('ADBE Vector Scale').expression = [
                    's = effect("Pointer Size")("Slider");',
                    '[s, s]'
                ].join('\n');
                pointer1('ADBE Root Vectors Group')(2)(3)('ADBE Vector Scale').expression = 'effect("Arm Length")("Point")';
            }
            catch (err) { }
        }
        catch (e) {
            alert([
                e.toString(),
                'Error on line: ' + e.line.toString()
            ].join('\n'), scriptName);
        }
    }
    function visitURL(url) {
        if ($.os.indexOf('Windows') != -1) {
            system.callSystem('cmd /c "' + Folder.commonFiles.parent.fsName + "\\Internet Explorer\\iexplore.exe" + '" ' + url);
        }
        else {
            var cmd = 'open "' + url + '"';
            system.callSystem(cmd);
        }
    }
    function replacer(key, val) {
        if (key === 'obj') {
            return undefined;
        }
        else {
            return val;
        }
        ;
    }
    ;
    function getUserFile(filename, filter) {
        var defaultPath = Folder.desktop.fullName + '/' + filename;
        var outputFile = new File(defaultPath).saveDlg('Choose output path', filter);
        if (!outputFile) {
            return null;
        }
        return outputFile;
    }
    function writeFile(path, contents) {
        var file = path instanceof File ? path : new File(path);
        file.open('w');
        var writeSuccess = file.write(contents);
        file.close();
        if (!writeSuccess) {
            throw new Error('Could not write file ' + file.toString());
        }
        return file;
    }
    function getKeysSpec() {
        try {
            if (!setComp()) {
                return;
            }
            var selKeys = getSelKeys();
            var spec = {
                compName: thisComp.name,
                layers: []
            };
            var activeLayer = null;
            for (var _i = 0, selKeys_2 = selKeys; _i < selKeys_2.length; _i++) {
                var actKey = selKeys_2[_i];
                var prop = actKey.prop;
                var layer = prop.propertyGroup(prop.propertyDepth);
                var keys = actKey.keys;
                if (activeLayer != layer) {
                    activeLayer = layer;
                    spec.layers.push({
                        name: layer.name,
                        props: []
                    });
                }
                var propSpec = getPropSpec(actKey);
                spec.layers[spec.layers.length - 1].props.push({
                    name: prop.name,
                    value: propSpec.value,
                    duration: propSpec.duration,
                    ease: propSpec.ease,
                    delay: propSpec.delay
                });
            }
            return spec;
        }
        catch (e) {
            alert(e.toString() + "\nError on line: " + e.line.toString());
        }
    }
    function getPropSpec(actKey) {
        var _a;
        var prop = actKey.prop;
        var keys = actKey.keys;
        var duration = prop.keyTime(keys[1]) - prop.keyTime(keys[0]);
        var valChange = {
            name: prop.matchName,
            start: null,
            end: null
        };
        if (prop.propertyValueType !== PropertyValueType.NO_VALUE) {
            valChange.start = prop.keyValue(keys[0]);
            valChange.end = prop.keyValue(keys[1]);
        }
        if (prop.matchName.match(/Shape/)) {
            valChange.start = null;
            valChange.end = null;
        }
        var layer = prop.propertyGroup(prop.propertyDepth);
        if (!layer.threeDLayer && ((_a = valChange === null || valChange === void 0 ? void 0 : valChange.start) === null || _a === void 0 ? void 0 : _a.length) > 2) {
            valChange.start.pop();
            valChange.end.pop();
        }
        var startVal, endVal;
        try {
            startVal = actKey.prop.keyValue(actKey.keys[0]);
            endVal = actKey.prop.keyValue(actKey.keys[1]);
        }
        catch (e) {
            startVal = 0;
            endVal = 1;
        }
        var x1 = 5, y1 = 5, x2 = 5, y2 = 5;
        if (prop.keyOutInterpolationType(actKey.keys[0]) == KeyframeInterpolationType.LINEAR &&
            prop.keyInInterpolationType(actKey.keys[1]) == KeyframeInterpolationType.LINEAR) {
            x1 = 0, y1 = 0, x2 = 1, y2 = 1;
        }
        else if (prop.keyOutInterpolationType(actKey.keys[0]) == KeyframeInterpolationType.HOLD) {
            x1 = 0, y1 = 0, x2 = 0, y2 = 0;
        }
        else {
            var change = void 0;
            if (startVal.length > 1) {
                if (prop.matchName.split('Size').length > 1 || prop.matchName.split('Scale').length > 1) {
                    change = endVal[0] - startVal[0];
                }
                else {
                    change = Math.sqrt(Math.pow(endVal[0] - startVal[0], 2) + Math.pow(endVal[1] - startVal[1], 2));
                }
            }
            else {
                if (isNaN(endVal)) {
                    change = 1;
                }
                else {
                    change = endVal - startVal;
                }
            }
            var startOutEase = prop.keyOutTemporalEase(actKey.keys[0])[0];
            var endInEase = prop.keyInTemporalEase(actKey.keys[1])[0];
            var keyOutSpeed = startOutEase.speed;
            var keyInSpeed = endInEase.speed;
            x1 = startOutEase.influence / 100;
            y1 = (keyOutSpeed * x1) * (duration / (change || 0.0000000001));
            x2 = 1 - endInEase.influence / 100;
            y2 = 1 + (keyInSpeed * (x2 - 1)) * (duration / (change || 0.0000000001));
            if (prop.keyOutInterpolationType(actKey.keys[0]) == KeyframeInterpolationType.LINEAR) {
                x1 = 0.17, y1 = 0.17;
            }
            else if (prop.keyInInterpolationType(actKey.keys[1]) == KeyframeInterpolationType.LINEAR) {
                x2 = 0.83, y2 = 0.83;
            }
        }
        return {
            value: valChange,
            duration: duration,
            ease: [x1, y1, x2, y2],
            delay: prop.keyTime(keys[0]) - thisComp.time
        };
    }
    function parseSpecText(json) {
        try {
            var str = '';
            str = "# " + json.compName + "\n";
            for (var _i = 0, _a = json.layers; _i < _a.length; _i++) {
                var layer = _a[_i];
                str += "\n## " + layer.name;
                for (var _b = 0, _c = layer.props; _b < _c.length; _b++) {
                    var prop = _c[_b];
                    var val = getVal(prop.value);
                    str += "\n" + prop.name;
                    if (val != ' ') {
                        str += ": " + val;
                    }
                    str += "\n- Duration: " + timeToMs(prop.duration);
                    str += "\n- " + getCubic(prop.ease);
                    if (prop.delay != 0) {
                        str += "\n- Delay: " + timeToMs(prop.delay);
                    }
                    str += '\n';
                }
            }
            return str;
        }
        catch (e) {
            alert(e.toString() + "\nError on line: " + e.line.toString());
        }
    }
    function getVal(valObj) {
        var str = '';
        if (valObj.name.match(/Opacity/) != null) {
            str = round(valObj.start) + " \u2192 " + round(valObj.end) + "%";
        }
        else if (valObj.name.match(/Scale/) != null) {
            str = round(valObj.start[0]) + " \u2192 " + round(valObj.end[0]) + "%";
        }
        else if (valObj.name.match(/Position_0|Position_1|Position_2/) != null) {
            str = round(valObj.start) + " \u2192 " + round(valObj.end) + "px";
        }
        else if (valObj.name.match(/Rotate/) != null) {
            str = round(valObj.start) + " \u2192 " + round(valObj.end) + "\u00BA";
        }
        else if (valObj.name.match(/Color|Shape/) != null) {
            str = " ";
        }
        else {
            str = null;
        }
        if (!str) {
            str = '';
            for (var i in valObj.start) {
                if (!isNaN(i)) {
                    str += round(valObj.start[i]) + " \u2192 " + round(valObj.end[i]) + " | ";
                }
            }
            str = str.slice(0, -3);
        }
        return str;
    }
    function getCubic(arr) {
        var val = '';
        var color = '';
        var easeLib = {
            linear: {
                val: [0.0, 0.0, 1.0, 1.0]
            },
            hold: {
                val: [0.0, 0.0, 0.0, 0.0]
            }
        };
        var tokenMatch = null;
        for (var key in easeLib) {
            if (Object.hasOwnProperty.call(easeLib, key)) {
                var cubicBez = easeLib[key].val;
                var tollerance = 0.01;
                var match = true;
                for (var i = 0; i < cubicBez.length; i++) {
                    if (Math.abs(cubicBez[i] - arr[i]) > tollerance) {
                        match = false;
                    }
                }
                if (match) {
                    tokenMatch = {
                        name: capitalizeFirstLetter(key),
                        cubic: cubicBez
                    };
                }
            }
        }
        if (tokenMatch) {
            val = "" + tokenMatch.name;
        }
        else {
            val = "(" + arr[0].toFixed(2) + ", " + arr[1].toFixed(2) + ", " + arr[2].toFixed(2) + ", " + arr[3].toFixed(2) + ")";
            color = (this.darkmode) ? 'hsl(196, 70%, 50%)' : 'hsl(196, 70%, 50%)';
        }
        return val;
    }
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    function buildUI() {
        var myPanel = (thisObj instanceof Panel) ? thisObj : new Window('palette', scriptName, undefined, { resizeable: true });
        if (myPanel === null)
            return;
        myPanel.orientation = "column";
        myPanel.alignChildren = ["left", "top"];
        myPanel.preferredSize.width = 300;
        myPanel.spacing = 4;
        myPanel.margins = 12;
        var btn_getSpec = myPanel.add("button", undefined, undefined, { name: "btn_getSpec" });
        btn_getSpec.text = "Get specs from selected keys";
        btn_getSpec.alignment = ["fill", "top"];
        var tpanel1 = myPanel.add("tabbedpanel", undefined, undefined, { name: "tpanel1" });
        tpanel1.alignChildren = "fill";
        tpanel1.preferredSize.width = 246.359;
        tpanel1.margins = 0;
        tpanel1.alignment = ["fill", "top"];
        var tab1 = tpanel1.add("tab", undefined, undefined, { name: "tab1" });
        tab1.text = "Text";
        tab1.orientation = "column";
        tab1.alignChildren = ["left", "top"];
        tab1.spacing = 10;
        tab1.margins = 0;
        var txt_textField = tab1.add('edittext {properties: {name: "txt_textField", multiline: true, scrollable: true}}');
        txt_textField.helpTip = "Event marker name";
        txt_textField.preferredSize.height = 200;
        txt_textField.alignment = ["fill", "top"];
        var group1 = tab1.add("group", undefined, { name: "group1" });
        group1.orientation = "row";
        group1.alignChildren = ["center", "center"];
        group1.spacing = 10;
        group1.margins = 0;
        group1.alignment = ["fill", "top"];
        var btn_newBarSide = group1.add("button", undefined, undefined, { name: "btn_newBarSide" });
        btn_newBarSide.text = "New side bar";
        btn_newBarSide.justify = "left";
        btn_newBarSide.alignment = ["center", "fill"];
        var btn_newBarBottom = group1.add("button", undefined, undefined, { name: "btn_newBarBottom" });
        btn_newBarBottom.text = "New bottom bar";
        btn_newBarBottom.justify = "left";
        btn_newBarBottom.alignment = ["center", "fill"];
        var tab2 = tpanel1.add("tab", undefined, undefined, { name: "tab2" });
        tab2.text = "JSON";
        tab2.orientation = "column";
        tab2.alignChildren = ["left", "top"];
        tab2.spacing = 10;
        tab2.margins = 0;
        tpanel1.selection = tab1;
        var txt_jsonField = tab2.add('edittext {properties: {name: "txt_jsonField", multiline: true, scrollable: true}}');
        txt_jsonField.helpTip = "Event marker name";
        txt_jsonField.preferredSize.height = 200;
        txt_jsonField.alignment = ["fill", "top"];
        var btn_saveJSON = tab2.add("button", undefined, undefined, { name: "btn_saveJSON" });
        btn_saveJSON.text = "Save to .JSON";
        btn_saveJSON.alignment = ["fill", "top"];
        var group2 = myPanel.add("group", undefined, { name: "group2" });
        group2.orientation = "row";
        group2.alignChildren = ["left", "center"];
        group2.spacing = 10;
        group2.margins = 0;
        group2.alignment = ["fill", "top"];
        var btn_newCounter = group2.add("button", undefined, undefined, { name: "btn_newCounter" });
        btn_newCounter.helpTip = "Create a time counter layer";
        btn_newCounter.text = "New counter";
        btn_newCounter.justify = "left";
        btn_newCounter.alignment = ["left", "fill"];
        myPanel.onResizing = myPanel.onResize = function () {
            myPanel.layout.resize();
        };
        if (myPanel instanceof Window) {
            myPanel.center();
            myPanel.show();
        }
        else {
            myPanel.layout.layout(true);
            myPanel.layout.resize();
        }
        btn_getSpec.onClick = function () {
            var specJSON = getKeysSpec();
            txt_textField.text = parseSpecText(specJSON);
            txt_jsonField.text = (JSON.stringify(specJSON, false, 2));
        };
        btn_saveJSON.onClick = function () {
            var specJSON = getKeysSpec();
            specJSON.spacetimeVersion = scriptVersion;
            specJSON.aeVersion = app.version;
            var outputFile = getUserFile('spec.spacetime.json', 'spacetime:*.spacetime.json;');
            if (!outputFile) {
                return;
            }
            try {
                var writtenFile = writeFile(outputFile, JSON.stringify(specJSON, replacer, 2));
                writtenFile.parent.execute();
            }
            catch (e) {
                alert(e, scriptName);
            }
        };
        btn_newCounter.onClick = function () {
            buildCounter();
        };
    }
    var isKBarRunning = (typeof kbar !== 'undefined');
    if (isKBarRunning && kbar.button) {
        var button = kbar.button;
        switch (button.argument.toLowerCase()) {
            case 'run':
                break;
            default:
                buildUI();
                break;
        }
    }
    else {
        buildUI();
    }
})(this);
