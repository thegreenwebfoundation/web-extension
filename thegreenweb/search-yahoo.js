/*
 * Yahoo search pagemod functions
 *
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 * @copyright Cleanbits/The Green Web Foundation 2010-2020
 */


function annotateAndFilterSearchResults(data) {
  console.debug("TGWF:search:yahoo:annotateAndFilterSearchResults")

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
      // if (message.filter && data[loc].green === false) {
      //   // remove full result from the page
      //   $(this).hide();
      // }
    }
  });
}

async function checkDomains(locs) {
  console.debug("TGWF:search:yahoo:sending domains to be checked", locs)
  if (Object.keys(locs).length > 0) {
    // send list of domains to background js
    const greenCheckData = await browser.runtime.sendMessage({ locs });
    console.debug("TGWF:search:yahoo:greenCheckData", { greenCheckData })
    return greenCheckData
  }
}

function gatherSearchLinks() {

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
    return locs
  }
}


function addFooter() {
  // Remove all tgwf links
  $('#thegreenweb').remove();

  var footer = document.getElementById("ft");
  footer.appendChild(getFooterElement());
}

/**
 * If document is ready, find the urls to check
 */
console.debug("TGWF:search:yahoo:loading")
$(document).ready(findAndAnnotatedSearchResults)

function findAndAnnotatedSearchResults() {
  console.debug("TGWF:search:yahoo:ready")

  const req = browser.storage.local.get("annotate-search-results")
  req.then(async function (items) {
    const annotateSearchResults = items && items['annotate-search-results']

    if (!annotateSearchResults) {
      console.debug("Green web search annotations are disabled, doing nothing")
      return;
    }
    console.debug("Green web search is on")

    addFooter()

    // find the search results on the page, annotating each one with a question
    // mark until we have results
    const searchResults = gatherSearchLinks()
    // check the domain of each result
    const greenCheckData = await checkDomains(searchResults)
    // update the DOM to show the green/grey status
    console.log(greenCheckData)
    annotateAndFilterSearchResults(greenCheckData)

  })
}
