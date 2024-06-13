const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

const grooveRoutes = require('./groove/grooveRoutes');
const aircallRoutes = require('./aircall/aircallRoutes');
const timeleyRoutes= require('./timely/timeleyRoutes');
const miscRoutes= require('./misc/miscRoutes');

app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

app.use(grooveRoutes.routes());
app.use(aircallRoutes.routes());
app.use(timeleyRoutes.routes());
app.use(miscRoutes.routes());