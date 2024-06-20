const Router = require('@koa/router');
const router = new Router();
const axios = require('axios');
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');
const { addProjectToDatabase, getProjectByAccountKey } = require('../misc/projectsdb')
const { addUsersToDatabase } = require('../misc/timleyUsersdb')

dotenv.config();

const rootDir = path.join(__dirname, '..');

router.post('/timely-refresh-auth', async (ctx) => {
  let data = {
    "refresh_token": process.env.TIMELY_REFRESH,
    "client_id": process.env.TIMELY_CLIENT_ID,
    "client_secret": process.env.TIMELY_CLIENT_SECRET,
    "grant_type": "refresh_token"
  }

  await axios({ 
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.timelyapp.com/1.1/oauth/token',
    headers: { 'Content-Type': 'application/json' },
    data
  }).then(r => {
    const envConfig = dotenv.config().parsed;
    envConfig.TIMELY_REFRESH = r.data.refresh_token
    envConfig.TIMELY_BEARER = r.data.access_token
    process.env = { ...process.env, ...envConfig };
    const newEnvContent = Object.entries(envConfig).map(([key, value]) => `${key}=${value}`).join('\n');
    fs.writeFileSync(`${rootDir}/.env`, newEnvContent); // Write to the root directory
  })

  ctx.body = {};
})
  
router.get('/timely-auth', async (ctx) => {
  
    let data = {
      "redirect_uri": `${process.env.SERVER_URL}/timely-auth`,
      "code": ctx.request.url.split('=').at(-1),
      "client_id": process.env.TIMELY_CLIENT_ID,
      "client_secret": process.env.TIMELY_CLIENT_SECRET,
      "grant_type": "authorization_code"
    }
  
    await axios({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.timelyapp.com/1.1/oauth/token',
      headers: { 
        'Content-Type': 'application/json'
      },
      data
    }).then(r=>{
      const envConfig = dotenv.config().parsed;
      envConfig.TIMELY_REFRESH = r.data.refresh_token
      envConfig.TIMELY_BEARER = r.data.access_token
      process.env = { ...process.env, ...envConfig };
      const newEnvContent = Object.entries(envConfig).map(([key, value]) => `${key}=${value}`).join('\n');
      fs.writeFileSync(`${rootDir}/.env`, newEnvContent);
    })
  
    ctx.body = {};
  
});


router.post('/timely-refresh-projects', async (ctx) => {

  let projects = await axios({
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.timelyapp.com/1.1/${process.env.TIMELY_ACCOUNTID}/projects`,
    headers: { 
      Authorization: `Bearer ${process.env.TIMELY_BEARER}`
    }
  }).then(r=>{return r.data})

  for (const project of projects){
    await addProjectToDatabase({projectId: project.id, projectAccountKey: project.external_id})
  }

  ctx.body = {};
})



router.post('/timely-refresh-users', async (ctx) => {

  let users = await axios({
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.timelyapp.com/1.1/${process.env.TIMELY_ACCOUNTID}/users`,
    headers: { 
      Authorization: `Bearer ${process.env.TIMELY_BEARER}`
    }
  }).then(r=>{return r.data})

  for (const user of users){
    addUsersToDatabase({userId: user.id, userEmail: user.email})
  }

  ctx.body = {};
})

module.exports = router;