
function drawBars(data) {
    log(data);
    var m = data.moderate.ss;
    var ma = data.modAmbitious.ss;
    var cu = data.catchup.ss;

    var svgWidth = 500,
        svgHeight = 250;

    if(d3.select("svg")[0][0] != null) {
      // only add graph once
      return;
    }


    var svgContainer = d3.select("#graph-body").append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var barWidth = 30;

    var x = d3.scale.linear().range([0, svgWidth]);
    var y = d3.scale.linear().range([0, svgHeight]);
    //    console.log(Math.min)
    var min = Math.min(m, ma, cu);
    var max = Math.max(m, ma, cu);

    y.domain([min - 50, max + 50]);
    console.log(min);
    console.log(max);

    svgContainer.append("rect")
        .attr("id", "modBar")
        .attr("x", 0)
        .attr("y", svgHeight - y(m))
        .attr("width", barWidth)
        .attr("height", y(m))
        .on("click", function() {
          // TODO move to different function
          $("#ctl00_cp_Content_rb_Moderate").trigger("click");
          // TODO change text
        });

    svgContainer.append("rect")
        .attr("id", "modAmbBar")
        .attr("x", 0 + barWidth)
        .attr("y", svgHeight - y(ma))
        .attr("width", barWidth)
        .attr("height", y(ma))
        .on("click", function() {
          // TODO move to different function
          $("#ctl00_cp_Content_rb_ModAmbitious").trigger("click");
          // TODO change text
        });

    svgContainer.append("rect")
        .attr("id", "cukuBar")
        .attr("x", 0 + 2 * barWidth)
        .attr("y", svgHeight - y(cu))
        .attr("width", barWidth)
        .attr("height", y(cu))
        .on("click", function() {
          // TODO move to different function
          $("#ctl00_cp_Content_rb_CatchUp").trigger("click");
          // TODO change text
        });


}