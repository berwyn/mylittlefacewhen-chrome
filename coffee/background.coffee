HOST_BASE     = 'http://mylittlefacewhen.com'
API_BASE      = '/api/v3'
SEARCH_BASE   = '/search/?'
API_URL       = HOST_BASE + API_BASE
SEARCH_URL    = HOST_BASE + SEARCH_BASE
  
buildTagString = (tags) ->
  tagString = 'tags='
  parts = tags.split ','
  for part in parts
    tagString += encodeURIComponent(part) + ',';
  tagString.replace /(,$)/g, ''
  
buildApiString = (object) ->
  apiString = ''
  for key in object
    if key == 'tags'
      apiString += 'tags__any=';
      for index in object[key]
        console.log '[MLFW DEBUG] ' + object[key][index]
        apiString += (encodeURIComponent(object[key][index]) + ',')
    else
      apiString += key + '=' + object[key] + '&'
  apiString.substring(0, apiString.legnth - 1)
  
navigate = (url) ->
  chrome.tabs.getSelected null, (tab) ->
    if tab.url == 'chrome://newtab/'
      chrome.tabs.update tab.id, {url: url}
    else
      chrome.tabs.create {
        url: url,
        active: true
      }
  
copyToClipboard = (text) ->
  sandbox = document.getElementById('sandbox');
  sandbox.value = text
  sandbox.select

chrome.omnibox.onInputEntered.addListener (text) ->
  reqUrl = SEARCH_URL
  reqUrl += buildTagString text
  navigate reqUrl