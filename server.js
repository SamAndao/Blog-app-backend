const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

const { requestLog } = require("./middleware/logger");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(requestLog);
app.use(
  cors({
    credentials: true,
    origin: ["https://blogit-pc7h.onrender.com", "http://localhost:3000"],
  })
);

app.use(cookieParser());
app.use("^/$", require("./routes/rootRoute"));
app.use("/login", require("./routes/loginRoute"));
app.use("/register", require("./routes/registerRoute"));
app.use("/refresh", require("./routes/refreshRoute"));
app.use("/logout", require("./routes/logoutRoute"));

app.use("/posts", require("./routes/postsRoute"));
app.use("/user", require("./routes/usersRoute"));

app.all("*", (req, res) => {
  res.status(409);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "files", "error.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 File not found" });
  } else {
    res.type("txt").send("404 File not found");
  }
});

app.listen(PORT, async () => {
  console.log("Server started on " + PORT);
  await mongoose.connect(process.env.DATABASE_URI);
  console.log("connected to mongoDb");
});
