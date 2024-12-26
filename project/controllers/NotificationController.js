import NotificationModel from "../models/NotificationModel.js";
import jwt from 'jsonwebtoken';

const SECRET_KEY = "22127104_22127247";

const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
};

const loadNotifications = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }

  const decode = verifyToken(token);
  if (!decode) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const noti = await NotificationModel.findOne({ userId: decode.userId });
    res.render("notification", { notifications: noti?.notifications || [] });
  } catch (error) {
    console.error('Error loading notifications:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const markAsRead = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }

  const decode = verifyToken(token);
  if (!decode) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const noti = await NotificationModel.findOne({ userId: decode.userId });
    if (!noti) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const notification = noti.notifications.id(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await noti.save();
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addNotification = async (userId, content, notiAvatar, notiUsername) => {
  try {
    const userNotification = await NotificationModel.findOne({ userId });

    if (!userNotification) {
      const newNotification = new NotificationModel({
        userId,
        notifications: [{ content, notiAvatar, notiUsername }],
      });
      await newNotification.save();
    } else {
      userNotification.notifications.push({ content, notiAvatar, notiUsername });
      await userNotification.save();
    }
  } catch (error) {
    console.error('Error adding notification:', error);
  }
};

const NotificationController = {
  loadNotifications,
  markAsRead,
  addNotification,
};

export default NotificationController;
