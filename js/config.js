/**
 * config.js holds links and messages
 */
var myApp = myApp || {};

myApp.config = {};

/**
 * links to various learning resources
 */
myApp.config.LINKS = {
  workedExample: "https://projects.invisionapp.com/share/T9CP8GASE#/screens",
  rtiResource: "http://doc.renlearn.com/KMNet/R004336320GJBD8A.pdf",
  sgpResource: "http://doc.renlearn.com/KMNet/R00571375CF86BBF.pdf",
  starMathResources: "http://help.renaissance.com/sm/Resources"
}

/**
 * messages which are displayed in dialogs and buttons
 */
myApp.config.MESSAGES =  {

  welcome1: 'Welcome to the Goal Setting Wizard!',
  welcome2: "Would you like me to show you an example of how to best use this tool to set personalized goals for students?",

  interventionNameHelp1: 'Try naming an intervention something that includes meaningful details about what you are doing to help the student',
  interventionNameHelp2: 'Consider including the instructional resource name, frequency of the intervention, and group side of the intervention.',

  interventionLength1: 'You set a{n} {weeks}-week intervention. Experts recommend at least eight weeks for a {grade} Grade student.',
  interventionLength2: 'Would you like to confirm this duration?',

  readyToCalculateGoal: "Click on the Goal section or the View Graphs button below to see graphs explaining each different goal type option.",

  modalTitle: "Goal Options for {first} {last}",

  goalMessage0: "Hover over the different goal lines or click the goal buttons to select a goal.",
  goalMessage1: "{name}'s {goalName} goal is {sgp} SGP and needs {rate} SS / week growth to reach {ss} SS.",
  goalMessage2: "This student will have to grow faster than {sgp}% of students at the same percentile rank to reach this goal.",

  /*** final confirmation sequence ***/
  confirmation: "Great job comparing {name}'s goal setting options! There are still a few things to consider while you choose a goal for a student:",
  motivation: "<strong>Motivation:</strong> motivated students have higher chances to achieve more challenging goals. Have you considered how to motivate {name}?",
  interventionEffectiveness: "<strong>Intervention Effectiveness:</strong> you should consider how intense your instruction is regarding intervention content, duration, frequency, class size, and past success.",
  finalConfirmation: "Do you want to confirm the goal for {name}?",
  readyToSave: "You're ready to save the goal you have selected by clicking the <strong>Save</strong> button."

}

/**
 * This function is for formatting the above MESSAGES.
 * Read about it here https://meta.stackexchange.com/questions/207128/what-is-formatunicorn-for-strings
 */
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
