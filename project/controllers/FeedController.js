import threadModel from '../models/ThreadModel.js';

const loadAllFeed = async (req, res) => {
    try {
        const threads = await threadModel.find({}).populate({
            path: "author",
            model: "Users",
            localField: "author",
            foreignField: "username",
            select: "username avatar",
        });
        console.log(threads);
        res.render('Feed', { threads: threads });
    } catch (error) {
        console.error('Error fetching threads:', error);
        res.status(500).json({ message: 'An error occurred while loading the feed' });
    }
};

const likeThread = (req, res) => {
    const { userid, threadid } = req.body;
    console.log(`User ${userid} liked thread ${threadid}`);
    res.status(200).json({ message: 'Success recieved like data' });;
}

const FeedController = {
    loadAllFeed: loadAllFeed,
    likeThread: likeThread,
};

export default FeedController;