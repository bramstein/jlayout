/*!
 * jLayout Flow Layout - JavaScript Layout Algorithms v0.1
 *
 * Licensed under the new BSD License.
 * Copyright 2008-2009, Bram Stein
 * All rights reserved.
 */
/*global jLayout */
(function () {
	jLayout = typeof jLayout === 'undefined' ? {} : jLayout;

	jLayout.flow = function (options) {
		var my = {},
			that = {};

		my.hgap = options.hgap || 5;
		my.vgap = options.vgap || 5;
		my.items = options.items || [];
		my.alignment = (options.alignment && (options.alignment === 'center' || options.alignment === 'right' || options.alignment === 'left') && options.alignment) || 'left';		

		that.items = function () {
			var r = [];
			Array.prototype.push.apply(r, my.items);
			return r;
		};

		that.layout = function (container) {
			var parentSize = container.bounds(),
				insets = container.insets(),
				i = 0,
				len = my.items.length,
				itemSize,
				currentRow = [],
				rowSize = {
					width: 0,
					height: 0
				},
				offset = {
					x: insets.left + my.hgap,
					y: insets.top + my.vgap
				};

			parentSize.width -= insets.left + insets.right + my.hgap * 2;
			parentSize.height -= insets.top + insets.bottom + my.vgap * 2;

			for (; i < len; i += 1) {
				if (my.items[i].isVisible()) {
					itemSize = my.items[i].preferredSize();
					
					if ((rowSize.width + itemSize.width + my.hgap) > parentSize.width) {
						align(currentRow, offset, rowSize, parentSize);

						currentRow = [];
						offset.y += rowSize.height;
						offset.x = insets.left + my.hgap;
						rowSize.width = 0;
						rowSize.height = 0;
					}
					rowSize.height = Math.max(rowSize.height, itemSize.height + my.vgap);
					rowSize.width += itemSize.width + my.hgap;

					currentRow.push(my.items[i]);
				}
			}
			align(currentRow, offset, rowSize, parentSize);
			return container;
		};

		function align(row, offset, rowSize, parentSize) {
			var location = {
					x: offset.x,
					y: offset.y
				},
				i = 0,
				len = row.length;

			switch (my.alignment) {
				case 'center': {
					location.x += (my.hgap + parentSize.width - rowSize.width) / 2;
					break;
				}
				case 'right': {
					location.x += my.hgap + parentSize.width - rowSize.width;
					break;
				}
			}

			for (; i < len; i += 1) {
				location.y = offset.y;
				row[i].bounds(location);
				row[i].doLayout();
				location.x += row[i].bounds().width + my.hgap;
			}
		}

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
						width += Math.max(width, typeSize.width);
			
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
})();
