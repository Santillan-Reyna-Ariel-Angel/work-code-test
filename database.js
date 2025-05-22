import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS Tag (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    )
    `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Environment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    )
    `);

  db.run(`
    CREATE TABLE IF NOT EXISTS TestDataFile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
    `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Folder (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
    `);

  db.run(`
    CREATE TABLE IF NOT EXISTS RunData (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        collectionPath TEXT NOT NULL,
        environmentId INTEGER,
        testDataFileId INTEGER,
        folderId INTEGER,

        FOREIGN KEY (environmentId) REFERENCES Environment(id),
        FOREIGN KEY (testDataFileId) REFERENCES TestDataFile(id),
        FOREIGN KEY (folderId) REFERENCES Folder(id)
    )
    `);

  db.run(`
    CREATE TABLE IF NOT EXISTS RunDataTag (
        runDataId INTEGER,
        tagId INTEGER,

        PRIMARY KEY (runDataId, tagId),
        FOREIGN KEY (runDataId) REFERENCES RunData(id),
        FOREIGN KEY (tagId) REFERENCES Tag(id)
    )
    `);
});
