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
        showBigassPopup()
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
    // TODO check to see if end date - start date < 8 weeks, and add appropriate bot buddy
    var diff = compareTestDates(wizardState.startTest.date, wizardState.goalEndDate);

    if(valid) {
      botBuddy = {
        message : 'You set a Goal End Date of ' + diff.weeks + ' from now. This should be enough time to measure growth',
        buttonOne : {
          text: 'great!',
          callback: function() {
            hideBotBuddy();
          }
        },
        buttonTwo : {
          text: 'learn more',
          callback: function() {
            // TODO what to do here
            log("TODO");
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
        message : 'You set a Goal End Date ' + diff.weeks + ' week' + (diff.weeks == 1 ? '': 's') + ' after the benchmark. Experts recommend a minimum of eight weeks for effective interventions. Are you sure that\'s enough time?',
        buttonOne : {
          text: 'yes',
          callback: function() {
            log("TODO");
            hideBotBuddy();
          }
        },
        buttonTwo : {
          text: 'learn more',
          callback: function() {
            // TODO what to do here
            log("TODO");
          }
        },
        buttonThree: {
          text: 'change date',
          callback: function() {
            // TODO what to do here
            log("TODO");
          }
        }
      };
      updateBotBuddy(botBuddy);
    }


  });

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

  return;
  //Testing bot buddy
  botBuddy.message = 'Try setting the SPG to be more accurated based on the student start date.';
  botBuddy.buttonOne.text = 'Button One';
  botBuddy.buttonOne.callback = testOne;
  botBuddy.buttonTwo.text = 'Button Two';
  botBuddy.buttonTwo.callback = testTwo;
	botBuddy.buttonThree.text = 'Button Three';
  botBuddy.buttonThree.callback = testThree;
  updateBotBuddy(botBuddy);



};

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

function showBigassPopup() {
  log("BIGASS POPUP NOW SHOWING");
  // TODO make a div for bigass popup, and populate it
}

function hideBotBuddy() {
  $(".jarvis").hide();
  log("SHOWING BOT BUDDY");
  // TODO remember what they clicked?
}

function showBotBuddy() {
  $(".jarvis").show();
  log("HIDING BOT BUDDY");
  // TODO remember what they clicked?
}

function testOne() {
	alert('you clicked button one');
}

function testTwo() {
	alert('you clicked button two');
}

function testThree() {
	alert('you clicked button three');
}

function getWizardState() {
  return wizardState;
}
