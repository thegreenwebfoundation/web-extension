/*
 * Yahoo search pagemod functions
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
            data = request.data;
            $("#web ol > li").each(function (i) {
              var loc = $(this).find('a').first().attr('href');
              var strippedurl = getUrl(loc);
                if (loc && strippedurl && data[strippedurl]) {
                  $(this).find('.TGWF').first()
                    .html(getResultNode(data[strippedurl]).append('&nbsp;'))
                    .qtip({
                      content: { 
                        text: function(api) { 
                          return getTitleWithLink(data[strippedurl]); 
                          }
                        },
                      show: { delay: 700 },
                      hide: { fixed:true,  delay:500 }
                    });
                  if(data[strippedurl].green){
                    $(this).find('.TGWF').first().qtip('option', { 'style.classes': 'qtip-green'});
                  } else {
                    $(this).find('.TGWF').first().qtip('option', { 'style.classes': 'qtip-light'});
                  }                
                  if(data[strippedurl].poweredby) {
                    $(this).find('.TGWF').parent().css('background', '#DBFA7F');
                  } 
                }
            });
        }
        sendResponse({}); // snub them.
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
        
        var locs = new Array();
        if ( $("#web ol > li").length > 0 ) {
             $("#web ol > li").each(function (i) {
                 $(this).find('.url').parent().first().children().first().prepend($('<span>', { class: 'TGWF'}).append(getImageNode('greenquestion')).append('&nbsp;'));
                 var loc = $(this).find('a').first().attr('href');
                 locs[loc] = getUrl(loc);
             });
        }
        if(locs.length > 0) {
            chrome.extension.sendRequest({locs: locs}, function(response) {
            });
        }
    });
});