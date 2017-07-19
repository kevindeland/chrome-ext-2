
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
    hasBeenCalculated: false,
    goalData: undefined
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

  var interactionHistory = {
    hasSeenInterventionName: false
  };

  /*** initialize ***/
  var studentNameDiv = $("#ctl00_cp_Content_td_Student")[0];
  var fullName = studentNameDiv.innerHTML;
  wizardState.studentName = {
    last: fullName.split(', ')[0],
    first: fullName.split(', ')[1]
  };
  log("Student name: " + wizardState.studentName);

  var startScoreText = $("#ctl00_cp_Content_ddl_AnchorScore " + "option:selected").text();
  wizardState.startTest = parseDropdownTestScore(startScoreText);

  /*** Check if our load is the result of a "Calculate Goal" click... ***/
  // define data goals
  var moderateData = $("#ctl00_cp_Content_sp_ModerateData");
  var modAmbitiousData = $("#ctl00_cp_Content_sp_ModAmbitiousData");
  var catchupData = $("#ctl00_cp_Content_sp_CatchUpData");

  if(moderateData.html().indexOf("Calculate") >= 0) {
    log("Not yet calculated");
    wizardState.hasBeenCalculated = false;
  } else {
    log("Has been calculated");
    wizardState.hasBeenCalculated = true;
    wizardState.goalData = {
      moderate: parseGoalData(moderateData.html()),
      modAmbitious: parseGoalData(modAmbitiousData.html()),
      catchup: parseGoalData(catchupData.html())
    };

    showBigPopup("goalGraph", {name: wizardState.studentName, data: wizardState.goalData});

  }

  /*** Panel button behavior ***/
  var helpButton = $(".helpButton > input");
  helpButton.on('click', function() {
    showHelpScreen();
  });

  $("#modal .minimize").on('click', function() {
    hideBigPopup();
  });

  function showHelpScreen() {
    showBigPopup("help");

    window.onclick = function(event) {
      if (event.target == modal) {
        hideBigPopup();
      }
    }
  };

  /*** Intervention name text input ***/
  var interventionName = $("#ctl00_cp_Content_tb_Title");

  // TODO 7/17 only show intervention popup once
  interventionName.on('focus', function() {
    if(!interactionHistory.hasSeenInterventionName) {
      interactionHistory.hasSeenInterventionName = true;
      botBuddy = {
        messages: ["Would you like some tips on how to name your intervention?"],
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
      updateBotBuddy('#jarvis', botBuddy);
    } else {
      log("already saw intervention name help");
    }
  });

  function showInterventionNameHelp() {
    log("showInterventionNameHelp");

    botBuddy = {
      messages: [MESSAGES.interventionNameHelp1, MESSAGES.interventionNameHelp2],
      buttonOne: {
        text: "Got it",
        callback: hideBotBuddy
      },
      buttonTwo: null
    };
    updateBotBuddy('#jarvis', botBuddy);
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
    var enteredValue = goalEndDate[0].value;
    var date = Date.parse(enteredValue);
    log(date);
    if(isNaN(date)) return;

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
    var progressBar = $(".progressBar");
    progressBar.html('<img src="' + chrome.runtime.getURL("../images/progress_bar_2_4.png") + '"/>');

    botBuddy = {
      message: null, // set message below
      buttonOne : {
        text: "Yes",
        callback: function() {
          hideBotBuddy();
        }
      },
      buttonTwo: {
        text: 'change date',
        callback: function() {
          datePickerTrigger.trigger("click");
          addEventToCalendarPopup();
          hideBotBuddy();
        }
      },
      buttonThree : {
        text: "Teach me More",
        callback: function() {
          window.open('http://doc.renlearn.com/KMNet/R004336320GJBD8A.pdf', '_blank');
        }
      }
    };

    if(diff.valid) {
      botBuddy.messages = [MESSAGES.interventionLengthLong.formatUnicorn({weeks: intToText(diff.weeks)})];
    } else {
      botBuddy.messages = [MESSAGES.interventionLenghtShort.formatUnicorn({weeks: intToText(diff.weeks), weekPlural: (diff.weeks == 1 ? '': 's')})];
    }
    updateBotBuddy('#jarvis', botBuddy);
  };


  /*** Calculate Goal button ***/
  var calculateGoal = $("#ctl00_cp_Content_btn_CalcGoal");
  log(calculateGoal);
  calculateGoal.on('mouseover', function() {
    log('about to click calculateGoal');
    calculateGoalWindow();
  });

  /** when the Calculate Goal button is pressed **/
  function calculateGoalWindow() {
    // TODO https://developer.chrome.com/extensions/cookies
    // background pages https://developer.chrome.com/extensions/background_pages
    // ayy https://stackoverflow.com/questions/23038032/why-is-chrome-cookies-undefined-in-a-content-script
  //  chrome.cookies.set({url: "https://rppres9.renlearn.com", name: "TestCookie", value: "123"});
  }

  var goalTypeBox = $(".optionsTable tbody tr:nth-child(4) .dataColumn div");
  log(goalTypeBox);
  goalTypeBox.on('click', function() {
    log("clicked inside the magic box");

    if(!wizardState.hasBeenCalculated) {
      calculateGoal.trigger("click");
      calculateGoalWindow();
    } else {
      showBigPopup("goalGraph", {data: wizardState.goalData, name: wizardState.studentName});
    }


  });

  /** Setting the starting test **/


};


