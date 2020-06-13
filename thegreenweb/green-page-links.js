/*
 * Pagemod for all external links on site
 *
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 * @copyright Cleanbits/The Green Web Foundation 2010-2020
 */

/**
 * On Request, find all hrefs and assign green or grey icon
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.data){
            var data = request.data;

            // Grab the current page url so we don't underlign same pages
            var currenturl = getUrl(document.URL);

            $("a").not('.TGWF-addon').each(function (i) {
              var loc = $(this).attr('href');
              var strippedurl = getUrl(loc);
              if (loc && strippedurl) {
                if (strippedurl === currenturl) {
                    return true;
                }
                if (data[strippedurl]) {
                  
                  if(data[strippedurl].green){
                    $(this)
                    .addClass('tgwf_green')
                    .qtip({
                      content: { text: function(api) { 
                        return getTitleWithLink(data[strippedurl]);
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
        return true;
    });

/**
 * If document is ready, find the urls to check
 */
$(document).ready(function() {
    chrome.storage.sync.get("tgwf_all_disabled", function(items) {
        if (items && items.tgwf_all_disabled && items.tgwf_all_disabled === "1") {
          // Green web search is disabled, return
          return;
        }
        getUrlsAndSendRequest();
    });
});

function getUrlsAndSendRequest()
{
  var locs = {};
  $("a").not('.TGWF-addon').each(function () {
       var loc = $(this).attr('href');
       var strippedurl = getUrl(loc);
       if (loc && strippedurl) {
         locs[strippedurl] = strippedurl
       }             
  });
  if (Object.keys(locs).length > 0) {
      chrome.runtime.sendMessage({locs: locs}, function(response) {});
  }
}