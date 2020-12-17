/*
 * Bing search pagemod functions
 *
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 * @copyright Cleanbits/The Green Web Foundation 2010-2020
 */

console.debug("TGWF:search:bing:loading")
 
/**
 * Accept message, an object containing a set of urls with data from
 * the GreenCheck API, and where the message came from
 * run through all the links on the page, and if green
 * add the underline with the tooltip
 * @param  {} message
 * @param  {} sender
 */
function annotateAndFilterSearchResults(message, sender, sendResponse) {
  if (message.data) {
    const data = message.data;

    $("#b_results").find("li").each(function (result) {
      console.debug("first link", {link: result})
      var loc = getUrl($(this).find('a').first().attr('href'));

      if (data[loc]) {
        $(this).find('.TGWF').first()
          .html(getResultNode(data[loc]).append('&nbsp;'))
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

        // hide grey results if the filter is on
        if (message.filter && data[loc].green === false) {
          // remove full result from the page
          $(this).hide();
        }
      }
    });
  }
}

browser.runtime.onMessage.addListener(annotateAndFilterSearchResults);

/**
 * If document is ready, find the urls to check
 */
$(document).ready(function () {
  console.debug("TGWF:search:bing:ready")
  const req = browser.storage.local.get("annotate-search-results")

  req.then(function (items) {
    const annotateSearchResults = items && items['annotate-search-results']
    if (!annotateSearchResults) {
      // Green web search is disabled, return
      console.debug("Green web search annotationed are disabled, doing nothing")
      return;
    }
    // Remove all tgwf links
    $('#thegreenweb').remove();

    var footer = document.getElementById("b_results");
    footer.appendChild(getFooterElement());

    var locs = {};
    if ($("#b_results").find(".b_algo").length > 0) {

      // Remove all tgwf links
      $('.TGWF').remove();

      $("#b_results").find(".b_algo").each(function (i) {
        console.debug({link: i})

        $(this).find('a').first().prepend($('<span>', { class: 'TGWF' }).append(getImageNode('greenquestion')).append('&nbsp;'));


        var loc = getUrl($(this).find('a').first().attr('href'));

        locs[loc] = loc;
      });
    }
    if (Object.keys(locs).length > 0) {
      // send the list of urls to the background script, will then
      // send the results to annotateAndFilterSearchResults above
      console.debug("sending domains to be checked", locs)
      browser.runtime.sendMessage({ locs });
    }
  }).catch(function(error) {
    console.error("Something went wrong accessing local storage", error)
  })
});
