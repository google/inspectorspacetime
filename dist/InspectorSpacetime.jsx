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
    var scriptVersion = '2.5';
    var thisComp, easeLib = {};
    var exp_counter = 'var sTime = marker.key("Start").time; var eTime = marker.key("End").time; var countTime = Math.max(time - sTime, 0); countTime = Math.min(countTime, eTime - sTime); var counter = Math.round(countTime * 1000); var playIcon = (time > sTime && time < eTime) ? "\u25ba " : "\u25a0 "; playIcon + counter + "ms";';
    var configFolder = Folder.userData.toString() + '/BattleAxe/InspectorSpacetime/config/';
    initConfig();
    function initConfig() {
        easeLib = {
            linear: {
                val: [0.0, 0.0, 1.0, 1.0]
            },
            hold: {
                val: [0.0, 0.0, 0.0, 0.0]
            }
        };
        var easeLibPath = configFolder + "/ease-library.json";
        if (!Folder(configFolder).exists) {
            Folder(configFolder).create();
        }
        if (!Folder(easeLibPath).exists) {
            writeFile(easeLibPath, JSON.stringify(easeLib, replacer, 2));
        }
        else {
            var file = File(easeLibPath);
            file.open('r');
            var data = file.read();
            file.close();
            if (data != '') {
                easeLib = JSON.parse(data);
            }
        }
    }
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
    function buildCounter() {
        setComp();
        var keyRange = getKeyRange();
        app.beginUndoGroup('New Counter');
        try {
            var dynText = thisComp.layers.addText('Counter');
            dynText.name = 'Counter';
            dynText.comment = scriptName + '_data';
            dynText.guideLayer = true;
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
    function round(value, opt_decimals) {
        try {
            var decimals = opt_decimals || 2;
            return parseFloat(value.toFixed(decimals));
        }
        catch (e) {
            return value;
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
            var keyRange = getKeyRange();
            if (selKeys.length < 1) {
                return {
                    compName: 'Select some keyframes',
                    layers: []
                };
            }
            var spec = {
                compName: thisComp.name,
                spacetimeVersion: scriptVersion,
                aeVersion: app.version,
                totalDur: keyRange[1] - keyRange[0],
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
                var nameOverride = null;
                if (prop.matchName.match(/Slider|Angle/) != null) {
                    nameOverride = prop.propertyGroup(1).name;
                }
                spec.layers[spec.layers.length - 1].props.push({
                    name: nameOverride || prop.name,
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
            matchName: prop.matchName,
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
    function parseSpecText(specObj, markdown) {
        try {
            var lineBreak = (markdown) ? '\n\n' : '\n';
            var h1 = (markdown) ? '# ' : '';
            var h2 = (markdown) ? '## ' : '\n';
            var propLine = (markdown) ? '\n    ' : '\n  ';
            var str = '';
            str = "" + h1 + specObj.compName;
            str += (markdown) ? '\n\n' : '\n';
            str += (specObj.totalDur) ? "Total duration: " + timeToMs(specObj.totalDur) + "\n" : '';
            for (var _i = 0, _a = specObj.layers; _i < _a.length; _i++) {
                var layer = _a[_i];
                str += (markdown) ? "\n" : "";
                str += "" + h2 + layer.name;
                for (var _b = 0, _c = layer.props; _b < _c.length; _b++) {
                    var prop = _c[_b];
                    var val = getVal(prop.value);
                    str += "\n";
                    str += "- " + prop.name;
                    if (val != ' ') {
                        str += ": " + val;
                    }
                    str += propLine + "Duration: " + timeToMs(prop.duration);
                    str += "" + propLine + getCubic(prop.ease);
                    if (prop.delay != 0) {
                        str += propLine + "Delay: " + timeToMs(prop.delay);
                    }
                    str += "\n";
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
        if (valObj.matchName.match(/Opacity/) != null) {
            str = round(valObj.start) + " \u2192 " + round(valObj.end) + "%";
        }
        else if (valObj.matchName.match(/Scale/) != null) {
            str = round(valObj.start[0]) + " \u2192 " + round(valObj.end[0]) + "%";
        }
        else if (valObj.matchName.match(/Position_0|Position_1|Position_2/) != null) {
            str = round(valObj.start) + " \u2192 " + round(valObj.end) + "px";
        }
        else if (valObj.matchName.match(/Rotate|Angle/) != null) {
            str = round(valObj.start) + " \u2192 " + round(valObj.end) + "\u00BA";
        }
        else if (valObj.matchName.match(/Color|Shape/) != null) {
            str = " ";
        }
        else {
            str = null;
        }
        if (!str) {
            str = '';
            if (valObj.start.length > 1) {
                for (var i in valObj.start) {
                    if (!isNaN(i)) {
                        str += round(valObj.start[i]) + " \u2192 " + round(valObj.end[i]) + " | ";
                    }
                }
                str = str.slice(0, -3);
            }
            else {
                str = round(valObj.start) + " \u2192 " + round(valObj.end);
            }
        }
        return str;
    }
    function getCubic(arr) {
        var val = '';
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
        var parenCubic = "(" + round(arr[0]) + ", " + round(arr[1]) + ", " + round(arr[2]) + ", " + round(arr[3]) + ")";
        if (tokenMatch) {
            val = "" + tokenMatch.name;
        }
        else {
            val = parenCubic;
        }
        return val;
        function round(num) {
            var rounded = num.toFixed(2);
            if (rounded === '-0.00') {
                rounded = '0.00';
            }
            return rounded;
        }
    }
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function buildUI() {
        var specJSON = getKeysSpec();
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
        tpanel1.margins = 0;
        tpanel1.alignment = ["fill", "fill"];
        var tab1 = tpanel1.add("tab", undefined, undefined, { name: "tab1" });
        tab1.text = "Text";
        tab1.orientation = "column";
        tab1.alignChildren = ["fill", "fill"];
        tab1.spacing = 10;
        tab1.margins = 0;
        var txt_textField = tab1.add('edittext {properties: {name: "txt_textField", multiline: true, scrollable: true}}');
        txt_textField.alignment = ["fill", "fill"];
        txt_textField.text = parseSpecText(specJSON);
        var tab2 = tpanel1.add("tab", undefined, undefined, { name: "tab2" });
        tab2.text = "MD";
        tab2.orientation = "column";
        tab2.alignChildren = ["left", "top"];
        tab2.spacing = 10;
        tab2.margins = 0;
        var txt_mdField = tab2.add('edittext {properties: {name: "txt_mdField", multiline: true, scrollable: true}}');
        txt_mdField.alignment = ["fill", "fill"];
        txt_mdField.text = parseSpecText(specJSON, true);
        var tab3 = tpanel1.add("tab", undefined, undefined, { name: "tab3" });
        tab3.text = "JSON";
        tab3.orientation = "column";
        tab3.alignChildren = ["left", "top"];
        tab3.spacing = 10;
        tab3.margins = 0;
        tpanel1.selection = tab1;
        var txt_jsonField = tab3.add('edittext {properties: {name: "txt_jsonField", multiline: true, scrollable: true}}');
        txt_jsonField.alignment = ["fill", "fill"];
        txt_jsonField.text = (JSON.stringify(specJSON, false, 2));
        var btn_saveJSON = tab3.add("button", undefined, undefined, { name: "btn_saveJSON" });
        btn_saveJSON.text = "Save to .JSON";
        btn_saveJSON.alignment = ["fill", "bottom"];
        var group1 = myPanel.add("group", undefined, { name: "group1" });
        group1.orientation = "row";
        group1.alignChildren = ["left", "center"];
        group1.spacing = 10;
        group1.margins = 0;
        group1.alignment = ["fill", "bottom"];
        var btn_newCounter = group1.add("button", undefined, undefined, { name: "btn_newCounter" });
        btn_newCounter.helpTip = "Create a time counter layer";
        btn_newCounter.text = "New counter";
        btn_newCounter.justify = "left";
        var btn_settings = group1.add("button", undefined, undefined, { name: "btn_settings" });
        btn_settings.helpTip = "Settings";
        btn_settings.text = "✱";
        btn_settings.preferredSize.width = 40;
        btn_settings.justify = "right";
        var btn_help = group1.add("button", undefined, undefined, { name: "btn_help" });
        btn_help.helpTip = "Guide";
        btn_help.text = "Learn stuff";
        btn_help.justify = "right";
        group1.add("staticText", undefined, "v" + scriptVersion, { name: "btn_help" });
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
            txt_mdField.text = parseSpecText(specJSON, true);
            txt_jsonField.text = (JSON.stringify(specJSON, false, 2));
        };
        btn_saveJSON.onClick = function () {
            var specJSON = getKeysSpec();
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
        btn_settings.onClick = function () {
            Folder(configFolder).execute();
        };
        btn_help.onClick = function () {
            visitURL('https://google.github.io/inspectorspacetime/');
        };
    }
    var isKBarRunning = (typeof kbar !== 'undefined');
    if (isKBarRunning && kbar.button) {
        var button = kbar.button;
        switch (button.argument.toLowerCase()) {
            case 'run':
                buildUI();
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
