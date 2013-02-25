// Some constants
var HOST_BASE = "http://mylittlefacewhen.com/";
var API_BASE = "api/v3/";
var RANDOM_LIMIT = 580;

/** 
 * Base function to bootstrap the browser action
 */
function main() {
  // Generate our REST client
  var client = $.RestClient(HOST_BASE + API_BASE);
  client.add('face', {stringifyData: true});

  // Inialize the mosaic quilt
  $('#quilt').isotope({
    itemSelector: '.item',
    masonryHorizontal: {
      rowHeight: 200
    }
  });

  // Hide inital elements
  $('#quilt').hide();
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
    client.face.read({
      tags_any: input.split(',')
    }).done(displayImages);
  } else {
    beginIndex = Math.floor(Math.random() * RANDOM_LIMIT);
    client.face.read({
      order_by: 'random',
      id_gte: beginIndex
    }).done(displayImages);
  }
}

/**
 * Clear the image mosaic so we can put new items in
 */
function clearQuilt() {
  $('#quilt').children().each(function(index, Element) {
    Element.remove();
    $('#quilt').isotope('remove', element, function() {
      // We don't care so much about this part
    });
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
  // for now, figure out what data we're being given
  console.log(data);
  return;
  if(json.objects.length <= 0) {
    $('#quilt');
    $('#empty-text').show();
  } else {
    $('#empty-text').hide();
    $('#quilt').show();
    for(var i = 0; i < json.objects.length; i++) {
      element = $('<img class="item"/>')
        .attr('src', HOST_BASE + json.objects[i].image);
      relRatio = element.width() / element.height();
      if(relRatio >= 1.3) {
        element.addClass('item-wide');
      } else if (relRatio <= .7) {
        element.addClass('item-tall');
      }
      $('#quilt').isotope('insert', element);
    }
  }
}

/**
 * Bootstrap the browser action when the DOM is ready
 */
$(function() {
  main();
});