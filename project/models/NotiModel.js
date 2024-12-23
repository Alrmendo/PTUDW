import mongoose from "mongoose";

const UserNotificationSchema = new mongoose.Schema({
    noti_avatar: {
        type: String,
        default: "/images/av1.jpg"
    },
    noti_name: {
        type: String,
        default: "User"
    },
    date: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
});

//Main Schema
const UserNotificationMainSchema = new mongoose.Schema({
    user_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    notifications: {
        type: [UserNotificationSchema],
        default: []
    },
});

const NotificationModel = mongoose.model("Notification", UserNotificationMainSchema);

export default NotificationModel;
