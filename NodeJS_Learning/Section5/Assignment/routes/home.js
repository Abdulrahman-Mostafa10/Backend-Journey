const path = require("path");

const rootDir = require("../util/root");

const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "views", "homePage.html"));
});

module.exports = router;
