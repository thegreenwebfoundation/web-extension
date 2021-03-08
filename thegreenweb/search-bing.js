import browser from "webextension-polyfill"
/*
 * Bing search pagemod functions
 *
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 * @copyright Cleanbits/The Green Web Foundation 2010-2020
 */

console.debug("TGWF:search:bing:loading")

function annotateAndFilterSearchResults(data) {

  $("#b_results").find("li").each(function (result) {
    console.debug("first link", { link: result })
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

      // TODO: add the hiding of results back in once we have
      // DRY'ed up the code checkers
      // // hide grey results if the filter is on
      // if (message.filter && data[loc].green === false) {
      //   // remove full result from the page
      //   $(this).hide();
      // }
    }
  });
}


function addFooter() {
  // Remove all tgwf links
  $('#thegreenweb').remove();

  var footer = document.getElementById("b_results");
  footer.appendChild(getFooterElement());
}

function gatherSearchLinks() {
  var locs = {};
  if ($("#b_results").find(".b_algo").length > 0) {

    // Remove all tgwf links
    $('.TGWF').remove();

    $("#b_results").find(".b_algo").each(function (i) {
      console.debug({ link: i })

      $(this).find('a').first().prepend($('<span>', { class: 'TGWF' }).append(getImageNode('greenquestion')).append('&nbsp;'));


      var loc = getUrl($(this).find('a').first().attr('href'));

      locs[loc] = loc;
    });
  }
  return locs
}

async function checkDomains(locs) {
  console.debug("TGWF:search:bing:sending domains to be checked", locs)
  if (Object.keys(locs).length > 0) {
    // send list of domains to background js
    const greenCheckData = await browser.runtime.sendMessage({ locs });
    console.debug("TGWF:search:bing:greenCheckData", { greenCheckData })
    return greenCheckData
  }
}


browser.runtime.onMessage.addListener(annotateAndFilterSearchResults);

/**
 * If document is ready, find the urls to check
 */
$(document).ready(function () {
  console.debug("TGWF:search:bing:ready")
  const req = browser.storage.local.get("annotate-search-results")

  req.then(async function (items) {
    const annotateSearchResults = items && items['annotate-search-results']
    if (!annotateSearchResults) {
      // Green web search is disabled, return
      console.debug("Green web search annotationed are disabled, doing nothing")
      return;
    }
    // add our footer, to show the extension is working
    addFooter()
    const searchResults = gatherSearchLinks()
    // check the domain of each result
    const greenCheckData = await checkDomains(searchResults)
    // update the DOM to show the green/grey status

    annotateAndFilterSearchResults(greenCheckData)

  }).catch(function (error) {
    console.error("Something went wrong accessing local storage", error)
  })
});
