const sqlite3 = require('sqlite3').verbose();

const projects = new sqlite3.Database('projects.sqlite', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    projects.run(`CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER,
      projectAccountKey TEXT UNIQUE
    )`, (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  }
});


async function addProjectToDatabase(projectData) {
    const { projectId, projectAccountKey } = projectData;
  
    // First, try to update an existing record with the given projectAccountKey
    projects.run(`UPDATE projects SET projectId = ? WHERE projectAccountKey = ?`, [projectId, projectAccountKey], function(err) {
      if (err) {
        console.error(err.message);
        return;
      }
  
      // If no rows were updated, insert a new record
      if (this.changes === 0) {
        projects.run(`INSERT INTO projects (projectId, projectAccountKey) VALUES (?, ?)`, [projectId, projectAccountKey], (err) => {
            if (err) {
            console.error(err.message);
            }
        });
      }
    });
}

function getProjectByAccountKey(projectAccountKey) {
    return new Promise((resolve, reject) => {
      projects.get(`SELECT * FROM projects WHERE projectAccountKey = ?`, [projectAccountKey], (err, row) => {
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
  addProjectToDatabase,
  getProjectByAccountKey
}