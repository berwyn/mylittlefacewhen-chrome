// Some constants
var HOST_BASE = "http://mylittlefacewhen.com/";
var API_BASE = "api/v3/";
var API_URL = HOST_BASE + API_BASE;
var RANDOM_LIMIT = 580;
var client = new $.RestClient(API_URL, {
  cache: 0 // Force lack of cache, because we're only interacting with one endpoint
});

/**
 * Bootstrap the browser action when the DOM is ready
 */
$(function() {  
  main();
});

/** 
 * Base function to bootstrap the browser action
 */
function main() {
  // Generate our REST client
  client.add('face', {stringifyData: true});

  // Inialize the mosaic quilt
  $('#quilt').mosaicflow({
    itemSelector: '.item',
    minItemWidth: 150
  });

  // Hide inital elements
  $('#empty-text').hide();
  
  // PONIZ
  getPonies();
  
  // Setup the search bar
  $('#search-bar').keyup(function(event) {
    input = $('#search-bar').val();
    code = event.keyCode || event.which;
    if(code == 13) {
      if(input.length > 0) {
        clearQuilt();
        getPonies(input);
      } else {
        getPonies();
      }
    }
  });
}

/**
 * Get faces from the API, and put them in the mosaic
 *
 * @param {String} input - The input the user made
 */
function getPonies(input) {
  if(input !== undefined) {
    apiString = buildApiString({tags: input.split(',')});
    makeRequest(apiString);
  } else {
    beginIndex = Math.floor(Math.random() * RANDOM_LIMIT);
    apiString = buildApiString({order_by: 'random', id__gte: beginIndex});
    makeRequest(apiString);
  }
}

function makeRequest(data) {
  console.log('Making request with data: ' + data);
  $.ajax({
    contentType: 'application/json',
    data: data,
    success: displayImages,
    processData: false,
    type: 'GET',
    url: API_URL + 'face/'
  });
}

/**
 * Clear the image mosaic so we can put new items in
 */
function clearQuilt() {
  $('#quilt').children().each(function(index, Element) {
    Element.remove();
  });
}

/**
 * Navigate to a given face on MLFW
 *
 * @param {String} id - The ID of the face we want to head to
 */
function navigateToFace(id) {
  // TODO Make the navigation logic, callback to function in background.js
}

/**
 * Take the JSON response from the API and display the images it returned
 *
 * @param data
 */
function displayImages(data) {
  clearQuilt();
  if(data.objects.length <= 0) {
    $('#empty-text').show();
  } else {
    $('#empty-text').hide();
    for(var i = 0; i < data.objects.length; i++) {
      face = data.objects[i];

      element = $('<img class="item"/>')
        .attr('src', HOST_BASE + face.thumbnails.jpg);

      relRatio = face.width / face.height;
      if(relRatio >= 1.3) {
        element.addClass('item-wide');
      } else if (relRatio <= .7) {
        element.addClass('item-tall');
      }

      $('#quilt').append(element);
    }
  }
}