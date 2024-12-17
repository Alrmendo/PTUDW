import mongoose from "mongoose";

const UserInfoSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    avatar: { 
        type: String, 
        default: "/images/av1.jpg" 
    },
    fullname: { 
        type: String, 
        default: "" 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    verificationToken: { 
        type: String, 
        default: null 
    },
    verificationExpires: { 
        type: Date, 
        default: () => Date.now() + 300000
    },
});

const UserInfoModel = mongoose.model("Users", UserInfoSchema);

export default UserInfoModel;
