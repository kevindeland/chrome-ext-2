LOG_LEVEL = 'debug';

window.onload = function (){
  //console.log("Hello World");

  var ids = [ "interventionNameTxt", "endDtTxt", "endDtCal", "startDtDropdown",
              "rbModerate", "rbModAmbitious", "rbCatchUp", "rbStayUp", "rbCustom",
              "ddCustom", "txtCustom",
              "btnCancel", "btnCalcGoal", "btnSave"];


  // holds the state of the GSW
  var wizardState = {
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
    options: undefined
  };


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
    log($("#startDtDropdown option:selected").text());


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
  
  //Testing bot buddy
  botBuddy.message = 'Try setting the SPG to be more accurated based on the student start date.';
  botBuddy.options = ['Button one', 'Button Two', 'Button Three'];
  updateBotBuddy(botBuddy);

};

function log(string) {
  if(LOG_LEVEL == 'debug') console.log(string);
}

// for validating intervention name
function isValidName(interventionName) {
   return interventionName.length > 0;
}

function updateBotBuddy(botBuddy) {
	var buttons = botBuddy.options;
	
	$('.messageText').html(botBuddy.message);
	
	if(buttons.length == 2) {
		$('.buttonOne').removeClass('threeButtons').addClass('twoButtons').prop('value', buttons[0]);
		$('.buttonTwo').removeClass('threeButtons').addClass('twoButtons').prop('value', buttons[1]);
		$('.buttonThree').hide();
	}
	else if(buttons.length == 3) {
		$('.buttonOne').removeClass('twoButtons').addClass('threeButtons').prop('value', buttons[0]);
		$('.buttonTwo').removeClass('twoButtons').addClass('threeButtons').prop('value', buttons[1]);
		$('.buttonThree').show().prop('value', buttons[2]);
	}
}
