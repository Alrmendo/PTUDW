import NotificationModel from "../models/NotiModel.js";
import jwt from 'jsonwebtoken';

const loadNotifications = async(req, res) => {
    const token = req.cookies.token;
    if(!token) {
        return res.redirect("/login")
    };
    const decode = jwt.verify (
        token,
        "c8763fb94e2a4dc88263f70de16d72c34ff8f3f88f59bcefc9f3e05e3c3c0a7a9d8ab67d5e4131dc681f6bca7b6eb8c9213d2ffbd4cbf28a40a37d3ea7f6b05b"
    );
    try {
        const noti = await NotificationModel.findOne({ user_Id: decode.user_Id }).lean();
        noti.notifications.reverse();
        res.render("noti", { notifications: noti ? noti.notifications : [] });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const addNotification = async (user_Id, content, noti_avatar, noti_name, link) => {
    try {
        const userNotification = await NotificationModel.findOne({ user_Id });
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
                noti_name: noti_name,
                linkThread: link,
            });
            await userNotification.save();
        }
    } catch (error) {
        console.log('Error adding notification:', error);
    }
}

const NotificationController = {
    loadNotifications: loadNotifications,
    addNotification: addNotification
}

export default NotificationController;