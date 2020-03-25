const express = require('express');
const OngController = require('./controllers/OngController');
const IncidentController = require('./controllers/IncidentController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');


const routes = express.Router();

// Rota para login
routes.post('/sessions', SessionController.create);

// Rotas das ongs
routes.get('/ongs', OngController.index);
routes.post('/ongs', OngController.create);

// Casos especificos da ong
routes.get('/profile', ProfileController.index);

// Rotas dos casos
routes.get('/incidents', IncidentController.index);
routes.post('/incidents', IncidentController.create);
routes.delete('/incidents/:id', IncidentController.delete);


module.exports = routes;