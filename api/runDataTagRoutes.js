import express from 'express';
import { db } from '../database.js';

export const router = express.Router();

// GET all RunDataTag entries
router.get('/', (_, res) => {
  db.all('SELECT * FROM RunDataTag', [], (err, rows) => {
    if (err)
      return res.json({
        isError: true,
        message: 'Error retrieving RunDataTag data: ' + err.message,
      });

    res.json({ isError: false, data: rows });
  });
});

// GET tags by RunData ID
router.get('/rundata/:runDataId', (req, res) => {
  const { runDataId } = req.params;

  db.all(
    `SELECT Tag.* FROM Tag
     JOIN RunDataTag ON Tag.id = RunDataTag.tagId
     WHERE RunDataTag.runDataId = ?`,
    [runDataId],
    (err, tags) => {
      if (err)
        return res.json({
          isError: true,
          message: 'Error retrieving tags for RunData: ' + err.message,
        });

      res.json({ isError: false, data: tags });
    },
  );
});

// POST create a RunDataTag association
router.post('/', (req, res) => {
  const { runDataId, tagId } = req.body;

  if (!runDataId || !tagId)
    return res.json({
      isError: true,
      message: 'Both runDataId and tagId are required',
    });

  db.run(
    'INSERT INTO RunDataTag (runDataId, tagId) VALUES (?, ?)',
    [runDataId, tagId],
    function (err) {
      if (err)
        return res.json({
          isError: true,
          message: 'Error creating association: ' + err.message,
        });

      res.json({
        isError: false,
        data: { id: this.lastID, runDataId, tagId },
      });
    },
  );
});

// DELETE specific RunDataTag association
router.delete('/', (req, res) => {
  const { runDataId, tagId } = req.body;

  if (!runDataId || !tagId)
    return res.json({
      isError: true,
      message: 'Both runDataId and tagId are required for deletion',
    });

  db.run(
    'DELETE FROM RunDataTag WHERE runDataId = ? AND tagId = ?',
    [runDataId, tagId],
    function (err) {
      if (err)
        return res.json({
          isError: true,
          message: 'Error deleting association: ' + err.message,
        });

      if (this.changes === 0)
        return res.json({
          isError: true,
          message: 'Association not found',
        });

      res.json({
        isError: false,
        data: { runDataId, tagId },
      });
    },
  );
});
