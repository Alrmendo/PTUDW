import express from "express";
import database from "./services/db.js";
import { engine as expressHbs } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

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

app.set("view engine", "hbs");

// Routes
app.get("/", (req, res) => res.render("index", { title: "Threads" }));
app.get("/login", (req, res) => res.render("login", { layout: false }));
app.get("/resetPassword", (req, res) => res.render("resetPassword", { layout: false }));
app.get("/signup", (req, res) => res.render("signup", { layout: false }));
app.get("/noti", (req, res) => res.render("noti"));
app.get("/profile", (req, res) => res.render("profile"));
app.get("/search", (req, res) => res.render("search"));

// Start the server
app.listen(port, () => {
    console.log(`Listening on http://${host}:${port}`);
});
