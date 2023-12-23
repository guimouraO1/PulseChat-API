const express = require('express');
const router = express.Router();

const userController = require('./controllers/UserController');
const UserController = require('./controllers/UserController');

router.get('/users', userController.findAll);
router.get('/user/:id', userController.findOne);
router.post('/user', UserController.register);
router.put('/user/:id', UserController.update); 
router.delete('/user/:id', UserController.delete); 


module.exports = router;