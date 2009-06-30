/*!
 * jLayout Flow Layout - JavaScript Layout Algorithms v0.1
 *
 * Licensed under the new BSD License.
 * Copyright 2008-2009, Bram Stein
 * All rights reserved.
 */
/*global jLayout */
/*
(function () {
	jLayout = typeof jLayout === 'undefined' ? {} : jLayout;

	jLayout.flow = function (options) {
		var my = {},
			that = {};

		my.hgap = spec.hgap || 0;
		my.vgap = spec.vgap || 0;
		my.alignment = (spec.alignment && (spec.alignment === 'center' || spec.alignment === 'right' || spec.alignment === 'left') && spec.alignment) || 'left';
		
		that.items = function () {
			var r = [];
			Array.prototype.push.apply(r, my.items);
			return r;
		};

		that.layout = function (container) {
			var i = 0,
				insets = container.insets(),
				x = insets.left,
				y = insets.top,
				width = (container.bounds().width - (insets.left + insets.right),
				height = (container.bounds().height - (insets.top + insets.bottom),
				row = [],
				itemSize,
				rowSize = {
					width: 0,
					height: 0
				};

			for (; i < my.items.length; i += 1) {
				if (my.items[i].isVisible()) {
					itemSize = my.items[i].preferredSize();

					my.items[i].bounds(itemSize);
					row.push(my.items[i]);
					
					rowSize.height = Math.max(rowSize.height, itemSize.height + my.vgap);
					rowSize.width += itemSize.width + my.hgap;

					if (rowSize.width > container.bounds().width + (insets.left + insets.right)) {
						align(row, y, parentInsets, rowDimension, parentDimension);
						row.clear();

						y += rowDimension.height;
						rowDimension.width = 0;
						rowDimension.height = 0;
					}
	
				}
			}
		};

		function typeLayout(type) {
			return function (container) {
				var i = 0, 
					width = 0, 
					height = 0, 
					typeSize,
					firstComponent = false,
					insets = container.insets();

				for (; i < my.items.length; i += 1) {
					if (my.items[i].isVisible()) {
						typeSize = my.items[i][type + 'Size']();
						height = Math.max(height, typeSize.height);
						width = Math.max(width, typeSize.width);
			
						if (firstComponent) {
							firstComponent = false;
						} else {
							width += my.hgap;
						}
					}
				}

				return {
					'width': width + insets.left + insets.right + my.hgap * 2,
					'height': height + insets.top + insets.bottom + my.vgap * 2
				};
			};
		}

		that.preferred = typeLayout('preferred');
		that.minimum = typeLayout('minimum');
		that.maximum = typeLayout('maximum');		

		return that;
	};
})();*/
