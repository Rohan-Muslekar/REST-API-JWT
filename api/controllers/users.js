const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const checkAuth = require('../middleware/check-auth');
const saltRound = 10;

exports.signup = (req,res,next) => {
    Users.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1)
        {
            res.status(409).json({message: "Email ID exists"});
        }
        else{
            bcrypt.hash(req.body.password, saltRound, (err, hash) => {
                if(err){
                    res.status(500).json({error: err});
                }
                else{
                    const user = new Users({
                        _id: new mongoose.Types.ObjectId(),
                        author: req.body.author,
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({results: result});
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err});
                    });
                }
            });
        }
    });
};

exports.delete_user = (req,res,next) => {
    Users.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        console.log(result);
        res.status(201).json({result: result});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
};

exports.get_all_users = (req,res,next) => {
    Users.find({})
    .exec()
    .then(users => {
        if(users != [])
        {
            res.status(201).json({users: users});
        }
        else{
            res.status(201).json({message: "No Users Exists!"});
        }
    })
    .catch(err => {
        if(err)
            res.status(500).json({error: err});
    });
};

exports.get_a_user_by_id = (req,res,next) => {
    Users.find({_id: req.params.userId})
    .exec()
    .then(user => {
        if(user)
        {
            console.log(user);
            res.status(201).json({user: user});
        }
        else{
            res.status(201).json({message: "User Not Found"});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
};

exports.login = (req, res, next) => {
    Users.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1)
        {
            return res.status(401).json({message: "Authentication Failed!"});
        }
        else{
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err){
                    return res.status(401).json({message: "Authentication Failed!", error: err});
                }
                if(result){
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {expiresIn: '1h'}
                    );
                    console.log(token);
                    console.log(result);
                    return res.status(201).cookie('token', token, {
                        expires: new Date(Date.now() + '1h'),
                        secure: false, // set to true if your using https
                        httpOnly: true,
                      }).json({message: "Authentication Successfull", token: token});
                }
                res.status(401).json({message: "Authentication Failed!"});
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });

};
