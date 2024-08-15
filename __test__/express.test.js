const express = require('../src/base/node/mini-express');
const { resolve } = require("path")

const app = express()

app.get('/', (req, res) => {
  const params = req.params;
  res.html(resolve(__dirname, 'index.html'), params)
})

app.post('/list', (req, res) => {
  const body = req.body;
  res.json(body)
})

app.listen(8000, () => console.log ('The server running 8000'))