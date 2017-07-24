
function BotEventListener() {
  log("BotEventListener()");

  // holds the state of the GSW
  var wizardState = {
    hasBeenCalculated: false,
    hasSeenInterventionName: false,
    goalGraphOpen: false
  };

  /*** Check if our load is the result of a "Calculate Goal" click... ***/
  // define data goals
  var moderateData = $("#ctl00_cp_Content_sp_ModerateData");
  var modAmbitiousData = $("#ctl00_cp_Content_sp_ModAmbitiousData");
  var catchupData = $("#ctl00_cp_Content_sp_CatchUpData");

  if(moderateData.html().indexOf("Calculate") >= 0) {
    log("Not yet calculated");
    wizardState.hasBeenCalculated = false;

    showWorkedExampleOption();

  } else {
    log("Has been calculated");
    wizardState.hasBeenCalculated = true;

    showBigPopup("goalGraph");

  }

  function showWorkedExampleOption() {
    botBuddy = {
      messages: [MESSAGES.welcome1, MESSAGES.welcome2],
      buttonOne: {
        text: "Yes",
        callback: function() {
          window.open(LINKS.workedExample, "_blank");
        }
      },
      buttonTwo: {
        text: "No",
        callback: hideBotBuddy
      },
      buttonThree: {
        text: "Never",
        callback: hideBotBuddy
      }
    };
    updateBotBuddy("#botBuddy", botBuddy);
  }

  /*** Panel button behavior ***/
  var helpButton = $("button.helpInVivo");
  helpButton.on('click', function() {
    log("pressed help button");
    showHelpScreen();
  });

  $(".exit").on('click', function() {
    hideBigPopup();
  });

  function showHelpScreen() {
    var helpModal = $("#helpModal");
    helpModal.show();
    log("ayy");
    window.onclick = function(event) {
      if (event.target == helpModal) {
        hideBigPopup();
      }
    }
  };

  var leftHelpButton = $(".helpModuleLeft");
  leftHelpButton.on('click', function() {
    window.open(LINKS.workedExample, "_blank_");
  });

  var rightHelpButton = $(".helpModuleRight");
  rightHelpButton.on('click', function() {
    window.open(LINKS.starMathResources, "_blank_");
  });

  /*** Intervention name text input ***/
  var interventionName = $("#ctl00_cp_Content_tb_Title");

  interventionName.on('focus', function() {
    if(!wizardState.hasSeenInterventionName) {
      wizardState.hasSeenInterventionName = true;
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
      updateBotBuddy('#botBuddy', botBuddy);
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
    updateBotBuddy('#botBuddy', botBuddy);
  }

  interventionName.on('blur', function() {
    if(isValidName(interventionName.val())) {
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

    var endDate = myApp.data.getEndDate();
    if(isNaN(endDate)) return;

    var startTest = myApp.data.getStartTest();
    var diff = compareTestDates(startTest.date, endDate);

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
    updateProgressBar(2);

    botBuddy = {
      messages: [
        MESSAGES.interventionLength1.formatUnicorn({weeks: diff.weeks, n: decideAorAn(diff.weeks) }),
        MESSAGES.interventionLength2],
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
          window.open(LINKS.rtiResource, '_blank');
        }
      }
    };

    if(diff.valid) {
      // do nothing
    } else {
      // TODO highlight orange
    }
    updateBotBuddy('#botBuddy', botBuddy);
  };


  /*** Calculate Goal button ***/
  var calculateGoal = $("#ctl00_cp_Content_btn_CalcGoal");
  log(calculateGoal);

  var goalTypeBox = $(".optionsTable tbody tr:nth-child(4) .dataColumn div");
  log(goalTypeBox);
  goalTypeBox.on('click', function() {
    log("clicked inside the magic box");

    if(!wizardState.hasBeenCalculated) {
      calculateGoal.trigger("click");
    } else if (!wizardState.goalGraphOpen){ // if goal graph is open, we want to click radio buttons without response
      // XXX 2
      showBigPopup("goalGraph",);
    }


  });

  //==============================
  // UI Helpers
  //==============================

  function showBigPopup(name) {

    switch(name) {
      case "goalGraph":
      showGoalGraph();
      break;

      case "help":
      log("showing help screen");
      var help = $("#helpModal");
      help.show();
      break;
    }

  }

  function showGoalGraph() {
    var studentName = myApp.data.getStudentName();

    var goalData = myApp.data.getCalculatedGoals();

    botBuddy = {
      messages: [
        MESSAGES.goalMessage1.formatUnicorn({
          name: studentName.first,
          goalName: "Moderate",
          rate: goalData.moderate.rate,
          ss: goalData.moderate.ss}),
        MESSAGES.goalMessage2.formatUnicorn({
          pct: 50
        })
      ],
  		buttonOne: {
  			text: "Confirm",
  			callback: function() {
          log("ayy");
          hideBigPopup();
          showConfirmationBuddy();
        }
  		},
  		buttonTwo: {
  			text: "Learn More",
  			callback: function() {
          window.open(LINKS.sgpResource, "_blank");
        }
  		},
      buttonThree: {
        text: "Exit window",
        callback: function() {
          hideBigPopup();
        }
      }
    };
    updateBotBuddy('#modal', botBuddy);
    var modal = $("#modal");
    $(".modalTitle").html(MESSAGES.modalTitle.formatUnicorn({first: studentName.first, last: studentName.last}));
    modal.show();
    wizardState.goalGraphOpen = true;
    initializeD3();
    //redrawBars();
    redrawAxes();
  }

  function hideBigPopup() {
    var modal = $(".modal");
    modal.hide();
    wizardState.goalGraphOpen = false;
  }

  function showConfirmationBuddy() {
    updateProgressBar(4);

    botBuddy = {
      messages: [MESSAGES.confirmation.formatUnicorn({name: myApp.data.getStudentName().first})],
      buttonOne: {
        text: "Continue",
        callback: function() {
          showMotivationBuddy();
        }
      }
    };
    updateBotBuddy("#botBuddy", botBuddy);
  };

  function showMotivationBuddy() {
    botBuddy = {
      messages: [
        MESSAGES.motivation.formatUnicorn({name: myApp.data.getStudentName().first}),
        MESSAGES.interventionEffectiveness],
      buttonOne: {
        text: "Continue",
        callback: function() {
          showFinalConfirmationBuddy();
        }
      }
    };
    updateBotBuddy("#botBuddy", botBuddy);
  };

  function showFinalConfirmationBuddy() {
    botBuddy = {
      messages: [MESSAGES.finalConfirmation.formatUnicorn({name: myApp.data.getStudentName().first})],
      buttonOne: {
        text: "Yes",
        callback: function() {
          readyToSave();
        }
      },
      buttonTwo: {
        text: "Change Goal",
        callback: function() {
          showBigPopup("goalGraph");
        }
      }
    };
    updateBotBuddy("#botBuddy", botBuddy);
  };

  function readyToSave() {
    botBuddy = {
      messages: [MESSAGES.readyToSave],
      buttonOne: {
        text: "Save",
        callback: function() {
          var saveButton = $("#ctl00_cp_Content_btn_Save");
          saveButton.trigger("click");
        }
      },
      buttonTwo: {
        text: "Change Goal",
        callback: function() {
          showBigPopup("goalGraph");
        }
      }
    };
    updateBotBuddy("#botBuddy", botBuddy);
  };

  function updateProgressBar(step) {
    var progressBar = $(".progressBar");
    progressBar.html('<img src="' + chrome.runtime.getURL("../images/progress_bar/progress_bar_" + step + "_4.png") + '"/>');
  }

};

function updateBotBuddy(parent, botBuddy) {
  if(parent == "#botBuddy") {
    showBotBuddy();
  }

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
    $(parent + ' .buttonOne').show().removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonOne.text);
    $(parent + ' .buttonTwo').show().removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonTwo.text);
    $(parent + ' .buttonOne').prop('onclick',null).off('click');
    $(parent + ' .buttonOne').on('click', botBuddy.buttonOne.callback);
    $(parent + ' .buttonTwo').prop('onclick',null).off('click');
    $(parent + ' .buttonTwo').on('click', botBuddy.buttonTwo.callback);
    $(parent + ' .buttonThree').hide();
  } else {
    $(parent + ' .buttonOne').show().removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonOne.text);
    $(parent + ' .buttonOne').prop('onclick',null).off('click');
   $(parent + ' .buttonOne').on('click', botBuddy.buttonOne.callback);
  $(parent + ' .buttonTwo').hide();
   $(parent + ' .buttonThree').hide();
  }
}

/** like updateBotBuddy, but only updates messages) **/
function updateBuddyMessages(parent, messages) {
  $(parent + ' .chatMessageWrapper').html('');
  messages.forEach(function(m) {
    $(parent + ' .chatMessageWrapper').append('<div class="chatMessage">' + m + '</div>');
  });

}

/*** for showing and hiding bot buddy ***/
function showBotBuddy() {
  $("#botBuddy").show();
}

function hideBotBuddy(id) {
  $("#botBuddy").hide();
}
