
var diameter = 960,
format = d3.format(",d"),
color = d3.scale.category20c();

var bubble = d3.layout.pack()
.sort(null)
.size([diameter, diameter])
.padding(1.5);




function drawBubbleChart(data, index) {
  var root = data.map(d => {
    if(index) {
      d.value = d.valueByMonth[index];
    }
    return d;
  })

  $("#chart").empty();

  var svg = d3.select("#chart").append("svg")
  .attr("width", diameter)
  .attr("height", diameter)
  .attr("class", "bubble");

  var node = svg.selectAll(".node")
  .data(bubble.nodes({children: root})
    .filter(function(d) { return !d.children; }))
  .enter().append("g")
  .attr("class", "node")
  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
  .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
  .attr("r", function(d) { return d.r; })
  .style("fill", function(d) { return color(d.packageName); });

  node.append("text")
  .attr("dy", ".3em")
  .style("text-anchor", "middle")
  .text(function(d) { return d.className.substring(0, d.r / 3); });

  d3.select(self.frameElement).style("height", diameter + "px");

}