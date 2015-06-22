/*
 * requires
 */
var noble = require('noble');
var config = require('config');
var Log = require('./lib/log.js');
var Trello = require('./lib/trello.js');

var trello = new Trello(config.trello);
var online = false;
var latest = null;
const SERVCE_UUIDS = [];
const REPEAT_SCAN = true;
const AWAY_DURATION = config.condition.time_until_away * 60 * 1000; // minutes
const INTERVAL = 30 * 1000; // 30 sec
startClock = config.condition.business.start.split(':');
businessStart = new Date();
businessStart.setHours(startClock[0], startClock[1], 0);
const BUSINESS_START = businessStart.getTime();

endClock = config.condition.business.end.split(':');
businessEnd = new Date();
businessEnd.setHours(endClock[0], endClock[1], 0);
const BUSINESS_END = businessEnd.getTime();


Log.i('imadoko start');

// Trello
Log.i('Trello data loading... ');
trello.init();

// noble 
Log.i('noble start... ');
noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning(SERVCE_UUIDS, REPEAT_SCAN);
    Log.i('noble start scanning... ');
  } else if (state === 'unsupported') {
    Log.i('BLE is not supported in running environment.');
    Log.i('exit...');
    process.exit(1);
  } else {
    noble.stopScanning();
    Log.i('noble stop scanning');
  }
});

noble.on('discover', function(peripheral) {
  if (!trello.initialized || peripheral.advertisement.localName != config.device.name) return;

  Log.d('Found device with local name: ' + peripheral.advertisement.localName);

  latest = Date.now();
  if (!online) {
    online = true;
    trello.moveCard('online');
  }
});

// Watcher
var whereNow = function() {
  Log.d('Where now?');
  now = Date.now();
  if (online) {
    if ((now - latest) > AWAY_DURATION) {
      // away
      online = false;
      latest = now;
      trello.moveCard('away');
    }
  } else {
    if (latest == null) return;
    if ((now < BUSINESS_START) || (BUSINESS_END < now)) {
      if ((now - latest) > AWAY_DURATION) {
        // offline
        online = false;
        latest = null;
        trello.moveCard('offline');
      }
    }
  }
};

setInterval(function() {
  whereNow();
}, INTERVAL);
