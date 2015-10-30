/*Start by setting up the canvas */
var margin = {t:50,r:100,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var canvas = d3.select('.canvas');
var plot = canvas
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');


//Scales
var scaleX = d3.scale.linear().domain([1960,2015]).range([0,width]),
    scaleY = d3.scale.linear().domain([0,11000000]).range([height,0]);

//Axis
var axisX = d3.svg.axis()
    .orient('bottom')
    .scale(scaleX)
    .tickFormat( d3.format('d') ); //https://github.com/mbostock/d3/wiki/Formatting
var axisY = d3.svg.axis()
    .orient('right')
    .tickSize(width)
    .scale(scaleY);

//Draw axes
plot.append('g').attr('class','axis axis-x')
    .attr('transform','translate(0,'+height+')')
    .call(axisX);
plot.append('g').attr('class','axis axis-y')
    .call(axisY);

//TODO: Line generator
var lineGenerator = d3.svg.line()
    .x(function(d){ return scaleX(d.year)})
    .y(function(d){ return scaleY(d.value)})
    .interpolate('basis');

//TODO: Area generator
var areaGenerator = d3.svg.area()
    .x(function(d){ return scaleX(d.year)})
    .y0(height)
    .y1(function(d){ return scaleY(d.value)})
    .interpolate('basis');


//Import data with queue
queue()
    .defer(d3.csv,'data/fao_coffee_world_1963_2013.csv',parse)
    .defer(d3.csv,'data/fao_tea_world_1963_2013.csv',parse)
    .await(dataLoaded)

function dataLoaded(err,coffee,tea){

    //Append line elements
    plot.append('path')
        .attr('class','data-area');
    plot.append('path')
        .attr('class','data-line');

    draw(coffee);

    d3.selectAll('.btn').on('click',function(){
       var type = d3.select(this).attr('id');
        if(type=='coffee'){
            draw(coffee);
        }else{
            draw(tea);
        }
    });
}

function draw(dataSeries){
    plot.select('.data-area')
        .datum(dataSeries)
        .transition()
        .attr('d',areaGenerator);
    plot.select('.data-line')
        .datum(dataSeries)
        .transition()
        .attr('d',lineGenerator);

    var dots = plot.selectAll('.data-point')
        .data(dataSeries);
    var dotsEnter = dots.enter()
        .append('circle')
        .attr('class','data-point')
        .attr('r',3)
        .call(attachTooltip);
    dots.exit().transition().remove();
    dots
        .transition()
        .attr('cx',function(d){return scaleX(d.year)})
        .attr('cy',function(d){return scaleY(d.value)});
}

function attachTooltip(selection){
    selection
        .on('mouseenter',function(d){
            var tooltip = d3.select('.custom-tooltip');
            tooltip
                .transition()
                .style('opacity',1);

            tooltip.select('#type').html(d.item);
            tooltip.select('#year').html(d.year);
            tooltip.select('#value').html(d.value);
        })
        .on('mousemove',function(){
            var xy = d3.mouse(canvas.node());
            console.log(xy);

            var tooltip = d3.select('.custom-tooltip');

            tooltip
                .style('left',xy[0]+50+'px')
                .style('top',(xy[1]+50)+'px');

        })
        .on('mouseleave',function(){
            var tooltip = d3.select('.custom-tooltip')
                .transition()
                .style('opacity',0);
        })
}

function parse(d){
    return {
        item: d.ItemName,
        year: +d.Year,
        value: +d.Value
    }
}