hashmap = require('hashmap')
fs      = require('fs') 

class Alias
  constructor: (@trigger) ->
    @aliases = new hashmap()
    @file = '/aliases.txt'
    
  isAlias: (alias) ->
    return @aliases.get(alias) != undefined
  
  getAlias: (alias) ->
    return @aliases.get(alias)
  
  addAlias: (alias, cmd) ->
    @aliases.set(alias, cmd)
    @writeAlias()
  
  deleteAlias: (alias) ->
    @aliases.remove(alias)
    @writeAlias()
    
  writeAlias: (alias, cmd) ->
    file = fs.createWriteStream(__dirname + @file)
    @aliases.forEach (value, key) ->
      if value
        file.write(key + ':' + value + '\n')
    file.end()
    
  isAliasCmd: (text) ->
    return @trigger.cmd(text, 'alias')
  
  loadAliases: () ->
    self = this
    fs.readFile __dirname + @file, (err, data) ->
      if data
        raw    = data.toString()
        buffer = raw.split('\n')
        for line in buffer
          continue if line[0] == '#'
          alias = []
          alias[0] = line.before(':')
          alias[1] = line.after(':')
          self.aliases.set alias[0], alias[1]
    
module.exports = Alias
  