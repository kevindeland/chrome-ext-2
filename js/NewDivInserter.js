

function NewDivInserter (callback) {
  log("NewDivInserter()");

  var $div = $("<div>", {id: "jarvis", "class": "robot"});
  $("body").append($div);

  $div.hide();

  var jarvisURL = chrome.runtime.getURL("../html/jarvis.html");
  //log(jarvisURL);
  $div.load(jarvisURL, function() {
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


    callback();
  });


};
