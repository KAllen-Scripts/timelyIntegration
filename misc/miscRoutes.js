const {getEventsFromDatabase } = require('./eventsdb');
const Router = require('@koa/router');
const router = new Router();

router.get('/export', async (ctx) => {

    const page = ctx.query.page ? parseInt(ctx.query.page) : 1;
    const size = ctx.query.size ? parseInt(ctx.query.size) : 1000;
    const sortField = ctx.query.page ? ctx.query.sortField : 'eventTime';
    const sortDirection = ctx.query.size ? ctx.query.sortDirection : 'ASC';
  
    let data = await getEventsFromDatabase(page, size, sortField, sortDirection)
  
    ctx.body = {data};
  
});

module.exports = router;