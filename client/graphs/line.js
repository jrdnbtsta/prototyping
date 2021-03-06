
var socket = io.connect();

let queue = [];
let data = [];
let count = 0;

/////////////USE SOCKET DATA TO BUILD D3 GRAPH//////////////////////////////////

var margin = { top: 100, right: 20, bottom: 50, left: 120 };
var width = 1200 - margin.left - margin.right;
var height = 700 - margin.top - margin.bottom;

var svg = d3.select('.chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


socket.on('sendStreamData', (allData) => {
    console.log('all data: ', allData);

    queue = queue.concat(allData);

    console.log('queue', queue);
    console.log('data: ', data); 

    if (allData.length >= 15) {
      allData = allData.slice(-14);
    }
if(allData) {

  var xScale = d3.scaleLinear()
    // .domain([0, 200])
    .domain([
      d3.min(allData, d => d.xScale),
      Math.max(15, d3.max(allData, d => d.xScale))
    ])
    .range([0, width]);
  svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)

  svg
    .select('g')
    .call(d3.axisBottom(xScale).ticks(10));

  // Add the text label for the x axis
  svg.append("text")
    .attr('transform', 'translate(' + (width) + ' ,' + (height + margin.bottom) + ')')
    .style('text-anchor', 'end')
    .style('font-family', 'sans-serif')
    .style('font-size', '13px')
    .text('xLabel');

  var yScale = d3.scaleLinear()
    .domain([0, 15])
    .range([height, 0]);

  svg
    .append('g')
    .attr('class', 'yAxis');
  
  svg.select('.yAxis')
    .call(d3.axisLeft(yScale).ticks(10));

  svg.append("text")
        .attr("transform", "rotate(0)")
        .attr("y",-10)
        .attr("x", -40)
        .attr("dy", "1em")
        .attr('class', 'yLabel')
        .style("text-anchor", "end")
        .style('font-family', 'sans-serif')
        .style('font-size', '13px')
        .text("yLabel");

  var line = d3.line()
    .x(d => xScale(d.xScale))
    .y(d => yScale(d.yScale))
    //.curve(d3.curveCatmullRom.alpha(.5));

  d3.selectAll('path.line').remove();
  d3.selectAll('.dot').remove();

  svg
    .selectAll('.line')
    .data(allData)
    .enter()
    .append('path')
    .attr('class', 'line')
    .attr('d', d => line(allData))
    .style('stroke', '#5176B6')
    .style('stroke-width', 1)
    .style('fill', 'none')
    .style('stroke-linejoin','round');


svg.selectAll('.dot')
  .data(allData)
  .enter()
  .append('circle')
    .attr('class', 'dot')
    .attr('cx', line.x())
    .attr('cy', line.y())
    .attr('r', 3)
    .style('fill', 'white')
    .style('stroke-width', 1.5)
    .style('stroke', 'DodgerBlue');
}

})

setInterval(() => {
  if(queue.length > 1) {
    data.push(queue[count]);
    count++;
  }
}, 1000);



 

