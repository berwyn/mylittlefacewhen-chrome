// Copyright (c) 2013 Berwyn Codeweaver. All rights reserved.

// Event fired when the user accepts the input in the omnibox
chrome.omnibox.onInputEntered.addListener(function(text) {
  parts = text.split(',');
  reqUrl = "http://mylittlefacewhen.com/search/?tags="
  for(var i = 0; i < parts.length; i++) {
    reqUrl += encodeURIComponent(parts[i]) + ",";
  }
  reqUrl = reqUrl.substring(0, reqUrl.length - 1);
  console.log('inputEntered: ' + reqUrl);
  navigate(reqUrl);
});

// Function to navigate to a given url
function navigate(url) {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.update(tab.id, {url: url});
  });
}