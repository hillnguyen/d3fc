const rebindAll = require('../build/d3fc-rebind').rebindAll;

describe('rebindAll', function() {

    var source, target;

    function createProperty(value) {
        return function(arg) {
            if (!arguments.length) {
                return value;
            }
            value = arg;
            return source;
        };
    }

    beforeEach(function() {
        source = {
            scale: createProperty(),
            orient: createProperty(),
            tickValues: createProperty(),
            tickFormat: createProperty(),
            innerTickSize: createProperty(),
            outerTickSize: createProperty(),
            tickPadding: createProperty(),
            tickSubdivide: createProperty()
        };
        target = {};
    });

    it('should rebind all properties with the given prefix', function() {
        rebindAll(target, source, 'x');
        expect(target.xScale()).toEqual(source.scale());
        expect(target.xOrient()).toEqual(source.orient());
        expect(target.xTickValues()).toEqual(source.tickValues());
        expect(target.xTickFormat()).toEqual(source.tickFormat());
        expect(target.xInnerTickSize()).toEqual(source.innerTickSize());
        expect(target.xOuterTickSize()).toEqual(source.outerTickSize());
        expect(target.xTickPadding()).toEqual(source.tickPadding());
        expect(target.xTickSubdivide()).toEqual(source.tickSubdivide());
    });

    it('should rebind all properties without a prefix', function() {
        rebindAll(target, source, '');
        expect(target.scale()).toEqual(source.scale());
        expect(target.orient()).toEqual(source.orient());
        expect(target.tickValues()).toEqual(source.tickValues());
        expect(target.tickFormat()).toEqual(source.tickFormat());
        expect(target.innerTickSize()).toEqual(source.innerTickSize());
        expect(target.outerTickSize()).toEqual(source.outerTickSize());
        expect(target.tickPadding()).toEqual(source.tickPadding());
        expect(target.tickSubdivide()).toEqual(source.tickSubdivide());
    });

    it('should rebind all properties without a prefix if no prefix is supplied', function() {
        rebindAll(target, source);
        expect(target.scale()).toEqual(source.scale());
        expect(target.orient()).toEqual(source.orient());
        expect(target.tickValues()).toEqual(source.tickValues());
        expect(target.tickFormat()).toEqual(source.tickFormat());
        expect(target.innerTickSize()).toEqual(source.innerTickSize());
        expect(target.outerTickSize()).toEqual(source.outerTickSize());
        expect(target.tickPadding()).toEqual(source.tickPadding());
        expect(target.tickSubdivide()).toEqual(source.tickSubdivide());
    });

    it('should rebind excluding the indicated array of properties', function() {
        rebindAll(target, source, 'x', 'scale', 'orient');

        expect(target.xScale).not.toBeDefined();
        expect(target.xOrient).not.toBeDefined();

        expect(target.xTickValues()).toEqual(source.tickValues());
        expect(target.xTickFormat()).toEqual(source.tickFormat());
        expect(target.xInnerTickSize()).toEqual(source.innerTickSize());
        expect(target.xOuterTickSize()).toEqual(source.outerTickSize());
        expect(target.xTickPadding()).toEqual(source.tickPadding());
        expect(target.xTickSubdivide()).toEqual(source.tickSubdivide());
    });

    it('should rebind excluding the indicated property', function() {
        rebindAll(target, source, 'x', 'scale');

        expect(target.xScale).not.toBeDefined();

        expect(target.xOrient()).toEqual(source.orient());
        expect(target.xTickValues()).toEqual(source.tickValues());
        expect(target.xTickFormat()).toEqual(source.tickFormat());
        expect(target.xInnerTickSize()).toEqual(source.innerTickSize());
        expect(target.xOuterTickSize()).toEqual(source.outerTickSize());
        expect(target.xTickPadding()).toEqual(source.tickPadding());
        expect(target.xTickSubdivide()).toEqual(source.tickSubdivide());
    });

    it('should rebind excluding the indicated properties var-args', function() {
        rebindAll(target, source, 'x', 'scale', 'orient');

        expect(target.xScale).not.toBeDefined();
        expect(target.xOrient).not.toBeDefined();

        expect(target.xTickValues()).toEqual(source.tickValues());
        expect(target.xTickFormat()).toEqual(source.tickFormat());
        expect(target.xInnerTickSize()).toEqual(source.innerTickSize());
        expect(target.xOuterTickSize()).toEqual(source.outerTickSize());
        expect(target.xTickPadding()).toEqual(source.tickPadding());
        expect(target.xTickSubdivide()).toEqual(source.tickSubdivide());
    });

    it('should throw if an excluded property does not exist on the source', function() {
        expect(function() {
            rebindAll(target, source, 'x', 'fish');
        })
        .toThrow(new Error('Attempt to exclude fish which isn\'t a function on the source object'));
    });

    it('should support regular expression exclusions', function() {
        rebindAll(target, source, 'x', 'scale', /tick[\w]*/);

        expect(target.xScale).not.toBeDefined();
        expect(target.xTickValues).not.toBeDefined();
        expect(target.xTickFormat).not.toBeDefined();
        expect(target.xTickPadding).not.toBeDefined();
        expect(target.xTickSubdivide).not.toBeDefined();

        expect(target.xOrient()).toEqual(source.orient());
        expect(target.xInnerTickSize()).toEqual(source.innerTickSize());
        expect(target.xOuterTickSize()).toEqual(source.outerTickSize());
    });
});