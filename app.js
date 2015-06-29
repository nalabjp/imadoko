process.env.TZ = 'Asia/Tokyo';

/*
 * requires
 */
var noble = require('noble');
var config = require('config');
var Log = require('./lib/log.js');
var Trello = require('./lib/trello.js');
var schedule = require('node-schedule');

var trello = new Trello(config.trello);
var online = false;
var latest = null;
const SERVCE_UUIDS = [];
const REPEAT_SCAN = true;
const AWAY_DURATION = config.condition.time_until_away * 60 * 1000; // minutes
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
    trello.moveMyCard('online');
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
      trello.moveMyCard('away');
    }
  } else {
    if (latest == null) return;
    if ((now < BUSINESS_START) || (BUSINESS_END < now)) {
      if ((now - latest) > AWAY_DURATION) {
        // offline
        online = false;
        latest = null;
        trello.moveMyCard('offline');
      }
    }
  }
};

schedule.scheduleJob('*/1 * * * *', function() {
  whereNow();
});

if (config.admin.force_reset.enable == true) {
  clock = config.admin.force_reset.clock.split(':');
  schedule.scheduleJob(clock[1] + ' ' + clock[0] + ' * * *', function() {
    trello.moveAllCards(config.admin.force_reset.list);
  });
}
