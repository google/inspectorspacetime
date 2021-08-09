/*
 * AEQuery scripting library
 * General purpose after effects scripting library.
*/

var aeq = (function() {

/* jslint browser: true */

/**
 * @namespace aeq
 */

/**
 * Gets objects by looking at a string and finding objects in After
 * Effects matching the description. The context is used to
 * determine a starting point for where the function starts looking
 * for elements.
 * If an `Array`, `CompItem`, `Layer`, or `Property` is given, the object will be
 * converted to the corresponding aequery object: `aeq.ArrayEx`, `aeq.Comp`,
 * `aeq.Layer`, `aeq.Property`.
 * @namespace aeq
 * @variation 1
 * @method
 * @param  {aeq.SelectorString|Array|CompItem|Layer|Property} selector A string containing
 *         a selector expression, or an object to be converted to aeq type object.
 * @param  {CompItem|FolderItem|Layer|PropertyGroup|Array} [context] The object
 *         to start looking from
 * @return {ArrayEx|aeq.Comp|aeq.Layer|aeq.Property} The found After Effects
 *         objects, or the converted AEQuery object
 */
var aeq = function ( selector, context ) {
	

	if ( aeq.isNullOrUndefined( selector ) ) {
		return selector;
	}

	var result;

	if ( aeq.isAeq( selector ) ) {
		result = selector;
	} else if ( aeq.isString( selector ) ) {
		result = aeq.select( selector, context );
	} else if ( aeq.isArray( selector ) ) {
		result = aeq.arrayEx( selector );
	} else if ( aeq.isApp( selector ) ) {
		result = aeq.app;
	} else if ( aeq.isComp( selector ) ) {
		result = new aeq.Comp( selector );
	} else if ( aeq.isLayer( selector ) ) {
		result = new aeq.Layer( selector );
	} else if ( aeq.isProperty( selector ) ) {
		result = new aeq.Property( selector );
	}

	result.aeq = true;

	return result;
};

aeq.version = '0.6.0';

aeq.thisObj = this;


/* eslint-env commonjs */
if ( typeof module === 'object' ) {
	module.exports = aeq;
}

/**
 * Used for setting the default value in functions. Returns the first argument
 * is not undefined, else it returns `defaultVal`.
 *
 * @method
 * @param  {Any} value      The value to check
 * @param  {Any} defaultVal The value to use if `value` is `undefined`
 * @return {Any}            `value` if it is not `undefined`, else `defaultVal`
 *
 * @example
 * function say( greeting ) {
 *     a = aeq.setDefault( greeting, 'Hello World!' )
 *     alert( a )
 * }
 */
aeq.setDefault = function ( value, defaultVal ) {
	return typeof value == 'undefined' ? defaultVal : value;
};

var setDefault = aeq.setDefault;

// Copy of jQuery.extend
/**
 * Merge the contents of two or more objects together into the first object.
 *
 * If only one object is given, the `aeq` object is assumed to be the target.
 *
 * @memberof aeq
 * @method
 * @return {Object} The merged object
 * @see [jQuery.extend]{@link https://api.jquery.com/jquery.extend/} for more
 *      information, this function uses the same api.
 * @example
 * var objectA = {
 *     test: "example"
 * };
 *
 * aeq.extend( objectA, {
 *     prop: "prop"
 * });
 *
 * // ObjectA is now
 * {
 *     test: "example",
 *     prop: "prop"
 * }
 */
aeq.extend = function () {
	var options, name, src, copy, copyIsArray, clone,
		target = setDefault( arguments[0], {}),
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === 'boolean' ) {
		deep = target;

		// Skip the boolean and the target
		target = setDefault( arguments[i], {});
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== 'object' && !aeq.isFunction( target ) ) {
		target = {};
	}

	// Extend aeq itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( ( options = arguments[i] ) !== null ) {
			// Extend the base object
			for ( name in options ) {
				// Skip modified prototype props
				if ( !options.hasOwnProperty( name ) ) {
					continue;
				}

				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( aeq.isPlainObject( copy ) ||
					( copyIsArray = aeq.isArray( copy ) ) ) ) {
					// eslint-disable-next-line
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && aeq.isArray( src ) ? src : [];
					} else {
						clone = src && aeq.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = aeq.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

/**
 * Is executed for each element in an array
 * @callback forEachArrayCallback
 * @param {Any}     element The current element in the array
 * @param {Integer} index   The index of the current element in the array
 * @param {Array}   array   The array being looped through
 */

/**
  * Is executed for key-value pair in an object
  * @callback forEachObjectCallback
  * @param {Any}     element The current key in the object
  * @param {Integer} index   The value of the current key
  * @param {Array}   array   The object being looped through
  */

/**
 * Loops through arrays and objects
 * @memberof aeq
 * @function
 * @param  {Array|Object} obj       The array or object to loop through.
 * @param  {forEachArrayCallback|forEachObjectCallback} callback
 *         Function to execute for each element in the object or array
 * @param  {Number} [fromIndex]     Index to start iterating from
 * @return {Array|Object}           The value of `obj`
 */
aeq.forEach = function ( obj, callback, fromIndex ) {
	var length, i;
	if ( obj && Object.prototype.toString.call( obj ) === '[object Array]' ) {
		length = obj.length;
		i = fromIndex === undefined ? 0 : fromIndex;
		for ( ; i < length; i++ ) {
			if ( callback( obj[i], i, obj ) === false ) {
				break;
			}
		}
	} else {
		for ( i in obj ) {
			if ( obj.hasOwnProperty( i ) ) {
				if ( callback( i, obj[i], obj ) === false ) {
					break;
				}
			}
		}
	}
	return obj;
};

/**
 * Loops through arrays and objects and returns a filtered array
 * @memberof aeq
 * @function
 * @param  {Array|Object}   obj       The Array/object to loop through
 * @param  {forEachArrayCallback|forEachObjectCallback} callback  The function
 *         to execute for each element in the object. Should return a truthy
 *         value if the element should be included in the returned array.
 * @return {Array} The filtered array
 */
aeq.filter = function ( obj, callback ) {
	var filteredArr = [],
		length, i;
	if ( obj && Object.prototype.toString.call( obj ) === '[object Array]' ) {
		length = obj.length;
		i = 0;
		for ( ; i < length; i++ ) {
			if ( callback( obj[i], i, obj ) ) {
				filteredArr.push( obj[i] );
			}
		}
	} else {
		for ( i in obj ) {
			if ( obj.hasOwnProperty( i ) ) {
				if ( callback( i, obj[i], obj ) ) {
					filteredArr.push( obj[i] );
				}
			}
		}
	}
	return filteredArr;
};

aeq = ( function ( aeq ) {
aeq.extend({

	/**
	 * Checks if value is null. Throws an error if it is not.
	 * @method
	 * @memberof aeq
	 * @param  {Any} o   The value to check against null.
	 * @param  {String} err The error message to throw
	 * @return {Boolean} `true` if no error was thrown
	 */
	assertIsNull: function ( o, err ) {
		if ( aeq.isNullOrUndefined( o ) ) {
			return true;
		}

		throw new Error( err );
	},

	/**
	 * Checks if value is null. Throws an error if it is.
	 * @method
	 * @memberof aeq
	 * @param  {Any} o   The value to check against null.
	 * @param  {String} err The error message to throw
	 * @return {Boolean} `true` if no error was thrown
	 */
	assertIsNotNull: function ( o, err ) {
		if ( !aeq.isNullOrUndefined( o ) ) {
			return true;
		}

		throw new Error( err );
	},

	/**
	 * Checks if value is `true`. Throws an error if it is not.
	 * @method
	 * @memberof aeq
	 * @param  {Any} o   The value to check against `true`.
	 * @param  {String} err The error message to throw
	 * @return {Boolean} `true` if no error was thrown
	 */
	assertIsTrue: function ( o, err ) {
		if ( o === true ) {
			return true;
		}

		throw new Error( err );
	},

	/**
	 * Checks if value is `false`. Throws an error if it is not.
	 * @method
	 * @memberof aeq
	 * @param  {Any} o   The value to check against `false`.
	 * @param  {String} err The error message to throw
	 * @return {Boolean} `true` if no error was thrown
	 */
	assertIsFalse: function ( o, err ) {
		if ( o === false ) {
			return true;
		}

		throw new Error( err );
	},

	/**
	 * Checks if array is empty. Throws an error if it is not.
	 * @method
	 * @memberof aeq
	 * @param  {Array} o   The array to check is empty.
	 * @param  {String} err The error message to throw
	 * @return {Boolean} `true` if no error was thrown
	 */
	assertIsEmpty: function ( o, err ) {
		if ( aeq.isEmpty( o ) ) {
			return true;
		}

		throw new Error( err );
	},

	/**
	 * Checks if array is empty. Throws an error if it is.
	 * @method
	 * @memberof aeq
	 * @param  {Array} o   The array to check is empty.
	 * @param  {String} err The error message to throw
	 * @return {Boolean} `true` if no error was thrown
	 */
	assertIsNotEmpty: function ( o, err ) {
		if ( !aeq.isEmpty( o ) ) {
			return true;
		}

		throw new Error( err );
	}
});

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
 * Sets or gets an attribute value for all objects in an array. When getting a
 * value, it only returns the valure from the first object.
 * @memberof aeq
 * @see aeq.arrayEx.attr
 * @method
 * @param  {Any[]}  array         The array of objects to get or set attribute
 *                                values of.
 * @param  {string} attributeName The name of the attribute to get or set.
 * @param  {Any}    [newValue]    The value to set. If not given, will only get
 *                                the value of the first object.
 * @return {Any|undefined}        When getting, the value of the attribute.
 *                                When setting, `undefined`.
 */
aeq.attr = function ( array, attributeName, newValue ) {
	var i, il;

	// Throw error if only array is given
	if ( arguments.length === 1 ) {
		throw new Error( 'Only one argument given to attr, must be 2 or 3' );

	// Get value of attributeName for first object in the array if only attributeName is given
	} else if ( arguments.length === 2 ) {
		if ( array[0] !== undefined && array[0] !== null ) {
			return getAttr( array[0], attributeName );
		}
		return undefined;

	// Set value of attributeName for all objects in array if newValue is given
	} else {
		for ( i = 0, il = array.length; i < il; i++ ) {
			setAttr( array[i], attributeName, newValue );
		}
		return array;
	}
};

function getAttr( object, attributeName ) {
	if ( object[attributeName] instanceof Function ) {
		return object[attributeName]();
	}
	return object[attributeName];
}

var attr = {
	setters: {
		'[object Property]': {
			value: 'setValue'
		}
	}
};

function setAttr( object, attributeName, newValue ) {
	var attrSetters, setter;

	// Check if there is a special setter for this object and attributeName
	attrSetters = attr.setters[object.toString()];
	if ( attrSetters !== undefined ) {
		setter = attrSetters[attributeName];
		if ( setter !== undefined ) {
			attributeName = setter;
		}
	}

	if ( object[attributeName] instanceof Function ) {
		object[attributeName]( newValue );
	} else {
		object[attributeName] = newValue;
	}
	return object;
}

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
aeq.extend({

	/**
	 * Gets all the item in a folder or project.
	 * @method
	 * @memberof aeq
	 * @param  {FolderItem} [folder=app.project] The Folder to get items from.
	 * @param  {boolean} [deep=true]             When `true`, gets items from
	 *                                           subfolders as well.
	 * @return {aeq.arrayEx}                     Array of Item objects
	 */
	getItems: function ( folder, deep ) {
		// If no arguments are given, just return all items in project.
		if ( folder === undefined ) {
			return aeq.normalizeCollection( app.project.items );
		}

		deep = setDefault( deep, true );
		folder = aeq.project.getFolder( folder );
		if ( folder === null ) {
			return aeq.arrayEx();
		}

		if ( deep ) {
			return aeq.getItemsDeep( folder );
		}

		return aeq.normalizeCollection( folder.items );
	},

	/**
	 * Returns an {@link aeq.arrayEx} with all items in a folder, and items in
	 * subfolders.
	 * @method
	 * @param  {FolderItem} folder     The folder to flatten.
	 * @param  {Boolean} returnArrayEx Included so we can skip the converting to
	 *                                 arrayEx when recursing. It is not meant to
	 *                                 be used outside of this function.
	 * @return {aeq.arrayEx}           ArrayEx with Item objects.
	 */
	getItemsDeep: function ( folder, returnArrayEx ) {
		var item,
			items = [],
			len = folder.items.length;

		for ( var i = 1; i <= len; i++ ) {
			item = folder.items[i];
			if ( aeq.isFolderItem( item ) ) {
				// Add all items in subfolder to the `items` array.
				items.push.apply( items, aeq.getItemsDeep( item, false ) );
			}
			items.push( item );
		}

		// Skip converting to arrayEx when function is called by it self.
		if ( returnArrayEx === false ) {
			return items;
		}
		return aeq.arrayEx( items );
	},

	/**
	 * Gets the all layers where the given Item object is used as a source.
	 * @method
	 * @memberof aeq
	 * @param  {Item} item    The item to find in comps
	 * @return {aeq.arrayEx}  Array of Layer objects
	 */
	getItemInComps: function ( item ) {
		var layers = [];
		aeq.forEach( item.usedIn, function ( comp ) {
			aeq.forEachLayer( comp, function ( layer ) {
				if ( layer.source === item ) {
					layers.push( layer );
				}
			});
		});
		return aeq.arrayEx( layers );
	},

	/**
	 * Gets all the CompItems in the project. Or all CompItems in the given folder.
	 * @method
	 * @memberof aeq
	 * @param {FolderItem} [folder=app.project] The folder to get comps from.
	 * @param {boolean} [deep=true]             Go through subfolders looking for comps.
	 * @return {aeq.arrayEx} Array of CompItems
	 */
	getCompositions: function ( folder, deep ) {
		var items = aeq.getItems( folder, deep );
		return items.filter( aeq.isComp );
	},

	/**
	 * Gets the active CompItem.
	 * This gets `app.project.activeItem` and verifies that it is a comp. If it
	 * not, it returns null.
	 * @method
	 * @memberof aeq
	 * @return {CompItem|null} The active comp, or null if there is none.
	 */
	getActiveComposition: function () {
		var activeItem = app.project.activeItem;
		if ( aeq.isComp( activeItem ) ) {
			return activeItem;
		}
		return null;
	},

	/**
	 * Gets the CompItem with the matching name, or `null` if none is found.
	 * @method
	 * @memberof aeq
	 * @param  {string} name      The name of the comp to found
	 * @return {CompItem|null}    The comp with the matching name, or null if
	 *                            none is found
	 */
	getComposition: function ( name ) {
		var length = app.project.items.length;

		for ( var i = 1; i <= length; i++ ) {
			var item = app.project.item( i );
			if ( item.name === name && aeq.isComp( item ) ) {
				return item;
			}
		}

		// If the function have not returned by now, there is no comp with that name
		return null;
	},

	/**
	 * Gets all layers layers in a comp or an array of comps. This differs from
	 * `comp.layers` in that this returns an actual array. Instead of a colletion
	 * with a start index of 1.
	 * @method
	 * @memberof aeq
	 * @param  {CompItem[]|CompItem} comps CompItem(s) to get layers from.
	 * @return {aeq.arrayEx}         Layer objects in the comp(s)
	 */
	getLayers: function ( comps ) {
		aeq.assertIsNotNull( comps, 'comps is null' );

		var arr = [];

		if ( aeq.isComp( comps ) ) {
			comps = [ comps ];
		}

		for ( var c = 0; c < comps.length; c++ ) {
			var comp = comps[c];
			arr = arr.concat( aeq.normalizeCollection( comp.layers ) );
		}

		return aeq.arrayEx( arr );
	},

	/**
	 * Gets selected layers from a given comp or from the active comp if no comp is given.
	 * If there is no active comp, an empty array is returned.
	 * @method
	 * @memberof aeq
	 * @param  {CompItem} [comp] The comp to get selected layers from.
	 * @return {aeq.arrayEx}     Array of Layer objects.
	 */
	getSelectedLayers: function ( comp ) {
		if ( !aeq.isComp( comp ) ) {
			comp = aeq.getActiveComp();
		}
		if ( comp ) {
			return aeq.arrayEx( comp.selectedLayers );
		}
		return aeq.arrayEx();
	},

	/**
	* Gets selected layers, or all layers if none is selected, from a given comp
	* or from the active comp if no comp is given. If there is no active comp,
	* an empty array is returned.
	 * @method
	 * @memberof aeq
	 * @param  {CompItem} [comp] Comp to get layers from
	 * @return {aeq.arrayEx}     Array of Layer objects
	 */
	getSelectedLayersOrAll: function ( comp ) {
		if ( !aeq.isComp( comp ) ) {
			comp = aeq.getActiveComp();
			if ( comp === null ) {
				return aeq.arrayEx();
			}
		}

		var layers = aeq.getSelectedLayers( comp );

		if ( layers.length === 0 ) {
			return aeq.getLayers( comp );
		}

		return layers;
	},

	/**
	 * Gets the selected properties on a layer or in a comp. Uses the active comp
	 * if no argument is given. If there is no active comp, an empty array is
	 * returned.
	 * @method
	 * @memberof aeq
	 * @param  {CompItem|Layer} [obj] The object to get selected properties from.
	 *         Defaults to the active comp.
	 * @return {aeq.arrayEx}          Array of Property objects
	 */
	getSelectedProperties: function ( obj ) {
		if ( !obj ) {
			obj = aeq.getActiveComp();
		}
		if ( obj ) {
			return aeq.arrayEx( obj.selectedProperties );
		}
		return aeq.arrayEx();
	},

	/**
	 * Gets all Property objects of all Layer objects in an array.
	 * @method
	 * @memberof aeq
	 * @param  {Layer[]} layers   Layer Objects to get properties from.
	 * @param  {Object} [options] Options for the function.
	 * @param  {boolean} [options.separate=true] set to true to separate properties
	 * (e.g separates Position into xPosition and yPosition).
	 * @param  {boolean} [options.groups=false] set to true to include property groups.
	 * @param  {boolean} [options.props=true] set to true to include properties.
	 * @return {aeq.arrayEx} Array of Property objects
	 */
	getProperties: function ( layers, options ) {
		aeq.assertIsNotNull( layers, 'layer is null' );

		options = setDefault( options, { separate: true });

		var arr = [];

		for ( var l = 0; l < layers.length; l++ ) {
			var layer = layers[l];
			arr = arr.concat( aeq.getPropertyChildren( layer, options ) );
		}

		return aeq.arrayEx( arr );
	},

	/**
	 * Gets all children of the given layer or propertyGroup. This is a recursive
	 * function, so it also gets grandchildren an so on.
	 * @method
	 * @memberof aeq
	 * @param  {Layer|PropertyGroup} propertyParent Object to get properties from
	 * @param  {Object} [options] Options for the function.
	 * @param  {boolean} [options.separate=true] set to true to separate properties
	 * (e.g separates Position into xPosition and yPosition).
	 * @param  {boolean} [options.groups=false] set to true to include property groups.
	 * @param  {boolean} [options.props=true] set to true to include properties.
	 * @return {Array}            Array of Property objects
	 */
	getPropertyChildren: function ( propertyParent, options ) {
		var arr = [];
		var property;
		var len = propertyParent.numProperties;
		options = setDefault( options, { separate: false });

		for ( var i = 1; i <= len; i++ ) {
			property = propertyParent.property( i );

			switch ( property.propertyType ) {
			case PropertyType.PROPERTY:
				if ( options.separate ) {
					property = normalizeProperty( propertyParent, property );
				}
				if ( options.props !== false ) { // On by defualt
					arr.push( property );
				}
				break;

			case PropertyType.INDEXED_GROUP:
			case PropertyType.NAMED_GROUP:
				if ( options.groups === true ) { // Off by default
					arr.push( property );
				}
				arr = arr.concat( aeq.getPropertyChildren( property, options ) );
				break;

			default:
				break;
			}
		}

		return arr;
	},

	/**
	 * Gets the propertyGroups inside the effects group from all layers given.
	 * @method
	 * @memberof aeq
	 * @param  {Layer[]|Layer} layers The Layer(s) to get effects from.
	 * @return {aeq.arrayEx}     Array of PropertyGroup objects
	 */
	getEffects: function ( layers ) {
		aeq.assertIsNotNull( layers, 'layers is null' );

		if ( aeq.isLayer( layers ) ) {
			layers = [ layers ];
		}

		var arr = [];
		var len = layers.length;
		var effects, effectslen;

		for ( var l = 0; l < len; l++ ) {
			effects = layers[l].property( 'ADBE Effect Parade' );
			if ( effects === null ) {
				continue;
			}

			effectslen = effects.numProperties;
			for ( var e = 1; e <= effectslen; e++ ) {
				arr.push( effects.property( e ) );
			}
		}
		return aeq.arrayEx( arr );
	},

	/**
	 * Gets the Marker property group from the given layer or comp. If no object
	 * is given, the active comp is used. If there is no active comp, `null` is
	 * returned.
	 * Note: Marker groups for comps is only available for After Effects version
	 * 14.0 and later. If a comp is used in a earlier version. This function will
	 * return `null`
	 * @method
	 * @memberof aeq
	 * @param  {Layer|CompItem} [obj]     The object to get the marker group from.
	 * @return {MarkerPropertyGroup|null} Object marker group, or null if n/a
	 */
	getMarkerGroup: function ( obj ) {
		if ( !obj ) {
			obj = aeq.getActiveComp();
		}

		if ( aeq.isLayer( obj ) ) {
			return obj.property( 'ADBE Marker' );
		}

		if ( aeq.isComp( obj ) && aeq.app.version >= 14.0 ) {
			return obj.markerProperty;
		}

		return null;
	},

	/**
	 * Gets all keys on the given property or array of properties. Returns an
	 * aeq.Keys object which can be used to see all attributes of the key.
	 * @method
	 * @memberof aeq
	 * @param  {Property|Property[]} property The Property or Properties to get
	 *                               keys from.
	 * @return {aeq.arrayEx}         Array of aeq.Key objects.
	 */
	getKeys: function ( property ) {
		var arr = [],
			i, len;

		if ( aeq.isArray( property ) ) {
			for ( i = 0, len = property.length; i < len; i++ ) {
				arr = arr.concat( aeq.getKeys( property[i] ) );
			}
			return aeq.arrayEx( arr );
		}

		for ( i = 1, len = property.numKeys; i <= len; i++ ) {
			arr.push( aeq.Key( property, i ) );
		}

		return aeq.arrayEx( arr );
	},

	getChildren: function ( obj ) {
		var ret;
		if ( aeq.isComp( obj ) ) {
			return aeq.normalizeCollection( obj.layers );
		}
		if ( aeq.isLayer( obj ) || aeq.isPropertyGroup( obj ) ) {
			return aeq.getPropertyChildren( obj, {});
		}
		if ( aeq.isArray( obj ) ) {
			ret = aeq.arrayEx();
			aeq.forEach( obj, function ( item ) {
				ret.push.apply( ret, aeq.getChildren( item ) );
			});
			return ret;
		}
	},

	/**
	 * Collection arrays have indexes in the range `1-Collection.length`, which is
	 * usually not ideal when programming. This function takes a Collection object
	 * and converts it to a normal array.
	 * @method
	 * @memberof aeq
	 * @param  {Collection} collection The Collection to convert
	 * @return {aeq.arrayEx}           Normalized collection
	 */
	normalizeCollection: function ( collection ) {
		// Because collection objects have a range [1...length], which is not ideal.
		// This returns an array with all objects in the collection.
		var ret = Array.prototype.slice.call( collection, 1 );
		var len = collection.length;

		// Because the last object is at index Collection.length and slice only goes up to
		// length - 1, we have to push the last object to the return value
		if ( len !== 0 ) {
			ret.push( collection[len] );
		}
		return aeq.arrayEx( ret );
	},

	/**
	 * Converts frame count to time.
	 * @method
	 * @memberof aeq
	 * @param  {number} frames    Frame count to convert
	 * @param  {number} frameRate FPS to convert with
	 * @return {number}           Frame count in time
	 */
	framesToTime: function ( frames, frameRate ) {
		return frames / frameRate;
	},

	/**
	 * Converts time to frame count.
	 * @method
	 * @memberof aeq
	 * @param  {number} time      Time to convert
	 * @param  {number} frameRate FPS to convert with
	 * @return {number}           Time in frames
	 */
	timeToFrames: function ( time, frameRate ) {
		return time * frameRate;
	}
});

// Short versions of some methods

/**
 * @see aeq.getComposition
 * @function
 */
aeq.getComp = aeq.getComposition;

/**
 * @see aeq.getCompositions
 * @function
 */
aeq.getComps = aeq.getCompositions;

/**
 * @see aeq.getActiveComposition
 * @function
 */
aeq.getActiveComp = aeq.activeComp = aeq.activeComposition = aeq.getActiveComposition;

/**
 * @see aeq.getSelectedProperties
 * @function
 */
aeq.getSelectedProps = aeq.getSelectedProperties;

/**
 * @see aeq.getSelectedLayersOrAll
 * @function
 */
aeq.getSelectedOrAllLayers = aeq.getSelectedLayersOrAll;


function normalizeProperty( propertyParent, property ) {
	switch ( property.name ) {
	case 'X Position':
	case 'Y Position':
	case 'Z Position':
		property = propertyParent.property( 'Position' );
		property.dimensionsSeparated = true;
		return property.propertyGroup().property( property.name );

	default:
		return property;
	}
}

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
aeq.extend({

	/**
	 * Loops through the layers of a comp, array of comps, or all layers in the
	 * project, and executes a function for each one.
	 * @method
	 * @memberof aeq
	 * @param  {CompItem|CompItem[]|forEachArrayCallback}   [obj]
	 *         A `CompItem` or array of `compItem`s to get layers from.
	 *         If this is function, the function will loop through all layers in
	 *         the project.
	 * @param  {forEachArrayCallback}
	 *         callback The function to execute for each layer
	 * @return {aeq}
	 *         The AEQuery library.
	 */
	forEachLayer: function ( obj, callback ) {
		if ( aeq.isComp( obj ) ) {
			var length = obj.numLayers,
				i = 1;

			for ( ; i <= length; i++ ) {
				if ( callback( obj.layer( i ), i, obj ) === false ) {
					break;
				}
			}
		} else if ( aeq.isArray( obj ) ) {
			aeq.forEach( obj, function ( obj ) {
				aeq.forEachLayer( obj, callback );
			});
		} else if ( aeq.isFunction( obj ) ) {
			callback = obj;
			aeq.forEachComp( function ( comp ) {
				aeq.forEachLayer( comp, callback );
			});
		}
		return aeq;
	},

	/**
	 * Loops through the properties of a Comp, Layer, PropertyGroup, or an array
	 * of any of them, and executes a function for each one.
	 * @method
	 * @memberof aeq
	 * @param  {CompItem|Layer|PropertyGroup|Array|forEachArrayCallback}   [obj]
	 *         The object or array of objects to get properties from.
	 *         If this is function, the function will loop through all properties
	 *         in the project.
	 * @param  {forEachArrayCallback} callback
	 *         The function to execute for each property
	 * @return {aeq}
	 *         The AEQuery library.
	 */
	forEachProperty: function ( obj, callback ) {
		if ( aeq.isLayer( obj ) || aeq.isPropertyGroup( obj ) ) {
			var properties = aeq.getPropertyChildren( obj, {});
			aeq.forEach( properties, callback );
		} else if ( aeq.isComp( obj ) ) {
			aeq.forEachLayer( obj, function ( layer ) {
				var properties = aeq.getPropertyChildren( layer, {});
				aeq.forEach( properties, callback );
			});
		} else if ( aeq.isArray( obj ) ) {
			aeq.forEach( obj, function ( obj ) {
				aeq.forEachProperty( obj, callback );
			});
		} else if ( aeq.isFunction( obj ) ) {
			callback = obj;
			aeq.forEachLayer( function ( layer ) {
				aeq.forEachProperty( layer, callback );
			});
		}
		return aeq;
	},

	/**
	 * Loops through the effects in a Comp, or on a Layer, and executes a function
	 * for each one.
	 * @method
	 * @memberof aeq
	 * @param  {CompItem|Layer|Array|forEachArrayCallback}   [obj]
	 *         The object or array of objects to get effects from.
	 *         If this is function, the function will loop through all properties
	 *         in the project.
	 * @param  {forEachArrayCallback} callback
	 *         The function to execute for each effect
	 * @return {aeq}
	 *         The AEQuery library.
	 */
	forEachEffect: function ( obj, callback ) {
		var i, length, effects;
		if ( aeq.isLayer( obj ) ) {
			effects = obj.property( 'ADBE Effect Parade' );
			length = effects.numProperties;

			for ( i = 1; i <= length; i++ ) {
				if ( callback( effects.property( i ), i, effects ) === false ) {
					break;
				}
			}
		} else if ( aeq.isComp( obj ) ) {
			aeq.forEachLayer( obj, function ( layer ) {
				aeq.forEachEffect( layer, callback );
			});
		} else if ( aeq.isArray( obj ) ) {
			aeq.forEach( obj, function ( obj ) {
				aeq.forEachEffect( obj, callback );
			});
		} else if ( aeq.isFunction( obj ) ) {
			callback = obj;
			aeq.forEachLayer( function ( layer ) {
				aeq.forEachEffect( layer, callback );
			});
		}
		return aeq;
	},

	/**
	 * Loops through the comps in a project and executes a function for each one.
	 * @method
	 * @memberof aeq
	 * @param  {forEachArrayCallback} callback
	 *         The function to execute for each comp.
	 */
	forEachComp: function ( callback ) {
		aeq.forEach( aeq.getCompositions(), callback );
	},

	/**
	 * Loops through the Project items in a project and executes a function
	 * for each one.
	 * @method
	 * @memberof aeq
	 * @param  {forEachArrayCallback} callback
	 *         The function to execute for each item.
	 * @return {aeq}
	 *         The AEQuery library.
	 */
	forEachItem: function ( callback ) {
		var project = app.project;
		var items = project.items;
		var length = items.length;
		for ( var i = 1; i <= length; i++ ) {
			if ( callback( items[i], i, project ) === false ) {
				break;
			}
		}
		return aeq;
	},

	/**
	 * Loops through the items in the renderqueue and executes a function
	 * for each one.
	 * @method
	 * @memberof aeq
	 * @param  {forEachArrayCallback} callback
	 *         The function to execute for each renderQueue Item.
	 * @return {aeq}
	 *         The AEQuery library.
	 */
	forEachRenderQueueItem: function ( callback ) {
		var renderQueue = app.project.renderQueue;
		var renderQueueItems = renderQueue.items;
		var length = renderQueueItems.length;
		for ( var i = 1; i <= length; i++ ) {
			if ( callback( renderQueueItems[i], i, renderQueue ) === false ) {
				break;
			}
		}
		return aeq;
	},

	/**
	 * Loops through the output modules in the renderqueue and executes a function
	 * for each one.
	 * @method
	 * @memberof aeq
	 * @param  {forEachArrayCallback} callback
	 *         The function to execute for each Output Module.
	 * @return {aeq}
	 *         The AEQuery library.
	 */
	forEachOutputModule: function ( callback ) {
		aeq.forEachRenderQueueItem( function ( item ) {
			var length = item.outputModules.length;
			for ( var i = 1; i <= length; i++ ) {
				if ( callback( item.outputModules[i], i, item ) === false ) {
					break;
				}
			}
		});
		return aeq;
	}
});

// ForEach aliases
/**
 * @see aeq.forEachProperty
 * @function
 */
aeq.forEachProp = aeq.forEachProperty;

/**
 * @see aeq.forEachComp
 * @function
 */
aeq.forEachComposition = aeq.forEachComp;

/**
 * @see aeq.forEachRenderQueueItem
 * @function
 */
aeq.forEachRQItem = aeq.forEachRenderQueueItem;

/**
 * @see aeq.forEachOutputModule
 * @function
 */
aeq.forEachOM = aeq.forEachOutputModule;

return aeq;
}( aeq || {}) );

/* jslint browser: true */

aeq = ( function ( aeq ) {
/**
 * @typedef {String} aeq.SelectorString
 * @description The selectorString has 3 expression types:
 *
 * - type
 * - props
 * - pseudo
 *
 * #### Type
 *
 * The type of object to find, one of:
 *
 * - `item`: Finds items in the project panel
 * - `activecomp`: Finds the active composition
 * - `comp`/`composition`: Finds CompItems
 * - `layer`: Finds Layers
 * - `propertygroup`/`propgrp`/`propgroup`: Finds property groups
 * - `prop`/`property`: Finds properties`
 * - `effect`: Finds effects property groups
 * - `key`: Finds keyframes on properties. Returns aeq.Key objects
 *
 * The types can be chained after each other, but must be in the order above,
 * but all of them are optional. Only the objects of the last specified `type`
 * will be returned.
 *
 * Type is the only expression type that is required. All other expression
 * types are optional.
 *
 * #### Props
 * written right after the type, without a space, and inside square brackes
 * (`[ ]`). The props are a list attribute names and values, separated by `=`.
 * The objects must have an attribute with the specified value to qualify as
 * a match. Attributes are separated by a space.
 *
 * #### Pseudo
 * Psoudo are a bit like `props` but start with a colon, `:`, followed by a
 * keyword specifying how the attributes should match. The attributes are
 * placed inside parenthesis `()`.
 *
 * The keywords that are currently supported are:
 *
 * - `:is()`: all attributes must match.
 * - `:has()`: same as `:is()`
 * - `:not()`: objects should not have any attributes matching the props.
 * - `:isnot()`: same as `:not()`
 *
 * Psoudo selectors can be chained.
 *
 * @example <caption>Get all comps with width and height of 1920x1080</caption>
 *     aeq("comp[width=1920 heigth=1080]")
 *
 * @example <caption>Get all properties of layers that are selected and
 *          does not have audio:</caption>
 *     aeq("layer[selected hasAudio=false] prop")
 *
 * @example <caption>Get properties that have `PropertyValueType.OneD` and are
 *          not selected.</caption>
 *     aeq("prop[propertyValueType=" + PropertyValueType.OneD + "]:not(selected)");
 *
 * @example <caption>Get layers that do not have audio inside comps
 *          that are selected:</caption>
 *    aeq("comp:is(selected) layer:not(hasAudio)")
 */

/**
 * Gets objects by looking at a string and finding objects in After Effects
 * matching the description. The context is used to determine a starting point
 * for where the function starts looking for elements.
 * @memberof aeq
 * @method
 * @param  {aeq.SelectorString} selector A string containing a
 *         selector expression
 * @param  {CompItem|FolderItem|Layer|PropertyGroup|Array} [context] The object
 *         to start looking from
 * @return {ArrayEx} The found After Effects objects
 */
// TODO: Fix complexity of this function
// eslint-disable-next-line
aeq.select = function ( selector, context ) {
	var results = [];

	var parsedSelector = cssselector.parse( selector );
	var parts = parsedSelector;

	if ( context !== undefined ) {
		if ( aeq.isString( context ) ) {
			results = aeq.select( context );
		} else if ( aeq.isArray( context ) ) {
			results = context;
		} else {
			results = [ context ];
		}
	}

	var part;

	while ( parts.length > 0 ) {
		part = parts[0];
		var unshifted = false;

		switch ( part.type ) {
		case 'activecomp':
			results = filterResults( aeq.arrayEx( [ aeq.getActiveComposition() ] ) );
			results.type = 'comp';
			break;
		case 'composition':
		case 'comp':
			results = filterResults( aeq.getCompositions() );
			results.type = 'comp';
			break;

		case 'layer':
			if ( results.type === 'comp' || aeq.isComp( results[0] ) ) {
				results = filterResults( aeq.getLayers( results ) );
				results.type = 'layer';
			} else if ( results.type !== 'comp' ) {
				parts.unshift({ type: 'comp' });
				unshifted = true;
			}
			break;

		case 'propertygroup':
		case 'propgrp':
		case 'propgroup':
			if ( results.type === 'layer' || results.type === 'propertygroup' ||
					aeq.isLayer( results[0] ) || aeq.isPropertyGroup( results[0] ) ) {
				results = filterResults( aeq.getProperties( results,
					{ separate: false, groups: true, props: false }) );
				results.type = 'propertygroup';
			} else if ( results.type !== 'layer' ) {
				parts.unshift({ type: 'layer' });
				unshifted = true;
			}
			break;

		case 'property':
		case 'prop':
			if ( results.type === 'layer' || results.type === 'propertygroup' ||
					aeq.isLayer( results[0] ) || aeq.isPropertyGroup( results[0] ) ) {
				results = filterResults( aeq.getProperties( results, { separate: false }) );
				results.type = 'property';
			} else if ( results.type !== 'layer' ) {
				parts.unshift({ type: 'layer' });
				unshifted = true;
			}
			break;

		case 'effect':
			if ( results.type === 'layer' || aeq.isLayer( results[0] ) ) {
				results = filterResults( aeq.getEffects( results ) );
				results.type = 'effect';
			} else if ( results.type !== 'layer' ) {
				parts.unshift({ type: 'layer' });
				unshifted = true;
			}
			break;

		case 'key':
		case 'keys':
			if ( results.type === 'property' || aeq.isProperty( results[0] ) ) {
				results = filterResults( aeq.getKeys( results ) );
				results.type = 'key';
			} else if ( results.type !== 'property' ) {
				parts.unshift({ type: 'property' });
				unshifted = true;
			}
			break;

		case 'item':
			results = filterResults( aeq.getItems() );
			results.type = 'item';
			break;

		default:
			throw new Error( 'Unrecognized token ' + part.type );
		}
		if ( !unshifted ) {
			parts.shift();
		}
	}
	function filterResults( arr ) {
		// Only filter if there is something to filter
		if ( part.props || part.pseudo ) {
			return arr.filter( filter );
		}
		return arr;
	}

	function filter( obj ) {
		var ret = true,
			len, pseudo;
		if ( part.props !== null ) {
			if ( !hasAllAttributes( obj, part.props, false ) ) {
				return false;
			}
		}
		if ( !part.pseudo ) {
			return true;
		}
		len = part.pseudo.length;

		for ( var i = 0; i < len; i++ ) {
			pseudo = part.pseudo[i];

			if ( pseudo.type === 'not' || pseudo.type === 'isnot' ) {
				ret = hasAllAttributes( obj, pseudo.props, true );
			} else if ( pseudo.type === 'is' || pseudo.type === 'has' ) {
				ret = hasAllAttributes( obj, pseudo.props, false );
			}

			if ( ret === false ) {
				return false;
			}
		}
		return true;
	}

	return aeq.arrayEx( results );
};


function hasAllAttributes( obj, attributes, not ) {
	var attributeValue;
	for ( var attribute in attributes ) {
		if ( !attributes.hasOwnProperty( attribute ) ) {
			continue;
		}
		attributeValue = attributes[attribute];

		if ( !obj.hasOwnProperty( attribute ) ) {
			throw new Error( 'The attribute ' + attribute + ' does not exist on a ' + typeof ( obj ) );
		}

		var isSame = compare( attributeValue, obj[attribute] );

		// Return false if it is the same and it should not be,
		// or if it isn't the same and it should be
		if ( ( isSame && not ) || ( !isSame && not === false ) ) {
			return false;
		}
	}
	return true;
}

function compare( value, attribute ) {
	if ( value.type === 'Array' ) {
		return valueInArray( value, attribute );
	} else if ( value.type === 'RegExp' ) {
		return value.value.test( attribute );

	// For numbers, strings, booleans etc.
	}
	return value.value.toString() === attribute.toString();
}

function valueInArray( value, attribute ) {
	// Check if value is in array
	for ( var i = 0, il = value.value.length; i < il; i++ ) {
		if ( compare( value.value[i], attribute ) ) {
			return true;
		}
	}
	return false;
}

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
aeq.extend({

	/**
	 * Returns `true` if argument is null or undefined, false otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is null/undefined
	 */
	isNullOrUndefined: function ( o ) {
		// Using truthiness to capture both 'undefined' and 'null'
		return o == null;
	},

	/**
	 * Returns `true` if argument is a boolean (`true` or `false`),
	 * `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a boolean
	 */
	isBoolean: function ( o ) {
		return typeof o === 'boolean';
	},

	/**
	 * Returns `true` if argument is a number, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a number
	 */
	isNumber: function ( o ) {
		return typeof o === 'number';
	},

	/**
	 * Returns `true` if argument is a string, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a string
	 */
	isString: function ( o ) {
		return typeof o === 'string';
	},

	/**
	 * Returns `true` if argument is an object, `false` otherwise. This will most
	 * likely return `true` most of the time, as most things are objects. Try to
	 * use a different function to check the type, if applicable.
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is an object
	 */
	isObject: function ( o ) {
		return o instanceof Object;
	},

	/**
	 * Returns `true` if argument is a plain object, i.e an object created
	 * using `{}` or `new Object()`, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} obj The value to check
	 * @return {Boolean} Whether the value is a plain object
	 */
	isPlainObject: function ( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - After Effects objects
		if ( obj === undefined || obj === null ) {
			return false;
		}
		if ( obj.toString() !== '[object Object]' ) {
			return false;
		}

		if ( obj.constructor &&
				!obj.constructor.prototype.hasOwnProperty( 'isPrototypeOf' ) ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	/**
	 * Returns `true` if argument is an array, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is an array
	 */
	isArray: function ( o ) {
		return o instanceof Array;
	},

	/**
	 * Returns `true` if the passed array is empty, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Array} o The array to check
	 * @return {Boolean} Whether the array is empty
	 */
	isEmpty: function ( o ) {
		return o.length === undefined || o.length === 0;
	},

	/**
	 * Returns `true` if argument is a function, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a function
	 */
	isFunc: function ( o ) {
		return o instanceof Function;
	},

	/**
	 * ???
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} [description]
	 */
	isAeq: function ( o ) {
		return o instanceof Object && o.isAeq === true;
	},

	/**
	 * Returns `true` if argument is the Application object, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is the Application object
	 */
	isApp: function ( o ) {
		return o instanceof Application;
	},

	/**
	 * Returns `true` if argument is a Folder object, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a folder
	 */
	isFolder: function ( o ) {
		return o instanceof Folder;
	},

	/**
	 * Returns `true` if argument is a File object, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a File
	 */
	isFile: function ( o ) {
		return o instanceof File;
	},

	/**
	 * Returns `true` if argument is a FolderItem, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a FolderItem
	 */
	isFolderItem: function ( o ) {
		return o instanceof FolderItem;
	},

	/**
	 * Returns `true` if argument is a FootageItem, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a FootageItem
	 */
	isFootageItem: function ( o ) {
		return o instanceof FootageItem;
	},

	/**
	 * Returns `true` if argument is a Compitem, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a Compitem
	 */
	isComp: function ( o ) {
		return o instanceof CompItem;
	},

	/**
	 * Returns `true` if argument is an AVLayer, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is an AVLayer
	 */
	isAVLayer: function ( o ) {
		return o instanceof AVLayer;
	},

	/**
	 * Returns `true` if argument is a ShapeLayer, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a ShapeLayer
	 */
	isShapeLayer: function ( o ) {
		return o instanceof ShapeLayer;
	},

	/**
	 * Returns `true` if argument is a TextLayer, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a TextLayer
	 */
	isTextLayer: function ( o ) {
		return o instanceof TextLayer;
	},

	/**
	 * Returns `true` if argument is a CameraLayer, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a CameraLayer
	 */
	isCameraLayer: function ( o ) {
		return o instanceof CameraLayer;
	},

	/**
	 * Returns `true` if argument is a LightLayer, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a LightLayer
	 */
	isLightLayer: function ( o ) {
		return o instanceof LightLayer;
	},

	/**
	 * Returns `true` if a layer is a precomp, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Layer} o The layer to check
	 * @return {Boolean} Whether the layer is a precomp
	 */
	isPrecomp: function ( o ) {
		if ( !aeq.isLayer( o ) ) return false;
		return aeq.isComp( o.source );
	},

	/**
	 * Returns `true` if argument is any kind of layer, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a layer
	 */
	isLayer: function ( o ) {
		return aeq.isAVLayer( o ) ||
			aeq.isShapeLayer( o ) ||
			aeq.isTextLayer( o ) ||
			aeq.isCamera( o ) ||
			aeq.isLight( o );
	},

	/**
	 * Returns `true` if argument is a Property, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a Property
	 */
	isProperty: function ( o ) {
		return o instanceof Property;
	},

	/**
	 * Returns `true` if argument is a PropertyGroup, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a PropertyGroup
	 */
	isPropertyGroup: function ( o ) {
		return o instanceof PropertyGroup;
	},

	/**
	 * Returns `true` if argument is a MaskPropertyGroup, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a MaskPropertyGroup
	 */
	isMaskPropertyGroup: function ( o ) {
		return o instanceof MaskPropertyGroup;
	},

	/**
	 * Returns `true` if argument is a Panel object, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a Panel
	 */
	isPanel: function ( o ) {
		return o instanceof Panel;
	},

	/**
	 * Returns `true` if argument is a Window object, `false` otherwise
	 * @function
	 * @memberof aeq
	 * @param  {Any} o   The value to check
	 * @return {Boolean} Whether the value is a Window
	 */
	isWindow: function ( o ) {
		return o instanceof Window;
	},

	/**
	 * ???
	 * @function
	 * @memberof aeq
	 * @param  {Object} obj The object
	 * @return {String}     [description]
	 */
	reflect: function ( obj ) {
		var str = [];

		for ( var m in obj ) {
			if ( obj.hasOwnProperty( m ) ) {
				str.push( obj[m].constructor.name + ' ' + m + '=' + obj[m] );
			}
		}

		return str.join();
	}
});

// Function Aliases

/**
 * @see aeq.isBoolean
 * @function
 */
aeq.isBool = aeq.isBoolean;

/**
 * @see aeq.isNumber
 * @function
 */
aeq.isNum = aeq.isNumber;

/**
 * @see aeq.isString
 * @function
 */
aeq.isStr = aeq.isString;

/**
 * @see aeq.isObject
 * @function
 */
aeq.isObj = aeq.isObject;

/**
 * @see aeq.isArray
 * @function
 */
aeq.isArr = aeq.isArray;

/**
 * @see aeq.isFunc
 * @function
 */
aeq.isFunction = aeq.isFunc;

/**
 * @see aeq.isComp
 * @function
 */
aeq.isComposition = aeq.isComp;

/**
 * @see aeq.isProperty
 * @function
 */
aeq.isProp = aeq.isProperty;

/**
 * @see aeq.isFolder
 * @function
 */
aeq.isDir = aeq.isDirectory = aeq.isFolder;

/**
 * @see aeq.isCameraLayer
 * @function
 */
aeq.isCamera = aeq.isCameraLayer;

/**
 * @see aeq.isLightLayer
 * @function
 */
aeq.isLight = aeq.isLightLayer;

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
 * Creates and alerts an aequery error from a JS error
 * @method
 * @memberof aeq
 * @param  {Error} err JS error object
 * @param  {type} args [description]
 */
aeq.error = function ( err, args ) {
	var callingFunction = /\s*function\s*([^(]*)/i.exec( err.source );
	callingFunction = callingFunction !== null && callingFunction[1] !== '' ?
		callingFunction[1] :
		'anonymous';

	alert( err.toString() + '\n' +
		// eslint says the `\/` is useless, but it useful in estk
		// eslint-disable-next-line no-useless-escape
		'Script File: ' + File.decode( err.fileName ).replace( /^.*[\\|\/]/, '' ) +

		// Arguments.callee is the more reliable way of getting the function name
		'\nFunction: ' + ( args === undefined ? callingFunction : args.callee.name ) +
		( args === undefined || args.length === 0 ?
			'' :
			'\nArguments: ' + Array.prototype.toString.call( args ) ) +
		'\nError on Line: ' + err.line.toString()
	);
};

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
	 * Returns a pressed-state object of modifier keys
	 * @method
	 * @memberof aeq
	 * @return {{meta: boolean, ctrl: boolean, alt: boolean, shift: boolean}}
	 * Pressed-states object of modifier keys
	 */
aeq.getModifiers = function () {
	return {
		meta: ScriptUI.environment.keyboardState.metaKey,
		ctrl: ScriptUI.environment.keyboardState.ctrlKey,
		alt: ScriptUI.environment.keyboardState.altKey,
		shift: ScriptUI.environment.keyboardState.shiftKey
	};
};

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
aeq.extend({

	/**
	 * Saves object of name:binaryContents pairs to files, returns object of files
	 * @method
	 * @memberof aeq
	 * @param  {{name: contents}} resources Object of name:contents pairs
	 * @param  {Folder|string} folder       String path to a folder, or folder object
	 * @param  {string} [extension=""]      File extension to save files as
	 * @return {{name: File}}               Object of created files
	 */
	createResourceFiles: function ( resources, folder, extension ) {
		if ( !aeq.app.securityPrefEnabled() ) {
			return false;
		}
		folder = aeq.getFolderObject( folder );
		extension = setDefault( extension, '' );
		if ( extension !== '' && extension.charAt( 0 ) !== '.' ) {
			extension = '.' + extension;
		}

		aeq.file.ensureFolderExists( folder );

		if ( !folder.exists ) {
			throw new Error( 'Could not create resource folder: ' + folder.fsname );
		}

		var resourceFiles = {};
		aeq.forEach( resources, function ( name, contents ) {
			var filePath = aeq.file.joinPath( folder.fsName, name + extension );
			var file = new File( filePath );
			resourceFiles[name] = file;

			if ( !file.exists || contents.length !== file.length ) {
				file.encoding = 'BINARY';
				file.open( 'w' );
				var success = file.write( contents );
				if ( !success ) {
					if ( file.error === '' ) {
						resourceFiles[name] = null;
					} else {
						resourceFiles[name] = new Error( file.error, file.fsName, undefined );
					}
				}
				file.close();
			}
		});
		return resourceFiles;
	},

	/**
	 * Takes a file (or file path) and converts it to a binary string
	 * @method
	 * @memberof aeq
	 * @param  {File|string} filePath Path or file to get data from
	 * @return {string}               Binary string of file data
	 */
	getBinaryString: function ( filePath ) {
		var file = aeq.getFileObject( filePath );

		file.encoding = 'BINARY';
		file.open( 'r' );
		var fileData = file.read();
		file.close();

		var binaryString = fileData.toSource();

		binaryString = binaryString.replace( /^\(new String\("/, '' );
		binaryString = binaryString.replace( /"\)\)$/, '' );

		return binaryString;
	}
});

// Function aliases

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
aeq.extend({

	/**
	 * `true` if system is a MacOS
	 * @memberof aeq
	 * @type {Boolean}
	 */
	isMac: $.os.indexOf( 'Windows' ) === -1,

	/**
	 * `true` if system is a Windows
	 * @memberof aeq
	 * @type {Boolean}
	 */
	isWindows: $.os.indexOf( 'Windows' ) !== -1,

	/**
	 * Gets a string containing current OS, AE version and AE language
	 * @method
	 * @memberof aeq
	 * @return {string} String containing current OS, AE version and AE language
	 */
	getSystemInfo: function () {
		return $.os + ' AE ' + app.version + '/' + app.isoLanguage;
	}
});

aeq.isWin = aeq.isWindows;

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
aeq.extend({

	/**
	 * Creates an undoGroup and wraps passed function in it
	 * @method
	 * @memberof aeq
	 * @param  {string}    name     Undo group name
	 * @param  {Function}  callback Function to wrap in undo group
	 * @param  {any|array} args     Argument or array of arguments to pass to callback
	 * @return {any}                Returned value from function
	 */
	createUndoGroup: function ( name, callback, args ) {
		app.beginUndoGroup( name );
		if ( !aeq.isArray( args ) ) {
			args = [ args ];
		}
		var value = callback.apply( null, args );
		app.endUndoGroup();

		return value;
	}
});

// Function aliases
aeq.undoGroup = aeq.createUndoGroup;

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
aeq.extend({

	/**
	 * [description]
	 * @method
	 * @memberof aeq
	 * @param  {type} value [description]
	 * @param  {type} obj   [description]
	 * @return {type}       [description]
	 */
	valueInObject: function ( value, obj ) {
		for ( var key in obj ) {
			if ( obj.hasOwnProperty( key ) ) {
				if ( value === obj[key] ) {
					return key;
				}
			}
		}
		return undefined;
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq
	 * @param  {type} property [description]
	 * @return {type}          [description]
	 */
	propertyType: function ( property ) {
		// Uses the propertyType attribute if it is not undefined
		return aeq.valueInObject( property.propertyType || property, PropertyType );
	}
});

// Function aliases

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
 * [app description]
 * @namespace aeq.app
 * @memberof aeq
 * @type {Object}
 */
aeq.app = aeq.extend({}, {
	toString: function () {
		return '[object aeq.App]';
	},

	// Function for extending the object using objects
	extend: aeq.extend,

	/**
	 * The After Effects version
	 * @memberof aeq.app
	 * @type {number}
	 */
	version: parseFloat( app.version ),

	/**
	 * Checks whether AE security pref is enabled
	 * @method
	 * @memberof aeq.app
	 * @return {boolean} Security pref status
	 */
	securityPrefEnabled: function () {
		return app.preferences.getPrefAsLong( 'Main Pref Section', 'Pref_SCRIPTING_FILE_NETWORK_SECURITY' ) === 1;
	},

	/**
	 * Gets user data folder; In Windows: the value of %USERDATA% (by default,
	 * C:\Documents and Settings\username\Application Data) In Mac OS:
	 * ~/Library/Application Support
	 * @method
	 * @memberof aeq.app
	 * @return {Folder} User data folder
	 */
	getUserDataFolder: function () {
		return Folder.userData;
	},

	/**
	 * Gets current script file object
	 * @method
	 * @memberof aeq.app
	 * @return {File} File object of current script
	 */
	getScriptFile: function () {
		return aeq.getFile( $.fileName );
	},

	/**
	 * Gets current AEP file object
	 * @method
	 * @memberof aeq.app
	 * @return {File} File object of current AEP
	 */
	getAEP: function () {
		return app.project.file;
	},

	/**
	 * Gets folder containing current AEP, or null if AEP is not saved
	 * @method
	 * @memberof aeq.app
	 * @return {Folder|null} Parent directory of current AEP
	 */
	getAEPDir: function () {
		var aepFile = aeq.app.getAEP();

		if ( !aepFile ) {
			return null;
		}

		return aeq.getFolder( aepFile.path );
	},

	/**
	 * Gets filename of current AEP, or null if AEP is not saved
	 * @method
	 * @memberof aeq.app
	 * @return {string|null} Filename of current AEP
	 */
	getAEPName: function () {
		var aepFile = aeq.app.getAEP();
		if ( !aepFile ) return null;
		return aeq.file.stripExtension( aepFile.displayName );
	},

	/**
	 * Gets array of both default preset folder paths
	 * One in the user directory, one in the AE install directory
	 * @method
	 * @memberof aeq.app
	 * @return {string[]} Array of preset folder paths
	 */
	getPresetsPaths: function () {
		var appVersion = aeq.app.version;
		var versionPrettyName = '';

		if ( parseInt( appVersion ) === 11 ) {
			versionPrettyName = 'CS6';
		} else if ( parseInt( appVersion ) === 12 ) {
			versionPrettyName = 'CC';
		} else if ( appVersion >= 13.0 && appVersion < 13.5 ) {
			versionPrettyName = 'CC 2014';
		} else if ( appVersion >= 13.5 && appVersion < 14.0 ) {
			versionPrettyName = 'CC 2015';
		} else if ( appVersion >= 14.0 ) {
			versionPrettyName = 'CC 2017';
		}

		return [
			Folder.current.fullName + '/Presets/',
			Folder.myDocuments.fullName + '/Adobe/After Effects ' + versionPrettyName + '/User Presets/'
		];
	},

	/**
	 * Checks security pref setting, prompting user to enable it if not
	 * Throws an error if user declines prompt
	 * @method
	 * @memberof aeq.app
	 */
	ensureSecurityPrefEnabled: function () {
		if ( !aeq.app.securityPrefEnabled() ) {
			if ( confirm( 'This script requires access to write files.\n' +
				'Go to the "General" panel of the application preferences and ensure\n' +
				'"Allow Scripts to Write Files and Access Network" is checked.\n\nOpen prefs now?' ) ) {
				app.executeCommand( 2359 ); // Launch prefs
			}

			if ( !aeq.app.securityPrefEnabled() ) {
				throw new Error( 'Security preference is not enabled! Can\'t continue.' );
			}
		}
	},

	/**
	 * Opens an AEP
	 * @method
	 * @memberof aeq.app
	 * @param  {File|string} filePath AEP path or file object to open
	 * @return {File}                 Newly-opened AEP
	 */
	open: function ( filePath ) {
		var file = aeq.getFile( filePath );

		if ( file ) {
			return app.open( file );
		}

		return app.open();
	}
});

// Function aliases
aeq.open = aeq.app.open;
aeq.AEversion = aeq.app.version;

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
 * Module for interacting with the command line / system
 * @namespace aeq.command
 * @memberof aeq
 * @type {Object}
 */
aeq.command = aeq.extend({}, {
	toString: function () {
		return '[object aeq.command]';
	},

	// Function for extending the prototype using objects
	extend: aeq.extend,

	/**
	 * Call a command-line/system command.
	 * @method
	 * @memberof aeq.command
	 * @param  {string|object} windows           Command to call if OS is windows,
	 *                                           or an object with options.
	 * @param  {string}        [windows.win]     Command to call if OS is windows.
	 * @param  {string}        [windows.windows] Command to call if OS is windows.
	 * @param  {string}        [windows.mac]     Argument to give the command.
	 * @param  {string}        [windows.arg]     Command to call if OS is MacOS.
	 * @param  {string}        [mac]             Command to call if OS is MacOS.
	 * @param  {string}        [arg]             Argument to give the command.
	 * @return {string}        The value returned from the command.
	 *
	 * @example
	 * <caption>Open file in Finder/Explorer. ({@link aeq.command.revealFile})</caption>
	 * aeq.command.call('Explorer /select,', 'open -R', '"' + file.fsName + '"' )
	 * aeq.command.call({
	 *     windows: 'Explorer /select,',
	 *     mac: 'open -R',
	 *     arg: '"' + file.fsName + '"'
	 * })
	 */
	call: function ( windows, mac, arg ) {
		if ( aeq.isObject( arguments[0] ) ) {
			var args = arguments[0];
			windows = setDefault( args.win, args.windows );
			mac = setDefault( args.mac, args.osx );
			arg = args.arg;
		}
		var command = mac;
		if ( aeq.isWindows ) {
			command = windows;
		}
		arg = arg === undefined ? '' : ' ' + arg;
		return system.callSystem( command + arg );
	},

	/**
	 * Opens the given URL in the default web browser.
	 * @method
	 * @memberof aeq.command
	 * @param  {string} URL The URL to open.
	 *
	 * @example
	 * <caption>Opens AEQuery bitbucket project.</caption>
	 * aeq.command.openURL('https://bitbucket.org/motiondesign/aequery')
	 */
	openURL: function ( URL ) {
		try {
			if ( URL.match( /^https?:\/\// ) === null ) {
				URL = 'http://' + URL;
			}
			aeq.command.call({
				win: 'cmd /c "explorer',
				mac: 'open',
				arg: URL
			});
		} catch ( err ) {
			alert( 'Error in openURL function\n' + err.toString() );
		}
	},

	/**
	 * Reveals the given file path or file object in Finder/Explorer.
	 * @method
	 * @memberof aeq.command
	 * @param  {string|File} filePath The path to the file that should be
	 *                                revealed, or a file object to reveal.
	 * @return {string}      The value returned when calling the reveal command
	 *                       in the command line. Mostly empty, holds error info
	 *                       if not empty.
	 * @example
	 * <caption>Reveals the rurnning script in Finder/Explorer</caption>
	 * aeq.command.revealFile( $.fileName )
	 */
	revealFile: function ( filePath ) {
		if ( aeq.isFile( filePath ) ) {
			filePath = filePath.fsName;
		}
		return aeq.command.call( 'Explorer /select,', 'open -R', '"' + filePath + '"' );
	},

	/**
	 * Copies a string to the users clipboard.
	 * @method
	 * @memberof aeq.command
	 * @param  {string} text The string to copy.
	 *
	 * @example
	 * aeq.command.copyToClipboard( 'Hello World!' )
	 */
	copyToClipboard: function ( text ) {
		aeq.command.call(
			'cmd.exe /c cmd.exe /c "echo ' + text + ' | clip"', // Windows
			'echo "' + text + '" | pbcopy' // MacOS
		);
	}
});

// Function aliases
aeq.callSystem = aeq.command.call;
aeq.openURL = aeq.command.openURL;
aeq.revealFile = aeq.command.revealFile;
aeq.copyToClipboard = aeq.command.copyToClipboard;

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
 * Module dealing with comp objects.
 * @namespace aeq.comp
 * @memberof aeq
 * @type {Object}
 */
aeq.comp = aeq.extend({}, {
	toString: function () {
		return '[object aeq.comp]';
	},

	// Function for extending the prototype using objects
	extend: aeq.extend,

	/**
	 * Creates a comp with the given settings
	 * @method
	 * @memberof aeq.comp
	 * @param  {FolderItem|object} [folder=app.project]  The folder to place the
	 *         comp inside in the project panel. If not provided, this argument
	 *         will be used as the `options` parameter.
	 * @param  {object} [options] Comp settings:
	 * @param  {string} [options.name=Comp] The name of the comp.
	 * @param  {number} [options.width=1920] Comp width, in pixels.
	 * @param  {number} [options.height=1080] Comp height, in pixels.
	 * @param  {number} [options.pixelAspect=1] Comp pixel aspect ratio.
	 * @param  {number} [options.duration=1] Comp duration, in seconds.
	 * @param  {number} [options.frameRate=24] Comp frame rate.
	 * @return {CompItem}  The created comp item.
	 *
	 * @example <caption>Create a comp in the project root, with name "Example",
	 *          and a duration of 10 seconds. And use default values for the
	 *          other options</caption>
	 * var comp = aeq.comp.create({
	 *     name: 'Example',
	 *     duration: 10
	 * })
	 *
	 * @example <caption>Create comp in a folder, with name "Example"</caption>
	 * var comp = aeq.comp.create(compFolder, {
	 *     name: "Example"
	 * })
	 *
	 * @example <caption>Create a comp with all default values</caption>
	 * var comp = aeq.comp.create()
	 */
	create: function ( folder, options ) {
		if ( !aeq.isFolderItem( folder ) ) {
			options = setDefault( folder, {});
			folder = setDefault( options.folder, app.project );
		}

		// TODO: Find a way to use the last used settings, or find some defaults
		var defaultOptions = {
			name: 'Comp',
			width: 1920,
			height: 1080,
			pixelAspect: 1,
			duration: 1,
			frameRate: 24
		};

		options = aeq.extend( defaultOptions, options );

		return folder.items.addComp(
			options.name,
			options.width,
			options.height,
			options.pixelAspect,
			options.duration,
			options.frameRate
		);
	},

	/**
	 * Gets the `RenderQueueItem`s that references a given comp.
	 * @method
	 * @memberof aeq.comp
	 * @param  {CompItem} comp   The comp to find in the Render Queue.
	 * @param  {boolean} [queuedOnly=true]   Only get `RenderQueueItem`s that
	 *                                       are queued.
	 * @return {RenderQueueItem[]}    The `RenderQueueItem`s that references
	 *                                the comp
	 *
	 * @example <caption>Get all `RenderQueueItem`s that references
	 *          the comp.</caption>
	 * var RQItems = aeq.comp.getCompInQueue( comp, false )
	 */
	getCompInQueue: function ( comp, queuedOnly ) {
		if ( aeq.isNullOrUndefined( queuedOnly ) ) queuedOnly = true;

		var queuedItems;

		if ( queuedOnly ) {
			queuedItems = aeq.renderqueue.getQueuedItems();
		} else {
			queuedItems = aeq.renderqueue.getRQItems();
		}

		return aeq.filter( queuedItems, function ( item ) {
			return item.comp.id === comp.id;
		});
	},

	/**
	 * Check if a comp is in the Render Queue, regardless of it being
	 * queued or not.
	 * @method
	 * @memberof aeq.comp
	 * @param  {CompItem} comp The comp to find in the queue.
	 * @return {boolean}   True if comp is in the queue.
	 */
	isInQueue: function ( comp ) {
		if ( !aeq.isComp( comp ) ) return null;

		var items = aeq.renderqueue.getRQItems();

		return items.some( function ( item ) {
			return item.comp.id === comp.id;
		});
	},

	/**
	 * Check if a comp is in the Render Queue and queued.
	 * @method
	 * @memberof aeq.comp
	 * @param  {CompItem} comp The comp to find the queue.
	 * @return {boolean}     True if the comp is queued.
	 */
	isQueued: function ( comp ) {
		return aeq.comp.getCompInQueue( comp, true ).length > 0;
	}
});

// Function aliases

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
 * [file description]
 * @namespace aeq.file
 * @memberof aeq
 * @type {Object}
 */
aeq.file = aeq.extend({}, {
	toString: function () {
		return '[object aeq.file]';
	},

	// Function for extending the prototype using objects
	extend: aeq.extend,

	/**
	 * The value of the OS's file system path separator symbol; \ or /
	 * @memberof aeq.file
	 * @type {string}
	 */
	pathSeparatorSymbol: $.os.indexOf( 'Windows' ) > -1 ? '\\' : '/',

	// NormalizePathArray, pathIsAbsolute, normalizePath, joinPath adapted from path-browserify
	// (https://github.com/substack/path-browserify/)
	//
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	/**
	 * [description]
	 * @method
	 * @memberof aeq.file
	 * @param  {string[]} parts         Array of path components
	 * @param  {boolean} allowAboveRoot [description]
	 * @return {string[]}               [description]
	 */
	normalizePathArray: function ( parts, allowAboveRoot ) {
		// If the path tries to go above the root, `up` ends up > 0
		var up = 0;
		for ( var i = parts.length - 1; i >= 0; i-- ) {
			var last = parts[i];
			if ( last === '.' ) {
				parts.splice( i, 1 );
			} else if ( last === '..' ) {
				parts.splice( i, 1 );
				up++;
			} else if ( up ) {
				parts.splice( i, 1 );
				up--;
			}
		}

		// If the path is allowed to go above the root, restore leading ..s
		if ( allowAboveRoot ) {
			for ( ; up--; up ) {
				parts.unshift( '..' );
			}
		}

		return parts;
	},

	/**
	 * Checks whether the path starts with the OS separator symbol
	 * @method
	 * @memberof aeq.file
	 * @param  {string} path File path
	 * @return {boolean}     True if first character equals path separator symbol
	 */
	pathIsAbsolute: function ( path ) {
		return path.charAt( 0 ) === aeq.file.pathSeparatorSymbol;
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.file
	 * @param  {string} path Raw joined file path
	 * @return {string}      Normalized path
	 */
	normalizePath: function ( path ) {
		var pathIsAbsolute = aeq.file.pathIsAbsolute( path ),
			trailingSlash = path.substr( -1 ) === aeq.file.pathSeparatorSymbol;

		// Normalize the path
		var splitPath = path.split( aeq.file.pathSeparatorSymbol );
		var filteredPath = aeq.filter( splitPath, function ( p ) {
			return !!p;
		});
		path = aeq.file.normalizePathArray( filteredPath, !pathIsAbsolute );
		path = path.join( aeq.file.pathSeparatorSymbol );

		if ( !path && !pathIsAbsolute ) {
			path = '.';
		}
		if ( path && trailingSlash ) {
			path += aeq.file.pathSeparatorSymbol;
		}

		return ( pathIsAbsolute ? aeq.file.pathSeparatorSymbol : '' ) + path;
	},

	/**
	 * Joins path components into an OS-formatted file path string
	 * @method
	 * @memberof aeq.file
	 * @param  {...(String|File|Folder)} paths The path elements to join.
	 * @return {string} File path string joined with OS's path separator
	 */
	joinPath: function () {
		var paths = Array.prototype.slice.call( arguments, 0 );
		return aeq.file.normalizePath( aeq.filter( paths, function ( p, index ) {
			// Path is a File or Folder object.
			if ( p && typeof p.fsName === 'string' ) {
				p = p.fsName;
				paths[index] = p;
			}
			if ( typeof p !== 'string' ) {
				throw new TypeError( 'Arguments to path.join must be strings, Files or Folders' );
			}

			return p;
		}).join( aeq.file.pathSeparatorSymbol ) );
	},

	/**
	 * Returns the extension of target file
	 * @method
	 * @memberof aeq.file
	 * @param  {File|string} filePath String path to a file, or file object
	 * @return {string}               Extension of target file
	 */
	getExtension: function ( filePath ) {
		var filePathStr = aeq.isFile( filePath ) ? filePath.name : filePath;
		return filePathStr.substr( filePathStr.lastIndexOf( '.' ) + 1, filePathStr.length );
	},

	/**
	 * Returns the filename of target file without extension
	 * @method
	 * @memberof aeq.file
	 * @param  {File|string} filePath String path to a file, or file object
	 * @return {string}               Filename without extension
	 */
	stripExtension: function ( filePath ) {
		var filePathStr = aeq.isFile( filePath ) ? filePath.name : filePath;
		return filePathStr.substr( 0, filePathStr.lastIndexOf( '.' ) );
	},

	/**
	 * Takes a file path or a file object, and returns a file object
	 * allows functions to be flexible in whether they take a path vs file
	 * @method
	 * @memberof aeq
	 * @param  {File|string} filePath String path to a file, or file object
	 * @return {File}                 Resolved file object
	 */
	getFileObject: function ( filePath ) {
		return aeq.isFile( filePath ) ? filePath : new File( filePath );
	},

	/**
	 * Gets target file by path or file object, or null if doesn't exist
	 * @method
	 * @memberof aeq.file
	 * @param  {File|string} filePath String path to a file, or file object
	 * @return {File|null}            Target file, or null if doesn't exist
	 */
	getFile: function ( filePath ) {
		var file = aeq.getFileObject( filePath );

		if ( !file.exists ) return null;

		return file;
	},

	/**
	 * Gets all files in target path that matches filter (or, all files if no filter)
	 * @method
	 * @memberof aeq.file
	 * @param  {File|string} folderPath      Folder or path to get
	 * @param  {string|function} [filter=""] Filter string or function
	 * @return {aeq.arrayEx|null}                 Array of filtered files, or null if none
	 */
	getFiles: function ( folderPath, filter ) {
		filter = setDefault( filter, '' );
		var folder = aeq.getFolder( folderPath ),
			files;

		files = folder.getFiles( filter );

		if ( files === null || files.length === 0 ) return null;

		return aeq.arrayEx( files );
	},

	/**
	 * Recursively scan folder for all files matching filter
	 * @method
	 * @memberof aeq.file
	 * @param {Folder|String}   folder      Folder or path to get files from
	 * @param {string|function} [filter=""] Filter string or function
	 * @returns {File[]}                    Array of found files
	 */
	getFilesRecursive: function ( folder, filter ) {
		var foundItems = aeq.arrayEx();

		var folderObject = aeq.file.getFolder( folder );
		if ( aeq.isNullOrUndefined( folderObject ) ) {
			return foundItems;
		}

		// Find all folders within folderObject and
		// recursively append anything it finds to foundItems
		aeq.file.getFiles( folderObject ).filter( function ( item ) {
			return aeq.isFolder( item );
		}).forEach( function ( folderItem ) {
			foundItems = foundItems.concat( aeq.file.getFilesRecursive( folderItem, filter ) );
		});

		var filesInFolder = aeq.file.getFiles( folderObject, filter );
		if ( !aeq.isNullOrUndefined( filesInFolder ) ) {
			foundItems = foundItems.concat( filesInFolder );
		}

		return aeq.arrayEx( foundItems );
	},

	/**
	 * Takes a folder path or a folder object, and returns a folder object
	 * allows functions to be flexible in whether they take a path vs folder
	 * @method
	 * @memberof aeq
	 * @param  {Folder|string} folderPath String path to a folder, or folder object
	 * @return {Folder}                   Resolved folder object
	 */
	getFolderObject: function ( folderPath ) {
		return aeq.isFolder( folderPath ) ? folderPath : new Folder( folderPath );
	},

	/**
	 * Returns a folder, or null if it doesn't exist
	 * @method
	 * @memberof aeq.file
	 * @param  {File|string} folderPath Folder path to get
	 * @return {Folder|null} Target folder, or null if it doesn't exist
	 */
	getFolder: function ( folderPath ) {
		var folder = aeq.getFolderObject( folderPath );

		if ( !folder.exists ) return null;

		return folder;
	},

	/**
	 * Returns a folder, creating if it doesn't exist
	 * @method
	 * @memberof aeq.file
	 * @param  {File|string} folderPath Folder path to get or create
	 * @return {Folder} Target folder
	 */
	ensureFolderExists: function ( folderPath ) {
		var folder = aeq.getFolderObject( folderPath );

		if ( !folder.exists ) folder.create();

		return folder;
	},

	/**
	 * Returns the contents of a specified file
	 * @method
	 * @memberof aeq
	 * @param  {File|string} filePath    Path or file to read
	 * @param  {string} [encoding=UTF-8] Encoding method
	 * @return {string|null}             Contents of the file, or null if file doesn't exist
	 */
	readFile: function ( filePath, encoding ) {
		var file = aeq.getFileObject( filePath ),
			contents;

		encoding = setDefault( encoding, 'UTF-8' );

		if ( file.exists ) {
			if ( File.isEncodingAvailable( encoding ) ) {
				file.encoding = encoding;
			}

			file.open();
			contents = file.read();
			file.close();
			return contents;
		}
		return null;
	},

	/**
	 * Writes data to a file, returns file
	 * @method
	 * @memberof aeq
	 * @param  {File|string} filePath              Path or file to write to
	 * @param  {string}  contents                  Data to write to the file
	 * @param  {object} [options]                  Options for writing file.
	 * @param  {boolean} [options.overwrite=false] `true` if file should be overwritten if exists.
	 * @param  {string} [options.encoding="UTF-8"] Encoding method.
	 * @return {File|null}                         New file, or null if file was not written
	 *                                             correctly or file exits and overwrite = false
	 */
	writeFile: function ( filePath, contents, options ) {
		var file = aeq.getFileObject( filePath );
		options = aeq.setDefault( options, {});

		if ( file.exists && options.overwrite === false ) {
			return null;
		}

		if ( !file.exists ) {
			aeq.file.ensureFolderExists( file.path );
		}

		if ( !aeq.isNullOrUndefined( options.encoding ) &&
				File.isEncodingAvailable( options.encoding ) ) {
			file.encoding = options.encoding;
		}

		file.open( 'w' );
		var success = file.write( contents );
		file.close();

		if ( success ) return file;

		return null;
	},

	/**
	 * Prompts user to select files
	 * @method
	 * @memberof aeq.file
	 * @param  {string[]} extensionList      Array of file extensions to accept
	 * @param  {boolean} [multiSelect=false] `true` to allow multiple files
	 * @return {file[]|null}                 ArrayEx of selected file(s), or null if canceled
	 *
	 * @example
	 * var myFiles = selectFiles(["jsx", "theme", "someOtherExtension"], true);
	 */
	selectFiles: function ( extensionList, multiSelect ) {
		multiSelect = aeq.setDefault( multiSelect, false );
		var message = multiSelect ? 'Please select multiple files' : 'Please select file';

		if ( !aeq.isArray( extensionList ) ) {
			extensionList = [ extensionList ];
		}

		var getFilterForFiles = function () {
			if ( aeq.isWin ) {
				return '*.' + extensionList.join( ';*.' );
			}

			var extensionListRe = '.(' + extensionList.join( '|' ) + ')$';
			var re = new RegExp( extensionListRe, 'i' );

			return function ( file ) {
				return file.name.match( re ) || file.constructor.name === 'Folder';
			};
		};

		var files = File.openDialog( message, getFilterForFiles(), multiSelect );

		if ( aeq.isNullOrUndefined( files ) ) {
			return null;
		}

		if ( !aeq.isArray( files ) ) {
			files = [ files ];
		}

		return aeq.arrayEx( files );
	}
});

// Function aliases
aeq.pathSeparatorSymbol = aeq.file.pathSeparatorSymbol;
aeq.getFileObject = aeq.file.getFileObject;
aeq.getFolderObject = aeq.file.getFolderObject;
aeq.getFile = aeq.file.get = aeq.file.getFile;
aeq.getFiles = aeq.file.getFiles;
aeq.getFilesRecursive = aeq.file.getFilesRecursive;
aeq.getFolder = aeq.file.getFolder;
aeq.readFile = aeq.file.readFile;
aeq.writeFile = aeq.file.writeFile;
aeq.selectFiles = aeq.file.selectFiles;

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
 * Module dealing with Layer objects.
 * @namespace aeq.layer
 * @memberof aeq
 * @type {Object}
 */
aeq.layer = aeq.extend({}, {
	toString: function () {
		return '[object aeq.layer]';
	},

	// Function for extending the prototype using objects
	extend: aeq.extend,

	/**
	 * Copies the state of layer toggles from one layer to another.
	 * Layer toggles: enabled, solo, shy, quality, effectsActive, motionBlur
	 * adjustmentLayer, threeDLayer, blendingMode, preserveTransparency
	 * parent, inPoint, stretch, startTime, outPoint, label, guideLayer
	 * name, comment, autoOrient
	 * @method
	 * @memberof aeq.layer
	 * @param  {Layer} sourceLayer The layer to copy from.
	 * @param  {Layer} destLayer   The layer to copy to.
	 */
	copyLayerToggles: function ( sourceLayer, destLayer ) {
		var switches = 'enabled solo shy quality effectsActive motionBlur ' +
			'adjustmentLayer threeDLayer blendingMode preserveTransparency ' +
			'parent inPoint stretch startTime outPoint label guideLayer ' +
			'name comment autoOrient';
		switches = switches.split( ' ' );

		aeq.forEach( switches, function ( switchName ) {
			destLayer[switchName] = sourceLayer[switchName];
		});
	},

	/**
	 * Gets all layers that has the given layer as its parent.
	 * @method
	 * @memberof aeq.layer
	 * @param  {Layer} parentLayer The layer to get children from.
	 * @return {aeq.arrayEx}           The children Layers of the given Layer.
	 */
	children: function ( parentLayer ) {
		var layers = aeq.getLayers( parentLayer.containingComp );
		return layers.filter( function ( layer ) {
			return layer.parent === parentLayer;
		});
	},

	/**
	 * Gets all layers that has the given layer as its parent, and all layers
	 * that has those layers, and so on.
	 * @method
	 * @memberof aeq.layer
	 * @param  {Layer} parentLayer The layer to get decendants from.
	 * @return {aeq.arrayEx}           Children and decendants of the given Layer.
	 */
	allChildren: function ( parentLayer ) {
		var allChildren = [];
		var children = aeq.layer.children( parentLayer );
		aeq.forEach( children, function ( layer ) {
			allChildren.push( layer );
			allChildren = allChildren.concat( aeq.layer.allChildren( layer ) );
		});
		return aeq.arrayEx( allChildren );
	},

	/**
	 * Gets the layers parent chain. I.e This layer's parent's parent, and so on.
	 * @method
	 * @memberof aeq.layer
	 * @param  {Layer} childLayer The layer to get parents from.
	 * @return {aeq.arrayEx}          The Parents of the given layer.
	 */
	parents: function ( childLayer ) {
		var parents = aeq.arrayEx();
		var layer = childLayer;
		while ( layer.parent !== null ) {
			parents.push( layer.parent );
			layer = layer.parent;
		}
		return parents;
	},

	/**
	 * Gets all [parents]{@link aeq.layer.parents} and
	 * [all children]{@link aeq.layer.allChildren} of the given layers.
	 * @method
	 * @memberof aeq.layer
	 * @param  {Layer} root The Layer to get the parents and children from
	 * @return {aeq.arrayEx}    The layer's parents and children.
	 */
	relatedLayers: function ( root ) {
		var parents = aeq.layer.parents( root );
		var children = aeq.layer.allChildren( root );
		var all = parents.push.apply( parents, children );
		return aeq.arrayEx( all );
	}
});

// Function aliases

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
 * [project description]
 * @namespace aeq.project
 * @memberof aeq
 * @type {Object}
 */
aeq.project = aeq.extend({}, {
	toString: function () {
		return '[object aeq.project]';
	},

	// Function for extending the object using objects
	extend: aeq.extend,

	/**
	 * Gets all footage items in project
	 * @method
	 * @memberof aeq.project
	 * @param  {FolderItem|string} [parentFolder=app.project.root] Folder to search
	 * in by name or item, or root if undefined
	 * @return {Item[]} ArrayEx of project footage items
	 */
	getFootage: function ( parentFolder ) {
		var items = aeq.getItems( parentFolder );

		return items.filter( aeq.isFootageItem );
	},

	/**
	 * Gets all folders within target folder, or root
	 * @method
	 * @memberof aeq.project
	 * @param  {FolderItem|string} [parentFolder=app.project.root] Folder to search
	 * in by name or item, or root if undefined
	 * @return {FolderItem[]}      ArrayEx of folder items
	 */
	getFolders: function ( parentFolder ) {
		var folders = aeq.getItems( parentFolder );

		return folders.filter( aeq.isFolderItem );
	},

	/**
	 * Find folder by name in target folder.
	 * @method
	 * @memberof aeq.project
	 * @param  {string} name       Folder name to find.
	 * @param  {FolderItem|string} [parentFolder=app.project.root]
	 * Folder to search in by name or item, or root if undefined.
	 * @return {FolderItem|null}   FolderItem with the name. Or `null` if not found.
	 */
	findFolder: function ( name, parentFolder ) {
		var folders = aeq.project.getFolders( parentFolder );

		var folder = aeq.filter( folders, function ( folder ) {
			return folder.name === name;
		});
		if ( folder.length ) {
			return folder[0];
		}
		return null;
	},

	/**
	 * Gets folder item, or null if can't find
	 * @method
	 * @memberof aeq.project
	 * @param  {FolderItem|string} folder Folder to get by name or item, or root if undefined
	 * @param  {FolderItem|string} [parentFolder=app.project.root]
	 * Parent folder to search in by name or item, or root if undefined
	 * @return {FolderItem|null}   Target folder item, or null
	 */
	getFolder: function ( folder, parentFolder ) {
		if ( aeq.isFolderItem( folder ) ) {
			return folder;
		}

		if ( aeq.isString( folder ) ) {
			return aeq.project.findFolder( folder, parentFolder );
		}

		return null;
	},

	/**
	 * Gets all folder items that are selected
	 * @method
	 * @memberof aeq.project
	 * @return {FolderItem[]} ArrayEx of all selected folder items
	 */
	getSelectedFolders: function () {
		return aeq.filter( app.project.selection, aeq.isFolderItem );
	},

	/**
	 * Gets all comp items that are selected
	 * @method
	 * @memberof aeq.project
	 * @return {CompItem[]} ArrayEx of all selected comp items
	 */
	getSelectedComps: function () {
		return aeq.filter( app.project.selection, aeq.isComp );
	},

	/**
	* Gets selected comps, or all comps if none is selected.
	 * @method
	 * @memberof aeq.project
	 * @return {aeq.arrayEx} Array of Comp objects
	 */
	getSelectedCompsOrAll: function ( ) {
		if ( aeq.isEmpty( app.project.selection ) ) {
			return aeq.getCompositions();
		}

		return aeq.project.getSelectedComps();
	},

	/**
	 * Gets all footage items that are selected
	 * @method
	 * @memberof aeq.project
	 * @return {Item[]} ArrayEx of all selected footage items
	 */
	getSelectedFootage: function () {
		return aeq.filter( app.project.selection, aeq.isFootageItem );
	},

	/**
	 * Gets folder item, or creates it if can't find
	 * @method
	 * @memberof aeq.project
	 * @param  {FolderItem|string} folder Folder to get by name or item, or root if undefined
	 * @param  {FolderItem|string} [parentFolder=app.project.root]
	 * Parent folder to search in by name or item, or root if undefined
	 * @return {FolderItem}        Target folder item
	 */
	getOrCreateFolder: function ( folder, parentFolder ) {
		if ( aeq.isNullOrUndefined( parentFolder ) ) {
			parentFolder = app.project.rootFolder;
		} else {
			parentFolder = aeq.project.getOrCreateFolder( parentFolder );
		}

		var foundFolder = aeq.project.getFolder( folder, parentFolder );

		if ( aeq.isNullOrUndefined( foundFolder ) ) {
			return parentFolder.items.addFolder( folder );
		}

		return foundFolder;
	},

	/**
	 * Gets folder item, or root if undefined
	 * @method
	 * @memberof aeq.project
	 * @param  {FolderItem|string} [folder=app.project.root]
	 * Folder to get by name or item, or root if undefined
	 * @return {FolderItem}        Target folder item
	 */
	getFolderOrRoot: function ( folder ) {
		folder = aeq.project.getFolder( folder );

		if ( aeq.isNullOrUndefined( folder ) ) {
			return app.project.rootFolder;
		}

		return folder;
	},

	/**
	 * Saves current AEP to target path, or prompts user if no path
	 * @method
	 * @memberof aeq.project
	 * @param  {string} [path] Path to save AEP to
	 * @return {File}          File object of AEP
	 */
	save: function ( path ) {
		if ( !path ) {
			return app.project.save();
		}

		var file = aeq.getFileObject( path );

		if ( file.exists ) {
			if ( !confirm( 'File exists! Overwrite?' ) ) {
				return null;
			}
		}

		return app.project.save( file );
	},

	/**
	 * Saves current AEP to current path
	 * @method
	 * @memberof aeq.project
	 * @return {File} File object of AEP
	 */
	quickSave: function () {
		var file = aeq.app.getAEP();
		return app.project.save( file );
	},

	/**
	 * Imports a file into After Effects.
	 * @method
	 * @memberof aeq.project
	 * @param  {string|File} file    The file to import.
	 * @param  {string|FolderItem} [folder=app.project]  The folder where the
	 * imported item will be placed.
	 * @param  {object} [options] options for importOptions.
	 * @param  {boolean} [options.sequence=false] `true` if file should import as sequence.
	 * @return {Item}    The imported item
	 */
	importFile: function ( file, folder, options ) {
		var proj = app.project,
			newItem;

		var newFile = aeq.getFile( file );

		if ( !aeq.isFile( newFile ) ) {
			throw new Error( file + ' is not a valid file!' );
		}

		if ( aeq.isNullOrUndefined( folder ) ) {
			folder = app.project.rootFolder;
		} else {
			folder = aeq.project.getOrCreateFolder( folder );
		}

		options = setDefault( options, {});

		var iO = new ImportOptions( newFile );

		if ( options.sequence === true ) {
			iO.sequence = true;
		}

		try {
			newItem = proj.importFile( iO );
		} catch ( e ) {
			throw new Error( 'Can\'t import file ' + newFile.name + '\n' + String( e ) );
		}

		if ( newItem.duration * newItem.frameRate === 1 ) {
			newItem.replace( file );
		}

		newItem.parentFolder = folder;
		newItem.selected = false;

		return newItem;
	},

	/**
	 * Like {@link aeq.project.importFile}, but without the extra.
	 * @method
	 * @memberof aeq.project
	 * @param  {File} file    File object to import
	 * @param  {object} [options] options for importOptions
	 * @param  {boolean} [options.sequence=false] `true` if file should import as sequence
	 * @return {Item}    The imported item
	 */
	simpleImportFile: function ( file, options ) {
		var iO = new ImportOptions( file );

		options = setDefault( options, {});
		if ( options.sequence === true ) {
			iO.sequence = true;
		}

		var newItem;
		try {
			newItem = app.project.importFile( iO );
		} catch ( e ) {
			throw new Error( 'Can\'t import file ' + file.name + '\n' + String( e ) );
		}

		return newItem;
	},

	/**
	 * Imports a sequence by file object or path
	 * @method
	 * @memberof aeq.project
	 * @param  {File|string} file    File or path of sequence to import
	 * @param  {FolderItem} [folder] Folder to import items to
	 * @return {Item}                Imported sequence
	 */
	importSequence: function ( file, folder ) {
		return aeq.importFile( file, folder, { sequence: true });
	},

	/**
	 * Imports array of files or paths to target folder
	 * @method
	 * @memberof aeq.project
	 * @param  {File[]|string[]} fileArray        Array of files or paths to import
	 * @param  {FolderItem} [folder]              Folder to import items to
	 * @param  {object} [options]                 options for importOptions.
	 * @param  {boolean} [options.sequence=false] `true` if file should import as sequence.
	 * @return {Items[]}                          ArrayEx of imported items
	 */
	importFiles: function ( fileArray, folder, options ) {
		var importedItems = aeq.arrayEx();

		aeq.forEach( fileArray, function ( file ) {
			var item = aeq.importFile( file, folder, options );
			importedItems.push( item );
		});

		return importedItems;
	},

	/**
	 * Moves item(s) to specified folder
	 * @method
	 * @memberof aeq.project
	 * @param  {Item|Item[]} items Item or array of items
	 * @param  {FolderItem} folder Folder to move item(s) to
	 */
	moveToFolder: function ( items, folder ) {
		folder = aeq.project.getFolder( folder );

		if ( !aeq.isArray( items ) ) items = [ items ];

		aeq.forEach( items, function ( item ) {
			item.parentFolder = folder;
			item.selected = false;
		});
	},

	/**
	 * Reduces current project to only comps that are queued
	 * @method
	 * @memberof aeq.project
	 * @return {CompItem[]|null} Array of queued comps, or null
	 */
	reduceToQueuedComps: function () {
		var queuedComps = aeq.renderqueue.getQueuedComps();

		if ( queuedComps.length === 0 ) return null;

		app.project.reduceProject( queuedComps );

		return queuedComps;
	}
});

// Function aliases
aeq.save = aeq.project.save;
aeq.quickSave = aeq.project.quickSave;
aeq.importFile = aeq.project.importFile;
aeq.importFiles = aeq.project.importFiles;
aeq.importSequence = aeq.project.importSequence;

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
 * Module for dealing with Property objects.
 * @namespace aeq.property
 * @memberof aeq
 * @type {Object}
 */
aeq.property = aeq.extend({}, {
	toString: function () {
		return '[object aeq.property]';
	},

	// Function for extending the prototype using objects
	extend: aeq.extend,

	/**
	 * Returns the property value type of a Property as a string.
	 * @method
	 * @memberof aeq.property
	 * @param  {Property} property The property to get the value type of.
	 * @return {string}          The property value type, on of:
	 *
	 * - `NO_VALUE`: Stores no data.
	 * - `ThreeD_SPATIAL`: Array of three floating-point positional values.
	 *    For example, an Anchor Point value might be `[10.0, 20.2, 0.0]`
	 * - `ThreeD`: Array of three floating-point quantitative values.
	 *    For example, a Scale value might be `[100.0, 20.2, 0.0]`
	 * - `TwoD_SPATIAL`: Array of 2 floating-point positional values.
	 *    For example, an Anchor Point value might be `[5.1, 10.0]`
	 * - `TwoD`: Array of 2 floating-point quantitative values.
	 *    For example, a Scale value might be `[5.1, 100.0]`
	 * - `OneD`: A floating-point value.
	 * - `COLOR`:Array of 4 floating-point values, in the range `[0.0..1.0]`.
	 *    For example, `[0.8, 0.3, 0.1, 1.0]`
	 * - `CUSTOM_VALUE`: Custom property value, such as the Histogram
	 *    property for the Levels effect.
	 * - `MARKER`: MarkerValue object
	 * - `LAYER_INDEX`: Integer; a value of `0` means no layer.
	 * - `MASK_INDEX`: Integer; a value of `0` means no mask.
	 * - `SHAPE`: Shape object
	 * - `TEXT_DOCUMENT`: TextDocument object
	 *
	 * @example <caption>Returns "ThreeD_SPATIAL"</caption>
	 * aeq.property.valueType( layer.Transform.Position )
	 */
	valueType: function ( property ) {
		return aeq.valueInObject( property.propertyValueType || property, PropertyValueType );
	},

	/**
	 * Returns the property type as a string.
	 * @method
	 * @memberof aeq.property
	 * @param  {Property} property The property to get the type of
	 * @return {string}          The property type, on of:
	 *
	 * - `PROPERTY`: A single property such as position or zoom.
	 * - `INDEXED_GROUP`: A property group whose members have an editable name
	 *   and an index. Effects and masks are indexed groups. For example,
	 *   the masks property of a layer refers to a variable number of individual
	 *   masks by index number.
	 * - `NAMED_GROUP`: A property group in which the member names are not
	 *    editable. Layers are named groups.
	 */
	type: function ( property ) {
		return aeq.valueInObject( property.propertyType || property, PropertyType );
	},

	/**
	 * Gets the layer the given property is contained in.
	 * @method
	 * @memberof aeq.property
	 * @param  {Property} property The Property to get layer from.
	 * @return {Layer}          The containing Layer object.
	 */
	getLayer: function ( property ) {
		var depth = property.propertyDepth;
		return property.propertyGroup( depth );
	}
});

// Function aliases
aeq.prop = aeq.property;

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
 * Module for dealing with the render queue.
 * @namespace aeq.renderqueue
 * @memberof aeq
 * @type {Object}
 */
aeq.renderqueue = aeq.extend({}, {
	toString: function () {
		return '[object aeq.RenderQueue]';
	},

	// Function for extending the object using objects
	extend: aeq.extend,

	/**
	 * Add a project item to the render queue.
	 * @method
	 * @memberof aeq.renderqueue
	 * @param  {Item|CompItem} item The item to add to the queue.
	 * @return {RenderQueueItem}      The added RenderQueueItem.
	 */
	queue: function ( item ) {
		return app.project.renderQueue.items.add( item );
	},

	/**
	 * Unqueues all items in the render queue
	 * @method
	 * @memberof aeq.renderqueue
	 */
	unqueueAll: function () {
		var items = aeq.renderqueue.getRQItems();

		items.forEach( function ( item ) {
			if ( item.status !== RQItemStatus.USER_STOPPED &&
				item.status !== RQItemStatus.ERR_STOPPED &&
				item.status !== RQItemStatus.RENDERING &&
				item.status !== RQItemStatus.DONE ) {
				item.render = false;
			}
		});
	},

	/**
	 * Removes all items from the render queue.
	 * @method
	 * @memberof aeq.renderqueue
	 */
	clear: function () {
		var items = aeq.renderqueue.getRQItems();
		items = items.reverse();
		items.forEach( function ( item ) {
			item.remove();
		});
	},

	/**
	 * Check if an item in the render queue is queued for rendering.
	 * @method
	 * @memberof aeq.renderqueue
	 * @param  {RenderQueueItem} rqItem The item to check.
	 * @return {boolean}        `true` if the item is going to be rendered.
	 */
	isQueued: function ( rqItem ) {
		return rqItem.status === RQItemStatus.QUEUED;
	},

	/**
	 * Gets all `RenderQueueItem`s in the render queue which are queued for
	 * rendering.
	 * @method
	 * @memberof aeq.renderqueue
	 * @return {aeq.arrayEx} ArrayEx of `RenderQueueItem`s
	 */
	getQueuedItems: function () {
		var items = aeq.renderqueue.getRQItems();
		return items.filter( function ( item ) {
			return aeq.renderqueue.isQueued( item );
		});
	},

	/**
	 * Gets all `CompItem`s that are queued for rendering.
	 * @method
	 * @memberof aeq.renderqueue
	 * @return {aeq.arrayEx} ArrayEx of `CompItem`s
	 */
	getQueuedComps: function () {
		var queuedItems = aeq.renderqueue.getQueuedItems();
		var compIDs = {};
		var comps = [];

		queuedItems.forEach( function ( item ) {
			var comp = item.comp;
			var compID = comp.id;

			if ( compIDs[compID] === undefined ) {
				compIDs[compID] = true;
				comps.push( comp );
			}
		});

		return aeq.arrayEx( comps );
	},

	/**
	 * Gets all render queue items.
	 * @method
	 * @memberof aeq.renderqueue
	 * @return {aeq.arrayEx} ArrayEx of `RenderQueueItem`s
	 */
	getRQItems: function () {
		return aeq.arrayEx( aeq.normalizeCollection( app.project.renderQueue.items ) );
	},

	/**
	 * Gets all `compItem`s added to the render queue.
	 * @method
	 * @memberof aeq.renderqueue
	 * @return {aeq.arrayEx} ArrayEx of CompItems in the render queue.
	 */
	getRQComps: function () {
		var rqItems = aeq.renderqueue.getRQItems();
		var compIDs = {};
		var comps = [];

		rqItems.forEach( function ( item ) {
			var comp = item.comp;
			var compID = comp.id;

			if ( compIDs[compID] === undefined ) {
				compIDs[compID] = true;
				comps.push( comp );
			}
		});

		return aeq.arrayEx( comps );
	},

	/**
	 * Gets settings from a `RenderQueueItem` or `OutputModule`.
	 * @see [OutputModule.getSettings]{@link
	 * http://docs.aenhancers.com/outputmodule/#outputmodule-getsettings}
	 * @see [RenderQueueItem.getSettings]{@link
	 * http://docs.aenhancers.com/renderqueueitem/#renderqueueitem-getsettings}
	 * @method
	 * @memberof aeq.renderqueue
	 * @param  {RenderQueueItem|OutputModule} renderItem The object to get settings
	 * from.
	 * @return {Object}        Object with render settings as strings.
	 */
	getSettings: function ( renderItem ) {
		return renderItem.getSettings( GetSettingsFormat.STRING );
	},

	/**
	 * Checks if the folder where the output module is rendering to exists, if
	 * it does not exist, it gets created.
	 * @method
	 * @memberof aeq.renderqueue
	 * @param  {OutputModule} outputModule The output module to check the render
	 *                                     path of.
	 */
	ensureRenderPathExists: function ( outputModule ) {
		aeq.app.ensureSecurityPrefEnabled();
		aeq.file.ensureFolderExists( outputModule.file.parent );
	},

	/**
	 * Checks if the given output module template exists.
	 * @method
	 * @memberof aeq.renderqueue
	 * @param  {string} templateName Name of the template to check if exists.
	 * @return {boolean}             `true` if the output module template exists.
	 */
	omTemplateExists: function ( templateName ) {
		var tempComp = aeq.comp.create();
		var tempRQItem = aeq.renderqueue.queue( tempComp );
		var templates = aeq.arrayEx( tempRQItem.outputModule( 1 ).templates );

		var templateExists = templates.some( function ( template ) {
			return template === templateName;
		});

		tempRQItem.remove();
		tempComp.remove();
		return templateExists;
	},

	/**
	 * Checks if the given render queue template exists.
	 * @method
	 * @memberof aeq.renderqueue
	 * @param  {string} templateName Name of the template to check.
	 * @return {boolean}             `true` if the template exists.
	 */
	rqTemplateExists: function ( templateName ) {
		var tempComp = aeq.comp.create();
		var tempRQItem = aeq.renderqueue.queue( tempComp );
		var templates = aeq.arrayEx( tempRQItem.templates );

		var templateExists = templates.some( function ( template ) {
			return template === templateName;
		});

		tempRQItem.remove();
		tempComp.remove();
		return templateExists;
	}
});

// Function aliases

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
 * [settings description]
 * @namespace aeq.settings
 * @memberof aeq
 * @type {Object}
 */
aeq.settings = aeq.extend({}, {
	toString: function () {
		return '[object aeq.settings]';
	},

	// Function for extending the object using objects
	extend: aeq.extend,

	/**
	 * Saves setting if present, else gets setting
	 * @memberof aeq.settings
	 * @method
	 * @param  {string} sectionName Settings section name
	 * @param  {string} keyName     Settings key name
	 * @param  {string} [value]     Settings value to save for section:key
	 * @return {aeq|string}         aeq or setting value of section:key
	 */
	setting: function ( sectionName, keyName, value ) {
		if ( value !== undefined ) {
			aeq.settings.save( sectionName, keyName, value );
			return aeq;
		}
		return aeq.settings.get( sectionName, keyName );
	},

	/**
	 * Initializes a setting, setting it if not present
	 * @memberof aeq.settings
	 * @method
	 * @param  {string} sectionName       Settings section name
	 * @param  {string} keyName           Settings key name
	 * @param  {string} value             Settings value to save for section:key
	 * @param  {bool} 	[overwrite=false] `true` to overwite if present
	 * @return {string}                   Setting value of section:key
	 */
	initSetting: function ( sectionName, keyName, value, overwrite ) {
		overwrite = setDefault( overwrite, false );

		if ( !aeq.settings.have( sectionName, keyName ) || overwrite ) {
			aeq.settings.save( sectionName, keyName, value );
		}

		return aeq.settings.get( sectionName, keyName );
	},

	/**
	 * Gets setting from section:key
	 * @method
	 * @memberof aeq.settings
	 * @param  {string} sectionName Settings section name
	 * @param  {string} keyName     Settings key name
	 * @return {string|undefined}   Value of saved setting, or undefined if blank
	 */
	get: function ( sectionName, keyName ) {
		if ( aeq.settings.have( sectionName, keyName ) ) {
			return app.settings.getSetting( sectionName, keyName );
		}
		return undefined;
	},

	/**
	 * Gets setting and returns as boolean value, or undefined if not boolean
	 * @method
	 * @memberof aeq.settings
	 * @param  {string} sectionName Settings section name
	 * @param  {string} keyName     Settings key name
	 * @return {boolean|undefined}  Saved setting as boolean
	 */
	getAsBool: function ( sectionName, keyName ) {
		var value = aeq.settings.get( sectionName, keyName );

		if ( value === 'true' ) {
			return true;
		} else if ( value === 'false' ) {
			return false;
		}

		return undefined;
	},

	/**
	 * Gets setting and returns as array
	 * @method
	 * @memberof aeq.settings
	 * @param  {string} sectionName Settings section name
	 * @param  {string} keyName     Settings key name
	 * @return {string[]|undefined} Saved setting as boolean
	 */
	getAsArray: function ( sectionName, keyName ) {
		return aeq.settings.get( sectionName, keyName ).split( ',' );
	},

	/**
	 * Gets setting and returns as float
	 * @method
	 * @memberof aeq.settings
	 * @param  {string} sectionName Settings section name
	 * @param  {string} keyName     Settings key name
	 * @return {number|undefined}   Saved setting as float
	 */
	getAsFloat: function ( sectionName, keyName ) {
		return parseFloat( aeq.settings.get( sectionName, keyName ) );
	},

	/**
	 * Gets setting and returns as int
	 * @method
	 * @memberof aeq.settings
	 * @param  {string} sectionName Settings section name
	 * @param  {string} keyName     Settings key name
	 * @return {number|undefined}   Saved setting as int
	 */
	getAsInt: function ( sectionName, keyName ) {
		return parseInt( aeq.settings.get( sectionName, keyName ) );
	},

	/**
	 * Checks whether setting has been saved / exists in file
	 * @method
	 * @memberof aeq.settings
	 * @param  {string} sectionName Settings section name
	 * @param  {string} keyName     Settings key name
	 * @return {boolean}            Whether the setting exists
	 */
	have: function ( sectionName, keyName ) {
		return app.settings.haveSetting( sectionName, keyName );
	},

	/**
	 * Saves setting
	 * @memberof aeq.settings
	 * @method
	 * @param  {string} sectionName Settings section name
	 * @param  {string} keyName     Settings key name
	 * @param  {string} value       Settings value to save for section:key
	 */
	save: function ( sectionName, keyName, value ) {
		app.settings.saveSetting( sectionName, keyName, value );
	},

	/**
	 * Checks whether object of key names have saved settings,
	 * returns object of saved values of this string
	 * @method
	 * @memberof aeq.settings
	 * @param  {string} sectionName Settings section name
	 * @param  {object} keyNames    Object of containing key names
	 * @return {object}             Object of fetched settings
	 */
	unpack: function ( sectionName, keyNames ) {
		var ret;

		// Argument keyNames can either be an array with keyNames or an object with
		// key: defaultValue pairs.
		ret = aeq.isObject( keyNames ) ? keyNames : {};

		aeq.forEach( keyNames, function ( keyName ) {
			if ( app.settings.haveSetting( sectionName, keyName ) ) {
				ret[keyName] = app.settings.getSetting( sectionName, keyName );
			}
		});

		return ret;
	}
});

// Function aliases
aeq.saveSetting = aeq.setSetting = aeq.settings.set = aeq.settings.save;
aeq.getSetting = aeq.settings.get;
aeq.getSettingAsBool = aeq.settings.getAsBool;
aeq.getSettingAsArray = aeq.settings.getAsArray;
aeq.getSettingAsFloat = aeq.settings.getAsFloat;
aeq.getSettingAsInt = aeq.settings.getAsInt;
aeq.haveSetting = aeq.settings.have;
aeq.unpackSettings = aeq.loadSettings = aeq.settings.load = aeq.settings.unpack;

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
 * @namespace snippet
 * @memberof aeq
 * @type {object}
 */
aeq.snippet = aeq.extend({}, {
	toString: function () {
		return '[object aeq.snippet]';
	},

	// Function for extending the object using objects
	extend: aeq.extend,

	/**
	 * Gets the active comp and alerts the user if no comp is open. It then
	 * creates an undo group and executes a callback function with the comp as
	 * the first argument.
	 * @function activeComp
	 * @memberof aeq.snippet
	 * @param  {String}   undoGroup Name of the undo group
	 * @param  {function} callback  Function to execute that gets the active comp
	 *                              as the first argument
	 * @return {Boolean|Any}        `false` if the function is not executed
	 *         because no comp was selected. Else the value the `callback`
	 *         function returns is returned.
	 */
	activeComp: function ( undoGroup, callback ) {
		var comp = getCompWithAlert();
		if ( comp === null ) return false;
		return aeq.createUndoGroup( undoGroup, callback, [ comp ] );
	},

	/**
	 * Gets the selected layers in the active comp and alerts the user if no comp
	 * is open, or if no layer is selected. It then creates an undo group and
	 * executes a callback function with the layers as the first argument, and the
	 * comp as the second argument.
	 * @memberof aeq.snippet
	 * @param  {String}   undoGroup Name of the undo group
	 * @param  {function} callback  Function to execute that gets the selected
	 * layers as the first argument, and the comp as the second argument.
	 * @return {Boolean|Any}        `false` if the function is not executed because
	 * no comp or layer was selected. Else the value the `callback` function
	 * returns is returned.
	 */
	selectedLayers: function ( undoGroup, callback ) {
		var comp = getCompWithAlert();
		if ( comp === null ) return false;
		var layers = getSelectedLayersWithAlert( comp );
		if ( layers === null ) return false;

		layers = aeq.arrayEx( layers );
		return aeq.createUndoGroup( undoGroup, callback, [ layers, comp ] );
	},

	/**
	 * Gets the selected layers or all layers if no layers are selected, in the
	 * active comp. Alerts the user if no comp is open. It then creates an undo
	 * group and executes a callback function with the layers as the first
	 * argument, and the comp as the second argument.
	 * @memberof aeq.snippet
	 * @param  {String}   undoGroup Name of the undo group.
	 * @param  {function} callback  Function to execute that gets the selected
	 * layers in an ArrayEx as the first argument, and the comp as the second
	 * argument.
	 * @return {Boolean|Any}        `false` if the function is not executed because
	 * no comp was open. Else the value the `callback` function is returned.
	 */
	selectedLayersOrAll: function ( undoGroup, callback ) {
		var comp = getCompWithAlert();
		if ( comp === null ) return false;
		var layers = aeq.getSelectedLayersOrAll( comp );

		layers = aeq.arrayEx( layers );
		return aeq.createUndoGroup( undoGroup, callback, [ layers, comp ] );
	},

	/**
	 * Gets the selected properties in the active comp and alerts the user if no
	 * comp is open, or if no property is selected. It then creates an undo group
	 * and executes a callback function with the properties as the first argument,
	 * and the comp as the second argument.
	 * @memberof aeq.snippet
	 * @param  {String}   undoGroup Name of the undo group
	 * @param  {function} callback  Function to execute that gets the selected
	 * properties in an ArrayEx as the first argument, and the comp as the second
	 * argument.
	 * @return {Boolean|Any}        `false` if the function is not executed.
	 * because no comp or property was selected. Else the value the `callback`
	 * function is returned.
	 */
	selectedProperties: function ( undoGroup, callback ) {
		var comp = getCompWithAlert();
		if ( comp === null ) return false;
		var props = getSelectedPropertiesWithAlert( comp );
		if ( props === null ) return false;

		props = aeq.arrayEx( props );
		return aeq.createUndoGroup( undoGroup, callback, [ props, comp ] );
	},

	/**
	 * Loops through the selected layers in the active comp. Alerts the user if no
	 * comp is open, or no layer is selected. It then creates an undo group
	 * and executes a callback function for each of the layers.
	 * @memberof aeq.snippet
	 * @param  {String}          undoGroup Name of the undo group.
	 * @param  {forEachArrayCallback} callback  Function to execute for each layer.
	 * @return {Boolean|ArrayEx} `false` if the function is not executed because
	 *         no comp was open or no layer selected. Else the layers array is
	 *         returned.
	 */
	forEachSelectedLayer: function ( undoGroup, callback ) {
		return aeq.snippet.selectedLayers( undoGroup, function ( layers ) {
			layers.forEach( callback );
			return layers;
		});
	},

	/**
	 * Loops through the selected layers or all layers if no layers are selected, in the
	 * active comp. Alerts the user if no comp is open. It then creates an undo group
	 * and executes a callback function for each of the layers.
	 * @memberof aeq.snippet
	 * @param  {String}          undoGroup Name of the undo group
	 * @param  {forEachArrayCallback} callback  Function to execute for each layer.
	 * @return {Boolean|ArrayEx}           `false` if the function is not executed
	 *                                     because no comp was open. Else
	 *                                     the layers array are returned.
	 */
	forEachSelectedLayerOrAll: function ( undoGroup, callback ) {
		return aeq.snippet.selectedLayersOrAll( undoGroup, function ( layers ) {
			layers.forEach( callback );
			return layers;
		});
	},

	/**
	 * Loops through the selected properties in the active comp. Alerts the user if no
	 * comp is open, or no properties is selected. It then creates an undo group
	 * and executes a callback function for each of the properties.
	 * @memberof aeq.snippet
	 * @param  {String}          undoGroup Name of the undo group
	 * @param  {forEachArrayCallback} callback  Function to execute for each property.
	 * @return {Boolean|ArrayEx}           `false` if the function is not executed
	 *                                     because no comp was open or no layer
	 *                                     selected. Else the property array
	 *                                     is returned.
	 */
	forEachSelectedProperty: function ( undoGroup, callback ) {
		return aeq.snippet.selectedProperties( undoGroup, function ( props ) {
			props.forEach( callback );
			return props;
		});
	},

	/**
	 * Used for setting the default value in functions. Returns the first argument
	 * is not undefined, else it returns `defaultVal`.
	 *
	 * If `defaultval` is a function, the function will run and its value returned.
	 *
	 * @method
	 * @param  {Any} value      The value to check
	 * @param  {Any} defaultVal The value to use if `value` is `undefined`
	 * @return {Any}            `value` if it is not `undefined`, else `defaultVal`
	 *
	 * @example
	 * function getCustomGreeting() {
	 *     return prompt( 'Enter your greeting!', 'Hello World!' )
	 * }
	 * function say( greeting ) {
	 *     a = aeq.setOrGetDefault( greeting, getCustomGreeting )
	 *     alert( a )
	 * }
	 */
	setOrGetDefault: function ( value, defaultVal ) {
		if ( typeof value !== 'undefined' ) {
			return value;
		}

		if ( typeof defaultVal === 'function' ) {
			return defaultVal();
		}

		return defaultVal;
	}
});

function getCompWithAlert() {
	var comp = aeq.getActiveComp();
	if ( comp === null ) {
		alert( 'No Comp selected' );
	}
	return comp;
}

function getSelectedLayersWithAlert( comp ) {
	if ( comp.selectedLayers.length === 0 ) {
		alert( 'No layers selected' );
		return null;
	}
	return comp.selectedLayers;
}

function getSelectedPropertiesWithAlert( comp ) {
	if ( comp.selectedProperties.length === 0 ) {
		alert( 'No properties selected' );
		return null;
	}
	return comp.selectedProperties;
}

// Function aliases


return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
 * Array with some extensions that mimics modern JavaScript.
 * @memberof aeq
 * @class
 * @param  {Array} arr The array object to extend. If not supplied, an empty
 *                     arrayEx will be returned.
 */

var arrayEx = {

	/**
	 * Loops through the elements in the array and executes a function.
	 * @memberof aeq.arrayEx
	 * @method
	 * @param  {forEachArrayCallback} callback Function to execute for each element
	 */
	forEach: function ( callback ) {
		var len = this.length;

		for ( var i = 0; i < len; i++ ) {
			callback( this[i], i, this );
		}
	},

	/**
	 * Loops through the elements in the array and returns `true` if callback
	 * returns true for any element
	 * @method
	 * @memberof aeq.arrayEx
	 * @param  {Function} callback Function to execute for each element
	 * @return {boolean}           Whether the function returned true for any
	 * element
	 */
	some: function ( callback ) {
		var len = this.length;

		for ( var i = 0; i < len; i++ ) {
			if ( callback( this[i], i, this ) ) {
				return true;
			}
		}

		return false;
	},

	/**
	 * Loops through the elements in the array and returns `true` if callback
	 * returns true for all elements
	 * @method
	 * @memberof aeq.arrayEx
	 * @param  {Function} callback Function to execute for each element
	 * @return {boolean}           Whether the function returned true for ALL
	 * elements
	 */
	every: function ( callback ) {
		var len = this.length;

		for ( var i = 0; i < len; i++ ) {
			if ( !callback( this[i], i, this ) ) {
				return false;
			}
		}

		return true;
	},

	/**
	 * Gets first element in array
	 * @method
	 * @memberof aeq.arrayEx
	 * @return {any} First element in array
	 */
	first: function () {
		if ( this.length === 0 ) {
			throw new Error( 'There are no items in this array' );
		}

		return this[0];
	},

	/**
	 * Returns array element that triggers callback === true
	 * @method
	 * @memberof aeq.arrayEx
	 * @param  {Function} callback Function to execute for each element
	 * @param  {any}      [def]    Default element to return if target be found
	 * @return {any}               Array element that triggered callback, or default
	 */
	find: function ( callback, def ) {
		var len = this.length;

		for ( var i = 0; i < len; i++ ) {
			if ( callback( this[i], i, this ) ) {
				return this[i];
			}
		}

		return def;
	},

	/**
	 * Returns index of array element that triggers callback === true
	 * @method
	 * @memberof aeq.arrayEx
	 * @param  {Function} callback Function to execute for each element
	 * @return {any}               Index of array element that triggered callback, or -1
	 */
	findIndex: function ( callback ) {
		var len = this.length;
		for ( var i = 0; i < len; i++ ) {
			if ( callback( this[i], i, this ) ) {
				return i;
			}
		}

		return -1;
	},

	/**
	 * Runs callback on each element, and returns a new arrayEx of elements that
	 * trigger callback === true
	 * @method
	 * @memberof aeq.arrayEx
	 * @param  {Function} callback Function to execute for each element
	 * @return {aeq.arrayEx}       ArrayEx of filtered elements
	 */
	filter: function ( callback ) {
		var filteredArr = [];
		var len = this.length;

		for ( var i = 0; i < len; i++ ) {
			if ( callback( this[i], i, this ) ) {
				filteredArr.push( this[i] );
			}
		}

		return aeq.arrayEx( filteredArr );
	},

	/**
	 * Returns index of searchElement in an array, or -1 if not found
	 * @method
	 * @memberof aeq.arrayEx
	 * @param  {any}    searchElement Element to find in arrayEx
	 * @param  {number} [fromIndex=0] Index to start searching from, or 0 if not passed
	 * @return {number}               `-1` if element is not found, else index number
	 */
	indexOf: function ( searchElement, fromIndex ) {
		var k;

		// 1. Let o be the result of calling ToObject passing
		//    the this value as the argument.
		if ( this === null ) {
			throw new TypeError( '"this" is null or not defined' );
		}

		var o = Object( this );

		// 2. Let lenValue be the result of calling the Get
		//    internal method of o with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = o.length >>> 0;

		// 4. If len is 0, return -1.
		if ( len === 0 ) {
			return -1;
		}

		// 5. If argument fromIndex was passed let n be
		//    ToInteger(fromIndex); else let n be 0.
		var n = +fromIndex || 0;

		if ( Math.abs( n ) === Infinity ) {
			n = 0;
		}

		// 6. If n >= len, return -1.
		if ( n >= len ) {
			return -1;
		}

		// 7. If n >= 0, then Let k be n.
		// 8. Else, n<0, Let k be len - abs(n).
		//    If k is less than 0, then let k be 0.
		k = Math.max( n >= 0 ? n : len - Math.abs( n ), 0 );

		// 9. Repeat, while k < len
		while ( k < len ) {
			// A. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the
			//    HasProperty internal method of o with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			//    i.  Let elementK be the result of calling the Get
			//        internal method of o with the argument ToString(k).
			//   ii.  Let same be the result of applying the
			//        Strict Equality Comparison Algorithm to
			//        searchElement and elementK.
			//  iii.  If same is true, return k.
			if ( k in o && o[k] === searchElement ) {
				return k;
			}
			k++;
		}
		return -1;
	},

	/**
	 * Creates a new array with the results of calling a provided function on every
	 * element in the calling array
	 * @method
	 * @memberof aeq.arrayEx
	 * @param  {Function} callback Function to execute for each element
	 * @return {aeq.arrayEx}       A new array with each element being the result
	 * of the callback function
	 * @see [Array.prototype.map()]{@link
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map/}
	 * for more info
	 */
	map: function ( callback ) {
		var selectedArr = [];
		var len = this.length;

		for ( var i = 0; i < len; i++ ) {
			selectedArr.push( callback( this[i], i, this ) );
		}

		return aeq.arrayEx( selectedArr );
	},

	/**
	 * Groups an array by some condition as determined by each element
	 * @method
	 * @memberof aeq.arrayEx
	 * @param  {Function} callback Function to determine the key to group by
	 * @return {object}   An object whose keys are the result of callback and each
	 * value is an array of elements matching key
	 */
	groupBy: function ( callback ) {
		var obj = {};
		var len = this.length;

		for ( var i = 0; i < len; i++ ) {
			var key = callback( this[i], i, this ) || 'undefined';
			var arr = obj[key] || [];

			arr.push( this[i] );

			obj[key.toString()] = arr;
		}

		return obj;
	},

	/**
	 * Inserts an element into arrayEx at specified index
	 * @method
	 * @memberof aeq.arrayEx
	 * @param  {any}    insert Element to insert
	 * @param  {number} index  Index to insert element at
	 */
	insertAt: function ( insert, index ) {
		this.splice( index, 0, insert );
	},

	/**
	 * Sets or gets an attribute value for all objects in the array. When getting a
	 * value, it only returns the valure from the first object.
	 * @method
	 * @memberof aeq.arrayEx
	 * @param {string} attributeName  The name of the attribute to get or set.
	 * @param  {Any}    [newValue]    The value to set. If not given, will only get
	 *                                the value of the first object.
	 * @return {Any}                  when getting, the value of the attribute.
	 *                                When setting, `undefined`.
	 * @see aeq.attr
	 */
	attr: function () {
		// Add this array object to the beginning of arguments
		[].unshift.call( arguments, this );
		return aeq.attr.apply( this, arguments );
	}
};

aeq.arrayEx = function ( arr ) {
	arr = setDefault( arr, [] );

	if ( arr._init ) return arr;

	/**
	 * Used to check if array is already extended.
	 * @memberof aeq.arrayEx
	 * @private
	 * @type {Boolean}
	 * @default
	 */
	arr._init = true;

	/**
	 * @memberof aeq.arrayEx
	 * @private
	 * @type {Boolean}
	 * @default
	 */
	arr.isAeq = true;

	aeq.extend( arr, arrayEx );
	return arr;
};

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
 * Converts a CompItem into an aeq.Comp object
 * @memberof aeq
 * @class
 * @param  {CompItem} comp CompItem to turn into aeq.Comp object
 * @return {aeq.Comp} aeq.Comp object of CompItem
 */
aeq.Comp = function ( comp ) {
	if ( comp instanceof aeq.Comp ) {
		return comp;
	}
	if ( this instanceof aeq.Comp ) {
		this.comp = comp;
	} else {
		return new aeq.Comp( comp );
	}
};

aeq.Comp.prototype = {
	isAeq: true,

	toString: function () {
		return '[object aeq.Comp]';
	},

	// Function for extending the prototype using objects
	extend: aeq.extend,

	/**
	 * Get the original object
	 * @method
	 * @instance
	 * @return {CompItem} Native Comp object
	 */
	get: function () {
		return this.comp;
	},

	/**
	 * Runs a function on each layer in aeq.Comp object
	 * @method
	 * @instance
	 * @param  {Function} callback Function to run on each layer in aeq.Comp object
	 */
	forEachLayer: function ( callback ) {
		var length = this.comp.numLayers,
			i = 1;

		for ( ; i <= length; i++ ) {
			callback( this.comp.layer( i ), i, this );
		}
	}
};

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
 * Converts a Key into an aeq.Key object
 * @memberof aeq
 * @class
 * @param  {Property} property Property to find key on
 * @param  {number}   index    The index of the key
 * @return {aeq.Key}           aeq.Key object
 */
aeq.Key = function ( property, index ) {
	if ( this instanceof aeq.Key ) {
		if ( property instanceof aeq.Property ) {
			property = property.get();
		}

		// Check if index is valid
		if ( index <= 0 || index > property.numKeys ) {
			throw new Error( 'Index ' + index + ' out of range 1-' + property.numKeys );
		}

		this.property = property;
		this.index = index;
		this.originalTime = this.getTime();
	} else {
		return new aeq.Key( property, index );
	}
};

aeq.Key.prototype = {
	isAeq: true,

	toString: function () {
		return '[object aeq.Key]';
	},

	// Function for extending the prototype using objects
	extend: aeq.extend,

	// Used to check if the key index is the correct for refrensing
	// TODO: consider not checking this in every function or find better way to do this
	checkKey: function () {
		// Check if index is in range and that key at that index is at correct time
		if ( this.index <= this.property.numKeys && this.getTime() === this.originalTime ) {
			return; // If it is, then the index is still correct
		}

		// Get the keyIndex nearest to the keyTime
		var newIndex = this.property.nearestKeyIndex( this.originalTime );

		// The time of the nearest keyIndex could be something else if the original key
		// was deleted, so we need to check it
		if ( this.property.keyTime( newIndex ) === this.originalTime ) {
			this.index = newIndex;
		} else {
			throw new Error( 'Original key has been deleted/moved' );
		}
	},

	// Need two time functions because `this.time` relies on checkKey
	/**
	 * Gets comp time of current key
	 * @instance
	 * @method
	 * @return {number} Key time of current key, in seconds
	 */
	getTime: function () {
		return this.property.keyTime( this.index );
	},

	/**
	 * Interpolation type object
	 * @typedef  {object} InterpolationType
	 * @property {KeyframeInterpolationType} inType  Interpolation for keyIn
	 * @property {KeyframeInterpolationType} outType Interpolation for keyOut
	 */

	/**
	 * @typedef {object} KeyframeInterpolationType
	 * @property {number} LINEAR
	 * @property {number} BEZIER
	 * @property {number} HOLD
	 */

	/**
	 * Gets or sets interpolation type of current key
	 * @method
	 * @instance
	 * @param  {KeyframeInterpolationType} [inType]  In KeyframeInterpolationType
	 * enumerated value to set
	 * @param  {KeyframeInterpolationType} [outType] Out KeyframeInterpolationType
	 * enumerated value to set
	 * @return {InterpolationType|boolean}         Object of In/Out Interp types,
	 * or true/false if can/can't set type
	 */
	interpolationType: function ( inType, outType ) {
		this.checkKey();

		// Return current value if no arguments
		if ( arguments.length === 0 ) {
			return {
				inType: this.property.keyInInterpolationType( this.index ),
				outType: this.property.keyOutInterpolationType( this.index )
			};
		}

		// If arguments, set new value

		// Check if arguments is a value returned from this function
		if ( outType === undefined && inType.outType ) {
			outType = inType.outType;
		}
		if ( inType.inType ) {
			inType = inType.inType;
		}

		// Use strings as a shorthand for KeyframeInterpolationType.TYPE
		if ( aeq.isString( inType ) ) {
			inType = KeyframeInterpolationType[inType];
		}

		if ( outType && aeq.isString( outType ) ) {
			outType = KeyframeInterpolationType[outType];

			// If outType is not defined the inType is used (standard behaviour)
		} else if ( outType === undefined ) {
			outType = inType;
		}

		// Check that the value is valid
		// TODO: should this be skipped and just throw error?
		if ( !this.property.isInterpolationTypeValid( inType ) ||
			( outType && !this.property.isInterpolationTypeValid( outType ) ) ) {
			return false;
		}

		this.property.setInterpolationTypeAtKey( this.index, inType, outType );
		return true;
	},

	/**
	 * SpatialTangent type object
	 * @typedef  {object} SpatialTangent
	 * @property {KeyframeSpatialTangent} inTangent  Tangent for keyIn
	 * @property {KeyframeSpatialTangent} outTangent Tangent for keyOut
	 */

	/**
	 * @typedef {number[]} KeyframeSpatialTangent
	 * @property {number} xSpatialTangent
	 * @property {number} ySpatialTangent
	 * @property {number} [zSpatialTangent]
	 */

	/**
	 * Gets or sets in/out spatial tangents of current key
	 * @method
	 * @instance
	 * @param  {KeyframeSpatialTangent} [inType]  In KeyframeSpatialTangent enumerated value to set
	 * @param  {KeyframeSpatialTangent} [outType] Out KeyframeSpatialTangent enumerated value to set
	 * @return {SpatialTangent}                 Object of In/Out spatial tangent values
	 */
	spatialTangent: function ( inType, outType ) {
		this.checkKey();

		// Return current value if no arguments
		if ( arguments.length === 0 ) {
			return {
				inTangent: this.property.keyInSpatialTangent( this.index ),
				outTangent: this.property.keyOutSpatialTangent( this.index )
			};
		}

		// Check if arguments is a value returned from this function
		if ( outType === undefined && inType.outTangent ) {
			outType = inType.outTangent;
		}
		if ( inType.inTangent ) {
			inType = inType.inTangent;
		}

		this.property.setSpatialTangentsAtKey( this.index, inType, outType );
	},

	/**
	 * TemporalEase type object
	 * @typedef  {object} TemporalEase
	 * @property {KeyframeTemporalEase} inTemporalEase  TemporalEase for keyIn
	 * @property {KeyframeTemporalEase} outTemporalEase TemporalEase for keyOut
	 */

	/**
	 * @typedef {number[]} KeyframeTemporalEase
	 * @property {number} xTemporalEase
	 * @property {number} yTemporalEase
	 * @property {number} [zTemporalEase]
	 */

	/**
	 * Gets or sets in/out temporal ease of current key
	 * @method
	 * @instance
	 * @param  {KeyframeTemporalEase} [inType]  In KeyframeTemporalEase enumerated value to set
	 * @param  {KeyframeTemporalEase} [outType] Out KeyframeTemporalEase enumerated value to set
	 * @return {TemporalEase}                   Object of In/Out temporal ease values
	 */
	temporalEase: function ( inType, outType ) {
		this.checkKey();

		// Return current value if no arguments
		if ( arguments.length === 0 ) {
			return {
				inEase: this.property.keyInTemporalEase( this.index ),
				outEase: this.property.keyOutTemporalEase( this.index )
			};
		}

		// Check if arguments is a value returned from this function
		if ( outType === undefined && inType.outEase ) {
			outType = inType.outEase;
		}
		if ( inType.inEase ) {
			inType = inType.inEase;
		}

		// TemporalEase have to be set using arrays of KeyframeEaseObjects with
		// number of objects in the array matching the propertyValueType
		if ( !aeq.isArray( inType ) ) {
			if ( this.valueTypeIs( 'TwoD' ) ) {
				inType = [ inType, inType ];
			} else if ( this.valueTypeIs( 'ThreeD' ) ) {
				inType = [ inType, inType, inType ];
			} else {
				inType = [ inType ];
			}
		}
		if ( outType && !aeq.isArray( outType ) ) {
			if ( this.valueTypeIs( 'TwoD' ) ) {
				outType = [ outType, outType ];
			} else if ( this.valueTypeIs( 'ThreeD' ) ) {
				outType = [ outType, outType, outType ];
			} else {
				outType = [ outType ];
			}
		}

		this.property.setTemporalEaseAtKey( this.index, inType, outType );
	},

	/**
	 * Gets comp time of current key
	 * @instance
	 * @method
	 * @return {number} Key time of current key, in seconds
	 */
	time: function () {
		this.checkKey();
		return this.originalTime;
	},

	/**
	 * Removes current key from property
	 * @method
	 * @instance
	 */
	remove: function () {
		this.checkKey();
		this.property.removeKey( this.index );
	},

	/**
	 * @typedef aeq.KeyInfo
	 * @property {Property}          property           Prop that the key lives on
	 * @property {any}               value              Key value
	 * @property {time}              number             Key time
	 * @property {InterpolationType} interpolationType  In/out interpolation type
	 * @property {TemporalEase}      temporalEase       In/out temporal ease
	 * @property {SpatialTangent}    spatialTangent     In/out spatial tangents
	 * @property {boolean}    temporalAutoBezier Whether key has temporal auto-Bezier interpolation
	 * @property {boolean}    temporalContinuous Whether key has temporal continuity
	 * @property {boolean}    spatialAutoBezier  Whether key has spatial auto-Bezier interpolation
	 * @property {boolean}    spatialContinuous  Whether key has spatial continuity
	 * @property {boolean}    roving             Whether key is roving
	 */

	/**
	 * Gets key data
	 * @method
	 * @instance
	 * @return {aeq.KeyInfo} [description]
	 */
	getKeyInfo: function () {
		this.checkKey();
		var keyInfo = {
			property: this.property,
			interpolationType: this.interpolationType(),
			value: this.value(),
			time: this.time()
		};

		// These do not have any effect if interpolationType is not Bezier for in and out
		if ( keyInfo.interpolationType.inType === KeyframeInterpolationType.BEZIER &&
				keyInfo.interpolationType.outType === KeyframeInterpolationType.BEZIER ) {
			keyInfo.temporalAutoBezier = this.temporalAutoBezier();
			keyInfo.temporalContinuous = this.temporalContinuous();
		}

		// TODO: find out why this check is here, was like that in rd_scooter
		if ( keyInfo.interpolationType.outType !== KeyframeInterpolationType.HOLD ) {
			keyInfo.temporalEase = this.temporalEase();
		}

		// These attributes throws an error if valuetype is not spatial when setting
		if ( this.valueTypeIs( 'TwoD_SPATIAL' ) || this.valueTypeIs( 'ThreeD_SPATIAL' ) ) {
			keyInfo.spatialAutoBezier = this.spatialAutoBezier();
			keyInfo.spatialContinuous = this.spatialContinuous();
			keyInfo.spatialTangent = this.spatialTangent();
			keyInfo.roving = this.roving();
		}
		return keyInfo;
	},

	/**
	 * Copies current key to a new property at current (or target) time
	 * @method
	 * @instance
	 * @param  {Property} targetProp            Property to create new key on
	 * @param  {number} [time=aeq.KeyInfo.time] Time to create new key at;
	 * defaults to current key's time
	 * @param  {number} offset					Add/subtrackt an amount of offset in keyframe time.
	 * @return {aeq.Key}                        New key
	 */
	copyTo: function ( targetProp, time, offset ) {
		var keyInfo = this.getKeyInfo();
		keyInfo.time = time === undefined ? keyInfo.time : time;
		offset = offset === undefined ? 0 : offset;
		keyInfo.time += offset;

		if ( targetProp.isAeq ) {
			targetProp = targetProp.get();
		}
		keyInfo.property = targetProp;
		return aeq.pasteKey( keyInfo );
	},

	/**
	 * Moves current key to new time
	 * @method
	 * @instance
	 * @param  {number} time New key time
	 */
	moveTo: function ( time ) {
		var thisTime = this.time();

		// Keyframe should not be moved
		if ( time === thisTime ) {
			return;
		}

		var newKey = this.copyTo( this.property, time );
		this.remove();

		this.index = this.property.nearestKeyIndex( newKey.time() );
		this.originalTime = time;
	},

	/**
	 * Checks whether this property type matches argument
	 * @method
	 * @instance
	 * @param  {string} type PropertyValueType to check
	 * @return {boolean} `true` if property type matches argument
	 */
	valueTypeIs: function valueTypeIs( type ) {
		return this.property.propertyValueType === PropertyValueType[type];
	}
};

// Create many methods that function the same way at the same time
aeq.forEach( [
	'roving',
	'selected',
	'spatialAutoBezier',
	'spatialContinuous',
	'temporalAutoBezier',
	'temporalContinuous',
	'value'
], function ( type ) {
	var typeCapitalized = type.charAt( 0 ).toUpperCase() + type.slice( 1 );
	var getter = 'key' + typeCapitalized;
	var setter = 'set' + typeCapitalized + 'AtKey';

	aeq.Key.prototype[type] = function () {
		this.checkKey();
		if ( arguments.length === 0 ) {
			return this.property[getter]( this.index );
		}

		// Add this.index to the beginning of the arguments array
		[].unshift.call( arguments, this.index );
		this.property[setter].apply( this.property, arguments );
	};
});

/**
 * Pastes key info?
 * @method
 * @instance
 * @param {aeq.KeyInfo} keyInfo KeyInfo property to paste to
 * @return {aeq.Key} New key
 */
aeq.pasteKey = function ( keyInfo ) {
	var keyIndex = keyInfo.property.addKey( keyInfo.time );
	var key = new aeq.Key( keyInfo.property, keyIndex );

	if ( keyInfo.property.value.length === 2 &&
			aeq.isArray( keyInfo.value ) &&
			keyInfo.value.length === 3 ) {
		keyInfo.value = [ keyInfo.value[0], keyInfo.value[1] ];
		var spatialTangent = keyInfo.spatialTangent;
		keyInfo.spatialTangent = {
			inTangent: [ spatialTangent.inTangent[0], spatialTangent.inTangent[1] ],
			outTangent: [ spatialTangent.outTangent[0], spatialTangent.outTangent[1] ]
		};
	}

	key.value( keyInfo.value );

	// Copy over the keyframe settings
	if ( keyInfo.temporalEase !== undefined ) {
		key.temporalEase( keyInfo.temporalEase );
	}

	key.interpolationType( keyInfo.interpolationType );

	if ( keyInfo.temporalAutoBezier !== undefined && keyInfo.temporalContinuous !== undefined ) {
		key.temporalAutoBezier( keyInfo.temporalAutoBezier );
		key.temporalContinuous( keyInfo.temporalContinuous );
	}

	if ( keyInfo.spatialAutoBezier !== undefined && keyInfo.spatialContinuous !== undefined ) {
		key.spatialAutoBezier( keyInfo.spatialAutoBezier );
		key.spatialContinuous( keyInfo.spatialContinuous );

		key.spatialTangent( keyInfo.spatialTangent );
		key.roving( keyInfo.roving );
	}
	return key;
};

return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
 * Converts a Layer into an aeq.Layer object
 * @memberof aeq
 * @class
 * @param  {Layer} layer Layer to turn into aeq.Layer object
 * @return {aeq.Layer} aeq.Layer object of Layer
 */
aeq.Layer = function ( layer ) {
	if ( layer instanceof aeq.Layer ) {
		return layer;
	}

	// Check if function called with "new" keyword
	if ( this instanceof aeq.Layer ) {
		this.layer = layer;
	} else {
		return new aeq.Layer( layer );
	}
};

aeq.Layer.prototype = {
	isAeq: true,

	toString: function () {
		return '[object aeq.Layer]';
	},

	// Function for extending the prototype using objects
	extend: aeq.extend,

	/**
	 * Get the original object
	 * @method
	 * @instance
	 * @return {Layer} Native Layer object
	 */
	get: function () {
		return this.layer;
	},

	/**
	 * Gets or sets layer parent
	 * @method
	 * @instance
	 * @param  {aeq.SelectorString|null} [selector] Selector for new parent, or
	 * null to remove parent
	 * @return {Layer|null} Parent layer, or null if none
	 */
	parent: function ( selector ) {
		if ( arguments.length === 0 ) {
			return this.layer.parent;
		}

		// Pass in null to remove the parent
		if ( selector === null ) {
			this.layer.parent = null;
			return null;
		}

		var layer = getLayer( this.layer, selector );

		if ( layer === null ) {
			return null;
		}
		this.layer.parent = layer;
		return layer;
	},

	/**
	 * Copies current layer to comp
	 * @method
	 * @instance
	 * @param  {CompItem|aeq.Comp} comp Comp to copy layer to
	 * @return {aeq.Layer}              Newly copied layer
	 */
	copyToComp: function ( comp ) {
		if ( !aeq.isComp( comp ) ) {
			if ( comp instanceof aeq.Comp ) {
				comp = comp.comp;
			} else if ( aeq.isString( comp ) ) {
				comp = aeq.getComp( comp );
			}
		}
		this.layer.copyToComp( comp );
		return this;
	},

	/**
	 * Removes this layer's parent
	 * @method
	 * @instance
	 * @return {aeq.Layer} This layer
	 */
	removeParent: function () {
		this.layer.parent = null;
		return this;
	},

	/**
	 * Executes a callback function on each effect on this layer
	 * @method
	 * @instance
	 * @param  {Function} callback Function to run on each effect
	 * @return {aeq.Layer}         This layer
	 */
	forEachEffect: function ( callback ) {
		var effects = this.layer.property( 'ADBE Effect Parade' ),
			length = effects.numProperties,
			i = 1;

		for ( ; i <= length; i++ ) {
			callback( effects.property( i ), i, effects );
		}
		return this;
	},

	/**
	 * Adds effect to layer by name or matchname
	 * @method
	 * @instance
	 * @param  {string} effectName Effect name or matchname to add to layer
	 */
	addEffect: function ( effectName ) {
		var effects = this.layer.property( 'ADBE Effect Parade' );
		if ( effects.canAddProperty( effectName ) ) {
			effects.addProperty( effectName );
		} else {
			throw new Error( 'Can not add effect "' + effectName + '" to this layer' );
		}
	},

	/**
	 * Gets all layers that has the given layer as its parent.
	 * @method
	 * @instance
	 * @return {Layer[]} Children of this layer
	 */
	children: function () {
		return aeq.layer.children( this.layer );
	},

	/**
	 * Gets all layers that has the given layer as its parent, and all layers
	 * that has those layers, and so on.
	 * @method
	 * @instance
	 * @return {Layer[]} Children and decendants of this layer
	 */
	allChildren: function () {
		return aeq.layer.allChildren( this.layer );
	},

	/**
	 * This layer's parent chain
	 * @method
	 * @instance
	 * @return {Layer[]} Parents of this layer
	 */
	parents: function () {
		return aeq.layer.parents( this.layer );
	},

	/**
	 * All [parents]{@link aeq.layer.parents} and
	 * [all children]{@link aeq.layer.allChildren} of the this layer.
	 * @method
	 * @instance
	 * @return {Layer[]} The layer's parents and children.
	 */
	relatedLayers: function () {
		return aeq.layer.relatedLayers( this.layer );
	}
};

// Create methods that only returns the value for attributes that are read-
// only and can change over time;
aeq.forEach( [
	'active',
	'index',
	'isNameSet',
	'selectedProperties',
	'time',
	'containingComp',
	'hasVideo'
], function ( attribute ) {
	aeq.Layer.prototype[attribute] = function () {
		return this.layer[attribute];
	};
});

// Create methods for attributes that are basic read/write
aeq.forEach( [
	'comment',
	'enabled',
	'inPoint',
	'locked',
	'name',
	'outPoint',
	'shy',
	'solo',
	'startTime',
	'stretch'
], function ( attribute ) {
	aeq.Layer.prototype[attribute] = function ( newValue ) {
		if ( arguments.length === 0 ) {
			return this.layer[attribute];
		}
		this.layer[attribute] = newValue;

		// Return the aeq.Layer object for chaining methods
		return this;
	};
});

// Create Methods that just call the layer object methods
aeq.forEach( [
	'activeAtTime',
	'applyPreset',
	'duplicate',
	'remove',
	'moveToBeginning',
	'moveToEnd'
], function ( method ) {
	aeq.Layer.prototype[method] = function ( newValue ) {
		this.layer[method]( newValue );

		// Return the aeq.Layer object for chaining methods
		return this;
	};
});

// Create methods that can take a Layer, aeq.Layer, number or string as input
// and need to pass that to a method that takes a Layer object
aeq.forEach( [
	'setParentWithJump',
	'moveAfter',
	'moveBefore'
], function ( method ) {
	aeq.Layer.prototype[method] = function ( selector ) {
		var layer = getLayer( this.layer, selector );

		if ( layer === null ) {
			return null;
		}
		this.layer[method]( layer );
		return layer;
	};
});


// Used in aeq.Layer.parent, setParentWithJump and move methods
var regexRelativeIndex = /^(\+|-)=/;

/* The selector argument can be one of the following:
 * An aeq.Layer object
 * A Layer object
 * An index for a layer in the comp
 * A string with a layer name
 * A string starting with "+=" or "-=" then a number to indicate an index
 * relative to the current layer
 */
function getLayer( baseLayer, selector ) {
	var index, offset;

	// Set the value
	if ( selector instanceof aeq.Layer ) {
		return selector.layer;
	}
	if ( aeq.isLayer( selector ) ) {
		return selector;
	}

	// Set parent to layer with index
	if ( aeq.isNumber( selector ) ) {
		return baseLayer.containingComp.layer( selector );
	}

	// Set parent to layer with name or with a relative index
	if ( aeq.isString( selector ) ) {
		// Check if string starts with "+=" or "-="
		if ( regexRelativeIndex.test( selector ) ) {
			offset = getRelativeIndex( selector );
			if ( offset ) {
				// Set parent to layer with index relative to this layer
				index = baseLayer.index + offset;

				// Return null if index is out of range
				if ( index === 0 || index > baseLayer.containingComp.numLayers ) {
					return null;
				}
				return baseLayer.containingComp.layer( index );
			}
		}

		// Use the string as a name if it does not start with += or -= or if the
		// rest of the string is not a valid number
		return baseLayer.containingComp.layer( selector );
	}

	// If none of the above is true it should return null
	return null;
}

function getRelativeIndex( str ) {
	var offset = str.charAt( 0 ) + str.substr( 2 );
	offset = parseInt( offset, 10 );
	if ( isNaN( offset ) ) {
		return false;
	}
	return offset;
}


return aeq;
}( aeq || {}) );

aeq = ( function ( aeq ) {
/**
 * Converts a Property into an aeq.Property object
 * @memberof aeq
 * @class
 * @param  {Property} property Property to convert
 * @return {aeq.Property}      aeq.Property object
 */
aeq.Property = function ( property ) {
	if ( property instanceof aeq.Property ) {
		return property;
	}
	if ( this instanceof aeq.Property ) {
		this.property = property;
	} else {
		return new aeq.Property( property );
	}
};

aeq.Property.prototype = {
	isAeq: true,

	toString: function () {
		return '[object aeq.Property]';
	},

	// Function for extending the prototype using objects
	extend: aeq.extend,

	/**
	 * Get the original object
	 * @method
	 * @instance
	 * @return {Property} Native Property object
	 */
	get: function () {
		return this.property;
	},

	/**
	 * Gets or sets expression on property
	 * @method
	 * @instance
	 * @param  {string} [newValue] Expression to set
	 * @return {string|boolean}    Returns current expression, current expression
	 * error, or `true` if expression was set
	 */
	expression: function ( newValue ) {
		if ( !this.property.canSetExpression ) {
			return false;
		}
		if ( arguments.length === 0 ) {
			return this.property.expression;
		}
		this.property.expression = newValue;
		if ( this.property.expressionError === '' &&
				( this.property.expressionEnabled ||
				newValue === '' ) ) {
			return true;
		}
		return this.property.expressionError;
	},

	/**
	 * Gets array of selected keys
	 * @method
	 * @instance
	 * @return {Key[]} ArrayEx of selected keys
	 */
	selectedKeys: function () {
		var selectedKeys = [];

		// Return key objects for selected keys
		for ( var i = 0; i < this.property.selectedKeys.length; i++ ) {
			selectedKeys.push( this.key( this.property.selectedKeys[i] ) );
		}
		return aeq.arrayEx( selectedKeys );
	},

	/**
	 * Adds & returns a new key at time
	 * @method
	 * @instance
	 * @param  {number} time The time in seconds; a floating-point value. The
	 * beginning of the composition is 0.
	 * @return {Key}         Newly-created key
	 */
	addKey: function ( time ) {
		var keyIndex = this.property.addKey( time );
		return this.key( keyIndex );
	},

	/**
	 * Retrieves property following passed dimension
	 * @method
	 * @instance
	 * @param  {number} dim The dimension number (starting at 0).
	 * @return {Property}   Property following passed dimension
	 */
	separationFollower: function ( dim ) {
		return this.property.getSeparationFollower( dim );
	},

	/**
	 * Returns the index of the keyframe nearest to the specified time.
	 * @method
	 * @instance
	 * @param  {number} time The time in seconds; a floating-point value. The
	 * beginning of the composition is 0.
	 * @return {Key}         Nearest key
	 */
	nearestKeyIndex: function ( time ) {
		var keyIndex = this.property.nearestKeyIndex( time );
		return this.key( keyIndex );
	},

	/**
	 * Removes key by index or key object
	 * @method
	 * @instance
	 * @param  {number|Key} keyIndex Index of target key, or key itself
	 */
	removeKey: function ( keyIndex ) {
		if ( aeq.isNumber( keyIndex ) ) {
			this.property.removeKey( keyIndex );
		} else if ( keyIndex.toString() === '[object aeq.Key]' ) {
			keyIndex.remove();
		}
	},

	/**
	 * Returns the original multidimensional property for this separated follower
	 * Can only be accessed if the property is one of the separated properties
	 * 	(e.g Y Position), otherwise AE throws an error
	 * @method
	 * @instance
	 * @return {Property|null} Original multidimensional property, or null
	 */
	separationLeader: function () {
		if ( this.property.isSeparationFollower ) {
			return this.property.separationLeader;
		}
		return null;
	},

	/**
	 * Returns the dimension number it represents in the multidimensional leader
	 * Can only be accessed if the property is one of the separated properties
	 * 	(e.g Y Position), otherwise AE throws an error
	 * @method
	 * @instance
	 * @return {number|null} Dimension number, or null
	 */
	separationDimension: function () {
		if ( this.property.isSeparationFollower ) {
			return this.property.separationDimension;
		}
		return null;
	},

	/**
	 * Returns maximum permitted value of property
	 * @method
	 * @instance
	 * @return {number|null} Max value, or null if there isn't one
	 */
	maxValue: function () {
		if ( this.property.hasMax ) {
			return this.property.maxValue;
		}
		return null;
	},

	/**
	 * Returns minimum permitted value of property
	 * @method
	 * @instance
	 * @return {number|null} Max value, or null if there isn't one
	 */
	minValue: function () {
		if ( this.property.hasMin ) {
			return this.property.minValue;
		}
		return null;
	},

	/**
	 * Gets or sets property value
	 * 	If expressionEnabled is true, returns the evaluated expression value.
	 * 	If there are keyframes, returns the keyframed value at the current time.
	 * 	Otherwise, returns the static value.
	 * @method
	 * @instance
	 * @param  {any} [newValue] New value to try to set
	 * @return {any}            Current value
	 */
	value: function ( newValue ) {
		if ( arguments.length === 0 ) {
			return this.property.value;
		}
		this.property.setValue( newValue );
	},

	/**
	 * Get or set the value of the current property as evaluated at the specified
	 * time
	 * @method
	 * @instance
	 * @param  {number} time    The time in seconds; a floating-point value. The
	 * beginning of the composition is 0.
	 * @param  {any}    [value] Property value at time
	 * @return {any|number}     Set value, or index of nearest key to `time`
	 */
	valueAtTime: function ( time, value ) {
		// TODO: Both setValueAtTime and valueAtTime require two arguments
		// How should this be handled?
		if ( arguments.length === 1 ) {
			return this.property.valueAtTime( time );
		}
		this.property.setValueAtTime( time, value );

		// TODO: should returning key object be optional?
		return this.nearestKeyIndex( time );
	},

	/**
	 * Get or sets values for a set of keyframes at specified times
	 * @method
	 * @instance
	 * @param  {number[]} times    Array of times
	 * @param  {any[]}    [values] Array of values
	 * @return {any[]|number[]}    Array of set values, or array of indices of nearest key to `time`
	 */
	valuesAtTimes: function ( times, values ) {
		var result = [],
			i = 0,
			il = times.length;

		if ( arguments.length === 1 ) {
			for ( ; i < il; i++ ) {
				// TODO: valueAtTime require two arguments How should this be handled?
				result.push( this.property.valueAtTime( times[i] ) );
			}
			return result;
		}

		this.property.setValuesAtTimes( times, values );

		// TODO: should returning key objects be optional?
		for ( ; i < il; i++ ) {
			result.push( this.nearestKeyIndex( times[i] ) );
		}
		return result;
	},

	/**
	 * Runs a function on each key in current property
	 * @method
	 * @instance
	 * @param  {Function} callback Function to execute on each key
	 */
	forEachKey: function ( callback ) {
		var keys = this.getKeys();
		var length = keys.length,
			i = 0;

		for ( ; i < length; i++ ) {
			callback( keys[i], keys[i].index, this.property );
		}
	},

	/**
	 * Returns a aeq.Key object for specific key index
	 * @method
	 * @instance
	 * @param  {number} keyIndex Index of target key
	 * @return {aeq.Key}         aeq.Key object for target key
	 */
	key: function ( keyIndex ) {
		return new aeq.Key( this.property, keyIndex );
	},

	/**
	 * Gets all keys of the property
	 * @method
	 * @return {aeq.Key[]} ArrayEx of all keyframes on the property
	 */
	getKeys: function () {
		var keys = [];
		var length = this.property.numKeys,
			i = 1;

		for ( ; i <= length; i++ ) {
			keys.push( this.key( i ) );
		}
		return aeq.arrayEx( keys );
	}
};

// Create functions for read-only attributes
aeq.forEach( [
	'expressionError',
	'isTimeVarying',
	'numKeys',
	'canSetExpression',
	'canVaryOverTime',
	'isSpatial',
	'isSeparationFollower',
	'isSeparationLeader',
	'propertyIndex',
	'propertyValueType',
	'unitsText'
], function ( attribute ) {
	aeq.Property.prototype[attribute] = function () {
		return this.property[attribute];
	};
});

return aeq;
}( aeq || {}) );

return aeq;
}());

var cssselector=(function() {
  "use strict";

  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},
        parser  = this,

        peg$FAILED = {},

        peg$startRuleFunctions = { Start: peg$parseStart },
        peg$startRuleFunction  = peg$parseStart,

        peg$c0 = "[",
        peg$c1 = { type: "literal", value: "[", description: "\"[\"" },
        peg$c2 = "]",
        peg$c3 = { type: "literal", value: "]", description: "\"]\"" },
        peg$c4 = function(props) { return mergeProps(props) },
        peg$c5 = "(",
        peg$c6 = { type: "literal", value: "(", description: "\"(\"" },
        peg$c7 = ")",
        peg$c8 = { type: "literal", value: ")", description: "\")\"" },
        peg$c9 = /^[a-zA-Z]/,
        peg$c10 = { type: "class", value: "[a-zA-Z]", description: "[a-zA-Z]" },
        peg$c11 = function(name) { var o = {}; var key = name.join(''); o[key] = { type: 'Bool', value: true }; return o; },
        peg$c12 = "=",
        peg$c13 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c14 = function(name, value) { var o = {}; var key = name.join(''); o[key] = value; return o; },
        peg$c15 = function(type, props, pseudo) {
            return { type: type.join('').toLowerCase(), props: props, pseudo: pseudo }
          },
        peg$c16 = ":",
        peg$c17 = { type: "literal", value: ":", description: "\":\"" },
        peg$c18 = function(type, props) { return { type: type.join('').toLowerCase(), props: props } },
        peg$c19 = function(literal) { return literal; },
        peg$c20 = function() { return { type: 'Bool', value: true } },
        peg$c21 = function() { return { type: 'Bool', value: false } },
        peg$c22 = "0",
        peg$c23 = { type: "literal", value: "0", description: "\"0\"" },
        peg$c24 = /^[0-9]/,
        peg$c25 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c26 = /^[1-9]/,
        peg$c27 = { type: "class", value: "[1-9]", description: "[1-9]" },
        peg$c28 = ".",
        peg$c29 = { type: "literal", value: ".", description: "\".\"" },
        peg$c30 = function() { return { type: 'Number', value: parseFloat(text()) } },
        peg$c31 = function() { return { type: 'Integer', value: parseFloat(text()) } },
        peg$c32 = "0x",
        peg$c33 = { type: "literal", value: "0x", description: "\"0x\"" },
        peg$c34 = function(digits) { return { type: "Hex", value: parseInt(digits, 16) } },
        peg$c35 = /^[0-9a-f]/i,
        peg$c36 = { type: "class", value: "[0-9a-f]i", description: "[0-9a-f]i" },
        peg$c37 = "\"",
        peg$c38 = { type: "literal", value: "\"", description: "\"\\\"\"" },
        peg$c39 = function(chars) {
              return { type: "String", value: chars.join("") };
            },
        peg$c40 = "'",
        peg$c41 = { type: "literal", value: "'", description: "\"'\"" },
        peg$c42 = "\\",
        peg$c43 = { type: "literal", value: "\\", description: "\"\\\\\"" },
        peg$c44 = { type: "any", description: "any character" },
        peg$c45 = function() { return text(); },
        peg$c46 = function(sequence) { return sequence; },
        peg$c47 = function() { return ""; },
        peg$c48 = function() { return "\0"; },
        peg$c49 = "b",
        peg$c50 = { type: "literal", value: "b", description: "\"b\"" },
        peg$c51 = function() { return "\b";   },
        peg$c52 = "f",
        peg$c53 = { type: "literal", value: "f", description: "\"f\"" },
        peg$c54 = function() { return "\f";   },
        peg$c55 = "n",
        peg$c56 = { type: "literal", value: "n", description: "\"n\"" },
        peg$c57 = function() { return "\n";   },
        peg$c58 = "r",
        peg$c59 = { type: "literal", value: "r", description: "\"r\"" },
        peg$c60 = function() { return "\r";   },
        peg$c61 = "t",
        peg$c62 = { type: "literal", value: "t", description: "\"t\"" },
        peg$c63 = function() { return "\t";   },
        peg$c64 = "v",
        peg$c65 = { type: "literal", value: "v", description: "\"v\"" },
        peg$c66 = function() { return "\v";   },
        peg$c67 = "x",
        peg$c68 = { type: "literal", value: "x", description: "\"x\"" },
        peg$c69 = "u",
        peg$c70 = { type: "literal", value: "u", description: "\"u\"" },
        peg$c71 = function(digits) {
              return String.fromCharCode(parseInt(digits, 16));
            },
        peg$c72 = /^[\n\r\u2028\u2029]/,
        peg$c73 = { type: "class", value: "[\\n\\r\\u2028\\u2029]", description: "[\\n\\r\\u2028\\u2029]" },
        peg$c74 = { type: "other", description: "end of line" },
        peg$c75 = "\n",
        peg$c76 = { type: "literal", value: "\n", description: "\"\\n\"" },
        peg$c77 = "\r\n",
        peg$c78 = { type: "literal", value: "\r\n", description: "\"\\r\\n\"" },
        peg$c79 = "\r",
        peg$c80 = { type: "literal", value: "\r", description: "\"\\r\"" },
        peg$c81 = "\u2028",
        peg$c82 = { type: "literal", value: "\u2028", description: "\"\\u2028\"" },
        peg$c83 = "\u2029",
        peg$c84 = { type: "literal", value: "\u2029", description: "\"\\u2029\"" },
        peg$c85 = function(head, tail) {
            head.push(tail); return { type: "Array", value: head };
          },
        peg$c86 = ",",
        peg$c87 = { type: "literal", value: ",", description: "\",\"" },
        peg$c88 = function(value) { return value },
        peg$c89 = "true",
        peg$c90 = { type: "literal", value: "true", description: "\"true\"" },
        peg$c91 = "false",
        peg$c92 = { type: "literal", value: "false", description: "\"false\"" },
        peg$c93 = { type: "other", description: "whitespace" },
        peg$c94 = /^[ \t\n\r]/,
        peg$c95 = { type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]" },
        peg$c96 = { type: "other", description: "regular expression" },
        peg$c97 = "/",
        peg$c98 = { type: "literal", value: "/", description: "\"/\"" },
        peg$c99 = function(body, flags) {
            return {
              type:  "RegExp",
              body:  body,
              flags: flags,
              value: new RegExp(body, flags)
            };
          },
        peg$c100 = function(char_, chars) {
            return char_ + chars;
          },
        peg$c101 = function(chars) { return chars.join(""); },
        peg$c102 = /^[*\\\/[]/,
        peg$c103 = { type: "class", value: "[*\\\\/[]", description: "[*\\\\/[]" },
        peg$c104 = function(char_) { return char_; },
        peg$c105 = /^[\\\/[]/,
        peg$c106 = { type: "class", value: "[\\\\/[]", description: "[\\\\/[]" },
        peg$c107 = function(char_) { return "\\" + char_; },
        peg$c108 = function(chars) { return "[" + chars + "]"; },
        peg$c109 = /^[\]\\]/,
        peg$c110 = { type: "class", value: "[\\]\\\\]", description: "[\\]\\\\]" },
        peg$c111 = /^[gimuy]/,
        peg$c112 = { type: "class", value: "[gimuy]", description: "[gimuy]" },
        peg$c113 = function(parts) { return parts.join(""); },

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1, seenCR: false }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function error(message) {
      throw peg$buildException(
        message,
        null,
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos],
          p, ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column,
          seenCR: details.seenCR
        };

        while (p < pos) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0100-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1000-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parseStart() {
      var s0;

      s0 = peg$parseSelectors();

      return s0;
    }

    function peg$parsePropertiesBrackets() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c0;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c1); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseProperty();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseProperty();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 93) {
            s3 = peg$c2;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c3); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c4(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePropertiesParentheses() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c5;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c6); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseProperty();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseProperty();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 41) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c4(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseProperty() {
      var s0;

      s0 = peg$parseValuePair();
      if (s0 === peg$FAILED) {
        s0 = peg$parseValueSingle();
      }

      return s0;
    }

    function peg$parseValueSingle() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c9.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c10); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c9.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c10); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c11(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseValuePair() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c9.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c10); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c9.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c10); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s2 = peg$c12;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c13); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseValue();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c14(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSelector() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c9.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c10); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c9.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c10); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsePropertiesBrackets();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsePseudo();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsePseudo();
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c15(s1, s2, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSelectors() {
      var s0, s1;

      s0 = [];
      s1 = peg$parseSelector();
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          s1 = peg$parseSelector();
        }
      } else {
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePseudo() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 58) {
        s1 = peg$c16;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c17); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c9.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c10); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c9.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c10); }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsePropertiesParentheses();
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c18(s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseValue() {
      var s0;

      s0 = peg$parseBooleanLiteral();
      if (s0 === peg$FAILED) {
        s0 = peg$parseNumericLiteral();
        if (s0 === peg$FAILED) {
          s0 = peg$parseStringLiteral();
          if (s0 === peg$FAILED) {
            s0 = peg$parseArrayLiteral();
            if (s0 === peg$FAILED) {
              s0 = peg$parseRegularExpressionLiteral();
            }
          }
        }
      }

      return s0;
    }

    function peg$parseNumericLiteral() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseHexIntegerLiteral();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseDecimalDigit();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c19(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseDecimalLiteral();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c19(s1);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseBooleanLiteral() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseTrueToken();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c20();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseFalseToken();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c21();
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseDecimalIntegerLiteral() {
      var s0, s1, s2, s3;

      if (input.charCodeAt(peg$currPos) === 48) {
        s0 = peg$c22;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c23); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseNonZeroDigit();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseDecimalDigit();
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseDecimalDigit();
          }
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseDecimalDigit() {
      var s0;

      if (peg$c24.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c25); }
      }

      return s0;
    }

    function peg$parseNonZeroDigit() {
      var s0;

      if (peg$c26.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c27); }
      }

      return s0;
    }

    function peg$parseDecimalLiteral() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseDecimalIntegerLiteral();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s2 = peg$c28;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c29); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseDecimalDigit();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseDecimalDigit();
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c30();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 46) {
          s1 = peg$c28;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c29); }
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseDecimalDigit();
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parseDecimalDigit();
            }
          } else {
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c30();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseDecimalIntegerLiteral();
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c31();
          }
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parseHexIntegerLiteral() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2).toLowerCase() === peg$c32) {
        s1 = input.substr(peg$currPos, 2);
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c33); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = [];
        s4 = peg$parseHexDigit();
        if (s4 !== peg$FAILED) {
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseHexDigit();
          }
        } else {
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          s2 = input.substring(s2, peg$currPos);
        } else {
          s2 = s3;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c34(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseHexDigit() {
      var s0;

      if (peg$c35.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c36); }
      }

      return s0;
    }

    function peg$parseStringLiteral() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 34) {
        s1 = peg$c37;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c38); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseDoubleStringCharacter();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseDoubleStringCharacter();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 34) {
            s3 = peg$c37;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c38); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c39(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 39) {
          s1 = peg$c40;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c41); }
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseSingleStringCharacter();
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseSingleStringCharacter();
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 39) {
              s3 = peg$c40;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c41); }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c39(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseDoubleStringCharacter() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 34) {
        s2 = peg$c37;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c38); }
      }
      if (s2 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 92) {
          s2 = peg$c42;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c43); }
        }
        if (s2 === peg$FAILED) {
          s2 = peg$parseLineTerminator();
        }
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = void 0;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        if (input.length > peg$currPos) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c44); }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c45();
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 92) {
          s1 = peg$c42;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c43); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseEscapeSequence();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c46(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$parseLineContinuation();
        }
      }

      return s0;
    }

    function peg$parseSingleStringCharacter() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 39) {
        s2 = peg$c40;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c41); }
      }
      if (s2 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 92) {
          s2 = peg$c42;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c43); }
        }
        if (s2 === peg$FAILED) {
          s2 = peg$parseLineTerminator();
        }
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = void 0;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        if (input.length > peg$currPos) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c44); }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c45();
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 92) {
          s1 = peg$c42;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c43); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseEscapeSequence();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c46(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$parseLineContinuation();
        }
      }

      return s0;
    }

    function peg$parseLineContinuation() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 92) {
        s1 = peg$c42;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c43); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseLineTerminatorSequence();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c47();
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEscapeSequence() {
      var s0, s1, s2, s3;

      s0 = peg$parseCharacterEscapeSequence();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 48) {
          s1 = peg$c22;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c23); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          peg$silentFails++;
          s3 = peg$parseDecimalDigit();
          peg$silentFails--;
          if (s3 === peg$FAILED) {
            s2 = void 0;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c48();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$parseHexEscapeSequence();
          if (s0 === peg$FAILED) {
            s0 = peg$parseUnicodeEscapeSequence();
          }
        }
      }

      return s0;
    }

    function peg$parseCharacterEscapeSequence() {
      var s0;

      s0 = peg$parseSingleEscapeCharacter();
      if (s0 === peg$FAILED) {
        s0 = peg$parseNonEscapeCharacter();
      }

      return s0;
    }

    function peg$parseSingleEscapeCharacter() {
      var s0, s1;

      if (input.charCodeAt(peg$currPos) === 39) {
        s0 = peg$c40;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c41); }
      }
      if (s0 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 34) {
          s0 = peg$c37;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c38); }
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 92) {
            s0 = peg$c42;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c43); }
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 98) {
              s1 = peg$c49;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c50); }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c51();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 102) {
                s1 = peg$c52;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c53); }
              }
              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c54();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 110) {
                  s1 = peg$c55;
                  peg$currPos++;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c56); }
                }
                if (s1 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c57();
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (input.charCodeAt(peg$currPos) === 114) {
                    s1 = peg$c58;
                    peg$currPos++;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c59); }
                  }
                  if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c60();
                  }
                  s0 = s1;
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 116) {
                      s1 = peg$c61;
                      peg$currPos++;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c62); }
                    }
                    if (s1 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c63();
                    }
                    s0 = s1;
                    if (s0 === peg$FAILED) {
                      s0 = peg$currPos;
                      if (input.charCodeAt(peg$currPos) === 118) {
                        s1 = peg$c64;
                        peg$currPos++;
                      } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c65); }
                      }
                      if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c66();
                      }
                      s0 = s1;
                    }
                  }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseNonEscapeCharacter() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      s2 = peg$parseEscapeCharacter();
      if (s2 === peg$FAILED) {
        s2 = peg$parseLineTerminator();
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = void 0;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        if (input.length > peg$currPos) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c44); }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c45();
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEscapeCharacter() {
      var s0;

      s0 = peg$parseSingleEscapeCharacter();
      if (s0 === peg$FAILED) {
        s0 = peg$parseDecimalDigit();
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 120) {
            s0 = peg$c67;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c68); }
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 117) {
              s0 = peg$c69;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c70); }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseHexEscapeSequence() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 120) {
        s1 = peg$c67;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c68); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$currPos;
        s4 = peg$parseHexDigit();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseHexDigit();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          s2 = input.substring(s2, peg$currPos);
        } else {
          s2 = s3;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c71(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseUnicodeEscapeSequence() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 117) {
        s1 = peg$c69;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c70); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$currPos;
        s4 = peg$parseHexDigit();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseHexDigit();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseHexDigit();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseHexDigit();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          s2 = input.substring(s2, peg$currPos);
        } else {
          s2 = s3;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c71(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseLineTerminator() {
      var s0;

      if (peg$c72.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c73); }
      }

      return s0;
    }

    function peg$parseLineTerminatorSequence() {
      var s0, s1;

      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 10) {
        s0 = peg$c75;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c76); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c77) {
          s0 = peg$c77;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c78); }
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 13) {
            s0 = peg$c79;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c80); }
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 8232) {
              s0 = peg$c81;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c82); }
            }
            if (s0 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 8233) {
                s0 = peg$c83;
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c84); }
              }
            }
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c74); }
      }

      return s0;
    }

    function peg$parseArrayLiteral() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c0;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c1); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseArrayValue();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseArrayValue();
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseValue();
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 93) {
                    s7 = peg$c2;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c3); }
                  }
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c85(s3, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseArrayValue() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseValue();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c86;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c87); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c88(s1);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseTrueToken() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c89) {
        s1 = peg$c89;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c90); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFalseToken() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c91) {
        s1 = peg$c91;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c92); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1;

      peg$silentFails++;
      s0 = [];
      if (peg$c94.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c95); }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c94.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c95); }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c93); }
      }

      return s0;
    }

    function peg$parseRegularExpressionLiteral() {
      var s0, s1, s2, s3, s4;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 47) {
        s1 = peg$c97;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c98); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseRegularExpressionBody();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 47) {
            s3 = peg$c97;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c98); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseRegularExpressionFlags();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c99(s2, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c96); }
      }

      return s0;
    }

    function peg$parseRegularExpressionBody() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseRegularExpressionFirstChar();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseRegularExpressionChars();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c100(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseRegularExpressionChars() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseRegularExpressionChar();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseRegularExpressionChar();
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c101(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseRegularExpressionFirstChar() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      if (peg$c102.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c103); }
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = void 0;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseRegularExpressionNonTerminator();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c104(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseRegularExpressionBackslashSequence();
        if (s0 === peg$FAILED) {
          s0 = peg$parseRegularExpressionClass();
        }
      }

      return s0;
    }

    function peg$parseRegularExpressionChar() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      if (peg$c105.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c106); }
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = void 0;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseRegularExpressionNonTerminator();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c104(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseRegularExpressionBackslashSequence();
        if (s0 === peg$FAILED) {
          s0 = peg$parseRegularExpressionClass();
        }
      }

      return s0;
    }

    function peg$parseRegularExpressionBackslashSequence() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 92) {
        s1 = peg$c42;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c43); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseRegularExpressionNonTerminator();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c107(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseRegularExpressionNonTerminator() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      s2 = peg$parseLineTerminator();
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = void 0;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSourceCharacter();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c104(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseRegularExpressionClass() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c0;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c1); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseRegularExpressionClassChars();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 93) {
            s3 = peg$c2;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c3); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c108(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseRegularExpressionClassChars() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseRegularExpressionClassChar();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseRegularExpressionClassChar();
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c101(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseRegularExpressionClassChar() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      if (peg$c109.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c110); }
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = void 0;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseRegularExpressionNonTerminator();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c104(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseRegularExpressionBackslashSequence();
      }

      return s0;
    }

    function peg$parseRegularExpressionFlags() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c111.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c112); }
      }
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c111.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c112); }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c113(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseSourceCharacter() {
      var s0;

      if (input.length > peg$currPos) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c44); }
      }

      return s0;
    }


      function mergeProps(array){
        var merged = {};

        for (var i = 0; i < array.length; i++) {
          var pair = array[i]
          for (var key in pair) {
            if (pair.hasOwnProperty(key)) {
                merged[key] = pair[key]
            }
          }
        }

        return merged;
      }


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(
        null,
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})()
aeq.ui = ( function ( ui ) {
/**
 * [description]
 * @class
 * @memberof aeq
 * @param  {type} obj [description]
 */
ui.Container = function ( obj ) {
	this.obj = obj;
};

ui.Container.prototype = {
	toString: function () {
		return '[object aeq.ui.Container]';
	},

	extend: aeq.extend,

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 * @return {type} [description]
	 */
	get: function () {
		return this.obj;
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {type} options [description]
	 */
	set: function ( options ) {
		ui.set( this.obj, options );
	},

	/**
	 * [description]
	 * @method
	 * @private
	 * @memberof aeq.ui.Container
	 * @param  {type} type    [description]
	 * @param  {type} options [description]
	 * @return {type}         [description]
	 */
	_add: function ( type, options ) {
		if ( aeq.isObject( options.arg1 ) && !aeq.isArray( options.arg1 ) ) {
			options = options.arg1;

			// "items" is used by listbox, dropdownlist and treeview
			// if it is defined, it most likely one of those controls
			options.arg1 = options.items || options.text;
		}

		var obj = this.obj.add( type, options.bounds, options.arg1, options.properties );
		ui.set( obj, options );
		return obj;
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {type} arg1       [description]
	 * @param  {type} onClick    [description]
	 * @param  {type} properties [description]
	 * @return {type}            [description]
	 */
	addButton: function ( arg1, onClick, properties ) {
		return this._add( 'button', {
			arg1: arg1,
			properties: properties,
			onClick: onClick
		});
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {type} arg1       [description]
	 * @param  {type} onClick    [description]
	 * @param  {type} properties [description]
	 * @return {type}            [description]
	 */
	addCheckbox: function ( arg1, onClick, properties ) {
		return this._add( 'checkbox', {
			arg1: arg1,
			properties: properties,
			onClick: onClick
		});
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {type} arg1       [description]
	 * @param  {type} onChange   [description]
	 * @param  {type} properties [description]
	 * @return {type}            [description]
	 */
	addDropdownList: function ( arg1, onChange, properties ) {
		return this._add( 'dropdownlist', {
			arg1: arg1,
			properties: properties,
			onChange: onChange
		});
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {type} arg1       [description]
	 * @param  {type} onChange   [description]
	 * @param  {type} onChanging [description]
	 * @param  {type} properties [description]
	 * @return {type}            [description]
	 */
	addEditText: function ( arg1, onChange, onChanging, properties ) {
		return this._add( 'edittext', {
			arg1: arg1,
			properties: properties,
			onChange: onChange,
			onChanging: onChanging
		});
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {type} options [description]
	 * @return {type}         [description]
	 */
	addGroup: function ( options ) {
		var group = this.obj.add( 'group' );
		group = new ui.Container( group );
		if ( options ) {
			group.set( options );
		}
		return group;
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {type} arg1       [description]
	 * @param  {type} onClick    [description]
	 * @param  {type} properties [description]
	 * @return {type}            [description]
	 */
	addIconButton: function ( arg1, onClick, properties ) {
		var options = {
			arg1: arg1,
			onClick: onClick,
			properties: properties
		};

		if ( aeq.isObject( options.arg1 ) && !aeq.isArray( options.arg1 ) &&
			!aeq.isFile( options.arg1 ) && options.arg1.format === undefined ) {
			// Check options.arg1.format to see if it is ScriptUIImage
			options = options.arg1;
			options.arg1 = options.image || undefined;
		}

		var obj = this.obj.add( 'iconbutton', options.bounds, options.arg1, options.properties );
		ui.set( obj, options );
		return obj;
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {type} arg1       [description]
	 * @param  {type} onClick    [description]
	 * @param  {type} properties [description]
	 * @return {type}            [description]
	 */
	addImage: function ( arg1, onClick, properties ) {
		var options = {
			arg1: arg1,
			onClick: onClick,
			properties: properties
		};

		if ( aeq.isObject( options.arg1 ) && !aeq.isArray( options.arg1 ) &&
			!aeq.isFile( options.arg1 ) && options.arg1.format === undefined ) {
			// Check options.arg1.format to see if it is ScriptUIImage
			options = options.arg1;
			options.arg1 = options.image || undefined;
		}

		var obj = this.obj.add( 'image', options.bounds, options.arg1, options.properties );
		ui.set( obj, options );
		return obj;
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {type} arg1          [description]
	 * @param  {type} onChange      [description]
	 * @param  {type} onDoubleClick [description]
	 * @param  {type} properties    [description]
	 * @return {type}               [description]
	 */
	addListBox: function ( arg1, onChange, onDoubleClick, properties ) {
		var newListBox = this._add( 'listbox', {
			arg1: arg1,
			properties: properties,
			onChange: onChange,
			onDoubleClick: onDoubleClick
		});

		return new ui.ListBox( newListBox );
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {type} arg1       [description]
	 * @param  {type} properties [description]
	 * @return {type}            [description]
	 */
	addPanel: function ( arg1, properties ) {
		var panel = this._add( 'panel', {
			arg1: arg1,
			properties: properties
		});
		return new ui.Container( panel );
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {type} value    [description]
	 * @param  {type} maxValue [description]
	 * @return {type}          [description]
	 */
	addProgressbar: function ( value, maxValue ) {
		return this.obj.add( 'progressbar', undefined, value, maxValue );
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {type} arg1       [description]
	 * @param  {type} onClick    [description]
	 * @param  {type} properties [description]
	 * @return {type}            [description]
	 */
	addRadioButton: function ( arg1, onClick, properties ) {
		return this._add( 'radiobutton', {
			arg1: arg1,
			properties: properties,
			onClick: onClick
		});
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {type} value      [description]
	 * @param  {type} maxValue   [description]
	 * @param  {type} onChange   [description]
	 * @param  {type} onChanging [description]
	 * @return {type}            [description]
	 */
	addScrollbar: function ( value, maxValue, onChange, onChanging ) {
		var scrollbar = this.obj.add( 'scrollbar', undefined, value, maxValue );
		scrollbar.onChange = onChange;
		scrollbar.onChanging = onChanging;
		return scrollbar;
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {type} value      [description]
	 * @param  {type} minValue   [description]
	 * @param  {type} maxValue   [description]
	 * @param  {type} onChange   [description]
	 * @param  {type} onChanging [description]
	 * @return {type}            [description]
	 */
	// TODO: Fix number of arguments
	// eslint-disable-next-line
	addSlider: function ( value, minValue, maxValue, onChange, onChanging ) {
		var slider = this.obj.add( 'slider', undefined, value, minValue, maxValue );
		slider.onChange = onChange;
		slider.onChanging = onChanging;
		return slider;
	},

	/**
	 * Adds a StaticText item to this Container
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {String} text     - StaticText text
	 * @param  {type} properties [description]
	 * @return {type}            [description]
	 */
	addStaticText: function ( text, properties ) {
		return this._add( 'statictext', {
			arg1: text,
			properties: properties
		});
	},

	/**
	 * Adds a tab item to this Container
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {String} text      - Tab label text
	 * @return {aeq.ui.Container} - Tab container object
	 */
	addTab: function ( text ) {
		var tab = this.obj.add( 'tab', undefined, text );
		return new ui.Container( tab );
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 * @return {type} [description]
	 */
	addTabbedPanel: function () {
		var tabbedpanel = this.obj.add( 'tabbedpanel' );
		return new ui.Container( tabbedpanel );
	},

	/**
	 * Adds a TreeView item to this Container
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {String[]} items    - Array of items to add to TreeView
	 * @param  {Function} onChange - onChange event handler
	 * @param  {any} properties    - Properties object
	 * @return {aeq.ui.TreeView}   - aeq.ui.TreeView object
	 */
	addTreeView: function ( items, onChange, properties ) {
		var newTreeView = this._add( 'treeview', {
			arg1: items,
			properties: properties,
			onChange: onChange
		});

		return new ui.TreeView( newTreeView );
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 */
	update: function () {
		this.obj.layout.layout( true );
		this.obj.layout.resize();
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 * @param  {type} obj [description]
	 */
	remove: function ( obj ) {
		if ( obj instanceof ui.Container ) {
			obj = obj.obj;
		}
		this.obj.remove( obj );
	},

	/**
	 * Remove all of the containers children
	 * @memberof aeq.ui.Container
	 * @param {type} obj [description]
	 */
	removeChildren: function ( obj ) {
		if ( obj instanceof ui.Container ) {
			obj = obj.obj;
		}
		for ( var i = obj.children.length - 1; i >= 0; i-- ) {
			obj.remove( obj.children[i] );
		}
	},

	/**
	 * Get all of the containers children
	 * @memberof aeq.ui.Container
	 * @return {type}     [description]
	 */
	getChildren: function () {
		return this.obj.children;
	},

	/**
	 * [description]
	 * @method
	 * @memberof aeq.ui.Container
	 */
	removeAll: function () {
		for ( var i = this.obj.children.length - 1; i >= 0; i-- ) {
			this.obj.remove( this.obj.children[i] );
		}
	}
};

// Aliases, backwards compatible
ui.Container.prototype.addListbox = ui.Container.prototype.addListBox;
ui.Container.prototype.addStatictext = ui.Container.prototype.addStaticText;
ui.Container.prototype.addTreeview = ui.Container.prototype.addTreeView;

( function createControllerSetters() {
	var oneParameters = [ 'enabled', 'helpTip', 'orientation', 'text', 'visible' ],
		twoParameters = [
			'alignChildren',
			'alignment',
			'location',
			'maximumSize',
			'minimumSize',
			'preferredSize',
			'size'
		],
		fourParameters = [ 'bounds', 'margins' ];

	aeq.forEach( oneParameters, function ( type ) {
		ui.Container.prototype[type] = function ( newValue ) {
			if ( newValue === undefined ) {
				return this.obj[type];
			}
			this.obj[type] = newValue;
		};
	});

	function multiParameter( type, numParameters ) {
		return function ( newValue ) {
			if ( newValue === undefined ) {
				return this.obj[type];
			}
			if ( arguments.length === numParameters ) {
				newValue = Array.apply( null, arguments );
			} else {
				newValue = arguments[0];
			}
			this.obj[type] = newValue;
		};
	}

	aeq.forEach( twoParameters, function ( type ) {
		ui.Container.prototype[type] = multiParameter( type, 2 );
	});

	aeq.forEach( fourParameters, function ( type ) {
		ui.Container.prototype[type] = multiParameter( type, 4 );
	});
}() );

return ui;
}( aeq.ui || {}) );

aeq.ui = ( function ( ui ) {
/**
 * ListBox UI class
 * @class
 * @memberof aeq
 * @param  {type} obj [description]
 */
ui.ListBox = function ( obj ) {
	this.obj = obj;
};

ui.ListBox.prototype = {
	toString: function () {
		return '[object aeq.ui.ListBox]';
	},

	extend: aeq.extend,

	/**
	 * Adds a ListItem to this ListBox
	 * @method
	 * @memberof aeq.ui.ListBox
	 * @param  {String} text  - ListItem Text
	 * @param  {Image} image  - ListItem Image
	 * @param  {Number} index - Index to insert ListItem in ListBox
	 * @return {ListItem}     - Created ListITem
	 */
	addItem: function ( text, image, index ) {
		var item = this.obj.add( 'item', text, index );

		if ( !aeq.isNullOrUndefined( image ) ) {
			item.image = image;
		}

		return item;
	},

	/**
	 * Removes a ListItem from this list
	 * @method
	 * @memberof aeq.ui.ListBox
	 * @param  {ListItem} [item] - ListItem to remove; defaults to selection
	 */
	removeItem: function ( item ) {
		item = aeq.setDefault( item, this.obj.selection );

		if ( aeq.isNullOrUndefined( item ) ) {
			return;
		}

		this.obj.remove( item );
	},

	/**
	 * Removes all ListItems from this ListBox
	 * @method
	 * @memberof aeq.ui.ListBox
	 */
	removeAll: function ( ) {
		while ( this.obj.items.length > 0 ) {
			var item = this.obj.items[0];
			this.removeItem( item );
		}
	},

	/**
	 * Gets ancestor of item
	 * @method
	 * @memberof aeq.ui.ListBox
	 * @param  {ListItem} item - Item to get ancestor of
	 * @return {ListItem}      - Ancestor node
	 */
	getAncestor: function ( item ) {
		while ( item.parent.constructor.name !== 'ListBox' ) {
			item = item.parent;
		}

		return item;
	},

	/**
	 * Adds a multi-dimensional row to a list
	 * @method
	 * @memberof aeq.ui.ListBox
	 * @param  {String[]} itemArray - String array for row columns
	 * @return {ListItem}           - Created row
	 */
	addRow: function ( itemArray ) {
		var root = this.getAncestor( this.obj ).parent;

		if ( aeq.isNullOrUndefined( root.properties ) ) {
			return;
		}

		var numColumns = root.properties.numberOfColumns;
		var maxItems = itemArray.length > numColumns ? numColumns : itemArray.length;

		var item = this.addItem( itemArray[0] );

		for ( var i = 0, il = maxItems - 1; i < il; i++ ) {
			item.subItems[i].text = itemArray[i + 1];
		}

		return item;
	},

	/**
	 * Checks whether a selection in a list is contiguous
	 * @method
	 * @memberof aeq.ui.ListBox
	 * @param {ListItem[]} sel - Selection in a list
	 * @returns {Boolean}      - Whether the selection is contiguous
	 */
	contiguous: function ( sel ) {
		if ( !aeq.isArray( sel ) ) {
			return true;
		}

		var firstIndex = sel[0].index;
		var lastIndex = sel[sel.length - 1].index;

		return sel.length === ( lastIndex - firstIndex + 1 );
	},

	/**
	 * Moves selected item(s) up in a list
	 * @method
	 * @memberof aeq.ui.ListBox
	 */
	moveUp: function () {
		var items = this.obj.items;
		var selection = this.obj.selection;
		var i;

		if ( aeq.isNullOrUndefined( selection ) ) {
			return;
		}

		var first = selection.index;
		var last = first + 1;

		if ( !aeq.isNullOrUndefined( this.obj.properties ) && this.obj.properties.multiselect ) {
			selection = selection.sort( function ( a, b ) {
				return a.index - b.index;
			});

			if ( !this.contiguous( selection ) ) {
				return;
			}

			first = selection[0].index;
			last = first + selection.length;
		}

		if ( first === 0 ) {
			return;
		}

		for ( i = first; i < last; i++ ) {
			var thisItem = items[i];
			var lastItem = items[i - 1];

			this.swap( thisItem, lastItem );
		}

		this.obj.selection = null;

		for ( i = first - 1; i < last - 1; i++ ) {
			this.obj.selection = i;
		}
	},

	/**
	 * Moves selected item(s) down in a list
 	 * @method
	 * @memberof aeq.ui.ListBox
	 */
	moveDown: function () {
		var selection = this.obj.selection;
		var items = this.obj.items;
		var i;

		if ( aeq.isNullOrUndefined( selection ) ) {
			return;
		}

		var last = selection.index;
		var first = last;

		if ( !aeq.isNullOrUndefined( this.obj.properties ) && this.obj.properties.multiselect ) {
			selection = selection.sort( function ( a, b ) {
				return a.index - b.index;
			});

			if ( !this.contiguous( selection ) ) {
				return;
			}

			first = selection[0].index;
			last = selection[selection.length - 1].index;
		}

		if ( last === items.length - 1 ) {
			return;
		}

		for ( i = last; i >= first; i-- ) {
			var thisItem = items[i];
			var nextItem = items[i + 1];

			this.swap( thisItem, nextItem );
		}

		this.obj.selection = null;

		for ( i = first + 1; i <= last + 1; i++ ) {
			this.obj.selection = i;
		}
	},

	/**
	 * Moves selected item(s) to the top of a list
 	 * @method
	 * @memberof aeq.ui.ListBox
	 */
	moveToTop: function () {
		var selection = this.obj.selection;
		var items = this.obj.items;
		var i;
		var il;

		if ( aeq.isNullOrUndefined( selection ) ) {
			return;
		}

		var first = selection.index;
		var last = first + 1;

		if ( !aeq.isNullOrUndefined( this.obj.properties ) && this.obj.properties.multiselect ) {
			selection = selection.sort( function ( a, b ) {
				return a.index - b.index;
			});

			if ( !this.contiguous( selection ) ) {
				return;
			}

			first = selection[0].index;
			last = first + selection.length;
		}

		if ( first === 0 ) {
			return;
		}

		for ( var j = 0, jl = first; j < jl; j++ ) {
			for ( i = first; i < last; i++ ) {
				var thisItem = items[i - j];
				var lastItem = items[i - j - 1];

				this.swap( thisItem, lastItem );
			}
		}

		this.obj.selection = null;

		for ( i = 0, il = last - first; i < il; i++ ) {
			this.obj.selection = i;
		}
	},

	/**
	 * Moves selected item(s) to the bottom of a list
 	 * @method
	 * @memberof aeq.ui.ListBox
	 */
	moveToBottom: function () {
		var selection = this.obj.selection;
		var items = this.obj.items;
		var i;
		var il;

		if ( aeq.isNullOrUndefined( selection ) ) {
			return;
		}

		var last = selection.index;
		var first = last;

		if ( !aeq.isNullOrUndefined( this.obj.properties ) && this.obj.properties.multiselect ) {
			selection = selection.sort( function ( a, b ) {
				return a.index - b.index;
			});

			if ( !this.contiguous( selection ) ) {
				return;
			}

			first = selection[0].index;
			last = selection[selection.length - 1].index;
		}

		if ( last === items.length - 1 ) {
			return;
		}

		var spanLength = items.length - last - 1;

		for ( var j = 0, jl = spanLength; j < jl; j++ ) {
			for ( i = last; i >= first; i-- ) {
				var thisItem = items[i + j];
				var nextItem = items[i + j + 1];

				this.swap( thisItem, nextItem );
			}
		}

		this.obj.selection = null;

		for ( i = spanLength + first, il = items.length; i < il; i++ ) {
			this.obj.selection = i;
		}
	},

	/**
	 * Swaps two listItems
 	 * @method
	 * @memberof aeq.ui.ListBox
	 * @param {ListItem} a Item to swap from
	 * @param {ListItem} b Item to swap to
	 */
	swap: function ( a, b ) {
		var temp = a.text;
		a.text = b.text;
		b.text = temp;
	},

	/**
	 * Gets the selection in a list
 	 * @method
	 * @memberof aeq.ui.ListBox
 	 * @returns {ListItem[]} Array of selected items
	 */
	getSelection: function () {
		var selection = this.obj.selection;

		if ( aeq.isNullOrUndefined( selection ) ) {
			return aeq.arrayEx();
		}

		return aeq.arrayEx( selection );
	}

};

// Aliases, backwards compatible
ui.ListBox.prototype.add = ui.ListBox.prototype.addItem;

return ui;
}( aeq.ui || {}) );

/**
 * [description]
 * @namespace aeq.ui
 * @memberof aeq
 */
aeq.ui = ( function ( ui ) {
/**
 * Creates a UI Main Window
 * @method
 * @memberof aeq.ui
 * @param  {Panel}   thisObj                   [description]
 * @param  {string}  title                     Title of the window
 * @param  {Object}  [options]                 Options for the function
 * @param  {boolean} [options.resizeable=true] `true` for resizable window
 * @return {type}                              Created window
 */
ui.createMainWindow = function ( thisObj, title, options ) {
	if ( aeq.isPanel( thisObj ) ) {
		return new ui.Window( thisObj );
	}

	if ( aeq.isString( thisObj ) ) {
		options = title;
		title = thisObj;
	}
	options = aeq.setDefault( options, { resizeable: true });

	var root = new Window( 'palette', title, undefined, options );

	aeq.ui.root = root;

	return new ui.Window( root );
};

/**
 * Creates a UI Window
 * @method
 * @memberof aeq.ui
 * @param  {string}  title                     Title of the window
 * @param  {Object}  [options]                 Options for the function
 * @param  {boolean} [options.resizeable=true] `true` for resizable window
 * @return {type}                              Created window
 */
ui.createWindow = function ( title, options ) {
	options = aeq.setDefault( options, { resizeable: true });
	var newWindow = new Window( 'palette', title, undefined, options );
	return new ui.Window( newWindow );
};

/**
 * Creates a UI Dialog
 * @method
 * @memberof aeq.ui
 * @param  {string}  title                     Title of the dialog
 * @param  {Object}  [options]                 Options for the function
 * @param  {boolean} [options.resizeable=true] `true` for resizable dialog
 * @return {type}                              Created dialog
 */
ui.createDialog = function ( title, options ) {
	options = aeq.setDefault( options, { resizeable: true });
	var newWindow = new Window( 'dialog', title, undefined, options );
	return new ui.Window( newWindow );
};

/**
 * [description]
 * @method
 * @memberof aeq.ui
 * @param  {Function} callback [description]
 */
ui.ready = function ( callback ) {
	callback();
};

/**
 * [description]
 * @method
 * @memberof aeq.ui
 * @param  {type} obj     [description]
 * @param  {type} options [description]
 */
ui.set = function ( obj, options ) {
	for ( var option in options ) {
		if ( options.hasOwnProperty( option ) && option !== 'properties' && option !== 'arg1' ) {
			obj[option] = options[option];
		}
	}
};

return ui;
}( aeq.ui || {}) );

aeq.ui = ( function ( ui ) {
/**
 * TreeView UI class
 * @class
 * @memberof aeq
 * @param  {type} obj [description]
 */
ui.TreeView = function ( obj ) {
	this.obj = obj;
};

ui.TreeView.prototype = ui.ListBox.prototype;

ui.TreeView.prototype.toString = function () {
	return '[object aeq.ui.TreeView]';
};

/**
 * Reveals (expands) an item in a treeview by name
 *
 * @method
 * @memberof aeq.ui.TreeView
 * @param {String} name - Name of the node to reveal
 */
ui.TreeView.prototype.revealItem = function ( name ) {
	var tree = this.obj;
	var items = this.findItemByName( tree, [], name );

	if ( tree.items.length === 0 || items.length === 0 ) {
		tree.selection = null;
		return;
	}

	var item = items[0];
	var temp = item;

	while ( item.parent.constructor.name !== 'TreeView' ) {
		item.parent.expanded = true;
		item = item.parent;
	}

	tree.selection = temp;
	tree.active = true;
};

/**
 * Adds a node to a UITreeView
 *
 * @method
 * @memberof aeq.ui.TreeView
 * @param {String} text             Text to add to the node
 * @param {Image} [image]           Image to set as icon for the node
 * @param {Number} [index]          Index to add the node at
 * @param {Boolean} [expanded=true] Whether the node is expanded
 * @returns {aeq.ui.TreeView}       Node as TreeView item
 */
ui.TreeView.prototype.addNode = function ( text, image, index, expanded ) {
	expanded = aeq.setDefault( expanded, true );

	var node = this.obj.add( 'node', text, index );

	if ( !aeq.isNullOrUndefined( image ) ) {
		node.image = image;
	}

	node.expanded = expanded;

	return new ui.TreeView( node );
};

/**
 * Gets ancestor of item
 *
 * @method
 * @memberof aeq.ui.TreeView
 * @param {_Node} item - Node to get ancestor of
 * @returns {_Node}    - Ancestor item
 */
ui.TreeView.prototype.getAncestor = function ( item ) {
	while ( item.parent.constructor.name !== 'TreeView' ) {
		item = item.parent;
	}

	return item;
};

/**
 * Removes ancestor of node
 *
 * @method
 * @memberof aeq.ui.TreeView
 * @param {ListItem} item - Node to remove ancestor of
 */
ui.TreeView.prototype.removeAncestor = function ( item ) {
	var ancestor = this.getAncestor( item );
	this.removeItem( ancestor );
};

/**
 * Expands a node and all children
 *
 * @method
 * @memberof aeq.ui.TreeView
 * @param {_Node} node - Root node to expand children of
 */
ui.TreeView.prototype.expandNodes = function ( node ) {
	node.expanded = true;

	for ( var i = 0, il = node.items.length; i < il; i++ ) {
		var branch = node.items[i];
		if ( this.isNode( branch ) ) {
			this.expandNodes( branch );
		}
	}
};

/**
 * Collapses a node and all children
 *
 * @method
 * @memberof aeq.ui.TreeView
 * @param {_Node} node - Root node to collapse children of
 */
ui.TreeView.prototype.collapseNodes = function ( node ) {
	node.expanded = false;

	var branches = node.items;

	for ( var i = 0, il = branches.length; i < il; i++ ) {
		var branch = branches[i];
		if ( this.isNode( branch ) ) {
			this.collapseNodes( branch );
		}
	}
};


/**
 * Finds items by name in a node
 * @method
 * @memberof aeq.ui.TreeView
 * @param {_Node} node   - Container node
 * @param {_Node[]} list - Array of found items
 * @param {String} name  - Name to search in
 * @returns {_Node[]}    - Array of found items
 */
ui.TreeView.prototype.findItemByName = function ( node, list, name ) {
	var branches = node.items;

	for ( var i = 0, il = branches.length; i < il; i++ ) {
		var branch = branches[i];
		if ( branch.text !== name ) {
			continue;
		}

		if ( this.isNode( branch ) ) {
			this.findItemByName( branch, list, name );
		}

		list.push( branch );
	};

	return list;
};

/**
 * Creates a new node or branch based on an existing one
 *
 * @method
 * @memberof aeq.ui.TreeView
 * @param {_Node} node Node to copy
 * @param {_Node} nodeCopy New node or branch
 */
ui.TreeView.prototype.copyBranch = function ( node, nodeCopy ) {
	var newNode = nodeCopy.add( node.type, node.text );
	var me = this;

	if ( !this.isNode( node ) ) {
		return;
	}

	var branches = node.items;

	aeq.forEach( branches, function ( branch ) {
		if ( me.isNode( branch ) ) {
			me.copyBranch( branch, newNode );
		} else {
			newNode.add( 'item', node.text );
		}
	});
};

/**
 * Checks whether an branch is a node
 *
 * @method
 * @memberof aeq.ui.TreeView
 * @param {_Node} branch Branch to check
 * @returns {Boolean} Whether branch is node
 */
ui.TreeView.prototype.isNode = function ( branch ) {
	if ( aeq.isNullOrUndefined( branch ) ) {
		return false;
	}

	return branch.type === 'node';
};

/**
 * Checks whether a branch is an item

 * @method
 * @memberof aeq.ui.TreeView
 * @param {_Node} branch Branch to check
 * @returns {Boolean} Whether branch is item
 */
ui.TreeView.prototype.isItem = function ( branch ) {
	if ( aeq.isNullOrUndefined( branch ) ) {
		return false;
	}

	return branch.type === 'item';
};

/**
 * Moves selected item(s) up in a treeview
 *
 * @method
 * @memberof aeq.ui.TreeView
 */
ui.TreeView.prototype.moveUp = function () {
	var tree = this.obj;

	if ( tree.selection === null ) return;

	if ( tree.selection.index > 0 ) {
		var sel = tree.selection;
		var prev = sel.parent.items[sel.index - 1];

		if ( this.isItem( sel ) && this.isItem( prev ) ) {
			this.swap( sel, prev );
			tree.selection = prev;
			return;
		}

		if ( this.isNode( sel ) && this.isItem( prev ) ) {
			sel.parent.add( 'item', prev.text, sel.index + 1 );
			this.removeItem( sel );
			return;
		}

		if ( this.isItem( sel ) && this.isNode( prev ) ) {
			tree.selection = sel.parent.add( 'item', sel.text, sel.index - 1 );
			this.removeItem( sel );
			return;
		}

		var target = sel.parent.add( 'node', sel.text, sel.index - 1 );

		for ( var i = 0, il = target.length; i < il; i++ ) {
			this.copyBranch( sel.items[i], target );
		}

		tree.selection = target;
		this.removeItem( sel );
	}
};

/**
 * Moves selected item(s) down in a treeview
 *
 * @method
 * @memberof aeq.ui.TreeView
 */
ui.TreeView.prototype.moveDown = function () {
	var tree = this.obj;

	if ( tree.selection === null ) return;

	if ( tree.selection.index < tree.items.length - 1 ) {
		var sel = tree.selection;
		var next = sel.parent.items[sel.index + 1];

		if ( this.isItem( sel ) && this.isItem( next ) ) {
			this.swap( sel, next );
			tree.selection = next;
			return;
		}

		if ( this.isNode( sel ) && this.isItem( next ) ) {
			sel.parent.add( 'item', next.text, sel.index - 1 );
			this.removeItem( next );
			return;
		}

		if ( this.isItem( sel ) && this.isNode( next ) ) {
			tree.selection = sel.parent.add( 'item', sel.text, sel.index + 1 );
			this.removeItem( sel );
			return;
		}

		var target = sel.parent.add( 'node', sel.text, sel.index + 2 );

		for ( var i = 0, il = target.length; i < il; i++ ) {
			this.copyBranch( sel.items[i], target );
		};

		tree.selection = target;
		this.removeItem( sel );
	}
};

return ui;
}( aeq.ui || {}) );

aeq.ui = ( function ( ui ) {
/**
	 * [description]
	 * @class
	 * @memberof aeq
	 * @param  {type} obj [description]
	 */
ui.Window = function ( obj ) {
	this.obj = obj;
};

ui.Window.prototype = ui.Container.prototype;

/**
 * [description]
 * @method
 * @memberof aeq.ui.Window
 * @return {type} [description]
 */
ui.Window.prototype.show = function () {
	this.layout();
	if ( aeq.isWindow( this.obj ) ) {
		return this.obj.show();
	}
};

/**
 * [description]
 * @method
 * @memberof aeq.ui.Window
 */
ui.Window.prototype.hide = function () {
	if ( aeq.isWindow( this.obj ) ) {
		this.obj.hide();
	}
};

/**
 * [description]
 * @method
 * @memberof aeq.ui.Window
 * @param  {type} value [description]
 */
ui.Window.prototype.close = function ( value ) {
	if ( aeq.isWindow( this.obj ) ) {
		this.obj.close( value );
	}
};

/**
 * [description]
 * @method
 * @memberof aeq.ui.Window
 */
ui.Window.prototype.layout = function () {
	this.obj.layout.layout( true );
	this.obj.layout.resize();
	this.obj.onResizing = this.obj.onResize = function () {
		this.layout.resize();
	};
};

return ui;
}( aeq.ui || {}) );
