import express from 'express';
import { router as tagRouter } from './api/tagRoutes.js';
import { router as environmentRouter } from './api/environmentRoutes.js';
import { router as testDataFileRouter } from './api/testDataFileRoutes.js';
import { router as folderRouter } from './api/folderRoutes.js';
import { router as runDataRouter } from './api/runDataRoutes.js';
import { router as runDataTagRouter } from './api/runDataTagRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/tag', tagRouter);
app.use('/environment', environmentRouter);
app.use('/testDataFile', testDataFileRouter);
app.use('/folder', folderRouter);
app.use('/runData', runDataRouter);
app.use('/runDataTag', runDataTagRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
