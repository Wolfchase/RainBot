module.exports = {

  /*
   *    server - address to IRC server
   *     port  - port number
   */

  server: process.env.IRC_SERVER || 'irc.canternet.org',
  port: process.env.IRC_PORT || 6667,

  /*
   *      nick   - Nick to be displayed
   *    realName - Your 'realName'
   *    userName - (Optional) Your username
   */

  nick: process.env.IRC_NICK || 'Ogniar',
  realName: process.env.IRC_REAL || 'RainBotDev',
  userName: process.env.IRC_USER || 'RainBot',

  /*
   *    modeList - (Optional) Modes to send after conecting to IRC
   */

  modeList: '+B',

  /*
   *    If you wish to use pastebin, you can enter your
   *    pastebin information here.
   */

  pastebinApi: {
    'api_dev_key' : undefined,
    'api_user_name': undefined,
    'api_user_password': undefined
  },

  /*
   *    If your server supports NickServ, enter your password here to
   *    be authed when the bot connects or set it to false or undefined
   */

  nsPassword: process.env.IDENTIFY_PASSWORD || undefined,

  /*
   *    channels - The channels to join on connect
   */

  channels: [ process.env.CHANNELS || '#snowybottest', '#RainBot' ],

  /*
   *    logging: A string specifying logging modes, all modes include:
   *
   *    i: Log info           e: Log errors
   *    w: Log warnings       d: Log debug messages
   *    f: Allow file logging (regular logs are file logged)
   */

  logging: 'diwe',

  /*
   *    prompt - Sets the prompt used for logging.
   */

  prompt: 'SnowBot ',

  /*
   *    debug - Set to true if you want debug logs
   *            from the backbone IRC library
   */

  debug: true,

  /*
   *    The prefix to denote commands, for example if set to ';', then ';say'
   *    would be a command.
   */

   commandPrefix: '.',

  /*
   *    The command symbol is used to directly specify to the bot that
   *    your message is a command message. Use it at the beginning of
   *    new message, i.e. "$ ;say this is a command message"
   */

  commandSymbol: '$'
};
