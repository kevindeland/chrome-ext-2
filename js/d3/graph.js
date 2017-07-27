function initializeD3() {

  var containerWidth = $("#graph-body").width();
  var svgWidth = containerWidth,
      svgHeight = 250;
  log("width=" + svgWidth);
  log("height=" + svgHeight);

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
    var containerWidth = $("#graph-body").width() - margin.left - margin.right;
    //.width() - $(".legend").width() - margin.top - margin.bottom;//$(".modalTitle").width() - margin.left - margin.right;
    var svgWidth = containerWidth,
        svgHeight = 300 - margin.top - margin.bottom;


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

    // make start date come from past historical data
    var history = myApp.data.getStudentHistoricalData();
    history.forEach(function(d) {
      d.date = parseDate(d.date);
    });
    history.push(myApp.data.getStartTest());

    var earliestTest = history.reduce(function(prev, current) {
      return (prev.date < current.date) ? prev : current;
    });
    var startDate = earliestTest.date;



    var endDate = myApp.data.getEndDate();

    x.domain([startDate, endDate]);
    y.domain([400, 600]) // TODO min = lowest historical - margin
                          // max = highest graph  + margin

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

    // TODO ITEM 23

    /************************************************/
    /*** here is where we start with student data ***/
    /************************************************/

    drawBenchmarks(svg, x, y, startDate, endDate);


    drawHistoricalTests(svg, x, y);
    drawGoalLines(svg, x, y);

}

/**
 * draws the starting test and the historical data
 */
function drawHistoricalTests(svg, x, y) {
    var data = myApp.data.getStudentHistoricalData();

    data.forEach(function(d) {
      d.date = parseDate(d.date);
    });

    data.push(myApp.data.getStartTest());

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle") // FIXME make them diamonds
        .attr("class", "dot")
        .attr("r", function(d) {
          return d.ss ? 5 : 3;
        })
        .attr("cx", function(d) {
          return x(d.date);
        })
        .attr("cy", function(d) {
          return y(d.score);
        });

    // TODO ITEM 24: draw calculated trendline

};

