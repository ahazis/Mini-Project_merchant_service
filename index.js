const mysql = require('mysql2');
const bodyParser = require('body-parser');
const express = require('express');
const auth = require('basic-auth');
const app = express();

// membuat koneksi pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'merchant_service'
});

// menguji koneksi
pool.getConnection((err, conn) => {
  if (err) throw err;
  console.log('Terhubung ke MySQL');
  conn.release();
});

// parse aplikasi/json
app.use(bodyParser.json());

// menjalankan server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

// mendapatkan semua produk pada merchant tertentu
app.get('/merchant/:id/products', (req, res) => {
    const user = auth(req);
    if (!user || user.name !== 'dibimbing' || user.pass !== 'pass') {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        res.status(401).send('Unauthorized Access');
        return;
    }
    let id = req.params.id;
    if (!id) {
      return res.status(400).send({ error:true, message: 'Silakan masukkan id merchant' });
    }
    pool.getConnection((err, conn) => {
      if (err) throw err;
      conn.query('SELECT * FROM products WHERE merchant_id = ?', [id], (err, results) => {
        if (err) throw err;
        res.send({ error:false, data: results, message: 'Berikut adalah semua produk dari merchant dengan id ' + id });
        conn.release();
      });
    });
  });
  

// membuat merchant
app.post('/merchant', (req, res) => {
    const user = auth(req);
    if (!user || user.name !== 'dibimbing' || user.pass !== 'pass') {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        res.status(401).send('Unauthorized Access');
        return;
}
    let merchant = req.body;
    if (!merchant) {
      return res.status(400).send({ error:true, message: 'Silakan masukkan data merchant' });
    }
    pool.getConnection((err, conn) => {
      if (err) throw err;
      conn.query('INSERT INTO merchants SET ?', merchant, (err, results) => {
        if (err) throw err;
        res.send({ error:false, data: results, message: 'Merchant berhasil dibuat' });
        conn.release();
      });
    });
  });
  
  // menghapus merchant
  app.delete('/merchant/:id', (req, res) => {
    const user = auth(req);
    if (!user || user.name !== 'dibimbing' || user.pass !== 'pass') {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        res.status(401).send('Unauthorized Access');
        return;
    }
    let id = req.params.id;
    if (!id) {
      return res.status(400).send({ error:true, message: 'Silakan masukkan id merchant' });
    }
    pool.getConnection((err, conn) => {
      if (err) throw err;
      conn.query('DELETE FROM merchants WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.send({ error:false, data: results, message: 'Merchant berhasil dihapus' });
        conn.release();
      });
    });
  });
  
  // menambahkan produk
  app.post('/merchant/:id/product', (req, res) => {
    const user = auth(req);
    if (!user || user.name !== 'dibimbing' || user.pass !== 'pass') {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        res.status(401).send('Unauthorized Access');
        return;
    }
    let id = req.params.id;
    let product = req.body;
    if (!id || !product) {
      return res.status(400).send({ error:true, message: 'Silakan masukkan id merchant dan data produk' });
    }
    product.merchant_id = id;
    pool.getConnection((err, conn) => {
      if (err) throw err;
      conn.query('INSERT INTO products SET ?', product, (err, results) => {
        if (err) throw err;
        res.send({ error:false, data: results, message: 'Produk berhasil ditambahkan' });
        conn.release();
      });
    });
  });
  
  // menghapus produk
  app.delete('/product/:id', (req, res) => {
    const user = auth(req);
    if (!user || user.name !== 'dibimbing' || user.pass !== 'pass') {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        res.status(401).send('Unauthorized Access');
        return;
    }
    let id = req.params.id;
    if (!id) {
      return res.status(400).send({ error:true, message: 'Silakan masukkan id produk' });
    }
    pool.getConnection((err, conn) => {
      if (err) throw err;
      conn.query('DELETE FROM products WHERE id = ?', [id],(err, results) => {
        if (err) throw err;
        res.send({ error:false, data: results, message: 'Produk berhasil dihapus' });
        conn.release();
        });
        });
        });
        

// mengubah produk
app.put('/product/:id', (req, res) => {
    const user = auth(req);
    if (!user || user.name !== 'dibimbing' || user.pass !== 'pass') {
        res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
        res.status(401).send('Unauthorized Access');
        return;
    }
    const id = req.params.id;
    const { name, price } = req.body;
    if (!id || (!name && !price)) {
      return res.status(400).send({ error:true, message: 'Silakan masukkan id produk dan data produk yang ingin diubah' });
    }
    pool.getConnection((err, conn) => {
      if (err) throw err;
      conn.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
          res.status(404).send('Produk tidak ditemukan');
        } else {
          const product = results[0];
          const updatedProduct = {
            id,
            name: name || product.name,
            price: price || product.price,
            merchant_id: product.merchant_id
          };
          conn.query('UPDATE products SET name = ?, price = ? WHERE id = ?', [updatedProduct.name, updatedProduct.price, id], (err, results) => {
            if (err) throw err;
            res.send({ error:false, data: updatedProduct, message: 'Produk berhasil diubah' });
            conn.release();
          });
        }
      });
    });
  });
  
// app.put('/product/:id', (req, res) => {
//     const id = req.params.id;
//     const { name, price } = req.body;
//     const productIndex = products.findIndex(product => product.id === id);
    
//     if (productIndex === -1) {
//       res.status(404).send('Product not found');
//     } else {
//       const updatedProduct = {
//         id,
//         name: name || products[productIndex].name,
//         price: price || products[productIndex].price
//       };
//       products[productIndex] = updatedProduct;
//       res.send(updatedProduct);
//     }
//   });
  
