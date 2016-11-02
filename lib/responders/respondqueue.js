/* globals rainlog */
"use strict";

const async = require('async');

var bot, pastebin;

function worker(response, callback) {
  if (response.method === 'pastebin') {
    rainlog.debug('pastebin', 'Starting paste');
    pastebin.createPaste(response.data, response.title).then(function (data) {
      rainlog.debug('pastebin', 'Got paste id: ' + data.id);
      bot.say(response.to, 'pastebin.com/' + data);
      if (callback) return callback();
    }).fail(function (err) {
      bot.say(response.to, err.message);
      rainlog.err('pastebin', err.message);
      if (callback) return callback();
    });
  } else {
    response.to.sendMessage(response.data);
    if (callback) callback();
  }
}

const RespondQueue = async.queue(worker, 1);

module.exports = {

  setBot(_bot) {
    bot = _bot;
  },

  setPastebinApi(_pastebin) {
    rainlog.debug('RQ', 'setting pastebin api');
    pastebin = _pastebin;
  },

  push(response) {
    RespondQueue.push(response, null);
  }
};
