

function NewDivInserter (callback) {
  log("NewDivInserter()");

  addRobot();


  function addRobot() {
    var $jarvis = $("<div>", {id: "jarvis", "class": "robot"});
    $("body").append($jarvis);

    $jarvis.hide();

    var jarvisURL = chrome.runtime.getURL("../html/jarvis.html");
    //log(jarvisURL);
    $jarvis.load(jarvisURL, function() {
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

        $(".modalGraph").html('<img src="' + chrome.runtime.getURL("images/d3_graph.png") + '" width=50%/>');
        addHelpModal();
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

      callback();
    });
  }


};
