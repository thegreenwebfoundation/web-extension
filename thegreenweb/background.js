/*
 * Chrome functions for The Green Web addon
 *
 * @author Arend-Jan Tetteroo <aj@cleanbits.net>
 * @copyright Cleanbits/The Green Web Foundation 2010-2013
 */

/**
 * On request, send the data to the green web api
 */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) 
  {
    if (request.locs){
        doSearchRequest(request.locs,sender.tab);
    }
  }
);

/**
 * Attach the normal pageAction to the tabs
 */
chrome.webNavigation.onCommitted.addListener(function(details){doGreencheckForTabReplace(details);});
chrome.webNavigation.onCreatedNavigationTarget.addListener(function(details){doGreencheckForTabReplace(details);});
chrome.webNavigation.onTabReplaced.addListener(function(details){doGreencheckForTabReplace(details);});

function doGreencheckForTabReplace(details)
{
  var tabId = details.tabId;
  chrome.tabs.get(tabId, function(tab){
      url = tab.url;
      tabId = tab.id;

      if(isUrl(url)){
        getGreencheck(getUrl(url), tabId);  
      }      
    }
  );
}

function isUrl(url)
{
  var prot = url.substring(0,6);
  if(prot == 'chrome' || prot == 'file:/'){
     // Don't show anything for chrome pages
     return false;
  }
  return true;
}

function doGreencheckForTab(details)
{
  tabId = details.tabId;
  url   = details.url;
  if(isUrl(url)){
    getGreencheck(getUrl(url), tabId);  
  }   
}

function getGreencheck(url, tabId)
{
  date = new Date();
  currenttime = date.getTime();

  cache = window.localStorage.getItem(url);
  if(cache != null){
    // Item in cache, check cachetime
    var resp = JSON.parse(cache);
    if(resp.time && resp.time > currenttime - 3600000){
        showIcon(resp,tabId);
        return;
    }
  }
  doRequest(url,tabId);
}

/**
 * Do the search request
 */
function doSearchRequest(data,tab)
{
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://api.thegreenwebfoundation.org/greencheckmulti/"+JSON.stringify(data), true);
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
          var resp = JSON.parse(xhr.responseText);
          chrome.tabs.sendMessage(tab.id, {data: resp}, function(response) {});
      }
  }
  xhr.send();
}

/**
* Do the request
*/
function doRequest(url,tabId)
{
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://api.thegreenwebfoundation.org/greencheck/"+url, true);
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
          var resp = JSON.parse(xhr.responseText);
          resp.time = currenttime;
          window.localStorage.setItem(url,JSON.stringify(resp));
          showIcon(resp,tabId);
      }
  }
  xhr.send();
}

/**
* Show the resulting icon based on the response
*/
function showIcon(resp,tabId)
{
    icon = getImagePath(getIcon(resp));
    title = getTitle(resp);
    chrome.pageAction.setIcon({'tabId' : tabId, 'path' : icon});
    chrome.pageAction.setTitle({'tabId' : tabId, 'title' : title});
    chrome.pageAction.show(tabId);
}  