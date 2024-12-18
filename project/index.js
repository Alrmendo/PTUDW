import express from "express";
import database from "./services/db.js";
import cors from "cors";
import { engine as expressHbs } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import SearchRouter from "./routes/SearchRouter.js";
import FeedRouter from "./routes/FeedRouter.js";
import ProfileRouter from "./routes/ProfileRouter.js";
import NotiRouter from "./routes/NotiRouter.js";
import ThreadRouter from "./routes/ThreadRouter.js";

database.connectDatabase();
const app = express();
const port = process.env.PORT || 3000;
const host = "localhost";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

// Setting up Handlebars
app.engine(
    "hbs",
    expressHbs({
        layoutsDir: path.join(__dirname, "views", "layouts"),
        partialsDir: path.join(__dirname, "views", "partials"),
        extname: "hbs",
        defaultLayout: "layout",
    })
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

app.use("/", FeedRouter);
app.use("/search", SearchRouter);
app.use("/profile", ProfileRouter);
app.use("/notification", NotiRouter);
app.use("/newthread", ThreadRouter);

// Start the server
app.listen(port, () => {
    console.log(`Listening on http://${host}:${port}`);
});
