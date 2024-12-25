import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    content: { 
        type: String, 
        required: true },
    date: { 
        type: Date, 
        default: Date.now 
    },
});

const UserNotificationSchema = new mongoose.Schema({
    user: { 
        type: String, 
        required: true 
    },
    notifications: { 
        type: [NotificationSchema], 
        default: [] 
    }
});

const NotificationModel = mongoose.model("Notifications", UserNotificationSchema);

export default NotificationModel;