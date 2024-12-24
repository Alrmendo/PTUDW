import express from "express";
import database from "./services/db.js";
import cors from "cors";
import expressHandlebars from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import SearchRouter from "./routes/SearchRouter.js";
import FeedRouter from "./routes/FeedRouter.js";
import ProfileRouter from "./routes/ProfileRouter.js";
import NotiRouter from "./routes/NotiRouter.js";
import ThreadRouter from "./routes/ThreadRouter.js";

database.connectDatabase();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = "localhost";

// Cài đặt handlebars
const hbs = expressHandlebars.create({
  layoutsDir: path.join(__dirname, "/views/layouts"),
  partialsDir: path.join(__dirname, "/views/partials"),
  extname: "hbs",
  defaultLayout: "layout",
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
    formatTime: function (dateString) {
      const now = new Date();
      const inputDate = new Date(dateString);
      const diff = Math.floor((now - inputDate) / 1000); // Khoảng thời gian tính bằng giây

      if (diff < 60) {
        return `${diff} giây`;
      } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        return `${minutes} phút`;
      } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `${hours} giờ`;
      } else if (diff < 2592000) {
        const days = Math.floor(diff / 86400);
        return `${days} ngày`;
      } else if (diff < 31536000) {
        const months = Math.floor(diff / 2592000);
        return `${months} tháng`;
      } else {
        const years = Math.floor(diff / 31536000);
        return `${years} năm`;
      }
    },
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
}
});


app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST'],
  credentials: true
}));
app.options('*', cors());

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");


app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", FeedRouter);
app.use("/search", SearchRouter);
app.use("/profile", ProfileRouter);
app.use("/notification", NotiRouter);
app.use("/newthread", ThreadRouter);

app.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});

