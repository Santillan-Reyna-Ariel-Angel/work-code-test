import express from 'express';
import { db } from '../database.js';

export const router = express.Router();

// GET all RunData
router.get('/', (_, res) => {
  db.all('SELECT * FROM RunData', [], (err, rows) => {
    if (err)
      return res.json({
        isError: true,
        message: 'Error retrieving RunData: ' + err.message,
      });

    res.json({ isError: false, data: rows });
  });
});

// GET RunData by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM RunData WHERE id = ?', [id], (err, runData) => {
    if (err)
      return res.json({
        isError: true,
        message: 'Error retrieving RunData by ID: ' + err.message,
      });

    if (!runData)
      return res.json({ isError: true, message: 'RunData not found' });

    // Fetch associated tags
    db.all(
      `SELECT Tag.* FROM Tag 
       JOIN RunDataTag ON Tag.id = RunDataTag.tagId 
       WHERE RunDataTag.runDataId = ?`,
      [id],
      (err, tags) => {
        if (err)
          return res.json({
            isError: true,
            message: 'Error retrieving tags: ' + err.message,
          });

        res.json({ isError: false, data: { ...runData, tags } });
      },
    );
  });
});

// POST create RunData
router.post('/', (req, res) => {
  const { collectionPath, environmentId, testDataFileId, folderId, tagIds } =
    req.body;

  if (!collectionPath)
    return res.json({
      isError: true,
      message: 'The collectionPath field is required',
    });

  const query = `
    INSERT INTO RunData (collectionPath, environmentId, testDataFileId, folderId)
    VALUES (?, ?, ?, ?)`;

  db.run(
    query,
    [collectionPath, environmentId, testDataFileId, folderId],
    function (err) {
      if (err)
        return res.json({
          isError: true,
          message: 'Error creating RunData: ' + err.message,
        });

      const runDataId = this.lastID;

      // Insert into RunDataTag if tagIds are provided
      if (Array.isArray(tagIds) && tagIds.length > 0) {
        const stmt = db.prepare(
          'INSERT INTO RunDataTag (runDataId, tagId) VALUES (?, ?)',
        );
        tagIds.forEach((tagId) => stmt.run(runDataId, tagId));
        stmt.finalize();
      }

      res.json({
        isError: false,
        data: {
          id: runDataId,
          collectionPath,
          environmentId,
          testDataFileId,
          folderId,
          tagIds: tagIds || [],
        },
      });
    },
  );
});

// PUT update RunData
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { collectionPath, environmentId, testDataFileId, folderId, tagIds } =
    req.body;

  if (!collectionPath)
    return res.json({
      isError: true,
      message: 'The collectionPath field is required',
    });

  const query = `
    UPDATE RunData 
    SET collectionPath = ?, environmentId = ?, testDataFileId = ?, folderId = ?
    WHERE id = ?`;

  db.run(
    query,
    [collectionPath, environmentId, testDataFileId, folderId, id],
    function (err) {
      if (err)
        return res.json({
          isError: true,
          message: 'Error updating RunData: ' + err.message,
        });

      if (this.changes === 0)
        return res.json({
          isError: true,
          message: 'RunData not found or no changes made',
        });

      // Update tags if provided
      if (Array.isArray(tagIds)) {
        db.run('DELETE FROM RunDataTag WHERE runDataId = ?', [id], (err) => {
          if (err)
            return res.json({
              isError: true,
              message: 'Error removing old tags: ' + err.message,
            });

          const stmt = db.prepare(
            'INSERT INTO RunDataTag (runDataId, tagId) VALUES (?, ?)',
          );
          tagIds.forEach((tagId) => stmt.run(id, tagId));
          stmt.finalize();

          res.json({
            isError: false,
            data: {
              id: Number(id),
              collectionPath,
              environmentId,
              testDataFileId,
              folderId,
              tagIds,
            },
          });
        });
      } else {
        res.json({
          isError: false,
          data: {
            id: Number(id),
            collectionPath,
            environmentId,
            testDataFileId,
            folderId,
          },
        });
      }
    },
  );
});

// DELETE RunData
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM RunData WHERE id = ?', [id], (err, runData) => {
    if (err)
      return res.json({
        isError: true,
        message: 'Error retrieving RunData: ' + err.message,
      });

    if (!runData)
      return res.json({ isError: true, message: 'RunData not found' });

    db.run('DELETE FROM RunDataTag WHERE runDataId = ?', [id], (err) => {
      if (err)
        return res.json({
          isError: true,
          message: 'Error removing tags: ' + err.message,
        });

      db.run('DELETE FROM RunData WHERE id = ?', [id], (err) => {
        if (err)
          return res.json({
            isError: true,
            message: 'Error deleting RunData: ' + err.message,
          });

        res.json({ isError: false, data: runData });
      });
    });
  });
});
