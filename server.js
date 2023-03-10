const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
var fs = require("fs");
var morgan = require("morgan");
var path = require("path");

// loading process variables declared in .env file
require("dotenv").config();

const app = express();
const httpServer = http.createServer(app);

// setup the logger
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/apis", require("./src/api/api.router"));
// app.use("/docs", require("./src/docs/docs.router"));
// app.use("/seeders", require("./src/seeders/seeder"));

//default route
app.use("/", (req, res, next) => {
  res.send("ulSpace is running...");
});

//if something wrong with the server
app.use((req, res, next) => {
  res.status(500).json({
    message: "Something went wrong",
  });
});

const port = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", (error) => {
  console.error.bind(console, `database: connection failed - ${error}`);
});
db.once("open", function callback() {
  console.log("database: connected");
  httpServer.listen(port, () => {
    console.log("ulSpace-api is now up and running...");
  });
});
