const {addEventToDatabase } = require('../misc/eventsdb.js');
const { makeEvent } = require('../timely/timelyEvents')
const Router = require('@koa/router');
const router = new Router();
const grooveFunctions = require('./grooveFunctions.js')

router.post('/groove-replies', async (ctx) => {
    const requestData = ctx.request.body;
    
    let ticketNumber = requestData.app_ticket_url.split('/').at(-1)

    let eventDetails = {
      type: 'groove',
      agentEmail: requestData.links.author.href.split('/').at(-1),
      eventTime: new Date(requestData.created_at).toLocaleString('en-GB', { timeZone: 'Europe/London' }),
      ticketNumber,
      customerID: await grooveFunctions.getCustomerId(ticketNumber),
      ticketTitle: await grooveFunctions.getTicketTitle(ticketNumber),
      timeTakenInSeconds: 5 * 60,
      timeTakenInMinutes: 5
    }

    addEventToDatabase(eventDetails)

    await makeEvent(eventDetails)

    ctx.body = {};
});

module.exports = router;