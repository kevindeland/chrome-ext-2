function initializeD3() {

  var containerWidth = $(".modalTitle").width();
  var svgWidth = containerWidth,
      svgHeight = 250;

  if(d3.select("svg")[0][0] != null) {
    // only add graph once
    return;
  }

  var svgContainer = d3.select("#graph-body").append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

}

function redrawAxes() {

    var containerWidth = $(".modalTitle").width();
    var svgWidth = containerWidth,
        svgHeight = 350;

    var margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    };

    $("svg").empty();

    var svgContainer = d3.select("svg");
    svgContainer
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    // FIXME see more here for formatting, etc
    // https://github.com/d3/d3-3.x-api-reference/blob/master/SVG-Axes.md#ticks
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(5);

    var startDate = myApp.data.getStartTest().date;
    log(startDate);

    var endDate = myApp.data.getEndDate();

    x.domain([startDate, endDate]);

    // draw x axis
    svgContainer.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,"+ height + ")") // shift down by height
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6);


}
