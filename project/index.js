import express from "express";
import database from "./services/db.js";
import cookieParser from 'cookie-parser';
import cors from "cors";
import { engine as expressHbs } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import SearchRouter from "./routes/SearchRouter.js";
import FeedRouter from "./routes/FeedRouter.js";
import ProfileRouter from "./routes/ProfileRouter.js";
import NotiRouter from "./routes/NotificationRouter.js";
import ThreadRouter from "./routes/NewThreadRouter.js";
import AuthRouter from "./routes/AuthRouter.js";

database.connectDatabase();
const app = express();
const port = process.env.PORT || 3000;
const host = "localhost";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// Setting up Handlebars
app.engine(
  "hbs",
  expressHbs({
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
    extname: "hbs",
    defaultLayout: "layout",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
    helpers: {
      formatTime: function (dateString) {
        const now = new Date();
        const inputDate = new Date(dateString);
        const diff = Math.floor((now - inputDate) / 1000);

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
  }),

);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
}))
app.options('*', cors())
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", AuthRouter);
app.use("/", FeedRouter);
app.use("/search", SearchRouter);
app.use("/profile", ProfileRouter);
app.use("/noti", NotiRouter);
app.use("/newthread", ThreadRouter);

// Start the server
app.listen(port, () => {
  console.log(`Listening on http://${host}:${port}`);
});