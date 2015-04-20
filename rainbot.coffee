# Globals for use in modules and listeners
global.__config = __dirname + '/config'
global.__models = __dirname + '/config/models'
global.__core   = __dirname + '/lib/core/core'
global.__debug  = __dirname + '/lib/debug'

irc      = require('irc')
core     = require(__core)
config   = require(__config)
debug    = require(__debug)
modules  = require('./modules')
string   = require('./lib/string')
mongoose = require('mongoose')

# Set the level of debugging
debug.set(config.debug)

# Connect to the database
if config.db
  mongoose.connect(config.db)

# Create the bot
bot = new (irc.Client) 'irc.canternet.org', config.nick,
  userName: "RainbotDev"
  realName: "Rainbot"
  channels: config.channel
  autoConnect: false
  port: 6667
  debug: true

# Load Modules, Core and connect to IRC
modules.load bot, () ->
  core.load(bot)
  core.listen () ->
    bot.connect 3, init

init = ->
  if config.password
    bot.send 'ns', 'identify', config.password
  bot.send 'mode', config.nick, '+B'
  core.GATE null, null
