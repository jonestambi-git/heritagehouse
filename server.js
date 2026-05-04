const path = require('path');
const Module = require('module');
const express = require('express');
const next = require('next');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

process.env.NODE_PATH = [
  path.join(__dirname, 'node_modules'),
  process.env.NODE_PATH,
].filter(Boolean).join(path.delimiter);
Module._initPaths();

dotenv.config({ path: path.join(__dirname, '.env.local') });
dotenv.config();

const apiRoutes = require('../church-api/routes');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = Number(process.env.PORT || 3000);
const app = next({ dev, dir: __dirname, hostname, port });
const handle = app.getRequestHandler();

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('MONGODB_URI is not set. API database routes will fail until it is configured.');
    return;
  }

  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || 'ag2choba',
  });
  console.log('MongoDB connected');
}

app.prepare().then(async () => {
  await connectDatabase();

  const server = express();

  server.use(cors());
  server.use(express.json({ limit: '5mb' }));
  server.use(express.urlencoded({ extended: true }));

  server.use('/api', apiRoutes);

  server.use((req, res) => handle(req, res));

  server.listen(port, hostname, () => {
    console.log(`Single server ready at http://${hostname}:${port}`);
    console.log(`API mounted at http://${hostname}:${port}/api`);
  });
});
