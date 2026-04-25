const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/movies', (req, res) => {
  try {
    const movies = db.prepare('SELECT * FROM movies').all();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/movies/:id', (req, res) => {
  try {
    const movie = db.prepare('SELECT * FROM movies WHERE id = ?').get(req.params.id);
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/movies', (req, res) => {
  try {
    const { title, description, price, poster_url } = req.body;
    const stmt = db.prepare('INSERT INTO movies (title, description, price, poster_url) VALUES (?, ?, ?, ?)');
    const info = stmt.run(title, description, price, poster_url);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/checkout', (req, res) => {
  try {
    const { movie_id, buyer_name, amount, payment_method } = req.body;
    const stmt = db.prepare('INSERT INTO transactions (movie_id, buyer_name, amount, payment_method) VALUES (?, ?, ?, ?)');
    const info = stmt.run(movie_id, buyer_name, amount, payment_method);
    res.status(201).json({ id: info.lastInsertRowid, status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a movie
app.delete('/api/movies/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM movies WHERE id = ?').run(id);
    res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
