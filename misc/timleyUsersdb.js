const sqlite3 = require('sqlite3').verbose();

const users = new sqlite3.Database('users.sqlite', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');

    users.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      userEmail TEXT UNIQUE
    )`, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Table created successfully.');
      }
    });
  }
});


function addUsersToDatabase(userData) {
    const { userId, userEmail } = userData;
  
    users.run(`UPDATE events SET userId = ? WHERE userEmail = ?`, [userId, userEmail], function(err) {
      if (err) {
        console.error(err.message);
        return;
      }
  
      // If no rows were updated, insert a new record
      if (this.changes === 0) {
        projects.run(`INSERT INTO events (userId, userEmail) VALUES (?, ?)`, [userId, userEmail], (err) => {
            if (err) {
            console.error(err.message);
            } else {
            console.log('Data inserted successfully.');
            }
        });
      } else {
        console.log('Data updated successfully.');
      }
    });
}

function getUserByEmail(userEmail) {
    return new Promise((resolve, reject) => {
        users.get(`SELECT * FROM events WHERE userEmail = ?`, [userEmail], (err, row) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
}

modules.export = {
    addUsersToDatabase,
    getUserByEmail
}