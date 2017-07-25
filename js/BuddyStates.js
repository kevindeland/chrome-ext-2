var myApp = myApp || {};

/**
 * buddy is for holding various messages states of the buddy
 */
myApp.buddy = {
  showWorkedExampleOption:  function () {
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
      messages: [MESSAGES.interventionNameHelp1, MESSAGES.interventionNameHelp2],
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
        MESSAGES.interventionLength1.formatUnicorn({
          weeks: diff.weeks, n: decideAorAn(diff.weeks),
          grade: myApp.data.getStudentGrade()
        }),
        MESSAGES.interventionLength2],
      buttonOne : {
        text: "Yes",
        callback: function() {
          myApp.updater.hideBotBuddy(); // TODO ITEM 8 Trigger Calculate Goal
          var calculateGoal = $("#ctl00_cp_Content_btn_CalcGoal");
          calculateGoal.trigger("click");
        }
      },
      buttonTwo: {
        text: 'change date',
        callback: function() {
          var datePickerTrigger = $(".ui-datepicker-trigger");
          datePickerTrigger.trigger("click");
          addEventToCalendarPopup();
          myApp.updater.hideBotBuddy();
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
    myApp.updater.updateBotBuddy('#botBuddy', botBuddy);
  },

  showConfirmationBuddy: function () {
    myApp.updater.updateProgressBar(4);

    botBuddy = {
      messages: [MESSAGES.confirmation.formatUnicorn({name: myApp.data.getStudentName().first})],
      buttonOne: {
        text: "Continue",
        callback: function() {
          myApp.buddy.showMotivationBuddy();
        }
      }
    };
    myApp.updater.updateBotBuddy("#botBuddy", botBuddy);
  },

  showMotivationBuddy: function () {
    botBuddy = {
      messages: [
        MESSAGES.motivation.formatUnicorn({name: myApp.data.getStudentName().first}),
        MESSAGES.interventionEffectiveness],
      buttonOne: {
        text: "Continue",
        callback: function() {
          myApp.buddy.showFinalConfirmationBuddy();
        }
      }
    };
    myApp.updater.updateBotBuddy("#botBuddy", botBuddy);
  },

  showFinalConfirmationBuddy: function () {
    botBuddy = {
      messages: [MESSAGES.finalConfirmation.formatUnicorn({name: myApp.data.getStudentName().first})],
      buttonOne: {
        text: "Yes",
        callback: function() {
          myApp.buddy.readyToSave();
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
  },

  readyToSave: function() {
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
          myApp.updater.showBigPopup("goalGraph"); // FIXME ITEM 7
        }
      }
    };
    myApp.updater.updateBotBuddy("#botBuddy", botBuddy);
  }

};
