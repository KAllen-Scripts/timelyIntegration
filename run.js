// SERVER_URL=https://584a-193-115-255-67.ngrok-free.app
// GROOVE_ACCESS_TOKEN=7780f5588b37746ac32ece1035b8c2b22428a5ed5ff8139841f311b339fe63de
// TIMELY_CLIENT_ID=SvhLicmoNUOP4nvJ6uiEyxeuloqH4yN4ItktAQwvL9M
// TIMELY_CLIENT_SECRET=IfY6-b5E18T10YxgHzW5W0DfX8V-AYbihzDw5EONzP4
// TIMELY_REFRESH=haxCBlJKqoKfIxS2t1RzZx1QayA8BE6CBAm_Ehk0Aws
// TIMELY_BEARER=UbYGC9W0xfOKQhq90JO8pO3VxPSxrSoJTO7j7aXm4Nk
// TIMELY_ACCOUNTID=1092419

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