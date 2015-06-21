var Log = require('./log.js');
var Api = require('node-trello');

function Trello(trelloConfig) {
  this.config = trelloConfig;
  this.api = new Api(this.config.key, this.config.token);
  this.values = {};
  this.initialized = false;

  // initialize
  this.init = function(){
    self = this;
    Promise.all([
      self.loadMe(),
      self.loadBoard()
    ]).then(function(res) {
      return Promise.resolve(
        Promise.all([
          self.loadMycard(),
          self.loadList()
        ])
      );
    }).then(function(res) {
      Log.i('Trello data loaded!!');
      Log.d(self);

      self.initialized = true;
    }).catch(function(error) {
      Log.e(error);
    });
  };

  // API request GET me
  this.loadMe = function() {
    Log.i('GET trello me: ');

    self = this;
    return new Promise(function(resolve, reject) {
      self.api.get('/1/members/me', function(err, data) {
        if (err) reject(err);
        Log.i('GET trello me: Me ["' + data.fullName + '"] found');
        Log.d(data);

        self.values.me = data.id;
        resolve(true);
      });
    });
  };

  // API request GET board
  this.loadBoard = function() {
    Log.i('GET trello board: ');

    self = this;
    return new Promise(function(resolve, reject) {
      self.api.get('/1/members/me/boards', function(err, data) {
        if (err) reject(err);
        Log.d(data);

        for (board of data) {
          if (board.name == self.config.board.name) {
            Log.i('GET trello board: Board ["' + self.config.board.name + '"] found');
            Log.d(board);

            self.values.board = board.id;
            resolve(true);
          }
        }
      });
    });
  };

  // API request GET my card
  this.loadMycard = function() {
    Log.i('GET trello my card: ');
    self = this;

    return new Promise(function(resolve, reject) {
      self.api.get('/1/boards/' + self.values.board + '/cards?fields=id,idMembers,name', function(err, data) {
        if (err) reject(err);
        Log.d(data);

        for (card of data) {
          for (member of card.idMembers) {
            if (member == self.values.me) {
              Log.i('GET trello my card: My Card ["' + card.name + '"] found');
              Log.d(card);

              self.values.mycard = card.id;
              resolve(true);
            }
          }
        }
      });
    });
  };

  // API request GET list
  this.loadList = function() {
    Log.i('GET trello list: ');
    self = this;

    return new Promise(function(resolve, reject) {
      self.api.get('/1/boards/' + self.values.board + '/lists', function(err, data) {
        if (err) reject(err);
        Log.d(data);

        for (list of data) {
          if (list.name == self.config.board.list.online) {
            Log.i('GET trello list: List ["' + list.name + '"] found');
            Log.d(list);

            self.values.online = list.id;
          }
          if (list.name == self.config.board.list.offline) {
            Log.i('GET trello list: List ["' + list.name + '"] found');
            Log.d(list);

            self.values.offline = list.id;
          }
          if (list.name == self.config.board.list.away) {
            Log.i('GET trello list: List ["' + list.name + '"] found');
            Log.d(list);

            self.values.away = list.id;
          }
        }
        resolve(true);
      });
    });
  };

  // API request PUT card
  this.moveCard = function(listName) {
    Log.i('PUT trello card: ');
    if (listName == 'online') {
      list = this.values.online;
    } else if (listName == 'offline') {
      list = this.values.offline;
    } else if (listName == 'away') {
      list = this.values.away;
    } else {
      throw new Error('Invalid list name');
    }

    this.api.put('/1/cards/' + this.values.mycard + '/idList?value=' + list, function(err, data) {
      if (err) throw err;
      Log.i('PUT trello card: card was moved to "' + listName + '"');
      Log.d(data);
    });
  };
};

module.exports = Trello;
