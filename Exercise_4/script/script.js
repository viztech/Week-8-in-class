/*Start by setting up the canvas */
var margin = {t:50,r:50,b:100,l:50};
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


//domain and range
var startDate = new Date(2015,10,1),
    endDate = new Date(2016,2,10);
var scaleX = d3.time.scale().domain([startDate, endDate]).range([0,width]),
    scaleY = d3.scale.linear().domain([0,800]).range([height,0]);

//line generator
var line = d3.svg.line()
    .x(function(d){return scaleX(d.key)})
    .y(function(d){return scaleY(d.avgFare)})
    .interpolate('basis')
var area = d3.svg.area()
    .x(function(d){return scaleX(d.key)})
    .y0(function(d){return scaleY(d.minFare)})
    .y1(function(d){return scaleY(d.maxFare)})
    .interpolate('basis');

//axis generator
var axisX = d3.svg.axis()
    .orient('bottom')
    .tickSize(5)
    .ticks(d3.time.week)
    .tickFormat(d3.time.format('%Y-%m-%d'));
var axisY = d3.svg.axis()
    .orient('left')
    .tickSize(-width)
    .ticks(10);

//Draw axes
axisX.scale(scaleX);
axisY.scale(scaleY);
plot.append('g')
    .attr('class','axis axis-x')
    .attr('transform','translate(0,'+height+')')
    .call(axisX);
plot.append('g')
    .attr('class','axis axis-y')
    .call(axisY);
plot.select('.axis-x')
    .selectAll('text')
    .attr('transform','rotate(90)translate(40,0)')



//Import data with queue
queue()
    .defer(d3.csv,'data/bos-sfo-flight-fare.csv',parse)
    .defer(d3.csv,'data/metadata.csv',parseMetadata)
    .await(dataLoaded)

function dataLoaded(err,data,metadata){

    //Do the easy stuff first
    plot.selectAll('flight')
        .data(data)
        .enter()
        .append('circle').attr('class','flight')
        .attr('cx',function(d){return scaleX(d.travelDate)})
        .attr('cy',function(d){return scaleY(d.price)})
        .attr('r',2)
        .style('fill-opacity',.1);

}

function parse(d){
    return {
        price: +d.price,
        airline: d.airline,
        travelDate: new Date(d.travelDate)
    }
}

function parseMetadata(d){
}