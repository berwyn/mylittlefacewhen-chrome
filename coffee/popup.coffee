# window.mlfw.popup = {
#   backgroundPage: {}
#   randLimit: 500
#   imageTemplate: """
#     <div class="mosaic-block item">\
#       <div class="mosaic-overlay">\
#         <div class="image-div" style="background-image: url({{{image}}})"/>\
#       </div>\
#       <div class="mosaic-backdrop">\
#         <a href="{{{url}}}" target="_blank">\
#           <h5>{{{name}}}</h5>\
#         </a>\
#         <div class="details">\
#           <!-- Detail content goes here -->\
#         </div>\
#       </div>\
#     </div>
#   """
#   compiled_image_template: Mustache.compile image_template

#   main: ->
#     loadWebFonts()
#     sizeSearchInput()

#     # Get the background page
#     chrome.runtime.getBackgroundPage (backgroundPage) ->
#       window.mlfw.popup.backgroundPage = backgroundPage

#     # Hide initial elements
#     $('#results-label').hide()
#     $('#empty-text').hide()

#     # Setup search bar
#     $('#search-form').submit (event) ->
#       input = $('#search-bar').val
#       if input? and input.length > 0
#         clearQuilt()
#         getPonies input
#       else
#         getPonies()
#       false

#   loadWebFonts: ->
#     WebFontConfig = {
#       google: { families: ['Roboto','Roboto Condensed'] }
#     }
#     wf = document.createElement('script')
#     wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js'
#     wf.type = 'text/javascript'
#     wf.async = 'true'
#     s = document.getElementsByTagName('script')[0]
#     s.parentNode.insertBefore wf, s

#   sizeSearchInput: ->
#     formWidth = $('#search-form').width()
#     $('#search-bar').width (formWidth - 92) + 'px'

#   getPonies: (input) ->
#     $('#results-label').show()
#     if input?
#       apiString = backgroundPage.buildApiString {tags: input.split(',')}
#       makeRequest apiString
#     else
#       beginIndex = Math.floor(Math.random * randLimit)
#       apiString = backgroundPage.buildApiString {order_by: '-hotness', id__gte: beginIndex}
#       makeRequest apiString

#   makeRequest: (data) ->
#     $.ajax {
#       contentType: 'application/json'
#       data: data
#       success: displayImages
#       processData: false
#       type: 'GET'
#       url: window.mlfw.API_URL + '/face/'
#     }

#   clearQuilt: ->
#     $('#quilt').children().each (index, element) ->
#       element.remove()

#   navigateToFace: (id) ->

#   displayImages: (data) ->
#     clearQuilt()
#     num_objects = _(data.objects).size()
#     if num_objects <= 0
#       $('#empty-text').show()
#     else
#       $('#empty-text').hide()
#       _(data.objects).each renderFace

#   renderFace: (face) ->
#     data = {
#       url: window.mlfw.HOST_BASE + '/face/' + face.id
#       name: face.title
#       alt: face.description
#       image: determineImageSource(face)
#     }
#     element_inner = compiled_image_template(data)

#     element = $('<div/>').html(element_inner).contents()
#     # Hover effect goes here
#     $('#quilt').append element

#   determineImageSource: (face) ->
#     src = window.mlfw.HOST_BASE
#     unless _(face.thumbnails).isEmpty()
#       if _(face.thumbnails).has 'webp'
#         src += face.thumbnails.webp
#       else if _(face.thumbnails).has 'jpg'
#         src += face.thumbnails.jpg
#       else if _(face.thumbnails).has 'gif'
#         src += face.thumbnails.gif
#       else
#         src += face.thumbnails[_(face.thumbnails).keys()[0]]
#     else unless _(face.resizes).isEmpty()
#       if _(face.resizes).has 'small'
#         src += face.resizes.small
#       else if _(face.resizes).has 'medium'
#         src += face.resizes.medium
#       else
#         src += face.resizes[_(face.resizes).keys()[0]]
#     else
#       src += face.image
#     src
# }

app = angular.module 'MLFW', []
app.config ['$httpProvider', ($httpProvider) ->
  $httpProvider.defaults.useXDomain = true
  delete $httpProvider.defaults.headers.common['X-Requested-With']
]
app.controller 'MlfwController', ($scope, $http) ->

  $scope.getFaces = () ->
    console.log 'Getting faces -', $scope.query
    tags = $scope.query
    $http.get("http://mylittlefacewhen.com/api/v3/face",
      params:
        tags__any: tags
    ).success((json, status, headers, config) ->
      console.log json
      $scope.faces = json.objects
      $scope.noResults = json.objects.length >= 1
    ).error (data, status, headers, config) ->
      err = "Failed " + status + " " + headers
      console.log err