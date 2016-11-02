"use strict";

const respondQueue = require('./respondqueue');

class Responder {
  constructor(name, data) {
    this.name = name
    this.responses = [];
    this.flushedResponses = [];
    this.deftarget = undefined;
    this.drained = false;
    return this.setDefaultTarget(data);
  }

  setDefaultTarget(data) {
    if (data.to) {
      this.deftarget = data.to;
    } else if (data.from) {
      this.deftarget = data.from;
    } else if (data.channel) {
      this.deftarget = data.channel;
    } else if (data.nick) {
      this.deftarget = data.nick;
    } else if (data.newnick) {
      this.deftarget = data.newnick;
    }
    return this;
  }

  handleResponseArgs(arg1, arg2) {
    var to;
    var response;
    if (arg2 !== undefined) {
      to = arg1;
      response = arg2;
    } else {
      to = undefined;
      response = arg1;
    }
    if (to === undefined) to = this.deftarget;
    return [to, response];
  }

  pushSay(arg1, arg2) {
    const args = this.handleResponseArgs(arg1, arg2);
    const to = args[0];
    const response = args[1];
    if (!response) return;
    this.responses.push({
      method: 'say',
      to,
      data: response
    });
    this.drained = false;
  }

  pushAction(arg1, arg2) {
    const args = this.handleResponseArgs(arg1, arg2);
    const to = args[0];
    const response = args[1];
    if (!response) return;
    this.responses.push({
      method: 'reply',
      to,
      data: response
    });
    this.drained = false;
  }

  pushPaste(arg1, arg2) {
    const args = this.handleResponseArgs(arg1, arg2);
    const to = args[0];
    const response = args[1];
    if (!response) return;
    this.responses.push({
      method: 'pastebin',
      to,
      data: response,
      title: this.name
    });
    this.drained = false;
  }

  pop() {
    const response = this.responses.pop();
    respondQueue.push(response);
    this.flushedResponses.push(response);
    if (this.responses.length === 0) this.drained = true;
    return response;
  }

  getResponse() {
    return this.flushedResponses;
  }

  reset() {
    this.responses = [];
    this.outputData = undefined;
  }
}

// const ModuleResponder = require('./modulerespond')(Responder);
const HookResponder = require('./hookrespond')(Responder);
const BotResponder = require('./botrespond')(Responder);

module.exports = {

  assign(type, name, data) {
    switch(type) {
      case 'hook': return new HookResponder(name, data);
      case 'bot' : return new BotResponder(__config.nick, name);
    }
  }
};
