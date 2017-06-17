LOG_LEVEL = 'debug';

window.onload = function (){
  //console.log("Hello World");

  var ids = [ "interventionNameTxt", "endDtTxt", "endDtCal", "startDtDropdown",
              "rbModerate", "rbModAmbitious", "rbCatchUp", "rbStayUp", "rbCustom",
              "ddCustom", "txtCustom",
              "btnCancel", "btnCalcGoal", "btnSave"];


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

  // initialize for demo
  wizardState.studentName = 'Kathryn';

  botBuddy.message = 'I see you\'re setting a goal for ' + wizardState.studentName + '. Can I explain what the goal setting terms SGP and PR are?';
  botBuddy.buttonOne = {
    text: 'yes please',
    callback: function() {
      showBigassPopup()
    }
  };
  botBuddy.buttonTwo = {
    text: 'maybe later',
    callback: function() {
      hideBotBuddy()
    }
  };
  delete(botBuddy.buttonThree);

  updateBotBuddy(botBuddy);


  // intervention name
  var interventionNameTxt = $("#interventionNameTxt");

  interventionNameTxt.on('click', function() {
    log('begin editing intervention name');


  });

  interventionNameTxt.on('blur', function() {
    if(isValidName(interventionNameTxt.val())) {
      wizardState.interventionName = interventionNameTxt.val();
      log('done editing intervention name to ' + wizardState.interventionName);
    }
  });

  // Goal End Date
  var endDtTxt = $("#endDtTxt");
  endDtTxt.on('click', function() {
    log('begin editing end date');


  });

  endDtTxt.on('blur', function() {
    log('done editing end date');
    // TODO check to see if end date - start date < 8 weeks, and add appropriate bot buddy

  });

  // Goal End Date calender... function not available in this mockup
  var endDtCal = $("#endDtCal");


  // Start Date Dropdown
  var startDtDropdown = $("#startDtDropdown");
  startDtDropdown.on('click', function() {
    log('choosing start date');

  });

  startDtDropdown.on('change', function() {
    log('chose start date');

    // extracts date and score from dropdown
    var scoreText = $("#startDtDropdown option:selected").text();
    wizardState.goalEndDate = parseDropdownTestScore(scoreText);

    log(wizardState.goalEndDate);

  });

  // rb = radio button
  var rbModerate = $("#rbModerate");

  var rbModAmbitious = $("#rbModAmbitious");

  var rbCatchUp = $("#rbCatchUp");

  var rbStayUp = $("#rbStayUp");

  var rbCustom = $("#rbCustom");

  // dd = dropdown
  var ddCustom = $("#ddCustom");

  var txtCustom = $("#txtCustom");

  var btnCancel = $("#btnCancel");

  var btnCalcGoal = $("#btnCalcGoal");

  var btnSave = $("#btnSave");

  ids.forEach(function(id) {
    var elem = document.getElementById(id);
    elem.addEventListener('click', function() {
      console.log("clicked " + id);
    });
  });

  return;
  //Testing bot buddy
  botBuddy.message = 'Try setting the SPG to be more accurated based on the student start date.';
  botBuddy.buttonOne.text = 'Button One';
  botBuddy.buttonOne.callback = testOne;
  botBuddy.buttonTwo.text = 'Button Two';
  botBuddy.buttonTwo.callback = testTwo;
	botBuddy.buttonThree.text = 'Button Three';
  botBuddy.buttonThree.callback = testThree;
  updateBotBuddy(botBuddy);

};

function log(string) {
  if(LOG_LEVEL == 'debug') {console.log(string)}
}

// for parsing the score date
function parseDropdownTestScore(text) {
  regex = /^(\d{1,2}\/\d{1,2}\/\d{4}) \- (\d{1,3}) SS \/ (\d{1,3}) PR/
  parsedScoreText = text.match(regex);

  return {
    date: Date.parse(parsedScoreText[1]),
    ss: parsedScoreText[2],
    pr: parsedScoreText[3]
  }
}


// for validating intervention name
function isValidName(interventionName) {
   return interventionName.length > 0;
}


function updateBotBuddy(botBuddy) {
	$('.messageText').html(botBuddy.message);

	if(botBuddy.buttonThree) {
		$('.buttonOne').removeClass('twoButtons').addClass('threeButtons').prop('value', botBuddy.buttonOne.text);
	  $('.buttonTwo').removeClass('twoButtons').addClass('threeButtons').prop('value', botBuddy.buttonTwo.text);
	  $('.buttonThree').show().prop('value', botBuddy.buttonThree.text);
		$('.buttonOne').on('click', botBuddy.buttonOne.callback);
		$('.buttonTwo').on('click', botBuddy.buttonTwo.callback);
	  $('.buttonThree').on('click', botBuddy.buttonThree.callback);
	}
	else {
	  $('.buttonOne').removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonOne.text);
	  $('.buttonTwo').removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonTwo.text);
	  $('.buttonOne').on('click', botBuddy.buttonOne.callback);
		$('.buttonTwo').on('click', botBuddy.buttonTwo.callback);
		$('.buttonThree').hide();
	}
}

function showBigassPopup() {
  log("BIGASS POPUP NOW SHOWING");
  // TODO make a div for bigass popup, and populate it
}

function hideBotBuddy() {
  $(".jarvis").hide();
  log("HIDING BOT BUDDY");
  // TODO remember what they clicked?
}

function testOne() {
	alert('you clicked button one');
}

function testTwo() {
	alert('you clicked button two');
}

function testThree() {
	alert('you clicked button three');
}
