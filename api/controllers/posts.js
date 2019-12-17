const express = require('express');
const Posts = require('../models/posts');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const mongoose = require('mongoose');

exports.get_all_posts = (req,res,next) => {
    Posts.find({})
    .select("title authorId comments _id")
    .populate('authorId','_id author')
    .exec()
    .then(result => {
        console.log(result);
        if(result != []){
            res.status(201).json({results: result});
        }
        else{
            res.status(201).json({message: "The Collection Is Empty"});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
};

exports.get_post_by_id = (req,res,next) => {
    
    Posts.findById(req.params.postsId)
    .select("title authorId comments _id")
    .exec()
    .then(result => {
        console.log(result);
        if(result){
            res.status(201).json({results: result});
        }
        else{
            res.status(404).json({message: "No Valid ID Found!"});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
};

exports.create_a_post_by_id = (req,res,next) => {
    const post = new Posts({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        authorId: req.params.authorId
    });

    post.save()
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });
    res.status(201).json({
        message: 'POST for creating a post',
        post: `Post recieved: ${post}`
    });
};

exports.update_a_post = (req,res,next) => {
    Posts.update({_id: req.params.postsId}, {$set: {title: req.body.title}})
    .exec()
    .then(result => {
        console.log(result);
        res.status(201).json({result: result})
    })
    .catch(err => {
        res.status(404).json({error: err})
    });
};

exports.delete_a_post = (req,res,next) => {
    Posts.remove({_id: req.params.postsId})
    .exec()
    .then(result => {
        console.log(result);
        res.status(201).json({result: result});
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
};

exports.comment = (req,res,next) => {
    Posts.update({_id: req.params.postsId}, {$push: {comments: {body: req.body.comment}}})
    .exec()
    .then(result => {
        console.log(result);
        res.status(201).json({result: result});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: error});
    });
};

exports.get_all_posts_by_authid = (req,res,next) => {
    Posts.find({authorId: req.params.authorId})
    .exec()
    .then(result => {
        console.log(result);
        if(result.length > 0)
        {
            res.status(201).json({results: result});
        }
        else{
            res.status(201).json({message: `The Author Has No Posts Yet`,
            authorId: req.params.authorId});
        }
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
    };