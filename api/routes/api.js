const express = require("express");
const withAuth = require("../middleware");
let { User } = require("../models/user.model");
let { Judge } = require("../models/judge.model");
const router = require("express").Router();
const fs = require("fs");

const app = express();

const secret = process.env.SECRET;
const jwt = require("jsonwebtoken");

const privateKey = fs.readFileSync("./private.key", "utf-8");

router.route("/authenticate").post((req, res) => {
  const { username, password, ipAddress, browser } = req.body;
  User.findOne({ username }, function (err, user) {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal error please try again",
      });
    } else if (!user) {
      res.status(401).json({
        error: "Incorrect username or password",
      });
    } else {
      user.isCorrectPassword(password, function (err, same) {
        if (err) {
          res.status(500).json({
            error: "Internal error please try again",
          });
        } else if (!same) {
          res.status(401).json({
            error: "Incorrect username or password",
          });
        } else {
          // Issue token
          const role = user.role;
          const payload = { username, role, ipAddress, browser };
          const token = jwt.sign(payload, privateKey, {
            expiresIn: "5h",
            algorithm: "RS256",
          });
          res
            .cookie("token", token, {
              httpOnly: false,
              sameSite: "none",
              secure: true,
            })
            .send(token);
        }
      });
    }
  });
});

router.route("/authenticateJudge").post((req, res) => {
  const { username, password, ipAddress, browser } = req.body;
  Judge.findOne({ lastName: new RegExp(`^${username}$`, "i") }, function (
    err,
    judge
  ) {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal error please try again",
      });
    } else if (!judge) {
      res.status(401).json({
        error: "Incorrect last name",
      });
    } else {
      if (judge.accessCode.toLowerCase() !== password.toLowerCase()) {
        res.status(401).json({
          error: "Incorrect access code",
        });
        return;
      }
      // Issue token
      const id = judge._id;
      const payload = {
        username,
        firstName: judge.firstName,
        password,
        id,
        ipAddress,
        browser,
      };
      const token = jwt.sign(payload, privateKey, {
        expiresIn: "24h",
        algorithm: "RS256",
      });
      res.cookie("token", token, { httpOnly: true }).send(token);
    }
  });
});

router.get("/secret", withAuth, function (req, res) {
  res.send("The password is potato");
});

router.get("/checkToken", withAuth, function (req, res) {
  res.sendStatus(200);
});

module.exports = router;
