

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
      var robotContainer = $(".robotContainer")
      log(robotContainer);
      robotContainer.html('<img src="' + chrome.runtime.getURL("../images/bot.png") + '"/>' ); // this works

      var progressBar = $(".progressBar");
      log(progressBar);
      progressBar.html('<img src="' + chrome.runtime.getURL("../images/progress_bar_1_4.png") + '"/>'); // TODO this doesn't work???

      var helpButton = $(".helpButton");
      log(helpButton);
      helpButton.html('<input type="image" src="' + chrome.runtime.getURL("../images/help_button_placeholder.png") + '"/>');


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


        callback();
      });
  }


};
