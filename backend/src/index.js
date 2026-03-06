import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import inscriptionRouter from './routes/inscription.js';
import adminRouter from './routes/admin.js';
import chatRouter from './routes/chat.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PATCH'],
}));

app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.use('/api', inscriptionRouter);
app.use('/api', adminRouter);
app.use('/api', chatRouter);

// Serve frontend static files
const publicDir = join(__dirname, '..', 'public');
app.use(express.static(publicDir));
app.get('*', (_, res) => {
  res.sendFile(join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
