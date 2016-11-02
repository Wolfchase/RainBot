/// <reference path="typings/node/node.d.ts"/>
/* global rainlog, __config */
"use strict";

// RainBot
// An extensible, multipurpose IRC bot written in JavaScript with node.js

global.rainlog  = require(__dirname + '/lib/rainlog');
global.__config = require('./config/config');
global.X        = require('./lib/weave');

var Bot = require('./lib/bot');

// Set the level of debugging
rainlog.setLoggingModes(__config.logging);
rainlog.setPrompt(__config.prompt);

var RainBot = new Bot();
RainBot.start();
