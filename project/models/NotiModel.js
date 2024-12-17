import mongoose from "mongoose";

const sub_noti = new mongoose.Schema({
    noti_avatar: { type: String, default: "/images/av1.jpg" },
    noti_name: { type: String, default: "User" },
    date: { type: Date, default: Date.now },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
});

// Main schema for user notifications
const user_noti = new mongoose.Schema({
    user_ID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    noti: { type: [sub_noti], default: [] },
});

const NotificationModel = mongoose.model("Notification", user_noti);

export default NotificationModel;
