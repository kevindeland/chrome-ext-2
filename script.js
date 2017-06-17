LOG_LEVEL = 'debug';

window.onload = function (){
  //console.log("Hello World");

  var ids = [ "interventionNameTxt", "endDtTxt", "endDtCal", "startDtDropdown",
              "rbModerate", "rbModAmbitious", "rbCatchUp", "rbStayUp", "rbCustom",
              "ddCustom", "txtCustom",
              "btnCancel", "btnCalcGoal", "btnSave"];


  // holds the state of the GSW
  var wizardState = {
    interventionName: undefined,
    goalEndDate: undefined,
    startTest: {
      date: undefined,
      ss: undefined,
      pr: undefined
    },
    endGoal: {
      goalType: undefined,
      prOrSs: undefined,
      value: undefined
    },
    hasBeenCalculated: false
  };

  // holds the state of the bot buddy
  var botBuddy = {
    message: undefined,
    options: undefined
  };


  // intervention name
  var interventionNameTxt = $("#interventionNameTxt");

  interventionNameTxt.on('click', function() {
    log('begin editing intervention name');


  });

  interventionNameTxt.on('blur', function() {
    if(isValidName(interventionNameTxt.val())) {
      wizardState.interventionName = interventionNameTxt.val();
      log('done editing intervention name to ' + wizardState.interventionName);
    }
  });

  // Goal End Date
  var endDtTxt = $("#endDtTxt");
  endDtTxt.on('click', function() {
    log('begin editing end date');


  });

  endDtTxt.on('blur', function() {
    log('done editing end date');


  });

  // Goal End Date calender... function not available in this mockup
  var endDtCal = $("#endDtCal");


  // Start Date Dropdown
  var startDtDropdown = $("#startDtDropdown");
  startDtDropdown.on('click', function() {
    log('choosing start date');

  });

  startDtDropdown.on('change', function() {
    log('chose start date');

    // extracts date and score from dropdown
    var scoreText = $("#startDtDropdown option:selected").text();
    wizardState.goalEndDate = parseDropdownTestScore(scoreText);

    log(wizardState.goalEndDate);


  });



  // rb = radio button
  var rbModerate = $("#rbModerate");

  var rbModAmbitious = $("#rbModAmbitious");

  var rbCatchUp = $("#rbCatchUp");

  var rbStayUp = $("#rbStayUp");

  var rbCustom = $("#rbCustom");

  // dd = dropdown
  var ddCustom = $("#ddCustom");

  var txtCustom = $("#txtCustom");

  var btnCancel = $("#btnCancel");

  var btnCalcGoal = $("#btnCalcGoal");

  var btnSave = $("#btnSave");





  ids.forEach(function(id) {
    var elem = document.getElementById(id);
    elem.addEventListener('click', function() {
      console.log("clicked " + id);
    });
  });

};

// for parsing the score date
function parseDropdownTestScore(text) {
  regex = /^(\d{1,2}\/\d{1,2}\/\d{4}) \- (\d{1,3}) SS \/ (\d{1,3}) PR/
  parsedScoreText = text.match(regex);

  return {
    date: Date.parse(parsedScoreText[1]),
    ss: parsedScoreText[2],
    pr: parsedScoreText[3]
  }

}

// for validating intervention name
function isValidName(interventionName) {
   return interventionName.length > 0;
}

function log(string) {
  if(LOG_LEVEL == 'debug') console.log(string);
}
