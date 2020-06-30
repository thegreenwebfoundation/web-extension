# Key parts

# Updating the browser chrome on the page

The web extension works by relying on on the background.js to make calls to the API, in response to listeners being triggered when a page loads, or tab is activated.

In both cases `doGreencheckForTabReplace` is called, calling `getGreencheck` which then calls `doRequest` to update the chrome for the given tab, with the grey/green icon.

# Updating the page DOM - links to green sites, and annotating search results

In addition to updating the browser chrome, the extension also adds extra markup on the page on browsers, using the content scripts, `search-all.js`, `search-bing.js` and so on.

These send messages to background.js with `runtime.sendMessage`, which triggers `chrome.runtime.onMessage` in background.js. This calls `doSearchRequest`, which triggers a batched API request with `doApiRequest`, to send info back to the tab, to update the DOM.

More info on:
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webNavigation/onCommitted
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#Communicating_with_background_scripts
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage
