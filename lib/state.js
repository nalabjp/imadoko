var Log = require('./log.js');
var config = require('config');

const AWAY_DURATION = config.condition.time_until_away * 60 * 1000; // minutes

function State() {
  this.online = false;
  this.latest = null;

  this.businessTime = function(clock) {
    splited = clock.split(':');
    today = new Date();
    today.setHours(splited[0], splited[1], 0);
    return today.getTime();
  };

  this.businessStart = function() {
    return this.businessTime(config.condition.business.start);
  };

  this.businessEnd = function() {
    return this.businessTime(config.condition.business.end);
  };

  this.toOnline = function(online) {
    this.latest = Date.now();
    if (!this.online) {
      this.online = true;
      online();
    }
  };

  this.toOffline = function(offline) {
    this.online = false;
    this.latest = null;
    offline();
  };

  this.toAway = function(away) {
    this.online = false;
    this.latest = now;
    away();
  };

  this.check = function(away, offline) {
    Log.d('State check');
    now = Date.now();
    if (this.online) {
      if ((now - this.latest) > AWAY_DURATION) {
        // away
        this.toAway(away);
      }
    } else {
      if (this.latest == null) return;
      if ((now < this.businessStart()) || (this.businessEnd() < now)) {
        if ((now - this.latest) > AWAY_DURATION) {
          // offline
          this.toOffline(offline);
        }
      }
    }
  };
};

module.exports = State;
