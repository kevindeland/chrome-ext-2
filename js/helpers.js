/*** a bunch of helper functions ***/
// TODO what to do with all these guys?

function log(string) {
  LOG_LEVEL = "debug";
  if(LOG_LEVEL == 'debug') {console.log(string)}
}

function createCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
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
