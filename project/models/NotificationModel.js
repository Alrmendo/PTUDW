import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    noti_avatar: {
        type: String,
        required: true,
        default: "/images/av1.jpg"
    },
    noti_username: {
        type: String,
        required: true,
        default: "user1"
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const UserNotificationSchema = new mongoose.Schema({
    user_Id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    notifications: {
        type: [NotificationSchema],
        default: []
    }
});

const NotificationModel = mongoose.model("Notifications", UserNotificationSchema);

export default NotificationModel;