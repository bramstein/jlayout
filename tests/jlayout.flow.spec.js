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
    var myContainer, fst, snd, trd;
    var flowLayout = function (container, options) {
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
    var flowLayout_c;

    beforeEach(function () {
        myContainer = new Component(10, 20, 0.5, 0.5);
        fst = new Component(0,0,0.2,0.2);
        snd = new Component(0,0,0.2,0.2);
        trd = new Component(0,0,0.2,0.2);
        flowLayout_c = _.partial(flowLayout, myContainer);
    });

    describe ("layout-call", function () {

        it("shall position component on the left if aligned left", function () {
            flowLayout_c({alignment:"left", items:[fst]});
            expect(fst.x).toBeCloseTo(0.0, 1);
            expect(fst.y).toBeCloseTo(0.0, 1);
        });

        it("shall position component on the right if aligned right", function () {
            flowLayout_c({alignment:"right", items:[fst]});
            expect(fst.x).toBeCloseTo(0.3, 1);
            expect(fst.y).toBeCloseTo(0.0, 1);
        });
    });
});

