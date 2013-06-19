flour   = require 'flour'
fs      = require 'fs'
{spawn} = require 'child_process'
{exec}  = require 'child_process'
zip     = require 'adm-zip'

# Compile Haml files using Cake.coffee's builtin pipeline
flour.compilers['haml'] = (file, cb) ->
  exec "haml #{file}", (err, stdout, stderr) ->
    throw err if err
    cb stdout

# Bare compile coffee files
flour.compilers.coffee.bare = true

# Compile the coffee files
task 'build:coffee', ->
  compile 'src/background.coffee', 'extension/js/background.js'
  compile 'src/popup.coffee', 'extension/js/popup.js'

# Compile the less files
task 'build:less', ->
  compile 'src/rainbow_dash.less', 'extension/style/rainbow_dash_always_dresses_in.css'

# Compile the haml files
task 'build:haml', ->
  compile 'src/background.haml', 'extension/background.html'
  compile 'src/popup.haml', 'extension/popup.html'

# TODO(?) Compile Handlebars templates
task 'build:handlebars', ->

# Bundle and minify JS/CSS plugins
task 'build:plugins', ->
  bundle [
    'lib/jquery/jquery-2.0.0.min.js',
    'lib/bootstrap/js/bootstrap.min.js',
    'lib/angular.min.js',
    'lib/imgLiquid.js'
  ], 'extension/js/plugins.js'
  bundle [
    'lib/bootstrap/css/bootstrap.min.css',
    'lib/bootstrap/css/bootstrap-responsive.min.css'
  ], 'extension/style/plugins.css'

# Copy static files from src/
task 'copy:static', ->
  files = [
    'src/manifest.json'
    'src/icon.png'
    'src/icon-128.png'
  ]
  for file in files
    console.log "Moving #{file}"
    cp = spawn 'cp', [file, 'extension/']
    cp.stderr.on 'data', (data) ->
      process.stderr.write data.toString()
    cp.stdout.on 'data', (data) ->
      console.log data.toString()

# Copy Bootstrap's images
task 'copy:images', ->
  cp = spawn 'cp', ['-r','lib/bootstrap/img', 'extension/']
  cp.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  cp.stdout.on 'data', (data) ->
    console.log data.toString()

# Builds all output files from source
task 'build', ->
  # Folders for compiled assets
  outFolders = [
    'extension',
    'extension/js'
    'extension/style',
    'extension/img'
  ]

  # Create the output dirs if they don't exist
  for folder in outFolders
    unless fs.existsSync folder
      mkdir = spawn 'mkdir', [folder]
      mkdir.stderr.on 'data', (data) ->
        process.stderr.write data.toString()
      mkdir.stdout.on 'data', (data) ->
        console.log data.toString()

  # Invoke all builds
  invoke 'build:coffee'
  invoke 'build:less'
  invoke 'build:haml'
  invoke 'build:handlebars'
  invoke 'build:plugins'
  invoke 'copy:static'
  invoke 'copy:images'

# Build the extension, listening for changes
task 'watch', ->
  invoke 'build'

  watch 'src/*.less', -> invoke 'build:less'
  watch 'src/*.coffee', -> invoke 'build:coffee'
  watch 'src/*.haml', -> invoke 'build:haml'
  watch 'src/manifest.json', -> invoke 'copy:static'

# Build the extension, then package it for CWS
task 'package', ->
  invoke 'build'

  outZip = new zip()
  outZip.addLocalFolder 'extension/'
  outZip.writeZip 'extension.zip'