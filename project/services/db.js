import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'diw0acowj',
    secure: true,
    api_key: "886573185242367",
    api_secret: "Msf0xkATAMQBwGsjWNhkBIVnR38",
});

async function connectDatabase() {
    try {
        await mongoose.connect('mongodb+srv://ntriet1606:UrWHHQNsLVnsJQCP@thread.vvdpu.mongodb.net/');
        console.log('Connect database success');
    } catch (error) {  
        console.log('Connect database fail: ', error);
    }
}

export default { connectDatabase, cloudinary };