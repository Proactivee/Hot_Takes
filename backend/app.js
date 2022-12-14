const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/user');
const sauceRoute= require('./routes/sauce')

mongoose.connect('mongodb+srv://Sassafr:WhiteTiger1.0@cluster0.ny8y7c5.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(express.json())   /*-------Parse Requete JSON-----*/


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/*--------------Route pour Authentification---------*/


app.use('/api/auth', userRoutes);
 
app.use('/api/sauces',sauceRoute)
      
app.use('/images', express.static(path.join(__dirname, 'images')));



module.exports = app;