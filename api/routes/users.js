const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const checkAuth = require('../middleware/check-auth');

const usersController = require('../controllers/users');

const saltRound = 10;

//SignUp PUB
router.post('/signup', usersController.signup);

//Delete Users AUTH
router.delete('/:userId',checkAuth ,usersController.delete_user);

//Get All Users AUTH
router.get('/',checkAuth, usersController.get_all_users);

//Get A User By ID AUTH
router.get('/:userId',checkAuth, usersController.get_a_user_by_id);

//SignIn PUB
router.post('/login', usersController.login);

module.exports = router;