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

function redrawBars() {

    var containerWidth = $(".modalTitle").width();
    var svgWidth = containerWidth,
        svgHeight = 250;

    // might need?
    // svgWidth = d3.select("svg").innerWidth;
    // svgHeight = d3.select("svg").innerHeight;
    // if(typeof(svgWidth) == "string" && svgWidth.indexOf("px") >= 0) {
    //   svgWidth = svgWidth.split("px")[0];
    // }
    //
    // if(typeof(svgHeight) == "string" && svgHeight.indexOf("px") >= 0) {
    //   svgHeight = svgHeight.split("px")[0];
    // }

      // mixing jquery and d3!
    $("svg").empty();

    var svgContainer = d3.select("svg");
    svgContainer
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    log("width=" + svgWidth);
    log("height=" + svgHeight);


    var data = myApp.data.getCalculatedGoals();

    var m = data.moderate.ss;
    var ma = data.modAmbitious.ss;
    var cu = data.catchup.ss;

    var barWidth = svgWidth / 3;

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
