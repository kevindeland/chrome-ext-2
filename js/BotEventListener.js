
function BotEventListener() {
  log("BotEventListener");
  BotStateManager = new BotStateManager();

  var calculateGoal = document.querySelectorAll("input[value=\"Calculate Goal\"]")[0];

  calculateGoal.addEventListener('mouseover', function() {
    BotStateManager.process('calculateGoal', 'mouseover');
  });

  calculateGoal.addEventListener('mouseleave', function() {
    BotStateManager.process('calculateGoal', 'mouseleave');
  });


  var interventionName = $("#ctl00_cp_Content_tb_Title");

  interventionName.on('mouseover', function() {
    log('mouseover interventionName');
  });

  var goalEndDate = $("#ctl00_cp_Content_tb_Target");

  goalEndDate.on('mouseover', function() {
    log('mouseover goalEndDate');
  });

  goalEndDate.on('change', function() {
    log('change goalEndDate');
  });

  // some divs do not appear until this button is clicked, so we
  // have to find them on click
  var datePickerTrigger = $(".ui-datepicker-trigger");
  datePickerTrigger.on('click', function() {
    log('clicked datePickerTrigger');

    var dateClickables = $(".ui-datepicker-calendar > tbody > tr > td").not(".ui-datepicker-unselectable");
    dateClickables.on('click', function() {
      log('changed date!');
    });
  });




};
