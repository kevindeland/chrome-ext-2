

function NewDivInserter (callback) {
  log("NewDivInserter()");

  addRobot();


  function addRobot() {
    var $botBuddy = $("<div>", {id: "botBuddy", "class": "robot"});
    $("body").append($botBuddy);

    $botBuddy.hide();

    var botBuddyURL = chrome.runtime.getURL("../html/botBuddy.html");
    //log(botBuddyURL);
    $botBuddy.load(botBuddyURL, function() {
      // automagically insert images

      var progressBar = $(".progressBar");
      log(progressBar);
      progressBar.html('<img src="' + chrome.runtime.getURL("../images/progress_bar_1_4.png") + '"/>');

      var helpButton = $(".helpButton");
      log(helpButton);
      helpButton.html('<input type="image" src="' + chrome.runtime.getURL("../images/Help_Button_Icon.png") + '"/>');


      addModal();
    });
  }



  function addModal() {

      var $modal = $("<div>", {id: "modal", "class": "modal"});
      $("body").append($modal);

      $modal.hide();

      var popupURL = chrome.runtime.getURL("../html/popup.html");

      $modal.load(popupURL, function() {
        log("modal loaded");

        if(!USE_D3) {
          $(".modalGraph").html('<img src="' + chrome.runtime.getURL("images/d3_graph.png") + '" width=50%/>');
          addHelpModal();
        } else {
          $(".modalGraph").html('<div id="graph-body"></div>');
          //executeD3();
          addHelpModal();
        }


      });
  }

  function addHelpModal() {
    log("adding help modal");
    var $help = $("<div>", {id: "helpModal", "class": "modal"});
    $("body").append($help);

    $help.hide();

    var helpURL = chrome.runtime.getURL("../html/help_popup_box.html");

    $help.load(helpURL, function() {
      log("help loaded");

      addBabyBot();
    });
  }

  function addBabyBot() {
    log("adding baby bot");
    var $baby = $("<div>", {id: "babyBot"});
    $("body").append($baby);

    //$baby.hide();

    var babyURL = chrome.runtime.getURL("../html/baby_bot.html");

    $baby.load(babyURL, function() {

      var graphImg = chrome.runtime.getURL("../images/Graphs_Icon.png");
      $(".viewGraphs").html('<img src="' + graphImg + '"/>See Graphs')

      callback();
    });

  }


};
