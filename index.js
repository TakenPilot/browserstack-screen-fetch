var util = require('util')
  fs = require('fs'),
  argv = require('minimist')(process.argv.slice(2)),
  BrowserStackScreenFetch = require('./lib'),
  Handlebars = require('handlebars'),
  templatePath = __dirname + '/templates/',
  expectsJson = argv.json;

if (argv.help) {
  return output('help', {});
}

if (!argv.user) {
  return console.error("Missing --user");
}

if (!argv.password) {
  return console.error("Missing --password");
}

function template(name, data) {
  return Handlebars
    .compile(fs.readFileSync(templatePath + name + '.hbs', {encoding: 'UTF8'}))(data);
}

function output(name, data) {
  if (expectsJson) {
    console.log(util.inspect(data, true, 5));
  } else {
    console.log(template(name, data));
  }
}

var bs = new BrowserStackScreenFetch({
  user: argv.user || process.env.BROWSERSTACK_USERNAME,
  password: argv.password || process.env.BROWSERSTACK_PASSWORD,
  kill: argv.kill
})

if (argv['wait-interval']) {
  waitInterval = parseInt(argv['wait-interval'], 10);
}

if (argv['wait-to-load']) {
  waitToLoad = parseInt(argv['wait-to-load'], 10);
}

if (argv.filename) {
  bs.loadUseCasesFromFile(argv.filename).map(bs.getUrl.bind(bs)).then(function (result) {
    output('url-list', result);
  }).catch(function (err) {
    console.error(err);
  });
} else if (argv.url) {
  bs.loadFromExample(argv.url).map(bs.getUrl.bind(bs)).then(function (result) {
    output('url-list', result);
  }).catch(function (err) {
    console.error(err);
  });
} else if (argv['kill-all']) {
  bs.killAll().then(function (result) {
    output('kill-all', result);
  }).catch(function (err) {
    console.error(err);
  });
} else if (argv.status) {
  bs.getStatus().then(function (result) {
    output('status', result);
  }).catch(function (err) {
    console.error(err);
  });
} else if (argv.list) {
  bs.getList().then(function (result) {
    output('list', result);
  }).catch(function (err) {
    console.error(err);
  });
} else if (argv.latest) {
  bs.getLatest().then(function (result) {
    output('list', result);
  }).catch(function (err) {
    console.error(err);
  });
}
