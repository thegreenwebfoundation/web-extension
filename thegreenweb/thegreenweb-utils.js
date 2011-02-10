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
function getLinkImage(color,tooltip)
{
    var output = "<a href='http://www.cleanbits.net' target='_blank' title='" + tooltip + "'>";
    output += getImage(color) + "</a>";
    return output;
}

/**
 * Get the image element based on the color
 */
function getImage(color)
{
    var img = getImagePath(color);
    return  "<img style='width:16px; height:16px;border:none;' src='"+img+"'/>";
}

/**
 * Get the image path based on file
 */
function getImagePath(file)
{
    cache = window.localStorage.getItem('icons' + file);
    if(cache != null){
        console.log(cache + ' from cache');
        return cache;
    }
    var path = "/images/" + file + "20x20.gif";
    var iconPath = chrome.extension.getURL(path);
    window.localStorage.setItem('icons'+ file,iconPath);

    // Check if the icon exists locally, otherwise use the normal url until extension is updated
    myImage = document.createElement('img');
    //myImage.src = iconPath;    
    $(myImage).attr("src", iconPath);
    $(myImage).error(function(){
       iconPath = 'http://images.cleanbits.net/icons/' + file + "20x20.gif";
       window.localStorage.setItem('icons' + file,iconPath);
       console.log(iconPath + ' into cache');
    });    
    return iconPath;
}

/**
 * Get the resulting image from the data
 */
function getResult(data)
{
    icon = getIcon(data);
    title = getTitle(data);
    return getLinkImage(icon,title) + '&nbsp;';
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