const sqlite3 = require('sqlite3').verbose();

// Create a new SQLite database instance
const events = new sqlite3.Database('events.sqlite', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    events.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      agentEmail TEXT,
      eventTime TEXT,
      ticketNumber TEXT,
      customerID TEXT,
      ticketTitle TEXT,
      timeTakenInSeconds REAL,
      timeTakenInMinutes REAL
    )`, (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  }
});

function addEventToDatabase(eventData) {
    const { type, agentEmail, eventTime, ticketNumber, customerID, ticketTitle, timeTakenInSeconds, timeTakenInMinutes } = eventData;
  
    events.run(`INSERT INTO events (type, agentEmail, eventTime, ticketNumber, customerID, ticketTitle, timeTakenInSeconds, timeTakenInMinutes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [type, agentEmail, eventTime, ticketNumber, customerID, ticketTitle, timeTakenInSeconds, timeTakenInMinutes], (err) => {
      if (err) {
        console.error(err.message);
      }
    });
}

function getEventsFromDatabase(page = 1, recordsPerPage = 10, sortField = 'id', sortDirection = 'ASC') {
    const offset = (page - 1) * recordsPerPage;
    const sortOrder = sortDirection.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  
    return new Promise((resolve, reject) => {
        events.all(
        `SELECT * FROM events ORDER BY ${sortField} ${sortOrder} LIMIT ${recordsPerPage} OFFSET ${offset}`,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

module.exports={
    addEventToDatabase,
    getEventsFromDatabase
}