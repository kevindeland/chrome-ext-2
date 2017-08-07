/**
 * runs when window loads.
 * inserts new divs and other HTML elements into the Goal-Setting Wizard.
 * HTML files loaded from the html folder
 */
function NewDivInserter (callback) {
  log("NewDivInserter()");

  // functions performed in series
  addRobot();

  /*** inserts the side agent (formerly known as botBuddy) ***/
  function addRobot() {

    var $botBuddy = $("<div>", {id: "botBuddy", "class": "robot"});
    $("body").append($botBuddy);

    $botBuddy.hide();

    var botBuddyURL = chrome.runtime.getURL("../html/botBuddy.html");
    $botBuddy.load(botBuddyURL, function() {
      // automagically insert images

      var progressBar = $(".progressBar");
      progressBar.html('<img src="' + chrome.runtime.getURL("../images/progress_bar/progress_bar_1_4.png") + '"/>');

      var helpButtonImage = $(".helpButton > img");
      helpButtonImage.attr("src", chrome.runtime.getURL("../images/button_icons/help-icon.png"));

      var lastMessageInVivo = $(".lastMessageInVivo > img");
      lastMessageInVivo.attr("src", chrome.runtime.getURL("../images/button_icons/previous-page-icon.png"));

      // functions performed in series
      addModal();
    });
  }

  /*** inserts the graph modal ***/
  function addModal() {

      var $modal = $("<div>", {id: "modal", "class": "modal"});
      $("body").append($modal);

      $modal.hide();

      var popupURL = chrome.runtime.getURL("../html/popup.html");

      $modal.load(popupURL, function() {

        $("#projectedPerformanceLine").attr("src", chrome.runtime.getURL("../images/lines/projected-performance-line.png"));
        $("#moderateGoal > img").attr("src", chrome.runtime.getURL("../images/lines/moderate-goal-line.png"));
        $("#moderatelyAmbitiousGoal > img").attr("src", chrome.runtime.getURL("../images/lines/moderately-ambitious-line.png"));
        $("#cukuGoal > img").attr("src", chrome.runtime.getURL("../images/lines/cuku-line.png"));
        $("#addCustomGoal > img").attr("src", chrome.runtime.getURL("../images/lines/custom-goal-icon.png"));

        $("img#downloadButton").attr("src", chrome.runtime.getURL("../images/button_icons/download-icon.png"));
        $("img#expandButton").attr("src", chrome.runtime.getURL("../images/button_icons/expand-icon.png"));

        $(".lastMessageButton > img").attr("src", chrome.runtime.getURL("../images/button_icons/previous-page-icon.png"));
        $(".helpButton > img").attr("src", chrome.runtime.getURL("../images/button_icons/help-icon.png"));

        $(".modalGraph").html('<div id="graph-body"></div>');

        // functions performed in series
        addHelpModal();

      });
  }

  /*** inserts the help modal ***/
  function addHelpModal() {
    var $help = $("<div>", {id: "helpModal", "class": "modal"});
    $("body").append($help);

    $help.hide();

    var helpURL = chrome.runtime.getURL("../html/help_popup_box.html");

    $help.load(helpURL, function() {

      $(".helpModuleLeft .topModuleBlue").html('<img src="' + chrome.runtime.getURL("../images/worked_example_thumbnail.png") + '" width=100%/>');
      $(".helpModuleRight .topModuleBlue").html('<img src="' + chrome.runtime.getURL("../images/resources_thumbnail.png") + '" width=100%/>');

      // functions performed in series
      addBabyBot();
    });
  }

  /*** inserts the small, minimized bot ***/
  function addBabyBot() {
    var $baby = $("<div>", {id: "babyBot"});
    $("body").append($baby);

    $baby.hide();

    var babyURL = chrome.runtime.getURL("../html/baby_bot.html");

    $baby.load(babyURL, function() {
      // functions performed in series
      callback();
    });

  }


};
