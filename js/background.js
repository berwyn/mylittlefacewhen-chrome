// Copyright (c) 2013 Berwyn Codeweaver. All rights reserved.

/**
 * This is the event fired when a user presses 'enter' while in the MLFW
 * search view. Only applies to the Omnibox
 */
chrome.omnibox.onInputEntered.addListener(function(text) {
  reqUrl = "http://mylittlefacewhen.com/search/?"
  reqUrl += buildTagString(text);
  navigate(reqUrl);
});

/**
 * Build a requst string for normal MLFW navigation
 *
 * @param {String} tags - The raw string of comma-separated tags
 * @returns {String} A URL query string
 */
function buildTagString(tags) {
  tagString = "tags=";
  parts = tags.split(',');
  for(var i = 0; i < parts.length; i++) {
    tagString += encodeURIComponent(parts[i]) + ",";
  }
  tagString = tagString.substring(0, tagString.length - 1);
  return tagString;
}

/**
 * Build an API query string from a given plain object
 *
 * @param {PlainObject} object - The object containing the query parameters
 * @returns {String} An API query string
 */
function buildApiString(object) {
  apiString = '';
  for(var key in object) {
    if(key === 'tags' ) {
      apiString += "tags__all=";
      for(var index in object[key]) {
        console.log(object[key][index]);
        apiString += (encodeURIComponent(object[key][index]) + ',');
      }
    } else {
      apiString += key + '=' + object[key] + '&';
    }
  }
  return apiString.substring(0, apiString.length - 1);
}

/**
 * Given a url, this will navigate there. If the current tab
 * is on the New Tab page, this tab will be consumed. Otherwise,
 * a new tab is spawned to handle the navigation.
 *
 * @param {String} url - The fully qualified URL to navigate to
 */
function navigate(url) {
  chrome.tabs.getSelected(null, function(tab) {
    if(tab.url === "chrome://newtab/") {
      chrome.tabs.update(tab.id, {url: url});
    } else {
      chrome.tabs.create({
        url: url,
        active: true
      });
    }
  });
}