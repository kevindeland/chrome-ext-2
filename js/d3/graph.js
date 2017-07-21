function initializeD3() {

  var containerWidth = $(".modalTitle").width();
  var svgWidth = containerWidth,
      svgHeight = 250;

  if(d3.select("svg")[0][0] != null) {
    // only add graph once
    return;
  }

  var svg = d3.select("#graph-body").append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

}

function redrawAxes() {

    var margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 60
    };

    var containerWidth = $(".modalTitle").width() - margin.left - margin.right;
    var svgWidth = containerWidth,
        svgHeight = 350 - margin.top - margin.bottom;


    $("svg").empty();

    var svg = d3.select("svg")
        .attr("width", svgWidth + margin.left + margin.right)
        .attr("height", svgHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var width = svgWidth;// - margin.left - margin.right;
    var height = svgHeight;// - margin.top - margin.bottom;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    // FIXME see more here for formatting, etc
    // https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md#ticks
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(5)
        .tickFormat(function(d) {
          // FIXME stack date and year
          // https://stackoverflow.com/questions/13241475/how-do-i-include-newlines-in-labels-in-d3-charts
          return d3.time.format("%b\n%y")(d);
        });

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    // TODO make start date come from past historical data
    var startDate = myApp.data.getStartTest().date;
    log(startDate);

    var endDate = myApp.data.getEndDate();

    x.domain([startDate, endDate]);
    y.domain([400, 600]) // FIXME dynamic

    // draw x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,"+ height + ")") // shift down by height
        .call(xAxis);
        // IF we want a label
        // .append("text")
        // .attr("class", "label")
        // .attr("x", width)
        // .attr("y", -6)
        // .style("text-anchor", "end")
        // .text("Date");


    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Scaled Score (SS)");

    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis)
    //


}
