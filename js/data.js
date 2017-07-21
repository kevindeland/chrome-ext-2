myApp = {};

myApp.data = {};

/**
 *  gets start test from the interface
 */
myApp.data.getStartTest = function() {

  var startScoreText = $("#ctl00_cp_Content_ddl_AnchorScore " + "option:selected").text();
  return parseDropdownTestScore(startScoreText);
}

// TODO bring in parseDropdownTestScore helper


myApp.data.getEndDate = function() {

  var goalEndDate = $("#ctl00_cp_Content_tb_Target");

  var enteredValue = goalEndDate[0].value;
  var date = Date.parse(enteredValue);
  log(date);
  if(isNaN(date)) return date;

  return Date.parse(enteredValue);

}

/**
 * gets calculated goals from the interface
 */
myApp.data.getCalculatedGoals = function() {

  var moderateData = $("#ctl00_cp_Content_sp_ModerateData");
  var modAmbitiousData = $("#ctl00_cp_Content_sp_ModAmbitiousData");
  var catchupData = $("#ctl00_cp_Content_sp_CatchUpData");

  // check if goals have been calculated
  if(moderateData.html().indexOf("Calculate") >= 0) {
    return null;
  } else {
    return {
      moderate: parseGoalData(moderateData.html()),
      modAmbitious: parseGoalData(modAmbitiousData.html()),
      catchup: parseGoalData(catchupData.html())
    };
  }
}

// TODO bring in my parseGoalData helper

/**
 * TODO implement this function
 */
myApp.data.getBenchmarkData = function() {

}

/**
 * TODO use mock data
 */
myApp.data.getStudentHistoricalData = function() {

}
