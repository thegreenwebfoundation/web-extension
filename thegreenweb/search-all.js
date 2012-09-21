/*
 * Pagemod for all external links on site
 *
 * @author Arend-Jan Tetteroo <aj@cleanbits.net>
 * @copyright Cleanbits/The Green Web Foundation 2010-2012
 */

/**
 * On Request, find all hrefs and assign green or grey icon
 */
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.data){
          console.log(request.data);
            data = request.data;
            console.log($("a :not(.Cleanbits > a)").length);
            $("a").each(function (i) {
                if(data[i]){
                  if(data[i].green){
                    $(this).addClass('tgwf_green');
                  }
                  console.log(data[i]);
                    $(this).find('.Cleanbits').first().html(getResult(data[i]));
                    if(data[i].poweredby) {
                       $(this).find('.Cleanbits').parent().css('background', '#DBFA7F');
                    }
                }
            });
            sendResponse({});
        }else{
            sendResponse({}); // snub them.
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
        currenturl = getUrl(document.URL);
        var locs = new Array();
        console.log($("a").length);
        $("a").each(function (i) {
             var loc = $(this).attr('href');
             var strippedurl = getUrl(loc);
             //console.log(loc);
             //console.log(getUrl(loc));
             if(loc && strippedurl){
              //console.log('valid url');
               if(getUrl(loc) == currenturl){
                 return true;
               }
               $(this).prepend('<span class="Cleanbits">' + getImage('greenquestion') + '&nbsp;</span>');
               locs[i] = getUrl(loc); 
             }             
        });
        if(locs.length > 0) {
          console.log(locs);
            chrome.extension.sendRequest({locs: locs}, function(response) {
            });
        }
    });
});