/*
 * Ecosia search pagemod functions (Based on bing search)
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

            $(".result").each(function () {
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
        return true;
    });

/**
 * If document is ready, find the urls to check
 */
$(document).ready(function() {
    chrome.storage.local.get("tgwf_search_disabled", function(items) {
        if (items && items.tgwf_search_disabled && items.tgwf_search_disabled === 1) {
          // Green web search is disabled, return
          return;
        }

        // Remove all tgwf links
        $('#thegreenweb').remove();

        var footer = document.getElementsByClassName("small-footer");
        footer[0].appendChild(getFooterElement());

        var locs = {};
        if ( $(".result").length > 0 ) {
            // Remove all tgwf links
            $('.TGWF').remove();

             $(".result").each(function (i) {
                 $(this).find('a').first().prepend($('<span>', { class: 'TGWF'}).append(getImageNode('greenquestion')).append('&nbsp;'));
                 var loc = getUrl($(this).find('a').first().attr('href'));
                 locs[loc] = loc;
             });
        }
        if (Object.keys(locs).length > 0) {
            chrome.runtime.sendMessage({locs: locs}, function(response) {});
        }
    });
});