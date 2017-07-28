function initializeD3() {

  var containerWidth = $("#graph-body").width();
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
                          // also depends on projections... what is the highest projection?
                          // get historical data, then calculate trend, then estimate goals

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
        .attr("y", -50)
        .attr("x", -80)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Scaled Score (SS)");

    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis)
    //

    // TODO ITEM 23
    svg.append("text")
        .attr("class", "graphTitle")
        .attr("y", 0)
        .attr("x", 20)
        .text("Goal Setting with Performance Projection");


    /************************************************/
    /*** here is where we start with student data ***/
    /************************************************/

    drawBenchmarks(svg, x, y, startDate, endDate);

    drawGoalLines(svg, x, y);
    drawHistoricalTests(svg, x, y);


}

/**
 * draws the starting test and the historical data
 */
function drawHistoricalTests(svg, x, y) {
    var data = myApp.data.getStudentHistoricalData();

    data.forEach(function(d) {
      d.date = parseDate(d.date);
    });

    var startTest = myApp.data.getStartTest()
    var endDate = myApp.data.getEndDate();

    data.push(startTest);

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
    var trendline = calculateTrendLine(data);

    log("" + trendline.m + "x + " + trendline.b);
    log(trendline.data);
    trendline.data.forEach(function(d) {
      log(d);
      log("score: " + d.score + "; scoreEst: " + d.scoreEst);
      log("" + x(d.date) + "," + y(d.scoreEst));

    });

    var drawTrendline = d3.svg.line()
        .x(function(d) {
          return x(d.date);
        })
        .y(function(d) {
          return y(d.scoreEst)
        });

    svg.append("path")
        .datum(trendline.data)
        .attr("class", "trendline trendBefore")
        .attr("d", drawTrendline);

    var projected = [{
      date: startTest.date,
      scoreEst: trendline.fun(startTest.date)
    }, {
      date: endDate,
      scoreEst: trendline.fun(endDate)
    }];

    svg.append("path")
        .datum(projected)
        .attr("class", "trendline trendProjected")
        .style("stroke-dasharray", ("4, 4"))
        .attr("d", drawTrendline);

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

       log("FIXME update buddy scores");
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


      var cukuSgp = myApp.data.getSgpFromSs(calculatedGoals.catchup.ss);
      // update text
      myApp.updater.updateBuddyScores({
        name: "Catch Up",
        rate: calculatedGoals.catchup.rate,
        ss: calculatedGoals.catchup.ss,
        pct: cukuSgp, // XXX Tianxin how to calculate this???
        sgp: cukuSgp // XXX Tianxin
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


  // HACK base these on real data

  var benchmark = [{date: startDate, score: 400}, {date: startDate, score: 520}, {date: endDate, score: 560}, {date: endDate, score: 400}];
  svg.append("path")
      .datum(benchmark)
      .attr("class", "passing benchmark")
      .attr("d", xyLine);

  svg.append("g")
      .attr("transform", "translate(0," + y(520) + ")")
    .append("text")
      .text("Benchmark")
      .attr("x", 5)
      .attr("y", 12)
      .attr("transform", "rotate(-10)");

  var onWatch = [{date: startDate, score: 400}, {date: startDate, score: 480}, {date: endDate, score: 520}, {date: endDate, score: 400}];
  svg.append("path")
      .datum(onWatch)
      .attr("class", "onWatch benchmark")
      .attr("d", xyLine);

  svg.append("g")
      .attr("transform", "translate(0," + y(480) + ")")
    .append("text")
      .text("On Watch")
      .attr("x", 5)
      .attr("y", 12)
      .attr("transform", "rotate(-10)");

  // REVIEW ITEM 21.b rotate text
  //  what is angle of line?
  // tan(angle) = (520 - 480) / (endDate - startDate)... too complicated for time given?
  var urgent = [{date: startDate, score: 400}, {date: startDate, score: 440}, {date: endDate, score: 480}, {date: endDate, score: 400}];

  svg.append("path")
      .datum(urgent)
      .attr("class", "urgent benchmark")
      .attr("d", xyLine);

  svg.append("g")
      .attr("transform", "translate(0," + y(440) + ")")
    .append("text")
      .text("Urgent")
      .attr("x", 5)
      .attr("y", 12)
      .attr("transform", "rotate(-10)");

      // TODO ITEM 21 add text labels?
};

var parseDate = d3.time.format("%d-%b-%y").parse;

/**
 * uses linear regression to calculate trend line
 */
function calculateTrendLine(data) {
  var x_mean = 0;
  var y_mean = 0;
  var term1 = 0;
  var term2 = 0;
  var n = data.length;

  data.forEach(function(d) {
    x_mean += +d.date;
    y_mean += +d.score;
  });

  x_mean /= n;
  y_mean /= n;

  var xr = 0;
  var yr = 0;

  data.forEach(function(d) {
    xr = +d.date - x_mean; // normalize
    yr = +d.score - y_mean; // normalize
    term1 += xr * yr;
    term2 += xr * xr;
  });

  var b1 = term1 / term2; // slope
  var b0 = y_mean - (b1 * x_mean); // y-intercept

  var yhat = [];
  for (var i=0; i< n; i++) {
    yhat.push(b0 + (+data[i].date * b1));
  }

  var newData = [];
  for (var i=0; i < n; i++) {
    newData.push({
      "scoreEst": yhat[i],
      "score": data[i].score,
      "date": +data[i].date
    });
  }

  return {
    data: newData,
    b: b0,
    m: b1,
    fun: function(x) { return b1 * x + b0}
  };

}
