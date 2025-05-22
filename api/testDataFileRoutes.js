import express from 'express';
import { db } from '../database.js';

export const router = express.Router();

// GET all test data files
router.get('/', (_, res) => {
  db.all('SELECT * FROM TestDataFile', [], (err, rows) =>
    err
      ? res.json({
          isError: true,
          message: 'Error retrieving test data files: ' + err.message,
        })
      : res.json({ isError: false, data: rows }),
  );
});

// GET test data file by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM TestDataFile WHERE id = ?', [id], (err, row) => {
    if (err)
      return res.json({
        isError: true,
        message: 'Error retrieving test data file by ID: ' + err.message,
      });
    if (!row)
      return res.json({ isError: true, message: 'Test data file not found' });
    res.json({ isError: false, data: row });
  });
});

// POST create test data file
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name)
    return res.json({ isError: true, message: 'The name field is required' });

  db.run('INSERT INTO TestDataFile (name) VALUES (?)', [name], function (err) {
    if (err)
      return res.json({
        isError: true,
        message: 'Error creating test data file: ' + err.message,
      });
    res.json({ isError: false, data: { id: this.lastID, name } });
  });
});

// PUT update test data file
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name)
    return res.json({ isError: true, message: 'The name field is required' });

  db.run(
    'UPDATE TestDataFile SET name = ? WHERE id = ?',
    [name, id],
    function (err) {
      if (err)
        return res.json({
          isError: true,
          message: 'Error updating test data file: ' + err.message,
        });
      if (this.changes === 0)
        return res.json({
          isError: true,
          message:
            'No test data file updated. It may not exist or the name is the same.',
        });
      res.json({ isError: false, data: { id: Number(id), name } });
    },
  );
});

// DELETE test data file
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM TestDataFile WHERE id = ?', [id], (err, file) => {
    if (err)
      return res.json({
        isError: true,
        message: 'Error retrieving test data file: ' + err.message,
      });
    if (!file)
      return res.json({ isError: true, message: 'Test data file not found' });

    db.get(
      'SELECT 1 FROM RunData WHERE testDataFileId = ?',
      [id],
      (err, inUse) => {
        if (err)
          return res.json({
            isError: true,
            message: 'Error checking test data file usage: ' + err.message,
          });
        if (inUse)
          return res.json({
            isError: true,
            message: 'Test data file is in use and cannot be deleted',
          });

        db.run('DELETE FROM TestDataFile WHERE id = ?', [id], function (err) {
          if (err)
            return res.json({
              isError: true,
              message: 'Error deleting test data file: ' + err.message,
            });
          res.json({ isError: false, data: file });
        });
      },
    );
  });
});
