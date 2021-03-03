
const GreenChecker = {

  checkBulkDomains: async function (domains, options) {
    let apiHostName = "https://api.thegreenwebfoundation.org/v2/greencheckmulti/"

    // optional override
    if (options && options.apiHost) {
      apiHostName = options.apiHost
    }
    var length = Object.keys(domains).length;


    if (length > 100) {
      console.log(`Too many domains to check, skipping our check`)
      return false
    }

    // TODO fetch sites in groups of 50 to send a batch
    // request to the API
    const sites = Object.getOwnPropertyNames(domains).splice(0, 50);
    const urlencodedSites = JSON.stringify(sites);
    console.debug(`TGWF:GreenChecker: making request for ${sites.length} sites`)
    const requestUrl = `${apiHostName}${urlencodedSites}`

    // content scripts have different permissions we need to account for
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#xhr_and_fetch
    // for firefox
    let res = null
    function checkForFireFoxContentFetch() {
      return (typeof content === "object") && (typeof content.fetch === "function")
    }
    const looksLikeFireFox = checkForFireFoxContentFetch()

    if (looksLikeFireFox) {
      console.debug("Using the Firefox content.fetch, to avoid the CORS error")
      res = await content.fetch(requestUrl)
    } else {
      console.debug("Looks like not-Firefox using the regular fetch")
      res = await fetch(requestUrl)
    }
    const domainCheckResults = await res.json()

    console.debug(`TGWF:GreenChecker: got back ${domainCheckResults.length} responses`)
    return domainCheckResults
  }
}

export { GreenChecker }
