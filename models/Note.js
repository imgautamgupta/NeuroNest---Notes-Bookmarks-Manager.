const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Please provide content']
    },
    tags: [{
        type: String,
        trim: true
    }],
    isFavorite: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    summary: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Full-text search index
noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Note', noteSchema);
