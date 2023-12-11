const { User } = require("../model");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authenticationHeader = req.headers.authorization;

  if (!authenticationHeader || !authenticationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid Authentication" });
  }

  const token = authenticationHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    console.log("payload", payload);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid Authentication" });
  }
};

module.exports = auth;
