const sqlite3 = require('sqlite3').verbose();

const projects = new sqlite3.Database('projects.sqlite', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');

    projects.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER,
      projectAccountKey TEXT UNIQUE
    )`, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Table created successfully.');
      }
    });
  }
});


function addProjectToDatabase(projectData) {
    const { projectId, projectAccountKey } = projectData;
  
    // First, try to update an existing record with the given projectAccountKey
    projects.run(`UPDATE events SET projectId = ? WHERE projectAccountKey = ?`, [projectId, projectAccountKey], function(err) {
      if (err) {
        console.error(err.message);
        return;
      }
  
      // If no rows were updated, insert a new record
      if (this.changes === 0) {
        projects.run(`INSERT INTO events (projectId, projectAccountKey) VALUES (?, ?)`, [projectId, projectAccountKey], (err) => {
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

function getProjectByAccountKey(projectAccountKey) {
    return new Promise((resolve, reject) => {
      projects.get(`SELECT * FROM events WHERE projectAccountKey = ?`, [projectAccountKey], (err, row) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
}