const app    = require('koa')(),
      router = require('koa-router')(),
      routes = require('./routes.js'),
      render = require('co-views')(__dirname + '/views', { ext: 'ejs' }),
      mount  = require('koa-mount'),
      cors   = require('kcors'),
      port   = 3000;

// Config
app.name = 'XYZodiac';
app.use(require('koa-static-folder')('./public'));
app.use(router.routes());
app.use(router.allowedMethods());
app.use(routes.errors);
app.use(mount('/api', cors()));
app.listen(port);
console.log(`Listening on port ${port}`);

// Routes
router.get('/', routes.home);
router.get('/api', routes.api);
router.get('/sign/:sign', routes.signDetail);
router.get('/sign', routes.redirectSign);
router.get('/signs', routes.signs);