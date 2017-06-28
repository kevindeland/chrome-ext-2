

function NewDivInserter () {

  var $div = $("<div>", {id: "jarvis", "class": "robot"});
  $("body").append($div);

  $div.load("jarvis.html");
};
