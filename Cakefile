flour = require 'flour'

flour.compilers['haml'] = (file, cb) ->
  haml = require 'haml-coffee'
  file.read (code) ->
    cb haml.compile code

task 'build:coffee', ->
  compile 'coffee/background.coffee', 'extension/js/background.js'
  compile 'coffee/popup.coffee', 'extension/js/popup.js'

task 'build:less', ->
  compile 'less/rainbow_dash.less', 'extension/style/rainbow_dash_always_dresses_in.css'

task 'build:haml', ->
  compile 'haml/background.haml', 'extension/background.html'
  compile 'haml/popup.haml', 'extension/popup.html'

task 'build:plugins', ->
  # bundle [], 'extension/js/plugins.js'
  # bundle [], 'extension/style/plugins.css'

task 'build', ->
  invoke 'build:coffee'
  invoke 'build:less'
  invoke 'build:plugins'
  invoke 'build:haml'

task 'watch', ->
  invoke 'build:coffee'
  invoke 'build:less'
  invoke 'build:plugins'
  invoke 'build:haml'

  watch 'less/*.less', -> invoke 'build:less'
  watch 'coffee/*.coffee', -> invoke 'build:coffee'
  watch 'haml/*.haml', -> invoke 'build:haml'