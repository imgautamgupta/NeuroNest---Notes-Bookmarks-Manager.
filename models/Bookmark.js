const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url: {
        type: String,
        required: [true, 'Please provide a URL'],
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    favicon: {
        type: String
    },
    image: {
        type: String
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Full-text search index
bookmarkSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
