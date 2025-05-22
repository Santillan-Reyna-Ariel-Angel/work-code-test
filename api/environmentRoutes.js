import express from 'express';
import { db } from '../database.js';

export const router = express.Router();

// GET all environments
router.get('/', (_, res) => {
  db.all('SELECT * FROM Environment', [], (err, rows) => {
    if (err)
      return res.json({
        isError: true,
        message: 'Error retrieving environments: ' + err.message,
      });
    res.json({ isError: false, data: rows });
  });
});

// GET environment by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM Environment WHERE id = ?', [id], (err, row) => {
    if (err)
      return res.json({
        isError: true,
        message: 'Error retrieving environment by ID: ' + err.message,
      });
    if (!row)
      return res.json({ isError: true, message: 'Environment not found' });
    res.json({ isError: false, data: row });
  });
});

// POST create environment
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name)
    return res.json({ isError: true, message: 'The name field is required' });

  db.run('INSERT INTO Environment (name) VALUES (?)', [name], function (err) {
    if (err)
      return res.json({
        isError: true,
        message: 'Error creating environment: ' + err.message,
      });
    res.json({ isError: false, data: { id: this.lastID, name } });
  });
});

// PUT update environment
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name)
    return res.json({ isError: true, message: 'The name field is required' });

  db.run(
    'UPDATE Environment SET name = ? WHERE id = ?',
    [name, id],
    function (err) {
      if (err)
        return res.json({
          isError: true,
          message: 'Error updating environment: ' + err.message,
        });
      if (this.changes === 0)
        return res.json({
          isError: true,
          message:
            'No environment updated. It may not exist or the name is the same.',
        });
      res.json({ isError: false, data: { id: Number(id), name } });
    },
  );
});

// DELETE environment
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM Environment WHERE id = ?', [id], (err, env) => {
    if (err)
      return res.json({
        isError: true,
        message: 'Error retrieving environment: ' + err.message,
      });
    if (!env)
      return res.json({ isError: true, message: 'Environment not found' });

    db.get(
      'SELECT 1 FROM RunData WHERE environmentId = ?',
      [id],
      (err, inUse) => {
        if (err)
          return res.json({
            isError: true,
            message: 'Error checking environment usage: ' + err.message,
          });
        if (inUse)
          return res.json({
            isError: true,
            message: 'Environment is in use and cannot be deleted',
          });

        db.run('DELETE FROM Environment WHERE id = ?', [id], function (err) {
          if (err)
            return res.json({
              isError: true,
              message: 'Error deleting environment: ' + err.message,
            });
          res.json({ isError: false, data: env });
        });
      },
    );
  });
});
