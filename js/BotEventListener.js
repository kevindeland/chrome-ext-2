
function BotEventListener() {
  log("BotEventListener()");


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

  /*** initialize ***/
  var studentNameDiv = $("#ctl00_cp_Content_td_Student")[0];
  var fullName = studentNameDiv.innerHTML;
  wizardState.studentName = fullName.split(', ')[1]; // only first name
  log("Student name: " + wizardState.studentName);

  var startScoreText = $("#ctl00_cp_Content_ddl_AnchorScore " + "option:selected").text();
  wizardState.startTest = parseDropdownTestScore(startScoreText);



  /*** Calculate Goal button ***/
  var calculateGoal = document.querySelectorAll("input[value=\"Calculate Goal\"]")[0];

  calculateGoal.addEventListener('mouseover', function() {

  });

  calculateGoal.addEventListener('mouseleave', function() {

  });

  /*** Intervention name text input ***/
  var interventionName = $("#ctl00_cp_Content_tb_Title");

  interventionName.on('focus', function() {
      botBuddy = {
        message: "Would you like some tips on how to name your intervention?",
        buttonOne: {
          text: "Sure",
          callback: function() {
            showInterventionNameHelp();
          }
        },
        buttonTwo: {
          text: "No Thanks",
          callback: hideBotBuddy
        }
      };
      updateBotBuddy(botBuddy);
  });

  function showInterventionNameHelp() {
    log("showInterventionNameHelp");

    botBuddy = {
      message: MESSAGES.interventionNameHelp1 + "\n" + MESSAGES.interventionNameHelp2,
      buttonOne: {
        text: "Got it",
        callback: hideBotBuddy
      },
      buttonTwo: null
    };
    updateBotBuddy(botBuddy);
  }

  interventionName.on('blur', function() {
    if(isValidName(interventionName.val())) {
      wizardState.interventionName = interventionName.val();
      log('done editing intervention name to ' + wizardState.interventionName);
      hideBotBuddy();
    }


  });


  /*** Setting the goal end date *()*/
  var goalEndDate = $("#ctl00_cp_Content_tb_Target");

  goalEndDate.on('change', function() {
    log('change goalEndDate');
  });

  // DOES NOT WORK!
  // TODO on click the calendar, check to see if GoalEndDate is valid, and is different
  goalEndDate.on('blur', function() {
    log('blur goalEndDate');

    wizardState.goalEndDate = Date.parse(goalEndDate[0].value)
    var diff = compareTestDates(wizardState.startTest.date, wizardState.goalEndDate);

    showInterventionLengthBuddy(diff);
  });

  // some divs do not appear until this button is clicked, so we
  // have to find them on click
  var datePickerTrigger = $(".ui-datepicker-trigger");
  datePickerTrigger.on('click', function() {
    log('clicked datePickerTrigger');

    addEventToCalendarPopup();
  });

/*
  var calendarPopupDiv = $("#ui-datepicker-div");
  calendarPopupDiv.on('hide', function() {
    log("closed it");
  });
  calendarPopupDiv.on('hide', function() {
    log("closed it");
  });
  */

  function addEventToCalendarPopup() {
    log("addEventToCalendarPopup");

    function addEventToCalendarDates() {
      var calendar = $(".ui-datepicker-calendar");
      calendar.on('change', function(d) {
        log("CHANGED calendar");
      });


      var dateClickables = $(".ui-datepicker-calendar > tbody > tr > td").not(".ui-datepicker-unselectable");
      var breakPoint = 5;
      log(dateClickables);
      dateClickables.on('hide', function(d) {
        log("CHANGED CHANGED");
      });
      dateClickables.on('click', function(d) {
          log('clicked date');
          // log(d.currentTarget.outerText);
          // log(d.currentTarget.textContent);
          // log(d.currentTarget.outerHTML);
          //log(goalEndDate[0]);
          //log(goalEndDate[0].value);
          // wizardState.goalEndDate = Date.parse(goalEndDate[0].value)
          // var diff = compareTestDates(wizardState.startTest.date, wizardState.goalEndDate);
          //
          // showInterventionLengthBuddy(diff);

      });
    }

    addEventToCalendarDates();

    // have to re-add events
    var changeMonthE = $(".ui-icon-circle-triangle-e");
    var changeMonthW = $(".ui-icon-circle-triangle-w");
    changeMonthE.on('click', function() {
      log("clicked East");
      addEventToCalendarPopup();
    });
    changeMonthW.on('click', function() {
      log("clicked West");
      addEventToCalendarPopup();
    });

  }


  function showInterventionLengthBuddy(diff) {
    // TODO move if statement to message
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
            showBigPopup("interventionLength");
          }
        },
        buttonThree: {
          text: 'change date',
          callback: function() {
            // TODO add click
            datePickerTrigger.trigger("click");
            addEventToCalendarPopup();
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
            showBigPopup("interventionLength");
          }
        },
        buttonThree: {
          text: 'change date',
          callback: function() {
            // TODO add click
            datePickerTrigger.trigger("click");
            addEventToCalendarPopup();
            hideBotBuddy();
          }
        }
      };
      updateBotBuddy(botBuddy);
    }
  };




  /** Setting the starting test **/



};


//==============================
// UI Helpers
//==============================
function updateBotBuddy(botBuddy) {
  showBotBuddy();

  // TODO make it accept multiple messages instead of just one
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
	else if (botBuddy.buttonTwo){
	  $('.buttonOne').removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonOne.text);
	  $('.buttonTwo').removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonTwo.text);
    $('.buttonOne').prop('onclick',null).off('click');
	  $('.buttonOne').on('click', botBuddy.buttonOne.callback);
    $('.buttonTwo').prop('onclick',null).off('click');
		$('.buttonTwo').on('click', botBuddy.buttonTwo.callback);
		$('.buttonThree').hide();
	} else {
    $('.buttonOne').removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonOne.text);
    $('.buttonOne').prop('onclick',null).off('click');
   $('.buttonOne').on('click', botBuddy.buttonOne.callback);
  $('.buttonTwo').hide();
   $('.buttonThree').hide();
  }
}

/*** for showing and hiding bot buddy ***/
function showBotBuddy() {
  $("#jarvis").show();
}

function hideBotBuddy() {
  $("#jarvis").hide();
}
