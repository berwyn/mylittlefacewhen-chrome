var HOST_BASE = "http://mylittlefacewhen.com/";
var API_BASE = "api/v3/";

function main() {
  $('#quilt').isotope({
    itemSelector: '.item'
  });
  $('#search-bar').keyup(function(event) {
    input = $('#search-bar').val();
    code = event.keyCode || event.which;
    if(code == 13) {
      if(input.length > 0) {
        alert('Trigger search');
      } else {
        alert('Reset to default');
      }
    }
  });
}

function navigateToFace(id) {
  alert(id);
}

function displayImages(json) {
  for(var i = 0; i < json.objects.length; i++) {
    element = $('<div/>')
      .addClass('item')
      .attr('style', 'background-image:url('+ HOST_BASE + json.objects[i].image + ');');
    relRatio = element.width() / element.height();
    if(relRatio >= 1.3) {
      element.addClass('item-wide');
    } else if (relRatio <= .7) {
      element.addClass('item-tall');
    }
    $('#quilt').isotope('insert', element);
  }
}

function displayError(jqXHR, textStatus, errorThrown) {
  console.log('Error occured: ' + errorThrown);
}

function requestImages(url, args, json) {
  args = args || [];
  json = JSON.stringify(json) || '';
  reqUrl = HOST_BASE + API_BASE + url + "?";
  for(var i = 0; i < args.length; i++) {
    reqUrl = reqUrl + args[i] + "&";
  }
  reqUrl += "format=json";
  console.log('Url: ' + reqUrl + '\nArgs: ' + args + '\nJSON: ' + json);
  $.ajax({
    url: reqUrl,
    contentType: 'application/json',
    data: JSON.stringify(json),
    dataType: 'json',
    success: displayImages,
    error: displayError,
    processData: false,
    type: 'GET'
  });
}
$(function() {
  main();
});