flour   = require 'flour'
fs      = require 'fs'
{spawn} = require 'child_process'

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
  bundle [
    'lib/bootstrap/js/bootstrap.min.js',
    'lib/jquery/-2.0.0.min.js',
    'lib/handlebars-1.0.0-rc4.js',
    'lib/webfont-1.4.2.js'
  ], 'extension/js/plugins.js'
  bundle [
    'lib/bootstrap/css/bootstrap.min.css',
    'lib/bootstrap/css/bootstrap-responsive.min.css'
  ], 'extension/style/plugins.css'

task 'copy:images', ->
  cp = spawn 'cp', ['-r','lib/bootstrap/img', 'extension/img']
  cp.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  cp.stdout.on 'data', (data) ->
    console.log data.toString()

task 'build', ->
  invoke 'build:coffee'
  invoke 'build:less'
  invoke 'build:plugins'
  invoke 'build:haml'
  invoke 'copy:images'

task 'watch', ->
  invoke 'build:coffee'
  invoke 'build:less'
  invoke 'build:plugins'
  invoke 'build:haml'

  watch 'less/*.less', -> invoke 'build:less'
  watch 'coffee/*.coffee', -> invoke 'build:coffee'
  watch 'haml/*.haml', -> invoke 'build:haml'