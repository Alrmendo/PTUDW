import NotificationModel from "../models/NotificationModel.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "22127104_22127247";

const verifyToken = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        res.redirect("/login");
        return null;
    }
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        res.redirect("/login");
        return null;
    }
};

const loadNotifications = async (req, res) => {
    const decode = verifyToken(req, res);
    if (!decode) return;

    try {
        const noti = await NotificationModel.findOne({ userId: decode.userId }).lean();
        res.render("Notification", { notifications: noti?.notifications || [] });
    } catch (error) {
        console.error("Error loading notifications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const addNotification = async (userId, content, notiAvatar, notiName) => {
    try {
        const userNotification = await NotificationModel.findOne({ userId });
        if (!userNotification) {
            const newNotification = new NotificationModel({
                userId,
                notifications: [
                    {
                        content,
                        notiAvatar,
                        notiName,
                    },
                ],
            });
            await newNotification.save();
        } else {
            userNotification.notifications.push({
                content,
                notiAvatar,
                notiName,
            });
            await userNotification.save();
        }
    } catch (error) {
        console.error("Error adding notification:", error);
    }
};

const NotificationController = {
    loadNotifications,
    addNotification,
};

export default NotificationController;