//==============================
// UI Helpers
//==============================
function updateBotBuddy(parent, botBuddy) {
  if(parent == "#jarvis") {
    showBotBuddy();
  }

  // TODO make it accept multiple messages instead of just one
	$(parent + ' .chatMessageWrapper').html('');
  if(botBuddy.messages) {
    botBuddy.messages.forEach(function(m) {
      $(parent + ' .chatMessageWrapper').append('<div class="chatMessage">' + m + '</div>');
    });
  }

	if(botBuddy.buttonThree) {
		$(parent + ' .buttonOne').removeClass('twoButtons').addClass('threeButtons').prop('value', botBuddy.buttonOne.text);
	  $(parent + ' .buttonTwo').removeClass('twoButtons').addClass('threeButtons').prop('value', botBuddy.buttonTwo.text);
	  $(parent + ' .buttonThree').show().prop('value', botBuddy.buttonThree.text);
    $(parent + ' .buttonOne').prop('onclick',null).off('click');
		$(parent + ' .buttonOne').on('click', botBuddy.buttonOne.callback);
    $(parent + ' .buttonTwo').prop('onclick',null).off('click');
		$(parent + ' .buttonTwo').on('click', botBuddy.buttonTwo.callback);
    $(parent + ' .buttonThree').prop('onclick',null).off('click');
	  $(parent + ' .buttonThree').on('click', botBuddy.buttonThree.callback);
	}
	else if (botBuddy.buttonTwo){
	  $(parent + ' .buttonOne').removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonOne.text);
	  $(parent + ' .buttonTwo').removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonTwo.text);
    $(parent + ' .buttonOne').prop('onclick',null).off('click');
	  $(parent + ' .buttonOne').on('click', botBuddy.buttonOne.callback);
    $(parent + ' .buttonTwo').prop('onclick',null).off('click');
		$(parent + ' .buttonTwo').on('click', botBuddy.buttonTwo.callback);
		$(parent + ' .buttonThree').hide();
	} else {
    $(parent + ' .buttonOne').removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonOne.text);
    $(parent + ' .buttonOne').prop('onclick',null).off('click');
   $(parent + ' .buttonOne').on('click', botBuddy.buttonOne.callback);
  $(parent + ' .buttonTwo').hide();
   $(parent + ' .buttonThree').hide();
  }
}

/*** for showing and hiding bot buddy ***/
function showBotBuddy() {
  $("#jarvis").show();
}

function hideBotBuddy(id) {
  $("#jarvis").hide();
}

function showBigPopup(name, params) {

  switch(name) {
    case "goalGraph":
    showGoalGraph(params);
    break;

    case "help":
    log("showing help screen");
    var modal = $("#modal");
    modal.show();
    break;
  }

}

function showGoalGraph(params) {
  var botBuddy = {
    messages: [
      MESSAGES.modGoalMessage1.formatUnicorn({
        name: params.name.first, rate: params.data.moderate.rate, ss: params.data.moderate.ss}),
      MESSAGES.modGoalMessage2
    ],
		buttonOne: {
			text: "Confirm",
			callback: undefined
		},
		buttonTwo: {
			text: "Learn More",
			callback: undefined
		},
    buttonThree: {
      text: "Exit window",
      callback: undefined
    }
  };
  updateBotBuddy('#modal', botBuddy);
  var modal = $("#modal");
  $(".modalTitle").html(MESSAGES.modalTitle.formatUnicorn({first: params.name.first, last: params.name.last}));
  modal.show();
}

function hideBigPopup() {
  var modal = $("#modal");
  modal.hide();
}
