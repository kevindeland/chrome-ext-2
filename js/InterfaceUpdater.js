var myApp = myApp || {};

/**
 * Updater holds all functions which update or change the interface in some way
 */

myApp.updater = {};

/**************************/
/*** Bot Buddy updaters ***/
/**************************/


/*** for showing and hiding bot buddy ***/
myApp.updater.showBotBuddy = function() {
  $("#botBuddy").show();
}

myApp.updater.hideBotBuddy = function (id) {
  $("#botBuddy").hide();
}

/**
 * updates the bot buddy with the state passed
 */
myApp.updater.updateBotBuddy = function (parent, botBuddy) {
  if(parent == "#botBuddy") {
    myApp.updater.showBotBuddy();
    myApp.updater.hideBabyBuddy();

    /** HACK big message **/
    if(botBuddy.big) {
      $("#botBuddy .chatBox").addClass("longMessage");
      $("#botBuddy .bottomButtonPanel").addClass("longMessage");
    } else {
      $("#botBuddy .chatBox").removeClass("longMessage");
      $("#botBuddy .bottomButtonPanel").addClass("longMessage");
    }
  }

  var updateMe = $(parent + ' .chatMessageWrapper' + (parent == "#modal" ? "Popup" : ""));
  updateMe.html('');
  if(botBuddy.messages) {
    botBuddy.messages.forEach(function(m) {
      updateMe.append('<div class="chatMessage">' + m + '</div>');
    });
  }

  var buttonOne = $(parent + ' .buttonOne');
  var buttonTwo = $(parent + ' .buttonTwo');
  var buttonThree = $(parent + ' .buttonThree');

  if(botBuddy.buttonThree) {
    buttonOne.removeClass('twoButtons').addClass('threeButtons').prop('value', botBuddy.buttonOne.text);
    buttonTwo.removeClass('twoButtons').addClass('threeButtons').prop('value', botBuddy.buttonTwo.text);
    buttonThree.show().prop('value', botBuddy.buttonThree.text);
    buttonOne.prop('onclick',null).off('click');
    buttonOne.on('click', botBuddy.buttonOne.callback);
    buttonTwo.prop('onclick',null).off('click');
    buttonTwo.on('click', botBuddy.buttonTwo.callback);
    buttonThree.prop('onclick',null).off('click');
    buttonThree.on('click', botBuddy.buttonThree.callback);

  }
  else if (botBuddy.buttonTwo){
    buttonOne.show().removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonOne.text);
    buttonTwo.show().removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonTwo.text);
    buttonOne.prop('onclick',null).off('click');
    buttonOne.on('click', botBuddy.buttonOne.callback);
    buttonTwo.prop('onclick',null).off('click');
    buttonTwo.on('click', botBuddy.buttonTwo.callback);
    buttonThree.hide();

  } else {
    buttonOne.show().removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonOne.text);
    buttonOne.prop('onclick',null).off('click');
    buttonOne.on('click', botBuddy.buttonOne.callback);
    buttonTwo.hide();
    buttonThree.hide();

  }

  // highlighting for affirmative button
  if(botBuddy.buttonThree && botBuddy.buttonThree.affirmative) {
    log("affirmatve button three!");
    buttonThree.addClass('buttonAffirmative');
    buttonTwo.removeClass('buttonAffirmative');
    buttonOne.removeClass('buttonAffirmative');
  }

  // highlighting for affirmative button
  if(botBuddy.buttonTwo && botBuddy.buttonTwo.affirmative) {
    log("affirmatve button two!");
    buttonThree.removeClass('buttonAffirmative');
    buttonTwo.addClass('buttonAffirmative');
    buttonOne.removeClass('buttonAffirmative');
  }

  // highlighting for affirmative button
   if(botBuddy.buttonOne && botBuddy.buttonOne.affirmative) {
     log("affirmatve button one!");
     buttonThree.removeClass('buttonAffirmative');
     buttonTwo.removeClass('buttonAffirmative');
     buttonOne.addClass('buttonAffirmative');
   }

}

/**
 * updates scores in bot buddy
 */
myApp.updater.updateBuddyScores = function (goal) {

  var name = myApp.data.getStudentName().first;
  log("FIXME update buddy scores")
  var messages = [
    MESSAGES.goalMessage1.formatUnicorn({
      name: name, goalName: goal.name, rate: goal.rate, ss: goal.ss, sgp: goal.sgp}),
    MESSAGES.goalMessage2.formatUnicorn({sgp: goal.sgp})
  ];

  myApp.updater.updateBuddyMessages('#modal', messages);
}

/** like myApp.updater.updateBotBuddy, but only updates messages) **/
myApp.updater.updateBuddyMessages = function (parent, messages) {
  var updateMe = $(parent + ' .chatMessageWrapper' + (parent == "#modal" ? "Popup" : ""));
  updateMe.html('');
  messages.forEach(function(m) {
    updateMe.append('<div class="chatMessage">' + m + '</div>');
  });
}

