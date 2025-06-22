const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: 'root',
  password: 'root',
  database: 'store'
});

app.get('/api/products', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM products');
    res.json(results);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (results.length === 0) return res.status(404).send({ message: 'Not found' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/api/products/:id/variants', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query(
      'SELECT id, size, color, price FROM product_variants WHERE product_id = ?',
      [id]
    );
    res.json(results);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/orders', async (req, res) => {
  const { product_id, variant_id, name, email, phone } = req.body;
  if (!product_id || !variant_id || !name || !email || !phone) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO orders (product_id, variant_id, name, email, phone, status) VALUES (?, ?, ?, ?, ?, ?)',
      [product_id, variant_id, name, email, phone, 'pending']
    );
    res.json({ success: true, orderId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err });
  }
});

app.get('/api/orders', async (req, res) => {
  const [rows] = await db.query('SELECT id, status FROM orders ORDER BY id DESC');
  res.json(rows);
});

app.get('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query(`
    SELECT o.id, o.status, o.name, o.email, o.phone,
           p.name AS product_name, p.description, p.image_url,
           v.size, v.color, v.price
    FROM orders o
    JOIN products p ON o.product_id = p.id
    JOIN product_variants v ON o.variant_id = v.id
    WHERE o.id = ?
  `, [id]);

  if (!rows.length) return res.status(404).json({ message: 'Order not found' });

  const row = rows[0];
  res.json({
    id: row.id,
    status: row.status,
    name: row.name,
    email: row.email,
    phone: row.phone,
    product: {
      name: row.product_name,
      description: row.description,
      image_url: row.image_url,
    },
    variant: {
      size: row.size,
      color: row.color,
      price: row.price,
    }
  });
});

app.listen(4000, () => {
  console.log('API Server running on http://localhost:4000');
});