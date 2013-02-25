// Some constants
var HOST_BASE = "http://mylittlefacewhen.com/";
var API_BASE = "api/v3/";
var RANDOM_LIMIT = 580;

// Our base function
function main() {
  $('#quilt').isotope({
    itemSelector: '.item'
  });
  $('#quilt').hide();
  $('#empty-text').hide();
  getRandomImages();
  $('#search-bar').keyup(function(event) {
    input = $('#search-bar').val();
    code = event.keyCode || event.which;
    if(code == 13) {
      if(input.length > 0) {
        $('#quilt').children.each(function(index, element) {
          $('#quilt').isotope('remove', element, function(){});
        });
      } else {
        getRandomImages();
      }
    }
  });
}

// Fetch some random faces from the API
function getRandomImages() {
  beginIndex = Math.floor(Math.random() * RANDOM_LIMIT);
  requestImages('face/', null, { order_by: "random", id_gte: beginIndex });
}

// Navigate to a given face on MLFW
function navigateToFace(id) {
  alert(id);
}

// Take the JSON body and render the images in it
function displayImages(json) {
  if(json.objects.length <= 0) {
    $('#quilt');
    $('#empty-text').show();
  } else {
    $('#empty-text').hide();
    $('#quilt').show();
    for(var i = 0; i < json.objects.length; i++) {
      element = $('<img class="item"/>')
        .attr('src', HOST_BASE + json.objects[i].image);
      $('#quilt').isotope('insert', element);
    }
  }
}

// Log request errors to the console
function displayError(jqXHR, textStatus, errorThrown) {
  console.error('Error occured: ' + errorThrown);
}

// Make an API request for faces
function requestImages(url, args, json) {
  args = args || [];
  json = JSON.stringify(json);
  reqUrl = HOST_BASE + API_BASE + url + "?";
  for(var i = 0; i < args.length; i++) {
    reqUrl = reqUrl + args[i] + "&";
  }
  reqUrl += "format=json";
  // console.log('Url: ' + reqUrl + '\nArgs: ' + args + '\nJSON: ' + json);
  ajaxArgs = {
    url: reqUrl,
    contentType: 'application/json',
    dataType: 'json',
    success: displayImages,
    error: displayError,
    type: 'GET',
    processData: false
  };
  if(json !== undefined) {
    ajaxArgs.data = json;
  }
  $.ajax(ajaxArgs);
}

// When the DOM is ready, run main
$(function() {
  main();
});