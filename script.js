LOG_LEVEL = 'debug';

window.onload = function (){
  //console.log("Hello World");

  var ids = [ "interventionNameTxt", "endDtTxt", "endDtCal", "startDtDropdown",
              "rbModerate", "rbModAmbitious", "rbCatchUp", "rbStayUp", "rbCustom",
              "ddCustom", "txtCustom",
              "btnCancel", "btnCalcGoal", "btnSave"];

  // TODO how to access teacher preferences?

  // TODO make more abstraction...
  // i.e. switch/case which accepts the event and the element

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
    message :  MESSAGES.intro.formatUnicorn({name: wizardState.studentName}),
    buttonOne : {
      text: MESSAGES.introButton1,
      callback: function() {
        showBigassPopup("sgp1")
      }
    },
    buttonTwo : {
      text: MESSAGES.introButton2,
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
        message : MESSAGES.interventionLengthLong.formatUnicorn({weeks: intToText(diff.weeks)}),
        buttonOne : {
          text: MESSAGES.greatButton,
          callback: function() {
            understandSgpBuddy();
          }
        },
        buttonTwo : {
          text: MESSAGES.learnMoreButton,
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
        message : MESSAGES.interventionLenghtShort.formatUnicorn({weeks: intToText(diff.weeks), weekPlural: (diff.weeks == 1 ? '': 's')}),
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
      message : MESSAGES.understandSgp,
      buttonOne : {
        text: MESSAGES.understandSgpYes,
        callback: function() {
          showBigassPopup("sgp2");
        }
      },
      buttonTwo : {
        text: MESSAGES.understandSgpNo,
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
      message : MESSAGES.understandScoreNumbers.formatUnicorn({testDate: dateString, name: studentName, percentile: percentile, percentileSuffix: percentileSuffix, scaledScore: scaledScore}),
      buttonOne : {
        text: MESSAGES.helpWithPRButton,
        callback: function() {
          showBigassPopup("pr");
        }
      },
      buttonTwo : {
        text: MESSAGES.helpWithSSButton,
        callback: function() {
          showBigassPopup("ss");
        }
      },
      buttonThree: {
        text: MESSAGES.maybeLater,
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
  // TODO NEXT make a div for bigass popup, and populate it
}

function hideBotBuddy() {
  $(".jarvis").hide();
  log("HIDING BOT BUDDY");
}

function showBotBuddy() {
  $(".jarvis").show();
  log("SHOWING BOT BUDDY");
}
