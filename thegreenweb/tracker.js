/**
 * Google analytics tracker code
 * 
 * @type {[type]}
 */

const GA_TRACKING_ID = "UA-3743032-3";
const GA_CLIENT_ID = 1;

var aType = 'extensionLoaded';
var request = new XMLHttpRequest();
var message =
    "v=1&tid=" + GA_TRACKING_ID + "&cid= " + GA_CLIENT_ID + "&aip=1" +
    "&ds=add-on&t=event&ec=browser&ea=" + aType;

request.open("POST", "https://www.google-analytics.com/collect", true);
request.send(message);