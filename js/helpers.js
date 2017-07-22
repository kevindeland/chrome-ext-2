/*** a bunch of helper functions ***/
// TODO what to do with all these guys?

function log(string) {
  LOG_LEVEL = "debug";
  if(LOG_LEVEL == 'debug') {console.log(string)}
}

function parseGoalData(text) {
  regex = /^(\d{1,3}\.\d{1}) SS\/week = (\d{1,4}) SS/
  parsedText = text.match(regex);

  return {
    rate: parsedText[1],
    ss: parsedText[2]
  };
}

// for validating intervention name
function isValidName(interventionName) {
   return interventionName.length > 0;
}

function compareTestDates(startDt, endDt) {
  log("comparing test dates " + startDt + " " + endDt);

  days = Math.floor((endDt - startDt) / (1000 * 60 * 60 * 24));
  weeks = Math.floor((endDt - startDt) / (1000 * 60 * 60 * 24 * 7));
  valid = weeks >= 8;

  return {
    days: days,
    weeks: weeks,
    valid: valid
  };
}

function intToText(int) {
  if(int > 24) return "" + int;

  return ["zero", "one", "two", "three", "four", "five", "six",
          "seven", "eight", "nine", "ten", "eleven", "twelve",
          "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
          "nineteen", "twenty", "twenty-one", "twenty-two", "twenty-three", "twenty-four"][int];
}

function decideAorAn(int) {
  if(int == 8 || int == 11 || int == 18 || (int < 90 && int >=80)) return "n";
  else return "";

}
