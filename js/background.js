// Copyright (c) 2013 Berwyn Codeweaver. All rights reserved.

// Event fired when the user accepts the input in the omnibox
chrome.omnibox.onInputEntered.addListener(function(text) {
  reqUrl = "http://mylittlefacewhen.com/search/?"
  reqUrl += buildTagString(text);
  console.log('inputEntered: ' + reqUrl);
  navigate(reqUrl);
});

// We use this to generate our comma-separated tag string
function buildTagString(tags) {
  tagString = "tags=";
  parts = tags.split(',');
  for(var i = 0; i < parts.length; i++) {
    tagString += encodeURIComponent(parts[i]) + ",";
  }
  tagString = tagString.substring(0, tagString.length - 1);
  return tagString;
}

// Function to navigate to a given url
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