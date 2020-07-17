The Green Web web-extension
===========================

The Green Web Addon 

Tested on Chrome, Brave, Opera and Firefox

Should also work on other browsers with web-extensions support like Edge (not tested yet)

## Usage

Want to use this extension, install it from the browser webstores : 

For Chrome, Brave:
  https://chrome.google.com/webstore/detail/the-green-web/ekiibapogjgmlhlhpoalbppfhhgkcogc
  
For Firefox:
  https://addons.mozilla.org/nl/firefox/addon/the-green-web/

For Opera:
  https://addons.opera.com/nl/extensions/details/the-green-web/

## Want to help?

### Development on Chrome
  1. git clone git@github.com:thegreenwebfoundation/web-extension.git
  2. Open Chrome, click Extra -> Extensions and click on Developer Mode
  3. Use "Load unpacked extension" to load this directory
  4. Make your changes, test them out (use ctrl+r in the extension screen to reload)
  5. Happy with the changes? Do a commit and make a pull request

### Development on Brave
  1. git clone git@github.com:thegreenwebfoundation/web-extension.git
  2. Navigate to `brave://extensions` and toggle on Developer Mode
  3. Follow the same steps as for Chrome
  
### Development on Firefox
  1. git clone git@github.com:thegreenwebfoundation/web-extension.git
  2. Install web-ext (npm install -g web-ext)
  3. Run `web-ext run` inside the `thegreenweb/` folder
  4. Make your changes, test them out (use ctrl+r in the terminal where web-ext is running to reload)
  5. Happy with the changes? Do a commit and make a pull request

### Development on Opera
  1. See steps from Chrome but use Opera instead
  
## Publishing hints
### Chrome
  1. After step 5 of the chrome development above, zip up thegreenweb directory into thegreenweb.zip
  2. login on the chrome webstore developer console : https://chrome.google.com/u/3/webstore/devconsole
  3. Go to the thegreenweb item and upload a new package and click on publish. 
  4. it might complain about extended permissions, for now we run this on every website so we need broad host permissions. 
  Just click submit for review/publish. 
  
### Firefox
  1. after step 5 of the firefox development above, run `web-ext build' inside the `thegreenweb/` folder
  2. This will create a file in `thegreenweb/web-ext-artifacts` named `the_green_web-x.x.x.zip` where x.x.x is the version number in the manifest.json file
  3. Login to the addons.mozilla.org page and go to our addon to sumbit a new version
  4. add some version details and then click submit so they can review it.   
  
### Opera
  1. After step 5, launch opera and click pack extension. Get the private key from AJ
  2. Submit this crx to the opera webstore at  https://addons.opera.com/developer/package/133065/
  
### Found a bug?

  1. Make an issue on this repository and we'll look into it


## Credits

This project uses the [Chrome Web Store Sketch assets template][cws-sketch-template], by [Jean Francois Goncalves][jfg].

[cws-sketch-template]: https://www.sketchappsources.com/free-source/409-chrome-web-store-assets-template.html
[jfg]: https://www.sketchappsources.com/contributor/jfgoncalves