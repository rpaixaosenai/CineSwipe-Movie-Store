const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    poster_url TEXT,
    owner_id INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    buyer_name TEXT NOT NULL,
    amount REAL NOT NULL,
    payment_method TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(movie_id) REFERENCES movies(id)
  );
`);

// Insert initial mock data if movies table is empty
const stmt = db.prepare('SELECT COUNT(*) AS count FROM movies');
const row = stmt.get();
if (row.count === 0) {
  const insertMovie = db.prepare(`
    INSERT INTO movies (title, description, price, poster_url) 
    VALUES (?, ?, ?, ?)
  `);
  
  insertMovie.run(
    'Dune: Part Two',
    'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    19.99,
    'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  );

  insertMovie.run(
    'Oppenheimer',
    'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    14.99,
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  );

  insertMovie.run(
    'Spider-Man: Across the Spider-Verse',
    'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    12.99,
    'https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  );

  insertMovie.run(
    'Blade Runner 2049',
    'Young Blade Runner K discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who has been missing for thirty years.',
    9.99,
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  );
}

module.exports = db;
