## Release notes:

# 2.4.0 | 16 December 2020

- Update icons to .png files to show in browsers again
- Add link to options pages on firefox and chrome, to make it easier to switch feature on or off
- Overhaul options page design.
- Update options page to use vanilla js instead of jquery for the new design (it's 2020, we can use modern js now!)

2.3.0 | 30 June 2020
- New transparent icons for dark mode and better looking

2.2.0 | 13 June 2020
- Add an ethical filtering option, when you enable this option, on search pages results that normally will get a grey smiley as they run on non-green infrastructure will now be filtered out from the webpage, so they are hidden from view. 

2.1.4 | 25 May 2020
- Add a gold smiley to show our gold partners

2.1.3 | 28 Nov 2019
- Fix search mod for google
- Load yahoo search mod on localized yahoo sites

2.1.2 | 8th Mar 2019

2.1.1 | 17 Nov 2017
- Fix search engine mods
- Upgrade internals to support Firefox Quantum

2.0.2 | 29 Apr 2017
- Fix ecosia search engine page mod

1.7.5 | 2 Oct 2014
- Fix titles
- Code cleanup

1.7.4 | 7 Aug 2014
- Don't underline links to the same domain when all links is on
- Fix bing search page
- Update jquery to 2.1.1


1.7.3 | 22 October 2013
- Don't do lookups on 'localhost' pages
- Update jquery to 2.0.3

1.7.1 | 28 June 2013
- Only do a external links lookup on pages with < 100 links, otherwise the browser get's too slow
- Split api requests into 50 lookups per request
- Optimized api requests to half the size
- Don't include querystrings in urls

1.6.0 | 06 May 2013
- Fixed google search due to a change in the google page layout
- Don't do a lookup for local files opened with file:// in the addressbar
- Use event pages for faster usage and less memory
- Changed listeners to use webNavigation API so results in earlier greencheck icon in browserbar while page is still loading

1.5.0 | 21 April 2013
- Add all links feature to https pages
- Faster and more reliable by using new chrome api's and jquery 2.0
- Some small bugfixes and tweaks

1.4.1 | 10 December 2012
- Added a tooltip to the "all links" feature, so you can see the details of the check. It's also possible to click through for more information on the Green Web Foundation website.
- Added tooltips to greencheck results on the Ecosia, Bing and Yahoo Search engines 

1.3.0 | 14 November 2012
- Added "all links" check for greenness, all external links on a page will be underlined with a green border if they link to a green hosted website
- Added option to options page to disable the "all links" check

1.2.0 | 24 September 2012
- Added an options page: It's now possible to disable the search feature on the option page

1.1.3 | 20 September 2012
- Fix permission errors while installing
- Updated to faster api for site lookups
- Chrome manifest update

1.1.0 | 07 March 2012
- Now works on google search pages on a secure connection (https)
- Simplified needed permissions

1.0.4 | 02 March 2012
- Supports Ecosia.org search engine

1.0.2 | 16 January 2012
- Fix to correctly check urls with port numbers
- Works correctly with AVG Safe Search

1.0.1 | 10-10-2011
- Fix for new google search page layout

1.0.0 | 15-09-2011
First stable version
