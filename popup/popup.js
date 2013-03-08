// Some constants
var HOST_BASE = "http://mylittlefacewhen.com/";
var API_BASE = "api/v3/";
var API_URL = HOST_BASE + API_BASE;
var RANDOM_LIMIT = 580;
var spinner;
var target;


/**
 * Bootstrap the browser action when the DOM is ready
 */
$(function() {  
  var opts = {
    lines: 13,
    length: 0,
    width: 2,
    radius: 5,
    corners: 0,
    rotate: 0,
    trail: 60,
    speed: 1.0,
    hwaccel: true,
    className: 'spinner',
    top: 'auto',
    left: 'auto'
  };
  spinner = new Spinner(opts);
  target = $('#results-label');
  main();
});

/** 
 * Base function to bootstrap the browser action
 */
function main() {

  

  // Inialize the mosaic quilt
  $('#quilt').mosaicflow({
    itemSelector: '.item',
    minItemWidth: 150
  });

  // Hide inital elements
  $('#results-label').hide();
  $('#empty-text').hide();
  
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
  $('#results-label').show();
  spinner.spin(target);
  if(input !== undefined) {
    apiString = buildApiString({tags: input.split(',')});
    makeRequest(apiString);
  } else {
    beginIndex = Math.floor(Math.random() * RANDOM_LIMIT);
    apiString = buildApiString({order_by: '-hotness', id__gte: beginIndex});
    makeRequest(apiString);
  }
}

/**
 * Generic method to make a git request to /faces/
 * This should be modified when/if more resources are supported
 *
 * @param {String} data - The URL parameters to add to the request
 */
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
  spinner.stop(target);
  if(data.objects.length <= 0) {
    $('#empty-text').show();
  } else {
    $('#empty-text').hide();
    for(var i = 0; i < data.objects.length; i++) {
      face = data.objects[i];

      src = HOST_BASE;
      if(!_(face.thumbnails).isEmpty()) {
        console.log("Adding thumbnail")
        if(_(face.thumbnails).has("webp")) {
          src += face.thumbnails.webp;
        } else if (_(face.thumbnails).has("jpg")) {
          src += face.thumbnails.jpg;
        } else if(_(face.thumbnails).has("gif")) {
          src += face.thumbnails.gif
        } else {
          src += face.thumbnails[_(face.thumbnails).keys()[0]];
        }
      } else if (!_(face.resizes).isEmpty()) {
        console.log("Adding resize")
        if(_(face.resizes).has("small")) {
          src += face.resizes.small;
        } else if(_(face.resizes).has("medium")) {
          src += face.resizes.medium;
        } else {
          src += face.resizes[_(face.resizes).keys()[0]];
        }
      } else {
        console.log("Adding image " + face.image);
        src += face.image;
      }

      element = $('<img class="item"/>')
        .attr('src', src);

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