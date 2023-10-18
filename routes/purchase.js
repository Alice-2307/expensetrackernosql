const express = require("express");

const userAuthenticate = require("../middlewares/auth").authentication;

const purchaseController = require("../controllers/purchase");

const router = express.Router();

router.get("", userAuthenticate, purchaseController.purchasePremium)

router.post("", userAuthenticate, purchaseController.updateTransaction)

module.exports = router;
