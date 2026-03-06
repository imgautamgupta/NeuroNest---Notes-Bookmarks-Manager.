const Note = require('../models/Note');
const Bookmark = require('../models/Bookmark');

// @desc    Get dashboard analytics
// @route   GET /api/analytics
const getAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;

        const totalNotes = await Note.countDocuments({ userId });
        const totalBookmarks = await Bookmark.countDocuments({ userId });
        const favoriteNotes = await Note.countDocuments({ userId, isFavorite: true });
        const favoriteBookmarks = await Bookmark.countDocuments({ userId, isFavorite: true });
        const archivedNotes = await Note.countDocuments({ userId, isArchived: true });

        // Get tag distribution
        const notes = await Note.find({ userId }).select('tags');
        const bookmarks = await Bookmark.find({ userId }).select('tags');

        const tagMap = {};
        [...notes, ...bookmarks].forEach(item => {
            item.tags.forEach(tag => {
                tagMap[tag] = (tagMap[tag] || 0) + 1;
            });
        });

        const topTags = Object.entries(tagMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        // Activity timeline (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentNotes = await Note.aggregate([
            { $match: { userId, createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            summary: {
                totalNotes,
                totalBookmarks,
                favorites: favoriteNotes + favoriteBookmarks,
                archived: archivedNotes
            },
            topTags,
            activity: recentNotes.map(item => ({ date: item._id, count: item.count }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAnalytics };
