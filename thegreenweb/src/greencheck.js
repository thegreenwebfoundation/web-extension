
const GreenChecker = {

  /**
   * Accept am object, domains, keyed by domains,
   * and domainCheckResults, an arrat of Domain objects
  */
  buildReturnPayload(domains, domainCheckResults) {

    // make our grey domainObjects
    const checkedDomains = {}
    for (const domain of Object.keys(domains)) {
      checkedDomains[domain] = {
        green: false,
        url: domain,
        data: true
      }
    }
    // then update grey list with the green results
    for (const domainCheck of domainCheckResults) {
      checkedDomains[domainCheck.url] = domainCheck
    }
    return checkedDomains
  },

  checkBulkDomains: async function (domains, options) {
    let apiHostName = "https://admin.thegreenwebfoundation.org/api/v3/greencheck/"
    // let apiHostName = "https://api.thegreenwebfoundation.org/v2/greencheckmulti/"

    // optional override
    if (options && options.apiHost) {
      apiHostName = options.apiHost
    }
    var length = Object.keys(domains).length;


    if (length > 100) {
      console.log(`Too many domains to check, skipping our check`)
      return false
    }

    const sites = Object.getOwnPropertyNames(domains).splice(0, 50);
    // make comma separated list
    const urlencodedSites = Object.keys(domains).join(',')

    console.debug(`TGWF:GreenChecker: making request for ${sites.length} sites`)
    const requestUrl = `${apiHostName}?urls=${urlencodedSites}`

    const res = await fetch(requestUrl)
    const domainCheckResults = await res.json()
    console.debug(`TGWF:GreenChecker: got back ${domainCheckResults.length} responses`)

    return this.buildReturnPayload(domains, domainCheckResults)
  }
}

export { GreenChecker }
