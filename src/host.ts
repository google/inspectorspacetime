/**
 * Generates motion spec data to to share with ENG.
 * It's a stupid name with a reference to the short-lived NBC show Commpunity.
 *
 * inSPECtor SPACE+TIME = motion spec
 *
 * Current Version: 2.2 (July, 23 2019
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

    var JSON; JSON || (JSON = {}); (function () { function k(a) { return a < 10 ? "0" + a : a } function o(a) { p.lastIndex = 0; return p.test(a) ? '"' + a.replace(p, function (a) { var c = r[a]; return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + a + '"' } function l(a, j) { var c, d, h, m, g = e, f, b = j[a]; b && typeof b === "object" && typeof b.toJSON === "function" && (b = b.toJSON(a)); typeof i === "function" && (b = i.call(j, a, b)); switch (typeof b) { case "string": return o(b); case "number": return isFinite(b) ? String(b) : "null"; case "boolean": case "null": return String(b); case "object": if (!b) return "null"; e += n; f = []; if (Object.prototype.toString.apply(b) === "[object Array]") { m = b.length; for (c = 0; c < m; c += 1)f[c] = l(c, b) || "null"; h = f.length === 0 ? "[]" : e ? "[\n" + e + f.join(",\n" + e) + "\n" + g + "]" : "[" + f.join(",") + "]"; e = g; return h } if (i && typeof i === "object") { m = i.length; for (c = 0; c < m; c += 1)typeof i[c] === "string" && (d = i[c], (h = l(d, b)) && f.push(o(d) + (e ? ": " : ":") + h)) } else for (d in b) Object.prototype.hasOwnProperty.call(b, d) && (h = l(d, b)) && f.push(o(d) + (e ? ": " : ":") + h); h = f.length === 0 ? "{}" : e ? "{\n" + e + f.join(",\n" + e) + "\n" + g + "}" : "{" + f.join(",") + "}"; e = g; return h } } if (typeof Date.prototype.toJSON !== "function") Date.prototype.toJSON = function () { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + k(this.getUTCMonth() + 1) + "-" + k(this.getUTCDate()) + "T" + k(this.getUTCHours()) + ":" + k(this.getUTCMinutes()) + ":" + k(this.getUTCSeconds()) + "Z" : null }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () { return this.valueOf() }; var q = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, p = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, e, n, r = { "\u0008": "\\b", "\t": "\\t", "\n": "\\n", "\u000c": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, i; if (typeof JSON.stringify !== "function") JSON.stringify = function (a, j, c) { var d; n = e = ""; if (typeof c === "number") for (d = 0; d < c; d += 1)n += " "; else typeof c === "string" && (n = c); if ((i = j) && typeof j !== "function" && (typeof j !== "object" || typeof j.length !== "number")) throw Error("JSON.stringify"); return l("", { "": a }) }; if (typeof JSON.parse !== "function") JSON.parse = function (a, e) { function c(a, d) { var g, f, b = a[d]; if (b && typeof b === "object") for (g in b) Object.prototype.hasOwnProperty.call(b, g) && (f = c(b, g), f !== void 0 ? b[g] = f : delete b[g]); return e.call(a, d, b) } var d, a = String(a); q.lastIndex = 0; q.test(a) && (a = a.replace(q, function (a) { return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4) })); if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return d = eval("(" + a + ")"), typeof e === "function" ? c({ "": d }, "") : d; throw new SyntaxError("JSON.parse"); } })();

    //================ VARIABLES ======================
    var scriptName = 'Inspector Spacetime';
    var scriptVersion = '2.5';
    var thisComp, easeLib = {};

    var exp_counter = 'var sTime = marker.key("Start").time; var eTime = marker.key("End").time; var countTime = Math.max(time - sTime, 0); countTime = Math.min(countTime, eTime - sTime); var counter = Math.round(countTime * 1000); var playIcon = (time > sTime && time < eTime) ? "\u25ba " : "\u25a0 "; playIcon + counter + "ms";';
    let configFolder = Folder.userData.toString() + '/BattleAxe/InspectorSpacetime/config/'

    initConfig()

    // icon string for retina icons
    // var icons = {
    //     build: [
    //         '104 26.478 104.82 32.260 104 38.043 116.39 35.565 115.56 40.521 123 32.260 115.56 24 116.39 28.956',
    //         '93 48 93 57 34 57 34 43 32 43 32 39 34 39 34 38 30 38 30 34 34 34 34 7 36 7 36 34 69 34 69 38 36 38 36 39 80 39 80 43 36 43 36 55 91 55 91 48 63 48 63 44 91 44 91 16 38 16 38 12 91 12 91 9 36 9 36 7 93 7 93 12 96 12 96 16 93 16 93 44 98 44 98 48 93 48',
    //         '45 23 91 23 91 27 45 27',
    //         '65 49 67 51 65 53 63 51',
    //         '76 17 78 19 76 21 74 19',
    //         '40 17 42 19 40 21 38 19',
    //         '85 49 89 49 87.66 51 89 53 85 53 86.33 51',
    //         '69 28 73 28 71.66 30 73 32 69 32 70.33 30',
    //         '50 28 54 28 52.66 30 54 32 50 32 51.33 30',
    //         '160 7 160 56 170 56 170 54 160 54 160 53 174 53 174 51 160 51 160 50 167 50 167 48 168 48 168 50 173 50 173 48 160 48 160 47 166 47 166 45 160 45 160 42 172 42 172 40 160 40 160 39 170 39 170 37 160 37 160 36 167 36 167 34 168 34 168 36 177 36 177 34 160 34 160 33 172 33 172 31 160 31 160 28 170 28 170 26 160 26 160 25 172 25 172 23 160 23 160 22 167 22 167 20 168 20 168 22 175 22 175 20 160 20 160 19 169 19 169 17 160 17 160 14 176 14 176 12 160 12 160 11 173 11 173 9 160 9 160 7 181 7 181 58 157 58 131 58 131 7 157 7 157 9 133 9 133 56 157 56 157 7'
    //     ]
    // };

    // ================ FUNCTIONS =============

    /**
     * Initialize support files 
     */
    function initConfig() {
        easeLib = {
            linear: {
                val: [0.0, 0.0, 1.0, 1.0]
            },
            hold: {
                val: [0.0, 0.0, 0.0, 0.0]
            },
        }
        const easeLibPath = `${configFolder}/ease-library.json`

        if (!Folder(configFolder).exists) {         // config folder does not exist
            Folder(configFolder).create();
        }
        
        if (!Folder(easeLibPath).exists) {          // ease library file does not exist
            writeFile(easeLibPath, JSON.stringify(easeLib, replacer, 2))
        } else {                                    // ease library exists so read it
            let file = File(easeLibPath)
            file.open('r')
            let data = file.read()
            file.close()
            
            if (data != '') {                       // make sure there is something in the file
                easeLib = JSON.parse(data)
            }
        }
    }

    /**
     * Set the current comp to the var thisComp
     * @returns {boolean}           - if there is an available comp
     */
    function setComp() {
        if (app.activeViewer == null) { return false; }
        /// activate the comp window
        app.activeViewer.setActive();
        thisComp = app.project.activeItem;
        /// Make sure a comp is selected
        if (!thisComp || !(thisComp instanceof CompItem)) {
            return false;
        }
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
    function buttonColorText(parentObj: object, accentColor: string, buttonText: string) {
        // draw a regular button, make it pressable with ENTER key
        var btn = parentObj.add('button', undefined, '', { name: 'ok' });
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
    function buttonColorVector(parentObj: object, iconVec: string, iconColor: string, size: number[]) {
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
    function setTimeMarkers(layer: Layer, startTime: number, endTime: number) {
        // new marker object
        var layer_marker1 = new MarkerValue('Start');
        layer_marker1.eventCuePoint = true;
        layer_marker1.setParameters({});

        layer('ADBE Marker').setValueAtTime(startTime, layer_marker1);

        var layer_marker2 = new MarkerValue('End');
        layer_marker2.eventCuePoint = true;
        layer_marker2.setParameters({});

        layer('ADBE Marker').setValueAtTime(endTime, layer_marker2);
    }


    /**
     * convert time to ms
     *
     * @param {number} time - time float value
     * @returns {string}    - rounded time in ms
     */
    function timeToMs(time: number) {
        return Math.round(time * 1000) + 'ms';
    }

    /**
     * Gets first and last key times
     *
     * @return {number[]} - Duration between first and last keys, or the playhead and 1 sec later
     */
    function getKeyRange() {
        let selKeys = getSelKeys()
        if (selKeys.length < 1) {
            return [thisComp.time, thisComp.time + 1]
        } else {
            var firstKeyTime = 9999999;
            var lastKeyTime = 0;
            
            for (const actKey of selKeys) {
                const prop = actKey.prop;
                const keys = actKey.keys;

                for (let key of keys) {
                    let keyTime = prop.keyTime(key)
                    firstKeyTime = Math.min(firstKeyTime, keyTime);
                    lastKeyTime = Math.max(lastKeyTime, keyTime);
                }
            }
            return [firstKeyTime, lastKeyTime];
        }

    }

    /**
     * Gets first and last key times
     *
     * @return {object[]} - Duration between first and last keys
     */
    
    function getSelKeys() {
        try {
            let selKeyList = [];

            let props = thisComp.selectedProperties;

            // for (let i = props.length - 1; i >= 0; i--) {       // loop backward
            for (let i = 0; i < props.length; i++) {       // loop forward
                let prop = props[i];
                if (!prop.canVaryOverTime) {        // skip mask and path groups that are selected by default
                    continue
                }

                let selKeys = prop.selectedKeys;

                if (selKeys.length < 2) {           // skip if no selected keys within the selected property
                    continue
                }
                // if (!selKeys || selKeys.length < 1) continue
                if (selKeys.length % 2 > 0) { selKeys.pop() }

                selKeyList.push({
                    prop: prop,
                    keys: selKeys || null,
                })
            }
            return selKeyList;
        } catch (error) {
            return []
        }
    }

    /**
     * Creates a counter
     *
     * @returns {TextLayer} - Created text layer
     */
    function buildCounter() {
        setComp();
        // get selected keys range
        var keyRange = getKeyRange();
        // if no keys selected use the playhead time and playhead + 1:00

        app.beginUndoGroup('New Counter');

        try {
            // create new text layer
            var dynText = thisComp.layers.addText('Counter');
            // set the layer name
            dynText.name = 'Counter';
            // add a comment
            dynText.comment = scriptName + '_data';

            // new text object
            var dynText_TextProp = dynText('ADBE Text Properties')('ADBE Text Document');

            // initialize dynText_TextDocument with values
            var dynText_TextDocument = dynText_TextProp.value;
            // reset all text values
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

            // apply text properties
            dynText_TextProp.setValue(dynText_TextDocument);

            // apply text string
            dynText_TextProp.setValue('\u25ba');

            // define manualLineHeight
            var manualLineHeight = 10;

            // create a new text animator
            var lineHeight = dynText('ADBE Text Properties')(4).addProperty('ADBE Text Animator');
            // name it line height
            lineHeight.name = 'Line Height';
            // add a Line Spacing element
            lineHeight('ADBE Text Animator Properties').addProperty('ADBE Text Line Spacing');
            // add a selector
            lineHeight(1).addProperty('ADBE Text Selector');
            // set value
            lineHeight(2)('ADBE Text Line Spacing').setValue([0, manualLineHeight]);

            // Transforms
            dynText('ADBE Transform Group')('ADBE Position').setValue([100, 100]);

        } catch (e) { alert(e.toString() + "\nError on line: " + e.line.toString());}

        // set markers
        setTimeMarkers(dynText, keyRange[0], keyRange[1]);
        dynText('ADBE Text Properties')('ADBE Text Document').expression = exp_counter;

        // close twirled layers
        app.executeCommand(2771);
        app.executeCommand(2771);
        app.endUndoGroup();
    }

    /**
     * round input to maximum number if decimal places, or int
     *
     * @param {number} value          - Value to round
     * @param {number} [opt_decimals] - Number of decimals, optional
     * @return {number}               - Rounded value
     */
    function round(value: number, opt_decimals?) {
        try {
            // default to 2 decimal places if nothing is specified
            var decimals = opt_decimals || 2;
            return parseFloat(value.toFixed(decimals));
        } catch (e) {
            return value;
        }
    }

    /**
     * create clickable web links from AE
     *
     * @param {string} url - web url
     */
    function visitURL(url: string) {
        if ($.os.indexOf('Windows') != -1) {
            system.callSystem('cmd /c "' + Folder.commonFiles.parent.fsName + "\\Internet Explorer\\iexplore.exe" + '" ' + url);
        } else {
            var cmd = 'open "' + url + '"';
            system.callSystem(cmd);
        }
    }

    /**
     * JSON replacer filter
     *
     * @param {string} key - Object key
     * @param {any} val    - Object value
     * @return {any}       - Object value
     */
    function replacer(key: string, val: any) {
        if (key === 'obj') {
            return undefined;
        } else {
            return val;
        };
    };

    /**
     * Prompts user to select a file path
     *
     * @param {string} filename - Default filename to prompt
     * @param {string} filter   - File type filter to use, Win only
     * @return {File | null}    - User file object
     */
    function getUserFile(filename: string, filter: string) {
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
    function writeFile(path: File | string, contents: string) {
        var file = path instanceof File ? path : new File(path);

        file.open('w');
        var writeSuccess = file.write(contents);
        file.close();

        if (!writeSuccess) {
            throw new Error('Could not write file ' + file.toString());
        }

        return file;
    }

    interface Spec {
        compName: string;
        spacetimeVersion: string;
        aeVersion: string;
        totalDur: number;
        layers: any
        // layers: [{
        //     name: string;
        //     props: [{
        //         name: string;
        //         value: object;
        //         duration: number;
        //         delay: number;
        //         ease: number[];
        //     }];
        // }]
    }
    interface PropVal {
        name: string;
        start: number[] | number;
        end: number[] | number;
    }
    /**
     * Scans through all selected keyframes to gather spec data
     * 
     * @returns {Spec}            - Selected keyframes as a collection of value, duration, ease, delay values
     */
    function getKeysSpec() {
        try {

            if (!setComp()) { return; }
            let selKeys = getSelKeys()
            let keyRange = getKeyRange()

            if (selKeys.length < 1) {  
                return {
                    compName: 'Select some keyframes',
                    layers: []
                }
            }

            //inital spec object
            let spec: Spec = {
                compName: thisComp.name,
                spacetimeVersion: scriptVersion,
                aeVersion: app.version,
                totalDur: keyRange[1] - keyRange[0],
                layers: [],
            }

            // loop through each prop
            let activeLayer = null
            for (const actKey of selKeys) {
                let prop = actKey.prop;
                let layer = prop.propertyGroup(prop.propertyDepth)
                let keys = actKey.keys;

                // add each unique layer to the .layers array
                if (activeLayer != layer) {
                    activeLayer = layer
                    spec.layers.push({
                        name: layer.name,
                        props: []
                    })
                }
                // add each property to the .props array of its layer
                let propSpec = getPropSpec(actKey)
                spec.layers[spec.layers.length - 1].props.push({
                    name: prop.name,
                    value: propSpec.value,
                    duration: propSpec.duration,
                    ease: propSpec.ease,
                    delay: propSpec.delay,
                })

            }

            return spec

        } catch (e) { alert(e.toString() + "\nError on line: " + e.line.toString()); }
    }

    /**
     * Parses each keyframe pair for spec data
     * 
     * @param actKey                - contains the prop and key indices 
     * @returns {object}            - value change, duration, cubic bezier easing curve, delay from the playhead
     */
    function getPropSpec(actKey: {prop: Property, keys: number[]}) {
        const prop = actKey.prop;
        const keys = actKey.keys;

        const duration = prop.keyTime(keys[1]) - prop.keyTime(keys[0])

        //// value change
        let valChange = {
            name: prop.matchName,
            start: null,
            end: null,
        }
        if (prop.propertyValueType !== PropertyValueType.NO_VALUE) {        // catch if a gradient property
            valChange.start = prop.keyValue(keys[0])
            valChange.end = prop.keyValue(keys[1])
        }
        if (prop.matchName.match(/Shape/)) {        // catch if a shape property - remove this block if you want path info
            valChange.start = null
            valChange.end = null
        }
        let layer = prop.propertyGroup(prop.propertyDepth)
        if (!layer.threeDLayer && valChange?.start?.length > 2) {       // remove the 3rd prop if layer not 3d
            valChange.start.pop()
            valChange.end.pop()
        }

        //// keyframe value change
        let startVal, endVal
        try {
            startVal = actKey.prop.keyValue(actKey.keys[0])
            endVal = actKey.prop.keyValue(actKey.keys[1])
        } catch (e) {
            startVal = 0
            endVal = 1
        }


        // cubic bezier ease conversion
        let x1 = 5, y1 = 5, x2 = 5, y2 = 5
        // keyframes are linear
        if (prop.keyOutInterpolationType(actKey.keys[0]) == KeyframeInterpolationType.LINEAR &&
            prop.keyInInterpolationType(actKey.keys[1]) == KeyframeInterpolationType.LINEAR) {
            x1 = 0, y1 = 0, x2 = 1, y2 = 1
        } else if (prop.keyOutInterpolationType(actKey.keys[0]) == KeyframeInterpolationType.HOLD) {
            x1 = 0, y1 = 0, x2 = 0, y2 = 0
        } else {
            let change

            if (startVal.length > 1) {
                if (prop.matchName.split('Size').length > 1 || prop.matchName.split('Scale').length > 1) {
                    change = endVal[0] - startVal[0]
                    // change = (endVal[0] + endVal[1])/2 - (startVal[0] + startVal[1])/2
                    // change = Math.max(endVal[0], endVal[1]) - Math.max(startVal[0], startVal[1])
                } else {
                    change = Math.sqrt(Math.pow(endVal[0] - startVal[0], 2) + Math.pow(endVal[1] - startVal[1], 2))
                }
            } else {
                if (isNaN(endVal)) {        // catch for non-number values
                    change = 1
                } else {
                    change = endVal - startVal
                }
            }

            let startOutEase = prop.keyOutTemporalEase(actKey.keys[0])[0]
            let endInEase = prop.keyInTemporalEase(actKey.keys[1])[0]
            let keyOutSpeed = startOutEase.speed
            let keyInSpeed = endInEase.speed

            x1 = startOutEase.influence / 100
            y1 = (keyOutSpeed * x1) * (duration / (change || 0.0000000001))
            x2 = 1 - endInEase.influence / 100
            y2 = 1 + (keyInSpeed * (x2 - 1)) * (duration / (change || 0.0000000001))

            // check if either of the keys is linear and overwrite
            if (prop.keyOutInterpolationType(actKey.keys[0]) == KeyframeInterpolationType.LINEAR) {
                x1 = 0.17, y1 = 0.17
            } else if (prop.keyInInterpolationType(actKey.keys[1]) == KeyframeInterpolationType.LINEAR) {
                x2 = 0.83, y2 = 0.83
            }
        }

        return {
            value: valChange,
            duration,
            ease: [x1, y1, x2, y2],
            delay: prop.keyTime(keys[0]) - thisComp.time,
        }
    }

    /**
     * Convert the spec object into readable text
     * 
     * @param specObj               - spec object hierarchy
     * @returns {string}            - multi-line text of the spec data
     */
    function parseSpecText(specObj: Spec, markdown?: boolean) {
        try {
            let lineBreak = (markdown) ? '\n\n' : '\n'
            let h1 = (markdown) ? '# ' : ''
            let h2 = (markdown) ? '## ' : '\n'
            let propLine = (markdown) ? '\n    ' : '\n  '
            
            let str = ''
    
            str = `${h1}${specObj.compName}${lineBreak}`
            str += (specObj.totalDur) ? `Total duration: ${timeToMs(specObj.totalDur)}` : ''
    
            for (let layer of specObj.layers) {
                str += `${lineBreak}${h2}${layer.name}`
    
                for (let prop of layer.props) {
                    let val = getVal(prop.value)
                    str += `${lineBreak}- ${ prop.name }`                                                   // name
                    if (val != ' ') { str += `: ${val}` }                                                // value change
                    str += `${propLine}Duration: ${ timeToMs(prop.duration) }`                         // duration
                    str += `${propLine}${ getCubic(prop.ease) }`                                       // ease
                    if (prop.delay != 0) { str += `${propLine}Delay: ${timeToMs(prop.delay)}` }      // delay
                    // str += (markdown) ? '' : `\n`
                }
                // str += (markdown) ? '' : `\n`
                // str += `${lineBreak}`
            }
    
            return str
        } catch (e) { alert(e.toString() + "\nError on line: " + e.line.toString());}
    }

    /**
     * Convert the prop object to readable text based on the prop type
     * 
     * @param valObj        - 
     * @returns {string}    - 
     */
    function getVal(valObj: PropVal) {
        let str = ''

        if (valObj.name.match(/Opacity/) != null) {
            str = `${round(valObj.start)} → ${round(valObj.end)}%`
        } else if (valObj.name.match(/Scale/) != null) {
            str = `${round(valObj.start[0])} → ${round(valObj.end[0])}%`
        } else if (valObj.name.match(/Position_0|Position_1|Position_2/) != null) {
            str = `${round(valObj.start)} → ${round(valObj.end)}px`
        } else if (valObj.name.match(/Rotate/) != null) {
            str = `${round(valObj.start)} → ${round(valObj.end)}º`
        } else if (valObj.name.match(/Color|Shape/) != null) {
            str = ` `
        } else {
            str = null
        }

        if (!str) {
            str = ''
            for (const i in valObj.start) {
                // if (Object.prototype.hasOwnProperty.call(valObj, start)) {
                if (!isNaN(i)) {
                    str += `${round(valObj.start[i])} → ${round(valObj.end[i])} | `
                }
                
            }
            str = str.slice(0, -3)      // remove the last ` :: `
        }

        return str
    }

    /**
     * Convert the cubic bezier array to readable text 
     * 
     * @param arr           - cubic bezier in array format
     * @returns {string}    - cubic bezier in format (0.00, 0.40, 0.20, 1.00)
     */
    function getCubic(arr: number[]) {
        let val = ''
        let tokenMatch = null

        // loop through all tokens in the easing library
        for (const key in easeLib) {
            if (Object.hasOwnProperty.call(easeLib, key)) {
                const cubicBez = easeLib[key].val;

                const tollerance = 0.01

                let match = true
                for (let i = 0; i < cubicBez.length; i++) {
                    if (Math.abs(cubicBez[i] - arr[i]) > tollerance) {
                        match = false
                    }
                }
                if (match) {

                    tokenMatch = {
                        name: capitalizeFirstLetter(key),
                        cubic: cubicBez
                    }
                }
            }
        }

        if (tokenMatch) {
            val = `${tokenMatch.name}`
        } else {
            val = `(${arr[0].toFixed(2)}, ${arr[1].toFixed(2)}, ${arr[2].toFixed(2)}, ${arr[3].toFixed(2)})`
        }

        return val
    }

    /**
     * 
     * @param str           - String to capitalize
     * @returns {string}    - Capitalized string
     */
    function capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function buildUI() {
        let specJSON = getKeysSpec()        
        /*
        Code for Import https://scriptui.joonas.me — (Triple click to select):
        {"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":"myPanel","windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":true},"text":"Dialog","preferredSize":[240,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["fill","top"]}},"item-1":{"id":1,"type":"Button","parentId":0,"style":{"enabled":true,"varName":"btn_getSpec","text":"Get specs from selected keys","justify":"center","preferredSize":[0,0],"alignment":"fill","helpTip":""}},"item-4":{"id":4,"type":"EditText","parentId":24,"style":{"enabled":true,"varName":"txt_jsonField","creationProps":{"noecho":false,"readonly":false,"multiline":true,"scrollable":true,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"","justify":"left","preferredSize":[0,200],"alignment":"fill","helpTip":"Event marker name"}},"item-22":{"id":22,"type":"TabbedPanel","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"alignment":"fill","selection":23}},"item-23":{"id":23,"type":"Tab","parentId":22,"style":{"enabled":true,"varName":null,"text":"Text","orientation":"column","spacing":10,"alignChildren":["left","top"]}},"item-24":{"id":24,"type":"Tab","parentId":22,"style":{"enabled":true,"varName":null,"text":"JSON","orientation":"column","spacing":10,"alignChildren":["left","top"]}},"item-25":{"id":25,"type":"EditText","parentId":23,"style":{"enabled":true,"varName":"txt_textField","creationProps":{"noecho":false,"readonly":false,"multiline":true,"scrollable":true,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"","justify":"left","preferredSize":[0,235],"alignment":"fill","helpTip":"Event marker name"}},"item-26":{"id":26,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":"fill"}},"item-27":{"id":27,"type":"Button","parentId":26,"style":{"enabled":true,"varName":"btn_settings","text":"✱","justify":"right","preferredSize":[40,0],"alignment":null,"helpTip":"Settings"}},"item-28":{"id":28,"type":"Button","parentId":24,"style":{"enabled":true,"varName":"btn_saveJSON","text":"Save to .JSON","justify":"center","preferredSize":[0,0],"alignment":"fill","helpTip":null}},"item-29":{"id":29,"type":"Button","parentId":26,"style":{"enabled":true,"varName":"btn_newCounter","text":"New counter","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":"Create a time counter layer"}}},"order":[0,1,22,23,25,24,4,28,26,29,27],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"None"},"activeId":26}
        */
        var myPanel = (thisObj instanceof Panel) ? thisObj : new Window('palette', scriptName, undefined, { resizeable: true });

        //stop if there's no window
        if (myPanel === null) return;

        myPanel.orientation = "column";
        myPanel.alignChildren = ["left", "top"];
        myPanel.preferredSize.width = 300;
        myPanel.spacing = 4;
        myPanel.margins = 12;



        var btn_getSpec = myPanel.add("button", undefined, undefined, { name: "btn_getSpec" });
        btn_getSpec.text = "Get specs from selected keys";
        btn_getSpec.alignment = ["fill", "top"];

        // TPANEL1
        // =======
        var tpanel1 = myPanel.add("tabbedpanel", undefined, undefined, { name: "tpanel1" });
        tpanel1.alignChildren = "fill";
        // tpanel1.preferredSize.width = 208;
        tpanel1.margins = 0;
        tpanel1.alignment = ["fill", "fill"];

        // TAB1
        // ====
        var tab1 = tpanel1.add("tab", undefined, undefined, { name: "tab1" });
        tab1.text = "Text";
        tab1.orientation = "column";
        tab1.alignChildren = ["fill", "fill"];
        tab1.spacing = 10;
        tab1.margins = 0;

        var txt_textField = tab1.add('edittext {properties: {name: "txt_textField", multiline: true, scrollable: true}}');
        txt_textField.helpTip = "Event marker name";
        // txt_textField.preferredSize.height = 235;
        txt_textField.alignment = ["fill", "fill"];
        txt_textField.text = parseSpecText(specJSON)

        // TAB2
        // ====
        var tab2 = tpanel1.add("tab", undefined, undefined, { name: "tab2" });
        tab2.text = "MD";
        tab2.orientation = "column";
        tab2.alignChildren = ["left", "top"];
        tab2.spacing = 10;
        tab2.margins = 0;

        var txt_mdField = tab2.add('edittext {properties: {name: "txt_mdField", multiline: true, scrollable: true}}');
        txt_mdField.helpTip = "Event marker name";
        // txt_mdField.preferredSize.height = 235;
        txt_mdField.alignment = ["fill", "fill"];
        txt_mdField.text = parseSpecText(specJSON, true)
        
        // TAB3
        // ====
        var tab3 = tpanel1.add("tab", undefined, undefined, { name: "tab3" });
        tab3.text = "JSON";
        tab3.orientation = "column";
        tab3.alignChildren = ["left", "top"];
        tab3.spacing = 10;
        tab3.margins = 0;

        // TPANEL1
        // =======
        tpanel1.selection = tab1;

        var txt_jsonField = tab3.add('edittext {properties: {name: "txt_jsonField", multiline: true, scrollable: true}}');
        txt_jsonField.helpTip = "Event marker name";
        // txt_jsonField.preferredSize.height = 200;
        txt_jsonField.alignment = ["fill", "fill"];
        txt_jsonField.text = (JSON.stringify(specJSON, false, 2))

        var btn_saveJSON = tab3.add("button", undefined, undefined, { name: "btn_saveJSON" });
        btn_saveJSON.text = "Save to .JSON";
        btn_saveJSON.alignment = ["fill", "bottom"];

        // GROUP1
        // ======
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



        myPanel.onResizing = myPanel.onResize = function () {
            myPanel.layout.resize();
        };

        if (myPanel instanceof Window) {
            myPanel.center();
            myPanel.show();
        } else {
            myPanel.layout.layout(true);
            myPanel.layout.resize();
        }

        /**************************************************************************
         * Button functionality ***************************************************
         **************************************************************************/

        btn_getSpec.onClick = function () {
            let specJSON = getKeysSpec()
            txt_textField.text = parseSpecText(specJSON)
            txt_mdField.text = parseSpecText(specJSON, true)
            txt_jsonField.text = (JSON.stringify(specJSON, false, 2))
        }
        btn_saveJSON.onClick = function () {
            var specJSON = getKeysSpec()
                // specJSON.spacetimeVersion = scriptVersion;
                // specJSON.aeVersion = app.version;

            var outputFile = getUserFile('spec.spacetime.json', 'spacetime:*.spacetime.json;');

            if (!outputFile) {
                return;
            }

            try {
                var writtenFile = writeFile(outputFile, JSON.stringify(specJSON, replacer, 2));
                writtenFile.parent.execute()
            } catch (e) {
                alert(e, scriptName);
            }
        }
        btn_newCounter.onClick = function () {
            buildCounter();
        }
        btn_settings.onClick = function () {
            Folder(configFolder).execute()
        }
    }

    var isKBarRunning = (typeof kbar !== 'undefined');

    if (isKBarRunning && kbar.button) {
        var button = kbar.button;  // Make a local copy of the kbar variable and button.

        switch (button.argument.toLowerCase()) {
            case 'run':
                // run the modal
                // alert('butt')
                buildUI()
                break;

            default:
                buildUI()
                break;
        }
    }
    else {
        buildUI()
    }

})(this);
