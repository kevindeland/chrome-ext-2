MESSAGES =  {

  intro: 'I see you\'re setting a goal for {name}. Can I explain what the goal setting terms SGP and PR are?',
  introButton1: 'yes please',
  introButton2: 'maybe later',

  interventionLengthLong: 'You set a Goal End Date of {weeks} weeks from now. This should be enough time to measure growth',
  interventionLenghtShort: 'You set a Goal End Date {weeks} week{weekPlural} after the benchmark. Experts recommend a minimum of eight weeks for effective interventions. Are you sure that\'s enough time?',

  greatButton: 'great!',
  learnMoreButton: 'learn more',

  understandSgp : 'Understanding SGP can help you set ambitious yet attainable goals. Would you like me to help you understand?',
  understandSgpYes: 'yes',
  understandSgpNo: 'maybe later',

  understandScoreNumbers: 'As of the test on {testDate}, {name} was in the {percentile}{percentileSuffix} percentile (PR)'
              + ' with a scaled score (SS) of {scaledScore}. Would you like me to help you understand what this means?',
  helpWithPRButton: 'please help me with PR',
  helpWithSSButton: 'please help me with SS',

  maybeLater: 'maybe later'

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
