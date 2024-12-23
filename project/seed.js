import mongoose from 'mongoose';
import ThreadModel from './models/ThreadModel.js';
import UserInfoModel from './models/UserModel.js';
import UserFollowModel from './models/FollowModel.js';
import NotificationModel from './models/NotiModel.js';

import database from './services/db.js';
const seedDatabase = async () => {
  try {
    // Connect to database
    await database.connectDatabase();

    // Clear existing data
    // await UserInfoModel.deleteMany({});
    // await ThreadModel.deleteMany({});

    // console.log("Cleared existing data.");

    // const users = await UserInfoModel.insertMany([
    //   {
    //     username: "john_doe",
    //     email: "john.doe@example.com",
    //     password: "password1234567",
    //     fullname: "John Doe",
    //     isVerified: true,
    //   },
    //   {
    //     username: "jane_smith",
    //     email: "jane.smith@example.com",
    //     password: "password1234567",
    //     fullname: "Jane Smith",
    //   },
    // ]);


    // // Create example threads
    // await ThreadModel.insertMany([
    //     {
    //       author: users[0].username,
    //       author_ID: users[0]._id,
    //       content: "This is a sample thread by John Doe.",
    //       image: "/images/thread1.jpg",
    //       comments: [
    //         {
    //           comment: "Great post!",
    //           comment_ID: new mongoose.Types.ObjectId(),
    //         },
    //       ],
    //       likes: [
    //         {
    //           user_ID: new mongoose.Types.ObjectId(),
    //         },
    //       ],
    //     },
    //     {
    //       author: users[1].username,
    //       author_ID: users[1]._id,
    //       content: "Another example thread by Jane Smith.",
    //       comments: [],
    //       likes: [],
    //     },
    //   ]);
    
    // const user1 = await UserInfoModel.findOne({ username: "john_doe" });
    // const user2 = await UserInfoModel.findOne({ username: "jane_smith" });

    // if (user1 && user2) {
    //   await UserFollowModel.create({
    //     userId: user1._id,
    //     followings: [{
    //         userId: user2._id,
    //         username: user2.username,
    //         avatar: user2.avatar || "/images/av1.jpg"
    //     }],
    //     followers: []
    //   });
      
    //   await UserFollowModel.create({
    //     userId: user2._id,
    //     followings: [],
    //     followers: [{
    //         userId: user1._id,
    //         username: user1.username,
    //         avatar: user1.avatar || "/images/av1.jpg"
    //     }]
    //   });

    //   console.log("Seed data created!");
    // } else {
    //     console.error("Users not found for seeding.");
    // }
    const user1 = await UserInfoModel.findOne({ username: "john_doe" });
    const user2 = await UserInfoModel.findOne({ username: "jane_smith" });
    await NotificationModel.insertMany( [
      {
        user_ID: user1._id, // Example: user1
        notifications: [
          {
            noti_avatar: "/images/av1.jpg",
            noti_name: "John Doe",
            content: "You have a new message.",
            isRead: false,
          },
          {
            noti_avatar: "/images/av2.jpg",
            noti_name: "Jane Smith",
            content: "Your post was liked.",
            isRead: true,
          },
          {
            noti_avatar: "/images/av2.jpg",
            noti_name: "Jane Smith",
            content: "hi.",
            isRead: true,
          }
        ]
      },
      {
        user_ID: user2._id, // Example: user2
        notifications: [
          {
            noti_avatar: "/images/av1.jpg",
            noti_name: "Alice Johnson",
            content: "Someone followed you.",
            isRead: false,
          }
        ]
      }
    ]);
    console.log("Database seeding completed.");
    process.exit(0); // Exit the script
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase().then(() => {
    mongoose.connection.close();
});