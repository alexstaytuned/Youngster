var colorMapper = {};

/**
Calculate luminocity. For more info, see:
http://stackoverflow.com/questions/2273475/magic-colorref-rgb-value-to-determine-when-to-use-light-dark-text
*/
colorMapper.needs_light_text = function(color) {
	var color_hex;
	if(color.indexOf("#") == -1) {
		color_hex = this.map_color(color);
		if(! color_hex) {
			return false; /* default answer */
		} // else -- continue
	} else color_hex = color;
	
	var luminance = this.get_luminance(this.hexToR(color_hex), this.hexToG(color_hex), this.hexToB(color_hex));

	return luminance < 0.5;
}

colorMapper.get_luminance = function(red, green, blue) {
	return 0.3 * red + 0.59 * green + 0.11 * blue;
}

/* Convert R/G/B to a value between 0 and 1 */
colorMapper.hexToR = function(h) {return parseInt((this.cutHex(h)).substring(0,2),16) / 255}
colorMapper.hexToG = function(h) {return parseInt((this.cutHex(h)).substring(2,4),16) / 255}
colorMapper.hexToB = function(h) {return parseInt((this.cutHex(h)).substring(4,6),16) / 255}
colorMapper.cutHex = function(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

colorMapper.map_color = function(color_name) {
	var found_colors = $.grep(this.color_mappings, function(a_color) {
		return (a_color.name == color_name);
	});
	return (found_colors.length > 0 ? found_colors[0].hex : null);
}

colorMapper.color_mappings = [
{"name": "white", "hex": "#ffffff"},
{"name": "ivory", "hex": "#fffff0"},
{"name": "lightyellow", "hex": "#ffffe0"},
{"name": "yellow", "hex": "#ffff00"},
{"name": "snow", "hex": "#fffafa"},
{"name": "floralwhite", "hex": "#fffaf0"},
{"name": "lemonchiffon", "hex": "#fffacd"},
{"name": "cornsilk", "hex": "#fff8dc"},
{"name": "seashell", "hex": "#fff5ee"},
{"name": "lavenderblush", "hex": "#fff0f5"},
{"name": "papayawhip", "hex": "#ffefd5"},
{"name": "blanchedalmond", "hex": "#ffebcd"},
{"name": "mistyrose", "hex": "#ffe4e1"},
{"name": "bisque", "hex": "#ffe4c4"},
{"name": "moccasin", "hex": "#ffe4b5"},
{"name": "navajowhite", "hex": "#ffdead"},
{"name": "peachpuff", "hex": "#ffdab9"},
{"name": "gold", "hex": "#ffd700"},
{"name": "pink", "hex": "#ffc0cb"},
{"name": "lightpink", "hex": "#ffb6c1"},
{"name": "orange", "hex": "#ffa500"},
{"name": "lightsalmon", "hex": "#ffa07a"},
{"name": "darkorange", "hex": "#ff8c00"},
{"name": "coral", "hex": "#ff7f50"},
{"name": "hotpink", "hex": "#ff69b4"},
{"name": "tomato", "hex": "#ff6347"},
{"name": "orangered", "hex": "#ff4500"},
{"name": "deeppink", "hex": "#ff1493"},
{"name": "fuchsia", "hex": "#ff00ff"},
{"name": "magenta", "hex": "#ff00ff"},
{"name": "red", "hex": "#ff0000"},
{"name": "oldlace", "hex": "#fdf5e6"},
{"name": "lightgoldenrodyellow", "hex": "#fafad2"},
{"name": "linen", "hex": "#faf0e6"},
{"name": "antiquewhite", "hex": "#faebd7"},
{"name": "salmon", "hex": "#fa8072"},
{"name": "ghostwhite", "hex": "#f8f8ff"},
{"name": "mintcream", "hex": "#f5fffa"},
{"name": "whitesmoke", "hex": "#f5f5f5"},
{"name": "beige", "hex": "#f5f5dc"},
{"name": "wheat", "hex": "#f5deb3"},
{"name": "sandybrown", "hex": "#f4a460"},
{"name": "azure", "hex": "#f0ffff"},
{"name": "honeydew", "hex": "#f0fff0"},
{"name": "aliceblue", "hex": "#f0f8ff"},
{"name": "khaki", "hex": "#f0e68c"},
{"name": "lightcoral", "hex": "#f08080"},
{"name": "palegoldenrod", "hex": "#eee8aa"},
{"name": "violet", "hex": "#ee82ee"},
{"name": "darksalmon", "hex": "#e9967a"},
{"name": "lavender", "hex": "#e6e6fa"},
{"name": "lightcyan", "hex": "#e0ffff"},
{"name": "burlywood", "hex": "#deb887"},
{"name": "plum", "hex": "#dda0dd"},
{"name": "gainsboro", "hex": "#dcdcdc"},
{"name": "crimson", "hex": "#dc143c"},
{"name": "palevioletred", "hex": "#db7093"},
{"name": "goldenrod", "hex": "#daa520"},
{"name": "orchid", "hex": "#da70d6"},
{"name": "thistle", "hex": "#d8bfd8"},
{"name": "lightgrey", "hex": "#d3d3d3"},
{"name": "tan", "hex": "#d2b48c"},
{"name": "chocolate", "hex": "#d2691e"},
{"name": "peru", "hex": "#cd853f"},
{"name": "indianred", "hex": "#cd5c5c"},
{"name": "mediumvioletred", "hex": "#c71585"},
{"name": "silver", "hex": "#c0c0c0"},
{"name": "darkkhaki", "hex": "#bdb76b"},
{"name": "rosybrown", "hex": "#bc8f8f"},
{"name": "mediumorchid", "hex": "#ba55d3"},
{"name": "darkgoldenrod", "hex": "#b8860b"},
{"name": "firebrick", "hex": "#b22222"},
{"name": "powderblue", "hex": "#b0e0e6"},
{"name": "lightsteelblue", "hex": "#b0c4de"},
{"name": "paleturquoise", "hex": "#afeeee"},
{"name": "greenyellow", "hex": "#adff2f"},
{"name": "lightblue", "hex": "#add8e6"},
{"name": "darkgray", "hex": "#a9a9a9"},
{"name": "brown", "hex": "#a52a2a"},
{"name": "sienna", "hex": "#a0522d"},
{"name": "yellowgreen", "hex": "#9acd32"},
{"name": "darkorchid", "hex": "#9932cc"},
{"name": "palegreen", "hex": "#98fb98"},
{"name": "darkviolet", "hex": "#9400d3"},
{"name": "mediumpurple", "hex": "#9370db"},
{"name": "lightgreen", "hex": "#90ee90"},
{"name": "darkseagreen", "hex": "#8fbc8f"},
{"name": "saddlebrown", "hex": "#8b4513"},
{"name": "darkmagenta", "hex": "#8b008b"},
{"name": "darkred", "hex": "#8b0000"},
{"name": "blueviolet", "hex": "#8a2be2"},
{"name": "lightskyblue", "hex": "#87cefa"},
{"name": "skyblue", "hex": "#87ceeb"},
{"name": "gray", "hex": "#808080"},
{"name": "olive", "hex": "#808000"},
{"name": "purple", "hex": "#800080"},
{"name": "maroon", "hex": "#800000"},
{"name": "aquamarine", "hex": "#7fffd4"},
{"name": "chartreuse", "hex": "#7fff00"},
{"name": "lawngreen", "hex": "#7cfc00"},
{"name": "mediumslateblue", "hex": "#7b68ee"},
{"name": "lightslategray", "hex": "#778899"},
{"name": "slategray", "hex": "#708090"},
{"name": "olivedrab", "hex": "#6b8e23"},
{"name": "slateblue", "hex": "#6a5acd"},
{"name": "dimgray", "hex": "#696969"},
{"name": "mediumaquamarine", "hex": "#66cdaa"},
{"name": "cornflowerblue", "hex": "#6495ed"},
{"name": "cadetblue", "hex": "#5f9ea0"},
{"name": "darkolivegreen", "hex": "#556b2f"},
{"name": "indigo", "hex": "#4b0082	7130"},
{"name": "mediumturquoise", "hex": "#48d1cc"},
{"name": "darkslateblue", "hex": "#483d8b"},
{"name": "steelblue", "hex": "#4682b4"},
{"name": "royalblue", "hex": "#4169e1"},
{"name": "turquoise", "hex": "#40e0d0"},
{"name": "mediumseagreen", "hex": "#3cb371"},
{"name": "limegreen", "hex": "#32cd32"},
{"name": "darkslategray", "hex": "#2f4f4f"},
{"name": "seagreen", "hex": "#2e8b57"},
{"name": "forestgreen", "hex": "#228b22"},
{"name": "lightseagreen", "hex": "#20b2aa"},
{"name": "dodgerblue", "hex": "#1e90ff"},
{"name": "midnightblue", "hex": "#191970"},
{"name": "aqua", "hex": "#00ffff"},
{"name": "cyan", "hex": "#00ffff"},
{"name": "springgreen", "hex": "#00ff7f"},
{"name": "lime", "hex": "#00ff00"},
{"name": "mediumspringgreen", "hex": "#00fa9a"},
{"name": "darkturquoise", "hex": "#00ced1"},
{"name": "deepskyblue", "hex": "#00bfff"},
{"name": "darkcyan", "hex": "#008b8b"},
{"name": "teal", "hex": "#008080"},
{"name": "green", "hex": "#008000"},
{"name": "darkgreen", "hex": "#006400"},
{"name": "blue", "hex": "#0000ff"},
{"name": "mediumblue", "hex": "#0000cd"},
{"name": "darkblue", "hex": "#00008b"},
{"name": "navy", "hex": "#000080"},
{"name": "black", "hex": "#000000"}
];