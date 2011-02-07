/**
 * Utilities for the greenweb add-on
 *
 * @author Arend-Jan Tetteroo <aj@cleanbits.net>
 * @copyright Cleanbits BV 2010-2011
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
    loc = this.stripPageFromUrl(loc);
    return loc;
}

/**
 * Strip the protocol from the location
 * If no http or https given, then return false
 */
function stripProtocolFromUrl(loc)
{
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
 * Get the image with a cleanbits link around it
 */
function getLinkImage(color)
{
    var output = "<a href='http://www.cleanbits.net' target='_blank'>";
    output += getImage(color) + "</a>";
    return output;
}

/**
 * Get the image based on the color
 */
function getImage(color)
{
    var file = "/images/" + color + "20x20.gif";
    var img = chrome.extension.getURL(file);
    return  "<img style='width:16px; height:16px;border:none;' src='"+img+"'/>";
}