
/*!
 * jLayout - JavaScript Layout Algorithms v0.2
 *
 * Licensed under the revised BSD License.
 * Copyright 2008, Bram Stein
 * All rights reserved.
 */
/*global jLayout */
jLayout = {
	layout : function (spec, shared) {
		var that = {},
			my = shared || {};

		my.hgap = spec.hgap || 0;
		my.vgap = spec.vgap || 0;

		/**
		 * Lay out the container using a layout algorithm.
		 */
		that.layout = function (container) {
			return container;
		};

		/**
		 * Return the preferred size of the container.
		 */
		that.preferred = function (container) {
			return {width: my.hgap, height: my.vgap};
		};

		/**
		 * Return the minimum size the container is allowed to have.
		 */
		that.minimum = function (container) {
			return {width: my.hgap, height: my.vgap};
		};

		/**
		 * Return the maximum size the container is allowed to have.
		 */
		that.maximum = function (container) {
			return {width: Number.MAX_VALUE, height: Number.MAX_VALUE};
		};
		return that;
	},

	/**
	 * Grid layout
	 */
	grid : function (spec) {
		var my = {},
			that = this.layout(spec, my),
			items = spec.items || [],
			// initialize the number of columns to the number of items
			// we're laying out.
			columns = spec.columns || items.length,
			rows = spec.rows || 0;

		if (rows > 0) {
			columns = Math.floor((items.length + rows - 1) / rows); 
		}
		else {
			rows = Math.floor((items.length + columns - 1) / columns);
		}

		that.layout = function (container) {
			var i, j,
				insets = container.insets(),
				x = insets.left,
				y = insets.top,
				width = (container.bounds().width - (insets.left + insets.right) - (columns - 1) * my.hgap) / columns,
				height = (container.bounds().height - (insets.top + insets.bottom) - (rows - 1) * my.vgap) / rows;

			for (i = 0, j = 1; i < items.length; i += 1, j += 1) {
				items[i].bounds({'x': x, 'y': y, 'width': width, 'height': height});

				if (columns <= rows) {
					if (j >= columns) {
						y += height + my.vgap;
						x = insets.left;
						j = 0;
					}
					else {
						x += width + my.hgap;
					}
				}
				else {
					if (j >= rows) {
						x += width + my.hgap;
						y = insets.top;
						j = 0;
					}
					else {
						y += height + my.vgap;
					}
				}
				items[i].doLayout();
			}
			return container;
		};

		function typeLayout(type) {
			return function (container) {
				var i, 
					width = 0, 
					height = 0, 
					type_size,
					insets = container.insets();

				for (i = 0; i < items.length; i += 1) {
					type_size = items[i][type + 'Size']();
					width = Math.max(width, type_size.width);
					height = Math.max(height, type_size.height);
				}
				return {'width': insets.left + insets.right + columns * width + (columns - 1) * my.hgap, 
						'height': insets.top + insets.bottom + rows * height + (rows - 1) * my.vgap};
			};
		}

		// this creates the min and preferred size methods, as they
		// only differ in the function they call.
		that.preferred = typeLayout('preferred');
		that.minimum = typeLayout('minimum');
		that.maximum = typeLayout('maximum');
		return that;
	},

	/**
	 * Border layout
	 */
	border : function (spec) {
		var my = {},
			that = this.layout(spec, my),
			east = spec.east,
			west = spec.west,
			north = spec.north,
			south = spec.south,
			center = spec.center;
		
		that.layout = function (container) {
			var size = container.bounds(),
				insets = container.insets(),
				top = insets.top,
				bottom = size.height - insets.bottom,
				left = insets.left,
				right = size.width - insets.right,
				tmp;

			if (north && north.isVisible()) {
				tmp = north.preferredSize();
				north.bounds({'x': left, 'y': top, 'width': right - left, 'height': tmp.height});
				north.doLayout();

				top += tmp.height + my.vgap;
			}
			if (south && south.isVisible()) {
				tmp = south.preferredSize();
				south.bounds({'x': left, 'y': bottom - tmp.height, 'width': right - left, 'height': tmp.height});
				south.doLayout();

				bottom -= tmp.height + my.vgap;
			}
			if (east && east.isVisible()) {
				tmp = east.preferredSize();
				east.bounds({'x': right - tmp.width, 'y': top, 'width': tmp.width, 'height': bottom - top});
				east.doLayout();

				right -= tmp.width + my.hgap;
			}
			if (west && west.isVisible()) {
				tmp = west.preferredSize();
				west.bounds({'x': left, 'y': top, 'width': tmp.width, 'height': bottom - top});
				west.doLayout();

				left += tmp.width + my.hgap;
			}
			if (center && center.isVisible()) {
				center.bounds({'x': left, 'y': top, 'width': right - left, 'height': bottom - top});
				center.doLayout();
			}
			return container;
		};

		function typeLayout(type) {
			return function (container) {
				var insets = container.insets(),
					width = 0,
					height = 0,
					type_size;

				if (east && east.isVisible()) {
					type_size = east[type + 'Size']();
					width += type_size.width + my.hgap;
					height = type_size.height;
				}
				if (west && west.isVisible()) {
					type_size = west[type + 'Size']();
					width += type_size.width + my.hgap;
					height = Math.max(type_size.height, height);
				}
				if (center && center.isVisible()) {
					type_size = center[type + 'Size']();
					width += type_size.width;
					height = Math.max(type_size.height, height);
				}
				if (north && north.isVisible()) {
					type_size = north[type + 'Size']();
					width = Math.max(type_size.width, width);
					height += type_size.height + my.vgap;
				}
				if (south && south.isVisible()) {
					type_size = south[type + 'Size']();
					width = Math.max(type_size.width, width);
					height += type_size.height + my.vgap;
				}

				return {'width': width + insets.left + insets.right, 
						'height': height + insets.top + insets.bottom};
			};
		}
		that.preferred = typeLayout('preferred');
		that.minimum = typeLayout('minimum');
		that.maximum = typeLayout('maximum');
		return that;
	}
};
