//included by jasmine
/*global describe, it, expect, beforeEach, spyOn*/
//included by lodash
/*global _*/
//included by jlayout
/*global jLayout*/

var Component = function (x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};
Component.prototype.bounds = function (value) {
    if (value !== undefined) {
        _.merge(this, value);
    }
    return this;
};
Component.prototype.preferredSize = function () {
   return this; 
};
Component.prototype.minimumSize = function () {
    return this;
};
Component.prototype.isVisible= function () {
    return true;
};
Component.prototype.insets= function () {
    return {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };
};
Component.prototype.doLayout= function () {};

describe("Flow Layout", function () {
    var fst, snd, trd;
    var flow = function (func, container, options) {
        var defaultOptions = {
            alignment: 'right',
            items: [],
            hgap: 0,
            vgap: 0
        }; 

        if (options !== undefined) {
            defaultOptions = _.merge(
                defaultOptions,
                options
            );
        }
        return jLayout.flow(defaultOptions).layout(container);
    };
    var flowLayout = _.partial(flow, "layout");
    var myContainer = new Component(10, 20, 0.5, 0.5);
    var flowLayout_c = _.partial(flowLayout, myContainer);

    beforeEach(function () {
        fst = new Component(0,0,0.2,0.2);
        snd = new Component(0,0,0.2,0.2);
        trd = new Component(0,0,0.2,0.2);
    });

    describe ("layout-call", function () {

        it("shall position component on the left if aligned left, relative to the parents origin", function () {
            flowLayout_c({alignment:"left", items:[fst]});
            expect(fst.x).toBeCloseTo(0.0, 1);
        });

        it("shall position component on the right if aligned right, relative to the parents origin", function () {
            flowLayout_c({alignment:"right", items:[fst]});
            expect(fst.x).toBeCloseTo(myContainer.width - fst.width, 1);
        });

        it("shall position first component further to the left then the second component if aligned left", function () {
            flowLayout_c({alignment:"left", items:[fst, snd]});
            expect(fst.x < snd.x).toBe(true);
        });

        it("shall position first component further to the left then the second component even if aligned right", function () {
            flowLayout_c({alignment:"right", items:[fst, snd]});
            expect(fst.x < snd.x).toBe(true);
        });

        it("shall position third component in new row right most, then the first two components", function () {
            flowLayout_c({items:[fst, snd, trd]});
            expect(trd.x).toBeCloseTo(myContainer.width - trd.width);
            expect(trd.y > fst.y).toBe(true);
            expect(trd.y > snd.y).toBe(true);
        });
        it("shall except if component does not fit into far to small container", function () {
            var aTooSmallContainer = new Component(0,0,0.1,0.1);
            expect(_.partial(flowLayout, aTooSmallContainer, {items: [fst]})).toThrow(jLayout.OutOfBoundsError);
        });
        it("shall except if component does not fit into height of container", function () {
            var aTooSmallContainer = new Component(0,0,0.4,0.2);
            expect(_.partial(flowLayout, aTooSmallContainer, {items: [fst, snd, trd]})).toThrow(jLayout.OutOfBoundsError);
        });
        it("shall not exept if component does fit exactly into container", function () {
            var aExactlyFittingContainer = new Component(0,0,0.2,0.2);
            expect(_.partial(flowLayout, aExactlyFittingContainer, {items: [fst]})).not.toThrow();
        });
        it("shall exept if component does not fit into width of container", function () {
            var aTooSmallContainer = new Component (0,0,0.2,0.2);
            expect(_.partial(flowLayout, aTooSmallContainer, {items: [fst, snd]})).toThrow(jLayout.OutOfBoundsError);
        });
    });
});

