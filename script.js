LOG_LEVEL = 'debug';

window.onload = function (){
  //console.log("Hello World");

  var ids = [ "interventionNameTxt", "endDtTxt", "endDtCal", "startDtDropdown",
              "rbModerate", "rbModAmbitious", "rbCatchUp", "rbStayUp", "rbCustom",
              "ddCustom", "txtCustom",
              "btnCancel", "btnCalcGoal", "btnSave"];


  // holds the state of the GSW
  var wizardState = {
    studentName: undefined,
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
		buttonOne: {
			text: undefined,
			callback: undefined
		},
		buttonTwo: {
			text: undefined,
			callback: undefined
		},
		buttonThree: {}
  };

  /**
   * initial state
   */
  wizardState.studentName = 'Kathryn';
  var scoreText = $("#startDtDropdown option:selected").text();
  wizardState.startTest = parseDropdownTestScore(scoreText);

  /**
   * setting the initial buddy state
   */
  botBuddy = {
    message : 'I see you\'re setting a goal for ' + wizardState.studentName + '. Can I explain what the goal setting terms SGP and PR are?',
    buttonOne : {
      text: 'yes please',
      callback: function() {
        showBigassPopup("sgp1")
      }
    },
    buttonTwo : {
      text: 'maybe later',
      callback: function() {
        hideBotBuddy()
      }
    }
  };
  updateBotBuddy(botBuddy);


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
    var endDt = endDtTxt.val();
    log('done editing end date ' + endDt);
    wizardState.goalEndDate = Date.parse(endDt);
    var diff = compareTestDates(wizardState.startTest.date, wizardState.goalEndDate);

    showInterventionLengthBuddy(diff);
  });

  /**
   * a buddy that helps adjust the intervention length
   */
  function showInterventionLengthBuddy(diff) {
    if(diff.valid) {
      botBuddy = {
        message : 'You set a Goal End Date of ' + intToText(diff.weeks) + ' weeks from now. This should be enough time to measure growth',
        buttonOne : {
          text: 'great!',
          callback: function() {
            understandSgpBuddy();
          }
        },
        buttonTwo : {
          text: 'learn more',
          callback: function() {
            showBigassPopup("weeks");
          }
        },
        buttonThree: {
          text: 'change date',
          callback: function() {
            hideBotBuddy();
          }
        }
      };
      updateBotBuddy(botBuddy);
    } else {
      botBuddy = {
        message : 'You set a Goal End Date ' + intToText(diff.weeks) + ' week' + (diff.weeks == 1 ? '': 's') + ' after the benchmark. Experts recommend a minimum of eight weeks for effective interventions. Are you sure that\'s enough time?',
        buttonOne : {
          text: 'yes',
          callback: function() {
            understandSgpBuddy();
          }
        },
        buttonTwo : {
          text: 'learn more',
          callback: function() {
            showBigassPopup("weeks");
          }
        },
        buttonThree: {
          text: 'change date',
          callback: function() {
            hideBotBuddy();
          }
        }
      };
      updateBotBuddy(botBuddy);
    }
  };

  /**
   * a buddy that asks to help understand SGP
   */
  function understandSgpBuddy() {
    botBuddy = {
      message : 'Understanding SGP can help you set ambitious yet attainable goals. Would you like me to help you understand?',
      buttonOne : {
        text: 'yes',
        callback: function() {
          showBigassPopup("sgp2");
        }
      },
      buttonTwo : {
        text: 'maybe later',
        callback: function() {
          understandNumbersBuddy();
        }
      }
    };
    updateBotBuddy(botBuddy);
  };

  /**
   * a buddy that asks to help understand SS and PR
   */
  function understandNumbersBuddy() {

    // TODO highlight Starting Test
    $("#startDtDropdown").addClass("highlight");

    var dateString = 'Dec, 12'; // TODO make it actual date
    var studentName = wizardState.studentName;
    var percentile = wizardState.startTest.pr;
    var percentileSuffix = getRankSuffix(percentile);
    var scaledScore = wizardState.startTest.ss;

    botBuddy = {
      message : 'As of the test on ' + dateString +  ', ' + studentName + ' was in the ' + percentile + percentileSuffix + ' percentile (PR)'
                  + ' with a scaled score (SS) of ' + scaledScore + '. Would you like me to help you understand what this means?',
      buttonOne : {
        text: 'please help me with PR',
        callback: function() {
          showBigassPopup("pr");
        }
      },
      buttonTwo : {
        text: 'please help me with SS',
        callback: function() {
          showBigassPopup("ss");
        }
      },
      buttonThree: {
        text: 'maybe later',
        callback: function() {
          hideBotBuddy();
          // TODO highlight calculate goal
        }
      }
    };
    updateBotBuddy(botBuddy);
  }

  // TODO figure out highlights



  // Goal End Date calendar... function not available in this mockup
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
    wizardState.startTest.date = parseDropdownTestScore(scoreText);
    log(wizardState.startTest.date);


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


  window.getWizardState = function() {
    return wizardState;
  }


};

