const { getUserByEmail } = require('../misc/timleyUsersdb');
const { getProjectByAccountKey } = require('../misc/projectsdb');
const axios = require('axios');

const dotenv = require('dotenv');
dotenv.config();

async function makeEvent(event){
  if(event.agentEmail.toLowerCase() != 'k.allen@stok.ly'){return}
  let title
  if(event.type == 'groove'){
    title = `${event.ticketTitle} - [${event.ticketNumber}] || ${event.customerID || 'Unknown'} at [${event.eventTime}]`
  } else {
    title = `Aircall || ${event.customerID || 'Unknown'} at [${event.eventTime}]`
  }

  let projectID = event.customerID ? await getProjectByAccountKey(event.customerID).then(r => r.projectId).catch(() => process.env.defaultProject) : process.env.defaultProject;

  console.log(Math.ceil(event.timeTakenInSeconds / 60) * 60)

  let data = {
      "event": {
        "user_id": await getUserByEmail(event.agentEmail).then(r=>{return r.userId}),
        "seconds": Math.ceil(event.timeTakenInSeconds / 60) * 60,
        "day": event.eventTime,
        "note": title,
        "project_id": projectID,
        "label_ids": [
              process.env.parentLabel,
              process.env.childLabel
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