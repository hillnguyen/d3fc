const pointSeries = fc
    .seriesWebglPoint()
    .crossValue(d => d.carat)
    .mainValue(d => d.price)
    .size(4)
    .defined(() => true)
    .equals(d => d.length)
    .decorate(program => {
        fc.webglFillColor([1, 0, 0, 1])(program);

        const gl = program.context();
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(
            gl.SRC_ALPHA,
            gl.ONE_MINUS_DST_ALPHA,
            gl.ONE,
            gl.ONE_MINUS_SRC_ALPHA
        );
    });

const xExtent = fc
    .extentLinear()
    .accessors([d => d.carat])
    .pad([0.1, 0.1]);
const yExtent = fc.extentLinear().accessors([d => d.price]);

d3.tsv('diamondData.tsv', d => ({
    carat: Number(d.carat),
    price: Number(d.price)
})).then(data => {
    const xScale = d3.scaleLinear().domain(xExtent(data));
    const xScaleCopy = xScale.copy();
    const yScale = d3.scaleLinear().domain(yExtent(data));
    const yScaleCopy = yScale.copy();

    const zoom = d3.zoom().on('zoom', () => {
        xScale.domain(d3.event.transform.rescaleX(xScaleCopy).domain());
        yScale.domain(d3.event.transform.rescaleY(yScaleCopy).domain());
        render();
    });

    const chart = fc
        .chartCartesian(xScale, yScale)
        .webglPlotArea(pointSeries)
        .xLabel('Mass (carats)')
        .yLabel('Price (US$)')
        .yTickFormat(d3.format('.3s'))
        .decorate(selection => {
            selection
                .enter()
                .select('.plot-area')
                .on('measure.range', () => {
                    xScaleCopy.range([0, d3.event.detail.width]);
                    yScaleCopy.range([d3.event.detail.height, 0]);
                })
                .call(zoom);
        });

    function render() {
        d3.select('#chart')
            .datum(data)
            .call(chart);
    }

    render();
});