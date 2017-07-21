myApp = {};

myApp.data = {};

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
