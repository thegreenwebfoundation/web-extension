import $ from 'jquery'
import browser from "webextension-polyfill"
import tippy from 'tippy.js';
import { getUrl, getResultNode, getTitleWithLink, getImageNode, getFooterElement } from './thegreenweb-utils'
/*
 * Ecosia search pagemod functions (Based on bing search)
 *
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 * @copyright Cleanbits/The Green Web Foundation 2010-2020
 */
/**
 * Accept a message containing data, an object containing the domain, and green state
 */
function annotateAndFilterSearchResults(data) {
  console.log("TGWF:search:ecosia:annotateAndFilterSearchResults")

  $(".result").not('.card-relatedsearches .result').each(function () {
    var loc = getUrl($(this).find('a').first().attr('href'));

    if (data[loc]) {

      const greenlink = $(this).find('.TGWF').first()

      // replace with text, prepending our green/grey smiley
      greenlink.html(getResultNode(data[loc]))

      // add the tooltip to the link
      addToolTip(greenlink)
    }
  });
}

/**
 * Accept a tooltip, and add tooltip behaviour, that was provided by jquery qtip
 * @param  {} elem
 */
function addToolTip(elem) {

  // TODO: replace this code, obvs

  // .qtip({
  //   content: {
  //     text: function (api) {
  //       return getTitleWithLink(data[loc]);
  //     }
  //   },
  //   show: { delay: 700 },
  //   hide: { fixed: true, delay: 500 }
  // });


  // if (data[loc].green) {
  //   $(this).find('.TGWF').first().qtip('option', { 'style.classes': 'qtip-green' });
  // } else {
  //   $(this).find('.TGWF').first().qtip('option', { 'style.classes': 'qtip-light' });
  // }

  // remove link if it's not green and we have filtering enabled
  // if (message.filter && data[loc].green === false) {
  //   // remove full result from the page
  //   $(this).hide();
  // }
}

function gatherSearchLinks() {
  var ecosiaResults = {};
  console.log("TGWF:search:ecosia:ecosiaResults", { ecosiaResults })

  if ($(".result").length > 0) {
    // Remove all tgwf links
    $('.TGWF').remove();

    $(".result").not('.card-relatedsearches .result').each(function (i) {

      // add question mark, while we wait for a response for our greencheck
      $(this).find('a').first().prepend($('<span>', { class: 'TGWF' }).append(getImageNode('greenquestion')).append('&nbsp;'));

      // make a note of the link, to pull out the domain
      var loc = getUrl($(this).find('a').first().attr('href'));


      //  any check to avoid sending a domain named 'false' to the API

      if (loc != false) {
        ecosiaResults[loc] = loc;
      }
    });
    return ecosiaResults
  }
}

function addFooter() {
  $('#thegreenweb').remove();
  var footer = document.getElementsByClassName("small-footer");
  footer[0].appendChild(getFooterElement());
}


async function checkDomains(locs) {
  console.debug("TGWF:search:ecosia:sending domains to be checked", locs)
  if (Object.keys(locs).length > 0) {
    // send list of domains to background js
    const greenCheckData = await browser.runtime.sendMessage({ locs });
    console.debug("TGWF:search:ecosia:greenCheckData", { greenCheckData })
    return greenCheckData
  }
}


function findAndAnnotatedSearchResults() {
  console.debug("TGWF:search:ecosia:ready")

  // TODO: try/catch this
  let items = null;
  async function checkSettings() {
    items = await browser.storage.local.get("annotate-search-results")

    const annotateSearchResults = items && items['annotate-search-results']

    if (!annotateSearchResults) {
      console.debug("Green web search annotationed are disabled, doing nothing")
      return false;
    }

    console.debug("Green web search is on")


    // Remove all tgwf links
    addFooter()
    // find the search results on the page, annotating each one with a question
    // mark until we have results
    const searchResults = gatherSearchLinks()
    // check the domain of each result
    const greenCheckData = await checkDomains(searchResults)
    // update the DOM to show the green/grey status
    console.log(greenCheckData)
    annotateAndFilterSearchResults(greenCheckData)
  }

  //
  checkSettings()



}

/**
 * If document is ready, find the urls to check
 */
console.debug("TGWF:search:ecosia:loading")
$(findAndAnnotatedSearchResults);
