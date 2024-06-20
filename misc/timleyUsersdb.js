const sqlite3 = require('sqlite3').verbose();

const users = new sqlite3.Database('users.sqlite', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    users.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      userEmail TEXT UNIQUE
    )`, (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  }
});


async function addUsersToDatabase(userData) {
    const { userId, userEmail } = userData;
  
    // First, try to update an existing record with the given projectAccountKey
    users.run(`UPDATE users SET userId = ? WHERE userEmail = ?`, [userId, userEmail], function(err) {
      if (err) {
        console.error(err.message);
        return;
      }
  
      // If no rows were updated, insert a new record
      if (this.changes === 0) {
        users.run(`INSERT INTO users (userId, userEmail) VALUES (?, ?)`, [userId, userEmail], (err) => {
            if (err) {
            console.error(err.message);
            }
        });
      }
    });
}

function getUserByEmail(userEmail) {
    return new Promise((resolve, reject) => {
      users.get(`SELECT * FROM users WHERE userEmail = ?`, [userEmail], (err, row) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
}


module.exports = {
  addUsersToDatabase,
  getUserByEmail
}