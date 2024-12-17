import mongoose from "mongoose";

const user_db = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    avatar: { type: String, default: "/images/av1.jpg" },
    fullname: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    verificationExpires: { 
        type: Date, 
        default: () => Date.now() + 300000
    },
});

const UserModel = mongoose.model("User", user_db);

export default UserModel;
