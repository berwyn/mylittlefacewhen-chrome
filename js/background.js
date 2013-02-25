// Copyright (c) 2013 Berwyn Codeweaver. All rights reserved.

// Event fired when the user accepts the input in the omnibox
chrome.omnibox.onInputEntered.addListener(function(text) {
  reqUrl = "http://mylittlefacewhen.com/search/?"
  reqUrl += buildTagString(text);
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

function buildApiString(object) {
  apiString = '';
  for(var key in object) {
    if(key === 'tags' ) {
      apiString += "tags__all=";
      for(var index in object[key]) {
        console.log(object[key][index]);
        apiString += (encodeURIComponent(object[key][index]) + ',');
      }
      apiString = apiString.substring(0, apiString.length - 1);
    } else {
      apiString += key + '=' + object[key] + '&';
    }
  }
  return apiString.substring(0, apiString.length - 1);
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