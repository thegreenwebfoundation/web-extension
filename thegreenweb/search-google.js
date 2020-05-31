/*
 * Google search pagemod functions
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
            console.log(request.filter);
            
            var links = $('.TGWF');
            $(links).each(function () {
                var loc = getUrl($(this).parent().attr('href'));
                if (data[loc]) {
                    $(this).html(getResultNode(data[loc]).append('&nbsp;'));
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

        var footer = document.getElementById("fbar");
        footer.appendChild(getFooterElement());

        (function checkLoop() {
            // Check if search results have 'greenweb' link
            var results = $('#res').find('.r > a');
            if ( $('.TGWF').length !== results.length) {

                // Remove all tgwf links
                $('.TGWF').remove();

                // Check urls to see if search results are green/grey
                var locs = {};
                $(results).each(function (i) {
                    // Add TGWF link to each google listing
                    $(this).prepend($('<span>', { class: 'TGWF'}).append(getImageNode('greenquestion')).append('&nbsp;'));
                    var loc = getUrl($(this).attr('href'));
                    locs[loc] = loc;
                });
                if (Object.keys(locs).length > 0) {
                    chrome.runtime.sendMessage({locs: locs}, function(response) {});
                }
            }
            setTimeout(checkLoop, 100);
        })();
    });
});
