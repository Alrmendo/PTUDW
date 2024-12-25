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
    const noti = await NotificationModel.findOne({ user_Id: decode.user_Id });
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
    const noti = await NotificationModel.findOne({ user_Id: decode.user_Id });
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

const addNotification = async (user_Id, content, noti_avatar, noti_username) => {
  try {
    const userNotification = await NotificationModel.findOne({ user_Id });

    if (!userNotification) {
      const newNotification = new NotificationModel({
        user_Id,
        notifications: [{ content, noti_avatar, noti_username }],
      });
      await newNotification.save();
    } else {
      userNotification.notifications.push({ content, noti_avatar, noti_username });
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
