USE_D3 = true;

MESSAGES =  {

  welcome1: 'Welcome to the Goal Setting Wizard!',
  welcome2: "Would you like me to show you an example of how to best use this tool to set personalized goals for students?",

  intro: 'I see you\'re setting a goal for {name}. Can I explain what the goal setting terms SGP and PR are?',
  introButton1: 'yes please',
  introButton2: 'maybe later',

  interventionNameHelp1: 'Try naming an intervention something that includes meaningful details about what you are doing to help the student',
  interventionNameHelp2: 'Consider including the instructional resource name, frequency of the intervention, and group side of the intervention.',


  interventionLengthLong: 'You set a Goal End Date of {weeks} weeks from now. This should be enough time to measure growth',
  interventionLenghtShort: 'You set a Goal End Date {weeks} week{weekPlural} after the benchmark. Experts recommend a minimum of eight weeks for effective interventions. Are you sure that\'s enough time?',

  interventionLength1: 'You set a{n} {weeks}-week intervention. Experts recommend at least eight weeks for a 3rd Grade student.',
  interventionLength2: 'Would you like to confirm this duration?',


  greatButton: 'great!',
  learnMoreButton: 'learn more',

  understandSgp : 'Understanding SGP can help you set ambitious yet attainable goals. Would you like me to help you understand?',
  understandSgpYes: 'yes',
  understandSgpNo: 'maybe later',

  understandScoreNumbers: 'As of the test on {testDate}, {name} was in the {percentile}{percentileSuffix} percentile (PR)'
              + ' with a scaled score (SS) of {scaledScore}. Would you like me to help you understand what this means?',
  helpWithPRButton: 'please help me with PR',
  helpWithSSButton: 'please help me with SS',

  maybeLater: 'maybe later',

  modalTitle: "Goal Options for {first} {last}",
  modGoalMessage1: "{name}'s moderate goal is 50 SGP and needs {rate} SS / week growth to reach {ss}",
  modGoalMessage2: "This student will have to grow faster than 50% of students at the same percentile rank to reach this goal",

  /*** final confirmation sequence ***/
  confirmation: "Great job comparing {name}'s goal setting options! There are still a few things to consider while you choose a goal for a student:",
  motivation: "<strong>Motivation:</strong> motivated students have higher chances to achieve more challenging goals. Have you considered how to motivate Jamie?",
  interventionEffectiveness: "<strong>Intervention Effectiveness:</strong> you should consider how intense your instruction is regarding intervention content, duration, frequency, class size, and past success.",
  finalConfirmation: "Do you want to confirm the goal for {name}?",
  readyToSave: "You're ready to save the goal you have selected by clicking the <strong>Save</strong> button."

}

DIVS = {
    interventionNameTxt: "interventionNameTxt",
    endDtTxt:"endDtTxt",
    endDtCal:"endDtCal",
    startDtDropdown:"startDtDropdown",
    rbModerate:"rbModerate",
    rbModAmbitious:"rbModAmbitious",
    rbCatchUp:"rbCatchUp",
    rbStayUp:"rbStayUp",
    rbCustom:"rbCustom",
    ddCustom:"ddCustom",
    txtCustom:"txtCustom",
    btnCancel:"btnCancel",
    btnCalcGoal:"btnCalcGoal",
    btnSave:"btnSave"
}


String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};
