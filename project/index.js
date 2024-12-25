import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import database from "./services/db.js";
import FeedRouter from "./routes/FeedRouter.js";
import SearchRouter from "./routes/SearchRouter.js";
import AuthenticationRouter from "./routes/AuthRouter.js";
import ProfileRouter from "./routes/ProfileRouter.js";
import NotificationRouter from "./routes/NotificationRouter.js";
import NewThreadRouter from "./routes/NewThreadRouter.js";
import expressHandlebars from "express-handlebars";

database.connectDatabase();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "localhost";

// Cài đặt handlebars
const hbs = expressHandlebars.create({
  layoutsDir: path.join(__dirname, "/views/layouts"),
  partialsDir: path.join(__dirname, "/views/partials"),
  extname: "hbs",
  defaultLayout: "layout",
  helpers: {
    eq: (a, b) => a === b,
    formatTime: (dateString) => {
      const now = new Date();
      const inputDate = new Date(dateString);
      const diff = Math.floor((now - inputDate) / 1000);

      if (diff < 60) return `${diff} giây`;
      if (diff < 3600) return `${Math.floor(diff / 60)} phút`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} giờ`;
      if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày`;
      if (diff < 31536000) return `${Math.floor(diff / 2592000)} tháng`;
      return `${Math.floor(diff / 31536000)} năm`;
    },
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

// Middleware
app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));
app.options("*", cors());
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", FeedRouter);
app.use("/search", SearchRouter);
app.use("/", AuthenticationRouter);
app.use("/profile", ProfileRouter);
app.use("/notification", NotificationRouter);
app.use("/newthread", NewThreadRouter);

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
