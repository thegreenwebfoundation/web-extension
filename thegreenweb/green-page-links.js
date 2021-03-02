/*
 * Pagemod for all external links on site
 *
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 * @copyright Cleanbits/The Green Web Foundation 2010-2020
 */


/**
 * If document is ready, find the urls to check


// accept a object of form:
// {
//   "www.google.com": {
//     data: true
//     green: true
//     hostedby: "Google Inc."
//     hostedbyid: 595
//     hostedbywebsite: "www.google.com"
//     partner: null
//     url: "www.google.com"
//   }
// }
*/
function annotateLinksInDom(data) {
  var currenturl = getUrl(document.URL);


  $("a").not('.TGWF-addon').each(function (i) {

    var loc = $(this).attr('href');
    var strippedurl = getUrl(loc);

    if (loc && strippedurl) {

      // this the current url, no need to annotate
      if (strippedurl === currenturl) {
        return true;
      }
      const domainResult = data[strippedurl]

      if (domainResult) {

        if (domainResult.green) {
          $(this)
            .addClass('tgwf_green')
            .qtip({
              content: {
                text: function (api) {
                  return getTitleWithLink(domainResult);
                }
              },
              show: { delay: 700 },
              hide: { fixed: true, delay: 500 },
              style: {
                classes: 'qtip-green'
              }
            });
        } else {
          $(this).addClass('tgwf_grey');
        }
      }
    }
  });
}

function checkLinkDomains() {
  chrome.storage.sync.get("tgwf_all_disabled", async function (items) {
    if (items && items.tgwf_all_disabled && items.tgwf_all_disabled === "1") {
      // Green web search is disabled, return
      return;
    }
    await getUrlsAndSendRequest();
  });
}

async function getUrlsAndSendRequest() {
  console.log("Link checking enabled.")
  var locs = {};
  $("a").not('.TGWF-addon').each(function () {
    var loc = $(this).attr('href');
    var strippedurl = getUrl(loc);
    if (loc && strippedurl) {
      locs[strippedurl] = strippedurl
    }
  });

  if (Object.keys(locs).length > 0) {
    const greenCheckData = await GreenChecker.checkBulkDomains(locs)
    annotateLinksInDom(greenCheckData)
  }
}
$(document).ready(checkLinkDomains);
