const app    = require('koa')(),
      router = require('koa-router')(),
      render = require('co-views')(__dirname + '/views', { ext: 'ejs' }),      
      signs  = require('./data.js');

const Routes = {

  // API
  api:  function *(next) {
    if (this.request.querystring !== '') {
      let jsonResponse = [],
          q = this.query;
      function buildResponse(x) {
        jsonResponse = [x, ...jsonResponse];
      }
      signs.map(x => {
        if (q.name    && q.name.toLowerCase()    === x.name.toLowerCase())    buildResponse(x);
        if (q.element && q.element.toLowerCase() === x.element.toLowerCase()) buildResponse(x);
        if (q.quality && q.quality.toLowerCase() === x.quality.toLowerCase()) buildResponse(x);
        if (q.planet  && q.planet.toLowerCase()  === x.planet.toLowerCase())  buildResponse(x);
      });
      this.type = 'json';
      this.body = jsonResponse;
    } else {
      this.body = yield render(
        'api', {
          title: 'XYZODIAC'
        }
      );
    }
  },

  query:  function *(next) {
    let request = this.request;
    let query = request.querystring;
    console.log(query);
    this.body = yield render(
      'index', {
        title: 'XYZODIAC'
      }
    );
  },
  
  // Index
  home:  function *(next) {
    this.body = yield render(
      'index', {
        title: 'XYZODIAC'
      }
    );
  },


  // Signs listing
  signs: function *(next) {
    this.body = yield render(
      'signs', {
        signs: signs,
        title: `Signs ★ XYZODIAC`
      });
  },

  
  // Sign detail pages
  signDetail: function *(next) {
    let sign;
    signs.map(x => {
      if (this.params.sign === x.name.toLowerCase()) {
        sign = x;
      }
    });     
    this.body = yield render(
      'sign', {
        sign: sign,
        title: `${sign.name} ★ XYZODIAC`
      });
  },


  // Sign redirect
  redirectSign: function *(next) {
    this.status = 301;
    this.redirect('/');
  },

  // Error handling
  errors: function *(next) {
    let err, status;
    try {
      yield next;
    } catch(e) {
      if (e.status !== 404) throw e;
      err = e;
    }
    status = this.status = (err && err.status) || this.status || 404;
    if (status !== 404) return;
    this.body = yield render( 'error', { title: 'Page not found' });
  }
};

module.exports = Routes;
