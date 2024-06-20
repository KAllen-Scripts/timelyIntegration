const { addEventToDatabase } = require('../misc/eventsdb');
const { makeEvent } = require('../timely/timelyEvents')
const Router = require('@koa/router');
const router = new Router();

router.post('/aircall-calls', async (ctx) => {
    const requestData = ctx.request.body;
  
    if (requestData.data.answered_at == null){
      ctx.body = {};
      return
    }
  
    let eventDetails = {
      type: 'aircall',
      agentEmail: requestData.data.user.email,
      eventTime: new Date(requestData.data.answered_at * 1000).toLocaleString('en-GB', { timeZone: 'Europe/London' }),
      customerID: requestData?.data?.contact?.company_name,
      contactNumber: requestData.data.raw_digits,
      timeTakenInSeconds: requestData.data.ended_at - requestData.data.answered_at,
      timeTakenInMinutes: (requestData.data.ended_at - requestData.data.answered_at) / 60
    }

    addEventToDatabase(eventDetails)

    await makeEvent(eventDetails)
  
    ctx.body = {};
  });

module.exports = router;