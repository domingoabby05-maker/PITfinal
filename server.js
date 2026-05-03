const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// ✅ PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'finalpit2',
  password: 'domingo',
  port: 5432,
});

// ✅ GET all patients
app.get('/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching patients');
  }
});

// ✅ ADD patient
app.post('/patients', async (req, res) => {
  const { first_name, last_name, address, phone } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO patients(first_name,last_name,address,phone,date_registered)
       VALUES($1,$2,$3,$4,NOW()) RETURNING *`,
      [first_name, last_name, address, phone]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting patient');
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});