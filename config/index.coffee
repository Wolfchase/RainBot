module.exports =
  server   : process.env.IRC_SERVER or 'irc.canternet.org'
  nick     : process.env.IRC_NICK or 'SnowBot'
  password : process.env.IDENTIFY_PASSWORD or undefined
  channels : [ process.env.CHANNEL or '#Snowybottest' ]
  db       : process.env.DB_URL or undefined
  helpLink : 'rainbot.info/userguide'
  loggingLevel : true
  bang     : 'end'

  info:
    description : 'a multipurpose IRC botpony'
    version     : 'STG 3.4.45'
    versionName : 'Xenith'
    developer   : 'MistaWolf'
    writtenIn   : 'node.js'

  whitelist: [
    'Dustrunner'
    'Eventide'
    'Powderprancer'
    'King_Sombra'
    'MistaWolf'
  ]

  whitelisted_funcs: [
    'chan'
    'sleep'
    'wake'
  ]
