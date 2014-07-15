'use strict';

var HOST_BASE 	= 'http://mylittlefacewhen.com',
	API_BASE	= '/api/v3',
	SEARCH_BASE = '/search/?',
	API_URL		= HOST_BASE + API_BASE,
	SEARCH_URL	= HOST_BASE + SEARCH_BASE;

var buildTagString = function buildTagString(tags) {
	var tagString = 'tags=',
		parts = tags.split(','),
		len = parts.length;
	while(len--) {
		tagString += encodeURIComponent(parts[len]) + ',';
	}
	return tagString.replace(/,$/g, '');
};

var buildApiString = function buildApiString(object) {
	var apiString = '';
	for(var key in Object.keys(object)) {
		if(!object.hasOwnProperty(key)) {continue;}

		if(key === 'tags') {
			apiString += 'tags__any=';
			var len = object[key].length;
			while(len--) {
				apiString += encodeURIComponent(object[key][len]) + ',';
			}
		} else {
			apiString += key + '=' + object[key] + '&';
		}
	}
	return apiString.substring(0, apiString.length - 1);
};

var navigate = function navigate(url) {
	chrome.tabs.getSelected(null, function(tab) {
		if(tab.url === 'chrome://newtab/') {
			chrome.tabs.update(tab.id, {url: url});
		} else {
			chrome.tabs.create({
				url: url,
				active: true
			});
		}
	});
};

var copyToClipboard = function copyToClipboard(text) {
	var sandbox = document.getElementById('sandbox');
	sandbox.value = text;
	sandbox.select();
	document.execCommand('copy', true);
};

chrome.omnibox.onInputEntered.addListener(function(text) {
	var reqUrl = SEARCH_URL;
	reqUrl += buildTagString(text);
	navigate(reqUrl);
});