
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

    const requestUrl = `${apiHostName}${urlencodedSites}`
    const res = await content.fetch(requestUrl)
    const domainCheckResults = await res.json()
    return domainCheckResults
  }
}
