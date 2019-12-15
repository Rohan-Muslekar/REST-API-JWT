const express = require('express');
const Posts = require('../models/posts');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const mongoose = require('mongoose');
//get all posts PUB
router.get('/',(req,res,next) => {
    Posts.find({})
    .select("title authorId comments _id")
    .populate('authorId','_id author')
    .exec()
    .then(result => {
        console.log(result);
        if(result != []){
            res.status(201).json({
                count: result.length,
                posts: result.map(res => {
                    return {
                        title: res.title,
                        authorId: res.authorId,
                        _id: res._id,
                        request: {
                            type: 'GET',
                            url: "http://localhost:3000/posts/" + res._id
                        }
                    }
                })
            });
        }
        else{
            res.status(201).json({message: "The Collection Is Empty"});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//get a post by postID PUB
router.get('/:postsId', (req,res,next) => {
    
    Posts.findById(req.params.postsId)
    .select("title authorId comments _id")
    .exec()
    .then(result => {
        console.log(result);
        if(result){
            res.status(201).json(result);
        }
        else{
            res.status(404).json({message: "No Valid ID Found!"});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//create a post for a ID AUTH
router.post('/:authorId',checkAuth ,(req,res,next) => {
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
});

//update a post for a postid AUTH
router.patch('/:postsId',checkAuth ,(req,res,next) => {
    Posts.update({_id: req.params.postsId}, {$set: {title: req.body.title}})
    .exec()
    .then(result => {
        console.log(result);
        res.status(201).json({result: result})
    })
    .catch(err => {
        res.status(404).json({error: err})
    });
});

//delete a post by id AUTH
router.delete('/:postsId',checkAuth , (req,res,next) => {
    Posts.remove({_id: req.params.postsId})
    .exec()
    .then(result => {
        console.log(result);
        res.status(201).json({result: result});
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
});

//comment on a post by id AUTH
router.patch('/comment/:postsId',checkAuth, (req,res,next) => {
    Posts.update({_id: req.params.postsId}, {$push: {comments: req.body.comment}})
    .exec()
    .then(result => {
        console.log(result);
        res.status(201).json({result: result});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: error});
    });
});

// Get a post by author ID
router.get('/author/:authorId',checkAuth, (req,res,next) => {
Posts.find({authorId: req.params.authorId})
.exec()
.then(result => {
    console.log(result);
    if(result.length > 0)
    {
        res.status(201).json({posts: result});
    }
    else{
        res.status(201).json({message: `The Author Has No Posts Yet`,
        authorId: req.params.authorId}
        );
    }
})
.catch(err => {
    res.json(500).json({error: err});
});
});


module.exports = router;