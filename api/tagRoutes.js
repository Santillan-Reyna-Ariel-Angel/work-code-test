import express from 'express';
import { db } from '../database.js';

export const router = express.Router();

// GET all tags
router.get('/', (_, res) => {
  db.all('SELECT * FROM Tag', [], (err, rows) => {
    if (err)
      return res.json({
        isError: true,
        message: 'Error retrieving tags: ' + err.message,
      });

    res.json({ isError: false, data: rows });
  });
});

// GET tag by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM Tag WHERE id = ?', [id], (err, row) => {
    if (err)
      return res.json({
        isError: true,
        message: 'Error retrieving tag by ID: ' + err.message,
      });

    if (!row) return res.json({ isError: true, message: 'Tag not found' });

    res.json({ isError: false, data: row });
  });
});

// POST create tag
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name)
    return res.json({ isError: true, message: 'The name field is required' });

  db.run('INSERT INTO Tag (name) VALUES (?)', [name], function (err) {
    if (err)
      return res.json({
        isError: true,
        message: 'Error creating tag: ' + err.message,
      });

    res.json({ isError: false, data: { id: this.lastID, name } });
  });
});

// PUT update tag
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name)
    return res.json({ isError: true, message: 'The name field is required' });

  db.run('UPDATE Tag SET name = ? WHERE id = ?', [name, id], function (err) {
    if (err)
      return res.json({
        isError: true,
        message: 'Error updating tag: ' + err.message,
      });

    if (this.changes === 0)
      return res.json({
        isError: true,
        message: 'No tag updated. It may not exist or the name is the same.',
      });

    res.json({ isError: false, data: { id: Number(id), name } });
  });
});

// DELETE tag
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM Tag WHERE id = ?', [id], (err, tag) => {
    if (err)
      return res.json({
        isError: true,
        message: 'Error retrieving tag: ' + err.message,
      });

    if (!tag) return res.json({ isError: true, message: 'Tag not found' });

    db.get('SELECT 1 FROM RunDataTag WHERE tagId = ?', [id], (err, inUse) => {
      if (err)
        return res.json({
          isError: true,
          message: 'Error checking tag usage: ' + err.message,
        });

      if (inUse)
        return res.json({
          isError: true,
          message: 'Tag is in use and cannot be deleted',
        });

      db.run('DELETE FROM Tag WHERE id = ?', [id], function (err) {
        if (err)
          return res.json({
            isError: true,
            message: 'Error deleting tag: ' + err.message,
          });

        res.json({ isError: false, data: tag });
      });
    });
  });
});
