var myApp = myApp || {};

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
 * placeholder for getting student grade
 */
 myApp.data.getStudentGrade = function() {
   return "3rd";
 }

/**
 *  gets start test from the interface
 */
myApp.data.getStartTest = function() {

  var startScoreText = $("#ctl00_cp_Content_ddl_AnchorScore " + "option:selected").text();

  if(!startScoreText) {
    log("failed to get startScoreText because this is an already saved goal");
    startScoreText = $("#ctl00_cp_Content_sp_StartingScore").text();
  }

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

myApp.data.getCustomGoal = function() {

  var goal = {
    ss: undefined,
    pr: undefined,
    rate: undefined
  }

  function parseCalculatedPR(text) {
    regex = /^(\d{1,3}) PR \((-?\d{1,3}.\d{1}) SS\/week\)/
    parsedText = text.match(regex);

    return {
      pr: parsedText[1],
      rate: parsedText[2]
    };
  }

  function parseCalculatedSS(text) {
    regex = /^(\d{2,3}) SS \((-?\d{1,3}.\d{1}) SS\/week\)/
    parsedText = text.match(regex);

    return {
      ss: parsedText[1],
      rate: parsedText[2]
    }
  }

  var selectedOption = $("#ctl00_cp_Content_ddl_Custom option:selected").attr("value");
  var inputText = $("#ctl00_cp_Content_tb_Custom").val();
  if(inputText.length ==0) return undefined;

  var calculated = $("#ctl00_cp_Content_sp_CustomGoal").html();

  if(selectedOption == "CustomPR") {
    goal.pr = inputText;
    if(calculated) {
      var parsed = parseCalculatedSS(calculated);
      goal.ss = parsed.ss;
      goal.rate = parsed.rate;
    }
  } else if(selectedOption == "CustomSS") {
    goal.ss = inputText;
    if(calculated) {
      var parsed = parseCalculatedPR(calculated);
      goal.pr = parsed.pr;
      goal.rate = parsed.rate;
    }
  }

  // XXX

  return goal;
};

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
    var moderate = parseGoalData(moderateData.html());
    moderate.sgp = 50;

    var modAmbitious = parseGoalData(modAmbitiousData.html());
    modAmbitious.sgp = 66;

    var catchup = parseGoalData(catchupData.html());
    catchup.sgp = myApp.data.getSgpFromSs(0); // HACK

    return {
      moderate: moderate,
      modAmbitious: modAmbitious,
      catchup: catchup
    };
  }
}

/**
 * TODO implement this function
 */
myApp.data.getBenchmarkData = function() {

  var data;
  switch(myApp.data.getStudentGrade()) {

    // HACK need dynamic dates
    case "3rd":
      data =  {
        "10": {
          "scores": [
            {date: "1-Sep-16", score: 390},
            {date: "1-Jan-17", score: 430},
            {date: "1-May-17", score: 469},
            {date: "1-Sep-17", score: 462}
          ],
          "rate": 3.9
        },

        "20": {
          "scores": [
            {date: "1-Sep-16", score: 429},
            {date: "1-Jan-17", score: 473},
            {date: "1-May-17", score: 518},
            {date: "1-Sep-17", score: 511}
          ],
          "rate": 3.6
        },

        "25": {
          "scores": [
            {date: "1-Sep-16", score: 443},
            {date: "1-Jan-17", score: 488},
            {date: "1-May-17", score: 534},
            {date: "1-Sep-17", score: 527}
          ],
          "rate": 3.3
        },

        "40": {
          "scores": [
            {date: "1-Sep-16", score: 479},
            {date: "1-Jan-17", score: 525},
            {date: "1-May-17", score: 571},
            {date: "1-Sep-17", score: 563}
          ],
          "rate": 3.2
        },

        "50": {
          "scores": [
            {date: "1-Sep-16", score: 500},
            {date: "1-Jan-17", score: 547},
            {date: "1-May-17", score: 593},
            {date: "1-Sep-17", score: 585}
          ],
          "rate": 3.1
        }



      };
      break;
  }

  Object.keys(data).forEach(function(k) {
    log(k);
    data[k].scores.forEach(function(s) {
      s.date = +parseDate(s.date);
    });

  });

  log("DATA");
  log(data);

  return data;
  /*
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
  */
}

myApp.data.getSgpFromSs = function(ss) {
  // HACK
  var firstName = myApp.data.getStudentName().first;
  switch(firstName) {
    case "Amanda":
    return 63;

    case "Amber":
    return 65;

    case "Weston":
    return 67;

    case "Jennifer":
    return 59;
  }

}

/**
 * TODO use mock data
 */
myApp.data.getStudentHistoricalData = function() {

  var firstName = myApp.data.getStudentName().first;

  switch(firstName) {

    case "Amanda": // Baillie

    return [
      {date: "2-Sep-16", score: 480},
      {date: "14-Oct-16", score: 501},
      {date: "16-Nov-16", score: 479},
      {date: "26-Dec-16", score: 495}
    ]
    break;

    case "Amber": // Cheama
    return [
      {date: "2-Sep-16", score: 395},
      {date: "14-Oct-16", score: 415},
      {date: "16-Nov-16", score: 400},
      {date: "26-Dec-16", score: 440}
    ];

    case "Sean": // Begay
    return [];

    case "Jennifer": // Bingham
    return [];

    case "Weston": // Chavez
    return [];

  }
}
