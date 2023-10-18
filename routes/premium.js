const express = require("express");

const premiumControllers = require("../controllers/premium");

const userAuthentication = require("../middlewares/auth").authentication;

const router = express.Router();

router.get("/showleaderboard",userAuthentication, premiumControllers.showLeaderboard);

router.get("/download", userAuthentication, premiumControllers.downloadFile)

router.get("/downloadoldfiles", userAuthentication, premiumControllers.downloadOldFile)

module.exports = router;