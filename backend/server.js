const express = require('express');
const cors = require('cors');
const Trie = require('./trie');
const app = express();

app.use(cors());
app.use(express.json());

const trie = new Trie();
// Initialize with sample words...

// API Endpoints
app.post('/insert', (req, res) => {
  trie.insert(req.body.word);
  res.json({ success: true });
});

app.get('/suggest', (req, res) => {
  const prefix = req.query.prefix;
  res.json(trie.getSuggestions(prefix));
});

app.listen(5500, () => console.log('Server running on port 5500'));