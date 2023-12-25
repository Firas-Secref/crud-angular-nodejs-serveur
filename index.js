const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const uri = 'mongodb://127.0.0.1:27017/db';
const Product = require('./product');
const User = require('./user');

const corsOpts = {
  origin: '*',

  methods: ['GET', 'POST', 'DELETE', 'PUT'],

  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOpts));

app.listen(8085, () => {
  console.log('server started');
});

app.use(express.json());

mongoose.connect(uri, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log('mongo data base connected');
  }
});
// products api
app.post('/newProduct', (req, res) => {
  let product = new Product(req.body);
  product.save((error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      res.status(200).send(req.body);
      console.log(req.body);
    }
  });
});

app.get('/products', (req, res) => {
  Product.find((error, result) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(result);
    }
  });
});

app.get('/products/:productId', (req, res) => {
  const id = req.params.productId;
  Product.findById(id, (error, result) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(result);
    }
  });
});

app.delete('/products/:productId', (req, res) => {
  const id = req.params.productId;
  Product.remove({ _id: id }, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      res.send(result);
    }
  });
});

app.put('/products/:productId', (req, res) => {
  const id = req.params.productId;
  Product.update({ _id: id }, { $set: { name: req.body.name, description: req.body.description } }, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      res.send(result);
    }
  });
});

app.post('/register', (req, res) => {
  let user = new User(req.body);
  user.save((error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      res.status(200).send(req.body);
      console.log(req.body);
    }
  });
});

app.post('/login', (req, res) => {
  User.find({ username: req.body.username }, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      if (result[0].password == req.body.password) {
        console.log(result.password === req.body.password);
        res.status(200).send({ loggedIn: true });
        console.log('logged in');
      } else res.status(200).send({ loggedIn: false });
    }
  });
});
