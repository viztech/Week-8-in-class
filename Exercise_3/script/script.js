//Get current time
var t;

//Convert that to milliseconds
var someDate = new Date(); //
console.log(someDate);

//What's the time 24 hours from now?
console.log('24 hours from now is: ');

//What's the year?
console.log('The year is: '+ someDate.getFullYear() );

//What's the month?
console.log('The month is: ' + someDate.getMonth() );

//What's the day of the month?
console.log( someDate.getDate() );

//What's the day of the week?



//Create a new d3.map()

//Set

//Get

//Parse metadata
d3.csv('data/metadata.csv',parse,function(metadata){
    console.log('metadata');
})
function parse(d){

};