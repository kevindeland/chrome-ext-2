LOG_LEVEL = 'debug';

window.onload = function (){
  //console.log("Hello World");

  var ids = [ DIVS.interventionNameTxt, DIVS.endDtTxt, DIVS.endDtCal, DIVS.startDtDropdown,
              DIVS.rbModerate, DIVS.rbModAmbitious, DIVS.rbCatchUp, DIVS.rbStayUp, DIVS.rbCustom,
              DIVS.ddCustom, DIVS.txtCustom,
              DIVS.btnCancel, DIVS.btnCalcGoal, DIVS.btnSave];

  // TODO how to access teacher preferences?

  // TODO make more abstraction...
  // i.e. switch/case which accepts the event and the element

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

  /**
   * initial state
   */
  wizardState.studentName = 'Kathryn';
  var scoreText = $("#" + DIVS.startDtDropdown + " option:selected").text();
  wizardState.startTest = parseDropdownTestScore(scoreText);

  /**
   * setting the initial buddy state
   */
  botBuddy = {
    message :  MESSAGES.intro.formatUnicorn({name: wizardState.studentName}),
    buttonOne : {
      text: MESSAGES.introButton1,
      callback: function() {
        showBigPopup("sgp1")
      }
    },
    buttonTwo : {
      text: MESSAGES.introButton2,
      callback: function() {
        hideBotBuddy()
      }
    }
  };
  updateBotBuddy(botBuddy);


  // intervention name
  var interventionNameTxt = $("#" + DIVS.interventionNameTxt);

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
  var endDtTxt = $("#" + DIVS.endDtTxt);

  endDtTxt.on('blur', function() {
    var endDt = endDtTxt.val();
    log('done editing end date ' + endDt);
    wizardState.goalEndDate = Date.parse(endDt);
    var diff = compareTestDates(wizardState.startTest.date, wizardState.goalEndDate);

    showInterventionLengthBuddy(diff);
  });

  /**
   * a buddy that helps adjust the intervention length
   */
  function showInterventionLengthBuddy(diff) {
    if(diff.valid) {
      botBuddy = {
        message : MESSAGES.interventionLengthLong.formatUnicorn({weeks: intToText(diff.weeks)}),
        buttonOne : {
          text: MESSAGES.greatButton,
          callback: function() {
            understandSgpBuddy();
          }
        },
        buttonTwo : {
          text: MESSAGES.learnMoreButton,
          callback: function() {
            showBigPopup("interventionLength");
          }
        },
        buttonThree: {
          text: 'change date',
          callback: function() {
            hideBotBuddy();
          }
        }
      };
      updateBotBuddy(botBuddy);
    } else {
      botBuddy = {
        message : MESSAGES.interventionLenghtShort.formatUnicorn({weeks: intToText(diff.weeks), weekPlural: (diff.weeks == 1 ? '': 's')}),
        buttonOne : {
          text: 'yes',
          callback: function() {
            understandSgpBuddy();
          }
        },
        buttonTwo : {
          text: 'learn more',
          callback: function() {
            showBigPopup("weeks");
          }
        },
        buttonThree: {
          text: 'change date',
          callback: function() {
            hideBotBuddy();
          }
        }
      };
      updateBotBuddy(botBuddy);
    }
  };

  /**
   * a buddy that asks to help understand SGP
   */
  function understandSgpBuddy() {
    botBuddy = {
      message : MESSAGES.understandSgp,
      buttonOne : {
        text: MESSAGES.understandSgpYes,
        callback: function() {
          showBigPopup("sgp2");
        }
      },
      buttonTwo : {
        text: MESSAGES.understandSgpNo,
        callback: function() {
          understandNumbersBuddy();
        }
      }
    };
    updateBotBuddy(botBuddy);
  };

  /**
   * a buddy that asks to help understand SS and PR
   */
  function understandNumbersBuddy() {

    // TODO highlight Starting Test
    $("#" + DIVS.startDtDropdown).addClass("highlight");

    var dateString = 'Dec, 12'; // TODO make it actual date
    var studentName = wizardState.studentName;
    var percentile = wizardState.startTest.pr;
    var percentileSuffix = getRankSuffix(percentile);
    var scaledScore = wizardState.startTest.ss;

    botBuddy = {
      message : MESSAGES.understandScoreNumbers.formatUnicorn({testDate: dateString, name: studentName, percentile: percentile, percentileSuffix: percentileSuffix, scaledScore: scaledScore}),
      buttonOne : {
        text: MESSAGES.helpWithPRButton,
        callback: function() {
          showBigPopup("pr");
        }
      },
      buttonTwo : {
        text: MESSAGES.helpWithSSButton,
        callback: function() {
          showBigPopup("ss");
        }
      },
      buttonThree: {
        text: MESSAGES.maybeLater,
        callback: function() {
          hideBotBuddy();
          // TODO highlight calculate goal
        }
      }
    };
    updateBotBuddy(botBuddy);
  }

  // TODO figure out highlights



  // Goal End Date calendar... function not available in this mockup
  var endDtCal = $("#endDtCal");


  // Start Date Dropdown
  var startDtDropdown = $("#" + DIVS.startDtDropdown);
  startDtDropdown.on('click', function() {
    log('choosing start date');

  });

  startDtDropdown.on('change', function() {
    log('chose start date');

    // extracts date and score from dropdown
    var scoreText = $("#" + DIVS.startDtDropdown + " option:selected").text();
    wizardState.startTest.date = parseDropdownTestScore(scoreText);
    log(wizardState.startTest.date);


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

  var modal = document.getElementById("myModal");
  var span = $(".close")[0];
  var modalInner = $('#myModal p');
  span.onclick = function() {
    hideBigPopup();
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          hideBigPopup();
      }
  }

  function showBigPopup(topic) {
    log("BIG POPUP FOR $" +  topic + " NOW SHOWING");
    // TODO NEXT make a div for big popup, and populate it
    var modal = document.getElementById('myModal');
     modal.style.display = "block";
    // modalInner.innerHTML = topic;

    var filename = "popups/" + topic + ".html";
     $('.modalContent').html('<object type="text/html" data="'+ filename + '" > </object>');
  }

  function hideBigPopup() {
    // When the user clicks on <span> (x), close the modal
    // Get the <span> element that closes the modal
    modalInner.innerHTML = "";
    modal.style.display = "none";
  }

  window.getWizardState = function() {
    return wizardState;
  }


};

//==============================
// UI Helpers
//==============================
function updateBotBuddy(botBuddy) {
  showBotBuddy();

	$('.messageText').html(botBuddy.message);

	if(botBuddy.buttonThree) {
		$('.buttonOne').removeClass('twoButtons').addClass('threeButtons').prop('value', botBuddy.buttonOne.text);
	  $('.buttonTwo').removeClass('twoButtons').addClass('threeButtons').prop('value', botBuddy.buttonTwo.text);
	  $('.buttonThree').show().prop('value', botBuddy.buttonThree.text);
    $('.buttonOne').prop('onclick',null).off('click');
		$('.buttonOne').on('click', botBuddy.buttonOne.callback);
    $('.buttonTwo').prop('onclick',null).off('click');
		$('.buttonTwo').on('click', botBuddy.buttonTwo.callback);
    $('.buttonThree').prop('onclick',null).off('click');
	  $('.buttonThree').on('click', botBuddy.buttonThree.callback);
	}
	else {
	  $('.buttonOne').removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonOne.text);
	  $('.buttonTwo').removeClass('threeButtons').addClass('twoButtons').prop('value', botBuddy.buttonTwo.text);
    $('.buttonOne').prop('onclick',null).off('click');
	  $('.buttonOne').on('click', botBuddy.buttonOne.callback);
    $('.buttonTwo').prop('onclick',null).off('click');
		$('.buttonTwo').on('click', botBuddy.buttonTwo.callback);
		$('.buttonThree').hide();
	}
}



function showPopup() {
  var popup = document.getElementById("bigPopup");
  popup.classList.toggle("show");
}

function hideBotBuddy() {
  $(".jarvis").hide();
  log("HIDING BOT BUDDY");
}

function showBotBuddy() {
  $(".jarvis").show();
  log("SHOWING BOT BUDDY");
}
