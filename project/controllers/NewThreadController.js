import database from '../services/db.js';
import threadModel from '../models/ThreadModel.js';
import multer from 'multer';

const upload = multer({ dest: 'test/' });

const newThread = (req, res) => {
    res.render("New");
}

const uploadThread = async (req, res) => {
    try {
        upload.single('file')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: 'File upload error', success: false });
            }

            const { username, content } = req.body;
            if (!username || !content) {
                return res.status(400).json({ error: 'Username and content are required', success: false });
            }

            let imageUrl = "";

            if (req.file) {
                const filePath = req.file.path;

                try {
                    const result = await database.cloudinary.uploader.upload(filePath);
                    imageUrl = result.secure_url;
                } catch (uploadErr) {
                    console.error('Error uploading to Cloudinary:', uploadErr);
                    return res.status(500).json({ error: 'Failed to upload image', success: false });
                }
            }

            const newThread = new threadModel({
                author: username,
                content: content,
                image: imageUrl
            });

            try {
                const savedThread = await newThread.save();
                res.status(201).json({ message: 'Thread created successfully', success: true });
            } catch (saveErr) {
                console.error('Error saving thread:', saveErr);
                res.status(500).json({ error: 'Failed to save thread', success: false });
            }
        });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ error: err.message, success: false });
    }
};

const NewThreadController = {
    newThread: newThread,
    uploadThread: uploadThread
}

export default NewThreadController;