//==============================
// UI Helpers
//==============================
function updateBotBuddy(botBuddy) {
  showBotBuddy();

	$('.messageText').html(botBuddy.message);

	if(botBuddy.buttonThree) {
		$('.buttonOne').removeClass('twoButtons').addClass('threeButtons').prop('value', botBuddy.buttonOne.text);
	  $('.buttonTwo').removeClass('twoButtons').addClass('threeButtons').prop('value', botBuddy.buttonTwo.text);
	  $('.buttonThree').show().prop('value', botBuddy.buttonThree.text);
    $('.buttonOne').prop('onclick',null).off('click');
		$('.buttonOne').on('click', botBuddy.buttonOne.callback);
    $('.buttonTwo').prop('onclick',null).off('click');
		$('.buttonTwo').on('click', botBuddy.buttonTwo.callback);
    $('.buttonThree').prop('onclick',null).off('click');
	  $('.buttonThree').on('click', botBuddy.buttonThree.callback);
	}
	else {
	  $('.buttonOne').removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonOne.text);
	  $('.buttonTwo').removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonTwo.text);
    $('.buttonOne').prop('onclick',null).off('click');
	  $('.buttonOne').on('click', botBuddy.buttonOne.callback);
    $('.buttonTwo').prop('onclick',null).off('click');
		$('.buttonTwo').on('click', botBuddy.buttonTwo.callback);
		$('.buttonThree').hide();
	}
}

function showBigassPopup(topic) {
  log("BIGASS POPUP FOR $" +  topic + " NOW SHOWING");
  // TODO make a div for bigass popup, and populate it
}

function hideBotBuddy() {
  $(".jarvis").hide();
  log("HIDING BOT BUDDY");
}

function showBotBuddy() {
  $(".jarvis").show();
  log("SHOWING BOT BUDDY");
}

//==============================
// Assorted Helpers
//==============================
function log(string) {
  if(LOG_LEVEL == 'debug') {console.log(string)}
}

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


function intToText(int) {
  if(int > 24) return "" + int;

  return ["zero", "one", "two", "three", "four", "five", "six",
          "seven", "eight", "nine", "ten", "eleven", "twelve",
          "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
          "nineteen", "twenty", "twenty-one", "twenty-two", "twenty-three", "twenty-four"][int];
}

function getRankSuffix(int) {
  switch (int % 10) {
    case 1:
      return "st";
      break;
    case 2:
      return "nd";
      break;
    case 3:
      return "rd";
      break;
    default:
      return "th";
      break;
  }
}

function compareTestDates(startDt, endDt) {
  log("comparing test dates " + startDt + " " + endDt);

  days = Math.floor((endDt - startDt) / (1000 * 60 * 60 * 24));
  weeks = Math.floor((endDt - startDt) / (1000 * 60 * 60 * 24 * 7));
  valid = weeks >= 8;

  return {
    days: days,
    weeks: weeks,
    valid: valid
  };
}
/********* End Assorted Helpers *********/
