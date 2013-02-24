// Copyright (c) 2013 Berwyn Codeweaver. All rights reserved.

// Event fired when the user accepts the input in the omnibox
chrome.omnibox.onInputEntered.addListener(function(text) {
  reqUrl = "http://mylittlefacewhen.com/search/?"
  reqUrl += buildTagString(text);
  console.log('inputEntered: ' + reqUrl);
  navigate(reqUrl);
});

function buildTagString(tags) {
  tagString = "tags=";
  parts = tags.split(',');
  for(var i = 0; i < parts.length; i++) {
    tagString += encodeURIComponent(parts[i]) + ",";
  }
  tagString = tagString.substring(0, reqUrl.length - 1);
  return tagString;
}

// Function to navigate to a given url
function navigate(url) {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.update(tab.id, {url: url});
  });
}