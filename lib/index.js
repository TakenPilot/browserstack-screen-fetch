var Promise = require('bluebird'),
  fs = require('fs'),
  bs = require('browserstack');

function wait(ms) {
  var d = Promise.defer();
  setTimeout(function () {
    d.resolve();
  }, ms);
  return d.promise;
}

function waitUntilReady(client, worker, waitInterval) {
  var interval,
    d = Promise.defer();
  if (worker.status === 'running') {
    d.resolve(worker);
  } else {
    interval = setInterval(function () {
      client.getWorker(worker.id, function (err, worker) {
        if (err) {
          return d.reject(err);
        }
        if (worker.status === 'running') {
          clearInterval(interval);
          d.resolve(worker);
        }
      });
    }, waitInterval);
  }
  return d.promise;
}

var BrowserStackScreenFetch = function (options) {
  this.waitToLoad = options.waitToLoad || 1000,
  this.waitInterval = options.waitInterval || 1000;

  this.client = Promise.promisifyAll(bs.createClient({
    username: options.user,
    password: options.password
  }));

  this.kill = options.kill === "false" ? false : true;
};

BrowserStackScreenFetch.prototype = {
  getUrl: function (workerTemplate) {
    var client = this.client,
      waitInterval = this.waitInterval,
      waitToLoad = this.waitToLoad,
      kill = this.kill;

    return client.createWorkerAsync(workerTemplate).then(function (worker) {
      return waitUntilReady(client, worker, waitInterval);
    }).then(function (worker) {
      //wait for the browser to load
      return wait(waitToLoad).return(worker);
    }).then(function(worker) {
      return client.takeScreenshotAsync(worker.id).then(function (screenshot) {
        //kill worker, then continue with screenshot data
        if (kill) {
          return client.terminateWorkerAsync(worker.id)
            .return(screenshot);
        } else {
          return screenshot;
        }
      });
    })
  },

  killAll: function () {
    var client = this.client;

    return client.getWorkersAsync().map(function (worker) {
      return client.terminateWorkerAsync(worker.id);
    });
  },

  getStatus: function () {
    return this.client.getApiStatusAsync();
  },

  getList: function () {
    return this.client.getBrowsersAsync();
  },

  getLatest: function () {
    return this.client.getLatestAsync();
  },

  loadFromExample: function (url) {
    return this.client.getBrowsersAsync().then(function (browserList) {
      return [{
        url: url || 'google.com',
        template: browserList[0] //just do first
      }];
    });
  },

  loadUseCasesFromFile: function (filename) {
    var readFile = Promise.promisify(fs.readFile)
    return readFile(filename, {encoding: 'UTF8'}).then(JSON.parse);
  }
};

module.exports = BrowserStackScreenFetch;