/******* progress bar ********/
myApp.updater.updateProgressBar = function(step) {
  var progressBar = $(".progressBar");
  progressBar.html('<img src="' + chrome.runtime.getURL("../images/progress_bar/progress_bar_" + step + "_4.png") + '"/>');
}


/**
* shows the big popup
*/
myApp.updater.showBigPopup = function(name) {

  switch(name) {
    case "goalGraph":
    myApp.updater.showGoalGraph();
    break;

    case "help":
    log("showing help screen");
    var help = $("#helpModal");
    help.show();
    break;
  }
};

/*** Help Window ***/
myApp.updater.showHelpScreen = function() {
  var helpModal = $("#helpModal");
  helpModal.show();
  log("ayy");
  window.onclick = function(event) {
    if (event.target == helpModal) {
      myApp.updater.hideBigPopup();
    }
  }
};

myApp.updater.hideHelpScreen = function () {
  var helpModal = $("#helpModal");
  helpModal.hide();
  myApp.wizardState.goalGraphOpen = false;
}

myApp.updater.hideBigPopup = function () {
  var modal = $(".modal");
  modal.hide();
  myApp.wizardState.goalGraphOpen = false;
}

myApp.updater.showGoalGraph = function() {
  var studentName = myApp.data.getStudentName();

  var goalData = myApp.data.getCalculatedGoals();

  // BUG make this dependent on selected button
  botBuddy = {
    messages: [
      MESSAGES.goalMessage1.formatUnicorn({
        name: studentName.first,
        goalName: "Moderate",
        rate: goalData.moderate.rate,
        ss: goalData.moderate.ss,
        sgp: 50}),
      MESSAGES.goalMessage2.formatUnicorn({
        sgp: 50
      })
    ],
		buttonOne: {
			text: "Confirm",
      affirmative: true,
			callback: function() {
        myApp.updater.hideBigPopup();

        if(!myApp.wizardState.hasSeenMotivation) {
          myApp.buddy.showConfirmationBuddy();
        } else {
          myApp.buddy.showFinalConfirmationBuddy();
        }
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
        myApp.updater.hideBigPopup();
      }
    }
  };
  myApp.updater.updateBotBuddy('#modal', botBuddy);

  myApp.updater.updateGoalButtons();

  var modal = $("#modal");
  $(".modalTitleText").html(MESSAGES.modalTitle.formatUnicorn({first: studentName.first, last: studentName.last}));
  modal.show();
  myApp.wizardState.goalGraphOpen = true;
  initializeD3();
  //redrawBars();
  redrawAxes();

}

myApp.updater.updateGoalButtons = function() {
  var goalData = myApp.data.getCalculatedGoals();
  var buttonText = "{sgp} SGP = {rate} SS/week = {ss} SS";
  $("#cukuGoal > .goalText").html(buttonText.formatUnicorn({
    sgp: goalData.catchup.sgp,
    rate: goalData.catchup.rate,
    ss: goalData.catchup.ss
  }));

  $("#moderateGoal > .goalText").html(buttonText.formatUnicorn({
    sgp: goalData.moderate.sgp,
    rate: goalData.moderate.rate,
    ss: goalData.moderate.ss
  }));

  $("#moderatelyAmbitiousGoal > .goalText").html(buttonText.formatUnicorn({
    sgp: goalData.modAmbitious.sgp,
    rate: goalData.modAmbitious.rate,
    ss: goalData.modAmbitious.ss
  }));

  // XXX if custom goal.. add that button
  var customGoal = myApp.data.getCustomGoal();

  if(customGoal) {

    $("#addCustomGoal > .goalText").html(buttonText.formatUnicorn({
      sgp: "XX",
      rate: customGoal.rate,
      ss: customGoal.ss
    }));
  }
}

/*** ITEM 5 add updater (show, hide) for baby bot ***/
myApp.updater.showBabyBuddy = function() {
  $("#babyBot").show();

  // if goals have not yet been calculated, then view graph button is disabled
  if(myApp.data.getCalculatedGoals() == null) {
    log("viewGraph disabled");
    $(".viewGraphs").addClass("viewGraphsDisabled");
  } else {
    log("viewGraphs enabled");
    $(".viewGraphs").removeClass("viewGraphsDisabled");
  }

  // only enable View Message if there is a message to view
  if($("#inVivo .chatMessageWrapper").children().length > 0 ) {
    log("viewBotMessage enabled");
    $(".viewBotMessage").removeClass("viewGraphsDisabled");
  } else {
    log("viewBotMessage enabled");
    $(".viewBotMessage").addClass("viewGraphsDisabled");
  }
};

myApp.updater.hideBabyBuddy = function() {
  $("#babyBot").hide();
};
