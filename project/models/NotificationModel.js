import mongoose from "mongoose";

const Notification = new mongoose.Schema({
    content: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    notiAvatar: { 
        type: String, 
        required: true, 
        default: "/images/thread.ico" 
    },
    notiName: { 
        type: String, 
        required: true, 
        default: "Admin" 
    },
});

const UserNotification = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Users',
    },
    notifications: { 
        type: [Notification], 
        default: [] 
    }
});

const NotificationModel = mongoose.model("Notifications", UserNotification);

export default NotificationModel;