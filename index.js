const app    = require('koa')(),
      router = require('koa-router')(),
      routes = require('./routes.js'),
      render = require('co-views')(__dirname + '/views', { ext: 'ejs' });

// Config
app.name = 'XYZODIAC';
app.use(require('koa-static-folder')('./public'));
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routes.errors);
app.listen(3000);

// Routes
router.get('/', routes.home);
router.get('/api', routes.api);
router.get('/sign/:sign', routes.signDetail);
router.get('/sign', routes.redirectSign);
router.get('/signs', routes.signs);
