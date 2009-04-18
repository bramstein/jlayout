
/*!
 * jLayout JQuery Plugin v0.13
 *
 * Licensed under the new BSD License.
 * Copyright 2008-2009 Bram Stein
 * All rights reserved.
 */
/*global jQuery jLayout*/
if (jQuery && jLayout) {
	(function ($) {
		$.fn.layout = function (options) {
			var opts = $.extend({}, $.fn.layout.defaults, options);
			return $.each(this, function () {
				var element = $(this),
					o = $.metadata && element.metadata().layout ? $.extend(opts, element.metadata().layout) : opts;

				if (o.type === 'border') {
					$.each(['north', 'south', 'west', 'east', 'center'], function (i, name) {
						if (element.children().hasClass(name)) {
							o[name] = element.find('.' + name + ':first');
						}
					});
					element.data('jlayout', jLayout.border(o));
				}
				else if (o.type === 'grid') {
					o.items = [];
					element.children().each(function (i) {
						o.items[i] = $(this);
					});
					element.data('jlayout', jLayout.grid(o));
				}
				else if (o.type === 'flex-grid') {
					o.items = [];
					element.children().each(function (i) {
						o.items[i] = $(this);
					});
					element.data('jlayout', jLayout.flexGrid(o));
				}
				if (o.resize) {
					element.bounds(element.preferredSize());
				}
				element.doLayout();
				element.css({position: 'relative'});
				if ($.ui !== undefined) {
					element.addClass('ui-widget');
				}
			});
		};

		$.fn.layout.defaults = {
			resize: true,
			type: 'grid'
		};

		$.fn.doLayout = function () {
			if (this.data('jlayout')) {
				this.data('jlayout').layout(this);
			}
			this.css({position: 'absolute'});
		};

		$.fn.insets = function () {
			var p = this.padding(),
				b = this.border();
			return {'top': p.top, 
					'bottom': p.bottom + b.bottom + b.top, 
					'left': p.left, 
					'right': p.right + b.right + b.left};
		};

		$.fn.bounds = function (value) {
			var tmp = {};

			if (value) {
				if (value.x) {
					tmp.left = value.x;
				}
				if (value.y) {
					tmp.top = value.y;
				}
				if (value.width) {
					tmp.width = (value.width - (this.outerWidth(true) - this.width()));
					tmp.width = (tmp.width >= 0) ? tmp.width : 0;
				}
				if (value.height) {
					tmp.height = value.height - (this.outerHeight(true) - this.height());
					tmp.height = (tmp.height >= 0) ? tmp.height : 0;
				}
				this.css(tmp);
				return this;
			}
			else {
				tmp = this.position();
				return {'x': tmp.left,
						'y': tmp.top,
						'width': this.outerWidth(false),
						'height': this.outerHeight(false)};
			}
		};

		$.each(['min', 'max'], function (i, name) {
			$.fn[name + 'imumSize'] = function (value) {
				if (this.data('jlayout')) {
					return this.data('jlayout')[name + 'imum'](this);
				}
				else {
					return this[name + 'Size'](value);
				}
			};
		});

		$.fn.preferredSize = function () {
			var minSize,
				maxSize,
				margin = this.margin(),
				size = {width: 0, height: 0};

			if (this.data('jlayout')) {
				size = this.data('jlayout').preferred(this);

				minSize = this.minimumSize();
				maxSize = this.maximumSize();

				size.width += margin.left + margin.right;
				size.height += margin.top + margin.bottom;

				if (size.width < minSize.width || size.height < minSize.height) {
					size.width = Math.max(size.width, minSize.width);
					size.height = Math.max(size.height, minSize.height);
				}
				else if (size.width > maxSize.width || size.height > maxSize.height) {
					size.width = Math.min(size.width, maxSize.width);
					size.height = Math.min(size.height, maxSize.height);
				}
			}
			else {
				size.width = this.bounds().width + margin.left + margin.right;
				size.height = this.bounds().height + margin.top + margin.bottom;
			}
			return size;
		};
	})(jQuery);
}
