/*
 * Bing search pagemod functions
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
            $("#results ul > li").each(function (i) {
                if(data[i]){
                    $(this).find('.Cleanbits').first().html(getResult(data[i]));
                    if(data[i].poweredby) {
                       $(this).find('.Cleanbits').parent().parent().css('background', '#DBFA7F');
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
    $('#results').prepend("<p id='thegreenweb'>" + getLinkImage('green','The Green Web extension shows if a site is sustainably hosted') + ' The Green Web is enabled</p>');
    var locs = new Array();
    if ( $("#results ul > li").length > 0 ) {
         $("#results ul > li").each(function (i) {
             $(this).find('a').first().prepend(' <span class="Cleanbits">' + getImage('greenquestion') + '&nbsp;</span>');
             var loc = $(this).find('a').first().attr('href');
             locs[i] = getUrl(loc);
         });
    }
    if(locs.length > 0) {
        chrome.extension.sendRequest({locs: locs}, function(response) {
            /*console.log(response.farewell);*/
        });
    }
});