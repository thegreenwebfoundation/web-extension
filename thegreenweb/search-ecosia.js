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
  function (request, sender, sendResponse) {
    if (request.data) {
      var data = request.data;

      $(".result").each(function () {
        var loc = getUrl($(this).find('a').first().attr('href'));

        if (data[loc]) {
          $(this).find('.TGWF').first()
            .html(getResultNode(data[loc]))
            .qtip({
              content: {
                text: function (api) {
                  return getTitleWithLink(data[loc]);
                }
              },
              show: { delay: 700 },
              hide: { fixed: true, delay: 500 }
            });


          if (data[loc].green) {
            $(this).find('.TGWF').first().qtip('option', { 'style.classes': 'qtip-green' });
          } else {
            $(this).find('.TGWF').first().qtip('option', { 'style.classes': 'qtip-light' });
          }


          if (request.filter && data[loc].green === false) {
            // remove full result from the page
            $(this).hide();
          }
        }
      });
    }
    return true;
  });


/**
 * If document is ready, find the urls to check
 */
$(document).ready(function () {
  console.log("TGWF:search:ecosia")

  const req = browser.storage.local.get("tgwf_search_disabled")
  req.then(function (items) {
    if (items && items.tgwf_search_disabled) {
      console.debug("Green web search is disabled, return")
      return;
    }

    console.debug("Green web search is on")
    // Remove all tgwf links
    $('#thegreenweb').remove();

    var footer = document.getElementsByClassName("small-footer");
    footer[0].appendChild(getFooterElement());

    var locs = {};

    if ($(".result").length > 0) {
      // Remove all tgwf links
      $('.TGWF').remove();

      $(".result").each(function (i) {

        // add question mark
        $(this).find('a').first().prepend($('<span>', { class: 'TGWF' }).append(getImageNode('greenquestion')).append('&nbsp;'));

        // make a note of the link, to pull out the domain
        var loc = getUrl($(this).find('a').first().attr('href'));

        //  add it to the list
        locs[loc] = loc;
      });
    }
    if (Object.keys(locs).length > 0) {
      console.debug("sending domains to be checked", locs)
      // send list of domains to background js
      browser.runtime.sendMessage({ locs: locs }, function (response) { });
    }
  });
});
