const mongoose = require('mongoose');

const postsSchema = mongoose.Schema(
    {
        _id:  mongoose.Schema.Types.ObjectId,
        title: {type: String,
                default: ''
                },
        author: {type: String,
                required: true
                },
        comments: [
            {
                type: String,
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