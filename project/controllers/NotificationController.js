const loadNotifications = (req, res) => {

  const notifications = [
    {
      avatar: "/images/av1.jpg",
      username: "user1",
      time: "2 minutes ago",
      content: "Đây là thông báo 1"
    },
    {
      avatar: "/images/av1.jpg",
      username: "user1",
      time: "5 minutes ago",
      content: "Đây là thông báo 2"
    },
    {
      avatar: "/images/av1.jpg",
      username: "user1",
      time: "10 minutes ago",
      content: "Đây là thông báo 3"
    },
    {
      avatar: "/images/av1.jpg",
      username: "user1",
      time: "15 minutes ago",
      content: "Đây là thông báo 4"
    },
    {
      avatar: "/images/av1.jpg",
      username: "user1",
      time: "20 minutes ago",
      content: "Đây là thông báo 5"
    },
    {
      avatar: "/images/av1.jpg",
      username: "user1",
      time: "25 minutes ago",
      content: "Đây là David Gnộp"
    },
    {
      avatar: "/images/av1.jpg",
      username: "user1",
      time: "30 minutes ago",
      content: "Đây là thông báo 7"
    },
    {
      avatar: "/images/av1.jpg",
      username: "user1",
      time: "35 minutes ago",
      content: "Đây là thông báo 8"
    },
    {
      avatar: "/images/av1.jpg",
      username: "user1",
      time: "40 minutes ago",
      content: "Đây là thông báo 9"
    },
    {
      avatar: "/images/av1.jpg",
      username: "user1",
      time: "45 minutes ago",
      content: "Đây là thông báo 10"
    }
  ];
  res.render("Notification", { notifications: notifications });
}

const NotificationController = {
  loadNotifications: loadNotifications,
}

export default NotificationController;