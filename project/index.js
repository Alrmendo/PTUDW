import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import databaseService from "./database/db.js";
import feedRoutes from "./routes/FeedRouter.js";
import searchRoutes from "./routes/SearchRouter.js";
import authRoutes from "./routes/AuthRouter.js";
import profileRoutes from "./routes/ProfileRouter.js";
import notificationRoutes from "./routes/NotificationRouter.js";
import threadRoutes from "./routes/NewThreadRouter.js";
import handlebars from "express-handlebars";

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = path.dirname(currentFilename);

const app = express();
databaseService.connectDatabase();

const SERVER_PORT = process.env.PORT || 3000;
const SERVER_HOST = process.env.HOST || "localhost";

// Configure Handlebars
const hbsConfig = handlebars.create({
  layoutsDir: path.join(currentDirname, "/views/layouts"),
  partialsDir: path.join(currentDirname, "/views/partials"),
  extname: "hbs",
  defaultLayout: "layout",
  helpers: {
    eq: (a, b) => a === b,
    formatTime: (dateString) => {
      const now = new Date();
      const inputDate = new Date(dateString);
      const diff = Math.floor((now - inputDate) / 1000);

      const pluralize = (value, unit) => `${value} ${unit}${value > 1 ? "s" : ""}`;

      if (diff < 60) return pluralize(diff, "second");
      if (diff < 3600) return pluralize(Math.floor(diff / 60), "minute");
      if (diff < 86400) return pluralize(Math.floor(diff / 3600), "hour");
      if (diff < 2592000) return pluralize(Math.floor(diff / 86400), "day");
      if (diff < 31536000) return pluralize(Math.floor(diff / 2592000), "month");
      return pluralize(Math.floor(diff / 31536000), "year");
    },
    formatFollows: (numFollows) => {
      if (typeof numFollows !== "number") return numFollows;

      if (numFollows >= 1000000) return `${(numFollows / 1000000).toFixed(1)}M`;
      if (numFollows >= 10000) return `${(numFollows / 1000).toFixed(1)}K`;
      if (numFollows >= 1000) return numFollows.toLocaleString("de-DE");
      return numFollows.toString();
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(currentDirname, "public")));
app.use(cookieParser());

// Set up Handlebars
app.engine("hbs", hbsConfig.engine);
app.set("view engine", "hbs");

// Routes
app.use("/", feedRoutes);
app.use("/search", searchRoutes);
app.use("/", authRoutes);
app.use("/profile", profileRoutes);
app.use("/notification", notificationRoutes);
app.use("/newthread", threadRoutes);

// Start server
app.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Server is running at http://${SERVER_HOST}:${SERVER_PORT}`);
});
