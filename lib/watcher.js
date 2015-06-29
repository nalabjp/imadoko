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

function Watcher() {
  this.online = false;
  this.latest = null;

  this.whereNow = function(away, offline) {
    Log.d('Where now?');
    now = Date.now();
    if (this.online) {
      if ((now - latest) > AWAY_DURATION) {
        // away
        this.online = false;
        this.latest = now;
        away();
      }
    } else {
      if (this.latest == null) return;
      if ((now < BUSINESS_START) || (BUSINESS_END < now)) {
        if ((now - latest) > AWAY_DURATION) {
          // offline
          this.online = false;
          this.latest = null;
          offline();
        }
      }
    }
  };
};

module.exports = Watcher;
