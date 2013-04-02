// Some constants
var HOST_BASE = "http://mylittlefacewhen.com";
var API_BASE = "/api/v3";
var API_URL = HOST_BASE + API_BASE;
var RANDOM_LIMIT = 580;
var background_page;

var image_template = 
'<div class="mosaic-block item">\
  <div class="mosaic-overlay">\
    <div class="image-div" style="background-image: url({{{image}}})"/>\
  </div>\
  <div class="mosaic-backdrop">\
    <a href="{{{url}}}" target="_blank">\
      <h5>{{{name}}}</h5>\
    </a>\
    <div class="details">\
      <!-- Detail content goes here -->\
    </div>\
  </div>\
</div>';
var compiled_image_template = Mustache.compile(image_template);


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
  // Load webfonts
  WebFontConfig = {
    google: { families: [ 'Roboto', 'Roboto Condensed' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();

  // Size the input box
  sizeSearchInput();

  // Get the background page
  chrome.runtime.getBackgroundPage(function(backgroundPage) {
    background_page = backgroundPage;
    console.log(backgroundPage);
  });

  // Hide inital elements
  $('#results-label').hide();
  $('#empty-text').hide();
  
  // Setup the search bar
  $('#search-form').submit(function(event) {
    input = $('#search-bar').val();
    if(input.length > 0) {
      clearQuilt();
      getPonies(input);
    } else {
      getPonies();
    }
    return false;
  });
}

/**
 * Get faces from the API, and put them in the mosaic
 *
 * @param {String} input - The input the user made
 */
function getPonies(input) {
  $('#results-label').show();
  if(input !== undefined) {
    apiString = background_page.buildApiString({tags: input.split(',')});
    makeRequest(apiString);
  } else {
    beginIndex = Math.floor(Math.random() * RANDOM_LIMIT);
    apiString = background_page.buildApiString({order_by: '-hotness', id__gte: beginIndex});
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
  $.ajax({
    contentType: 'application/json',
    data: data,
    success: displayImages,
    processData: false,
    type: 'GET',
    url: API_URL + '/face/'
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
  num_objects = _(data.objects).size();
  if(num_objects <= 0) {
    $('#empty-text').show();
  } else {
    $('#empty-text').hide();
    _.each(data.objects, renderFace);
  }
}

/**
 * Take a given face object and render it in the popup
 *
 * @param face
 */
function renderFace(face) {
  data = {
    url: HOST_BASE + '/face/' + face.id,
    name: face.title,
    alt: face.description,
    image: determineImageSource(face)
  };
  element_inner = compiled_image_template(data);
  
  element = $('<div/>').html(element_inner).contents();
  $(element).mosaic({
    animation : 'slide',  //fade or slide
    anchor_y  : 'top',    //Vertical anchor position
    hover_y   : '80px'    //Vertical position on hover
  });
  $('#quilt').append(element);
}

/**
 * Decide which image url to use, based on which formats
 * are availible as well as a series of preferences
 *
 * @param face
 */
function determineImageSource(face) {
  src = HOST_BASE;
  if(!_(face.thumbnails).isEmpty()) {
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
    if(_(face.resizes).has("small")) {
      src += face.resizes.small;
    } else if(_(face.resizes).has("medium")) {
      src += face.resizes.medium;
    } else {
      src += face.resizes[_(face.resizes).keys()[0]];
    }
  } else {
    src += face.image;
  }
  return src;
}

function sizeSearchInput() {
  var formWidth = $('#search-form').width();
  $('#search-bar').width((formWidth - 92)+"px");
}