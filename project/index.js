const express = require('express');
const app = express();
const expressHbs = require("express-handlebars");
const port = process.env.PORT | 3000;

//app.use(express.static(__dirname + "/html", {index: "index.html"}));
app.use(express.static('public'));
app.engine(
    "hbs",
    expressHbs.engine({
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials',
        extname: "hbs",
        defaultLayout: "layout",
    })
)

app.set("view engine", "hbs");

app.get("/", (req, res) => res.render("index", {title: "Threads"}));

app.get("/login", (req, res) => res.render("login", {layout: false}));
app.get("/resetPassword", (req, res) => res.render("resetPassword", {layout: false}));
app.get("/signup", (req, res) => res.render("signup", {layout: false}));
app.get("/noti", (req, res) => res.render("noti"));
app.get("/profile", (req, res) => res.render("profile"));
app.get("/search", (req, res) => res.render("search"));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
