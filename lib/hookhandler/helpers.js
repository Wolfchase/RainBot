/* global rainlog, __config */
"use strict";

const _ = require('lodash');

const nester = require('./nest');
const hooks = require('./hooks');

module.exports = {

  /**
   * packageData (String, params Object, Module Object [, String Args])
   *
   * Packages arguments into a data object. If called for commands, also
   * packages that command's arguments
   */

  packageData(event, params, parent, args) {
    var data = {};
    data.event = event;
    data.hooks = hooks;
    data.parent = parent;
    data.bot = parent.bot;
    if (args) data.args = args;
    _.forEach(params, function(val, key) {
      data[key] = val;
    });
    return data;
  },

  getCommandName(command) {
    if (command.match(new RegExp('^' + __config.commandPrefix))) {
      const cpregex = new RegExp('^' + __config.commandPrefix + '(\\S+)');
      return X(command.match(cpregex)[1]).lower().s;
    } else {
      return null;
    }
  },

  getCommandArgs(command) {
    const args = _.drop(command.trim().split(' '));
    if (args.length > 0) {
      return nester.fillNests(args.join(' ')).split(' ');
    } else {
      return [];
    }
  }
};
