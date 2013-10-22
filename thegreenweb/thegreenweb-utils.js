/**
 * Utilities for the greenweb add-on
 *
 * @author Arend-Jan Tetteroo <aj@cleanbits.net>
 * @copyright Cleanbits/The Green Web Foundation 2010-2013
 */

/**
 * Get the url from the given location
 */
function getUrl(loc)
{
    loc = this.stripProtocolFromUrl(loc);
    if(loc == false){
        return false;
    }
    loc = this.stripQueryStringFromUrl(loc);
    loc = this.stripPageFromUrl(loc);
    loc = this.stripPortFromUrl(loc);

    // Don't lookup localhost
    if(loc == 'localhost'){
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
    if(loc == undefined){
        return false;
    }
    var prot = loc.substring(0,5);
    if(prot == 'http:'){
        loc = loc.substring(7);
    }else if(prot == 'https'){
        loc = loc.substring(8);
    }else{
        return false;
    }
    return loc;
}

/**
 * Only use the domain.tld, not the querystring behind ? or #
 */
function stripQueryStringFromUrl(loc)
{
    var temp = new Array();
    temp = loc.split('?');
    loc = temp[0];
    var temp = new Array();
    temp = loc.split('#');
    loc = temp[0];
    return loc;
}

/**
 * Only use the domain.tld, not the page
 */
function stripPageFromUrl(loc)
{
    var temp = new Array();
    temp = loc.split('/');
    loc = temp[0];
    return loc;
}

/**
 * Only use the domain.tld, not the port
 */
function stripPortFromUrl(loc)
{
    var temp = new Array();
    temp = loc.split(':');
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
    var a    = $("<a>", { href: href, class: 'TGWF-addon' })
                 .append($('<img>', { src: getImagePath(color), style: 'width:16px; height:16px;border:none;'  } ));
    return a;
}

/**
 * Get the image element based on the color
 */
function getImage(color)
{
    var img = getImagePath(color);
    return  "<img style='width:16px; height:16px;border:none;' src='"+img+"'/>";
}

function getImageNode(color)
{
    return $('<img>', { style: 'width:16px; height:16px;border:none;', src: getImagePath(color)});
}

/**
 * Get the image path based on file
 */
function getImagePath(file)
{
    var icons = new Array();
    icons['green']         = chrome.extension.getURL("/images/green20x20.gif");
    icons['grey']          = chrome.extension.getURL("/images/grey20x20.gif");
    icons['greenquestion'] = chrome.extension.getURL("/images/greenquestion20x20.gif");
    icons['greenfan']      = chrome.extension.getURL("/images/greenfan20x20.gif");
    icons['greenhouse']      = chrome.extension.getURL("/images/greenhouse20x20.gif");

     if(icons[file]){
        return icons[file];
    }

    iconPath = 'http://images.cleanbits.net/icons/' + file + "20x20.gif";
    return iconPath;
}

/**
 * Get the resulting image from the data
 */
function getResult(data)
{
    icon = getIcon(data);
    title = getTitle(data);
    return getLinkImage(icon,title);
}

/**
 * Get the resulting image from the data as jquery dom node
 */
function getResultNode(data)
{
    icon = getIcon(data);
    return getLinkNode(icon);
}

/**
 * Get the icon based on the data
 */
function getIcon(data)
{
    var icon = 'grey';
    if(data.green) {
        icon = 'green';
        if(data.icon) {
            icon = data.icon;
        }
    }else if(data.data == false){
        icon = 'greenquestion';
    }
    return icon;
}

/**
 * Get the title based on the data
 */
function getTitle(data)
{
    if(data.green) {
        if(data.hostedby){
            title = 'Sustainably hosted by ' + data.hostedby;
        }else{
            title = 'is made sustainable through Cleanbits';
        }
    }else{
        if(data.data == false){
            // No data available, show help message
            title = "No data available yet for this country domain. Wanna help? Contact us through www.cleanbits.net";
        }else{
            // Data available, so show grey site
            title = data.url + ' is hosted grey';
        }
    }
    return title;
}

/**
 * Get the title based on the data
 */
function getTitleWithLink(data)
{
    if(data){
        if (data.green) {
            if (data.hostedby) {
                title = data.url + ' ' + '<a target=\'_blank\' href=\'http://www.thegreenwebfoundation.org/thegreenweb/#/providers/' + data.hostedbyid + '\'>' + ' is sustainably hosted by ' + ' ' + data.hostedby + '</a>';
            } else {
                title = data.url + ' ' + 'is made sustainable through Cleanbits';
            }
        } else {
            if (data.data == false) {
                // No data available, show help message
                title = "No data available yet for this country domain. Wanna help? Contact us through "  + " <a target=\'_blank\' href=\'http://www.thegreenwebfoundation.org\'>www.thegreenwebfoundation.org</a>";
            } else {
                // Data available, so show grey site
                title = data.url + ' ' + ' is hosted grey';
            }
        }
    }else{
        title = '';
    }    
    return title;
}