const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

//const { ApolloServer, gql } = require('apollo-server-express');
//require('./indexTest');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const secret = process.env.SECRET;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(secret));
// app.use(
//   cors({
//     credentials: true,
//     origin: "http://localhost:3000",
//   })
// );

const allowedDomains = [
  "http://devcoral.com",
  "https://devcoral.com",
  "http://cjs.devcoral.com",
  "https://cjs.devcoral.com",
  "http://cjs-stg.devcoral.com",
  "https://cjs-stg.devcoral.com",
  "http://localhost:3000",
];
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // bypass the requests with no origin (like curl requests, mobile apps, etc )
      if (!origin) return callback(null, true);

      if (allowedDomains.indexOf(origin) === -1) {
        const msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const usersRouter = require("./routes/users");
const eventRouter = require("./routes/events");
const competitionRouter = require("./routes/competitions");
const judgeRouter = require("./routes/judges");
const churchRouter = require("./routes/churches");
const apiRouter = require("./routes/api");

app.use("/users", usersRouter);
app.use("/events", eventRouter);
app.use("/competitions", competitionRouter);
app.use("/judges", judgeRouter);
app.use("/churches", churchRouter);
app.use("/api", apiRouter);

app.listen(port, () => console.log(`Server is running on port: ${port}`));
