const { getUserByEmail } = require('../misc/timleyUsersdb');
const { getProjectByAccountKey } = require('../misc/projectsdb');
const axios = require('axios');

const dotenv = require('dotenv');
dotenv.config();

const defaultProject = 4602148
const parentLabel = 3880993
const childLabel = 3880994

async function makeEvent(event){
  if(event.agentEmail.toLowerCase() != 'k.allen@stok.ly'){return}
  let title
  if(event.type == 'groove'){
    title = `${event.ticketTitle} - [${event.ticketNumber}] || ${event.customerID || 'Unknown'} at ${event.eventTime}`
  } else {
    title = `Aircall || ${event.customerID || 'Unknown'} at ${event.eventTime}`
  }

  let projectID = await ((event.customerID == null ? defaultProject : await getProjectByAccountKey(event.customerID)) || defaultProject)

  let data = {
      "event": {
        "user_id": await getUserByEmail(event.agentEmail).then(r=>{return r.userId}),
        "seconds": event.timeTakenInSeconds,
        "day": event.eventTime,
        "note": title,
        "project_id": projectID,
        "label_ids": [
              parentLabel,
              childLabel
            ]
      }
    }
    await axios({ 
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://api.timelyapp.com/1.1/${process.env.TIMELY_ACCOUNTID}/events`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TIMELY_BEARER}`
      },
      data
    })
    console.log(data)
}

module.exports={
  makeEvent
}