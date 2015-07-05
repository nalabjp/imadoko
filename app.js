process.env.TZ = 'Asia/Tokyo';

/*
 * requires
 */
var noble = require('noble');
var config = require('config');
var schedule = require('node-schedule');
var Log = require('./lib/log.js');
var Trello = require('./lib/trello.js');
var State = require('./lib/state.js');

var trello = new Trello(config.trello);
var state = new State();

const SERVCE_UUIDS = [];
const REPEAT_SCAN = true;

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

  state.toOnline(function() {
    trello.moveMyCard('online');
  })
});

schedule.scheduleJob('*/1 * * * *', function() {
  state.check(
    function() {
      trello.moveMyCard('away');
    },
    function() {
      trello.moveMyCard('offline');
    }
  );
});

if (config.admin.force_reset.enable == true) {
  clock = config.admin.force_reset.clock.split(':');
  schedule.scheduleJob(clock[1] + ' ' + clock[0] + ' * * *', function() {
    trello.moveAllCards(config.admin.force_reset.list);
  });
}
