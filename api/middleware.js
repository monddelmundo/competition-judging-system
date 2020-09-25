const jwt = require("jsonwebtoken");
const fs = require("fs");
const { User } = require("./models/user.model");

require("dotenv").config();

const publicKey = fs.readFileSync("./public.key", "utf-8");

const withAuth = function (req, res, next) {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    jwt.verify(
      token,
      publicKey,
      {
        maxAge: "24h",
        algorithms: "RS256",
      },
      async function (err, decoded) {
        if (err) {
          res.status(401).send("Unauthorized: Invalid token");
        } else {
          //const user  = await User.findOne({ 'username': decoded.username });

          //if(!user) throw new Error()

          // req.username = decoded.username;
          // req.role = decoded.role;
          next();
        }
      }
    );
  }
};

module.exports = withAuth;
