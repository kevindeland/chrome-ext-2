window.onload = function () {
  log("page loaded, adding script to page");

  log("么么哒");
  log("么么哒");
  log("么么哒");
  log("么么哒");

  window.NewDivInserter = new NewDivInserter(function() {
    // need to do as callback so all divs are available
    window.BotEventListener = new BotEventListener();
  });

};

window.onresize = function() {
  log("resizing window!!!");

  //redrawBars();
  // BUG don't do this if the graph window is not open
  redrawAxes();
};
