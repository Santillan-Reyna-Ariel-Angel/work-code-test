// routes/folderRoutes.js
import express from 'express';
import { db } from '../database.js';

export const router = express.Router();

// GET all folders
router.get('/', (_, res) => {
  db.all('SELECT * FROM Folder', [], (err, rows) => {
    if (err)
      return res.json({
        isError: true,
        message: 'Error retrieving folders: ' + err.message,
      });

    res.json({ isError: false, data: rows });
  });
});

// GET folder by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM Folder WHERE id = ?', [id], (err, folder) => {
    if (err)
      return res.json({
        isError: true,
        message: 'Error retrieving folder by ID: ' + err.message,
      });

    if (!folder)
      return res.json({ isError: true, message: 'Folder not found' });

    res.json({ isError: false, data: folder });
  });
});

// POST create folder
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name)
    return res.json({ isError: true, message: 'The name field is required' });

  db.run('INSERT INTO Folder (name) VALUES (?)', [name], function (err) {
    if (err)
      return res.json({
        isError: true,
        message: 'Error creating folder: ' + err.message,
      });

    res.json({ isError: false, data: { id: this.lastID, name } });
  });
});

// PUT update folder
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name)
    return res.json({ isError: true, message: 'The name field is required' });

  db.run('UPDATE Folder SET name = ? WHERE id = ?', [name, id], function (err) {
    if (err)
      return res.json({
        isError: true,
        message: 'Error updating folder: ' + err.message,
      });

    if (this.changes === 0)
      return res.json({
        isError: true,
        message: 'No folder updated. It may not exist or the name is the same.',
      });

    res.json({ isError: false, data: { id: Number(id), name } });
  });
});

// DELETE folder
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM Folder WHERE id = ?', [id], (err, folder) => {
    if (err)
      return res.json({
        isError: true,
        message: 'Error retrieving folder: ' + err.message,
      });

    if (!folder)
      return res.json({ isError: true, message: 'Folder not found' });

    db.get('SELECT 1 FROM RunData WHERE folderId = ?', [id], (err, inUse) => {
      if (err)
        return res.json({
          isError: true,
          message: 'Error checking folder usage: ' + err.message,
        });

      if (inUse)
        return res.json({
          isError: true,
          message: 'Folder is in use and cannot be deleted',
        });

      db.run('DELETE FROM Folder WHERE id = ?', [id], function (err) {
        if (err)
          return res.json({
            isError: true,
            message: 'Error deleting folder: ' + err.message,
          });

        res.json({ isError: false, data: folder });
      });
    });
  });
});
