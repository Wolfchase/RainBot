/* global rainlog, __config */
"use strict";

const discord = require("discord.js");
const fs = require('fs');
const async = require('async');

const hookHandler = require('./hookhandler');
const respondQueue = require('./responders/respondqueue');
const alias = require('./alias');
const ircHelpers = require('./irc');

const modulesFolder = __dirname + '/../modules/';

class Bot extends discord.Client {

  /**
   * Creates an instance of the bot. Inherits from irc.Client.
   *
   * @constructor
   * @param {String} server - Server to connect to
   * @param {String} nick - Nick to use for connection
   * @param {Object} options - Options to pass to superclass
   */

  constructor() {
    rainlog.info('Bot', 'Initializing bot...');
    super();
    this.version = '0.8.1 (Mr. Horse)';
    this.Module = require('./module')(this);
    this.alias = alias;
    this.modules = [];
    this.config = __config;
    this.sleep = false;
    alias.loadAliases();
    respondQueue.setBot(this);
  }

  /**
   * Loads modules from the modules directory. Makes sure that
   * path is a directory and that modules export an instance of
   * the Module class. The hook handler is called to extract hooks.
   *
   * @param {Function} callback - Called when all modules are loaded.
   */

  loadModules(callback) {
    rainlog.info('Bot', 'Loading modules...');

    fs.readdir(modulesFolder, (err, modules) => {
      async.each(modules, (moduleDir, next) => {
        if (!fs.lstatSync(modulesFolder + moduleDir).isDirectory()) {
          rainlog.warn('Bot', `${moduleDir} is not a module directory`);
          return next();
        }

        require(modulesFolder + moduleDir)(this.Module, (module) => {
          if (!(module instanceof this.Module)) {
            rainlog.err('Bot', `${moduleDir} is not a module`);
            rainlog.err('Bot', 'Make sure that module exports a Module instance');
            return next();
          }

          this.modules.push(module);
          hookHandler.extractHooks(module);
          rainlog.info('Bot', `Loaded module: ${module.name}`);
          return next();
        });
      }, (err) => {
        return callback();
      });
    });
  }

  setUpPastebin(pastebinApiSettings) {
    if (!pastebinApiSettings || !pastebinApiSettings.api_dev_key) return;
    const PastebinAPI = require('pastebin-js');
    respondQueue.setPastebinApi(new PastebinAPI(pastebinApiSettings));
  }

  /**
   * Loads modules and attaches hooks before connecting to IRC.
   *
   * @param {Function} callback
   *    Called when modules are loaded and hooks are attached.
   */

  preStart(callback) {
    const self = this;
    self.loadModules(function() {
      self.attachHooks(function() {
        require('./../config/init')(self, callback);
      });
    });
  }

  /**
   * First temporarily caches nsPassword and pastebinApi from the config
   * and then sets them to empty strings in the config so that modules
   * can't reference them. Then attempts to indentify with NickServ if
   * nsPassword was set and creates a pastebin object if that was set
   * as well. Lastly, it attempts to connect to IRC and joins each channel
   * listed in the config via {@link bot~gate}
   */

  start() {
    const self = this;
    rainlog.info('Bot', 'Starting bot...');

    const nsPassword = __config.nsPassword;
    this.setUpPastebin(__config.pastebinApi);

    rainlog.info('Bot', 'Unsetting nsPassword and Pastebin API in config');
    __config.nsPassword = '';
    __config.pastebinApi = '';

    this.preStart(connect);

    function connect() {
      self.login("");
      rainlog.info("Bot", "Connected to Discord");
    }

    function postStart() {
      rainlog.info('Bot', 'Bot connected to Discord');
    }
  }

  /**
   * Dispatches events to modules.
   *
   * @param {String} event - The event to fire.
   * @param {Object} params - Params containing event information.
   */

  dispatch(event, params) {
    const self = this;
    if (self.sleep) return;
    rainlog.debug('Bot', `Dispatching event: ${event}`);
    hookHandler.fire(event, params);
  }

  /**
   * Attaches listeners to the bot which dispatch events to modules.
   *
   * @param {Function} callback - Called when all listeners are attached.
   */

  attachHooks(callback) {
    const self = this;

    this.on('message', message => {
      if (message.author === self.user) return; // Is pm
      self.dispatch('message', { from: message.author, to: message.channel, text: message.content, msg: message });
    });

    // Finished attaching hooks
    return callback();
  }
}

module.exports = Bot;
