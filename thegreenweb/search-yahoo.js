/*
 * Yahoo search pagemod functions
 *
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 * @copyright Cleanbits/The Green Web Foundation 2010-2020
 */

/**
 * Accept message, an object containing a set of urls with data from
 * the GreenCheck API, and where the message came from
 * run through all the links on the page, and if green
 * add the underline with the tooltip
 * @param  {} message
 * @param  {} sender
 */
function annotateAndFilterSearchResults(message, sender) {
  console.debug("TGWF:search:yahoo:annotateAndFilterSearchResults")
  if (message.data) {
    var data = message.data;
    var list = $("#web").find("ol > li");

    list.each(function () {
      var loc = getUrl($(this).find('a').first().attr('href'));
      if (loc && data[loc]) {


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


        // remove link if it's not green and we have filtering enabled
        if (message.filter && data[loc].green === false) {
          // remove full result from the page
          $(this).hide();
        }
      }
    });
  }
  return true;
}

chrome.runtime.onMessage.addListener(annotateAndFilterSearchResults);

/**
 * If document is ready, find the urls to check
 */
$(document).ready(function () {
  console.debug("TGWF:search:yahoo:ready")
  const req = browser.storage.local.get("annotate-search-results")
  req.then(function (items) {
    const annotateSearchResults = items && items['annotate-search-results']

    if (!annotateSearchResults) {
      console.debug("Green web search annotationed are disabled, doing nothing")
      return;
    }
    console.debug("Green web search is on")
    // Remove all tgwf links
    $('#thegreenweb').remove();

    var footer = document.getElementById("ft");
    footer.appendChild(getFooterElement());

    var locs = {};
    var list = $("#web").find("ol > li");
    if (list.length > 0) {


      // Remove all tgwf links
      $('.TGWF').remove();

      list.each(function (i) {

        console.log($(this))
        // add question mark, while we wait for a response for our greencheck
        $(this).find('a').parent().first().children().first().prepend($('<span>', { class: 'TGWF' }).append(getImageNode('greenquestion')).append('&nbsp;'));

        var loc = getUrl($(this).find('a').first().attr('href'));
        locs[loc] = loc;
      });
    }

    if (Object.keys(locs).length > 0) {
      console.debug("sending domains to be checked", locs)
      // send list of domains to background js
      browser.runtime.sendMessage({ locs: locs });
    }
  });
});
