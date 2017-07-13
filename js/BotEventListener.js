
function BotEventListener() {
  log("BotEventListener()");


  // holds the state of the GSW
  var wizardState = {
    studentName: undefined,
    interventionName: undefined,
    goalEndDate: undefined,
    startTest: {
      date: undefined,
      ss: undefined,
      pr: undefined
    },
    endGoal: {
      goalType: undefined,
      prOrSs: undefined,
      value: undefined
    },
    hasBeenCalculated: false
  };

  // holds the state of the bot buddy
  var botBuddy = {
    message: undefined,
		buttonOne: {
			text: undefined,
			callback: undefined
		},
		buttonTwo: {
			text: undefined,
			callback: undefined
		},
		buttonThree: {}
  };

  /*** initialize ***/
  var studentNameDiv = $("#ctl00_cp_Content_td_Student")[0];
  var fullName = studentNameDiv.innerHTML;
  wizardState.studentName = fullName.split(', ')[1];
  log("Studnet name: " + wizardState.studentName);


  /*** Calculate Goal button ***/
  var calculateGoal = document.querySelectorAll("input[value=\"Calculate Goal\"]")[0];

  calculateGoal.addEventListener('mouseover', function() {

  });

  calculateGoal.addEventListener('mouseleave', function() {

  });

  /*** Intervention name text input ***/
  var interventionName = $("#ctl00_cp_Content_tb_Title");

  interventionName.on('mouseover', function() {
      showBotBuddy();
  });

  interventionName.on('mouseleave', function() {
      hideBotBuddy();
  });


  /*** Setting the goal end date *()*/
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
    log(dateClickables);
    dateClickables.on('click', function(d) {
        log('clicked date');
        // log(d.currentTarget.outerText);
        // log(d.currentTarget.textContent);
        // log(d.currentTarget.outerHTML);
        log(goalEndDate[0]);
        log(goalEndDate[0].value);
    });
  });




  /** Setting the starting test **/



};

/*** for showing and hiding bot buddy ***/
function showBotBuddy() {
  $("#jarvis").show();
}

function hideBotBuddy() {
  $("#jarvis").hide();
}
