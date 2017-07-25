var myApp = myApp || {};

myApp.eventListener = {};

// holds the state of the GSW
myApp.wizardState = {
  hasBeenCalculated: false,
  hasSeenInterventionName: false,
  goalGraphOpen: false
};

function BotEventListener() {
  log("BotEventListener()");

  /*** Check if our load is the result of a "Calculate Goal" click... ***/
  // define data goals
  var moderateData = $("#ctl00_cp_Content_sp_ModerateData");
  var modAmbitiousData = $("#ctl00_cp_Content_sp_ModAmbitiousData");
  var catchupData = $("#ctl00_cp_Content_sp_CatchUpData");


  /*** COOKIES ***/
  var hasClickedNever = readCookie("NeverDoWorkedExample");
  var lastAction = readCookie("lastAction");

  if(lastAction == "startTestDropdown") {

    eraseCookie("lastAction");
    log("we just changed the startTest...");
    var endDate = myApp.data.getEndDate();
    if(isNaN(endDate)) return;

    var startTest = myApp.data.getStartTest();
    var diff = compareTestDates(startTest.date, endDate);

    myApp.buddy.showInterventionLengthBuddy(diff);

  } else if(moderateData.html().indexOf("Calculate") >= 0) {
    log("Not yet calculated");
    myApp.wizardState.hasBeenCalculated = false;

    if(!hasClickedNever) {
      myApp.buddy.showWorkedExampleOption();
    }

  } else {
    log("Has been calculated");
    myApp.wizardState.hasBeenCalculated = true;

    myApp.updater.showBigPopup("goalGraph");

  }
  /** FIXME ITEM 2
   * what is the logic flow?
   */
  // FIXME ITEM 3 we don't want it opening the big popup every time...

  /*** Panel button behavior ***/
  var helpButton = $("button.help");
  helpButton.on('click', function() {
    log("pressed help button");
    myApp.updater.showHelpScreen();
  });

  // FIXME ITEM 9: different exit behavior for
  $(".exit").on('click', function() {
    myApp.updater.hideBigPopup();

    // FIXME only if you're hiding the goal box
    myApp.updater.showBabyBuddy({graphDisabled: true});
  });

  var leftHelpButton = $(".helpModuleLeft");
  leftHelpButton.on('click', function() {
    window.open(LINKS.workedExample, "_blank_");
  });

  var rightHelpButton = $(".helpModuleRight");
  rightHelpButton.on('click', function() {
    window.open(LINKS.starMathResources, "_blank_");
  });

  /*** End Help Window ***/
  /*** Intervention name text input ***/
  var interventionName = $("#ctl00_cp_Content_tb_Title");

  interventionName.on('focus', function() {

    if(!myApp.wizardState.hasSeenInterventionName) {
      myApp.wizardState.hasSeenInterventionName = true;
      myApp.buddy.showInterventionNamePrompt();
    } else {
      log("already saw intervention name help");
    }
  });

  interventionName.on('blur', function() {
    if(isValidName(interventionName.val())) {
      myApp.updater.hideBotBuddy();
    }

  });

  /*** Setting the goal end date *()*/
  var goalEndDate = $("#ctl00_cp_Content_tb_Target");

  goalEndDate.on('change', function() {
    log('change goalEndDate');
  });

  // DOES NOT WORK!
  // FIXME ITEM 1 on click the calendar, check to see if GoalEndDate is valid, and is different
  goalEndDate.on('blur', function() {

    var endDate = myApp.data.getEndDate();
    if(isNaN(endDate)) return;

    var startTest = myApp.data.getStartTest();
    var diff = compareTestDates(startTest.date, endDate);

    myApp.buddy.showInterventionLengthBuddy(diff);
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


  /*** Starting Test Dropdown Selection ***/
  var startTestDropdown = $("#ctl00_cp_Content_ddl_AnchorScore");
  startTestDropdown.on("change", function() {
    log("changed start test!");
    createCookie("lastAction", "startTestDropdown", 7);
  });

  /*** Calculate Goal button ***/
  var calculateGoal = $("#ctl00_cp_Content_btn_CalcGoal");
  log(calculateGoal);


  /*** Choosing goal types in the box ***/
  var goalTypeBox = $(".optionsTable tbody tr:nth-child(4) .dataColumn div");
  log(goalTypeBox);
  goalTypeBox.on('click', function() {
    log("clicked inside the magic box");

    if(!myApp.wizardState.hasBeenCalculated) {
      calculateGoal.trigger("click");
    } else if (!myApp.wizardState.goalGraphOpen){ // if goal graph is open, we want to click radio buttons without response
      // FIXME ITEM 4... be able to click on different boxes without opening box
      myApp.updater.showBigPopup("goalGraph");
    }

  });
  /***************************************/

  /*** Goal Buttons inside goal popup ***/
  $(".goalButton#moderateGoal").on('click', function() {
    selectGoalLine("mod");
  });

  $(".goalButton#moderatelyAmbitiousGoal").on('click', function() {
    selectGoalLine("amb");
  });

  $(".goalButton#cukuGoal").on('click', function() {
    selectGoalLine("cuku");
  });


  $(".exitBuddyWindow").on('click', function() {
    myApp.updater.hideBotBuddy();

    // if goals have not yet been calculated, then view graph button is disabled
    if(myApp.data.getCalculatedGoals() == null) {
      myApp.updater.showBabyBuddy({graphDisabled: true});
    } else {
      myApp.updater.showBabyBuddy({graphDisabled: false});
    }

  });
  /*** ITEM 5 add listeners for baby bot ***/
  $(".viewBotMessage").on('click', function() {
    myApp.updater.hideBabyBuddy();
    myApp.updater.showBotBuddy();
  });

  $(".viewGraphs").on('click', function() {
    myApp.updater.hideBabyBuddy();
    myApp.updater.showGoalGraph();
  });

};
