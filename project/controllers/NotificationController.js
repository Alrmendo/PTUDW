import NotificationModel from "../models/NotificationModel.js";
import jwt from 'jsonwebtoken';

const loadNotifications = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect('/login');
    return;
  }

  const decode = jwt.verify(token, "22127104_22127247");
  try {
    const noti = await NotificationModel.findOne({ user_Id: decode.user_Id });
    res.render("Notification", { notifications: noti ? noti.notifications : [] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const markAsRead = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect('/login');
    return;
  }
  const decode = jwt.verify(token, "22127104_22127247");
  try {
    const noti = await NotificationModel.findOne({ user_Id: decode.user_Id });
    if (!noti) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }
    const notification = noti.notifications.id(req.params.id);
    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
      return;
    }
    notification.isRead = true;
    await noti.save();
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

const addNotification = async (user_Id, content, noti_avatar, noti_username) => {
  try {
    const userNotification = await NotificationModel.findOne({ user_Id });
    console.log(user_Id, content, noti_avatar, noti_username)
    if (!userNotification) {
      const newNotification = new NotificationModel({
        user_Id,
        notifications: [
          {
            content: content,
          },
        ],
      });

      await newNotification.save();
    } else {
      userNotification.notifications.push({
        content: content,
        noti_avatar: noti_avatar,
        noti_username: noti_username,
      });
      await userNotification.save();
    }
  } catch (error) {
    console.log('Error adding notification:', error);
  }
}

const NotificationController = {
  loadNotifications: loadNotifications,
  markAsRead: markAsRead,
  addNotification: addNotification
}

export default NotificationController;