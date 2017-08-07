/**
 * runs when window loads.
 * addes event listeners to interface
 * HTML files loaded from the html folder
 */
var myApp = myApp || {};

// holds the state of the GSW
myApp.wizardState = {
  hasBeenCalculated: false,
  hasSeenInterventionName: false,
  goalGraphOpen: false,
  hasSeenMotivation: false,
  showBotBuddy: true
};

function BotEventListener() {
  log("BotEventListener()");

  /*** Check if our load is the result of a "Calculate Goal" click... ***/
  // define data goals
  var moderateData = $("#ctl00_cp_Content_sp_ModerateData");
  var modAmbitiousData = $("#ctl00_cp_Content_sp_ModAmbitiousData");
  var catchupData = $("#ctl00_cp_Content_sp_CatchUpData");


  /*** COOKIES ***/
  var hasClickedNever = myApp.cookies.read("NeverDoWorkedExample");
  var lastAction = myApp.cookies.read("lastAction");

  // FIXME could be refreshed with no option to View Message again
  // var showBotBuddyCookie = myApp.cookies.read("ShowBotBuddy");
  // if(showBotBuddyCookie == "false") {
  //   myApp.wizardState.showBotBuddy = false;
  //   myApp.updater.showBabyBuddy();
  // }

  if(lastAction == "startTestDropdown") {

    myApp.cookies.erase("lastAction");
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
  var helpButton = $(".helpButton");
  helpButton.on('click', function() {
    log("pressed help button");
    myApp.updater.showHelpScreen();
  });

  $(".exitHelpWindow").on('click', function() {
    myApp.updater.hideHelpScreen();
  });

	$(".exitGoalWindow").on('click', function() {
		myApp.updater.hideBigPopup();
    myApp.updater.showBabyBuddy();
  });

  var leftHelpButton = $(".helpModuleLeft");
  leftHelpButton.on('click', function() {
    window.open(myApp.config.LINKS.workedExample, "_blank_");
  });

  var rightHelpButton = $(".helpModuleRight");
  rightHelpButton.on('click', function() {
    window.open(myApp.config.LINKS.starMathResources, "_blank_");
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

  }); // FIXME ITEM 1 if conditions --> showCalculateGoalPrompt

  /*** Setting the goal end date *()*/
  var goalEndDate = $("#ctl00_cp_Content_tb_Target");

	//Updates the bot buddy's text to say the amount of week(s) it'll be for the goal
	goalEndDate.on('blur', function(e) {
		if(e.relatedTarget && e.relatedTarget.innerText != "") {
			var bigOleDateString = (parseInt($('.ui-datepicker-month').val())+1) + '-' + e.relatedTarget.innerText + '-' + $('.ui-datepicker-year').val();
			console.log("Selected date: " + bigOleDateString);
			var endDate = new Date(bigOleDateString);
			var startTest = myApp.data.getStartTest();
			var diff = compareTestDates(startTest.date, endDate.getTime());

			myApp.buddy.showInterventionLengthBuddy(diff);
		} else {
			var endDate = myApp.data.getEndDate();
			if(isNaN(endDate)) return;

			var startTest = myApp.data.getStartTest();
			var diff = compareTestDates(startTest.date, endDate);

			myApp.buddy.showInterventionLengthBuddy(diff);
		}
	}); // FIXME ITEM 1 if conditions --> showCalculateGoalPrompt

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
    myApp.cookie.create("lastAction", "startTestDropdown", 7);
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

    /*** all things custom goal ***/

  // TODO ITEM 51 add behavior for listening to customGoal button click
  $(".goalButton#customGoal").on('click', function() {
    //
    // XXX unhighlight other lines
    selectGoalLine("custom");
  });


  $(".goalButton#customGoal > select").on('change', function() {
    // XXX recalculate other goals
  });

  $("#ctl00_cp_Content_tb_Custom").on('change', function() {
    log("custom goal changed");
    log(myApp.data.getCustomGoal());
  });


  $(".exitBuddyWindow").on('click', function() {
    myApp.wizardState.showBotBuddy = false;
    myApp.updater.hideBotBuddy();
    myApp.updater.showBabyBuddy();

  });

  $(".viewBotMessage").on('click', function() {
    if(!$(".viewBotMessage").hasClass("viewGraphsDisabled")) {
      myApp.wizardState.showBotBuddy = true;
      myApp.updater.hideBabyBuddy();
      myApp.updater.showBotBuddy();
    }
  });

  $(".viewGraphs").on('click', function() {
    if(!$(".viewGraphs").hasClass("viewGraphsDisabled")) {
      myApp.updater.hideBabyBuddy();
      myApp.updater.showGoalGraph();
    }
  });

};
