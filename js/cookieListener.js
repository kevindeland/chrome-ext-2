chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("received a message!");
    console.log("setting a cookie!");

    chrome.cookies.set({"name": "Sample1", "url": "https://rppres9.renlearn.com", "value": "foobar"}, function(cookie) {
      console.log(JSON.stringify(cookie));
      console.log(chrome.extension.lastError);
      console.log(chrome.runtime.lastError);
    });
  }

)
