import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
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
  avatar: { 
    type: String, 
    default: "/images/av1.jpg" 
  },
  quote: { 
    type: String, 
    default: "" 
  },
  fullname: { 
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
    type: Date, 
    default: Date.now() + 10000 
  },
});

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;
