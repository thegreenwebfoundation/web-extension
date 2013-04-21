/*
 * Yahoo search pagemod functions
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
            $("#web ol > li").each(function (i) {
              var loc = getUrl($(this).find('a').first().attr('href'));
                if (loc && data[loc]) {
                  $(this).find('.TGWF').first()
                    .html(getResultNode(data[loc]).append('&nbsp;'))
                    .qtip({
                      content: { 
                        text: function(api) { 
                          return getTitleWithLink(data[loc]); 
                          }
                        },
                      show: { delay: 700 },
                      hide: { fixed:true,  delay:500 }
                    });
                  if(data[loc].green){
                    $(this).find('.TGWF').first().qtip('option', { 'style.classes': 'qtip-green'});
                  } else {
                    $(this).find('.TGWF').first().qtip('option', { 'style.classes': 'qtip-light'});
                  }                
                }
            });
        }
    });

/**
 * If document is ready, find the urls to check
 */
$(document).ready(function() {
    chrome.storage.local.get("tgwf_search_disabled", function(items) {
        if(items.tgwf_search_disabled == 1){
          // Green web search is disabled, return
          return;
        }
        $('#ft').prepend("<p id='thegreenweb'>" + getLinkImage('green','The Green Web extension shows if a site is sustainably hosted') + ' The Green Web is enabled</p>');
        
        var locs = new Object();
        if ( $("#web ol > li").length > 0 ) {
             $("#web ol > li").each(function (i) {
                 $(this).find('.url').parent().first().children().first().prepend($('<span>', { class: 'TGWF'}).append(getImageNode('greenquestion')).append('&nbsp;'));
                 var loc = getUrl($(this).find('a').first().attr('href'));
                 locs[loc] = loc;
             });
        }
        if(Object.keys(locs).length > 0) {
            chrome.runtime.sendMessage({locs: locs}, function(response) {});
        }
    });
});