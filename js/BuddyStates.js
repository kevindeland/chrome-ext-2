var myApp = myApp || {};

/**
 * buddy is for holding various messages states of the buddy
 */
myApp.buddy = {
  showWorkedExampleOption:  function () {
    botBuddy = {
      messages: [myApp.config.MESSAGES.welcome1, myApp.config.MESSAGES.welcome2],
      buttonOne: {
        text: "Yes",
        affirmative: true,
        callback: function() {
          window.open(myApp.config.LINKS.workedExample, "_blank");
        }
      },
      buttonTwo: {
        text: "No",
        callback: myApp.updater.hideBotBuddy
      },
      buttonThree: {
        text: "Never",
        callback: function() {
          myApp.updater.hideBotBuddy();
          createCookie("NeverDoWorkedExample", "true", 7);
        }
      }
    };
    myApp.updater.updateBotBuddy("#botBuddy", botBuddy);
  },

  showInterventionNamePrompt: function() {
    botBuddy = {
      messages: ["Would you like some tips on how to name your intervention?"],
      buttonOne: {
        text: "Sure",
        affirmative: true,
        callback: function() {
          myApp.buddy.showInterventionNameHelp();
        }
      },
      buttonTwo: {
        text: "No Thanks",
        callback: myApp.updater.hideBotBuddy
      }
    };
    myApp.updater.updateBotBuddy('#botBuddy', botBuddy);
  },

  showInterventionNameHelp: function()  {
    log("showInterventionNameHelp");

    botBuddy = {
      messages: [myApp.config.MESSAGES.interventionNameHelp1, myApp.config.MESSAGES.interventionNameHelp2],
      buttonOne: {
        text: "Got it",
        callback: myApp.updater.hideBotBuddy
      },
      buttonTwo: null
    };
    myApp.updater.updateBotBuddy('#botBuddy', botBuddy);
  },

  showInterventionLengthBuddy: function (diff) {
    myApp.updater.updateProgressBar(2);

    botBuddy = {
      messages: [
        myApp.config.MESSAGES.interventionLength1.formatUnicorn({
          weeks: diff.weeks, n: decideAorAn(diff.weeks),
          grade: myApp.data.getStudentGrade()
        }),
        myApp.config.MESSAGES.interventionLength2],
      buttonOne : {
        text: "Yes",
        affirmative: true,
        callback: function() {
          myApp.updater.hideBotBuddy();

          // TODO ITEM 1 do a logic check IF (goalEndDate && interventionName && hasBeenConfirmed)
          myApp.buddy.showReadyToCalculateGoal();
        }
      },
      buttonTwo: {
        text: 'change date',
        callback: function() {
          var datePickerTrigger = $(".ui-datepicker-trigger");
          datePickerTrigger.trigger("click");
          myApp.updater.hideBotBuddy();
        }
      },
      buttonThree : {
        text: "Teach me More", // FIXME possible display on two lines
        callback: function() {
          window.open(myApp.config.LINKS.rtiResource, '_blank');
        }
      }
    };

    if(!diff.valid) {
      //Highlight orange
    }
    myApp.updater.updateBotBuddy('#botBuddy', botBuddy);
  },

  showReadyToCalculateGoal: function() {
    myApp.updater.updateProgressBar(3);

    botBuddy = {
        messages: [myApp.config.MESSAGES.readyToCalculateGoal],
        buttonOne: {
          text: "View Graphs",
          affirmative: true,
          callback: function() {
              // FIXME ITEM 1 update cookie
              myApp.updater.hideBotBuddy(); // TODO ITEM 8 Trigger Calculate Goal
              var calculateGoal = $("#ctl00_cp_Content_btn_CalcGoal");
              calculateGoal.trigger("click");
          }
        }
    };
    myApp.updater.updateBotBuddy("#botBuddy", botBuddy)

  },

  showConfirmationBuddy: function () {
    myApp.updater.updateProgressBar(4);

    botBuddy = {
      messages: [myApp.config.MESSAGES.confirmation.formatUnicorn({name: myApp.data.getStudentName().first})],
      buttonOne: {
        text: "Continue",
        affirmative: true,
        callback: function() {
          myApp.buddy.showMotivationBuddy();
        }
      }
    };
    myApp.updater.updateBotBuddy("#botBuddy", botBuddy);
  },

  showMotivationBuddy: function () {
    myApp.wizardState.hasSeenMotivation = true;
    botBuddy = {
      big: true, /** HACK big message **/
      messages: [
        myApp.config.MESSAGES.motivation.formatUnicorn({name: myApp.data.getStudentName().first}),
        myApp.config.MESSAGES.interventionEffectiveness],
      buttonOne: {
        text: "Continue",
        affirmative: true,
        callback: function() {
          myApp.buddy.showFinalConfirmationBuddy();
        }
      }
    };
    myApp.updater.updateBotBuddy("#botBuddy", botBuddy);
  },

  showFinalConfirmationBuddy: function () {
    botBuddy = {
      messages: [myApp.config.MESSAGES.finalConfirmation.formatUnicorn({name: myApp.data.getStudentName().first})],
      buttonOne: {
        text: "Yes",
        affirmative: true,
        callback: function() {
          myApp.buddy.readyToSave();
        }
      },
      buttonTwo: {
        text: "Change Goal",
        callback: function() {
          myApp.updater.hideBotBuddy();
          myApp.updater.showBigPopup("goalGraph"); // FIXME ITEM 7
        }
      }
    };
    myApp.updater.updateBotBuddy("#botBuddy", botBuddy);
  },

  readyToSave: function() {
    botBuddy = {
      messages: [myApp.config.MESSAGES.readyToSave],
      buttonOne: {
        text: "Save",
        affirmative: true,
        callback: function() {
          var saveButton = $("#ctl00_cp_Content_btn_Save");
          saveButton.trigger("click");
        }
      },
      buttonTwo: {
        text: "Change Goal",
        callback: function() {
          myApp.updater.showBigPopup("goalGraph"); // FIXME ITEM 7
        }
      }
    };
    myApp.updater.updateBotBuddy("#botBuddy", botBuddy);
  }

};
