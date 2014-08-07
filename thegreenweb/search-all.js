/*
 * Pagemod for all external links on site
 *
 * @author Arend-Jan Tetteroo <aj@cleanbits.net>
 * @copyright Cleanbits/The Green Web Foundation 2010-2013
 */

/**
 * On Request, find all hrefs and assign green or grey icon
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.data){
            data = request.data;

            // Grab the current page url so we don't underlign same pages
            currenturl = getUrl(document.URL);

            $("a").not('.TGWF-addon').each(function (i) {
              var loc = $(this).attr('href');
              var strippedurl = getUrl(loc);
              if (loc && strippedurl) {
                if (strippedurl == currenturl) {
                    return true;
                }
                if (data[strippedurl]) {
                  
                  if(data[strippedurl].green){
                    $(this)
                    .addClass('tgwf_green')
                    .qtip({
                      content: { text: function(api) { 
                        title = getTitleWithLink(data[strippedurl]); 
                        return title;
                      }},
                      show: { delay: 700 },
                      hide: { fixed:true,  delay:500 },
                      style: {
                        classes: 'qtip-green'
                      }
                    });
                  } else {
                    $(this).addClass('tgwf_grey');
                  }
                }
              }
            });
        }
    });

/**
 * If document is ready, find the urls to check
 */
$(document).ready(function() {
    chrome.storage.local.get("tgwf_all_disabled", function(items) {
        if(items.tgwf_all_disabled == 1){
          // Green web search is disabled, return
          return;
        }
        getUrlsAndSendRequest();
    });
});

function getUrlsAndSendRequest()
{
  var locs = new Object();
  $("a").not('.TGWF-addon').each(function (i) {
       var loc = $(this).attr('href');
       var strippedurl = getUrl(loc);
       if (loc && strippedurl) {
         locs[strippedurl] = strippedurl
       }             
  });
  if(Object.keys(locs).length > 0) {
      chrome.extension.sendMessage({locs: locs}, function(response) {});
  }
}