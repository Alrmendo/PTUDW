import mongoose from "mongoose";

const User = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    fullname: { 
        type: String, 
        default: "" 
    },
    avatar: { 
        type: String, 
        default: "/images/av1.jpg" 
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
    quote: { 
        type: String, 
        default: "" 
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
        type: Date, default: 
        Date.now() + 1000 
    },
});

const UserModel = mongoose.model("Users", User);

export default UserModel;
