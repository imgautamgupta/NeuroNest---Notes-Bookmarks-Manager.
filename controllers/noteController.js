const Note = require('../models/Note');
const { generateSummary, generateTags } = require('../services/aiService');

// @desc    Get all notes
// @route   GET /api/notes
const getNotes = async (req, res) => {
    const { q, tags, favorite, archived, page = 1, limit = 20 } = req.query;

    let query = { userId: req.user._id };

    if (q) {
        // Use regex for partial matching since text index might not be set up
        query.$or = [
            { title: { $regex: q, $options: 'i' } },
            { content: { $regex: q, $options: 'i' } }
        ];
    }

    if (tags) {
        query.tags = { $in: tags.split(',') };
    }

    if (favorite === 'true') {
        query.isFavorite = true;
    }

    if (archived === 'true') {
        query.isArchived = true;
    } else {
        query.isArchived = { $ne: true };
    }

    try {
        const notes = await Note.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Note.countDocuments(query);

        res.json({
            notes,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Get Notes Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a note
// @route   POST /api/notes
const createNote = async (req, res) => {
    const { title, content, tags, aiSummary, aiTags } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
        let finalTags = tags || [];
        let summary = '';

        if (aiTags && content) {
            try {
                const suggestedTags = await generateTags(content);
                finalTags = [...new Set([...finalTags, ...suggestedTags])];
            } catch (aiError) {
                console.error('AI Tags Error:', aiError);
            }
        }

        if (aiSummary && content) {
            try {
                summary = await generateSummary(content);
            } catch (aiError) {
                console.error('AI Summary Error:', aiError);
            }
        }

        const note = await Note.create({
            userId: req.user._id,
            title,
            content,
            tags: finalTags,
            summary
        });

        console.log('Note created:', note._id);
        res.status(201).json(note);
    } catch (error) {
        console.error('Create Note Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
const updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedNote);
    } catch (error) {
        console.error('Update Note Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await note.deleteOne();
        res.json({ message: 'Note removed' });
    } catch (error) {
        console.error('Delete Note Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote
};
