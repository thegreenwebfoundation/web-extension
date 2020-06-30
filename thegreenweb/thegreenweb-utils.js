/**
 * Utilities for the greenweb add-on
 *
 * @author Arend-Jan Tetteroo <aj@thegreenwebfoundation.org>
 * @copyright Cleanbits/The Green Web Foundation 2010-2020
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
 * Get the image with a cleanbits link around it as a jquery node
 */
function getGreenwebLinkNode(color, tooltip)
{
    var aItem = document.createElement("a");
    aItem.href  = 'https://www.thegreenwebfoundation.org';
    aItem.class = 'TGWF-addon';
    aItem.title = tooltip;

    var imageItem = document.createElement("img");
    imageItem.src = getImagePath(color);
    imageItem.style= 'width:16px; height:16px;border:none;';
    aItem.appendChild(imageItem);

    return aItem;
}

/**
 * Get the footer element for displaying the green web extension is working
 *
 * @returns {HTMLParagraphElement}
 */
function getFooterElement()
{
    var greenWebEnabledItem = document.createElement("p");
    greenWebEnabledItem.id = 'thegreenweb';
    greenWebEnabledItem.style = 'text-align:center;';

    var image = getGreenwebLinkNode('green','The Green Web extension shows if a site is sustainably hosted');
    var spanItem = document.createElement('span');
    spanItem.id = 'thegreenwebenabled';

    var text = document.createTextNode("The Green Web is enabled");

    greenWebEnabledItem.appendChild(spanItem).appendChild(image).appendChild(text);

    return greenWebEnabledItem;
}

/**
 * get a link node based on color
 *
 * @param color
 * @returns {void | * | jQuery}
 */
function getLinkNode(color, type)
{
    var style = 'width:16px; height:16px;border:none;';
    if(type === 'google') {
        style = 'width:16px; height:16px;border:none; margin-left:-20px; margin-top:2px';
    }

    var href = 'https://www.thegreenwebfoundation.org';
    return $("<a>", { href: href, class: 'TGWF-addon' })
                 .append($('<img>', { src: getImagePath(color), style: style   } ));
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
function getImagePath(file, local)
{
    var icons = {};
    icons.green         = chrome.runtime.getURL("/images/green20x20transp.png");
    icons.grey          = chrome.runtime.getURL("/images/grey20x20transp.png");
    icons.greenquestion = chrome.runtime.getURL("/images/question20x20transp.png");
    icons.greenfan      = chrome.runtime.getURL("/images/greenfan20x20transp.png");
    icons.greenhouse    = chrome.runtime.getURL("/images/greenhouse20x20transp.png");
    icons.goldsmiley    = chrome.runtime.getURL("/images/gold20x20transp.png");

     if (icons[file]) {
        return icons[file];
    }

     if (local) {
         return chrome.runtime.getURL("/images/green20x20.gif");
     }

    // if the file has http as it's start, it's a full url to a web icon somewhere else, so then return that.
    var prot = file.substring(0,4);
    if (prot === 'http') {
        return file;
    }

    return 'https://api.thegreenwebfoundation.org/icons/' + file + "20x20.gif";
}

/**
 * Get the resulting image from the data as jquery dom node
 */
function getResultNode(data, type)
{
    return getLinkNode(getIcon(data), type);
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
            return data.url + ' ' + '<a target=\'_blank\' href=\'https://www.thegreenwebfoundation.org/thegreenweb/#/providers/' + data.hostedbyid + '\'>' + ' is sustainably hosted by ' + ' ' + data.hostedby + '</a>';
        }
        return data.url + ' ' + 'is sustainably hosted';
    }

    if (data.data === false) {
        // No data available, show help message
        return "No data available yet for this country domain. Wanna help? Contact us through "  + " <a target=\'_blank\' href=\'https://www.thegreenwebfoundation.org\'>www.thegreenwebfoundation.org</a>";
    }

    // Data available, so show grey site
    return data.url + ' ' + ' is hosted grey';
}