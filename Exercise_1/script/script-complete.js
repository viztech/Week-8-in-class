/*Start by setting up the canvas */
var margin = {t:50,r:100,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var plot = d3.select('.canvas')
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

    plot.append('path')
        .datum(coffee)
        .attr('class','coffee-data-area data-area')
        .attr('d',areaGenerator);
    plot.append('path')
        .datum(coffee)
        .attr('class','coffee-data-line data-line')
        .attr('d',lineGenerator);
    plot.selectAll('.coffee-data-point')
        .data(coffee)
        .enter()
        .append('circle')
        .attr('class','coffee-data-point data-point')
        .attr('r',3)
        .attr('cx',function(d){return scaleX(d.year)})
        .attr('cy',function(d){return scaleY(d.value)});


    plot.append('path')
        .datum(tea)
        .attr('class','tea-data-area data-area')
        .attr('d',areaGenerator);
    plot.append('path')
        .datum(tea)
        .attr('class','tea-data-line data-line')
        .attr('d',lineGenerator);
    plot.selectAll('.tea-data-point')
        .data(tea)
        .enter()
        .append('circle')
        .attr('class','tea-data-point data-point')
        .attr('r',3)
        .attr('cx',function(d){return scaleX(d.year)})
        .attr('cy',function(d){return scaleY(d.value)});


}

function parse(d){
    return {
        item: d.ItemName,
        year: +d.Year,
        value: +d.Value
    }
}