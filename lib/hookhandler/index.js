/* global rainlog, __config */
"use strict";

const hashmap = require('hashmap');
const async   = require('async');
const _       = require('lodash');

const respond = require('./../responders');
const helpers = require('./helpers');
const nester  = require('./nest');
const hooks   = require('./hooks');
const parser  = require('./../parser');
const alias   = require('./../alias');

function extractTriggers(module) {
  _.forEach(module.triggers, function(triggers, event) {
    for (let trigger of triggers) {
      hooks.setTrigger(trigger);
    }
  });
}

function extractCommands(module) {
  module.commands.forEach(function(command, name) {
    hooks.setCommand(name, command);
  });
}

function isFireable(hook, params) {
  if (!hook) {
    return false;
  } else if (!hook.listening || !hook.parent.enabled) {
    return false;
  } else if (!params.to && (hook.pm && hook.pm === false)) { // Set up default hook params
    return false;
  } else if (hook.whitelist && !_.contains(hook.whitelist, params.from)) {
    return false;
  } else {
    return true;
  }
}

function execute(command, params, callback) {
  const commandName = helpers.getCommandName(command);
  const commandArgs = helpers.getCommandArgs(command);
  if (!commandName) return callback(null);
  if (alias.isAlias(commandName)) {
    alias.get(commandName, commandArgs, function(err, alias) {
      if (err) {
        respond.assign('bot', params).say(err.message);
        return callback(null);
      }
      const commands = parser.getCommands(alias);
      run(commands, params, true, function(responder) {
        nester.nest(commandName, responder.getResponse());
        return callback(responder);
      });
    });
  } else {
    const hook = hooks.getCommand(commandName);
    if (!isFireable(hook, params)) return callback(null);

    const event     = 'message'
    const data      = helpers.packageData(
                       event, params, hook.parent, commandArgs);
    const responder = respond.assign('hook', commandName, data);
    const d         = require('domain').create();

    d.on('error', function(err) {
      rainlog.err(data.parent.name, err.stack);
      //data.parent.broke();
    });

    d.run(function() {
      hook.action(data, responder, function() {
        let response;
        if (hook.ASAP) response = responder.flush();
        else           response = responder.getResponse();
        nester.nest(hook.name, response);
        d.exit();
        d.dispose();
        return callback(responder);
      });
    });
  }
}

/**
 * Runs a set of commands, but only flushes the last responder.
 * Also flushes the responder if hook has ASAP set to true. The alias
 * argument is used when this function is called recursively from
 * the execute function when an alias command is ran.
 *
 * @param {[String]} commands - A list of commands to run
 * @param {Object}   params   - Object containing irc parameters
 * @param {Bool}     alias    - Indicates if commands are from an alias
 * @param {Callback} done     - Call when all commands are finished
 */

function run(commands, params, alias, done) {
  async.forEachOfSeries(commands, function(command, i, next) {
    execute(command, params, function(responder) {
      if (!responder) {
        rainlog.debug('HH', `Misfire on command ${command}`);
        return next();
      } else if (i + 1 === commands.length) {
        if (!responder.flushed() && !alias) {
          responder.flush();
          nester.reset();
        }
        if (done) return done(responder);
      } else { next(); }
    });
  }, function(err) {
    if (err) {
      rainlog.err('Received error while running commands, err: ${err.message}');
      rainlog.err('Was aliased set of commands: ${alias}');
    }
  });
}

function fireTriggers(event, params, commandOnly) {
  const triggers = hooks.getTriggers();
  if (triggers[event].length === 0) return;
  async.each(triggers[event], function(hook) {
    if (commandOnly && !hook.onCommand) return;
    if (hook.trigger(params)) {
      const data = helpers.packageData(event, params, hook.parent);
      const responder = respond.assign('hook', hook.name, data);
      const d = require('domain').create();

      d.on('error', function(err) {
        rainlog.err(data.parent.name, err.stack);
        data.parent.broke();
      });

      d.run(function() {
        hook.action(data, responder, function() {
          responder.flush();
          d.exit();
          d.dispose();
        });
      });
    }
  }, function(err) {});
}

module.exports = {

  execute,

  extractHooks(module) {
    extractTriggers(module);
    extractCommands(module);
  },

  fire(event, params, callback) {
    if ((event === 'message' || event === 'pm') 
          && parser.isCommand(params.text)) {
      const commands = parser.getCommands(params.text);
      rainlog.debug('HH', `Firing command(s): ${commands}`);
      run(commands, params, false, null);
      fireTriggers(event, params, true);
    } else {
      fireTriggers(event, params, false);
    }
  }
};
