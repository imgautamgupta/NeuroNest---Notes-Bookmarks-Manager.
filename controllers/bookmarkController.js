const Bookmark = require('../models/Bookmark');
const { getMetadata } = require('../services/scraperService');

// @desc    Get all bookmarks
// @route   GET /api/bookmarks
const getBookmarks = async (req, res) => {
    const { q, tags, favorite, page = 1, limit = 20 } = req.query;

    let query = { userId: req.user._id };

    if (q) {
        // Use regex for partial matching
        query.$or = [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { url: { $regex: q, $options: 'i' } }
        ];
    }

    if (tags) {
        query.tags = { $in: tags.split(',') };
    }

    if (favorite === 'true') {
        query.isFavorite = true;
    }

    try {
        const bookmarks = await Bookmark.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Bookmark.countDocuments(query);

        res.json({
            bookmarks,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Get Bookmarks Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a bookmark
// @route   POST /api/bookmarks
const createBookmark = async (req, res) => {
    const { url, tags } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        let metadata = { title: '', description: '', favicon: '', image: '' };

        try {
            metadata = await getMetadata(url);
        } catch (scrapeError) {
            console.error('Scraper Error:', scrapeError.message);
            // Continue with empty metadata
        }

        const bookmark = await Bookmark.create({
            userId: req.user._id,
            url,
            tags: tags || [],
            title: metadata.title || url,
            description: metadata.description || '',
            favicon: metadata.favicon || '',
            image: metadata.image || ''
        });

        console.log('Bookmark created:', bookmark._id);
        res.status(201).json(bookmark);
    } catch (error) {
        console.error('Create Bookmark Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a bookmark
// @route   PUT /api/bookmarks/:id
const updateBookmark = async (req, res) => {
    try {
        const bookmark = await Bookmark.findById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        if (bookmark.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedBookmark = await Bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBookmark);
    } catch (error) {
        console.error('Update Bookmark Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a bookmark
// @route   DELETE /api/bookmarks/:id
const deleteBookmark = async (req, res) => {
    try {
        const bookmark = await Bookmark.findById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        if (bookmark.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await bookmark.deleteOne();
        res.json({ message: 'Bookmark removed' });
    } catch (error) {
        console.error('Delete Bookmark Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBookmarks,
    createBookmark,
    updateBookmark,
    deleteBookmark
};