/**
 * draw goal lines for all types
 */
 function drawGoalLines(svg, x, y) {

   var calculatedGoals = myApp.data.getCalculatedGoals();

   var startingPoint = myApp.data.getStartTest();
   var endDate = myApp.data.getEndDate();

   var xyLine = d3.svg.line()
      .x(function(d) {
        return x(d.date);
      })
      .y(function(d) {
        return y(d.score);
      });

  var mod = [startingPoint, {date: endDate, score: calculatedGoals.moderate.ss}];
   svg.append("path")
      .datum(mod)
      .attr("id", "lineMod")
      .attr("class", "line moderate")
      .attr("d", xyLine)
      .on("click", function(){
          selectGoalLine("mod");
      });

   var cuku = [startingPoint, {date: endDate, score: calculatedGoals.catchup.ss}];
   svg.append("path")
      .datum(cuku)
      .attr("id", "lineCuku")
      .attr("class", "line cuku")
      .attr("d", xyLine)
      .on("click", function(){
        selectGoalLine("cuku");
      });

    var amb = [startingPoint, {date: endDate, score: calculatedGoals.modAmbitious.ss}];
    svg.append("path")
       .datum(amb)
       .attr("id", "lineAmb")
       .attr("class", "line ambitious")
       .style("stroke-dasharray", ("7, 3")) // NOTE how to do in CSS? http://www.d3noob.org/2013/01/making-dashed-line-in-d3js.html
       .attr("d", xyLine)
       .on("click", function(){

         selectGoalLine("amb");
       });

    var labelOffset = {
      x: 10,
      y: 10
    }

    svg.append("rect")
        .attr("x", x(startingPoint.date) + labelOffset.x)
        .attr("y", y(startingPoint.score) + labelOffset.y)
        .attr("width", 120)
        .attr("height", 25)
        .attr("id", "startTestPopup");

    // TODO add little arrow... harder than it looks?
    // var speechBubble = [
    //   {x: startingPoint.date, y: startingPoint.score},
    //   {x: startingPoint.date}
    // ]

    svg.append("text")
        .attr("x", x(startingPoint.date) + labelOffset.x + 10)
        .attr("y", y(startingPoint.score) + labelOffset.y + 10)
        .text("Starting Test");

    var formatDate = d3.time.format("%b %d");
    svg.append("text")
        .attr("x", x(startingPoint.date) + labelOffset.x + 10)
        .attr("y", y(startingPoint.score) + labelOffset.y + 10 + 12)
        .text(formatDate(new Date(startingPoint.date)));

 }

 function selectGoalLine(goalType) {
   log("selectGoalLine: " + goalType);

   var calculatedGoals = myApp.data.getCalculatedGoals();

   switch(goalType) {
     /*** Moderate goal ***/
     case "mod":
       d3.select("#lineCuku").attr("class", "line cuku");
       d3.select("#lineMod").attr("class", "line moderate selected");
       d3.select("#lineAmb").attr("class", "line ambitious");

       $("#moderateGoal").addClass("goalButtonSelected");
       $("#moderatelyAmbitiousGoal").removeClass("goalButtonSelected");
       $("#cukuGoal").removeClass("goalButtonSelected");

       myApp.updater.updateBuddyScores({
         name: "Moderate",
         rate: calculatedGoals.moderate.rate,
         ss: calculatedGoals.moderate.ss,
         pct: 50,
         sgp: 50
       });

       $("#ctl00_cp_Content_rb_Moderate").trigger("click");

       break;

       /*** Moderately Ambitious goal ***/
     case "amb":
       d3.select("#lineCuku").attr("class", "line cuku");
       d3.select("#lineMod").attr("class", "line moderate");
       d3.select("#lineAmb").attr("class", "line ambitious selected");

       $("#moderateGoal").removeClass("goalButtonSelected");
       $("#moderatelyAmbitiousGoal").addClass("goalButtonSelected");
       $("#cukuGoal").removeClass("goalButtonSelected");

       myApp.updater.updateBuddyScores({
         name: "Ambitious",
         rate: calculatedGoals.modAmbitious.rate,
         ss: calculatedGoals.modAmbitious.ss,
         pct: 66,
         sgp: 66
       });

       $("#ctl00_cp_Content_rb_ModAmbitious").trigger("click");
       break;

       /*** Catchup Keepup Goal ***/
     case "cuku":
       // update line selections
      d3.select("#lineCuku").attr("class", "line cuku selected");
      d3.select("#lineMod").attr("class", "line moderate");
      d3.select("#lineAmb").attr("class", "line ambitious");

      $("#moderateGoal").removeClass("goalButtonSelected");
      $("#moderatelyAmbitiousGoal").removeClass("goalButtonSelected");
      $("#cukuGoal").addClass("goalButtonSelected");

      // update text
      myApp.updater.updateBuddyScores({
        name: "Catch Up",
        rate: calculatedGoals.catchup.rate,
        ss: calculatedGoals.catchup.ss,
        pct: "XX", // XXX Tianxin how to calculate this???
        sgp: "XX" // XXX Tianxin
      });

      // trigger a click on the radio button
      $("#ctl00_cp_Content_rb_CatchUp").trigger("click");
      break;
   }
 }

/**
 * ITEM 47 draw gray benchmark backgrounds
 */
function drawBenchmarks(svg, x, y, startDate, endDate) {

  var xyLine = d3.svg.line()
     .x(function(d) {
       return x(d.date);
     })
     .y(function(d) {
       return y(d.score);
     });


  // REVIEW base these on real data

  var benchmark = [{date: startDate, score: 400}, {date: startDate, score: 520}, {date: endDate, score: 560}, {date: endDate, score: 400}];
  svg.append("path")
      .datum(benchmark)
      .attr("class", "passing benchmark")
      .attr("d", xyLine);

  var onWatch = [{date: startDate, score: 400}, {date: startDate, score: 480}, {date: endDate, score: 520}, {date: endDate, score: 400}];
  svg.append("path")
      .datum(onWatch)
      .attr("class", "onWatch benchmark")
      .attr("d", xyLine);

  // REVIEW ITEM 21.b rotate text
  //  what is angle of line?
  // tan(angle) = (520 - 480) / (endDate - startDate)... too complicated for time given?
  var urgent = [{date: startDate, score: 400}, {date: startDate, score: 440}, {date: endDate, score: 480}, {date: endDate, score: 400}];

  svg.append("path")
      .datum(urgent)
      .attr("class", "urgent benchmark")
      .attr("d", xyLine);

      // TODO ITEM 21 add text labels?
};

var parseDate = d3.time.format("%d-%b-%y").parse;
