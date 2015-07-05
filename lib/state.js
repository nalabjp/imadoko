var Log = require('./log.js');
var config = require('config');

const AWAY_DURATION = config.condition.time_until_away * 60 * 1000; // minutes

startClock = config.condition.business.start.split(':');
businessStart = new Date();
businessStart.setHours(startClock[0], startClock[1], 0);
const BUSINESS_START = businessStart.getTime();

endClock = config.condition.business.end.split(':');
businessEnd = new Date();
businessEnd.setHours(endClock[0], endClock[1], 0);
const BUSINESS_END = businessEnd.getTime();

function State() {
  this.online = false;
  this.latest = null;

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
      if ((now < BUSINESS_START) || (BUSINESS_END < now)) {
        if ((now - this.latest) > AWAY_DURATION) {
          // offline
          this.toOffline(offline);
        }
      }
    }
  };
};

module.exports = State;
