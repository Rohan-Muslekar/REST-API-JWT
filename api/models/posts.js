const mongoose = require('mongoose');

const postsSchema = mongoose.Schema(
    {
        _id:  mongoose.Schema.Types.ObjectId,
        title: {type: String,
                default: ''
                },
        authorId: {type: mongoose.Schema.Types.ObjectId,
                ref : 'Users',
                default: mongoose.Schema.Types.ObjectId
                },
        comments: [
            {
                body: String,
                date: {
                    type: Date,
                    default: Date.now
                },
                default: ''
            }
        ]
    }
);

module.exports = mongoose.model('Posts', postsSchema);