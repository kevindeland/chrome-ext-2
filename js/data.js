myApp = {};

myApp.data = {};

/**
 * gets student name from the interface
 */
myApp.data.getStudentName = function() {
  var studentNameDiv = $("#ctl00_cp_Content_td_Student")[0];
  var fullName = studentNameDiv.innerHTML;

  return {
    last: fullName.split(', ')[0],
    first: fullName.split(', ')[1]
  };
}

/**
 *  gets start test from the interface
 */
myApp.data.getStartTest = function() {

  var startScoreText = $("#ctl00_cp_Content_ddl_AnchorScore " + "option:selected").text();

  regex = /^(\d{1,2}\/\d{1,2}\/\d{4}) \- (\d{1,3}) SS \/ (\d{1,3}) PR/
  parsedScoreText = startScoreText.match(regex);

  return {
    date: Date.parse(parsedScoreText[1]),
    ss: parsedScoreText[2],
    pr: parsedScoreText[3],
    score: parsedScoreText[2]
  };
}

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

  function parseGoalData(text) {
    regex = /^(\d{1,3}\.\d{1}) SS\/week = (\d{1,4}) SS/
    parsedText = text.match(regex);

    return {
      rate: parsedText[1],
      ss: parsedText[2]
    };
  }

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

/**
 * TODO implement this function
 */
myApp.data.getBenchmarkData = function() {

  return {
    urgent: [
      {date: "1-Aug-16", score: 310},
      {date: "1-May-17", score: 400}
    ],
    onWatch: [
      {date: "1-Aug-16", score: 370},
      {date: "1-May-17", score: 460}
    ],
    benchmark: [
      {date: "1-Aug-16", score: 430},
      {date: "1-May-17", score: 520}
    ]

  };
}

/**
 * TODO use mock data
 */
myApp.data.getStudentHistoricalData = function() {

  var firstName = myApp.data.getStudentName().first;

  switch(firstName) {

    case "Amber":
    default:
    return [
      {date: "30-Aug-16", score: 395},
      {date: "14-Oct-16", score: 415},
      {date: "16-Nov-16", score: 400},
      {date: "26-Dec-16", score: 440}
    ];

  }
}
