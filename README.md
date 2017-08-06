# Vittore GSW Chrome Extension
This is a chrome extension designed by the Vittore METALS Capstone Team of CMU, for Renaissance Learning.

## Instructions for Running the Code
1. Download or clone this folder into a local directory of your choice.
2. Open your Google Chrome browser and navigate to "chrome://extensions/".
3. Click on "Load unpacked extension".
4. Navigate to your location of this project and press "Select".
5. Make sure that the "Vittore GSW Extension V3" extension is Enabled. You should see the Vittore icon has been added to your Chrome toolbar.
6. Navigate to the Renaissance demo site, and then to the Goal Setting Wizard page.
7. Test out the extension with one of the following students: Amber Cheama, Amanda Baillie, Weston Chavez.

## Instructions for Understanding the code
Review the code in this order for best understanding.

### [manifest.json](./manifest.json)
Every Google Chrome extension has a [manifest file](https://developer.chrome.com/extensions/manifest). The most important thing to know is the ```content_scripts``` field. The ```matches``` array defines which URLs the extension can work for. It is currently configured to run on Intervention page for the demo site. The ```css``` and ```js``` arrays define which files are loaded.

### [Main.js](./js/Main.js)
The ```Main.js``` defines the ```window.onload``` function, which runs when the window loads. It calls two functions, the constructors for ```NewDivInserter()``` and for ```BotEventListener()```. ```NewDivInserter``` inserts the HTML for the Pedagogical Agent, and the ```BotEventListener``` adds listeners to both existing and recently added HTML elements. ```BotEventListener``` is called inside of the callback for ```NewDivInserter```, because it depends on the insertion of some of the new HTML elements.

### [NewDivInserter](./js/NewDivInserter.js)
The ```NewDivInserter``` inserts new divs and other HTML elements into the Goal-Setting Wizard. When HTML files or images must be loaded. The function [chrome.runtime.getURL](https://developer.chrome.com/extensions/runtime#method-getURL) is called to convert relative paths into fully-qualified URLs. For this reason, image sources are not directly defined in HTML files.
