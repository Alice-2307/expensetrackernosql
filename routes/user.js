const express = require("express");

const router = express.Router();

const userControllers = require("../controllers/user");

router.post("/signup", userControllers.postUser);

router.post("/login", userControllers.loginUser);

module.exports = router;