var path = require('path')
var request = require('supertest')
var utils = require('../support/utils')

var FIXTURES_DIR = path.join(__dirname, '..', 'fixtures')

// builtin
var fs = require('fs');

var app = null

suite('express 4.x async helpers')

before(function () {
  if (utils.nodeVersionCompare(0.10) < 0) {
    this.skip()
    return
  }

  var express = require('express')
  var hbr = require('../../').create()

  app = express()

  // manually set render engine, under normal circumstances this
  // would not be needed as hbr would be installed through npm
  app.engine('hbr', hbr.__express)

  // set the view engine to use handlebars
  app.set('view cache', true)
  app.set('view engine', 'hbr')
  app.set('views', path.join(__dirname, 'views'))

  app.use(express.static(path.join(__dirname, 'public')))

  // value for async helper
  // it will be called a few times from the template
  var indx = 0
  var vals = ['foo', 'bar', 'baz']
  hbr.registerAsyncHelper('async', function (context, cb) {
    process.nextTick(function () {
      cb(vals[indx++ % 3])
    })
  })

  hbr.registerAsyncHelper('async-with-params', function (a, b, ctx, cb) {
    process.nextTick(function () {
      var val = a + b
      cb(val)
    })
  })

  var count = 0

  // fake async helper, returns immediately
  // although a regular helper could have been used we should support this use case
  hbr.registerAsyncHelper('fake-async', function (context, cb) {
    var val = 'instant' + count++
    cb(val)
  })

  app.get('/', function (req, res) {
    res.render('async', {
      layout: false
    })
  })

  app.get('/fake-async', function (req, res) {
    res.render('fake-async', {
      layout: false
    })
  })

  app.get('/async-with-params', function (req, res) {
    res.render('async-with-params', {
      layout: false
    })
  })
})

test('index', function (done) {
  request(app)
    .get('/')
    .expect(fs.readFileSync(path.join(FIXTURES_DIR, 'async.html'), 'utf8'))
    .end(done)
});

test('async', function(done) {
  request(app)
    .get('/fake-async')
    .expect(fs.readFileSync(path.join(FIXTURES_DIR, 'fake-async.html'), 'utf8'))
    .end(done)
});

test('cached', function (done) {
  request(app)
    .get('/')
    .expect(fs.readFileSync(path.join(FIXTURES_DIR, 'async.html'), 'utf8'))
    .end(done)
})

test('async-with-params', function(done) {
  request(app)
    .get('/async-with-params')
    .expect(fs.readFileSync(path.join(FIXTURES_DIR, 'async-with-params.html'), 'utf8'))
    .end(done)
});
