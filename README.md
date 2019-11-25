The Green Web web-extension
===========================

The Green Web Addon 

Tested on Chrome, Brave and Firefox

Should also work on other browsers with web-extensions support like Opera and Edge (not tested yet)

Usage
=====

Want to use this extension, install it from the browser webstores : 

For Chrome, Brave:
  https://chrome.google.com/webstore/detail/the-green-web/ekiibapogjgmlhlhpoalbppfhhgkcogc
  
For Firefox:
  https://addons.mozilla.org/nl/firefox/addon/the-green-web/

Want to help?
=============

Development on Chrome
  1. git clone git@github.com:thegreenwebfoundation/web-extension.git
  2. Open Chrome, click Extra -> Extensions and click on Developer Mode
  3. Use "Load unpacked extension" to load this directory
  4. Make your changes, test them out (use ctrl+r in the extension screen to reload)
  5. Happy with the changes? Do a commit and make a pull request

Development on Brave
  1. git clone git@github.com:thegreenwebfoundation/web-extension.git
  2. Navigate to `brave://extensions` and toggle on Developer Mode
  3. Follow the same steps as for Chrome
  
Development on Firefox
  1. git clone git@github.com:thegreenwebfoundation/web-extension.git
  2. Install web-ext (npm install -g web-ext)
  3. Run `web-ext run` inside the `thegreenweb/` folder
  4. Make your changes, test them out (use ctrl+r in the terminal where web-ext is running to reload)
  5. Happy with the changes? Do a commit and make a pull request
  
Found a bug?
============

  1. Make an issue on this repository and we'll look into it
