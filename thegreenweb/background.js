/*
 * Chrome functions for The Green Web addon
 *
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 * @copyright Cleanbits/The Green Web Foundation 2010-2020
 */

/**
 * On request, send the data to the green web api
 */
browser.runtime.onMessage.addListener(handledomainLookup);


async function handledomainLookup(message, sender, sendResponse) {
  console.debug({ sender: sender.url })
  console.debug({ message })
  if (message.locs) {
    // doSearchRequest(request.locs, sender.tab);
    const greenCheckData = await GreenChecker.checkBulkDomains(message.locs)
    return Promise.resolve(greenCheckData)
  }
  // Instead of returning true, we return a promise that
  // resolves to true, as runtime.sendMessage now uses
  // Promises



}

/**
 * Attach the normal pageAction to the tabs
 */
function doGreencheckForTabReplace(details) {
  var tabId = details.tabId;
  browser.tabs.get(tabId, function (tab) {
    if (tab && tab.url) {
      var url = tab.url;
      tabId = tab.id;

      if (isUrl(url)) {
        var checkUrl = getUrl(url);
        if (checkUrl !== false) {
          getGreencheck(checkUrl, tabId);
        }
      }
    }
  }
  );
}

browser.webNavigation.onCommitted.addListener(function (details) {
  doGreencheckForTabReplace(details);
});
browser.tabs.onActivated.addListener(function (details) {
  doGreencheckForTabReplace(details);
});

/**
 * Check if the url is available for lookup, chrome and file need to be ignored
 *
 * @param url
 * @returns {boolean}
 */
function isUrl(url) {
  var prot = url.substring(0, 6);
  if (prot === 'chrome' || prot === 'file:/') {
    // Don't show anything for chrome pages
    return false;
  }
  return true;
}

function getCurrentTime() {
  var date = new Date();
  return date.getTime();
}

/**
 * Do a greencheck api call if not cached
 *
 * @param url
 * @param tabId
 */
function getGreencheck(url, tabId) {
  var currentTime = getCurrentTime();

  var cache = window.localStorage.getItem(url);
  if (cache !== null) {
    // Item in cache, check cachetime
    var resp = JSON.parse(cache);
    if (resp.time && resp.time > currentTime - 3600000) {
      showIcon(resp, tabId);
      return;
    }
  }
  doRequest(url, tabId);
}

/**
 * Do the search request
 */
function doSearchRequest(data, tab) {
  var length = Object.keys(data).length;
  // We ignore sites with more than a 100 urls
  if (length <= 100) {
    var sites = Object.getOwnPropertyNames(data).splice(0, 50);
    var sitesUrl = JSON.stringify(sites);

    doApiRequest(sitesUrl, tab);

    if (length > 50) {
      sites = Object.getOwnPropertyNames(data).splice(50, 50);
      sitesUrl = JSON.stringify(sites);
      console.log(sitesUrl)

      doApiRequest(sitesUrl, tab);
    }
  }
}

/**
 * Do an api request for multiple sites.
 * After checking the sites returns the result,
 * plus whether to filter the grey results from the page
 *
 * @param siteDomains
 * @param tab
 */
function doApiRequest(siteDomains, tab) {
  console.debug("background:doApiRequest")
  const req = browser.storage.local.get("filter-out-grey-search-results")
  req.then(function (items) {

    const filterOutGreyResults = items && items['filter-out-grey-search-results']


    console.debug("background:doApiRequest", { siteDomains })


    var xhr = new XMLHttpRequest();

    xhr.open("GET", "https://api.thegreenwebfoundation.org/v2/greencheckmulti/" + siteDomains, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var greenChecks = JSON.parse(xhr.responseText);

        // send the checked urls back to the tab that made the request
        console.debug("background:doApiRequest", { greenChecks })
        browser.tabs.sendMessage(tab.id, {
          data: greenChecks, filter: filterOutGreyResults
        });
      }
    }
    xhr.send();
  });
}

/**
* Do the request for a single url
*/
function doRequest(url, tabId) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.thegreenwebfoundation.org/greencheck/" + url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var resp = JSON.parse(xhr.responseText);
      resp.time = getCurrentTime();
      window.localStorage.setItem(url, JSON.stringify(resp));
      showIcon(resp, tabId);
    }
  }
  xhr.send();
}

/**
* Show the resulting icon based on the response
*/
function showIcon(resp, tabId) {
  var icon = getImagePath(getIcon(resp), true);
  var title = getTitle(resp);
  browser.pageAction.setIcon({ 'tabId': tabId, 'path': icon });
  browser.pageAction.setTitle({ 'tabId': tabId, 'title': title });
  browser.pageAction.show(tabId);
}

browser.pageAction.onClicked.addListener(function () {
  browser.runtime.openOptionsPage()
});
