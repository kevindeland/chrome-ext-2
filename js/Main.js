window.onload = function () {
  log("page loaded, adding script to page");

  window.NewDivInserter = new NewDivInserter(function() {
    // need to do as callback so all divs are available
    window.BotEventListener = new BotEventListener();
  });

};
