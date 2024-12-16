import express from "express";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const host = "localhost";

// Cài đặt handlebars
const hbs = expressHandlebars.create({
  layoutsDir: path.join(__dirname, "/views/layouts"),
  partialsDir: path.join(__dirname, "/views/partials"),
  extname: "hbs",
  defaultLayout: "layout",
  helpers: {}
    
});


app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");


app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


app.listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`);
});
