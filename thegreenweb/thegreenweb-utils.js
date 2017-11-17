/**
 * Utilities for the greenweb add-on
 *
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 * @copyright Cleanbits/The Green Web Foundation 2010-2014
 */

/**
 * Get the url from the given location
 */
function getUrl(loc)
{
    loc = this.stripProtocolFromUrl(loc);
    if (loc === false) {
        return false;
    }
    loc = this.stripQueryStringFromUrl(loc);
    loc = this.stripPageFromUrl(loc);
    loc = this.stripPortFromUrl(loc);

    // Don't lookup localhost
    if (loc === 'localhost') {
        return false;
    }

    return loc;
}

/**
 * Strip the protocol from the location
 * If no http or https given, then return false
 */
function stripProtocolFromUrl(loc)
{
    if (loc === undefined) {
        return false;
    }

    var prot = loc.substring(0,5);
    if(prot === 'http:'){
        return loc.substring(7);
    }

    if(prot === 'https'){
        return loc.substring(8);
    }

    // No http or https, no lookup
    return false;
}

/**
 * Only use the domain.tld, not the querystring behind ? or #
 */
function stripQueryStringFromUrl(loc)
{
    var temp = loc.split('?');
    loc = temp[0];
    temp = loc.split('#');
    loc = temp[0];
    return loc;
}

/**
 * Only use the domain.tld, not the page
 */
function stripPageFromUrl(loc)
{
    var temp = loc.split('/');
    loc = temp[0];
    return loc;
}

/**
 * Only use the domain.tld, not the port
 */
function stripPortFromUrl(loc)
{
    var temp = loc.split(':');
    loc = temp[0];
    return loc;
}

/**
 * Get the image with a cleanbits link around it
 */
function getLinkImage(color,tooltip)
{
    var output = "<a href='http://www.thegreenwebfoundation.org/add-ons/' target='_blank' title='" + tooltip + "' class='TGWF-addon'>";
    output += getImage(color) + "</a>";
    return output;
}

function getLinkNode(color)
{
    var href = 'http://www.thegreenwebfoundation.org';
    return $("<a>", { href: href, class: 'TGWF-addon' })
                 .append($('<img>', { src: getImagePath(color), style: 'width:16px; height:16px;border:none;'  } ));
}

/**
 * Get the image element based on the color
 */
function getImage(color)
{
    return  "<img style='width:16px; height:16px;border:none;' src='"+  getImagePath(color) +"'/>";
}

/**
 * Get the image element as a jquery Node
 *
 * @param color
 * @returns {*|jQuery|HTMLElement}
 */
function getImageNode(color)
{
    return $('<img>', { style: 'width:16px; height:16px;border:none;', src: getImagePath(color)});
}

/**
 * Get the image path based on file
 */
function getImagePath(file)
{
    var icons = {};
    icons.green         = chrome.runtime.getURL("/images/green20x20.gif");
    icons.grey          = chrome.runtime.getURL("/images/grey20x20.gif");
    icons.greenquestion = chrome.runtime.getURL("/images/greenquestion20x20.gif");
    icons.greenfan      = chrome.runtime.getURL("/images/greenfan20x20.gif");
    icons.greenhouse    = chrome.runtime.getURL("/images/greenhouse20x20.gif");

     if (icons[file]) {
        return icons[file];
    }

    return 'http://images.cleanbits.net/icons/' + file + "20x20.gif";
}

/**
 * Get the resulting image from the data as jquery dom node
 */
function getResultNode(data)
{
    var icon = getIcon(data);
    return getLinkNode(icon);
}

/**
 * Get the icon based on the data
 */
function getIcon(data)
{
    if (data.green) {
        // Green
        if(data.icon) {
            // Special icon
            return data.icon;
        }
        return 'green';
    }

    if (data.data === false) {
        // Not enough data for the domain, show question
        return 'greenquestion';
    }
    return 'grey';
}

/**
 * Get the title based on the data
 */
function getTitle(data)
{
    if(data.green) {
        // Green
        if(data.hostedby){
            // We know the hoster, show it
            return 'Sustainably hosted by ' + data.hostedby;
        }
        return 'is sustainably hosted';
    }

    if (data.data === false) {
        // No data available, show help message
        return "No data available yet for this country domain. Wanna help? Contact us through www.thegreenwebfoundation.org";
    }

    // Data available, so show grey site
    return data.url + ' is hosted grey';

}

/**
 * Get the title based on the data
 */
function getTitleWithLink(data)
{
    if (!data) {
        return '';
    }
    if (data.green) {
        if (data.hostedby) {
            return data.url + ' ' + '<a target=\'_blank\' href=\'http://www.thegreenwebfoundation.org/thegreenweb/#/providers/' + data.hostedbyid + '\'>' + ' is sustainably hosted by ' + ' ' + data.hostedby + '</a>';
        }
        return data.url + ' ' + 'is sustainably hosted';
    }

    if (data.data === false) {
        // No data available, show help message
        return "No data available yet for this country domain. Wanna help? Contact us through "  + " <a target=\'_blank\' href=\'http://www.thegreenwebfoundation.org\'>www.thegreenwebfoundation.org</a>";
    }

    // Data available, so show grey site
    return data.url + ' ' + ' is hosted grey';
}