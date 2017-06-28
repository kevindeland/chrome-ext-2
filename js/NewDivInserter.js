

function NewDivInserter () {

  var $div = $("<div>", {id: "jarvis", "class": "robot"});
  $("body").append($div);

  var jarvisURL = chrome.runtime.getURL("../html/jarvis.html");
  log(jarvisURL);
  $div.load(jarvisURL, function() {
    var robotContainer = $(".robotContainer")
    log(robotContainer);
    robotContainer.html('<img src="' + chrome.runtime.getURL("../images/bot.png") + '"/>' );
  });

};
