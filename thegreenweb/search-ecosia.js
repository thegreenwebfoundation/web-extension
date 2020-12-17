/*
 * Ecosia search pagemod functions (Based on bing search)
 *
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 * @copyright Cleanbits/The Green Web Foundation 2010-2020
 */
/**
 * Accept a message containing data, an object containing the domain, and green state
 */
function annotateAndFilterSearchResults(message, sender) {
  console.debug("TGWF:search:ecosia:annotateAndFilterSearchResults")
  console.debug("message", message)
  if (message.data) {
    var data = message.data;

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

        // remove link if it's not green and we have filtering enabled
        if (message.filter && data[loc].green === false) {
          // remove full result from the page
          $(this).hide();
        }
      }
    });
  }
}

chrome.runtime.onMessage.addListener(annotateAndFilterSearchResults);


/**
 * If document is ready, find the urls to check
 */
$(document).ready(function () {
  console.debug("TGWF:search:ecosia:ready")

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

    var footer = document.getElementsByClassName("small-footer");
    footer[0].appendChild(getFooterElement());

    var locs = {};

    if ($(".result").length > 0) {
      // Remove all tgwf links
      $('.TGWF').remove();

      $(".result").each(function (i) {

        // add question mark, while we wait for a response for our greencheck
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
      browser.runtime.sendMessage({ locs: locs });
    }
  }).catch(function(error) {
    console.error("Something went wrong accessing local storage", error)
  });
});
