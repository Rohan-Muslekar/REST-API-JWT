const express = require('express');
const Posts = require('../models/posts');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const mongoose = require('mongoose');

const postsController = require('../controllers/posts');
//get all posts PUB
router.get('/',postsController.get_all_posts);

//get a post by postID PUB
router.get('/:postsId', postsController.get_post_by_id);

//create a post for a ID AUTH
router.post('/:authorId',checkAuth ,postsController.create_a_post_by_id);

//update a post for a postid AUTH
router.patch('/:postsId',checkAuth ,postsController.update_a_post);

//delete a post by id AUTH
router.delete('/:postsId',checkAuth , postsController.delete_a_post);

//comment on a post by id AUTH
router.patch('/comment/:postsId',checkAuth, postsController.comment);

// Get all post by author ID
router.get('/author/:authorId',checkAuth, postsController.get_all_posts_by_authid);


module.exports = router;