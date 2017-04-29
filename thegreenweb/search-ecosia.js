/*
 * Ecosia search pagemod functions (Based on bing search)
 *
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 * @copyright Cleanbits/The Green Web Foundation 2010-2014
 */

/**
 * On Request, find all hrefs and assign green or grey icon
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.data){
            data = request.data;
            $(".result").each(function (i) {
                var loc = getUrl($(this).find('a').first().attr('href'));

                if(data[loc]){
                    $(this).find('.TGWF').first()
                      .html(getResultNode(data[loc]))
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
        $('.search-filters-text').append("<span id='thegreenweb'>" + getLinkImage('green','The Green Web extension shows if a site is sustainably hosted') + ' The Green Web is enabled</span>');
        var locs = {};

        // TODO This no longer works, we need an iframe approach, see : https://github.com/thegreenwebfoundation/chrome-extension/issues/1
        if ( $(".result").length > 0 ) {
             $(".result").each(function (i) {
                 $(this).find('a').first().prepend($('<span>', { class: 'TGWF'}).append(getImageNode('greenquestion')).append('&nbsp;'));
                 var loc = getUrl($(this).find('a').first().attr('href'));
                 locs[loc] = loc;
             });
        }
        if(Object.keys(locs).length > 0) {
            chrome.extension.sendMessage({locs: locs}, function(response) {});
        }
    });
});