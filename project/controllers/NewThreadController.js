import database from '../database/db.js';
import ThreadModel from '../models/ThreadModel.js';
import UserModel from '../models/UserModel.js';
import multer from 'multer';
import jwt from "jsonwebtoken";

const upload = multer({ dest: 'temp/' });
const JWT_SECRET = "22127104_22127247"; 

const newThread = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  try {
    const decode = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(decode.userId).lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    res.render("CreateThread", {
      username: user.username,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const uploadThread = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  try {
    const decode = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(decode.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    upload.single('file')(req, res, async (err) => {
      if (err) return res.status(400).json({ error: "File upload error" });

      const { content } = req.body;
      let imageUrl = "";

      if (req.file) {
        try {
          const result = await database.cloudinary.uploader.upload(req.file.path);
          imageUrl = result.secure_url;
        } catch (uploadErr) {
          console.error("Cloudinary upload error:", uploadErr);
          return res.status(500).json({ error: "Failed to upload image" });
        }
      }

      const thread = new ThreadModel({
        authorId: user._id,
        author: user.username,
        content,
        image: imageUrl,
      });

      try {
        await thread.save();
        res.status(201).json({ message: "Thread created successfully" });
      } catch (saveErr) {
        console.error("Error saving thread:", saveErr);
        res.status(500).json({ error: "Failed to save thread" });
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const NewThreadController = {
  newThread,
  uploadThread,
};

export default NewThreadController;
