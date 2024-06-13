// {
//     method: 'get',
//     maxBodyLength: Infinity,
//     url: 'https://api.timelyapp.com/1.1/1092419/projects',
//     headers: { Authorization: 'UbYGC9W0xfOKQhq90JO8pO3VxPSxrSoJTO7j7aXm4Nk' }
//   }

const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

const grooveRoutes = require('./aircall/aircallRoutes');
const aircallRoutes = require('./groove/grooveRoutes');
const timeleyRoutes= require('./timely/timeleyRoutes');
const miscRoutes= require('./misc/miscRoutes');

app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

app.use(grooveRoutes.routes());
app.use(aircallRoutes.routes());
app.use(timeleyRoutes.routes());
app.use(miscRoutes.routes());

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});