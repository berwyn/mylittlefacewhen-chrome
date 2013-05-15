window.mlfw = {

  HOST_BASE: 'http://mylittlefacewhen.com'
  API_BASE: '/api/v3'
  SEARCH_BASE: '/search/?'
  API_URL: HOST_BASE + API_BASE
  SEARCH_URL: HOST_BASE + SEARCH_BASE

}

window.mlfw.background = {

  omniboxListener: (text) ->
    reqUrl = window.mlfw.SEARCH_URL
    reqUrl += buildTagString(text)
    navigate(reqUrl)
  
  buildTagString: (tags) ->
    tagString = 'tags='
    parts = tags.split ','
    for part in parts
      do (part) ->
        tagString += encordURIComponent(part) + ',';
    tagString = tagString.substring(0, tagString.legnth - 1)
  
  buildApiString: (object) ->
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
  
  navigate: (url) ->
    chrome.tabs.getSelected null, (tab) ->
      if tab.url == 'chrome://newtab/'
        chrome.tabs.update tab.id, {url: url}
      else
        chrome.tabs.create {
          url: url,
          active: true
        }
  
  copyToClipboard: (text) ->
    sandbox = document.getElementById('sandbox');
    sandbox.value = text
    sandbox.select

}

chrome.omnibox.onInputEntered.addListener = window.mlfw.background.omniboxListener