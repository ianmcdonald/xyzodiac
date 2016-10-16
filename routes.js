const app    = require('koa')(),
      router = require('koa-router')(),
      render = require('co-views')(__dirname + '/views', { ext: 'ejs' }),      
      signs  = require('./data.js');

const Routes = {
  
  // API
  api: function *(next) {
    console.log(this.request);
    this.accepts('json', 'text');
    // Check if any parameters were passed
    if (this.request.querystring !== '') {

      this.set('Access-Control-Allow-Origin', '*');
      this.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      this.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      this.set('Access-Control-Allow-Credentials', true);
      
      let jsonResponse = [],
          q = this.query;
      function buildResponse(x) {
        jsonResponse = [x, ...jsonResponse];
      }
      signs.map(x => {
        if (q.name    && q.name.toLowerCase()    === x.name.toLowerCase())    buildResponse(x);
        if (q.element && q.element.toLowerCase() === x.element.toLowerCase()) buildResponse(x);
        if (q.quality && q.quality.toLowerCase() === x.quality.toLowerCase()) buildResponse(x);
        if (q.ruler   && q.ruler.toLowerCase()   === x.ruler.toLowerCase())   buildResponse(x);
        if (q.symbol  && q.symbol.toLowerCase()  === x.symbol.toLowerCase())  buildResponse(x);
      });
      // this.type = 'application/json';
      // this.status = 200;
      this.body = JSON.stringify(jsonResponse);
      console.log(this.response);
    } else {
      this.body = yield render(
        'api', {
          title: 'XYZodiac API'
        }
      );
    }
  },

  query: function *(next) {
    let request = this.request;
    let query = request.querystring;
    console.log(query);
    this.body = yield render(
      'index', {
        title: 'XYZodiac'
      }
    );
  },
  
  // Index
  home: function *(next) {
    this.body = yield render(
      'index', {
        title: 'XYZodiac'
      }
    );
  },


  // Signs listing
  signs: function *(next) {
    this.body = yield render(
      'signs', {
        signs: signs,
        title: `Signs | XYZodiac`
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
        title: `${sign.name} | XYZodiac`
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
