const express = require('express');
const next = require('next');

require('dotenv').config();
const {PORT} = process.env;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    server.get('/a', (req, res) => {
      return app.render(req, res, '/a');
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });
  
    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  });
