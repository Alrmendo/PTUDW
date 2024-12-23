import NotificationModel from "../models/NotiModel.js";
import UserInfoModel from "../models/UserModel.js"; // Import your UserInfoModel

const loadNotifications = async(req, res) => {
    
    // const notifications = [
    //   {
    //     avatar: "/images/av1.jpg",
    //     username: "user1",
    //     time: "2 phút trước",
    //     content: "Đây là thông báo 1"
    //   },
    //   {
    //     avatar: "/images/av1.jpg",
    //     username: "user2",
    //     time: "5 phút trước",
    //     content: "Đây là thông báo 2"
    //   },
    //   {
    //     avatar: "/images/av1.jpg",
    //     username: "user3",
    //     time: "10 phút trước",
    //     content: "Đây là thông báo 3"
    //   },
    //   {
    //     avatar: "/images/av1.jpg",
    //     username: "user4",
    //     time: "15 phút trước",
    //     content: "Đây là thông báo 4"
    //   },
    //   {
    //     avatar: "/images/av1.jpg",
    //     username: "user5",
    //     time: "20 phút trước",
    //     content: "Đây là thông báo 5"
    //   },
    //   {
    //     avatar: "/images/av1.jpg",
    //     username: "user6",
    //     time: "25 phút trước",
    //     content: "Đây là thông báo 6"
    //   },
    //   {
    //     avatar: "/images/av1.jpg",
    //     username: "user7",
    //     time: "30 phút trước",
    //     content: "Đây là thông báo 7"
    //   },
    //   {
    //     avatar: "/images/av1.jpg",
    //     username: "user8",
    //     time: "35 phút trước",
    //     content: "Đây là thông báo 8"
    //   },
    //   {
    //     avatar: "/images/av1.jpg",
    //     username: "user0",
    //     time: "40 phút trước",
    //     content: "Đây là thông báo 9"
    //   },
    //   {
    //     avatar: "/images/av1.jpg",
    //     username: "user10",
    //     time: "45 phút trước",
    //     content: "Đây là thông báo 10"
    //   }
    // ];
    const firstUser = await UserInfoModel.findOne({});
    const notifications = await NotificationModel.findOne({ user_ID: firstUser._id });
    console.log(notifications);  

    res.render("noti", { notifications: notifications.notifications });
  }
  
  const NotificationController = {
      loadNotifications: loadNotifications,
  }
  
  export default NotificationController;