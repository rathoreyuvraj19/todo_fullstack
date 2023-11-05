import bodyParser from "body-parser";
import express from "express";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Todo",
  password: "12345",
  port: 5432,
});

db.connect();

let items = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM tasks ORDER BY id ASC");
  items = result.rows;
  // console.log(items);
  res.render("index.ejs", { items: items });
});

app.post("/add", async (req, res) => {
  // console.log(req.body.newTask);
  await db.query("INSERT INTO tasks (task) VALUES ($1)", [req.body.newTask]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  // console.log(req.body);
  await db.query("UPDATE tasks SET task=$1 WHERE id=$2", [
    req.body.edit,
    req.body.id,
  ]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  console.log(req.body);
  await db.query("DELETE FROM tasks WHERE id=$1", [req.body.taskIdreal]);
  res.redirect("/");
});

app.post("/done", async (req, res) => {
  const result = items.find((item) => item.id == req.body.taskIdreal);
  // console.log(req.body);
  await db.query("UPDATE tasks SET condition=$1 WHERE id=$2", [
    !result.condition,
    req.body.taskIdreal,
  ]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
